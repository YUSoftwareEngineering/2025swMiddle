/*
   Project: MonthlyCalendarDto.java
   Author: 윤나영
  Date of creation: 2025.11.27
  Date of last update: 2025.11.27
*/

package com.example.SWEnginnering2025.controller;
import com.example.SWEnginnering2025.dto.*;
import com.example.SWEnginnering2025.exception.profile.*;
import com.example.SWEnginnering2025.service.ProfileLogic;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
// 프로필 관련 API 요청을 처리하는 컨트롤러 클래스.
@RestController
@RequestMapping("/api/v1/profile")

public class ProfileController {
    private final ProfileLogic profileLogic;

    public ProfileController(ProfileLogic profileLogic) {
        this.profileLogic = profileLogic;
    }

    /*
     * GET /api/profile/me?userId=1
     */
    //1. 내 프로필 조회
    @GetMapping("/me")
    public ResponseEntity<ProfileData> getMyProfile(@RequestParam("userId") Long userId) {
        ProfileData data = profileLogic.getMyProfile(userId);
        return ResponseEntity.ok(data);
    }

    /**
     2. 내 프로필 전체 업데이트
     * PUT /api/profile/me?userId=1
     * body: ProfileUpdate JSON
     */
    @PutMapping("/update")
    public ResponseEntity<?> updateMyProfile(@RequestParam("userId") Long userId,
                                             @RequestBody ProfileUpdate update) {
        try {
            profileLogic.updateProfile(userId, update);
            return ResponseEntity.ok().build();
        } catch (NoProfileChangesException e) {
            ProfileErrorResponse error =
                    new ProfileErrorResponse("NO_CHANGES", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        } catch (InvalidProfileDataException e) {
            ProfileErrorResponse error =
                    new ProfileErrorResponse("INVALID_DATA", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    /**
     * 3. 프로필 공개 여부만 수정
     * PATCH /api/profile/me/privacy?userId=1
     */
    @PatchMapping("/me/privacy")
    public ResponseEntity<?> updatePrivacy(@RequestParam("userId") Long userId,
                                           @RequestBody PrivacyData privacyData) {
        try {
            boolean changed = profileLogic.updatePrivacySettings(userId, privacyData);
            if (!changed) {
                ProfileErrorResponse error =
                        new ProfileErrorResponse("NO_CHANGES", "����� ������ �����ϴ�.");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
            }
            return ResponseEntity.ok().build();
        } catch (InvalidProfileDataException e) {
            ProfileErrorResponse error =
                    new ProfileErrorResponse("INVALID_DATA", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    /**
     * 4. 다른 사용자의 공개 프로필 조회
     * GET /api/profile/public/{targetUserId}
     */
    @GetMapping("/public/{targetUserId}")
    public ResponseEntity<?> getPublicProfile(@PathVariable("targetUserId") Long targetUserId) {
        try {
            ProfileSummary summary = profileLogic.getPublicProfile(targetUserId);
            return ResponseEntity.ok(summary);
        } catch (ProfilePrivateException e) {
            ProfileErrorResponse error =
                    new ProfileErrorResponse("PROFILE_PRIVATE", e.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(error);
        } catch (ProfileNotFoundException e) {
            ProfileErrorResponse error =
                    new ProfileErrorResponse("PROFILE_NOT_FOUND", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }

    // 5. 공통(RuntimeException) 예외 처리
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ProfileErrorResponse> handleRuntime(RuntimeException e) {
        ProfileErrorResponse error =
                new ProfileErrorResponse("SERVER_ERROR", e.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }
}

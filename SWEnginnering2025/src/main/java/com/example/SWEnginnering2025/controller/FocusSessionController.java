/*
    Project: FocusSessionController.java
    Author: YHW
    Date of creation: 2025.11.23
    Date of last update: 2025.11.30
*/

package com.example.SWEnginnering2025.controller;

import com.example.SWEnginnering2025.dto.FocusSessionResponse;
import com.example.SWEnginnering2025.dto.FocusSessionStartRequest;
import com.example.SWEnginnering2025.service.FocusSessionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/focus")

public class FocusSessionController {

    private final FocusSessionService focusSessionService;

    public FocusSessionController(FocusSessionService focusSessionService) {
        this.focusSessionService = focusSessionService;
    }

    // 완료된 포커스세션 목록 반환
    @GetMapping
    public ResponseEntity<List<FocusSessionResponse>> listSessions(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        // userId를 추출하여 서비스로 전달
        Long userId = getUserIdFromUserDetails(userDetails);
        List<FocusSessionResponse> sessions = focusSessionService.listCompletedSessions(userId);
        return ResponseEntity.ok(sessions);
    }

    // 포커스 세션 시작
    @PostMapping("/start")
    public ResponseEntity<FocusSessionResponse> startSession(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody FocusSessionStartRequest request
    ) {
        // userId를 추출하여 서비스로 전달
        Long userId = getUserIdFromUserDetails(userDetails);
        FocusSessionResponse response = focusSessionService.startSession(userId, request);
        return ResponseEntity.ok(response);
    }

    // 일시 정지 및 화면 전환 시
    @PostMapping("/{sessionId}/pause")
    public ResponseEntity<FocusSessionResponse> pauseSession(@PathVariable Long sessionId) {
        FocusSessionResponse response = focusSessionService.pauseSession(sessionId);
        return ResponseEntity.ok(response);
    }

    // resume
    @PostMapping("/{sessionId}/resume")
    public ResponseEntity<FocusSessionResponse> resumeSession(@PathVariable Long sessionId) {
        FocusSessionResponse response = focusSessionService.resumeSession(sessionId);
        return ResponseEntity.ok(response);
    }

    // 포커스 세션 완료
    @PostMapping("/{sessionId}/complete")
    public ResponseEntity<FocusSessionResponse> completeSession(@PathVariable Long sessionId) {
        FocusSessionResponse response = focusSessionService.completeSession(sessionId);
        return ResponseEntity.ok(response);
    }

    private Long getUserIdFromUserDetails(UserDetails userDetails) {
        if (userDetails == null) {
            // 인증 정보가 없는 경우 예외 처리
            throw new IllegalArgumentException("인증 정보가 유효하지 않습니다. 로그인 후 이용해주세요.");
        }
        try {
            // UserDetails의 username 필드는 보통 Long ID를 String으로 변환한 값을 가집니다.
            return Long.valueOf(userDetails.getUsername());
        } catch (NumberFormatException e) {
            throw new RuntimeException("사용자 인증 정보에서 유효한 ID를 추출할 수 없습니다.", e);
        }
    }
}
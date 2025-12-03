/*Project: AttachmentController.java
        Author: 이채민, 한지윤
        Date of creation: 2025.11.22
        Date of last update: 2025.11.24
                */

package com.example.SWEnginnering2025.controller;

import com.example.SWEnginnering2025.model.AchievementColor;
import com.example.SWEnginnering2025.dto.CreateGoalRequest;
import com.example.SWEnginnering2025.dto.GoalBulkUpdateRequest;
import com.example.SWEnginnering2025.dto.GoalResponse;
import com.example.SWEnginnering2025.dto.GoalStatusRequest;
import com.example.SWEnginnering2025.service.GoalService;
import com.example.SWEnginnering2025.util.JwtTokenProvider;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;


@RestController // "나는 컨트롤러야, JSON으로 대답할게"
@RequestMapping("/api/v1/goals") // "주소는 이걸로 시작해"
@RequiredArgsConstructor
public class GoalController {

    private final GoalService goalService;
    private final JwtTokenProvider jwtTokenProvider;
    // 1. 목표 생성 (POST)
    @PostMapping
    public ResponseEntity<GoalResponse> createGoal(
            @RequestHeader("Authorization") String token,
            @RequestBody @Valid CreateGoalRequest request) { // @Valid 추가
        String jwt = token.replace("Bearer ", "").trim();  // 공백 포함해서 제거 + trim 22312281 이가인 수정
        Long userId = jwtTokenProvider.getUserIdFromToken(jwt);
        GoalResponse response = goalService.createGoal(userId,request);
        return ResponseEntity.ok(response);
    }

    // 2. 목표 수정 (PUT /api/v1/goals/{id})
    @PutMapping("/{id}")
    public ResponseEntity<GoalResponse> updateGoal(@PathVariable Long id, @RequestBody @Valid CreateGoalRequest request) { // @Valid 추가
        GoalResponse response = goalService.updateGoal(id, request);
        return ResponseEntity.ok(response);
    }

    // 3. 목표 삭제 (DELETE /api/v1/goals/{id})
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGoal(@PathVariable Long id) {
        goalService.deleteGoal(id);
        return ResponseEntity.ok().build();
    }

    // 4. 목표 상태 변경 (PATCH)
    @PatchMapping("/{id}/status")
    public ResponseEntity<GoalResponse> updateStatus(
            @PathVariable Long id,
            @RequestBody GoalStatusRequest request) {

        GoalResponse response = goalService.updateStatus(id, request);
        return ResponseEntity.ok(response);
    }

    // 5. 목표 일괄 상태 변경 (PATCH)
    @PatchMapping("/status/bulk")
    public ResponseEntity<Void> updateStatusBulk(@RequestBody GoalBulkUpdateRequest request) {
        goalService.updateStatusBulk(request);
        return ResponseEntity.ok().build();
    }
    //6. 목표 실패 처리
    @PostMapping("/{id}/fail")
    public ResponseEntity<Void> markGoalAsFailed(@PathVariable Long id) {
        goalService.markGoalAsFailed(id);
        return ResponseEntity.ok().build();
    }

    // 7. 날짜별 성과 색상 조회 (GET /api/v1/goals/achievement?date=2025-11-25)
    @GetMapping("/achievement")
    public ResponseEntity<AchievementColor> getAchievementColor(
            @RequestHeader("Authorization") String token,
            @RequestParam LocalDate date) {
        String jwt = token.replace("Bearer","");    //22312281 이가인 수정
        Long userId = jwtTokenProvider.getUserIdFromToken(jwt);
        AchievementColor color = goalService.getAchievementColor(userId,date);
        return ResponseEntity.ok(color);
    }
}
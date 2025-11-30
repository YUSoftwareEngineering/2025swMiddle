/*
    Project: AttachmentController.java
    Author: 이채민, 한지윤
    Date of creation: 2025.11.22
    Date of last update: 2025.11.30
*/

package com.example.SWEnginnering2025.controller;

import com.example.SWEnginnering2025.model.AchievementColor;
import com.example.SWEnginnering2025.dto.CreateGoalRequest;
import com.example.SWEnginnering2025.dto.GoalBulkUpdateRequest;
import com.example.SWEnginnering2025.dto.GoalResponse;
import com.example.SWEnginnering2025.dto.GoalStatusRequest;
import com.example.SWEnginnering2025.service.GoalService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;


@RestController
@RequestMapping("/api/v1/goals")
public class GoalController {

    private final GoalService goalService;

    public GoalController(GoalService goalService) {
        this.goalService = goalService;
    }

    // 1. 목표 생성 (POST)
    @PostMapping
    public ResponseEntity<GoalResponse> createGoal(@RequestBody @Valid CreateGoalRequest request) {
        // [수정] 서비스가 userId를 필요로 하므로, 임시 ID 1L을 같이 넘겨줍니다.
        Long userId = 1L;
        GoalResponse response = goalService.createGoal(userId, request);
        return ResponseEntity.ok(response);
    }

    // 2. 목표 수정 (PUT /api/v1/goals/{id})
    @PutMapping("/{id}")
    public ResponseEntity<GoalResponse> updateGoal(@PathVariable Long id, @RequestBody @Valid CreateGoalRequest request) {
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

    // 6. 목표 실패 처리 (POST)
    @PostMapping("/{id}/fail")
    public ResponseEntity<Void> markGoalAsFailed(@PathVariable Long id) {
        goalService.markGoalAsFailed(id);
        return ResponseEntity.ok().build();
    }

    // 7. 날짜별 성과 색상 조회 (GET)
    @GetMapping("/achievement")
    public ResponseEntity<AchievementColor> getAchievementColor(@RequestParam LocalDate date) {
        // [수정] 여기도 userId(1L)를 같이 넘겨줘야 합니다.
        Long userId = 1L;
        AchievementColor color = goalService.getAchievementColor(userId, date);
        return ResponseEntity.ok(color);
    }
}
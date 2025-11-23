package com.example.SWEnginnering2025.controller;

import com.example.SWEnginnering2025.dto.CreateGoalRequest;
import com.example.SWEnginnering2025.dto.GoalResponse;
import com.example.SWEnginnering2025.dto.GoalStatusRequest;
import com.example.SWEnginnering2025.service.GoalService;
import com.example.SWEnginnering2025.service.GoalService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController // "나는 컨트롤러야, JSON으로 대답할게"
@RequestMapping("/api/v1/goals") // "주소는 이걸로 시작해"
@RequiredArgsConstructor
public class DailyGoalController {

    private final GoalService goalService;

    // 1. 목표 생성 (POST)
    @PostMapping
    public ResponseEntity<GoalResponse> createGoal(@RequestBody @Valid CreateGoalRequest request) { // @Valid 추가
        GoalResponse response = goalService.createGoal(request);
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
}
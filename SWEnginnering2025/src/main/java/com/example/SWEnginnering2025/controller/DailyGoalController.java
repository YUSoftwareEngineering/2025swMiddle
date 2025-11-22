package com.example.SWEnginnering2025.controller;

import com.example.SWEnginnering2025.dto.DailyGoalRequest;
import com.example.SWEnginnering2025.dto.DailyGoalResponse;
import com.example.SWEnginnering2025.service.DailyGoalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController // "나는 컨트롤러야, JSON으로 대답할게"
@RequestMapping("/api/v1/goals") // "주소는 이걸로 시작해"
@RequiredArgsConstructor
public class DailyGoalController {

    private final DailyGoalService dailyGoalService;

    // 1. 목표 생성 (POST)
    @PostMapping
    public ResponseEntity<DailyGoalResponse> createGoal(@RequestBody DailyGoalRequest request) {
        DailyGoalResponse response = dailyGoalService.createGoal(request);
        return ResponseEntity.ok(response);
    }

    // 2. 목표 수정 (PUT /api/v1/goals/{id})
    @PutMapping("/{id}")
    public ResponseEntity<DailyGoalResponse> updateGoal(@PathVariable Long id, @RequestBody DailyGoalRequest request) {
        DailyGoalResponse response = dailyGoalService.updateGoal(id, request);
        return ResponseEntity.ok(response);
    }

    // 3. 목표 삭제 (DELETE /api/v1/goals/{id})
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGoal(@PathVariable Long id) {
        dailyGoalService.deleteGoal(id);
        return ResponseEntity.ok().build();
    }
}
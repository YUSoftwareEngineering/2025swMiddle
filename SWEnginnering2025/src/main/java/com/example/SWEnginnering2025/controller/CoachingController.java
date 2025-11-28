package com.example.SWEnginnering2025.controller;

import com.example.SWEnginnering2025.service.CoachingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/coaching")
@RequiredArgsConstructor
public class CoachingController {

    private final CoachingService coachingService;

    // AI 맞춤 조언 요청 (POST /api/coaching/advice/1)
    @PostMapping("/advice/{userId}")
    public ResponseEntity<String> getAiAdvice(@PathVariable Long userId) {
        String advice = coachingService.generatePersonalizedAdvice(userId);
        return ResponseEntity.ok(advice);
    }
}
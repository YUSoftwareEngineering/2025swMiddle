package com.example.SWEnginnering2025.controller;

import com.example.SWEnginnering2025.model.Difficulty;
import com.example.SWEnginnering2025.service.StudentBotService;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/student-bot")
@RequiredArgsConstructor
public class StudentBotController {

    private final StudentBotService studentBotService;

    // 질문 요청 (POST /api/student-bot/ask)
    @PostMapping("/ask")
    public ResponseEntity<String> askQuestion(@RequestBody QuestionRequest request) {
        // 임시 유저 ID 1L 사용
        String answer = studentBotService.askQuestion(1L, request.getQuestion(), request.getDifficulty());
        return ResponseEntity.ok(answer);
    }

    // 요청 DTO (내부 클래스로 간단히 정의)
    @Data
    @NoArgsConstructor
    public static class QuestionRequest {
        private String question;
        private Difficulty difficulty;
    }
}
package com.example.SWEnginnering2025.controller;

import com.example.SWEnginnering2025.dto.studentbot.*;
import com.example.SWEnginnering2025.service.QAStorageService;
import com.example.SWEnginnering2025.service.StudentBotService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/student-bot")
public class StudentBotController {

    private final StudentBotService studentBotService;
    private final QAStorageService qaStorageService;

    public StudentBotController(StudentBotService studentBotService,
                                QAStorageService qaStorageService) {
        this.studentBotService = studentBotService;
        this.qaStorageService = qaStorageService;
    }

    // JWT 필터(JwtAuthenticationFilter)에서 userId를 username으로 넣어줬으므로 여기서 그대로 꺼냄
    private Long getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getName() == null) {
            throw new IllegalStateException("인증 정보가 없습니다.");
        }
        return Long.parseLong(auth.getName());
    }

    /**
     * 질문 보내기 + 답변 받기 + 자동 저장
     * POST /api/v1/student-bot/ask
     */
    @PostMapping("/ask")
    public ResponseEntity<StudentBotAnswerDto> ask(@RequestBody StudentBotAskRequest request) {
        Long userId = getCurrentUserId();
        StudentBotAnswerDto dto = studentBotService.askQuestion(userId, request);
        return ResponseEntity.ok(dto);
    }

    /**
     * Q&A 히스토리 목록 조회 (최신순, 검색/즐겨찾기 가능)
     * GET /api/v1/student-bot/history
     *  - ?page=0&size=20&keyword=...&favoritesOnly=true
     */
    @GetMapping("/history")
    public ResponseEntity<QaHistoryListResponse> getHistoryList(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Boolean favoritesOnly
    ) {
        Long userId = getCurrentUserId();
        QaHistoryListResponse response =
                qaStorageService.getHistoryList(userId, keyword, favoritesOnly, page, size);
        return ResponseEntity.ok(response);
    }

    /**
     * 히스토리 상세 조회 (전체 질문/답변 로그)
     * GET /api/v1/student-bot/history/{id}
     */
    @GetMapping("/history/{id}")
    public ResponseEntity<QaHistoryDetailDto> getHistoryDetail(@PathVariable Long id) {
        Long userId = getCurrentUserId();
        QaHistoryDetailDto dto = qaStorageService.getHistoryDetail(userId, id);
        return ResponseEntity.ok(dto);
    }

    /**
     * 개별 히스토리 삭제
     * DELETE /api/v1/student-bot/history/{id}
     */
    @DeleteMapping("/history/{id}")
    public ResponseEntity<Void> deleteHistory(@PathVariable Long id) {
        Long userId = getCurrentUserId();
        qaStorageService.deleteHistory(userId, id);
        return ResponseEntity.noContent().build();
    }

    /**
     * 전체 히스토리 삭제
     * DELETE /api/v1/student-bot/history
     */
    @DeleteMapping("/history")
    public ResponseEntity<Void> deleteAllHistory() {
        Long userId = getCurrentUserId();
        qaStorageService.deleteAllHistory(userId);
        return ResponseEntity.noContent().build();
    }

    /**
     * 즐겨찾기 설정/해제
     * POST /api/v1/student-bot/history/{id}/favorite?value=true
     */
    @PostMapping("/history/{id}/favorite")
    public ResponseEntity<Void> updateFavorite(
            @PathVariable Long id,
            @RequestParam boolean value
    ) {
        Long userId = getCurrentUserId();
        qaStorageService.updateFavorite(userId, id, value);
        return ResponseEntity.ok().build();
    }
}

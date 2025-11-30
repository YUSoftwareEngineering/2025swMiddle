package com.example.SWEnginnering2025.controller;

import com.example.SWEnginnering2025.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    // 1. 알림 구독 (GET /api/notifications/subscribe/1)
    // 앱을 켜면 이 주소로 요청을 보내서 연결을 유지합니다.
    @GetMapping(value = "/subscribe/{userId}", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter subscribe(@PathVariable Long userId) {
        return notificationService.subscribe(userId);
    }

    // 2. (테스트용) 알림 보내기 버튼
    @PostMapping("/send/{userId}")
    public ResponseEntity<String> sendTestNotification(@PathVariable Long userId, @RequestParam String message) {
        notificationService.sendNotification(userId, message);
        return ResponseEntity.ok("발송 완료");
    }
}
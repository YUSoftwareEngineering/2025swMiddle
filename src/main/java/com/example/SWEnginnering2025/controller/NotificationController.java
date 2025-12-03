// YHW
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

    // SSE 구독
    @GetMapping(value = "/subscribe/{userId}", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter subscribe(@PathVariable Long userId) {
        return notificationService.subscribe(userId);
    }

    // 테스트용 알림 발송
    @PostMapping("/send/{userId}")
    public ResponseEntity<String> sendTestNotification(@PathVariable Long userId,
                                                       @RequestParam String message) {
        notificationService.sendNotification(userId, message);
        return ResponseEntity.ok("발송 완료");
    }
}
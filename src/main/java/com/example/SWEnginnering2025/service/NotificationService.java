// YHW

package com.example.SWEnginnering2025.service;

import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class NotificationService {

    private static final Map<Long, SseEmitter> emitters = new ConcurrentHashMap<>();
    private static final Map<Long, Boolean> notificationSettings = new ConcurrentHashMap<>();

    // 1. SSE 구독
    public SseEmitter subscribe(Long userId) {
        SseEmitter emitter = new SseEmitter(Long.MAX_VALUE);
        emitters.put(userId, emitter);

        emitter.onCompletion(() -> emitters.remove(userId));
        emitter.onTimeout(() -> emitters.remove(userId));
        emitter.onError((e) -> emitters.remove(userId));

        try {
            emitter.send(SseEmitter.event().name("connect").data("연결되었습니다!"));
        } catch (IOException e) {
            emitters.remove(userId);
        }

        return emitter;
    }

    // 2. 알림 발송 (ON일 때만)
    public void sendNotification(Long userId, String message) {
        Boolean isEnabled = notificationSettings.getOrDefault(userId, false);
        if (!isEnabled) {
            System.out.println("⚠️ 알림 OFF 상태, 발송하지 않음: User " + userId);
            return;
        }

        SseEmitter emitter = emitters.get(userId);
        if (emitter != null) {
            try {
                emitter.send(SseEmitter.event().name("notification").data(message));
                System.out.println("✅ 알림 전송 성공 (User " + userId + "): " + message);
            } catch (IOException e) {
                emitters.remove(userId);
                System.out.println("❌ 알림 전송 실패: " + e.getMessage());
            }
        } else {
            System.out.println("⚠️ User " + userId + "는 미접속 상태");
        }
    }

    // 3. 알림 설정 조회
    public Boolean isNotificationEnabled(Long userId) {
        return notificationSettings.getOrDefault(userId, false);
    }

    // 4. 알림 설정 업데이트
    public void updateNotificationSetting(Long userId, Boolean isEnabled) {
        notificationSettings.put(userId, isEnabled);
    }
}
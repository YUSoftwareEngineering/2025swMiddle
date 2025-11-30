package com.example.SWEnginnering2025.service;

import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class NotificationService {

    // 접속한 사용자들을 저장하는 명단 (Key: UserId, Value: 알림 통로)
    private static final Map<Long, SseEmitter> emitters = new ConcurrentHashMap<>();

    // 1. 사용자가 알림을 받겠다고 '구독'하는 메서드
    public SseEmitter subscribe(Long userId) {
        SseEmitter emitter = new SseEmitter(Long.MAX_VALUE); // 만료 시간 길게 설정

        // 명단에 추가
        emitters.put(userId, emitter);

        // 연결이 끊기거나 완료되면 명단에서 제거
        emitter.onCompletion(() -> emitters.remove(userId));
        emitter.onTimeout(() -> emitters.remove(userId));
        emitter.onError((e) -> emitters.remove(userId));

        // 첫 접속 시 "연결 성공" 더미 데이터 전송 (안 보내면 연결 안 됨)
        try {
            emitter.send(SseEmitter.event().name("connect").data("연결되었습니다!"));
        } catch (IOException e) {
            emitters.remove(userId);
        }

        return emitter;
    }

    // 2. 특정 사용자에게 알림을 '발송'하는 메서드
    public void sendNotification(Long userId, String message) {
        SseEmitter emitter = emitters.get(userId);
        if (emitter != null) {
            try {
                emitter.send(SseEmitter.event().name("notification").data(message));
                System.out.println("✅ 알림 전송 성공 (User " + userId + "): " + message);
            } catch (IOException e) {
                emitters.remove(userId); // 전송 실패 시 명단에서 제거
                System.out.println("❌ 알림 전송 실패: " + e.getMessage());
            }
        } else {
            System.out.println("⚠️ 알림 전송 불가: User " + userId + "는 현재 미접속 상태입니다.");
        }
    }
}
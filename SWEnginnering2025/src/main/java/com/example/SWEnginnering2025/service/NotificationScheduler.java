package com.example.SWEnginnering2025.service;

import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;

@Component
@RequiredArgsConstructor
public class NotificationScheduler {

    private final NotificationService notificationService; // 알림 발송 담당
    private final ThreadPoolTaskScheduler scheduler = new ThreadPoolTaskScheduler();

    // 생성자에서 스케줄러 시동 켜기
    {
        scheduler.initialize();
    }

    // 알림 예약 메서드
    public void scheduleReminder(Long goalId, String title, LocalDateTime runTime) {
        // 자바 시간(LocalDateTime) -> 스케줄러 시간(Date) 변환
        Date startTime = Date.from(runTime.atZone(ZoneId.systemDefault()).toInstant());

        // 예약 실행 (지정된 시간이 되면 이 코드가 실행됨)
        scheduler.schedule(() -> {
            // 1. 보낼 메시지 만들기
            String message = "🔔 목표 알림: [" + title + "] 할 시간입니다!";

            // 2. 여기서 진짜 알림을 보냄
            Long targetUserId = 1L;
            notificationService.sendNotification(targetUserId, message);

            // 3. 콘솔에도 로그 남기기
            System.out.println("✅ [스케줄러 실행] " + message);

        }, startTime);

        System.out.println("📅 알림 예약 완료: " + runTime);
    }
}
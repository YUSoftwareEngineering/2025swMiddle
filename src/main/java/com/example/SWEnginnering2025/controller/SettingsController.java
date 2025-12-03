//YHW

package com.example.SWEnginnering2025.controller;

import com.example.SWEnginnering2025.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/settings")
@RequiredArgsConstructor
public class SettingsController {

    private final NotificationService notificationService;

    // GET: 알림 설정 조회
    @GetMapping("/{userId}")
    public Map<String, Object> getSettings(@PathVariable Long userId) {
        boolean isEnabled = notificationService.isNotificationEnabled(userId);
        return Map.of("isNotificationEnabled", isEnabled);
    }

    // PUT: 알림 설정 업데이트
    @PutMapping("/{userId}")
    public Map<String, Object> updateSettings(@PathVariable Long userId,
                                              @RequestBody Map<String, Object> payload) {
        Boolean isEnabled = (Boolean) payload.get("isNotificationEnabled");
        if (isEnabled == null) {
            return Map.of("success", false, "message", "isNotificationEnabled 값이 없습니다.");
        }

        notificationService.updateNotificationSetting(userId, isEnabled);
        return Map.of("success", true, "isNotificationEnabled", isEnabled);
    }
}

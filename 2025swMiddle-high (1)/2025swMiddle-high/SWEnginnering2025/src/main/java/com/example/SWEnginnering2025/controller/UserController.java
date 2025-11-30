package com.example.SWEnginnering2025.controller;

import com.example.SWEnginnering2025.dto.AppSettingsRequest;
import com.example.SWEnginnering2025.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // 1. 설정 변경 (PATCH /api/user/settings)
    @PatchMapping("/settings")
    public ResponseEntity<Void> updateSettings(@RequestBody AppSettingsRequest request) {
        // (임시로 1번 유저라고 가정)
        userService.updateAppSettings(1L, request);
        return ResponseEntity.ok().build();
    }

    // 2. 앱 정보 조회 (GET /api/user/app-info)
    @GetMapping("/app-info")
    public ResponseEntity<Map<String, String>> getAppInfo() {
        Map<String, String> info = new HashMap<>();
        info.put("version", "1.0.0");
        info.put("developer", "Team Self-Management"); // 팀 이름 넣기!
        return ResponseEntity.ok(info);
    }
}
/*
    Project: FocusSessionController.java
    Author: YHW
    Date of creation: 2025.11.23
    Date of last update: 2025.11.23
*/

package com.example.SWEnginnering2025.controller;

import com.example.SWEnginnering2025.dto.FocusSessionResponse;
import com.example.SWEnginnering2025.dto.FocusSessionStartRequest;
import com.example.SWEnginnering2025.service.FocusSessionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/focus")
@RequiredArgsConstructor
public class FocusSessionController {

    private final FocusSessionService focusSessionService;

    // 포커스 세션 시작
    @PostMapping("/start")
    public ResponseEntity<FocusSessionResponse> startSession(@RequestBody FocusSessionStartRequest request) {
        FocusSessionResponse response = focusSessionService.startSession(request);
        return ResponseEntity.ok(response);
    }

    // 일시 정지 및 화면 전환 시
    @PostMapping("/{sessionId}/pause")
    public ResponseEntity<FocusSessionResponse> pauseSession(@PathVariable Long sessionId) {
        FocusSessionResponse response = focusSessionService.pauseSession(sessionId);
        return ResponseEntity.ok(response);
    }

    // resume
    @PostMapping("/{sessionId}/resume")
    public ResponseEntity<FocusSessionResponse> resumeSession(@PathVariable Long sessionId) {
        FocusSessionResponse response = focusSessionService.resumeSession(sessionId);
        return ResponseEntity.ok(response);
    }

    // 포커스 세션 완료 
    @PostMapping("/{sessionId}/complete")
    public ResponseEntity<FocusSessionResponse> completeSession(@PathVariable Long sessionId) {
        FocusSessionResponse response = focusSessionService.completeSession(sessionId);
        return ResponseEntity.ok(response);
    }
}
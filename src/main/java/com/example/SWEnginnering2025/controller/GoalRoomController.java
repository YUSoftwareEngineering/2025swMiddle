package com.example.SWEnginnering2025.controller;
/*
   Project: GoalRoomController.java
   Author: 윤나영
  Date of creation: 2025.11.30
  Date of last update: 2025.11.30
*/
import com.example.SWEnginnering2025.dto.goalroom.*;
import com.example.SWEnginnering2025.service.GoalRoomService;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import org.springframework.data.domain.Page;

@RestController
@RequestMapping("/api/goalrooms")
public class GoalRoomController {

    private final GoalRoomService roomService;

    public GoalRoomController(GoalRoomService roomService) {
        this.roomService = roomService;
    }

    // ----------------------------------------------------
    // JWT에서 userId(Long) 추출하는 공통 메서드
    // ----------------------------------------------------
    private Long currentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return Long.valueOf(auth.getName());
    }

    // ----------------------------------------------------
    // 1) 방 생성
    // POST /api/goalrooms
    // ----------------------------------------------------
    @PostMapping
    public ResponseEntity<CreateRoomResponse> createRoom(@RequestBody CreateRoomRequest req) {
        Long userId = currentUserId();
        CreateRoomResponse response = roomService.createRoom(userId, req);
        return ResponseEntity.ok(response);
    }

    // ----------------------------------------------------
    // 2) 내 방 + 공개 방 조회
    // GET /api/goalrooms?scope=my|public
    // ----------------------------------------------------
    @GetMapping
    public ResponseEntity<GoalRoomListResponse> getRooms(
            @RequestParam(required = false) String scope) {

        Long userId = currentUserId();
        GoalRoomListResponse response = roomService.getRooms(userId, scope);
        return ResponseEntity.ok(response);
    }

    // ----------------------------------------------------
    // 3) 방 참여
    // POST /api/goalrooms/{roomId}/join
    // ----------------------------------------------------
    @PostMapping("/{roomId}/join")
    public ResponseEntity<?> joinRoom(@PathVariable Long roomId) {

        Long userId = currentUserId();
        roomService.joinRoom(userId, roomId);
        return ResponseEntity.ok().build();
    }

    // ----------------------------------------------------
    // 4) 방 탈퇴
    // POST /api/goalrooms/{roomId}/leave
    // ----------------------------------------------------
    @PostMapping("/{roomId}/leave")
    public ResponseEntity<?> leaveRoom(@PathVariable Long roomId) {

        Long userId = currentUserId();
        roomService.leaveRoom(userId, roomId);
        return ResponseEntity.ok().build();
    }

    // ----------------------------------------------------
    // 5) 공개 방 검색
    // GET /api/goalrooms/search?keyword=xxx
    // ----------------------------------------------------
    @GetMapping("/search")
    public ResponseEntity<?> searchRooms(@RequestParam String keyword) {

        return ResponseEntity.ok(roomService.search(keyword));
    }

    // ----------------------------------------------------
    // 6) 메시지 전송
    // POST /api/goalrooms/{roomId}/messages
    // ----------------------------------------------------
    @PostMapping("/{roomId}/messages")
    public ResponseEntity<MessageDto> sendMessage(
            @PathVariable Long roomId,
            @RequestBody SendMessageRequest req
    ) {
        Long userId = currentUserId();
        MessageDto dto = roomService.saveMessage(userId, roomId, req);
        return ResponseEntity.ok(dto);
    }

    // ----------------------------------------------------
    // 7) 메시지 페이징 조회
    // GET /api/goalrooms/{roomId}/messages?page=0&size=30
    // ----------------------------------------------------
    @GetMapping("/{roomId}/messages")
    public ResponseEntity<Page<MessageDto>> getMessages(
            @PathVariable Long roomId,
            @RequestParam int page,
            @RequestParam int size
    ) {
        Page<MessageDto> messages = roomService.getMessages(roomId, page, size);
        return ResponseEntity.ok(messages);
    }

    // ----------------------------------------------------
    // 8) 오늘의 상태 조회
    // GET /api/goalrooms/{roomId}/today-status
    // ----------------------------------------------------
    @GetMapping("/{roomId}/today-status")
    public ResponseEntity<TodayStatusDto> getTodayStatus(@PathVariable Long roomId) {

        TodayStatusDto dto = roomService.getTodayStatus(roomId);
        return ResponseEntity.ok(dto);
    }
}
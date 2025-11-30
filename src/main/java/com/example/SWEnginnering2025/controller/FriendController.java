/*
    Project: FriendController.java
    Author: 최은샘
    Date of creation: 2025.11.27
    Date of last update: 2025.11.27

    담당 기능:
    9. 친구 검색/발견
    11. 친구 요청/수락/거절
    12. 친구 차단/해제 및 삭제
*/

package com.example.SWEnginnering2025.controller;

import com.example.SWEnginnering2025.dto.Friend.*;
import com.example.SWEnginnering2025.service.FriendService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/friends")
@RequiredArgsConstructor
public class FriendController {  // 친구 관련 HTTP 요청을 처리하는 컨트롤러

    private final FriendService friendService;

    // 9. 친구 검색/발견
    // 예: GET /api/v1/friends/search?currentUserId=1&keyword=test
    @GetMapping("/search")
    public ResponseEntity<List<FriendSearchResultDto>> searchUsers(  // 친구/사용자 검색
            @RequestParam Long currentUserId,
            @RequestParam String keyword
    ) {
        List<FriendSearchResultDto> result = friendService.searchUsers(currentUserId, keyword);
        return ResponseEntity.ok(result); // HTTP 200 OK 상태로 result 리스트를 JSON 바디로 응답
    }

    // 친구 목록 조회
    // 예: GET /api/v1/friends?userId=1
    @GetMapping
    public ResponseEntity<List<FriendDto>> getFriendList(@RequestParam Long userId) {
        List<FriendDto> friends = friendService.getFriendList(userId);
        return ResponseEntity.ok(friends);
    }

    // 11. 친구 요청 보내기
    // 예: POST /api/v1/friends/requests  (body: { "fromUserId": 1, "toUserId": 2 })
    @PostMapping("/requests")
    public ResponseEntity<Void> sendFriendRequest(@RequestBody CreateFriendRequestDto dto) {
        friendService.sendFriendRequest(dto);
        return ResponseEntity.ok().build();
    }

    // 받은 친구 요청 목록 조회
    // 예: GET /api/v1/friends/requests?userId=2
    @GetMapping("/requests")
    public ResponseEntity<List<FriendRequestDto>> getReceivedRequests(@RequestParam Long userId) {
        List<FriendRequestDto> requests = friendService.getReceivedRequests(userId);
        return ResponseEntity.ok(requests);
    }

    // 22312281 이가인 추가 - 보낸 친구 요청 목록 조회
    // 예: GET /api/v1/friends/requests/sent?userId=1
    @GetMapping("/requests/sent")
    public ResponseEntity<List<FriendRequestDto>> getSentRequests(@RequestParam Long userId) {
        List<FriendRequestDto> requests = friendService.getSentRequests(userId);
        return ResponseEntity.ok(requests);
    }

    // 22312281 이가인 추가 - 보낸 친구 요청 취소
    // 예: DELETE /api/v1/friends/requests/{id}/cancel
    @DeleteMapping("/requests/{id}/cancel")
    public ResponseEntity<Void> cancelRequest(@PathVariable Long id) {
        friendService.cancelRequest(id);
        return ResponseEntity.ok().build();
    }

    // 친구 요청 수락
    // 예: POST /api/v1/friends/requests/{id}/accept
    @PostMapping("/requests/{id}/accept")
    public ResponseEntity<Void> acceptRequest(@PathVariable Long id) {
        friendService.acceptRequest(id);
        return ResponseEntity.ok().build();
    }

    // 친구 요청 거절
    // 예: POST /api/v1/friends/requests/{id}/decline
    @PostMapping("/requests/{id}/decline")
    public ResponseEntity<Void> declineRequest(@PathVariable Long id) {
        friendService.declineRequest(id);
        return ResponseEntity.ok().build();
    }

    // 12-1. 친구 삭제
    // 예: DELETE /api/v1/friends/{friendUserId}?userId=1
    @DeleteMapping("/{friendUserId}")
    public ResponseEntity<Void> deleteFriend(
            @RequestParam Long userId,
            @PathVariable Long friendUserId
    ) {
        friendService.deleteFriend(userId, friendUserId);
        return ResponseEntity.ok().build();
    }

    // 12-2. 친구 차단
    // 예: POST /api/v1/friends/block?userId=1&targetUserId=3
    @PostMapping("/block")
    public ResponseEntity<Void> blockUser(
            @RequestParam Long userId,
            @RequestParam Long targetUserId
    ) {
        friendService.blockUser(userId, targetUserId);
        return ResponseEntity.ok().build();
    }

    // 12-3. 차단 해제
    // 예: POST /api/v1/friends/unblock?userId=1&targetUserId=3
    @PostMapping("/unblock")
    public ResponseEntity<Void> unblockUser(
            @RequestParam Long userId,
            @RequestParam Long targetUserId
    ) {
        friendService.unblockUser(userId, targetUserId);
        return ResponseEntity.ok().build();
    }

    // 12-4. 차단 목록 조회
    // 예: GET /api/v1/friends/blocked?userId=1
    @GetMapping("/blocked")
    public ResponseEntity<List<BlockedUserDto>> getBlockedUsers(@RequestParam Long userId) {
        List<BlockedUserDto> blocked = friendService.getBlockedUsers(userId);
        return ResponseEntity.ok(blocked);
    }
}

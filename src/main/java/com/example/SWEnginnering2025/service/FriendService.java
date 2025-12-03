/*
    Project: FriendService.java
    Author: 최은샘
    Date of creation: 2025.11.27
    Date of last update: 2025.11.27

    역할:
    - 9. 친구 검색/발견
    - 11. 친구 요청/수락/거절
    - 12. 친구 차단/해제 및 친구 삭제
    에 대한 비즈니스 로직 구현
*/

package com.example.SWEnginnering2025.service;

import com.example.SWEnginnering2025.dto.Friend.*;
import com.example.SWEnginnering2025.model.*;
import com.example.SWEnginnering2025.model.Friend.*;
import com.example.SWEnginnering2025.repository.*;
import com.example.SWEnginnering2025.repository.Friend.*;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class FriendService {

    private final UserRepository userRepository;
    private final FriendRelationshipRepository friendRelationshipRepository;
    private final FriendRequestRepository friendRequestRepository;
    private final FriendBlockRepository friendBlockRepository;

    // 9. 친구 검색/발견 (searchByKeyword / requestSearchUser / searchResult)
    public List<FriendSearchResultDto> searchUsers(Long currentUserId, String keyword) {
        User me = userRepository.findById(currentUserId)   // 로그인해서 검색
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다.")); // 그 로그인한 사람의 id 자체가 DB에 없으면 IllegalArgumentException

        // 검색 키워드에 맞는 사용자들(이름, 아이디)을 DB에서 가져옴
        List<User> users = userRepository
                .findByNameContainingIgnoreCaseOrUserIdContainingIgnoreCase(keyword, keyword);

        // users 리스트를 Stream 으로 변환
        return users.stream()
                .filter(u -> !u.getId().equals(me.getId())) // 자기 자신은 검색 결과에서 제외
                .map(u -> {
                    boolean isFriend = friendRelationshipRepository.existsByUserAndFriend(me, u); // 지금 검색된 이 사용자 u 가 이미 나의 친구인지 여부
                    boolean requestSent = friendRequestRepository
                            .existsByFromUserAndToUserAndStatus(me, u, FriendRequestStatus.PENDING); // 이 사용자에게 이미 친구 요청을 보냈는지(아직 대기중인지) 여부

                    return FriendSearchResultDto.builder()
                            .id(u.getId())
                            .userId(u.getUserId())
                            .name(u.getName())
                            .isFriend(isFriend)
                            .requestSent(requestSent)
                            .build();
                })
                .collect(Collectors.toList());  // 스트림으로 변환된 FriendSearchResultDto 들을 다시 List 로 모음
    }

    // 친구 목록 조회 (View FriendList + loadFriendList 흐름과 대응)
    public List<FriendDto> getFriendList(Long userId) {
        User me = userRepository.findById(userId)  // userId 로 사용자 정보를 DB에서 조회
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        return friendRelationshipRepository.findByUser(me).stream() // 나(me)가 가진 친구 관계들을 전부 가져옴
                .map(rel -> FriendDto.builder()
                        .id(rel.getFriend().getId())
                        .userId(rel.getFriend().getUserId())
                        .name(rel.getFriend().getName())
                        .build())
                .collect(Collectors.toList());
    }

    // 11. 친구 요청 보내기 (onAddFriendClick / addFriend / requestAddFriend / triggerNotification)
    public void sendFriendRequest(CreateFriendRequestDto dto) {
        if (dto.getFromUserId().equals(dto.getToUserId())) {  // 자기 자신에게 보내는 요청
            throw new IllegalArgumentException("자기 자신에게는 친구 요청을 보낼 수 없습니다.");
        }

        User from = userRepository.findById(dto.getFromUserId())  // 보낸 쪽 유저가 실제 DB에 존재하지 않는다면
                .orElseThrow(() -> new IllegalArgumentException("요청 보낸 사용자를 찾을 수 없습니다."));
        User to = userRepository.findById(dto.getToUserId())      // 받는 쪽 유저가 실제 DB에 없으면
                .orElseThrow(() -> new IllegalArgumentException("요청 받을 사용자를 찾을 수 없습니다."));

        // 이미 친구인지 확인
        if (friendRelationshipRepository.existsByUserAndFriend(from, to)) {
            throw new IllegalStateException("이미 친구 상태입니다.");
        }

        // 이미 PENDING 요청이 있는지 확인
        if (friendRequestRepository.existsByFromUserAndToUserAndStatus(from, to, FriendRequestStatus.PENDING)) {
            throw new IllegalStateException("이미 친구 요청을 보낸 상태입니다.");
        }

        // 차단 여부 확인 (from 또는 to 가 서로를 차단한 경우)
        if (friendBlockRepository.existsByUserAndBlockedUser(from, to) ||
                friendBlockRepository.existsByUserAndBlockedUser(to, from)) { // 어느 한 쪽이라도 상대를 차단한 상태면 친구 요청 불가능
            throw new IllegalStateException("차단 관계에서는 친구 요청을 보낼 수 없습니다.");
        }

        FriendRequest request = FriendRequest.builder()
                .fromUser(from)
                .toUser(to)
                .status(FriendRequestStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .build();

        friendRequestRepository.save(request); // 실제로 친구 요청 레코드가 DB에 하나 생성

        // triggerNotification(targetUserId, senderId)에 해당하는 실제 푸시/알림 기능은
        // 여기서는 생략 (필요하다면 별도 NotificationService로 연동)
    }

    public long countPendingRequests(Long userId) {
        return friendRequestRepository.countByToUserIdAndStatus(userId, FriendRequestStatus.PENDING);
    }

    // 받은 친구 요청 목록 조회 (loadRequestList / getRequestList)
    public List<FriendRequestDto> getReceivedRequests(Long userId) {
        User me = userRepository.findById(userId)  // userId에 해당하는 유저가 없으면 에러
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        List<FriendRequest> requests =  // 내가 받은, 아직 처리되지 않은(대기중인) 친구 요청 목록
                friendRequestRepository.findByToUserAndStatus(me, FriendRequestStatus.PENDING);

        return requests.stream()
                .map(r -> FriendRequestDto.builder()
                        .id(r.getId())
                        .fromUserId(r.getFromUser().getId())
                        .toUserId(r.getToUser().getId())
                        .fromUserName(r.getFromUser().getName())
                        .toUserName(r.getToUser().getName())
                        .status(r.getStatus())
                        .createdAt(r.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }

    // 22312281 이가인 추가 - 보낸 친구 요청 목록 조회
    public List<FriendRequestDto> getSentRequests(Long userId) {
        User me = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        List<FriendRequest> requests = 
                friendRequestRepository.findByFromUserAndStatus(me, FriendRequestStatus.PENDING);

        return requests.stream()
                .map(r -> FriendRequestDto.builder()
                        .id(r.getId())
                        .fromUserId(r.getFromUser().getId())
                        .toUserId(r.getToUser().getId())
                        .fromUserName(r.getFromUser().getName())
                        .toUserName(r.getToUser().getName())
                        .status(r.getStatus())
                        .createdAt(r.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }

    // 22312281 이가인 추가 - 보낸 친구 요청 취소
    public void cancelRequest(Long requestId) {
        FriendRequest request = friendRequestRepository.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("친구 요청을 찾을 수 없습니다."));

        if (request.getStatus() != FriendRequestStatus.PENDING) {
            throw new IllegalStateException("이미 처리된 요청입니다.");
        }

        friendRequestRepository.delete(request);
    }

    // 11. 친구 요청 수락 (acceptRequest / requestBecomeFriend / deleteRequestList / FriendListUpdate)
    public void acceptRequest(Long requestId) {  // 수락할 친구 요청의 ID
        FriendRequest request = friendRequestRepository.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("친구 요청을 찾을 수 없습니다."));

        if (request.getStatus() != FriendRequestStatus.PENDING) {  // PENDING 이 아닌 요청에 대해 수락을 시도하면 예외
            throw new IllegalStateException("이미 처리된 요청입니다.");
        }

        request.setStatus(FriendRequestStatus.ACCEPTED);  // 요청의 상태를 ACCEPTED 로 변경
        request.setRespondedAt(LocalDateTime.now());      //  “언제 수락(응답)했는지” 기록

        User from = request.getFromUser();  // 친구 요청을 보낸 사람
        User to = request.getToUser();      // 친구 요청을 받은 사람

        // 양방향 친구 관계 생성
        if (!friendRelationshipRepository.existsByUserAndFriend(from, to)) {  // from 사용자의 친구 리스트 중에 to 가 이미 있는지 확인
            friendRelationshipRepository.save(
                    FriendRelationship.builder()
                            .user(from)
                            .friend(to)
                            .createdAt(LocalDateTime.now())
                            .build()
            );
        }

        if (!friendRelationshipRepository.existsByUserAndFriend(to, from)) {  // to 사용자의 친구 리스트 중에 from 이 이미 있는지 확인
            friendRelationshipRepository.save(
                    FriendRelationship.builder()
                            .user(to)
                            .friend(from)
                            .createdAt(LocalDateTime.now())
                            .build()
            );
        }

        // deleteRequestList(requestId) 역할: 수락된 요청은 더 이상 요청 목록에 보이지 않도록 DB에서 삭제
        friendRequestRepository.delete(request);
    }

    // 친구 요청 거절
    public void declineRequest(Long requestId) {
        FriendRequest request = friendRequestRepository.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("친구 요청을 찾을 수 없습니다."));

        if (request.getStatus() != FriendRequestStatus.PENDING) {
            throw new IllegalStateException("이미 처리된 요청입니다.");
        }

        request.setStatus(FriendRequestStatus.DECLINED);  // 요청의 상태를 DECLINED(거절됨)으로 변경
        request.setRespondedAt(LocalDateTime.now());      // 거절한 시각을 respondedAt 에 기록


        // fun1.txt 설명대로라면 "요청 목록에서 삭제" 이므로 삭제 처리
        friendRequestRepository.delete(request); // 이 거절된 FriendRequest 엔티티를 DB에서 삭제
    }

    // 12-1. 친구 삭제 (Delete Friend SD)
    public void deleteFriend(Long userId, Long friendUserId) {
        User me = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
        User friend = userRepository.findById(friendUserId)  // friendUserId 로 친구 사용자 조회시 있으면 friend 변수에 담고
                .orElseThrow(() -> new IllegalArgumentException("친구 사용자를 찾을 수 없습니다.")); // 없으면

        // 양쪽 관계 모두 삭제
        friendRelationshipRepository.deleteByUserAndFriend(me, friend);  // 나 입장에서 친구 목록에서 friend 를 제거
        friendRelationshipRepository.deleteByUserAndFriend(friend, me);  // 상대 입장에서 친구 목록에서 나를 제거
    }

    // 12-2. 친구 차단 (Block Friend SD)
    public void blockUser(Long userId, Long targetUserId) {
        if (userId.equals(targetUserId)) {
            throw new IllegalArgumentException("자기 자신을 차단할 수 없습니다.");
        }

        User me = userRepository.findById(userId) // userId 로 나 자신을 DB에서 조회
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
        User target = userRepository.findById(targetUserId)  //  targetUserId 로 대상 유저 조회.
                .orElseThrow(() -> new IllegalArgumentException("대상 사용자를 찾을 수 없습니다."));

        // me 가 target 을 이미 차단한 적이 있다면 무시
        if (friendBlockRepository.existsByUserAndBlockedUser(me, target)) {
            return;
        }

        // 친구 관계였다면 먼저 친구 삭제
        friendRelationshipRepository.deleteByUserAndFriend(me, target);
        friendRelationshipRepository.deleteByUserAndFriend(target, me);

        FriendBlock block = FriendBlock.builder()
                .user(me)
                .blockedUser(target)
                .blockedAt(LocalDateTime.now())
                .build();

        friendBlockRepository.save(block); // friend_block 테이블에 “나가 target 을 차단했다”는 레코드 생성
    }

    // 12-3. 차단 해제
    public void unblockUser(Long userId, Long targetUserId) {
        User me = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
        User target = userRepository.findById(targetUserId)
                .orElseThrow(() -> new IllegalArgumentException("대상 사용자를 찾을 수 없습니다."));

        friendBlockRepository.deleteByUserAndBlockedUser(me, target); // “나가 target을 차단한 기록”을 삭제해서 차단을 해제
    }

    // 12-4. 차단 목록 조회 (BlockedUsers.tsx 와 매핑)
    public List<BlockedUserDto> getBlockedUsers(Long userId) {
        User me = userRepository.findById(userId) // userId 로 나 자신 조회
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        return friendBlockRepository.findByUser(me).stream() //내가 차단한 모든 사용자들에 대한 레코드 리스트를 가져옴
                .map(b -> BlockedUserDto.builder()
                        .id(b.getId())
                        .blockedUserId(b.getBlockedUser().getId())
                        .blockedUserName(b.getBlockedUser().getName())
                        .blockedAt(b.getBlockedAt())
                        .build())
                .collect(Collectors.toList());
    }
}

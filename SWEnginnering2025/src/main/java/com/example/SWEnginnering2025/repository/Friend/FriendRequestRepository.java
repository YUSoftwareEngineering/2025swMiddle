/*
    Project: FriendRequestRepository.java
    Author: 최은샘
    Date of creation: 2025.11.27
    Date of last update: 2025.11.27
*/

package com.example.SWEnginnering2025.repository.Friend;

import com.example.SWEnginnering2025.model.Friend.FriendRequest;
import com.example.SWEnginnering2025.model.Friend.FriendRequestStatus;
import com.example.SWEnginnering2025.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FriendRequestRepository extends JpaRepository<FriendRequest, Long> {

    // 특정 사용자가 받은, 상태가 PENDING 인 요청목록을 모두 가져오기
    List<FriendRequest> findByToUserAndStatus(User toUser, FriendRequestStatus status);

    // 이미 동일한 요청이 있는지 확인해서 중복 요청을 막기 위한 용도
    boolean existsByFromUserAndToUserAndStatus(User fromUser, User toUser, FriendRequestStatus status);
}

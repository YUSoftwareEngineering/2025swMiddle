/*
    Project: FriendBlockRepository.java
    Author: 최은샘
    Date of creation: 2025.11.27
    Date of last update: 2025.11.27
*/

package com.example.SWEnginnering2025.repository.Friend;

import com.example.SWEnginnering2025.model.Friend.FriendBlock;
import com.example.SWEnginnering2025.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FriendBlockRepository extends JpaRepository<FriendBlock, Long> {

    // 이 사용자가 차단한 사람들에 대한 차단 목록 조회
    List<FriendBlock> findByUser(User user);

    // 내가 상대를 이미 차단했는지 여부 확인
    boolean existsByUserAndBlockedUser(User user, User blockedUser);

    // 차단 해제 기능
    void deleteByUserAndBlockedUser(User user, User blockedUser);
}

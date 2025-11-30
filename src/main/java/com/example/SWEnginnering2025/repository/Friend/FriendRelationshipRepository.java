/*
    Project: FriendRelationshipRepository.java
    Author: 최은샘
    Date of creation: 2025.11.27
    Date of last update: 2025.11.27
*/

package com.example.SWEnginnering2025.repository.Friend;

import com.example.SWEnginnering2025.model.Friend.FriendRelationship;
import com.example.SWEnginnering2025.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
// 이 리포지토리가 다룰 엔티티 타입 (FriendRelationship), 엔티티의 PK 타입 (Long)
public interface FriendRelationshipRepository extends JpaRepository<FriendRelationship, Long> {

    // 특정 사용자(user)의 친구 관계 목록을 전부 가져오는 메서드
    List<FriendRelationship> findByUser(User user);

    // "이 두 사용자가 이미 친구인지 여부” 를 확인할 때 사용
    boolean existsByUserAndFriend(User user, User friend);

    // "A와 B 사이의 친구 관계 한 방향을 끊을 때” 사용
    void deleteByUserAndFriend(User user, User friend);
}

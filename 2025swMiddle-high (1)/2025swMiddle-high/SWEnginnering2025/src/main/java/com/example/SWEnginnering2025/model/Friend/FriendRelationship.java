/*
    Project: FriendRelationship.java
    Author: 최은샘
    Date of creation: 2025.11.27
    Date of last update: 2025.11.27
*/

package com.example.SWEnginnering2025.model.Friend;

import com.example.SWEnginnering2025.model.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor  // 모든 필드를 파라미터로 받는 생성자
@Builder
@Entity
@Table(name = "friend_relationship")

// 친구 관계 엔티티 (친구 목록 / 삭제용)
public class FriendRelationship {

    // 기본 키 값을 자동 생성
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 친구 관계의 한 쪽
    @ManyToOne(fetch = FetchType.LAZY)  // FriendRelationship : User = N : 1 관계
    @JoinColumn(name = "user_id", nullable = false) // user_id(FK=User 테이블의 PK즉 user.id를 참조)
    private User user; // 나 자신을 나타내는 User 엔티티

    // 다른 한 쪽
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "friend_id", nullable = false)
    private User friend; // 상대방을 나타내는 User 엔티티

    @Column(nullable = false) // created_at 컬럼
    private LocalDateTime createdAt; // 친구 관계가 만들어진 시점

}

/*
    Project: FriendBlock.java
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
@AllArgsConstructor
@Builder
@Entity
@Table(name = "friend_block")

// 차단 엔티티 (차단/해제/관리)
public class FriendBlock {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 차단을 한 사용자
    @ManyToOne(fetch = FetchType.LAZY) // friend_block : User = N : 1
    @JoinColumn(name = "user_id", nullable = false)
    private User user; // 차단을 한 사용자(나) 나타내는 User 엔티티

    // 차단된 사용자
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "blocked_user_id", nullable = false)
    private User blockedUser; // 차단 당한 사용자(상대) 나타내는 User 엔티티

    @Column(nullable = false)
    private LocalDateTime blockedAt; // 차단 된 시간
}

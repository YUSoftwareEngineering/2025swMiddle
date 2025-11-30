/*
    Project: FriendRequest.java
    Author: (작성자 이름)
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
@Table(name = "friend_request")

// 친구 요청 엔티티 (요청/수락/거절)
public class FriendRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 요청 보낸 사람
    @ManyToOne(fetch = FetchType.LAZY) // FriendRequest : User = N : 1
    @JoinColumn(name = "from_user_id", nullable = false) // from_user_id(FK=User 테이블의 PK즉 user.id를 참조)
    private User fromUser; // 친구 요청을 보낸 사용자를 나타내는 User 엔티티

    // 요청 받은 사람
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "to_user_id", nullable = false)
    private User toUser;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FriendRequestStatus status;

    // 친구 요청을 한 시간
    @Column(nullable = false)
    private LocalDateTime createdAt;

    // 친구 요청에 응답한 시간
    private LocalDateTime respondedAt;
}

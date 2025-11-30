/*
    Project: FriendRequestDto.java
    Author: 최은샘
    Date of creation: 2025.11.27
    Date of last update: 2025.11.27
*/


package com.example.SWEnginnering2025.dto.Friend;

import com.example.SWEnginnering2025.model.Friend.FriendRequestStatus;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FriendRequestDto {  // 친구 요청 한 건에 대한 정보를 클라이언트에게 보내줄 때 사용하는 DTO

    private Long id;
    private Long fromUserId;            // 친구 요청을 보낸 사용자의 ID
    private Long toUserId;              // 친구 요청을 받은 사용자의 ID
    private String fromUserName;        // 친구 요청을 보낸 사람의 이름/닉네임
    private String toUserName;          // 친구 요청을 받은 사람의 이름/닉네임
    private FriendRequestStatus status; // 친구 요청의 현재 상태
    private LocalDateTime createdAt;    // 이 친구 요청이 언제 생성되었는지(날짜+시간)
}

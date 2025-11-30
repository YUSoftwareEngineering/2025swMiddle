/*
    Project: CreateFriendRequestDto.java
    Author: 최은샘
    Date of creation: 2025.11.27
    Date of last update: 2025.11.27
*/

package com.example.SWEnginnering2025.dto.Friend;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateFriendRequestDto {  // “친구 요청을 새로 만들 때” 서버로 보낼 요청 바디를 담는 DTO

    private Long fromUserId; // 친구 요청을 보내는 쪽 사용자 ID(User PK)
    private Long toUserId;   // 친구 요청을 받는 쪽 사용자 ID(User PK)
}

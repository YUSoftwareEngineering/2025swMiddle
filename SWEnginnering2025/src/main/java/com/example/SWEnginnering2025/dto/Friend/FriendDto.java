/*
    Project: FriendDto.java
    Author: 최은샘
    Date of creation: 2025.11.27
    Date of last update: 2025.11.27
*/

package com.example.SWEnginnering2025.dto.Friend;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FriendDto {   // 친구 목록에서 친구 한 명의 정보를 표현하기 위한 DTO

    private Long id;        // 친구 사용자(User)의 고유 ID(PK)
    private String userId;  // 친구의 로그인 ID(계정 ID)
    private String name;    // 친구의 닉네임/이름
}
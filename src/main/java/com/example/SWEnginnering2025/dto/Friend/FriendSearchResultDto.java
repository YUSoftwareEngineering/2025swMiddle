/*
    Project: FriendSearchResultDto.java
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
public class FriendSearchResultDto {   // 친구 검색 결과에 대한 정보 담는 DTO

    private Long id;          // User 엔티티 PK
    private String userId;    // 로그인 ID
    private String name;      // 닉네임

    private boolean isFriend;  // 현재 로그인한 사용자와 이미 친구인지 여부
    private boolean requestSent; // 내가 이 사용자에게 이미 친구 요청을 보냈는지 여부
}

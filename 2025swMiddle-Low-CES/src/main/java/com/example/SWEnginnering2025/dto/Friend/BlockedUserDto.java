/*
    Project: BlockedUserDto.java
    Author: 최은샘
    Date of creation: 2025.11.27
    Date of last update: 2025.11.27
*/

package com.example.SWEnginnering2025.dto.Friend;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BlockedUserDto {  // “내가 차단한 사용자 한 명”에 대한 정보를 표현하는 DTO

    private Long id;                 // Block PK
    private Long blockedUserId;      // 차단된 사용자(User)의 고유 ID(PK)
    private String blockedUserName;  // 차단된 사용자의 이름/닉네임
    private LocalDateTime blockedAt; // 이 사용자를 언제 차단했는지(날짜+시간)
}

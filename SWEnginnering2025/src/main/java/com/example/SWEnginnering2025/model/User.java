/*
    Project: User.java
    Author: YHW
    Date of creation: 2025.11.21
    Date of last update: 2025.11.28 (사용자 설정 관련 추가)
*/

package com.example.SWEnginnering2025.model;

import jakarta.persistence.*;
import lombok.*;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor // 예비용
@Builder // 예비용
@Entity
@Table(name = "userTBL")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 로그인용 아이디 (중복 불가)
    @Column(unique = true, nullable = false)
    private String userId;

    // 사용자 이름/닉네임
    @Column(nullable = false)
    private String name; // 닉네임으로 사용됨

    // 이메일 (중복 불가)
    @Column(unique = true, nullable = false)
    private String email;

    // 비밀번호 (암호화된 값)
    @Column(nullable = false)
    private String password;

    // 생년월일
    @Column
    private String birth; // null 허용 (소셜 가입 시)

    // OAuth2 제공자 정보 (구글, 카카오 등)
    @Column
    private String provider;      // "google", "kakao" 등 (null 허용)
    @Column
    private String providerId;    // OAuth2 제공자 고유 ID (null 허용)

    @Builder.Default
    @Column(nullable = false)
    private boolean isNotificationEnabled = true;

    // [신규 추가 2] 친구 요청 정책 (기본값: ALL)
    @Builder.Default
    @Enumerated(EnumType.STRING)
    private FriendRequestPolicy friendRequestPolicy = FriendRequestPolicy.ALL;

    // [신규 추가 3] 설정 변경 메서드

    public void updateSettings(boolean isNotificationEnabled, FriendRequestPolicy policy) {
        this.isNotificationEnabled = isNotificationEnabled;
        this.friendRequestPolicy = policy;
    }
}
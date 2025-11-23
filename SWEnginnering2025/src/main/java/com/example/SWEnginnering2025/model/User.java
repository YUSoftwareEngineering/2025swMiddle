/*
    Project: User.java
    Author: YHW
    Date of creation: 2025.11.21
    Date of last update: 2025.11.23
*/

package com.example.SWEnginnering2025.model;

import jakarta.persistence.*;

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

    public User() {}

    // Getter/Setter
    public Long getId() { return id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getBirth() { return birth; }
    public void setBirth(String birth) { this.birth = birth; }

    public String getProvider() { return provider; }
    public void setProvider(String provider) { this.provider = provider; }

    public String getProviderId() { return providerId; }
    public void setProviderId(String providerId) { this.providerId = providerId; }
}
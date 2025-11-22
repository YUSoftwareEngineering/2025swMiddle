/*
    Project: User.java
    Author: YHW
	Date of creation: 2025.11.21
	Date of last update: 2025.11.22
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

    // 사용자 이름
    @Column(nullable = false)
    private String name;

    // 이메일 (중복 불가)
    @Column(unique = true, nullable = false)
    private String email;

    // 비밀번호
    @Column(nullable = false)
    private String password;

    // 생년월일 (yyyy-MM-dd 형식 문자열로 저장)
    @Column(nullable = false)
    private String birth;

    public User() {}

    public User(String userId, String name, String email, String password, String birth) {
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.password = password;
        this.birth = birth;
    }

    // Getter/Setter
    public Long getId() {
        return id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getBirth() {
        return birth;
    }

    public void setBirth(String birth) {
        this.birth = birth;
    }
}
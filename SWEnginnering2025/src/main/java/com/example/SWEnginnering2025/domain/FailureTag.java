package com.example.SWEnginnering2025.domain;

import jakarta.persistence.*;

@Entity
@Table(name = "failure_tag")
public class FailureTag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 기본 태그면 null, 사용자 태그면 userId 세팅
    private Long userId;

    @Column(nullable = false, length = 100, unique = false)
    private String name;

    // 기본 제공 태그 여부
    @Column(nullable = false)
    private boolean builtIn;

    protected FailureTag() {
    }

    public FailureTag(Long userId, String name, boolean builtIn) {
        this.userId = userId;
        this.name = name;
        this.builtIn = builtIn;
    }

    public Long getId() {
        return id;
    }

    public Long getUserId() {
        return userId;
    }

    public String getName() {
        return name;
    }

    public boolean isBuiltIn() {
        return builtIn;
    }
}

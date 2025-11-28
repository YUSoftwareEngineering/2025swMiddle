/*Project: AttachmentController.java
        Author: 한지윤
        Date of creation: 2025.11.23
        Date of last update: 2025.11.23
                */


package com.example.SWEnginnering2025.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "failure_tag")
@Getter
@NoArgsConstructor
public class FailureTag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long Tagid;

    // 기본 태그면 null, 사용자 태그면 userId 세팅
    private Long userId;

    @Column(nullable = false, length = 100, unique = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FailureCategory category;

    // 기본 제공 태그 여부
    @Column(nullable = false)
    private boolean builtIn;

    public FailureTag(Long userId, String name, boolean builtIn) {
        this.userId = userId;
        this.name = name;
        this.builtIn = builtIn;
    }
}

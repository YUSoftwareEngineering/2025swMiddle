package com.example.SWEnginnering2025.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "coaching_logs")
public class CoachingLog {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    @Column(columnDefinition = "TEXT") // 긴 글 저장 가능하게 설정
    private String message; // AI가 해준 조언 내용

    @Enumerated(EnumType.STRING)
    private GoalCategory recommendedCategory; // AI가 추천한 카테고리

    private LocalDateTime createdAt;

    public CoachingLog(Long userId, String message, GoalCategory recommendedCategory) {
        this.userId = userId;
        this.message = message;
        this.recommendedCategory = recommendedCategory;
        this.createdAt = LocalDateTime.now();
    }
}
package com.example.SWEnginnering2025.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "student_bot_history")
public class StudentBotHistory {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String question; // 사용자의 질문

    @Column(columnDefinition = "TEXT")
    private String answer;   // AI의 답변

    // 사용자가 선택한 난이도를 저장 (Enum 사용)
    @Enumerated(EnumType.STRING)
    private Difficulty difficulty;

    private LocalDateTime createdAt;

    // 생성자
    public StudentBotHistory(Long userId, String question, String answer, Difficulty difficulty) {
        this.userId = userId;
        this.question = question;
        this.answer = answer;
        this.difficulty = difficulty;
        this.createdAt = LocalDateTime.now();
    }
}
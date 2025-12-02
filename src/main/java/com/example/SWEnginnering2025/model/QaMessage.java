package com.example.SWEnginnering2025.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "qa_message")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class QaMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 어떤 히스토리에 속한 메시지인지
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "history_id", nullable = false)
    @Setter
    private QaHistory history;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private QaMessageRole role; // USER / BOT

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    public static QaMessage userMessage(String text) {
        return QaMessage.builder()
                .role(QaMessageRole.USER)
                .content(text)
                .createdAt(LocalDateTime.now())
                .build();
    }

    public static QaMessage botMessage(String text) {
        return QaMessage.builder()
                .role(QaMessageRole.BOT)
                .content(text)
                .createdAt(LocalDateTime.now())
                .build();
    }
}

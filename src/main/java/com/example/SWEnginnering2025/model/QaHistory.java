package com.example.SWEnginnering2025.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "qa_history")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class QaHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // JWT에서 추출한 User.id 기준 (User 엔티티 참조 대신 단순 Long으로 유지)
    @Column(nullable = false)
    private Long userId;

    // 목록에서 보이는 제목(첫 질문 요약)
    @Column(nullable = false, length = 200)
    private String title;

    // 검색용 요약/키워드 (첫 질문 일부)
    @Column(nullable = false, length = 500)
    private String summary;

    @Column(nullable = false)
    private LocalDateTime startedAt;

    @Column(nullable = false)
    private LocalDateTime lastUpdatedAt;

    @Builder.Default
    @Column(nullable = false)
    private boolean favorite = false;

    @Builder.Default
    @Column(nullable = false)
    private long messageCount = 0L; // 질문/답변 메시지 총 개수

    @OneToMany(mappedBy = "history", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("createdAt ASC")
    @Builder.Default
    private List<QaMessage> messages = new ArrayList<>();

    // === 연관 메서드 ===
    public void addMessage(QaMessage message) {
        this.messages.add(message);
        message.setHistory(this);
        this.messageCount = this.messageCount + 1;
        this.lastUpdatedAt = LocalDateTime.now();
    }

    public void updateTitleIfEmpty(String maybeTitle) {
        if (this.title == null || this.title.isBlank()) {
            this.title = maybeTitle;
        }
    }

    public void toggleFavorite(boolean value) {
        this.favorite = value;
    }
}

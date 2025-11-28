/*Project: AttachmentController.java
        Author: 한지윤
        Date of creation: 2025.11.23
        Date of last update: 2025.11.23
                */

package com.example.SWEnginnering2025.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "failure_log")
@NoArgsConstructor // 매개변수 없는 생성자
@Setter
@Getter // get함수 자동 생성
public class FailureLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long Logid;

    private Long userId;

    private Long goalId;

    // 실패가 발생한 날짜 (캘린더/분석용)
    private LocalDate failedDate;

    @Column(columnDefinition = "TEXT")
    private String memo;

    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime failedAt;

    @ManyToMany
    @JoinTable(
            name = "failure_log_tag_map",
            joinColumns = @JoinColumn(name = "failure_id"),
            inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    private Set<FailureTag> tags = new HashSet<>();

    public FailureLog(Long userId,
                      Long goalId,
                      LocalDate failedDate,
                      String memo,
                      LocalDateTime failedAt) {
        this.userId = userId;
        this.goalId = goalId;
        this.failedDate = failedDate;
        this.memo = memo;
        this.failedAt = failedAt;
    }

    public void addTag(FailureTag tag) {
        this.tags.add(tag);
    }
}

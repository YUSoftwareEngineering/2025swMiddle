package com.example.SWEnginnering2025.domain;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "failure_log")
public class FailureLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long failureId;

    private Long userId;

    private Long goalId;

    // 실패가 발생한 날짜 (캘린더/분석용)
    private LocalDate failedDate;

    @Column(columnDefinition = "TEXT")
    private String memo;

    @Column(nullable = false)
    private LocalDateTime failedAt;

    @ManyToMany
    @JoinTable(
            name = "failure_log_tag_map",
            joinColumns = @JoinColumn(name = "failure_id"),
            inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    private Set<FailureTag> tags = new HashSet<>();

    protected FailureLog() {
    }

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

    public Long getFailureId() {
        return failureId;
    }

    public Long getUserId() {
        return userId;
    }

    public Long getGoalId() {
        return goalId;
    }

    public LocalDate getFailedDate() {
        return failedDate;
    }

    public String getMemo() {
        return memo;
    }

    public LocalDateTime getFailedAt() {
        return failedAt;
    }

    public Set<FailureTag> getTags() {
        return tags;
    }
}

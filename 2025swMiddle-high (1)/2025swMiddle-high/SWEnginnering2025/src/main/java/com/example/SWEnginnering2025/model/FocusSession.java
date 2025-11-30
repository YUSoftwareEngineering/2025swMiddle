/*
    Project: FocusSession.java
    Author: YHW
    Date of creation: 2025.11.23
    Date of last update: 2025.11.23
*/

package com.example.SWEnginnering2025.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FocusSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId; // 현재 인증된 사용자 ID

    @Column(nullable = false)
    private String goal; // 세션 목표

    @Enumerated(EnumType.STRING)
    private SessionStatus status; // 현재 상태 (STARTED, PAUSED, COMPLETED)

    @Column(nullable = true)
    private LocalDateTime startTime; // 세션 시작 또는 마지막 재개 시간

    private LocalDateTime pausedAt; // 마지막 일시정지 시간

    private LocalDateTime endedAt; // 세션 종료 시간

    private Long totalDurationSeconds = 0L; // 누적 집중 시간 (초)
}
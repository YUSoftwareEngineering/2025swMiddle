/*
    Project: FocusSessionResponse.java
    Author: YHW
    Date of creation: 2025.11.23
    Date of last update: 2025.11.23
*/

package com.example.SWEnginnering2025.dto;

import com.example.SWEnginnering2025.model.SessionStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class FocusSessionResponse {
    private Long sessionId;
    private String goal;
    private SessionStatus status;
    private LocalDateTime startTime;
    private Long totalDurationSeconds; // 누적 집중 시간
    private Long currentElapsedSeconds; // STARTED 상태일 때 유효한 경과 시간
}
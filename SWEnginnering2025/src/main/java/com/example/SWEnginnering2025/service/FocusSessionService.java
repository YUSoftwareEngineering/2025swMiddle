/*
    Project: FocusSessionService.java
    Author: YHW
    Date of creation: 2025.11.23
    Date of last update: 2025.11.23
*/

package com.example.SWEnginnering2025.service;

import com.example.SWEnginnering2025.dto.FocusSessionResponse;
import com.example.SWEnginnering2025.dto.FocusSessionStartRequest;
import com.example.SWEnginnering2025.model.FocusSession;
import com.example.SWEnginnering2025.model.SessionStatus;
import com.example.SWEnginnering2025.repository.FocusSessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

@Service
@RequiredArgsConstructor
public class FocusSessionService {

    private final FocusSessionRepository focusSessionRepository;

    private Long getCurrentUserId() {
        return 1L;
    }

    // 포커스 세션 시작
    @Transactional
    public FocusSessionResponse startSession(FocusSessionStartRequest request) {
        Long userId = getCurrentUserId();

        FocusSession session = FocusSession.builder()
                .userId(userId)
                .goal(request.getGoal())
                .status(SessionStatus.STARTED)
                .startTime(LocalDateTime.now())
                .build();

        FocusSession savedSession = focusSessionRepository.save(session);

        return buildResponse(savedSession);
    }

    // 포커스 세션 중지/일시정지(PAUSE): 정지 혹은 화면 백그라운드 전환시
    @Transactional
    public FocusSessionResponse pauseSession(Long sessionId) {
        FocusSession session = focusSessionRepository.findById(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("Session not found: " + sessionId));

        if (session.getStatus() != SessionStatus.STARTED) {
            throw new IllegalStateException("Session is not currently running.");
        }

        LocalDateTime now = LocalDateTime.now();

        // 1. 누적 집중 시간 계산 및 합산
        long elapsedSeconds = ChronoUnit.SECONDS.between(session.getStartTime(), now);
        session.setTotalDurationSeconds(session.getTotalDurationSeconds() + elapsedSeconds);

        // 2. 상태 및 시간 업데이트
        session.setStatus(SessionStatus.PAUSED);
        session.setPausedAt(now);
        session.setStartTime(null); // PAUSED 상태에서는 StartTime을 초기화

        return buildResponse(focusSessionRepository.save(session));
    }

    //Resume
    @Transactional
    public FocusSessionResponse resumeSession(Long sessionId) {
        FocusSession session = focusSessionRepository.findById(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("Session not found: " + sessionId));

        if (session.getStatus() != SessionStatus.PAUSED) {
            throw new IllegalStateException("Session is not paused and cannot be resumed.");
        }

        // 1. 상태를 STARTED로 변경하고 시작 시간 갱신
        session.setStatus(SessionStatus.STARTED);
        session.setStartTime(LocalDateTime.now());
        session.setPausedAt(null);

        return buildResponse(focusSessionRepository.save(session));
    }

    // 포커스 세션 완료
    @Transactional
    public FocusSessionResponse completeSession(Long sessionId) {
        FocusSession session = focusSessionRepository.findById(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("Session not found: " + sessionId));

        // STARTED 상태라면 남은 시간을 누적 합산해야 함
        if (session.getStatus() == SessionStatus.STARTED) {
            long elapsedSeconds = ChronoUnit.SECONDS.between(session.getStartTime(), LocalDateTime.now());
            session.setTotalDurationSeconds(session.getTotalDurationSeconds() + elapsedSeconds);
        }

        // 최종 상태 업데이트
        session.setStatus(SessionStatus.COMPLETED);
        session.setEndedAt(LocalDateTime.now());
        session.setStartTime(null);
        session.setPausedAt(null);

        return buildResponse(focusSessionRepository.save(session));
    }

    // 응답 DTO 생성
    private FocusSessionResponse buildResponse(FocusSession session) {
        // STARTED 상태일 경우에만 현재 경과 시간을 계산하여 DTO에 포함
        Long currentElapsedSeconds = 0L;
        if (session.getStatus() == SessionStatus.STARTED && session.getStartTime() != null) {
            currentElapsedSeconds = ChronoUnit.SECONDS.between(session.getStartTime(), LocalDateTime.now());
        }

        return FocusSessionResponse.builder()
                .sessionId(session.getId())
                .goal(session.getGoal())
                .status(session.getStatus())
                .startTime(session.getStartTime())
                .totalDurationSeconds(session.getTotalDurationSeconds())
                .currentElapsedSeconds(currentElapsedSeconds)
                .build();
    }
}
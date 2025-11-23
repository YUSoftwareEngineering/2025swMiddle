package com.example.SWEnginnering2025.domain;

public enum GoalStatus {
    PENDING,          // 아직 안 한 상태
    IN_PROGRESS,      // 진행 중 (필요하면)
    PARTIAL_SUCCESS,  // 부분 달성
    COMPLETED,        // 완료
    FAILED
}
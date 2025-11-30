/*
    Project: FocusSessionRepository.java
    Author: YHW
    Date of creation: 2025.11.23
    Date of last update: 2025.11.30
*/

package com.example.SWEnginnering2025.repository;

import com.example.SWEnginnering2025.model.FocusSession;
import com.example.SWEnginnering2025.model.SessionStatus; // 11.30 추가
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FocusSessionRepository extends JpaRepository<FocusSession, Long> {
    List<FocusSession> findAllByUserIdAndStatusOrderByEndedAtDesc(Long userId, SessionStatus status);
}
package com.example.SWEnginnering2025.repository;

import com.example.SWEnginnering2025.model.CoachingLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CoachingLogRepository extends JpaRepository<CoachingLog, Long> {
    // 기본 기능(save, findAll 등)은 자동으로 제공됩니다.
}
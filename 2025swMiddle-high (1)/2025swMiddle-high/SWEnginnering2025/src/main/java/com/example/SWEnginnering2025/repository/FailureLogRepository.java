/*
    Project: FailureLogRepository.java
    Author: 한지윤 (Modified for AI Coaching)
    Date of creation: 2025.11.23
    Date of last update: 2025.11.28
*/
package com.example.SWEnginnering2025.repository;

import com.example.SWEnginnering2025.model.FailureLog;
import com.example.SWEnginnering2025.model.GoalCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface FailureLogRepository extends JpaRepository<FailureLog, Long> {


    List<FailureLog> findByUserId(Long userId);

    List<FailureLog> findByUserIdAndFailedDateBetween(Long userId, LocalDate from, LocalDate to);


    // [신규 추가] AI 코칭을 위한 통계 쿼리
    // 1. 코칭 서비스와의 호환성을 위해 추가 (findByUserId와 같은 기능)
    List<FailureLog> findAllByUserId(Long userId);

    // 2. 가장 많이 실패한 카테고리 조회
    // (FailureLog와 Goal 테이블을 조인하여 카테고리별 실패 횟수를 셉니다)
    @Query("SELECT g.category " +
            "FROM FailureLog f " +
            "JOIN Goal g ON f.goalId = g.id " +
            "WHERE f.userId = :userId " +
            "GROUP BY g.category " +
            "ORDER BY COUNT(g) DESC")
    List<GoalCategory> findMostFailedCategory(@Param("userId") Long userId);

    // 3. 가장 많이 등장한 실패 원인 태그 조회
    @Query("SELECT f.reasonTag " +
            "FROM FailureLog f " +
            "WHERE f.userId = :userId " +
            "GROUP BY f.reasonTag " +
            "ORDER BY COUNT(f) DESC")
    List<String> findTopFailureTags(@Param("userId") Long userId);
}
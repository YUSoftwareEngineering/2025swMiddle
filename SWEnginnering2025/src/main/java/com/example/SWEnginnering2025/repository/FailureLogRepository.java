/*Project: AttachmentController.java
        Author: 한지윤
        Date of creation: 2025.11.23
        Date of last update: 2025.11.23
                */
package com.example.SWEnginnering2025.repository;

import com.example.SWEnginnering2025.model.FailureLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface FailureLogRepository extends JpaRepository<FailureLog, Long> {
    //userId가 같은 실패 로그들을 전부 찾아서 list로 반환해라 -> 한 유저가 그동안 남긴 실패 기록 전체 조회
    List<FailureLog> findByUserId(Long userId);
    List<FailureLog> findByUserIdAndGoalId(Long userId, Long goalId);
    //특정 유저의 기간별 실패 로그를 조회하는 기능
    List<FailureLog> findByUserIdAndFailedDateBetween(Long userId, LocalDate from, LocalDate to);
}
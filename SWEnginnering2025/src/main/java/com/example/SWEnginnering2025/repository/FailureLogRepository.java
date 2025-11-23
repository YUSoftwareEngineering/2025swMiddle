package com.example.SWEnginnering2025.repository;

import com.example.SWEnginnering2025.domain.FailureLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface FailureLogRepository extends JpaRepository<FailureLog, Long> {

    List<FailureLog> findByUserId(Long userId);

    List<FailureLog> findByUserIdAndFailedDateBetween(Long userId, LocalDate from, LocalDate to);
}

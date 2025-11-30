package com.example.SWEnginnering2025.repository;

import com.example.SWEnginnering2025.model.StudentBotHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StudentBotHistoryRepository extends JpaRepository<StudentBotHistory, Long> {
    // 기본 기능만 있으면 됩니다.
}
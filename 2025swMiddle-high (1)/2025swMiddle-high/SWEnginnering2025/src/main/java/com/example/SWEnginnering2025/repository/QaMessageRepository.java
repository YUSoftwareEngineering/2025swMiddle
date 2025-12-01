package com.example.SWEnginnering2025.repository;

import com.example.SWEnginnering2025.model.QaMessage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QaMessageRepository extends JpaRepository<QaMessage, Long> {

    List<QaMessage> findByHistoryIdOrderByCreatedAtAsc(Long historyId);
}

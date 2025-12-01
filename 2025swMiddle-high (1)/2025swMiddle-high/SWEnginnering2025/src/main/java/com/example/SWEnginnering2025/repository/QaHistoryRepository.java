package com.example.SWEnginnering2025.repository;

import com.example.SWEnginnering2025.model.QaHistory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QaHistoryRepository extends JpaRepository<QaHistory, Long> {

    Page<QaHistory> findByUserIdOrderByLastUpdatedAtDesc(Long userId, Pageable pageable);

    Page<QaHistory> findByUserIdAndFavoriteOrderByLastUpdatedAtDesc(Long userId, boolean favorite, Pageable pageable);

    Page<QaHistory> findByUserIdAndTitleContainingIgnoreCaseOrderByLastUpdatedAtDesc(Long userId, String keyword, Pageable pageable);

    Page<QaHistory> findByUserIdAndSummaryContainingIgnoreCaseOrderByLastUpdatedAtDesc(Long userId, String keyword, Pageable pageable);

    long countByUserId(Long userId);
}

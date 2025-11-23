/*Project: AttachmentController.java
        Author: 이채민
        Date of creation: 2025.11.23
        Date of last update: 2025.11.23
                */

package com.example.SWEnginnering2025.repository;

import com.example.SWEnginnering2025.domain.Goal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface GoalRepository extends JpaRepository<Goal, Long> {

    // 유저ID, 날짜, 제목 3박자가 다 똑같은 게 있는지 확인
    boolean existsByUserIdAndTargetDateAndTitle(Long userId, LocalDate targetDate, String title);
    List<Goal> findAllByUserIdAndTargetDate(Long userId, LocalDate targetDate);
}
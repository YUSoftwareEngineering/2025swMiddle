/*
   Project:GoalRoomMessageRepository.java
   Author: 윤나영
  Date of creation: 2025.11.30
  Date of last update: 2025.11.30
*/
package com.example.SWEnginnering2025.repository.goalroom;


import com.example.SWEnginnering2025.model.goalroom.GoalRoomMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.*;

public interface GoalRoomMessageRepository extends JpaRepository<GoalRoomMessage, Long> {

    Page<GoalRoomMessage> findByGoalRoomId(Long roomId, Pageable pageable);
}
/*
   Project:GoalRoomRepository.java
   Author: 윤나영
  Date of creation: 2025.11.30
  Date of last update: 2025.11.30
*/
package com.example.SWEnginnering2025.repository.goalroom;

import com.example.SWEnginnering2025.model.goalroom.GoalRoom;
import com.example.SWEnginnering2025.model.goalroom.GoalRoomVisibility;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GoalRoomRepository extends JpaRepository<GoalRoom, Long> {

    List<GoalRoom> findByVisibility(GoalRoomVisibility visibility);

    List<GoalRoom> findByVisibilityAndRoomNameContainingIgnoreCase(GoalRoomVisibility visibility, String keyword);

    List<GoalRoom> findByRoomNameContainingIgnoreCase(String keyword);
}
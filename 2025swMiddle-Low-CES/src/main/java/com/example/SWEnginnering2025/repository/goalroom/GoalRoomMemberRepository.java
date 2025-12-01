/*
   Project:GoalRoomMemberRepository.java
   Author: 윤나영
  Date of creation: 2025.11.30
  Date of last update: 2025.11.30
*/
package com.example.SWEnginnering2025.repository.goalroom;
import com.example.SWEnginnering2025.model.goalroom.GoalRoomMember;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GoalRoomMemberRepository extends JpaRepository<GoalRoomMember, Long> {

    boolean existsByGoalRoomIdAndUserId(Long roomId, Long userId);

    int countByGoalRoomId(Long roomId);

    void deleteByGoalRoomIdAndUserId(Long roomId, Long userId);

    List<GoalRoomMember> findByUserId(Long userId);

    List<GoalRoomMember> findByGoalRoomId(Long roomId);
}
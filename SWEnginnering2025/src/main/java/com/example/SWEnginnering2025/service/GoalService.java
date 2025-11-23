package com.example.SWEnginnering2025.service;

import com.example.SWEnginnering2025.domain.Goal;
import com.example.SWEnginnering2025.dto.CreateGoalRequest;
import com.example.SWEnginnering2025.dto.GoalResponse;
import com.example.SWEnginnering2025.repository.GoalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service // "나 서비스야!" 라고 명찰 달기
@RequiredArgsConstructor // Repository를 자동으로 연결해줌
public class GoalService {

    private final GoalRepository goalRepository;

    // 1. 목표 생성
    @Transactional
    public GoalResponse createGoal(CreateGoalRequest request) {
        // 상자(DTO)에서 꺼내서 진짜 데이터(Entity)로 변환
        Goal goal = Goal.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .targetDate(request.getTargetDate())
                .category(request.getCategory())
                .isNotificationEnabled(request.isNotificationEnabled())
                .scheduledTime(request.getScheduledTime())
                .userId(1L) // 임시 유저 ID
                .build();

        // 저장
        Goal savedGoal = goalRepository.save(goal);

        // 결과 상자(DTO)로 포장해서 반환
        return GoalResponse.from(savedGoal);
    }
    // 2. 목표 수정
    @Transactional
    public GoalResponse updateGoal(Long id, CreateGoalRequest request) {
        Goal goal = goalRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 목표가 없습니다. ID=" + id));
        // 내용 수정 (더티 체킹: 저장(save) 안 불러도 알아서 DB가 바뀜)
        goal.update(request.getTitle(), request.getDescription(), request.getTargetDate(),
                request.getCategory(), request.isNotificationEnabled(), request.getScheduledTime());

        return GoalResponse.from(goal);
    }

    // 3. 목표 삭제
    @Transactional
    public void deleteGoal(Long id) {
        // DB에서 목표 찾기
        Goal goal = goalRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 목표가 없습니다. ID=" + id));

        // 삭제
        goalRepository.delete(goal);
    }
}
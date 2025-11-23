package com.example.SWEnginnering2025.service;

import com.example.SWEnginnering2025.domain.Goal;
import com.example.SWEnginnering2025.dto.CreateGoalRequest;
import com.example.SWEnginnering2025.dto.GoalResponse;
import com.example.SWEnginnering2025.dto.GoalStatusRequest;
import com.example.SWEnginnering2025.repository.GoalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.SWEnginnering2025.domain.GoalStatus;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;


@Service // "나 서비스야!" 라고 명찰 달기
@RequiredArgsConstructor // Repository를 자동으로 연결해줌
public class GoalService {
    private final GoalRepository goalRepository;

    private Goal findGoalById(Long id) {
        return goalRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 목표가 없습니다. ID=" + id));
    }

    // 1. 목표 생성
    @Transactional
    public GoalResponse createGoal(CreateGoalRequest request) {
        // 중복 체크 로직
        boolean isDuplicate = goalRepository.existsByUserIdAndTargetDateAndTitle(
                1L, request.getTargetDate(), request.getTitle());

        if (isDuplicate) {
            //409 Conflict 에러
            throw new ResponseStatusException(HttpStatus.CONFLICT, "이미 유사한 목표가 있습니다.");
        }
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
        Goal goal = findGoalById(id);
        // 내용 수정 (더티 체킹: 저장(save) 안 불러도 알아서 DB가 바뀜)
        goal.update(request.getTitle(), request.getDescription(), request.getTargetDate(),
                request.getCategory(), request.isNotificationEnabled(), request.getScheduledTime());

        return GoalResponse.from(goal);
    }

    // 3. 목표 삭제
    @Transactional
    public void deleteGoal(Long id) {
        // 1. DB에서 목표 찾기 (없으면 에러)
        Goal goal = findGoalById(id);
        // 2. 삭제하기
        goalRepository.delete(goal);
    }

    // 4. 목표 상태 변경
    @Transactional
    public GoalResponse updateStatus(Long id, GoalStatusRequest request) {

        Goal goal = findGoalById(id);
        goal.changeStatus(request.getStatus(), request.getStatusMemo(), request.getProofUrl());
        return GoalResponse.from(goal);
    }

    // 5. 실패 기록 (Goal 상태를 FAILED로 변경)
    @Transactional
    public void markGoalAsFailed(Long goalId){
        Goal goal = findGoalById(goalId);

        // GoalStatus enum 안에 FAILED 있는지 확인해야 함
        goal.changeStatus(GoalStatus.FAILED, "FailureLogService 자동 기록", null);
    }
}


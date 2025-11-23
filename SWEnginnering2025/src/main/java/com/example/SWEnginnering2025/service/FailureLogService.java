package com.example.SWEnginnering2025.service;

import com.example.SWEnginnering2025.domain.FailureLog;
import com.example.SWEnginnering2025.domain.FailureTag;
import com.example.SWEnginnering2025.dto.failure.CreateTagRequest;
import com.example.SWEnginnering2025.dto.failure.FailureLogResponse;
import com.example.SWEnginnering2025.dto.failure.FailureTagDto;
import com.example.SWEnginnering2025.dto.failure.LogFailureRequest;
import com.example.SWEnginnering2025.repository.FailureLogRepository;
import com.example.SWEnginnering2025.repository.FailureTagRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

import static java.util.stream.Collectors.toList;

@Service
public class FailureLogService {

    private final FailureTagRepository failureTagRepository;
    private final FailureLogRepository failureLogRepository;
    private final GoalService goalService; // 상태 FAILED로 바꾸는 용도

    public FailureLogService(FailureTagRepository failureTagRepository,
                             FailureLogRepository failureLogRepository,
                             GoalService goalService) {
        this.failureTagRepository = failureTagRepository;
        this.failureLogRepository = failureLogRepository;
        this.goalService = goalService;
    }

    // 1) 기본 + 사용자 태그 조회
    @Transactional(readOnly = true)
    public List<FailureTagDto> getFailureTags(Long userId) {
        List<FailureTag> tags = failureTagRepository.findByBuiltInTrueOrUserId(userId);
        return tags.stream()
                .map(t -> new FailureTagDto(t.getId(), t.getName(), t.isBuiltIn()))
                .collect(toList());
    }

    // 2) 커스텀 태그 생성
    @Transactional
    public FailureTagDto createFailureTag(CreateTagRequest request) {
        String name = request.getName().trim();
        if (name.isEmpty()) {
            throw new IllegalArgumentException("태그 이름은 비어 있을 수 없습니다.");
        }

        // 같은 유저 + 같은 이름 태그가 있으면 재사용
        var existing = failureTagRepository.findByUserIdAndName(request.getUserId(), name);
        if (existing.isPresent()) {
            FailureTag tag = existing.get();
            return new FailureTagDto(tag.getId(), tag.getName(), tag.isBuiltIn());
        }

        FailureTag tag = new FailureTag(request.getUserId(), name, false);
        FailureTag saved = failureTagRepository.save(tag);
        return new FailureTagDto(saved.getId(), saved.getName(), saved.isBuiltIn());
    }

    // 3) 실패 로그 기록
    @Transactional
    public FailureLogResponse logFailure(LogFailureRequest request) {

        if (request.getTagIds() == null || request.getTagIds().isEmpty()) {
            throw new IllegalArgumentException("최소 1개 이상의 태그를 선택해야 합니다.");
        }

        var tags = failureTagRepository.findAllById(request.getTagIds());
        if (tags.isEmpty()) {
            throw new IllegalArgumentException("선택한 태그를 찾을 수 없습니다.");
        }

        FailureLog log = new FailureLog(
                request.getUserId(),
                request.getGoalId(),
                request.getDate(),
                request.getMemo(),
                LocalDateTime.now()
        );

        tags.forEach(log::addTag);

        FailureLog saved = failureLogRepository.save(log);

        // 목표 상태를 FAILED로 변경 (GoalService 안 구현 필요)
        goalService.markGoalAsFailed(request.getGoalId());

        List<FailureTagDto> tagDtos = saved.getTags().stream()
                .map(t -> new FailureTagDto(t.getId(), t.getName(), t.isBuiltIn()))
                .collect(toList());

        return new FailureLogResponse(
                saved.getFailureId(),
                saved.getUserId(),
                saved.getGoalId(),
                saved.getFailedDate(),
                saved.getMemo(),
                saved.getFailedAt(),
                tagDtos
        );
    }
}

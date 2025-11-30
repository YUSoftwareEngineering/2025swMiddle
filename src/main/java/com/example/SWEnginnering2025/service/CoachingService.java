package com.example.SWEnginnering2025.service;

import com.example.SWEnginnering2025.model.CoachingLog;
import com.example.SWEnginnering2025.model.FailureLog;
import com.example.SWEnginnering2025.model.GoalCategory;
import com.example.SWEnginnering2025.repository.CoachingLogRepository;
import com.example.SWEnginnering2025.repository.FailureLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CoachingService {

    private final FailureLogRepository failureLogRepository;
    private final CoachingLogRepository coachingLogRepository;

    // [수정 1] OpenAiService 삭제 -> GeminiService 추가
    private final GeminiService geminiService;

    @Transactional
    public String generatePersonalizedAdvice(Long userId) {
        // 1. [데이터 수집]
        List<FailureLog> logs = failureLogRepository.findAllByUserId(userId);
        List<String> topTags = failureLogRepository.findTopFailureTags(userId);
        List<GoalCategory> topCategories = failureLogRepository.findMostFailedCategory(userId);

        if (logs.isEmpty()) {
            return "아직 충분한 활동 데이터가 없습니다. 목표를 세우고 실천해 보세요!";
        }

        // [안전하게 값 꺼내기]
        String mainReason = "알 수 없음";
        if (!topTags.isEmpty() && topTags.get(0) != null) {
            mainReason = topTags.get(0);
        }

        String weakCategory = "전반적인";
        GoalCategory topCategory = null;
        if (!topCategories.isEmpty()) {
            topCategory = topCategories.get(0);
            if (topCategory != null) {
                weakCategory = topCategory.toString();
            }
        }

        // 2. [프롬프트 작성]
        String prompt = String.format(
                "사용자가 '%s' 활동에서 주로 실패하고 있습니다. " +
                        "주된 실패 원인은 '%s'입니다. " +
                        "이 사용자에게 따뜻한 위로와 함께, 해당 문제를 극복할 수 있는 " +
                        "구체적이고 실천 가능한 솔루션(행동 지침) 1가지를 200자 이내로 제안해 주세요.",
                weakCategory, mainReason
        );

        // 3. [수정 2] Gemini에게 물어보기!
        String aiAdvice = geminiService.chat(prompt);

        // 4. [저장]
        GoalCategory recommendedCategory = GoalCategory.ETC;
        if (topCategory != null) {
            recommendedCategory = topCategory;
        }

        coachingLogRepository.save(new CoachingLog(userId, aiAdvice, recommendedCategory));

        return aiAdvice;
    }
}
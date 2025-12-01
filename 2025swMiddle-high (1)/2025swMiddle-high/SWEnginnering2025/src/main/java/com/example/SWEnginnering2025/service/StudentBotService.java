package com.example.SWEnginnering2025.service;

import com.example.SWEnginnering2025.dto.studentbot.StudentBotAnswerDto;
import com.example.SWEnginnering2025.dto.studentbot.StudentBotAskRequest;
import com.example.SWEnginnering2025.model.QaHistory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class StudentBotService {

    private final GeminiService geminiService;
    private final QAStorageService qaStorageService;

    /**
     * Use case #49: Ask Question to Bot
     * - 질문 -> Gemini 호출 -> 답변 -> QAStorage.autoSave 로 히스토리에 저장
     */
    @Transactional
    public StudentBotAnswerDto askQuestion(Long userId, StudentBotAskRequest request) {
        String question = request.getQuestionText();
        if (question == null || question.isBlank()) {
            throw new IllegalArgumentException("질문 내용을 입력해주세요.");
        }

        // 간단 프롬프트 (나중에 학습/난이도 등 메타데이터 붙이면 확장 가능)
        String prompt = "당신은 친절한 학습 도우미입니다. 학생의 질문에 이해하기 쉽게 설명해주세요.\n\n질문: "
                + question;

        String answer = geminiService.chat(prompt);

        // 히스토리에 저장 (새 세션 or 기존 세션 이어서)
        QaHistory history = qaStorageService.autoSave(
                userId,
                request.getHistoryId(),
                question,
                answer
        );

        return StudentBotAnswerDto.builder()
                .historyId(history.getId())
                .questionText(question)
                .answerText(answer)
                .answeredAt(LocalDateTime.now())
                .build();
    }
}

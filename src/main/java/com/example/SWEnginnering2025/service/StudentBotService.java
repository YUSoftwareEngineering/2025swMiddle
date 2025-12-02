package com.example.SWEnginnering2025.service;

import com.example.SWEnginnering2025.dto.studentbot.StudentBotAnswerDto;
import com.example.SWEnginnering2025.dto.studentbot.StudentBotAskRequest;
import com.example.SWEnginnering2025.model.Difficulty;
import com.example.SWEnginnering2025.model.QaHistory;
import com.example.SWEnginnering2025.model.StudentBotHistory;
import com.example.SWEnginnering2025.repository.StudentBotHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class StudentBotService {

    private final GeminiService geminiService;
    private final StudentBotHistoryRepository studentBotHistoryRepository;
    private final QAStorageService qaStorageService;

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

    // [핵심 수정] 프롬프트 엔지니어링 업그레이드!
    private String createPrompt(String userMessage, Difficulty difficulty) {
        String levelDescription = "";

        // 난이도 설정 (답변이나 역질문의 수준 결정)
        if (difficulty == Difficulty.ELEMENTARY) {
            levelDescription = "초등학생도 이해하기 쉬운 용어와 친절한 말투";
        } else if (difficulty == Difficulty.INTERMEDIATE) {
            levelDescription = "고등학생 수준의 개념적 이해와 논리적인 말투";
        } else {
            levelDescription = "전공자 수준의 전문 용어 사용과 깊이 있는 분석";
        }

        return String.format(
                "사용자 입력: \"%s\"\n" +
                        "설정된 난이도: %s\n\n" +
                        "[당신의 역할]\n" +
                        "당신은 사용자의 학습을 돕는 '지능형 학생봇'입니다. 상황에 따라 유연하게 대처하세요.\n\n" +
                        "[행동 지침]\n" +
                        "1. 사용자가 '질문'을 했다면:\n" +
                        "   - 위 난이도(%s)에 맞춰서 명확하게 답변해주세요.\n" +
                        "   - 답변 끝에는 학습을 확장할 수 있는 '꼬리 질문' 3개를 제안해주세요.\n" +
                        "   - 답변의 근거가 되는 출처나 핵심 키워드를 맨 마지막에 표시해주세요.\n\n" +
                        "2. 사용자가 어떤 개념을 '설명'하거나 '가르쳐' 줬다면:\n" +
                        "   - \"오! 그렇군요!\", \"아하, 이제 이해가 가요!\" 처럼 열정적인 리액션을 먼저 해주세요.\n" +
                        "   - 사용자의 설명을 요약해서 당신이 제대로 이해했는지 확인해주세요.\n" +
                        "   - 그 내용과 관련해서 당신이 궁금한 점이나, 조금 더 심화된 내용을 사용자에게 역으로 질문해주세요. (예: \"그럼 그 명령어는 메모리 주소에도 쓸 수 있나요?\")\n",
                userMessage, difficulty, levelDescription
        );
    }
}
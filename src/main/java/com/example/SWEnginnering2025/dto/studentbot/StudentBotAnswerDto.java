package com.example.SWEnginnering2025.dto.studentbot;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
@Builder
public class StudentBotAnswerDto {

    private Long historyId;       // 이 대화가 속한 히스토리 ID
    private String questionText;  // 사용자 질문
    private String answerText;    // AI 답변
    private LocalDateTime answeredAt;
}

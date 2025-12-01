package com.example.SWEnginnering2025.dto.studentbot;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class StudentBotAskRequest {

    // 새 세션이면 null, 기존 히스토리 이어가기면 해당 historyId
    private Long historyId;

    // 이번에 사용자가 입력한 질문
    private String questionText;
}

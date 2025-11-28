package com.example.SWEnginnering2025.dto.openai;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Message {
    private String role;    // "user" 또는 "system"
    private String content; // 질문 내용
}
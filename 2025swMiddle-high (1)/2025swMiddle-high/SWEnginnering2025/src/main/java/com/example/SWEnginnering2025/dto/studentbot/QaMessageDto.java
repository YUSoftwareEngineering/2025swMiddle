package com.example.SWEnginnering2025.dto.studentbot;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
@Builder
public class QaMessageDto {

    private Long id;
    private String role; // "USER" / "BOT"
    private String content;
    private LocalDateTime createdAt;
}

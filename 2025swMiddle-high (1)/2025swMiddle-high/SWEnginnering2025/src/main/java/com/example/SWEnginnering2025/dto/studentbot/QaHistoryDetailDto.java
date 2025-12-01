package com.example.SWEnginnering2025.dto.studentbot;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@AllArgsConstructor
@Builder
public class QaHistoryDetailDto {

    private Long id;
    private String title;
    private String summary;
    private LocalDateTime startedAt;
    private LocalDateTime lastUpdatedAt;
    private boolean favorite;
    private long messageCount;
    private List<QaMessageDto> messages;
}

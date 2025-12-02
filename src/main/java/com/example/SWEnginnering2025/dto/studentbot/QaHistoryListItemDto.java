package com.example.SWEnginnering2025.dto.studentbot;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
@Builder
public class QaHistoryListItemDto {

    private Long id;
    private String title;
    private String summary;
    private LocalDateTime startedAt;
    private LocalDateTime lastUpdatedAt;
    private boolean favorite;
    private long messageCount;
}

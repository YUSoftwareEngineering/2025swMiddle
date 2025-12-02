package com.example.SWEnginnering2025.dto.studentbot;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
@Builder
public class QaHistoryListResponse {

    private List<QaHistoryListItemDto> items;
    private long totalCount;

    // 용량이 커졌는지 여부 (알림용)
    private boolean shouldCleanup;
    private long recommendedMaxCount;
}

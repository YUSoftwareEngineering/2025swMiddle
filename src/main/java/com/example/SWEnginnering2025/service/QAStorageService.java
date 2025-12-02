package com.example.SWEnginnering2025.service;

import com.example.SWEnginnering2025.dto.studentbot.*;
import com.example.SWEnginnering2025.model.QaHistory;
import com.example.SWEnginnering2025.model.QaMessage;
import com.example.SWEnginnering2025.repository.QaHistoryRepository;
import com.example.SWEnginnering2025.repository.QaMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QAStorageService {

    private final QaHistoryRepository qaHistoryRepository;
    private final QaMessageRepository qaMessageRepository;

    // 너무 커졌다고 알림 줄 기준 (임의로 500개)
    private static final long HISTORY_LIMIT_PER_USER = 500L;

    // SDS의 autoSave(qaData)에 해당: 질문/답변 페어를 히스토리에 저장
    @Transactional
    public QaHistory autoSave(Long userId, Long historyId, String question, String answer) {
        QaHistory history;
        LocalDateTime now = LocalDateTime.now();

        if (historyId == null) {
            // 새 세션 생성
            String title = makeTitleFromQuestion(question);
            String summary = makeSummaryFromQuestion(question);

            history = QaHistory.builder()
                    .userId(userId)
                    .title(title)
                    .summary(summary)
                    .startedAt(now)
                    .lastUpdatedAt(now)
                    .favorite(false)
                    .messageCount(0L)
                    .build();

            history = qaHistoryRepository.save(history);
        } else {
            // 기존 세션 이어가기 (본인 것만)
            history = qaHistoryRepository.findById(historyId)
                    .filter(h -> h.getUserId().equals(userId))
                    .orElseThrow(() -> new IllegalArgumentException("해당 Q&A 기록을 찾을 수 없거나 권한이 없습니다."));
        }

        // 질문 메시지
        QaMessage questionMsg = QaMessage.userMessage(question);
        history.addMessage(questionMsg);

        // 답변 메시지
        QaMessage answerMsg = QaMessage.botMessage(answer);
        history.addMessage(answerMsg);

        qaMessageRepository.save(questionMsg);
        qaMessageRepository.save(answerMsg);

        return history;
    }

    private String makeTitleFromQuestion(String question) {
        if (question == null) return "새로운 질문";
        String trimmed = question.trim();
        return trimmed.length() > 30 ? trimmed.substring(0, 30) + "..." : trimmed;
    }

    private String makeSummaryFromQuestion(String question) {
        if (question == null) return "";
        String trimmed = question.trim();
        return trimmed.length() > 100 ? trimmed.substring(0, 100) + "..." : trimmed;
    }

    // SDS의 getHistory: 목록 조회 (검색/즐겨찾기 포함)
    @Transactional(readOnly = true)
    public QaHistoryListResponse getHistoryList(Long userId, String keyword, Boolean favoritesOnly,
                                                int page, int size) {

        PageRequest pageable = PageRequest.of(Math.max(page, 0), Math.max(size, 1));
        Page<QaHistory> pageResult;

        if (favoritesOnly != null && favoritesOnly) {
            pageResult = qaHistoryRepository
                    .findByUserIdAndFavoriteOrderByLastUpdatedAtDesc(userId, true, pageable);
        } else if (keyword != null && !keyword.isBlank()) {
            // 제목 + 요약 둘 다 검색
            Page<QaHistory> titlePage =
                    qaHistoryRepository.findByUserIdAndTitleContainingIgnoreCaseOrderByLastUpdatedAtDesc(
                            userId, keyword, pageable);
            if (titlePage.hasContent()) {
                pageResult = titlePage;
            } else {
                pageResult =
                        qaHistoryRepository.findByUserIdAndSummaryContainingIgnoreCaseOrderByLastUpdatedAtDesc(
                                userId, keyword, pageable);
            }
        } else {
            pageResult = qaHistoryRepository.findByUserIdOrderByLastUpdatedAtDesc(userId, pageable);
        }

        List<QaHistoryListItemDto> items = pageResult.getContent().stream()
                .map(h -> QaHistoryListItemDto.builder()
                        .id(h.getId())
                        .title(h.getTitle())
                        .summary(h.getSummary())
                        .startedAt(h.getStartedAt())
                        .lastUpdatedAt(h.getLastUpdatedAt())
                        .favorite(h.isFavorite())
                        .messageCount(h.getMessageCount())
                        .build())
                .collect(Collectors.toList());

        long totalCount = qaHistoryRepository.countByUserId(userId);
        boolean shouldCleanup = totalCount >= HISTORY_LIMIT_PER_USER;

        return QaHistoryListResponse.builder()
                .items(items)
                .totalCount(totalCount)
                .shouldCleanup(shouldCleanup)
                .recommendedMaxCount(HISTORY_LIMIT_PER_USER)
                .build();
    }

    // 상세 조회
    @Transactional(readOnly = true)
    public QaHistoryDetailDto getHistoryDetail(Long userId, Long historyId) {
        QaHistory history = qaHistoryRepository.findById(historyId)
                .filter(h -> h.getUserId().equals(userId))
                .orElseThrow(() -> new IllegalArgumentException("해당 Q&A 기록을 찾을 수 없거나 권한이 없습니다."));

        List<QaMessageDto> messages = qaMessageRepository
                .findByHistoryIdOrderByCreatedAtAsc(historyId)
                .stream()
                .map(m -> QaMessageDto.builder()
                        .id(m.getId())
                        .role(m.getRole().name())
                        .content(m.getContent())
                        .createdAt(m.getCreatedAt())
                        .build())
                .collect(Collectors.toList());

        return QaHistoryDetailDto.builder()
                .id(history.getId())
                .title(history.getTitle())
                .summary(history.getSummary())
                .startedAt(history.getStartedAt())
                .lastUpdatedAt(history.getLastUpdatedAt())
                .favorite(history.isFavorite())
                .messageCount(history.getMessageCount())
                .messages(messages)
                .build();
    }

    // SDS의 deleteHistory(historyId)
    @Transactional
    public void deleteHistory(Long userId, Long historyId) {
        QaHistory history = qaHistoryRepository.findById(historyId)
                .filter(h -> h.getUserId().equals(userId))
                .orElseThrow(() -> new IllegalArgumentException("해당 Q&A 기록을 찾을 수 없거나 권한이 없습니다."));
        qaHistoryRepository.delete(history);
    }

    // 전체 삭제
    @Transactional
    public void deleteAllHistory(Long userId) {
        Page<QaHistory> page;
        PageRequest pageable = PageRequest.of(0, 100);

        do {
            page = qaHistoryRepository.findByUserIdOrderByLastUpdatedAtDesc(userId, pageable);
            qaHistoryRepository.deleteAll(page.getContent());
        } while (page.hasNext());
    }

    // 즐겨찾기 설정/해제
    @Transactional
    public void updateFavorite(Long userId, Long historyId, boolean favorite) {
        QaHistory history = qaHistoryRepository.findById(historyId)
                .filter(h -> h.getUserId().equals(userId))
                .orElseThrow(() -> new IllegalArgumentException("해당 Q&A 기록을 찾을 수 없거나 권한이 없습니다."));
        history.toggleFavorite(favorite);
    }
}

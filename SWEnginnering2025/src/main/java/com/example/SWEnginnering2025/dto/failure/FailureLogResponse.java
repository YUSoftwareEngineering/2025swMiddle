/*Project: FailureLogResponse.java
        Author: 한지윤
        Date of creation: 2025.11.23
        Date of last update: 2025.11.23
                */
package com.example.SWEnginnering2025.dto.failure;

import com.example.SWEnginnering2025.model.FailureLog;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class FailureLogResponse {

    private Long id;
    private Long goalId;
    private String memo;
    private List<FailureTagDto> tags;
    private LocalDateTime createdAt;

    public static FailureLogResponse from(FailureLog log) {
        return new FailureLogResponse(
                log.getLogid(),
                log.getGoalId(),
                log.getMemo(),
                log.getTags().stream()
                        .map(FailureTagDto::from)
                        .collect(Collectors.toList()),
                log.getCreatedAt()
        );
    }
}

/*Project: SummaryRequest.java
        Author: 최은샘
        Date of creation: 2025.12.01
        Date of last update: 2025.12.01
*/

package com.example.SWEnginnering2025.dto.failure;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class SummaryRequest {

    @NotNull(message = "userId는 필수입니다.")
    private Long userId;

    // 최근 몇 주를 볼지 (예: 4주)
    private int weeks = 4;

    // 명시적으로 기간을 주고 싶으면 from, to 사용 (선택)
    private LocalDate from;
    private LocalDate to;
}
/*Project: ReportResponse.java
        Author: 최은샘
        Date of creation: 2025.12.01
        Date of last update: 2025.12.01
*/

package com.example.SWEnginnering2025.dto.Report;

import com.example.SWEnginnering2025.model.Report.ReportStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class ReportResponse {

    private Long id;
    private Long reporterId;
    private String reporterName;
    private Long reportedUserId;
    private String reportedUserName;
    private String reasonType;
    private String description;
    private LocalDateTime createdAt;
    private ReportStatus status;
}
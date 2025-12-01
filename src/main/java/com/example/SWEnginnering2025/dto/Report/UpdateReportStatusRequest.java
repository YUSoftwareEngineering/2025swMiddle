/*Project: UpdateReportStatusRequest.java
        Author: 최은샘
        Date of creation: 2025.12.01
        Date of last update: 2025.12.01
*/

package com.example.SWEnginnering2025.dto.Report;

import com.example.SWEnginnering2025.model.Report.ReportStatus;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateReportStatusRequest {
    private ReportStatus status;   // RESOLVED 또는 REJECTED
}
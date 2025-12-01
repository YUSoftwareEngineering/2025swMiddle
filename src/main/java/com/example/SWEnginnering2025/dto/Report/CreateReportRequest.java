/*Project: CreateReportRequest.java
        Author: 최은샘
        Date of creation: 2025.12.01
        Date of last update: 2025.12.01
*/

package com.example.SWEnginnering2025.dto.Report;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateReportRequest {

    private Long reporterId;       // 신고자 user.id
    private Long reportedUserId;   // 피신고자 user.id
    private String reasonType;     // "욕설", "스팸" 등
    private String description;    // 상세 설명 (선택)
}
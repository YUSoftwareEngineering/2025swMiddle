/*Project: ReportController.java
        Author: 최은샘
        Date of creation: 2025.12.01
        Date of last update: 2025.12.01
*/

package com.example.SWEnginnering2025.controller;

import com.example.SWEnginnering2025.dto.Report.*;
import com.example.SWEnginnering2025.model.Report.ReportStatus;
import com.example.SWEnginnering2025.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    // 사용자 신고 생성
    @PostMapping
    public ResponseEntity<ReportResponse> createReport(@RequestBody CreateReportRequest request) {
        return ResponseEntity.ok(reportService.createReport(request));
    }

    // (관리자용) 신고 목록 조회 - status 필터 가능
    @GetMapping
    public ResponseEntity<List<ReportResponse>> getReports(
            @RequestParam(required = false) ReportStatus status
    ) {
        return ResponseEntity.ok(reportService.getAllReports(status));
    }

    // (관리자용) 신고 상태 변경
    @PatchMapping("/{id}/status")
    public ResponseEntity<ReportResponse> updateStatus(
            @PathVariable Long id,
            @RequestBody UpdateReportStatusRequest request
    ) {
        return ResponseEntity.ok(reportService.updateStatus(id, request));
    }
}
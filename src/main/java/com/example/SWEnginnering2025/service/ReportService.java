/*Project: ReportService.java
        Author: 최은샘
        Date of creation: 2025.12.01
        Date of last update: 2025.12.01
*/

package com.example.SWEnginnering2025.service;

import com.example.SWEnginnering2025.dto.Report.*;
import com.example.SWEnginnering2025.model.Report.*;
import com.example.SWEnginnering2025.model.User;
import com.example.SWEnginnering2025.repository.UserReportRepository;
import com.example.SWEnginnering2025.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ReportService {

    private final UserRepository userRepository;
    private final UserReportRepository userReportRepository;

    // 신고 생성 요청을 받아서 신고를 저장하고 응답 DTO로 돌려주는 메서드
    public ReportResponse createReport(CreateReportRequest request) {
        User reporter = userRepository.findById(request.getReporterId())  // 신고한 사용자의 ID로 User 를 DB에서 찾고
                .orElseThrow(() -> new IllegalArgumentException("신고자를 찾을 수 없습니다. ID=" + request.getReporterId())); // 없으면 예외

        User reported = userRepository.findById(request.getReportedUserId())  // 신고 당한 사용자의 ID로 User 를 찾고
                .orElseThrow(() -> new IllegalArgumentException("대상 사용자를 찾을 수 없습니다. ID=" + request.getReportedUserId()));

        if (reporter.getId().equals(reported.getId())) { // 신고자와 피신고자의 ID가 같으면
            throw new IllegalArgumentException("자기 자신을 신고할 수 없습니다.");
        }

        UserReport report = UserReport.builder()
                .reporter(reporter)
                .reportedUser(reported)
                .reasonType(request.getReasonType())
                .description(request.getDescription())
                .createdAt(LocalDateTime.now())
                .status(ReportStatus.PENDING)
                .build();

        UserReport saved = userReportRepository.save(report); // 만든 신고 엔티티를 DB에 저장하고, 저장된 결과를 받음
        return toDto(saved); // 엔티티를 ReportResponse DTO 로 바꿔서 반환
    }

    @Transactional(readOnly = true)
    // 신고 목록을 조회하는 메서드
    public List<ReportResponse> getAllReports(ReportStatus status) {
        List<UserReport> list;
        if (status != null) {  // status 파라미터가 있으면 그 상태만 조회
            list = userReportRepository.findByStatus(status);
        } else {  // 없으면 전체 신고를 조회
            list = userReportRepository.findAll();
        }
        return list.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    // 특정 신고의 상태(RESOLVED/REJECTED 등)를 변경하는 메서드
    public ReportResponse updateStatus(Long reportId, UpdateReportStatusRequest request) {
        UserReport report = userReportRepository.findById(reportId) // ID 로 신고를 찾고, 없으면 예외
                .orElseThrow(() -> new IllegalArgumentException("신고 정보를 찾을 수 없습니다. ID=" + reportId));

        report.setStatus(request.getStatus()); // 신고 엔티티의 상태를 요청에서 받은 값으로 변경
        return toDto(report);
    }

    // serReport 엔티티 하나를 화면/응답용 DTO로 변환하는 메서드
    private ReportResponse toDto(UserReport report) {
        return ReportResponse.builder()
                .id(report.getId())
                .reporterId(report.getReporter().getId())
                .reporterName(report.getReporter().getName())
                .reportedUserId(report.getReportedUser().getId())
                .reportedUserName(report.getReportedUser().getName())
                .reasonType(report.getReasonType())
                .description(report.getDescription())
                .createdAt(report.getCreatedAt())
                .status(report.getStatus())
                .build();
    }
}
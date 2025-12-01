/*Project: UserReportRepository.java
        Author: 최은샘
        Date of creation: 2025.12.01
        Date of last update: 2025.12.01
*/

package com.example.SWEnginnering2025.repository;

import com.example.SWEnginnering2025.model.Report.ReportStatus;
import com.example.SWEnginnering2025.model.User;
import com.example.SWEnginnering2025.model.Report.UserReport;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserReportRepository extends JpaRepository<UserReport, Long> {

    // 이 사용자가 신고한 신고 목록
    List<UserReport> findByReporter(User reporter);

    // 이 사용자가 신고당한 모든 신고 목록
    List<UserReport> findByReportedUser(User reportedUser);

    // 해당 상태의 신고 목록
    List<UserReport> findByStatus(ReportStatus status);
}

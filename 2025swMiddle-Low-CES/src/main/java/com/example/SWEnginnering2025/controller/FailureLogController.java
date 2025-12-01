/*Project: AttachmentController.java
        Author: 한지윤
        Date of creation: 2025.11.23
        Date of last update: 2025.12.01
                */

package com.example.SWEnginnering2025.controller;

import com.example.SWEnginnering2025.dto.failure.*;
import com.example.SWEnginnering2025.service.FailureLogService;
import com.example.SWEnginnering2025.service.AnalysisService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/failures")
@RequiredArgsConstructor
public class FailureLogController {

    private final FailureLogService failureLogService;
    private final AnalysisService analysisService;


    // 시퀀스: getFailureTags()
    @GetMapping("/tags")
    public ResponseEntity<List<FailureTagDto>> getFailureTags(@RequestParam Long userId) {
        return ResponseEntity.ok(failureLogService.getFailureTags(userId));
    }

    // 시퀀스: createFailureTag(CreateTagRequest)
    @PostMapping("/tags")
    public ResponseEntity<FailureTagDto> createTag(@RequestBody CreateTagRequest request) {
        return ResponseEntity.ok(failureLogService.createFailureTag(request));
    }

    // 시퀀스: logFailure(LogFailureRequest)
    @PostMapping("/log")
    public ResponseEntity<FailureLogResponse> logFailure(@RequestBody LogFailureRequest request) {
        FailureLogResponse response = failureLogService.logFailure(request);
        return ResponseEntity.ok(response);
    }

    // [신규] 실패 로그 요약 (시각화용)
    @PostMapping("/summary")
    public ResponseEntity<SummaryResultDto> getSummary(@Valid @RequestBody SummaryRequest request) {
        return ResponseEntity.ok(analysisService.getSummary(request));
    }
}

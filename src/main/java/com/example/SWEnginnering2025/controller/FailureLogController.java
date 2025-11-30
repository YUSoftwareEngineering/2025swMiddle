/*Project: AttachmentController.java
        Author: 한지윤
        Date of creation: 2025.11.23
        Date of last update: 2025.11.23
                */

package com.example.SWEnginnering2025.controller;

import com.example.SWEnginnering2025.dto.failure.CreateTagRequest;
import com.example.SWEnginnering2025.dto.failure.FailureLogResponse;
import com.example.SWEnginnering2025.dto.failure.FailureTagDto;
import com.example.SWEnginnering2025.dto.failure.LogFailureRequest;
import com.example.SWEnginnering2025.service.FailureLogService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/failures")
public class FailureLogController {

    private final FailureLogService failureLogService;

    public FailureLogController(FailureLogService failureLogService) {
        this.failureLogService = failureLogService;
    }

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
}

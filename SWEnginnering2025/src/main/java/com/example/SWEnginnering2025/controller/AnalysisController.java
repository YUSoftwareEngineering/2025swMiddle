package com.example.SWEnginnering2025.controller;

import com.example.SWEnginnering2025.dto.analysis.AnalysisRequest;
import com.example.SWEnginnering2025.dto.analysis.PatternResultDto;
import com.example.SWEnginnering2025.dto.analysis.SummaryRequest;
import com.example.SWEnginnering2025.dto.analysis.SummaryResultDto;
import com.example.SWEnginnering2025.service.AnalysisService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/analysis")
public class AnalysisController {

    private final AnalysisService analysisService;

    public AnalysisController(AnalysisService analysisService) {
        this.analysisService = analysisService;
    }

    // 시퀀스: AnalysisViewModel.analyzePatterns -> AnalysisService.analyzePatterns
    @PostMapping("/patterns")
    public ResponseEntity<PatternResultDto> analyzePatterns(@RequestBody AnalysisRequest request) {
        return ResponseEntity.ok(analysisService.analyzePatterns(request));
    }

    // 시퀀스: DashboardViewModel.loadChartData -> AnalysisService.getSummary
    @PostMapping("/summary")
    public ResponseEntity<SummaryResultDto> getSummary(@RequestBody SummaryRequest request) {
        return ResponseEntity.ok(analysisService.getSummary(request));
    }
}

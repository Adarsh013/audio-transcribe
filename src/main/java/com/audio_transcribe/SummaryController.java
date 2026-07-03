package com.audio_transcribe;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/summary")
@CrossOrigin(origins = "*")
public class SummaryController {

    private final SummaryService summaryService;

    public SummaryController(
            SummaryService summaryService) {
        this.summaryService = summaryService;
    }

    @PostMapping
    public SummaryResponse summarize(
            @RequestBody SummaryRequest request) {

        String summary =
                summaryService.summarize(
                        request.transcript());

        return new SummaryResponse(summary);
    }
}
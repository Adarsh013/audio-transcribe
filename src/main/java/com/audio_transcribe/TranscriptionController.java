package com.audio_transcribe;


import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/transcribe")
@CrossOrigin(origins = "*")
public class TranscriptionController {

    private final TranscriptionService transcriptionService;

    public TranscriptionController(
            TranscriptionService transcriptionService) {
        this.transcriptionService = transcriptionService;
    }

    @PostMapping
    public String transcribe(
            @RequestParam("file") MultipartFile file) {

        return transcriptionService.transcribe(file);
    }
}
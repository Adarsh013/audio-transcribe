package com.audio_transcribe;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;
import org.springframework.web.multipart.MultipartFile;

@Service
public class TranscriptionService {

    @Value("${spring.ai.openai.api-key}")
    private String apiKey;

    private static final String GROQ_URL =
            "https://api.groq.com/openai/v1/audio/transcriptions";

    public String transcribe(MultipartFile file) {

        try {

            MultiValueMap<String, Object> body =
                    new LinkedMultiValueMap<>();

            body.add(
                    "file",
                    new ByteArrayResource(file.getBytes()) {
                        @Override
                        public String getFilename() {
                            return file.getOriginalFilename();
                        }
                    });

            body.add("model", "whisper-large-v3-turbo");

            RestClient restClient = RestClient.builder()
                    .defaultHeader(
                            HttpHeaders.AUTHORIZATION,
                            "Bearer " + apiKey)
                    .build();

            return restClient.post()
                    .uri(GROQ_URL)
                    .contentType(MediaType.MULTIPART_FORM_DATA)
                    .body(body)
                    .retrieve()
                    .body(String.class);

        } catch (Exception e) {
            throw new RuntimeException(
                    "Failed to transcribe audio",
                    e);
        }
    }
}
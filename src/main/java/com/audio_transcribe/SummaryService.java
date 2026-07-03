package com.audio_transcribe;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.Map;

@Service
public class SummaryService {

    @Value("${spring.ai.openai.api-key}")
    private String apiKey;

    private static final String GROQ_URL =
            "https://api.groq.com/openai/v1/chat/completions";

    public String summarize(String transcript) {

        try {

            RestClient restClient = RestClient.builder()
                    .defaultHeader(
                            HttpHeaders.AUTHORIZATION,
                            "Bearer " + apiKey)
                    .build();

            Map<String, Object> requestBody = Map.of(
                    "model", "llama-3.3-70b-versatile",
                    "messages", new Object[]{
                            Map.of(
                                    "role", "user",
                                    "content",
                                    """
                                    You are an expert meeting and audio summarization assistant.

                                    Summarize the transcript into concise bullet points.

                                    Rules:
                                    - Include all important facts.
                                    - Include names of people if mentioned.
                                    - Include dates, times, deadlines, and schedules.
                                    - Include meetings, appointments, and events.
                                    - Include action items and next steps if mentioned.
                                    - Do not invent information.
                                    - Do not omit important details.
                                    - Return only bullet points.
                                    - Keep each bullet short and clear.

                                    Transcript:

                                    %s
                                    """.formatted(transcript)
                            )
                    }
            );

            String response = restClient.post()
                    .uri(GROQ_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(requestBody)
                    .retrieve()
                    .body(String.class);

            ObjectMapper mapper = new ObjectMapper();

            JsonNode root = mapper.readTree(response);

            return root.path("choices")
                    .get(0)
                    .path("message")
                    .path("content")
                    .asText();

        } catch (Exception e) {
            throw new RuntimeException(
                    "Failed to generate summary",
                    e);
        }
    }
}
import axios from "axios";

const TRANSCRIBE_URL = "http://localhost:8080/api/transcribe";
const SUMMARY_URL = "http://localhost:8080/api/summary";

export const transcribeAudio = async (file) => {

    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post(
        TRANSCRIBE_URL,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }
    );

    return response.data;
};

export const generateSummary = async (transcript) => {

    const response = await axios.post(
        SUMMARY_URL,
        {
            transcript
        }
    );

    return response.data;
};
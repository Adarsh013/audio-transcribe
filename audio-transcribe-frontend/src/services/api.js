import axios from "axios";

const BASE_URL = "https://audio-transcribe-production-999e.up.railway.app";

const TRANSCRIBE_URL = `${BASE_URL}/api/transcribe`;
const SUMMARY_URL = `${BASE_URL}/api/summary`;

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
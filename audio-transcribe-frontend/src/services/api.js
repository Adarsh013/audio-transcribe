import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080";

export const transcribeAudio = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axios.post(
    `${API_BASE_URL}/api/transcribe`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

export const generateSummary = async (transcript) => {
  const response = await axios.post(
    `${API_BASE_URL}/api/summary`,
    {
      transcript,
    }
  );

  return response.data;
};
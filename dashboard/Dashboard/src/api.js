import axios from "axios";

const API_BASE_URL = "https://api.example.com/data";

export const fetchStatistics = async () => {
  const response = await axios.get(API_BASE_URL);
  return response.data;
};

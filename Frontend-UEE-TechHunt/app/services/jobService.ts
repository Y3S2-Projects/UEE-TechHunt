import axios from "axios";

// Changed from 6000 to 5000
const API_BASE = "http://192.168.8.141:5000/api";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Add request interceptor for auth token (add later)
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Get all jobs with optional filters
export const getAllJobs = async (filters?: {
  category?: string;
  search?: string;
}) => {
  try {
    const params = new URLSearchParams();
    if (filters?.category) params.append("category", filters.category);
    if (filters?.search) params.append("search", filters.search);

    const queryString = params.toString();
    const url = queryString ? `/jobs?${queryString}` : "/jobs";
    
    console.log("Fetching from:", `${API_BASE}${url}`); // Debug log
    const res = await api.get(url);
    console.log("API Response:", res.data); // Debug log
    
    return res.data.data || res.data;
  } catch (error: any) {
    console.error("getAllJobs error:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch jobs");
  }
};

// Get single job by ID
export const getJobById = async (id: string) => {
  try {
    const res = await api.get(`/jobs/${id}`);
    return res.data.data || res.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch job details");
  }
};

// Post new job
export const postJob = async (payload: any) => {
  try {
    console.log("Posting job to:", `${API_BASE}/jobs`);
    console.log("Payload:", payload);
    
    const res = await api.post("/jobs", payload);
    console.log("Post response:", res.data);
    
    return res.data.data || res.data;
  } catch (error: any) {
    console.error("postJob error:", error);
    throw new Error(error.response?.data?.message || "Failed to post job");
  }
};

// Submit bid for a job
export const submitBid = async (jobId: string, bidData: { amount: number; message: string }) => {
  try {
    const res = await api.post(`/jobs/${jobId}/bid`, bidData);
    return res.data.data || res.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to submit bid");
  }
};

// Update job (for future use)
export const updateJob = async (id: string, payload: any) => {
  try {
    const res = await api.put(`/jobs/${id}`, payload);
    return res.data.data || res.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to update job");
  }
};

// Delete job (for future use)
export const deleteJob = async (id: string) => {
  try {
    const res = await api.delete(`/jobs/${id}`);
    return res.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to delete job");
  }
};
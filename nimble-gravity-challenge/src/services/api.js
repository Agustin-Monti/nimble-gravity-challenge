import axios from 'axios';

const BASE_URL = 'https://botfilter-h5ddh6dye8exb7ha.centralus-01.azurewebsites.net';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getCandidateByEmail = async (email) => {
  try {
    const response = await api.get(`/api/candidate/get-by-email?email=${encodeURIComponent(email)}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getJobs = async () => {
  try {
    const response = await api.get('/api/jobs/get-list');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const applyToJob = async (applicationData) => {
  try {
    const response = await api.post('/api/candidate/apply-to-job', applicationData);
    return response.data;
  } catch (error) {
    throw error;
  }
};
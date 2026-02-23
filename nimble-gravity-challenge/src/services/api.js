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
    console.log('URL:', `${BASE_URL}/api/candidate/apply-to-job`);
    console.log('Datos a enviar:', applicationData);
    
    const response = await fetch(`${BASE_URL}/api/candidate/apply-to-job`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(applicationData)
    });
    
    const data = await response.json();
    console.log('Respuesta status:', response.status);
    console.log('Respuesta data:', data);
    
    if (!response.ok) {
      throw {
        response: {
          status: response.status,
          data: data
        }
      };
    }
    
    return data;
  } catch (error) {
    console.error('Error en la petición:');
    console.error('- Status:', error.response?.status);
    console.error('- Data completo:', error.response?.data);
    console.error('- Detalles:', error.response?.data?.details);
    throw error;
  }
};
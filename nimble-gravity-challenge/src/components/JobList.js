import React, { useState, useEffect } from 'react';
import JobItem from './JobItem';
import { getJobs, applyToJob } from '../services/api';
import './JobList.css';

const JobList = ({ candidateData }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [applyingJobs, setApplyingJobs] = useState({});

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const jobsData = await getJobs();
      setJobs(jobsData);
      setError('');
    } catch (err) {
      setError('Error al cargar las posiciones. Por favor intentá de nuevo.');
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (applicationData) => {
    try {
      const result = await applyToJob(applicationData);
      return result;
    } catch (err) {
      throw err;
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando posiciones...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button onClick={fetchJobs} className="retry-button">
          Intentar nuevamente
        </button>
      </div>
    );
  }

  return (
    <div className="job-list">
      <h2>Posiciones disponibles</h2>
      {jobs.length === 0 ? (
        <p className="no-jobs">No hay posiciones disponibles en este momento.</p>
      ) : (
        jobs.map((job) => (
          <JobItem
            key={job.id}
            job={job}
            candidateData={candidateData}
            onApply={handleApply}
          />
        ))
      )}
    </div>
  );
};

export default JobList;
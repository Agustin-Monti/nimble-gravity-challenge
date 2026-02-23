import React, { useState } from 'react';
import './JobItem.css';

const JobItem = ({ job, candidateData, onApply }) => {
  const [repoUrl, setRepoUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!repoUrl) {
      setError('La URL del repositorio es requerida');
      return;
    }

    // Validación básica de URL de GitHub
    if (!repoUrl.includes('github.com')) {
      setError('Por favor ingresá una URL válida de GitHub');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const applicationData = {
        uuid: candidateData.uuid,
        jobId: job.id,
        candidateId: candidateData.candidateId,
        repoUrl: repoUrl
      };

      const result = await onApply(applicationData);
      
      if (result.ok) {
        setSuccess(true);
        setRepoUrl('');
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error al enviar la postulación');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="job-item">
      <div className="job-header">
        <h3 className="job-title">{job.title}</h3>
      </div>
      
      <form onSubmit={handleSubmit} className="job-form">
        <div className="form-group">
          <label htmlFor={`repo-${job.id}`}>URL del repositorio:</label>
          <input
            type="url"
            id={`repo-${job.id}`}
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            placeholder="https://github.com/tu-usuario/tu-repo"
            disabled={isSubmitting || success}
            className="repo-input"
          />
        </div>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">¡Postulación enviada con éxito!</div>}
        
        <button 
          type="submit" 
          disabled={isSubmitting || success}
          className="submit-button"
        >
          {isSubmitting ? 'Enviando...' : 'Submit'}
        </button>
      </form>
    </div>
  );
};

export default JobItem;
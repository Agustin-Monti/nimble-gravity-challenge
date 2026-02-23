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

    setIsSubmitting(true);
    setError('');

    try {
      // Verificar todos los datos del candidato
      console.log('CandidateData completo:', candidateData);
      console.log('Campos disponibles:', Object.keys(candidateData));
      
      // Asegurarnos de que los campos existen
      if (!candidateData.uuid) {
        throw new Error('No se encontró el UUID del candidato');
      }
      if (!candidateData.candidateId) {
        throw new Error('No se encontró el candidateId');
      }
      if (!job.id) {
        throw new Error('No se encontró el ID del trabajo');
      }
      
      const applicationData = {
        uuid: candidateData.uuid,
        jobId: job.id,
        candidateId: candidateData.candidateId,
        applicationId: candidateData.applicationId, // agregue este campo ante el error de invalid body
        repoUrl: repoUrl
      };

      console.log('Enviando aplicación con estos datos exactos:', applicationData);
      
      const result = await onApply(applicationData);
      
      if (result.ok) {
        setSuccess(true);
        setRepoUrl('');
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Error completo:', err);
      console.error('Respuesta del servidor:', err.response?.data);
      console.error('Detalles específicos:', err.response?.data?.details);
      
      const errorMessage = err.response?.data?.details?.message || 
                          err.response?.data?.error || 
                          err.message || 
                          'Error al enviar la postulación';
      setError(errorMessage);
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

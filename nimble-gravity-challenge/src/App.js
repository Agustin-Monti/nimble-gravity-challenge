import React, { useState, useEffect } from 'react';
import JobList from './components/JobList';
import { getCandidateByEmail } from './services/api';
import './App.css';

function App() {
  const [email, setEmail] = useState('');
  const [candidateData, setCandidateData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError('Por favor ingresá tu email');
      return;
    }

    // Validación básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Por favor ingresá un email válido');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await getCandidateByEmail(email);
      setCandidateData(data);
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al obtener los datos del candidato');
    } finally {
      setLoading(false);
    }
  };

  if (!submitted) {
    return (
      <div className="app">
        <div className="container">
          <header className="app-header">
            <h1>Nimble Gravity - Challenge</h1>
            <p>Por favor ingresá tu email para comenzar</p>
          </header>
          
          <form onSubmit={handleEmailSubmit} className="email-form">
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                disabled={loading}
                className="email-input"
              />
            </div>
            
            {error && <div className="error-message">{error}</div>}
            
            <button 
              type="submit" 
              disabled={loading}
              className="submit-email-button"
            >
              {loading ? 'Verificando...' : 'Continuar'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="container">
        <header className="app-header">
          <h1>Nimble Gravity - Challenge</h1>
          <p className="welcome-message">
            Bienvenido, {candidateData.firstName} {candidateData.lastName}!
          </p>
        </header>
        
        <JobList candidateData={candidateData} />
      </div>
    </div>
  );
}

export default App;
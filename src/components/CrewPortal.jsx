import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const CrewPortal = () => {
  const { user, logout } = useAuth();
  const [defects, setDefects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    aircraftId: '',
    area: '',
    description: '',
    severity: 'medium',
    image: null
  });

  // Mock data for defects
  useEffect(() => {
    const mockDefects = [
      {
        id: 1,
        aircraftId: 'AC-001',
        area: 'Seat 12A',
        description: 'Seat belt buckle not functioning properly',
        severity: 'high',
        timestamp: new Date().toISOString(),
        status: 'open'
      },
      {
        id: 2,
        aircraftId: 'AC-002',
        area: 'Galley',
        description: 'Coffee machine not heating',
        severity: 'medium',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        status: 'in-progress'
      }
    ];
    setDefects(mockDefects);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newDefect = {
      id: Date.now(),
      ...formData,
      timestamp: new Date().toISOString(),
      status: 'open',
      reportedBy: user.displayName || user.email
    };

    setDefects(prev => [newDefect, ...prev]);
    setFormData({
      aircraftId: '',
      area: '',
      description: '',
      severity: 'medium',
      image: null
    });
    setShowForm(false);
  };

  const getSeverityClass = (severity) => {
    switch (severity) {
      case 'high': return 'status-critical';
      case 'medium': return 'status-warning';
      case 'low': return 'status-info';
      default: return 'status-normal';
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'open': return 'status-critical';
      case 'in-progress': return 'status-warning';
      case 'resolved': return 'status-normal';
      default: return 'status-info';
    }
  };

  return (
    <div className="container">
      <div className="header">
        <div className="container">
          <h1>Cabin Crew Portal</h1>
          <div className="nav">
            <span>Welcome, {user.displayName || user.email}</span>
            <button className="btn btn-secondary" onClick={logout}>
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <h3>Quick Actions</h3>
          <button 
            className="btn" 
            onClick={() => setShowForm(true)}
            style={{ width: '100%', marginBottom: '10px' }}
          >
            Report New Defect
          </button>
          <button 
            className="btn btn-secondary" 
            style={{ width: '100%' }}
            onClick={() => setShowForm(false)}
          >
            View All Reports
          </button>
        </div>

        <div className="card">
          <h3>Recent Reports</h3>
          <p>Total Reports: {defects.length}</p>
          <p>Open Issues: {defects.filter(d => d.status === 'open').length}</p>
          <p>In Progress: {defects.filter(d => d.status === 'in-progress').length}</p>
        </div>
      </div>

      {showForm && (
        <div className="card">
          <h3>Report New Defect</h3>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-2">
              <div className="form-group">
                <label htmlFor="aircraftId">Aircraft ID</label>
                <input
                  type="text"
                  id="aircraftId"
                  name="aircraftId"
                  value={formData.aircraftId}
                  onChange={handleInputChange}
                  placeholder="e.g., AC-001"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="area">Area/Seat</label>
                <input
                  type="text"
                  id="area"
                  name="area"
                  value={formData.area}
                  onChange={handleInputChange}
                  placeholder="e.g., Seat 12A, Galley, Lavatory"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe the issue in detail..."
                required
              />
            </div>

            <div className="grid grid-2">
              <div className="form-group">
                <label htmlFor="severity">Severity</label>
                <select
                  id="severity"
                  name="severity"
                  value={formData.severity}
                  onChange={handleInputChange}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="image">Attach Image (Optional)</label>
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" className="btn">
                Submit Report
              </button>
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <h3>Defect Reports History</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Aircraft</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Area</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Description</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Severity</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Status</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Time</th>
              </tr>
            </thead>
            <tbody>
              {defects.map(defect => (
                <tr key={defect.id}>
                  <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>{defect.aircraftId}</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>{defect.area}</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>{defect.description}</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>
                    <span className={`status-badge ${getSeverityClass(defect.severity)}`}>
                      {defect.severity.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>
                    <span className={`status-badge ${getStatusClass(defect.status)}`}>
                      {defect.status.replace('-', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>
                    {new Date(defect.timestamp).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CrewPortal;

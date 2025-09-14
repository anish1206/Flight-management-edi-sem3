import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const EngineerDashboard = () => {
  const { user, logout } = useAuth();
  const [defects, setDefects] = useState([]);
  const [engineHealth, setEngineHealth] = useState([]);
  const [selectedAircraft, setSelectedAircraft] = useState('all');
  const [filteredDefects, setFilteredDefects] = useState([]);

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
        status: 'open',
        reportedBy: 'Cabin Crew Member'
      },
      {
        id: 2,
        aircraftId: 'AC-002',
        area: 'Galley',
        description: 'Coffee machine not heating',
        severity: 'medium',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        status: 'in-progress',
        reportedBy: 'Cabin Crew Member'
      },
      {
        id: 3,
        aircraftId: 'AC-001',
        area: 'Engine #1',
        description: 'Unusual vibration detected during takeoff',
        severity: 'high',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        status: 'open',
        reportedBy: 'Pilot'
      },
      {
        id: 4,
        aircraftId: 'AC-003',
        area: 'Lavatory A',
        description: 'Toilet flush mechanism not working',
        severity: 'low',
        timestamp: new Date(Date.now() - 10800000).toISOString(),
        status: 'resolved',
        reportedBy: 'Cabin Crew Member'
      }
    ];
    setDefects(mockDefects);
    setFilteredDefects(mockDefects);
  }, []);

  // Mock engine health data
  useEffect(() => {
    const mockEngineHealth = [
      { aircraftId: 'AC-001', engineId: 'E1', rul: 45, health: 85, temperature: 120, pressure: 15.2, vibration: 2.1 },
      { aircraftId: 'AC-001', engineId: 'E2', rul: 38, health: 78, temperature: 125, pressure: 14.8, vibration: 2.8 },
      { aircraftId: 'AC-002', engineId: 'E1', rul: 67, health: 92, temperature: 115, pressure: 15.5, vibration: 1.8 },
      { aircraftId: 'AC-002', engineId: 'E2', rul: 71, health: 94, temperature: 112, pressure: 15.7, vibration: 1.6 },
      { aircraftId: 'AC-003', engineId: 'E1', rul: 23, health: 65, temperature: 135, pressure: 14.2, vibration: 3.2 },
      { aircraftId: 'AC-003', engineId: 'E2', rul: 29, health: 72, temperature: 130, pressure: 14.5, vibration: 2.9 }
    ];
    setEngineHealth(mockEngineHealth);
  }, []);

  // Filter defects by aircraft
  useEffect(() => {
    if (selectedAircraft === 'all') {
      setFilteredDefects(defects);
    } else {
      setFilteredDefects(defects.filter(defect => defect.aircraftId === selectedAircraft));
    }
  }, [selectedAircraft, defects]);

  const handleStatusChange = (defectId, newStatus) => {
    setDefects(prev => 
      prev.map(defect => 
        defect.id === defectId ? { ...defect, status: newStatus } : defect
      )
    );
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

  const getRulStatus = (rul) => {
    if (rul < 30) return { status: 'critical', color: '#dc3545' };
    if (rul < 50) return { status: 'warning', color: '#ffc107' };
    return { status: 'normal', color: '#28a745' };
  };

  // Chart data
  const rulData = engineHealth.map(engine => ({
    name: `${engine.aircraftId}-${engine.engineId}`,
    rul: engine.rul,
    health: engine.health
  }));

  const defectStats = [
    { name: 'Open', value: defects.filter(d => d.status === 'open').length, color: '#dc3545' },
    { name: 'In Progress', value: defects.filter(d => d.status === 'in-progress').length, color: '#ffc107' },
    { name: 'Resolved', value: defects.filter(d => d.status === 'resolved').length, color: '#28a745' }
  ];

  const severityStats = [
    { name: 'High', value: defects.filter(d => d.severity === 'high').length, color: '#dc3545' },
    { name: 'Medium', value: defects.filter(d => d.severity === 'medium').length, color: '#ffc107' },
    { name: 'Low', value: defects.filter(d => d.severity === 'low').length, color: '#17a2b8' }
  ];

  return (
    <div className="container">
      <div className="header">
        <div className="container">
          <h1>Engineer Dashboard</h1>
          <div className="nav">
            <span>Welcome, {user.displayName || user.email}</span>
            <button className="btn btn-secondary" onClick={logout}>
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-3">
        <div className="card">
          <h4>Total Defects</h4>
          <h2 style={{ color: '#007bff', margin: '10px 0' }}>{defects.length}</h2>
          <p>Open: {defects.filter(d => d.status === 'open').length}</p>
        </div>
        <div className="card">
          <h4>Critical Issues</h4>
          <h2 style={{ color: '#dc3545', margin: '10px 0' }}>
            {defects.filter(d => d.severity === 'high' && d.status !== 'resolved').length}
          </h2>
          <p>Require immediate attention</p>
        </div>
        <div className="card">
          <h4>Fleet Health</h4>
          <h2 style={{ color: '#28a745', margin: '10px 0' }}>
            {Math.round(engineHealth.reduce((acc, engine) => acc + engine.health, 0) / engineHealth.length)}%
          </h2>
          <p>Average engine health</p>
        </div>
      </div>

      {/* Engine Health Overview */}
      <div className="card">
        <h3>Engine Health & RUL Predictions</h3>
        <div className="grid grid-2">
          <div>
            <h4>Remaining Useful Life (RUL)</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={rulData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="rul" fill="#007bff" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div>
            <h4>Engine Health Status</h4>
            <div style={{ marginTop: '20px' }}>
              {engineHealth.map((engine, index) => {
                const rulStatus = getRulStatus(engine.rul);
                return (
                  <div key={index} style={{ 
                    marginBottom: '15px', 
                    padding: '10px', 
                    border: '1px solid #ddd', 
                    borderRadius: '4px',
                    backgroundColor: '#f8f9fa'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong>{engine.aircraftId} - {engine.engineId}</strong>
                      <span className={`status-badge ${rulStatus.status === 'critical' ? 'status-critical' : rulStatus.status === 'warning' ? 'status-warning' : 'status-normal'}`}>
                        RUL: {engine.rul} cycles
                      </span>
                    </div>
                    <div style={{ marginTop: '5px', fontSize: '14px' }}>
                      Health: {engine.health}% | Temp: {engine.temperature}°C | Pressure: {engine.pressure} bar
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-2">
        <div className="card">
          <h4>Defect Status Distribution</h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={defectStats}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {defectStats.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h4>Severity Distribution</h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={severityStats}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {severityStats.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Defect Management */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3>Defect Reports</h3>
          <div>
            <label htmlFor="aircraftFilter" style={{ marginRight: '10px' }}>Filter by Aircraft:</label>
            <select
              id="aircraftFilter"
              value={selectedAircraft}
              onChange={(e) => setSelectedAircraft(e.target.value)}
              style={{ padding: '5px 10px' }}
            >
              <option value="all">All Aircraft</option>
              <option value="AC-001">AC-001</option>
              <option value="AC-002">AC-002</option>
              <option value="AC-003">AC-003</option>
            </select>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Aircraft</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Area</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Description</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Severity</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Status</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Reported By</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Time</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDefects.map(defect => (
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
                  <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>{defect.reportedBy}</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>
                    {new Date(defect.timestamp).toLocaleString()}
                  </td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>
                    <div style={{ display: 'flex', gap: '5px' }}>
                      {defect.status === 'open' && (
                        <button
                          className="btn btn-secondary"
                          style={{ fontSize: '12px', padding: '4px 8px' }}
                          onClick={() => handleStatusChange(defect.id, 'in-progress')}
                        >
                          Start
                        </button>
                      )}
                      {defect.status === 'in-progress' && (
                        <button
                          className="btn"
                          style={{ fontSize: '12px', padding: '4px 8px' }}
                          onClick={() => handleStatusChange(defect.id, 'resolved')}
                        >
                          Resolve
                        </button>
                      )}
                      {defect.status === 'resolved' && (
                        <span style={{ color: '#28a745', fontSize: '12px' }}>✓ Completed</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Notifications */}
      <div className="card">
        <h3>System Notifications</h3>
        <div className="alert alert-warning">
          <strong>Warning:</strong> Engine AC-003-E1 requires immediate maintenance (RUL: 23 cycles)
        </div>
        <div className="alert alert-danger">
          <strong>Critical:</strong> High severity defect reported for AC-001 - Engine #1
        </div>
        <div className="alert alert-success">
          <strong>Info:</strong> All systems operating normally for AC-002
        </div>
      </div>
    </div>
  );
};

export default EngineerDashboard;
    
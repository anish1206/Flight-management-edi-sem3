import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const EngineHealthChart = ({ data, type = 'rul' }) => {
  const chartData = data.map(engine => ({
    name: `${engine.aircraftId}-${engine.engineId}`,
    rul: engine.rul,
    health: engine.health,
    temperature: engine.temperature,
    pressure: engine.pressure,
    vibration: engine.vibration
  }));

  const getRulColor = (value) => {
    if (value < 30) return '#dc3545';
    if (value < 50) return '#ffc107';
    return '#28a745';
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          backgroundColor: 'white',
          border: '1px solid #ccc',
          borderRadius: '4px',
          padding: '10px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ margin: '2px 0', color: entry.color }}>
              {entry.dataKey}: {entry.value}
              {entry.dataKey === 'rul' && ' cycles'}
              {entry.dataKey === 'health' && '%'}
              {entry.dataKey === 'temperature' && '°C'}
              {entry.dataKey === 'pressure' && ' bar'}
              {entry.dataKey === 'vibration' && ' mm/s'}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (type === 'rul') {
    return (
      <div>
        <h4>Remaining Useful Life (RUL)</h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              label={{ value: 'RUL (cycles)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="rul" 
              fill="#007bff"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  if (type === 'health') {
    return (
      <div>
        <h4>Engine Health Status</h4>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              domain={[0, 100]}
              label={{ value: 'Health (%)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="health" 
              stroke="#28a745" 
              strokeWidth={3}
              dot={{ fill: '#28a745', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }

  if (type === 'sensors') {
    return (
      <div>
        <h4>Sensor Readings</h4>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="temperature" 
              stroke="#dc3545" 
              strokeWidth={2}
              name="Temperature (°C)"
            />
            <Line 
              type="monotone" 
              dataKey="pressure" 
              stroke="#007bff" 
              strokeWidth={2}
              name="Pressure (bar)"
            />
            <Line 
              type="monotone" 
              dataKey="vibration" 
              stroke="#ffc107" 
              strokeWidth={2}
              name="Vibration (mm/s)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return null;
};

export default EngineHealthChart;

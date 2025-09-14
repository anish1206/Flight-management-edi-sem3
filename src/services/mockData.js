// Mock data service for the Aircraft Maintenance System

export const mockAircraft = [
  { id: 'AC-001', type: 'Boeing 737-800', status: 'active', lastMaintenance: '2024-01-15' },
  { id: 'AC-002', type: 'Airbus A320', status: 'active', lastMaintenance: '2024-01-10' },
  { id: 'AC-003', type: 'Boeing 737-800', status: 'maintenance', lastMaintenance: '2024-01-20' },
  { id: 'AC-004', type: 'Airbus A321', status: 'active', lastMaintenance: '2024-01-12' }
];

export const mockEngineHealth = [
  { 
    aircraftId: 'AC-001', 
    engineId: 'E1', 
    rul: 45, 
    health: 85, 
    temperature: 120, 
    pressure: 15.2, 
    vibration: 2.1,
    lastUpdate: new Date().toISOString()
  },
  { 
    aircraftId: 'AC-001', 
    engineId: 'E2', 
    rul: 38, 
    health: 78, 
    temperature: 125, 
    pressure: 14.8, 
    vibration: 2.8,
    lastUpdate: new Date().toISOString()
  },
  { 
    aircraftId: 'AC-002', 
    engineId: 'E1', 
    rul: 67, 
    health: 92, 
    temperature: 115, 
    pressure: 15.5, 
    vibration: 1.8,
    lastUpdate: new Date().toISOString()
  },
  { 
    aircraftId: 'AC-002', 
    engineId: 'E2', 
    rul: 71, 
    health: 94, 
    temperature: 112, 
    pressure: 15.7, 
    vibration: 1.6,
    lastUpdate: new Date().toISOString()
  },
  { 
    aircraftId: 'AC-003', 
    engineId: 'E1', 
    rul: 23, 
    health: 65, 
    temperature: 135, 
    pressure: 14.2, 
    vibration: 3.2,
    lastUpdate: new Date().toISOString()
  },
  { 
    aircraftId: 'AC-003', 
    engineId: 'E2', 
    rul: 29, 
    health: 72, 
    temperature: 130, 
    pressure: 14.5, 
    vibration: 2.9,
    lastUpdate: new Date().toISOString()
  }
];

export const mockDefects = [
  {
    id: 1,
    aircraftId: 'AC-001',
    area: 'Seat 12A',
    description: 'Seat belt buckle not functioning properly',
    severity: 'high',
    timestamp: new Date().toISOString(),
    status: 'open',
    reportedBy: 'Cabin Crew Member',
    imageUrl: null
  },
  {
    id: 2,
    aircraftId: 'AC-002',
    area: 'Galley',
    description: 'Coffee machine not heating',
    severity: 'medium',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    status: 'in-progress',
    reportedBy: 'Cabin Crew Member',
    imageUrl: null
  },
  {
    id: 3,
    aircraftId: 'AC-001',
    area: 'Engine #1',
    description: 'Unusual vibration detected during takeoff',
    severity: 'high',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    status: 'open',
    reportedBy: 'Pilot',
    imageUrl: null
  },
  {
    id: 4,
    aircraftId: 'AC-003',
    area: 'Lavatory A',
    description: 'Toilet flush mechanism not working',
    severity: 'low',
    timestamp: new Date(Date.now() - 10800000).toISOString(),
    status: 'resolved',
    reportedBy: 'Cabin Crew Member',
    imageUrl: null
  },
  {
    id: 5,
    aircraftId: 'AC-004',
    area: 'Overhead Bin 15C',
    description: 'Bin door not closing properly',
    severity: 'medium',
    timestamp: new Date(Date.now() - 14400000).toISOString(),
    status: 'open',
    reportedBy: 'Cabin Crew Member',
    imageUrl: null
  }
];

export const mockUsers = [
  {
    id: '1',
    email: 'crew@airline.com',
    password: 'password123',
    role: 'crew',
    name: 'Cabin Crew Member'
  },
  {
    id: '2',
    email: 'engineer@airline.com',
    password: 'password123',
    role: 'engineer',
    name: 'Aircraft Engineer'
  }
];

// Simulate API calls
export const authService = {
  login: async (email, password) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = mockUsers.find(u => u.email === email && u.password === password);
    if (user) {
      return { success: true, user: { ...user, password: undefined } };
    }
    return { success: false, error: 'Invalid credentials' };
  }
};

export const defectService = {
  getDefects: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockDefects;
  },
  
  addDefect: async (defect) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newDefect = {
      ...defect,
      id: Date.now(),
      timestamp: new Date().toISOString(),
      status: 'open'
    };
    mockDefects.unshift(newDefect);
    return newDefect;
  },
  
  updateDefectStatus: async (defectId, status) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const defect = mockDefects.find(d => d.id === defectId);
    if (defect) {
      defect.status = status;
      return defect;
    }
    throw new Error('Defect not found');
  }
};

export const engineService = {
  getEngineHealth: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockEngineHealth;
  },
  
  getRulPrediction: async (aircraftId, engineId) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const engine = mockEngineHealth.find(e => e.aircraftId === aircraftId && e.engineId === engineId);
    return engine ? { rul: engine.rul, confidence: 0.85 } : null;
  }
};

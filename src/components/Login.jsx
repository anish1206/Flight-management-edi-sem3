import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const { login, loginWithGoogle, signup, logout, loading } = useAuth();

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    const result = isSignUp 
      ? await signup(email, password, selectedRole || role)
      : await login(email, password);
      
    if (!result.success) {
      setError(result.error || (isSignUp ? 'Sign up failed' : 'Login failed'));
    } else if (!isSignUp && result.user && result.user.role !== selectedRole) {
      // Check if the logged-in user's role matches the selected role
      setError(`These credentials belong to a ${result.user.role === 'crew' ? 'Cabin Crew' : 'Aircraft Engineer'} account. Please select the correct role or use different credentials.`);
      // Sign out the user since they selected the wrong role
      await logout();
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    const result = await loginWithGoogle();
    if (!result.success) {
      setError(result.error || 'Google login failed');
    } else if (result.user && result.user.role !== selectedRole) {
      // Check if the Google user's role matches the selected role
      setError(`This Google account belongs to a ${result.user.role === 'crew' ? 'Cabin Crew' : 'Aircraft Engineer'} account. Please select the correct role.`);
      // Sign out the user since they selected the wrong role
      await logout();
    }
  };

  const handleRoleSelection = (roleType) => {
    setSelectedRole(roleType);
    setRole(roleType);
    setError('');
    // Pre-fill demo credentials based on role selection
    if (roleType === 'crew') {
      setEmail('crew@airline.com');
      setPassword('password123');
    } else if (roleType === 'engineer') {
      setEmail('engineer@airline.com');
      setPassword('password123');
    }
  };

  const resetToRoleSelection = () => {
    setSelectedRole(null);
    setEmail('');
    setPassword('');
    setError('');
    setIsSignUp(false);
  };

  // Role Selection Screen
  if (!selectedRole) {
    return (
      <div className="container">
        <div style={{ maxWidth: '600px', margin: '50px auto' }}>
          <div className="card">
            <h2 className="text-center mb-20">Aircraft Maintenance System</h2>
            <h3 className="text-center mb-30" style={{ color: '#666', fontWeight: 'normal' }}>
              Select Your Role to Continue
            </h3>
            
            {error && (
              <div className="alert alert-danger">
                {error}
              </div>
            )}

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: '20px',
              marginBottom: '30px'
            }}>
              {/* Crew Login Option */}
              <div 
                onClick={() => handleRoleSelection('crew')}
                style={{
                  border: '2px solid #e0e0e0',
                  borderRadius: '12px',
                  padding: '30px 20px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  backgroundColor: '#f8f9fa'
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = '#007bff';
                  e.target.style.backgroundColor = '#e3f2fd';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = '#e0e0e0';
                  e.target.style.backgroundColor = '#f8f9fa';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                <div style={{
                  fontSize: '48px',
                  marginBottom: '15px',
                  color: '#007bff'
                }}>
                  ✈️
                </div>
                <h4 style={{ 
                  margin: '0 0 10px 0',
                  color: '#333',
                  fontSize: '18px'
                }}>
                  Cabin Crew
                </h4>
                <p style={{ 
                  margin: '0',
                  color: '#666',
                  fontSize: '14px'
                }}>
                  Report defects and maintenance issues during flights
                </p>
              </div>

              {/* Engineer Login Option */}
              <div 
                onClick={() => handleRoleSelection('engineer')}
                style={{
                  border: '2px solid #e0e0e0',
                  borderRadius: '12px',
                  padding: '30px 20px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  backgroundColor: '#f8f9fa'
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = '#28a745';
                  e.target.style.backgroundColor = '#e8f5e8';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = '#e0e0e0';
                  e.target.style.backgroundColor = '#f8f9fa';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                <div style={{
                  fontSize: '48px',
                  marginBottom: '15px',
                  color: '#28a745'
                }}>
                  🔧
                </div>
                <h4 style={{ 
                  margin: '0 0 10px 0',
                  color: '#333',
                  fontSize: '18px'
                }}>
                  Aircraft Engineer
                </h4>
                <p style={{ 
                  margin: '0',
                  color: '#666',
                  fontSize: '14px'
                }}>
                  Monitor aircraft health and manage maintenance tasks
                </p>
              </div>
            </div>

            <div className="text-center">
              <p style={{ fontSize: '12px', color: '#999', margin: '0' }}>
                Click on your role to continue with login
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div style={{ maxWidth: '450px', margin: '50px auto' }}>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
            <button
              onClick={resetToRoleSelection}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '18px',
                cursor: 'pointer',
                color: '#666',
                padding: '0',
                marginRight: '10px'
              }}
              title="Back to role selection"
            >
              ←
            </button>
            <div style={{ flex: 1 }}>
              <h2 style={{ margin: '0', fontSize: '20px' }}>
                {selectedRole === 'crew' ? '✈️ Cabin Crew Login' : '🔧 Engineer Login'}
              </h2>
            </div>
          </div>
          
          <h3 className="text-center mb-20">
            {isSignUp ? 'Create Account' : 'Sign In'}
          </h3>
          
          {error && (
            <div className="alert alert-danger">
              {error}
            </div>
          )}

          {/* Google Sign In Button */}
          <button 
            onClick={handleGoogleLogin}
            className="btn"
            style={{ 
              width: '100%', 
              marginBottom: '20px',
              backgroundColor: '#4285f4',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px'
            }}
            disabled={loading}
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="white" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="white" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="white" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="white" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {loading ? 'Signing in...' : 'Continue with Google'}
          </button>

          <div style={{ 
            textAlign: 'center', 
            margin: '20px 0',
            position: 'relative'
          }}>
            <span style={{ 
              backgroundColor: 'white', 
              padding: '0 15px',
              color: '#666',
              fontSize: '14px'
            }}>
              or
            </span>
            <div style={{
              position: 'absolute',
              top: '50%',
              left: 0,
              right: 0,
              height: '1px',
              backgroundColor: '#ddd',
              zIndex: -1
            }}></div>
          </div>

          <form onSubmit={handleEmailLogin}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                minLength="6"
              />
            </div>

            {isSignUp && (
              <div className="form-group">
                <label htmlFor="role">Role</label>
                <select
                  id="role"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  disabled={true}
                  style={{ backgroundColor: '#f8f9fa', color: '#666' }}
                >
                  <option value="crew">Cabin Crew</option>
                  <option value="engineer">Aircraft Engineer</option>
                </select>
                <small style={{ color: '#666', fontSize: '12px' }}>
                  Role selected: {selectedRole === 'crew' ? 'Cabin Crew' : 'Aircraft Engineer'}
                </small>
              </div>
            )}

            <button 
              type="submit" 
              className="btn" 
              style={{ width: '100%' }}
              disabled={loading}
            >
              {loading ? (isSignUp ? 'Creating account...' : 'Signing in...') : (isSignUp ? 'Create Account' : 'Sign In')}
            </button>
          </form>

          <div className="mt-20 text-center">
            <p style={{ fontSize: '14px', color: '#666' }}>
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}
              <button
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError('');
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#007bff',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  marginLeft: '5px'
                }}
              >
                {isSignUp ? 'Sign in' : 'Sign up'}
              </button>
            </p>
          </div>

          {!isSignUp && (
            <div className="mt-20 text-center">
              <p style={{ fontSize: '12px', color: '#666' }}>
                Demo credentials (auto-filled):<br />
                {selectedRole === 'crew' ? (
                  <>Crew: crew@airline.com / password123</>
                ) : (
                  <>Engineer: engineer@airline.com / password123</>
                )}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;

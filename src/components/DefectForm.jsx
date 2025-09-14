import React, { useState } from 'react';

const DefectForm = ({ onSubmit, onCancel, initialData = {} }) => {
  const [formData, setFormData] = useState({
    aircraftId: initialData.aircraftId || '',
    area: initialData.area || '',
    description: initialData.description || '',
    severity: initialData.severity || 'medium',
    image: null,
    ...initialData
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          image: 'Image size must be less than 5MB'
        }));
        return;
      }
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({
          ...prev,
          image: 'Please select a valid image file'
        }));
        return;
      }
      
      setFormData(prev => ({
        ...prev,
        image: file
      }));
      
      setErrors(prev => ({
        ...prev,
        image: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.aircraftId.trim()) {
      newErrors.aircraftId = 'Aircraft ID is required';
    }
    
    if (!formData.area.trim()) {
      newErrors.area = 'Area/Seat is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="card">
      <h3>Report New Defect</h3>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-2">
          <div className="form-group">
            <label htmlFor="aircraftId">Aircraft ID *</label>
            <input
              type="text"
              id="aircraftId"
              name="aircraftId"
              value={formData.aircraftId}
              onChange={handleInputChange}
              placeholder="e.g., AC-001"
              className={errors.aircraftId ? 'error' : ''}
            />
            {errors.aircraftId && (
              <div className="alert alert-danger" style={{ marginTop: '5px', padding: '8px' }}>
                {errors.aircraftId}
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="area">Area/Seat *</label>
            <input
              type="text"
              id="area"
              name="area"
              value={formData.area}
              onChange={handleInputChange}
              placeholder="e.g., Seat 12A, Galley, Lavatory"
              className={errors.area ? 'error' : ''}
            />
            {errors.area && (
              <div className="alert alert-danger" style={{ marginTop: '5px', padding: '8px' }}>
                {errors.area}
              </div>
            )}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Describe the issue in detail..."
            rows="4"
            className={errors.description ? 'error' : ''}
          />
          {errors.description && (
            <div className="alert alert-danger" style={{ marginTop: '5px', padding: '8px' }}>
              {errors.description}
            </div>
          )}
        </div>

        <div className="grid grid-2">
          <div className="form-group">
            <label htmlFor="severity">Severity Level</label>
            <select
              id="severity"
              name="severity"
              value={formData.severity}
              onChange={handleInputChange}
            >
              <option value="low">Low - Minor inconvenience</option>
              <option value="medium">Medium - Affects service quality</option>
              <option value="high">High - Safety concern or major issue</option>
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
            {errors.image && (
              <div className="alert alert-danger" style={{ marginTop: '5px', padding: '8px' }}>
                {errors.image}
              </div>
            )}
            {formData.image && (
              <div style={{ marginTop: '5px', fontSize: '12px', color: '#666' }}>
                Selected: {formData.image.name}
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <button type="submit" className="btn">
            Submit Report
          </button>
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default DefectForm;

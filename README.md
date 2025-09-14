# Unified Smart Aircraft Maintenance System

A cloud-native, AI-powered, web-based platform that unifies predictive engine health monitoring, real-time cabin defect logging, and centralized engineer dashboard for proactive aircraft maintenance decisions.

## 🎯 Objective

To build a comprehensive maintenance system that:
- Reduces aircraft downtime through predictive maintenance
- Improves in-flight service quality
- Enables data-driven maintenance planning
- Provides real-time defect reporting and tracking

## 🚀 Features

### For Cabin Crew
- **Defect Reporting**: Easy-to-use interface for logging cabin issues
- **Image Attachments**: Upload photos to better describe defects
- **Real-time Updates**: See status of reported issues
- **Aircraft Selection**: Report issues for specific aircraft

### For Aircraft Engineers
- **Real-time Dashboard**: Monitor all defects and engine health
- **Predictive Analytics**: RUL (Remaining Useful Life) predictions
- **Defect Management**: Update status and track progress
- **Engine Health Monitoring**: Visual charts and alerts
- **Fleet Overview**: Comprehensive analytics and reporting

## 🛠 Technology Stack

- **Frontend**: React 18 with React Router
- **Charts**: Recharts for data visualization
- **Styling**: Custom CSS with responsive design
- **State Management**: React Context API
- **Authentication**: Role-based access control

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/aircraft-maintenance-system.git
cd aircraft-maintenance-system
```

2. Install dependencies:
```bash
npm install
```

3. Set up Firebase (see [Firebase Setup Guide](FIREBASE_SETUP.md)):
   - Create a Firebase project
   - Enable Authentication (Email/Password + Google)
   - Create Firestore database
   - Copy your Firebase config

4. Create environment file:
```bash
# Copy the example file
cp .env.example .env

# Edit .env with your Firebase configuration
# Add your Firebase project credentials
```

5. Start the development server:
```bash
npm start
```

6. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## 🔐 Demo Credentials

### Cabin Crew
- **Email**: crew@airline.com
- **Password**: password123

### Aircraft Engineer
- **Email**: engineer@airline.com
- **Password**: password123

## 📱 User Roles

### Cabin Crew Portal
- Report new defects with detailed descriptions
- Attach images to defect reports
- View history of all reported issues
- Filter and search through reports

### Engineer Dashboard
- Real-time defect monitoring
- Engine health visualization
- RUL (Remaining Useful Life) predictions
- Defect status management
- Fleet analytics and reporting
- System notifications and alerts

## 🏗 Project Structure

```
src/
├── components/
│   ├── Login.jsx              # Authentication component
│   ├── CrewPortal.jsx         # Cabin crew interface
│   ├── EngineerDashboard.jsx  # Engineer dashboard
│   ├── DefectForm.jsx         # Defect reporting form
│   └── EngineHealthChart.jsx  # Data visualization
├── contexts/
│   └── AuthContext.js         # Authentication context
├── services/
│   └── mockData.js           # Mock data and services
├── App.js                    # Main application component
├── index.js                  # Application entry point
└── index.css                 # Global styles
```

## 🔧 Key Components

### Authentication System
- Role-based access control (Crew vs Engineer)
- Session management with localStorage
- Protected routes based on user roles

### Defect Management
- Comprehensive defect reporting form
- Image upload capability
- Status tracking (Open → In Progress → Resolved)
- Severity classification (Low, Medium, High)

### Engine Health Monitoring
- RUL predictions with confidence intervals
- Real-time sensor data visualization
- Health status indicators
- Maintenance alerts

### Data Visualization
- Interactive charts using Recharts
- Engine health trends
- Defect distribution analytics
- Fleet performance metrics

## 🚀 Future Enhancements

- **Firebase Integration**: Real-time database and authentication
- **ML Model Integration**: Actual RUL prediction algorithms
- **Image Storage**: Cloud storage for defect images
- **Push Notifications**: Real-time alerts for critical issues
- **Mobile App**: Native mobile application
- **Advanced Analytics**: Machine learning insights
- **Compliance Reporting**: Regulatory compliance features

## 📊 Mock Data

The application includes comprehensive mock data for:
- Aircraft fleet information
- Engine health metrics
- Defect reports
- User accounts
- Historical maintenance data

## 🎨 UI/UX Features

- **Responsive Design**: Works on desktop and mobile devices
- **Modern Interface**: Clean, professional design
- **Intuitive Navigation**: Easy-to-use role-based interfaces
- **Real-time Updates**: Live data refresh capabilities
- **Accessibility**: Keyboard navigation and screen reader support

## 🔒 Security Features

- Role-based access control
- Input validation and sanitization
- Secure authentication flow
- Protected API endpoints (simulated)

## 📈 Performance

- Optimized React components
- Efficient data visualization
- Lazy loading for large datasets
- Responsive chart rendering

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support or questions, please contact the development team or create an issue in the repository.

---

**Note**: This is a demonstration application with mock data. In a production environment, it would integrate with real aircraft systems, databases, and cloud services.

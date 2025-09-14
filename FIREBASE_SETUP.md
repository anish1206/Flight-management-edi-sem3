# Firebase Setup Instructions

## 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter project name: `aircraft-maintenance-system` (or your preferred name)
4. Enable Google Analytics (optional)
5. Click "Create project"

## 2. Enable Authentication

1. In your Firebase project, go to "Authentication" in the left sidebar
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable the following providers:
   - **Email/Password**: Toggle ON
   - **Google**: Toggle ON and configure (add your domain)

## 3. Create Firestore Database

1. Go to "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location for your database
5. Click "Done"

## 4. Get Firebase Configuration

1. Go to Project Settings (gear icon) → "General" tab
2. Scroll down to "Your apps" section
3. Click "Web" icon (`</>`) to add a web app
4. Enter app nickname: `aircraft-maintenance-web`
5. Check "Also set up Firebase Hosting" (optional)
6. Click "Register app"
7. Copy the Firebase configuration object

## 5. Create Environment File

1. Create a `.env` file in your project root
2. Add the following variables with your Firebase config values:

```env
REACT_APP_FIREBASE_API_KEY=your_api_key_here
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

## 6. Set Up Firestore Security Rules

1. Go to "Firestore Database" → "Rules" tab
2. Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Defects collection - authenticated users can read/write
    match /defects/{defectId} {
      allow read, write: if request.auth != null;
    }
    
    // Engine health data - authenticated users can read/write
    match /engineHealth/{healthId} {
      allow read, write: if request.auth != null;
    }
    
    // Aircraft data - authenticated users can read/write
    match /aircraft/{aircraftId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 7. Install Dependencies

```bash
npm install
```

## 8. Start the Application

```bash
npm start
```

## 9. Test Authentication

1. Open the application in your browser
2. Try creating a new account with email/password
3. Try signing in with Google
4. Test both Crew and Engineer roles

## 10. Create Sample Users (Optional)

You can create sample users directly in the Firebase Console:

1. Go to "Authentication" → "Users" tab
2. Click "Add user"
3. Enter email and password
4. Go to "Firestore Database" → "Data" tab
5. Create a document in "users" collection with the user's UID
6. Add fields: `email`, `role` (crew/engineer), `createdAt`

## Troubleshooting

### Common Issues:

1. **"Firebase: Error (auth/configuration-not-found)"**
   - Check your `.env` file has correct Firebase config
   - Restart the development server after adding `.env`

2. **"Firebase: Error (auth/operation-not-allowed-in-this-environment)"**
   - Make sure you've enabled Email/Password authentication in Firebase Console

3. **"Firebase: Error (auth/domain-not-authorized)"**
   - Add your domain to authorized domains in Firebase Console
   - For development, add `localhost:3000`

4. **"Firebase: Error (auth/popup-closed-by-user)"**
   - This is normal if user closes the Google popup
   - Handle gracefully in your error handling

### Development vs Production:

- For development: Use test mode Firestore rules
- For production: Update Firestore rules for better security
- Add your production domain to authorized domains
- Consider using Firebase Hosting for deployment

## Next Steps

1. Set up Firebase Storage for image uploads
2. Implement real-time listeners for defects
3. Add push notifications
4. Deploy to Firebase Hosting
5. Set up CI/CD pipeline

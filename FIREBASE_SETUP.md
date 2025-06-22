# 🔥 Firebase Setup Guide

This guide will help you set up Firebase as the backend for your AI Resume Pro application.

## 📋 Prerequisites

- Google account
- Firebase project (we'll create this)
- Basic understanding of web development

## 🚀 Step-by-Step Setup

### 1. Create Firebase Project

1. **Go to [Firebase Console](https://console.firebase.google.com/)**
2. **Click "Create a project"**
3. **Enter project name**: `ai-resume-pro` (or your preferred name)
4. **Enable Google Analytics** (optional but recommended)
5. **Click "Create project"**
6. **Wait for project creation to complete**

### 2. Enable Authentication

1. **In Firebase Console, go to "Authentication"**
2. **Click "Get started"**
3. **Go to "Sign-in method" tab**
4. **Enable "Email/Password"**:
   - Click on "Email/Password"
   - Toggle "Enable"
   - Click "Save"
5. **Optional: Enable other providers** (Google, Facebook, etc.)

### 3. Enable Firestore Database

1. **Go to "Firestore Database"**
2. **Click "Create database"**
3. **Choose security mode**:
   - Select "Start in test mode" (for development)
   - Click "Next"
4. **Select location**:
   - Choose the closest region to your users
   - Click "Done"
5. **Wait for database creation**

### 4. Set Up Security Rules

1. **In Firestore Database, go to "Rules" tab**
2. **Replace the default rules with**:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Allow users to manage their own subcollections
      match /{subcollection}/{document=**} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
    
    // Default deny all
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

3. **Click "Publish"**

### 5. Get Firebase Configuration

1. **Go to Project Settings** (gear icon in top left)
2. **Scroll down to "Your apps"**
3. **Click "Add app"** → **Web** (</>)
4. **Register app**:
   - App nickname: `AI Resume Pro Web`
   - Check "Also set up Firebase Hosting" (optional)
   - Click "Register app"
5. **Copy the configuration object**:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key-here",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

### 6. Update Your Code

1. **Open `src/config/firebase.js`**
2. **Replace the placeholder config** with your actual Firebase config
3. **Save the file**

### 7. Test the Setup

1. **Start your development server**: `npm run dev`
2. **Go to your app**
3. **Try to register a new user**
4. **Check Firebase Console**:
   - Go to Authentication → Users (should see your new user)
   - Go to Firestore Database → Data (should see user document)

## 📁 Database Structure

After setup, your Firestore will have this structure:

```
users/
  {userId}/
    firstName: "John"
    lastName: "Doe"
    email: "john@example.com"
    phone: "+1234567890"
    location: "New York, NY"
    bio: "Experienced developer..."
    createdAt: timestamp
    updatedAt: timestamp
    
    resumes/
      {resumeId}/
        name: "Software Engineer Resume"
        jobTitle: "Software Engineer"
        experience: [...]
        skills: "..."
        createdAt: timestamp
        updatedAt: timestamp
    
    coverLetters/
      {coverLetterId}/
        name: "Cover Letter for Google"
        companyName: "Google"
        jobTitle: "Software Engineer"
        content: "..."
        createdAt: timestamp
        updatedAt: timestamp
    
    generatedContent/
      {contentId}/
        type: "resume"
        content: "<html>..."
        metadata: {...}
        createdAt: timestamp
```

## 🔧 Environment Variables (Optional)

For better security, you can use environment variables:

1. **Create `.env.local` file** in your project root:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

2. **Update `src/config/firebase.js`**:

```javascript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};
```

## 🚨 Security Best Practices

1. **Never commit your Firebase config** to public repositories
2. **Use environment variables** for sensitive data
3. **Set up proper security rules** in Firestore
4. **Enable authentication methods** you need
5. **Monitor usage** in Firebase Console

## 🔍 Troubleshooting

### Common Issues:

1. **"Firebase App named '[DEFAULT]' already exists"**
   - Make sure you're not initializing Firebase multiple times

2. **"Permission denied" errors**
   - Check your Firestore security rules
   - Make sure user is authenticated

3. **"Network request failed"**
   - Check your internet connection
   - Verify Firebase config is correct

4. **"User not found"**
   - Make sure user document exists in Firestore
   - Check if user registration completed successfully

### Debug Tips:

1. **Check browser console** for error messages
2. **Use Firebase Console** to monitor requests
3. **Enable debug mode** in development
4. **Check network tab** for failed requests

## 📊 Monitoring

After setup, you can monitor your app in Firebase Console:

- **Authentication**: User sign-ups, sign-ins, password resets
- **Firestore**: Database usage, read/write operations
- **Analytics**: User behavior, app performance
- **Crashlytics**: App crashes and errors

## 🎉 You're Done!

Your Firebase backend is now set up and ready to use. The app will:

- ✅ Save user authentication data securely
- ✅ Store resumes and cover letters in Firestore
- ✅ Handle user profiles and preferences
- ✅ Provide real-time data synchronization
- ✅ Scale automatically with your app

Happy coding! 🚀 
# 🔥 Firebase Auth Setup - Quick Guide

## ✅ Step 1: Enable Email/Password Authentication

1. **Go to [Firebase Console](https://console.firebase.google.com/project/ai-resume-285cd/authentication/providers)**
2. **Click on "Authentication" in the left sidebar**
3. **Click "Get started" if you haven't already**
4. **Go to "Sign-in method" tab**
5. **Find "Email/Password" and click on it**
6. **Toggle "Enable" to ON**
7. **Click "Save"**

## ✅ Step 2: Enable Firestore Database

1. **Go to [Firestore Database](https://console.firebase.google.com/project/ai-resume-285cd/firestore)**
2. **Click "Create database" if not already created**
3. **Choose "Start in test mode"**
4. **Select a location (choose closest to your users)**
5. **Click "Done"**

## ✅ Step 3: Set Security Rules

1. **In Firestore Database, go to "Rules" tab**
2. **Replace with these rules:**

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

## ✅ Step 4: Test Authentication

1. **Open your app at `http://localhost:5173`**
2. **Look for the "Firebase Auth Test" component**
3. **Try registering a new user**
4. **Check Firebase Console → Authentication → Users**
5. **Check Firestore Database → Data for user documents**

## 🎯 What to Expect

After setup, you should see:
- ✅ Users appear in Firebase Console → Authentication → Users
- ✅ User documents created in Firestore Database → Data
- ✅ Successful login/logout in your app
- ✅ User data persisted across sessions

## 🚨 Common Issues

**"Permission denied" errors:**
- Check Firestore security rules
- Make sure user is authenticated

**"Email already in use":**
- User already exists, try logging in instead

**"Network error":**
- Check internet connection
- Verify Firebase config is correct

## 🎉 Success!

Once everything works:
1. **Remove test components** from `src/pages/Home.jsx`
2. **Delete test files**: `FirebaseTest.jsx` and `AuthTest.jsx`
3. **Your Firebase Auth is fully integrated!**

Your app now has:
- ✅ Secure user authentication
- ✅ User registration and login
- ✅ Password reset functionality
- ✅ User profile management
- ✅ Protected content areas
- ✅ Real-time auth state monitoring 
# 🔥 Google Authentication Setup Guide

## ✅ Step 1: Enable Google Authentication in Firebase Console

1. **Go to [Firebase Console](https://console.firebase.google.com/project/ai-resume-285cd/authentication/providers)**
2. **Click on "Authentication" in the left sidebar**
3. **Go to "Sign-in method" tab**
4. **Find "Google" and click on it**
5. **Toggle "Enable" to ON**
6. **Add your authorized domain** (for development, add `localhost`)
7. **Click "Save"**

## ✅ Step 2: Configure OAuth Consent Screen (if needed)

If you haven't set up OAuth consent screen:

1. **Go to [Google Cloud Console](https://console.cloud.google.com/)**
2. **Select your Firebase project**
3. **Go to "APIs & Services" → "OAuth consent screen"**
4. **Choose "External" user type**
5. **Fill in required information:**
   - App name: `AI Resume Pro`
   - User support email: Your email
   - Developer contact information: Your email
6. **Add scopes:**
   - `email`
   - `profile`
   - `openid`
7. **Add test users** (your email addresses)
8. **Click "Save and Continue"**

## ✅ Step 3: Configure OAuth 2.0 Client ID

1. **In Google Cloud Console, go to "APIs & Services" → "Credentials"**
2. **Find your OAuth 2.0 Client ID**
3. **Add authorized JavaScript origins:**
   - `http://localhost:5173` (for development)
   - `https://your-domain.com` (for production)
4. **Add authorized redirect URIs:**
   - `http://localhost:5173` (for development)
   - `https://your-domain.com` (for production)
5. **Click "Save"**

## ✅ Step 4: Test Google Authentication

1. **Open your app** at `http://localhost:5173`
2. **Click "Sign In" in the header**
3. **Click "Continue with Google"**
4. **You should be redirected to Google's sign-in page**
5. **Sign in with your Google account**
6. **You should be redirected back to your app**

## 🎯 What You'll See

**In Your App:**
- ✅ Google sign-in button in login/register forms
- ✅ Google popup for authentication
- ✅ Automatic user creation in Firestore
- ✅ User profile with Google data (name, email, photo)

**In Firebase Console:**
- ✅ Users in Authentication → Users
- ✅ User documents in Firestore Database → Data
- ✅ Google as the sign-in provider

## 🚨 Common Issues

**"Popup blocked" error:**
- Allow popups for your domain
- Try using redirect method instead

**"Unauthorized domain" error:**
- Add your domain to authorized domains in Firebase Console
- Make sure you're using the correct domain

**"OAuth consent screen not configured" error:**
- Follow Step 2 to configure OAuth consent screen
- Add your email as a test user

**"Redirect URI mismatch" error:**
- Check that your redirect URIs match exactly
- Include both http and https versions if needed

## 🔧 Advanced Configuration

### Custom OAuth Scopes
You can request additional scopes by modifying the Google provider:

```javascript
// In firebaseAuthService.js
this.googleProvider.addScope('https://www.googleapis.com/auth/user.birthday.read');
this.googleProvider.addScope('https://www.googleapis.com/auth/user.gender.read');
```

### Custom Parameters
Add custom parameters to the OAuth request:

```javascript
this.googleProvider.setCustomParameters({
  prompt: 'select_account'
});
```

## 🎉 Success!

Once Google authentication is working:

- ✅ Users can sign up/login with Google
- ✅ User profiles are automatically created
- ✅ Google profile data is synced
- ✅ Users can still use email/password as backup
- ✅ Secure authentication with Google's infrastructure

## 📱 Features Available

**For Google Users:**
- Automatic profile creation
- Profile picture from Google
- Name and email from Google account
- Secure authentication
- No password required

**For All Users:**
- Email/password authentication
- Google authentication
- Password reset functionality
- User profile management
- Protected content access

Your app now supports both traditional email/password and modern Google authentication! 🚀 
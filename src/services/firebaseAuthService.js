import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  updateProfile,
  sendPasswordResetEmail,
  confirmPasswordReset,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  collection,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import { auth, db } from '../config/firebase';

class FirebaseAuthService {
  // Google Auth Provider
  googleProvider = new GoogleAuthProvider();

  // Register new user with email/password
  async register(userData) {
    try {
      // Create user with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        userData.email, 
        userData.password
      );
      
      const user = userCredential.user;
      
      // Update display name
      await updateProfile(user, {
        displayName: `${userData.firstName} ${userData.lastName}`
      });
      
      // Create user document in Firestore
      const userDoc = {
        uid: user.uid,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        phone: userData.phone || '',
        location: userData.location || '',
        bio: userData.bio || '',
        authProvider: 'email',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      await setDoc(doc(db, 'users', user.uid), userDoc);
      
      // Return user data without sensitive info
      const { password, ...userWithoutPassword } = userData;
      return {
        user: userDoc,
        token: await user.getIdToken()
      };
    } catch (error) {
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  // Login user with email/password
  async login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Get user data from Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (!userDoc.exists()) {
        throw new Error('User profile not found');
      }
      
      const userData = userDoc.data();
      
      return {
        user: userData,
        token: await user.getIdToken()
      };
    } catch (error) {
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  // Login with Google (Popup)
  async loginWithGoogle() {
    try {
      const result = await signInWithPopup(auth, this.googleProvider);
      const user = result.user;
      
      // Check if user document exists
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (!userDoc.exists()) {
        // Create new user document for Google user
        const userData = {
          uid: user.uid,
          firstName: user.displayName?.split(' ')[0] || '',
          lastName: user.displayName?.split(' ').slice(1).join(' ') || '',
          email: user.email,
          phone: user.phoneNumber || '',
          location: '',
          bio: '',
          authProvider: 'google',
          photoURL: user.photoURL || '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        await setDoc(doc(db, 'users', user.uid), userData);
        
        return {
          user: userData,
          token: await user.getIdToken(),
          isNewUser: true
        };
      } else {
        // Update existing user's last login
        const userData = userDoc.data();
        await updateDoc(doc(db, 'users', user.uid), {
          lastLoginAt: new Date().toISOString(),
          photoURL: user.photoURL || userData.photoURL
        });
        
        return {
          user: { ...userData, photoURL: user.photoURL || userData.photoURL },
          token: await user.getIdToken(),
          isNewUser: false
        };
      }
    } catch (error) {
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  // Login with Google (Redirect) - Alternative method
  async loginWithGoogleRedirect() {
    try {
      await signInWithRedirect(auth, this.googleProvider);
      // User will be redirected to Google, then back to your app
    } catch (error) {
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  // Handle Google redirect result
  async handleGoogleRedirectResult() {
    try {
      const result = await getRedirectResult(auth);
      if (result) {
        const user = result.user;
        
        // Check if user document exists
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        
        if (!userDoc.exists()) {
          // Create new user document
          const userData = {
            uid: user.uid,
            firstName: user.displayName?.split(' ')[0] || '',
            lastName: user.displayName?.split(' ').slice(1).join(' ') || '',
            email: user.email,
            phone: user.phoneNumber || '',
            location: '',
            bio: '',
            authProvider: 'google',
            photoURL: user.photoURL || '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          
          await setDoc(doc(db, 'users', user.uid), userData);
          
          return {
            user: userData,
            token: await user.getIdToken(),
            isNewUser: true
          };
        } else {
          // Update existing user
          const userData = userDoc.data();
          await updateDoc(doc(db, 'users', user.uid), {
            lastLoginAt: new Date().toISOString(),
            photoURL: user.photoURL || userData.photoURL
          });
          
          return {
            user: { ...userData, photoURL: user.photoURL || userData.photoURL },
            token: await user.getIdToken(),
            isNewUser: false
          };
        }
      }
      return null;
    } catch (error) {
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  // Logout user
  async logout() {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      throw new Error('Failed to logout');
    }
  }

  // Update user profile
  async updateProfile(userId, profileData) {
    try {
      const userRef = doc(db, 'users', userId);
      
      const updateData = {
        ...profileData,
        updatedAt: new Date().toISOString()
      };
      
      await updateDoc(userRef, updateData);
      
      // Get updated user data
      const userDoc = await getDoc(userRef);
      const userData = userDoc.data();
      
      return { user: userData };
    } catch (error) {
      throw new Error('Failed to update profile');
    }
  }

  // Forgot password
  async forgotPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error) {
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  // Reset password
  async resetPassword(token, newPassword) {
    try {
      await confirmPasswordReset(auth, token, newPassword);
      return { success: true };
    } catch (error) {
      throw new Error('Failed to reset password');
    }
  }

  // Validate token and get user
  async validateToken(token) {
    try {
      // Firebase automatically validates tokens
      // We'll use the current user from auth state
      const user = auth.currentUser;
      
      if (!user) {
        throw new Error('No authenticated user');
      }
      
      // Get user data from Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (!userDoc.exists()) {
        throw new Error('User profile not found');
      }
      
      const userData = userDoc.data();
      
      return { user: userData };
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  // Get current user
  async getCurrentUser() {
    try {
      const user = auth.currentUser;
      
      if (!user) {
        return null;
      }
      
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (!userDoc.exists()) {
        return null;
      }
      
      return userDoc.data();
    } catch (error) {
      return null;
    }
  }

  // Listen to auth state changes
  onAuthStateChanged(callback) {
    return onAuthStateChanged(auth, callback);
  }

  // Get user by email
  async getUserByEmail(email) {
    try {
      const q = query(collection(db, 'users'), where('email', '==', email));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return null;
      }
      
      return querySnapshot.docs[0].data();
    } catch (error) {
      return null;
    }
  }

  // Helper method to get user-friendly error messages
  getErrorMessage(errorCode) {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'No account found with this email address';
      case 'auth/wrong-password':
        return 'Incorrect password';
      case 'auth/email-already-in-use':
        return 'An account with this email already exists';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters';
      case 'auth/invalid-email':
        return 'Invalid email address';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later';
      case 'auth/network-request-failed':
        return 'Network error. Please check your connection';
      case 'auth/popup-closed-by-user':
        return 'Google sign-in was cancelled';
      case 'auth/popup-blocked':
        return 'Google sign-in popup was blocked. Please allow popups for this site';
      case 'auth/cancelled-popup-request':
        return 'Google sign-in was cancelled';
      case 'auth/account-exists-with-different-credential':
        return 'An account already exists with the same email address but different sign-in credentials';
      default:
        return 'An error occurred. Please try again';
    }
  }
}

export default new FirebaseAuthService(); 
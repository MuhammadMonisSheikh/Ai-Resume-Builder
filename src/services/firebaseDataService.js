import { 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  collection, 
  query, 
  where, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';

class FirebaseDataService {
  // Save resume data
  async saveResume(userId, resumeData, resumeId = null) {
    try {
      const resumeRef = resumeId 
        ? doc(db, 'users', userId, 'resumes', resumeId)
        : doc(collection(db, 'users', userId, 'resumes'));
      
      const resumeDoc = {
        ...resumeData,
        userId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        id: resumeRef.id
      };
      
      await setDoc(resumeRef, resumeDoc);
      
      return {
        success: true,
        resumeId: resumeRef.id,
        resume: resumeDoc
      };
    } catch (error) {
      throw new Error('Failed to save resume');
    }
  }

  // Get user's resumes
  async getUserResumes(userId) {
    try {
      const resumesRef = collection(db, 'users', userId, 'resumes');
      const q = query(resumesRef, orderBy('updatedAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const resumes = [];
      querySnapshot.forEach((doc) => {
        resumes.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return resumes;
    } catch (error) {
      throw new Error('Failed to fetch resumes');
    }
  }

  // Get specific resume
  async getResume(userId, resumeId) {
    try {
      const resumeRef = doc(db, 'users', userId, 'resumes', resumeId);
      const resumeDoc = await getDoc(resumeRef);
      
      if (!resumeDoc.exists()) {
        throw new Error('Resume not found');
      }
      
      return {
        id: resumeDoc.id,
        ...resumeDoc.data()
      };
    } catch (error) {
      throw new Error('Failed to fetch resume');
    }
  }

  // Update resume
  async updateResume(userId, resumeId, resumeData) {
    try {
      const resumeRef = doc(db, 'users', userId, 'resumes', resumeId);
      
      const updateData = {
        ...resumeData,
        updatedAt: serverTimestamp()
      };
      
      await updateDoc(resumeRef, updateData);
      
      return { success: true };
    } catch (error) {
      throw new Error('Failed to update resume');
    }
  }

  // Delete resume
  async deleteResume(userId, resumeId) {
    try {
      const resumeRef = doc(db, 'users', userId, 'resumes', resumeId);
      await deleteDoc(resumeRef);
      
      return { success: true };
    } catch (error) {
      throw new Error('Failed to delete resume');
    }
  }

  // Save cover letter data
  async saveCoverLetter(userId, coverLetterData, coverLetterId = null) {
    try {
      const coverLetterRef = coverLetterId 
        ? doc(db, 'users', userId, 'coverLetters', coverLetterId)
        : doc(collection(db, 'users', userId, 'coverLetters'));
      
      const coverLetterDoc = {
        ...coverLetterData,
        userId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        id: coverLetterRef.id
      };
      
      await setDoc(coverLetterRef, coverLetterDoc);
      
      return {
        success: true,
        coverLetterId: coverLetterRef.id,
        coverLetter: coverLetterDoc
      };
    } catch (error) {
      throw new Error('Failed to save cover letter');
    }
  }

  // Get user's cover letters
  async getUserCoverLetters(userId) {
    try {
      const coverLettersRef = collection(db, 'users', userId, 'coverLetters');
      const q = query(coverLettersRef, orderBy('updatedAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const coverLetters = [];
      querySnapshot.forEach((doc) => {
        coverLetters.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return coverLetters;
    } catch (error) {
      throw new Error('Failed to fetch cover letters');
    }
  }

  // Get specific cover letter
  async getCoverLetter(userId, coverLetterId) {
    try {
      const coverLetterRef = doc(db, 'users', userId, 'coverLetters', coverLetterId);
      const coverLetterDoc = await getDoc(coverLetterRef);
      
      if (!coverLetterDoc.exists()) {
        throw new Error('Cover letter not found');
      }
      
      return {
        id: coverLetterDoc.id,
        ...coverLetterDoc.data()
      };
    } catch (error) {
      throw new Error('Failed to fetch cover letter');
    }
  }

  // Update cover letter
  async updateCoverLetter(userId, coverLetterId, coverLetterData) {
    try {
      const coverLetterRef = doc(db, 'users', userId, 'coverLetters', coverLetterId);
      
      const updateData = {
        ...coverLetterData,
        updatedAt: serverTimestamp()
      };
      
      await updateDoc(coverLetterRef, updateData);
      
      return { success: true };
    } catch (error) {
      throw new Error('Failed to update cover letter');
    }
  }

  // Delete cover letter
  async deleteCoverLetter(userId, coverLetterId) {
    try {
      const coverLetterRef = doc(db, 'users', userId, 'coverLetters', coverLetterId);
      await deleteDoc(coverLetterRef);
      
      return { success: true };
    } catch (error) {
      throw new Error('Failed to delete cover letter');
    }
  }

  // Save user preferences
  async saveUserPreferences(userId, preferences) {
    try {
      const userRef = doc(db, 'users', userId);
      
      const updateData = {
        preferences: {
          ...preferences,
          updatedAt: serverTimestamp()
        }
      };
      
      await updateDoc(userRef, updateData);
      
      return { success: true };
    } catch (error) {
      throw new Error('Failed to save preferences');
    }
  }

  // Get user preferences
  async getUserPreferences(userId) {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        return null;
      }
      
      return userDoc.data().preferences || {};
    } catch (error) {
      throw new Error('Failed to fetch preferences');
    }
  }

  // Save generated content (resume/cover letter HTML)
  async saveGeneratedContent(userId, type, content, metadata = {}) {
    try {
      const contentRef = doc(collection(db, 'users', userId, 'generatedContent'));
      
      const contentDoc = {
        userId,
        type, // 'resume' or 'coverLetter'
        content,
        metadata,
        createdAt: serverTimestamp(),
        id: contentRef.id
      };
      
      await setDoc(contentRef, contentDoc);
      
      return {
        success: true,
        contentId: contentRef.id
      };
    } catch (error) {
      throw new Error('Failed to save generated content');
    }
  }

  // Get user's generated content
  async getUserGeneratedContent(userId, type = null) {
    try {
      const contentRef = collection(db, 'users', userId, 'generatedContent');
      let q = query(contentRef, orderBy('createdAt', 'desc'));
      
      if (type) {
        q = query(contentRef, where('type', '==', type), orderBy('createdAt', 'desc'));
      }
      
      const querySnapshot = await getDocs(q);
      
      const content = [];
      querySnapshot.forEach((doc) => {
        content.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return content;
    } catch (error) {
      throw new Error('Failed to fetch generated content');
    }
  }
}

export default new FirebaseDataService(); 
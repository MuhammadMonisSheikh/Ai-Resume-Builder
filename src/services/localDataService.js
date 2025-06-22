// Local Data Service for IndexedDB operations
class LocalDataService {
  constructor() {
    this.dbName = 'ResumeAppDB';
    this.version = 1;
  }

  // Initialize database
  async initDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // Create resumes store
        if (!db.objectStoreNames.contains('resumes')) {
          const resumeStore = db.createObjectStore('resumes', { keyPath: 'id', autoIncrement: true });
          resumeStore.createIndex('userId', 'userId', { unique: false });
          resumeStore.createIndex('createdAt', 'createdAt', { unique: false });
          resumeStore.createIndex('updatedAt', 'updatedAt', { unique: false });
        }

        // Create cover letters store
        if (!db.objectStoreNames.contains('coverLetters')) {
          const coverLetterStore = db.createObjectStore('coverLetters', { keyPath: 'id', autoIncrement: true });
          coverLetterStore.createIndex('userId', 'userId', { unique: false });
          coverLetterStore.createIndex('createdAt', 'createdAt', { unique: false });
          coverLetterStore.createIndex('updatedAt', 'updatedAt', { unique: false });
        }
      };
    });
  }

  // Get database connection
  async getDB() {
    return await this.initDB();
  }

  // Save resume
  async saveResume(userId, resumeData) {
    const db = await this.getDB();
    const transaction = db.transaction(['resumes'], 'readwrite');
    const store = transaction.objectStore('resumes');
    
    const resume = {
      userId,
      ...resumeData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return new Promise((resolve, reject) => {
      const request = store.add(resume);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Update resume
  async updateResume(id, resumeData) {
    const db = await this.getDB();
    const transaction = db.transaction(['resumes'], 'readwrite');
    const store = transaction.objectStore('resumes');
    
    // First get the existing resume
    const getRequest = store.get(id);
    
    return new Promise((resolve, reject) => {
      getRequest.onsuccess = () => {
        const existingResume = getRequest.result;
        if (!existingResume) {
          reject(new Error('Resume not found'));
          return;
        }

        const updatedResume = {
          ...existingResume,
          ...resumeData,
          updatedAt: new Date().toISOString()
        };

        const updateRequest = store.put(updatedResume);
        updateRequest.onsuccess = () => resolve(updateRequest.result);
        updateRequest.onerror = () => reject(updateRequest.error);
      };
      getRequest.onerror = () => reject(getRequest.error);
    });
  }

  // Get all resumes for a user
  async getUserResumes(userId) {
    const db = await this.getDB();
    const transaction = db.transaction(['resumes'], 'readonly');
    const store = transaction.objectStore('resumes');
    const index = store.index('userId');
    
    return new Promise((resolve, reject) => {
      const request = index.getAll(userId);
      request.onsuccess = () => {
        const resumes = request.result.sort((a, b) => 
          new Date(b.updatedAt) - new Date(a.updatedAt)
        );
        resolve(resumes);
      };
      request.onerror = () => reject(request.error);
    });
  }

  // Get a specific resume
  async getResume(id) {
    const db = await this.getDB();
    const transaction = db.transaction(['resumes'], 'readonly');
    const store = transaction.objectStore('resumes');
    
    return new Promise((resolve, reject) => {
      const request = store.get(id);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Delete resume
  async deleteResume(id) {
    const db = await this.getDB();
    const transaction = db.transaction(['resumes'], 'readwrite');
    const store = transaction.objectStore('resumes');
    
    return new Promise((resolve, reject) => {
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Save cover letter
  async saveCoverLetter(userId, coverLetterData) {
    const db = await this.getDB();
    const transaction = db.transaction(['coverLetters'], 'readwrite');
    const store = transaction.objectStore('coverLetters');
    
    const coverLetter = {
      userId,
      ...coverLetterData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return new Promise((resolve, reject) => {
      const request = store.add(coverLetter);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Update cover letter
  async updateCoverLetter(id, coverLetterData) {
    const db = await this.getDB();
    const transaction = db.transaction(['coverLetters'], 'readwrite');
    const store = transaction.objectStore('coverLetters');
    
    // First get the existing cover letter
    const getRequest = store.get(id);
    
    return new Promise((resolve, reject) => {
      getRequest.onsuccess = () => {
        const existingCoverLetter = getRequest.result;
        if (!existingCoverLetter) {
          reject(new Error('Cover letter not found'));
          return;
        }

        const updatedCoverLetter = {
          ...existingCoverLetter,
          ...coverLetterData,
          updatedAt: new Date().toISOString()
        };

        const updateRequest = store.put(updatedCoverLetter);
        updateRequest.onsuccess = () => resolve(updateRequest.result);
        updateRequest.onerror = () => reject(updateRequest.error);
      };
      getRequest.onerror = () => reject(getRequest.error);
    });
  }

  // Get all cover letters for a user
  async getUserCoverLetters(userId) {
    const db = await this.getDB();
    const transaction = db.transaction(['coverLetters'], 'readonly');
    const store = transaction.objectStore('coverLetters');
    const index = store.index('userId');
    
    return new Promise((resolve, reject) => {
      const request = index.getAll(userId);
      request.onsuccess = () => {
        const coverLetters = request.result.sort((a, b) => 
          new Date(b.updatedAt) - new Date(a.updatedAt)
        );
        resolve(coverLetters);
      };
      request.onerror = () => reject(request.error);
    });
  }

  // Get a specific cover letter
  async getCoverLetter(id) {
    const db = await this.getDB();
    const transaction = db.transaction(['coverLetters'], 'readonly');
    const store = transaction.objectStore('coverLetters');
    
    return new Promise((resolve, reject) => {
      const request = store.get(id);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Delete cover letter
  async deleteCoverLetter(id) {
    const db = await this.getDB();
    const transaction = db.transaction(['coverLetters'], 'readwrite');
    const store = transaction.objectStore('coverLetters');
    
    return new Promise((resolve, reject) => {
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Get user statistics
  async getUserStats(userId) {
    const db = await this.getDB();
    const transaction = db.transaction(['resumes', 'coverLetters'], 'readonly');
    const resumeStore = transaction.objectStore('resumes');
    const coverLetterStore = transaction.objectStore('coverLetters');
    const resumeIndex = resumeStore.index('userId');
    const coverLetterIndex = coverLetterStore.index('userId');
    
    return new Promise((resolve, reject) => {
      const resumeRequest = resumeIndex.getAll(userId);
      const coverLetterRequest = coverLetterIndex.getAll(userId);
      
      let resumeCount = 0;
      let coverLetterCount = 0;
      let hasError = false;
      
      resumeRequest.onsuccess = () => {
        resumeCount = resumeRequest.result.length;
        if (coverLetterRequest.readyState === 'done') {
          resolve({ resumeCount, coverLetterCount });
        }
      };
      
      coverLetterRequest.onsuccess = () => {
        coverLetterCount = coverLetterRequest.result.length;
        if (resumeRequest.readyState === 'done') {
          resolve({ resumeCount, coverLetterCount });
        }
      };
      
      resumeRequest.onerror = () => {
        if (!hasError) {
          hasError = true;
          reject(resumeRequest.error);
        }
      };
      
      coverLetterRequest.onerror = () => {
        if (!hasError) {
          hasError = true;
          reject(coverLetterRequest.error);
        }
      };
    });
  }

  // Export user data
  async exportUserData(userId) {
    const resumes = await this.getUserResumes(userId);
    const coverLetters = await this.getUserCoverLetters(userId);
    
    return {
      resumes,
      coverLetters,
      exportedAt: new Date().toISOString()
    };
  }

  // Import user data
  async importUserData(userId, data) {
    const results = {
      resumes: { imported: 0, errors: 0 },
      coverLetters: { imported: 0, errors: 0 }
    };

    // Import resumes
    if (data.resumes && Array.isArray(data.resumes)) {
      for (const resume of data.resumes) {
        try {
          await this.saveResume(userId, resume);
          results.resumes.imported++;
        } catch (error) {
          console.error('Error importing resume:', error);
          results.resumes.errors++;
        }
      }
    }

    // Import cover letters
    if (data.coverLetters && Array.isArray(data.coverLetters)) {
      for (const coverLetter of data.coverLetters) {
        try {
          await this.saveCoverLetter(userId, coverLetter);
          results.coverLetters.imported++;
        } catch (error) {
          console.error('Error importing cover letter:', error);
          results.coverLetters.errors++;
        }
      }
    }

    return results;
  }
}

export default new LocalDataService(); 
// Mock authentication service for development
// Replace this with actual API calls in production

const mockUsers = [
  {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    password: 'password123',
    phone: '+1234567890',
    location: 'New York, NY',
    bio: 'Experienced software developer with 5+ years in web development.',
    createdAt: '2024-01-15'
  },
  {
    id: 2,
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane@example.com',
    password: 'password123',
    phone: '+1987654321',
    location: 'San Francisco, CA',
    bio: 'Product manager with expertise in agile methodologies and user experience design.',
    createdAt: '2024-01-20'
  }
];

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class AuthService {
  async login(email, password) {
    await delay(1000); // Simulate network delay
    
    const user = mockUsers.find(u => u.email === email && u.password === password);
    
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
    // Remove password from user object
    const { password: _, ...userWithoutPassword } = user;
    
    return {
      user: userWithoutPassword,
      token: `mock-jwt-token-${user.id}-${Date.now()}`
    };
  }

  async register(userData) {
    await delay(1500); // Simulate network delay
    
    // Check if email already exists
    const existingUser = mockUsers.find(u => u.email === userData.email);
    if (existingUser) {
      throw new Error('Email already registered');
    }
    
    // Create new user
    const newUser = {
      id: mockUsers.length + 1,
      ...userData,
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    mockUsers.push(newUser);
    
    // Remove password from user object
    const { password: _, ...userWithoutPassword } = newUser;
    
    return {
      user: userWithoutPassword,
      token: `mock-jwt-token-${newUser.id}-${Date.now()}`
    };
  }

  async updateProfile(userId, profileData) {
    await delay(1000); // Simulate network delay
    
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    
    // Update user data
    mockUsers[userIndex] = { ...mockUsers[userIndex], ...profileData };
    
    // Remove password from user object
    const { password: _, ...userWithoutPassword } = mockUsers[userIndex];
    
    return {
      user: userWithoutPassword
    };
  }

  async forgotPassword(email) {
    await delay(1000); // Simulate network delay
    
    const user = mockUsers.find(u => u.email === email);
    if (!user) {
      throw new Error('Email not found');
    }
    
    // In a real app, this would send an email
    console.log(`Password reset email would be sent to ${email}`);
    
    return { success: true };
  }

  async resetPassword(token, newPassword) {
    await delay(1000); // Simulate network delay
    
    // In a real app, this would validate the token and update the password
    console.log(`Password would be reset with token: ${token}`);
    
    return { success: true };
  }

  async validateToken(token) {
    await delay(500); // Simulate network delay
    
    // In a real app, this would validate the JWT token
    if (!token || !token.startsWith('mock-jwt-token-')) {
      throw new Error('Invalid token');
    }
    
    // Extract user ID from token
    const userId = parseInt(token.split('-')[3]);
    const user = mockUsers.find(u => u.id === userId);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // Remove password from user object
    const { password: _, ...userWithoutPassword } = user;
    
    return { user: userWithoutPassword };
  }
}

export default new AuthService(); 
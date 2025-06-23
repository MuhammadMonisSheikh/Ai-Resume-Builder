# AI Resume Pro - Intelligent Resume & Cover Letter Builder

An intelligent, full-stack resume and cover letter builder designed to help users create professional, ATS-friendly documents with the help of AI.

**[Live Demo](https://ai-resume-pro.netlify.app/)** | **[GitHub Repository](https://github.com/your-username/your-repo-name)**

---

![AI Resume Pro Screenshot](https://ai-resume-pro.netlify.app/og-image.png)

## 🚀 Core Features

-   **🤖 AI-Powered Content:** Generate compelling professional summaries, achievements, and skills with integrated AI suggestions.
-   **📄 ATS-Optimized Templates:** Choose from a library of templates designed to be easily parsed by recruitment software.
-   **🎨 Full Customization:** A custom drag-and-drop editor allows for fine-tuned control over the resume layout and design.
-   **🔒 Secure Authentication:** Full sign-up, login, and session management using **Firebase Authentication**.
-   **☁️ Firestore Database:** User data and profiles are securely stored in **Firestore**.
-   **⚡️ High Performance & SEO:**
    -   Lazy loading for all routes using `React.lazy` and `Suspense`.
    -   An `OptimizedImage` component serves modern `.webp` formats and lazy-loads images.
    -   Comprehensive SEO with `react-helmet-async`, dynamic titles, and page-specific structured data (JSON-LD).
    -   Automated sitemap generation (`npm run generate-sitemap`).
-   **📱 Progressive Web App (PWA):** The app is fully installable, works offline, and provides a native-like experience.
-   **🛠️ Custom Developer Tools:** Includes a custom-built, Next.js-style floating developer panel that shows route info, environment, and caught runtime errors.

## 🛠️ Technical Stack

-   **Frontend:** React, Vite, React Router, Tailwind CSS
-   **Backend & Database:** Firebase (Authentication, Firestore)
-   **Key Libraries:** `react-toastify`, `react-loading-skeleton`, `react-icons`, `react-helmet-async`
-   **Tooling:** ESLint

## 📦 Getting Started

To run this project locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/your-repo-name.git
    cd your-repo-name
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up Firebase:**
    -   Create a Firebase project at [firebase.google.com](https://firebase.google.com/).
    -   Get your Firebase configuration object.
    -   Replace the placeholder configuration in `src/config/firebase.js` with your own.

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5174`.

## 📜 Available Scripts

-   `npm run dev`: Starts the development server.
-   `npm run build`: Creates a production-ready build of the application.
-   `npm run preview`: Serves the production build locally for testing.
-   `npm run generate-sitemap`: Generates a `sitemap.xml` file based on the routes in `scripts/generate-sitemap.js`.

## 🛠️ Development Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase CLI (for emulator development)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-resume-pro
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

### Firebase Emulator Setup (Development)

For local development with Firebase emulators:

1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**
   ```bash
   firebase login
   ```

3. **Start Firebase emulators**
   ```bash
   npm run emulators
   ```

4. **Start development with emulators**
   ```bash
   npm run dev:emulator
   ```

### Emulator Configuration

The app automatically detects and connects to Firebase emulators when running on `localhost`. You can configure emulator settings in `src/config/firebase.config.js`:

```javascript
export const emulatorConfig = {
  useEmulator: false,           // Set to true to force emulator mode
  autoDetectEmulator: true,     // Auto-detect localhost
  disableWarnings: true,        // Disable emulator warnings
  authEmulatorUrl: 'http://localhost:9099',
  firestoreEmulatorUrl: 'http://localhost:8080'
};
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run emulators` - Start Firebase emulators
- `npm run emulators:start` - Start emulators directly
- `npm run emulators:stop` - Stop emulators
- `npm run dev:emulator` - Start dev server with emulators
- `npm run generate-sitemap` - Generate sitemap
- `npm run generate-icons` - Generate PWA icons

## 🔧 Configuration

### Firebase Configuration

The app uses Firebase for authentication and data storage. Configuration is handled in `src/config/firebase.config.js`:

- **Production**: Uses real Firebase services
- **Development**: Automatically uses emulators on localhost
- **Emulator Mode**: Can be forced by setting `useEmulator: true`

### Environment Variables

Create a `.env` file in the root directory for local configuration:

```env
# Firebase Configuration (optional - defaults provided)
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Emulator Settings
VITE_USE_FIREBASE_EMULATOR=false
```

## 📱 PWA Features

- **Offline Support**: Works without internet connection
- **Install Prompt**: Native app installation
- **Background Sync**: Syncs data when online
- **Push Notifications**: Real-time updates
- **App-like Experience**: Full-screen mode

## 🎨 Templates

The app includes 15+ professional templates:

- **Classic**: Traditional, clean design
- **Modern**: Contemporary, minimalist
- **Creative**: Bold, artistic layouts
- **Professional**: Corporate, formal style
- **Executive**: Premium, sophisticated
- **Tech**: Developer-friendly design
- **Minimal**: Simple, elegant
- **Sidebar**: Modern sidebar layout
- **Timeline**: Creative timeline design
- **Dark**: Executive dark theme

## 🔒 Security

- **Firebase Authentication**: Secure user management
- **Data Encryption**: All data encrypted in transit
- **CORS Protection**: Cross-origin request protection
- **Input Validation**: Comprehensive form validation
- **XSS Prevention**: Content Security Policy

## 📊 Performance

- **Lazy Loading**: Components load on demand
- **Image Optimization**: WebP format with fallbacks
- **Code Splitting**: Automatic bundle optimization
- **Caching**: Intelligent caching strategies
- **Compression**: Gzip and Brotli compression
- **CDN Ready**: Optimized for CDN delivery

## 🚀 Deployment

### Netlify (Recommended)

1. **Connect repository** to Netlify
2. **Build settings**:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. **Environment variables**: Add Firebase configuration
4. **Deploy**: Automatic deployment on push

### Vercel

1. **Import project** to Vercel
2. **Framework preset**: Vite
3. **Environment variables**: Add Firebase configuration
4. **Deploy**: Automatic deployment

### Manual Deployment

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Upload dist folder** to your hosting provider

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Developer

**Monis Sheikh**
- Portfolio: https://portfolio-552de.web.app/
- Email: muhammadmonissheikh9@gmail.com

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Contact: muhammadmonissheikh9@gmail.com
- Portfolio: https://portfolio-552de.web.app/ 
# Amazon Clone Ready To Deploy, Customize and Monitize.

“Normally cloning Amazon takes weeks — even with AI.
But I already built it for you.
You just deploy and start making money.”

## Mobile App

The mobile application is a high-performance, cross-platform app built with React Native and Expo. It provides a complete e-commerce experience.

- Features
    - **Authentication**: Secure login and registration using Firebase Auth.
    - **Home Screen**: Dynamic banner carousel, deals, bestsellers, and category navigation.
    - **Product Details**: Image galleries, price info, ratings, reviews, and related products.
    - **Cart & Checkout**: Full cart management, shipping calculation, and secure checkout flow.
    - **Search**: Advanced search with debouncing, filtering (price, category, brand), and sorting.
    - **User Profile**: Order history, address management, and wishlist.
    - **Reviews**: User-generated ratings and reviews.

- Tech Stack
    - **Framework**: React Native (Expo SDK 54)
    - **Navigation**: Expo Router (File-based routing)
    - **UI Library**: Gluestack UI (for accessible, styled components)
    - **Styling**: NativeWind (Tailwind CSS for React Native)
    - **State Management**: React Context (Auth, Cart, Wishlist)
    - **Backend Integration**: Firebase SDK

## Backend

The backend powers the data and business logic, leveraging Firebase's serverless infrastructure.

- Features
    - **Database**: Firestore for storing users, products, orders, reviews, etc.
    - **Seeding**: `seed.js` script to populate the database with demo data (products, categories, reviews).
    - **Serverless Functions**: Firebase Cloud Functions for complex logic.
    - **Security**: Firestore Rules (`firestore.rules`) to secure data access.

- Tech Stack
    - **Runtime**: Node.js
    - **Database**: Firebase Firestore
    - **Admin SDK**: Firebase Admin SDK (for seeding and admin tasks)
    - **Functions**: Firebase Cloud Functions

## Admin Panel

A modern web-based administration dashboard to manage the platform.

- Features
    - **Dashboard**: Overview of sales, orders, and user activity.
    - **Product Management**: Add, edit, and remove products.
    - **Order Management**: View and update order statuses.

- Tech Stack
    - **Framework**: Next.js 16 (React 19)
    - **Styling**: Tailwind CSS v4
    - **Language**: TypeScript

## How to Deploy
Create GitHub account and fork this repository.
 1. Go to [https://github.com/basir/amazon-clone-final](https://github.com/basir/amazon-clone-final) and click fork button.
 2. Open your code editor (e.g. [Antigravity](https://antigravity.google/download)) and clone your forked repo.

Then deploy following components.


### Backend

1.  **Create a Firebase Project**: Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
2.  **Enable Services**:
    - **Authentication**: Enable Email/Password provider.
    - **Firestore Database**: Create a database in production mode.
    - **Storage**: Enable if you plan to upload images.
3.  **Install Firebase CLI**:
    ```bash
    npm install -g firebase-tools
    ```
4.  **Login**:
    ```bash
    firebase login
    ```
5. **Get Stripe Secret Key** : Go to the [Stripe Console](https://dashboard.stripe.com/) and copy your stripe secret key.
6. **Deploy**:
    Navigate to the `backend` folder:
    ```bash
    cd backend
    npm install
    cd functions
    npm install
    cd ..
    # make sure you enabled Blaze plan in your firebase project before deploying
    npm run deploy
    # enter STRIPE_SECRET_KEY in the prompt
    ```
7.  **Create Service Account**:
    - Go to the [Firebase Console](https://console.firebase.google.com/)
    - Navigate to Project Settings > Service Accounts
    - Click on "Generate New Private Key"
    - Download the JSON file
    - Save the JSON file in the `backend` folder
    - Add FIREBASE_SERVICE_ACCOUNT_PATH to `backend/.env` with the path to the JSON file
8. **Seed Data**:
    ```bash
    npm run seed
    ```

### Mobile App

In this section, we will generate mobile app for web, android and ios. 
1. Duplicate `mobile/.env.example` to `mobile/.env.local` 
2. On https://console.firebase.google.com create 3 apps:
    - Web App: download the config file and update `mobile/.env.local`:
    ```
    EXPO_PUBLIC_FIREBASE_API_KEY_WEB=
    EXPO_PUBLIC_FIREBASE_APP_ID_WEB=
    EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
    EXPO_PUBLIC_FIREBASE_PROJECT_ID=
    EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
    EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
    ```
    - Android App: download the config file and update `mobile/.env.local`:
    ```
    EXPO_PUBLIC_FIREBASE_API_KEY_ANDROID=
    EXPO_PUBLIC_FIREBASE_APP_ID_ANDROID=
    ```
    - iOS App: download the config file and update `mobile/.env.local`:
    ```
    EXPO_PUBLIC_FIREBASE_API_KEY_IOS=
    EXPO_PUBLIC_FIREBASE_APP_ID_IOS=
    ```

3. GEt stripe publishable key from stripe dashbaord and update `mobile/.env.local`
    ```
    EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=
    ```

#### Web App

1. Install dependencies
    ```bash
    cd mobile
    npm install
    ```
2. Run web app locally
    ```bash
    npm run web
    ```

##### Publish Web App to Expo
1. Export web app
    ```bash
    npx expo export --platform web
    ```
2. Create expo account at [expo.dev](https://expo.dev)
3. Install Expo CLI
    ```bash
    npm install -g expo-cli
    ```
4. Open terminal and login to expo
    ```bash
        eas login      
        # enter your email and password
        # Logged in
    ```
5. Deploy web app
    ```bash
        eas deploy 
    ```
6. open https://your-app-name.expo.app


#### Android App

For this section, you need to have an Android device.
1. Install "Expo Go" app on your Android device. Download from [Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent).
2. Connect Your Computer + Android device to the same Wi-Fi.
3. In your project:
    ```bash
    npx expo start --lan
    ```
4. Scan the QR code with your Android device → it opens in Expo Go.

##### Publish Android App to Google Play
1. Generate `.aab` file
    - Configure eas
    ```bash
        eas build:configure
        # enter yes to automatically create an EAS project for @your_username/amazon-clone-app
        # enter yes to link local project to EAS project
        # enter all to configure for ios and android
    ```
    - Build android app
    ```bash 
        eas build -p android --profile production
        
    ```
    - Go to [expo.dev](https://expo.dev) and download the generated .aab file

2. Submit `.aab` to Google Play:
   1. Create a Google Play Developer account at [Google Play Console](https://play.google.com/console)
    - Pay $25 one-time fee.
    - Verify your account.
   2. Create a new app
    - Click “Create App” → fill app name, language, type, content rating.
   3. Prepare store listing
    - Add description, screenshots, icons, feature graphic.
    - Fill privacy policy and contact info.
   4. Upload your .aab
    - Go to Release → Production → Create new release.
    - Upload the .aab file.
    - Fill release notes.
   5. Set content & pricing
    - Content rating questionnaire.
    - Pricing and distribution.
   6. Review & submit
    - Check for warnings/errors.
    - Click “Review and publish”.
    - Google will review your app (can take hours to a few days). After approval, it will be live.

#### iOS App
For this section, you need to have a Mac computer and an iPhone.
1. Install "Expo Go" app on your iPhone. Download from [App Store](https://apps.apple.com/us/app/expo-go/id982107779).
2. Connect Mac + iPhone to the same Wi-Fi.
3. In your project:
    ```bash
    npx expo start --lan
    ```
4. Scan the QR code with your iPhone → it opens in Expo Go.

### Admin Panel

1. Go to the [Vercel](https://vercel.com)
2. Click add project and select the forked repo
3. Enter this settings:
    - root directory: admin
    - framework: Next.js
4. Enter Environment Variables based on `/admin/.env.example`
5. Click deploy
6. Wait for the deployment to finish
7. Open the deployed admin panel

## How to Develop

### Prerequisites
- Node.js installed.
- Expo Go app on your phone (for mobile testing).

### Mobile App
1.  Navigate to the mobile folder:
    ```bash
    cd mobile
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm start
    ```
    Scan the QR code with Expo Go (Android) or Camera (iOS).

### Backend
1.  Navigate to the backend folder:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Run the seed script (optional, to reset data):
    ```bash
    npm run seed
    ```

### Admin Panel
1.  Navigate to the admin folder:
    ```bash
    cd admin
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) in your browser.

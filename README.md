# Streak Saver

#### Video Demo:

https://youtu.be/0dxHu99Fssg

#### Description:

Streak Saver is a (web) application designed to help users maintain daily habits and track their progress over time by pressing a big green button. The application is built with a Python Flask backend and a React frontend, providing a smooth user experience with JWT-based authentication, streak management, and personalized difficulty settings. Users can register, log in, view their current streak, mark tasks as completed, reset streaks, and adjust difficulty settings.

This is also my final project for the Harvard CS50's Introduction to Computer Science Course.

---

## Project Structure

### Backend

The backend is implemented using **Flask**, **SQLAlchemy**, and **Flask-JWT-Extended**. It is responsible for handling authentication, user management, and streak logic.

- **app.py**: The main application file. It sets up the Flask app, configures JWT authentication, connects to the database, and defines all routes for registration, login, and streak management.

  - `/register` (POST): Creates a new user with a hashed password and initializes a streak.
  - `/login` (POST): Authenticates the user and returns a JWT token along with user information.
  - `/streak` (GET): Returns the current user's streak data.
  - `/streak/add` (POST): Marks today's task as done, increments streak, and handles freezes if missed days are recovered.
  - `/streak/reset` (POST): Resets the user's streak and freezes.
  - `/streak/update_difficulty` (PUT): Updates the user's difficulty preference.

- **models.py**: Contains the SQLAlchemy models for User and Streak, including password hashing logic via Bcrypt.

- **requirements.txt**: Lists the Python dependencies needed to run the backend.

The backend stores user data securely in a database (SQLite for local development, or any production-ready DB via `DATABASE_URL`).

---

### Frontend

The frontend is built with **React** and Vite, providing a responsive and modern web interface.

#### Core Files:

- **src/App.jsx**: Main React component that sets up routing using `react-router-dom`. It renders the header, footer, and main routes. Protected routes like `/` are wrapped in the `ProtectedRoute` component to ensure only authenticated users can access them.
- **src/main.jsx**: Entry point of the React application. This file renders `<App />` into the DOM and wraps it with `<AuthProvider>` to provide global authentication context.
- **src/global.css**: Contains all styles for the app.

#### Pages:

- **pages/LoginPage.jsx**: Handles user login. Collects username and password, sends them to the backend, and stores the JWT token and user info in context on success.
- **pages/RegisterPage.jsx**: Allows new users to sign up by entering a username, password, and difficulty. After registration, users are redirected to the login page.
- **pages/StreakPage.jsx**: Displays the user’s streak, available freezes, and difficulty. Users can mark tasks done, reset the streak, or update difficulty. Feedback messages provide a responsive user experience.

#### Context:

- **context/AuthContext.jsx**: Implements React Context to store authentication state (token and user info). Provides `login` and `logout` functions to be used across components.

#### Routes:

- **routes/ProtectedRoute.jsx**: Ensures that certain routes are accessible only to authenticated users. It also checks token expiration and logs the user out if the token is invalid or expired.

#### Components:

- **components/Footer.jsx**: Reusable footer with logout function.

#### Config & Metadata Files:

- **index.html**: Base HTML template for Vite. Contains the root `div` where React renders.
- **package.json**: Lists frontend dependencies, scripts, and project metadata.
- **package-lock.json**: Auto-generated lockfile to ensure consistent dependency versions.
- **vite.config.js**: Vite configuration file, defining build and development settings.

---

## Key Features

1. **User Authentication**

   - Secure JWT-based login and registration.
   - Tokens are validated on every protected route.
   - Expired or missing tokens trigger a redirect to the login page.

2. **Streak Management**

   - Users can mark tasks as done each day.
   - The app automatically handles missed days using available freezes.
   - Difficulty settings influence how many freezes are granted.

3. **User Experience**

   - Frontend provides clear feedback messages for actions like adding streaks or resetting.
   - Smooth conditional rendering ensures users see appropriate pages based on authentication status.

4. **Security**

   - Passwords are hashed using Bcrypt.
   - JWT tokens are used for all protected API routes.
   - Frontend context ensures sensitive information is centrally managed.

5. **Persistence**

   - User and token information are stored in `localStorage` to persist login sessions across page reloads.
   - Backend database stores all streak and user data.

---

## Design Choices

- **Flask & SQLAlchemy**: Chosen for simplicity and rapid prototyping. The ORM allows easy management of relationships between users and streaks.
- **JWT Authentication**: Provides stateless and secure user sessions, suitable for both web and potential mobile clients.
- **React Context**: Simplifies state management for authentication across the frontend.
- **Separate Frontend & Backend**: This separation allows future scalability and easier deployment. Backend can be reused for mobile or other clients.

---

## Future Improvements

- Add a mobile version using React Native.
- Add social features like sharing streaks or competing with friends.
- Implement notifications to remind users to complete daily tasks.
- Track historical streak data for analytics.

---

## Requirements

To run this project locally, you will need:

- Python 3.10+ and pip installed for the backend
- Node.js 18+ and npm installed for the frontend

Optionally, you can check out the live demo of the app at [https://streak-saver.netlify.app](https://streak-saver.netlify.app).

---

## How to Run Locally

### Clone the repository

```bash
git clone <https://github.com/moreniekmeijer/streak-saver-app>
cd streak-saver
```

### Backend

1. Navigate to the backend folder:

```bash
cd backend
```

2. Create a virtual environment:

```bash
python -m venv venv
source venv/bin/activate
```

3. Install dependencies:

```bash
pip install -r requirements.txt
```

4. Run the Flask app:

```bash
python app.py
```

### Frontend

1. Navigate to the frontend folder:

```bash
cd ../frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create a .env file and set the API URL:

```bash
touch .env
```

Then go inside the .env file and add: `VITE_API_URL=http://localhost:5500`

4.  Start the development server:

```bash
npm run dev
```

Open http://localhost:5173 to view the app.

## How to Contribute

This project was built as a personal tool and as my final project for the CS50x course. Contributions are welcome.
Feel free to open issues or submit pull requests to improve the functionality, add features, or fix bugs.

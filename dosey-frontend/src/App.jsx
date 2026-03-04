import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import ErrorBoundary from './components/ErrorBoundary';

// Public Pages
import Login from './pages/public/Login';
import Register from './pages/public/Register';
import Landing from './pages/public/Landing';
import ForgotPassword from './pages/public/ForgotPassword';
import ResetPassword from './pages/public/ResetPassword';

// Private Pages
import Home from './pages/private/Home';
import Profile from './pages/private/Profile';
import AddMedication from './pages/private/AddMedicine';
import HistoryPage from './pages/private/History';
import MedicineCabinet from './pages/private/MedicineCabinet';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route element={<PublicRoute />}>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route path="/home" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/add-medication" element={<AddMedication />} />
            <Route path="/edit-medication/:id" element={<AddMedication />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/medicines" element={<MedicineCabinet />} />
          </Route>
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
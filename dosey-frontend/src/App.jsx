import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layouts/Guards
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';

// Public Pages
import Login from './pages/public/Login';
import Register from './pages/public/Register';
import Landing from './pages/public/Landing';

// Private Pages
import Home from './pages/private/Home';
import Profile from './pages/private/Profile';
import AddMedication from './pages/private/AddMedicine';
import HistoryPage from './pages/private/History';
import MedicineCabinet from './pages/private/MedicineCabinet';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Group */}
        <Route element={<PublicRoute />}>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Private Group */}
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
  );
}

export default App;
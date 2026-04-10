import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Settings from './pages/Settings';
import Schedule from './pages/Schedule';
import Tests from './pages/Tests';
import Navigator from './pages/Navigator';
import OnlineEducation from './pages/OnlineEducation';
import Library from './pages/Library';
import Rating from './pages/Rating';
import Certificate from './pages/Certificate';

// Placeholder Pages for all menu items
const PlaceholderPage = ({ title }) => (
  <div>
    <h2 style={{ marginBottom: '1.5rem' }}>{title}</h2>
    <div className="card">
      <p>This is the {title} page.</p>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/" element={
          <ProtectedRoute><MainLayout><Dashboard /></MainLayout></ProtectedRoute>
        } />

        {/* All Sidebar Routes */}
        <Route path="/schedule" element={<ProtectedRoute><MainLayout><Schedule /></MainLayout></ProtectedRoute>} />
        <Route path="/online-education" element={<ProtectedRoute><MainLayout><OnlineEducation /></MainLayout></ProtectedRoute>} />
        <Route path="/tests" element={<ProtectedRoute><MainLayout><Tests /></MainLayout></ProtectedRoute>} />
        <Route path="/navigator" element={<ProtectedRoute><MainLayout><Navigator /></MainLayout></ProtectedRoute>} />
        <Route path="/rating" element={<ProtectedRoute><MainLayout><Rating /></MainLayout></ProtectedRoute>} />
        <Route path="/library" element={<ProtectedRoute><MainLayout><Library /></MainLayout></ProtectedRoute>} />
        <Route path="/certificates" element={<ProtectedRoute><MainLayout><Certificate /></MainLayout></ProtectedRoute>} />
        <Route path="/market" element={<ProtectedRoute><MainLayout><PlaceholderPage title="Market" /></MainLayout></ProtectedRoute>} />
        <Route path="/share" element={<ProtectedRoute><MainLayout><PlaceholderPage title="Do'stlarga ulashish" /></MainLayout></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><MainLayout><Settings /></MainLayout></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;

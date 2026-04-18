/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router';
import { AuthProvider } from './context/AuthContext';
import { Layout } from '@/components/Layout';
import { Toaster } from 'sonner';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateMatch from './pages/CreateMatch';
import MatchDetail from './pages/MatchDetail';
import Profile from './pages/Profile';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="create-match" element={<CreateMatch />} />
            <Route path="matches/:id" element={<MatchDetail />} />
            <Route path="profile/:id" element={<Profile />} />
          </Route>
        </Routes>
        <Toaster position="top-center" richColors />
      </AuthProvider>
    </BrowserRouter>
  );
}

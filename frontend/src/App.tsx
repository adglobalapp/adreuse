import { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router';
import { Footer } from './components/Footer';
import { registrationEnabled } from './features';
import { Header } from './components/Header';
import { RequireAuth } from './components/RequireAuth';
import { Admin } from './pages/admin/Admin';
import { AdminCategories } from './pages/admin/AdminCategories';
import { AdminListings } from './pages/admin/AdminListings';
import { AdminMessages } from './pages/admin/AdminMessages';
import { AdminUsers } from './pages/admin/AdminUsers';
import { Overview } from './pages/admin/Overview';
import { AuthPage } from './pages/Auth';
import { Browse } from './pages/Browse';
import { Home } from './pages/Home';
import { ListingDetail } from './pages/ListingDetail';
import { ListingForm } from './pages/ListingForm';
import { MyListings } from './pages/MyListings';
import { NotFound } from './pages/NotFound';

export function App() {
  const { pathname } = useLocation();

  // Oldalváltáskor a lap tetejére ugrunk
  useEffect(() => window.scrollTo({ top: 0 }), [pathname]);

  return (
    <div className="app">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/listings" element={<Browse />} />
          <Route path="/listings/:id" element={<ListingDetail />} />
          <Route path="/listings/:id/edit" element={<RequireAuth><ListingForm /></RequireAuth>} />
          <Route path="/sell" element={<RequireAuth><ListingForm /></RequireAuth>} />
          <Route path="/my" element={<RequireAuth><MyListings /></RequireAuth>} />
          <Route path="/admin" element={<RequireAuth admin><Admin /></RequireAuth>}>
            <Route index element={<Overview />} />
            <Route path="listings" element={<AdminListings />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="messages" element={<AdminMessages />} />
          </Route>
          <Route path="/login" element={<AuthPage mode="login" />} />
          <Route path="/register" element={registrationEnabled ? <AuthPage mode="register" /> : <Navigate to="/login" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

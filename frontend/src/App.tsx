import { useLayoutEffect } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { useI18n } from './i18n';
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
import { AdminOrders } from './pages/admin/AdminOrders';
import { AdminShipping } from './pages/admin/AdminShipping';
import { Checkout } from './pages/Checkout';
import { OrderSuccess } from './pages/OrderSuccess';
import { AuthPage } from './pages/Auth';
import { Browse } from './pages/Browse';
import { Home } from './pages/Home';
import { ListingDetail } from './pages/ListingDetail';
import { ListingForm } from './pages/ListingForm';
import { MyListings } from './pages/MyListings';
import { NotFound } from './pages/NotFound';
import { LegalPage } from './components/LegalPage';
import { Privacy } from './components/Privacy';

export function App() {
  const { pathname } = useLocation();

  // Oldalváltáskor a lap tetejére ugrunk
  const { t } = useI18n();
  useLayoutEffect(() => window.scrollTo({ top: 0, behavior: 'instant' }), [pathname]);

  return (
    <div className="app">
      <Header />
      <main>
        <ErrorBoundary resetKey={pathname} message={t.common.error} reloadLabel={t.common.reload}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/listings" element={<Browse />} />
          <Route path="/listings/:id" element={<ListingDetail />} />
          <Route path="/listings/:id/edit" element={<RequireAuth><ListingForm /></RequireAuth>} />
          <Route path="/sell" element={<RequireAuth><ListingForm /></RequireAuth>} />
          <Route path="/my" element={<RequireAuth><MyListings /></RequireAuth>} />
          <Route path="/admin" element={<RequireAuth admin><Admin /></RequireAuth>}>
            <Route index element={<Overview />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="shipping" element={<AdminShipping />} />
            <Route path="listings" element={<AdminListings />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="messages" element={<AdminMessages />} />
          </Route>
          <Route path="/login" element={<AuthPage mode="login" />} />
          <Route path="/register" element={registrationEnabled ? <AuthPage mode="register" /> : <Navigate to="/login" replace />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<LegalPage doc="terms" />} />
          <Route path="/returns" element={<LegalPage doc="returns" />} />
          <Route path="/delivery" element={<LegalPage doc="delivery" />} />
          <Route path="/checkout/:id" element={<Checkout />} />
          <Route path="/order/success" element={<OrderSuccess />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  );
}

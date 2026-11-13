// src/App.tsx
import { Routes, Route } from 'react-router-dom';
import { Home } from './views/Home';
import { ProductDetail } from './views/ProductDetail';
import { Account } from './views/Account';
import { Login } from './views/Login';
import { AccountProduct } from './views/AccountProduct';
import { ToastList } from './components/UI';
import { Footer } from './components/Footer';

export const App = () => {
  return (
    <>
      <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/producto/:id" element={<ProductDetail />} />
            <Route path="/cuenta" element={<Account />} />
            <Route path="/cuenta/producto/:id" element={<AccountProduct />} />
            <Route path="/iniciar-sesion" element={<Login />} />
          </Routes>
        </div>
        <Footer />
      </main>
      <ToastList />
    </>
  );
};
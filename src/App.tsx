// src/App.tsx
import { Routes, Route } from 'react-router-dom';
import { Home } from './views/Home';
import { ProductDetail } from './views/ProductDetail';
import { Account } from './views/Account';
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
          </Routes>
        </div>
        <Footer />
      </main>
      <ToastList />
    </>
  );
};
import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import CartPanel from '@/components/ui/CartPanel';
import MainLayout from '@/layouts/MainLayout';

const ConfiguratorPage = lazy(() => import('@/pages/Configurator/ConfiguratorPage'));

function App() {
  return (
    <>
      <CartPanel />
      <MainLayout>
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<ConfiguratorPage />} />
          </Routes>
        </Suspense>
      </MainLayout>
    </>
  );
}

export default App;
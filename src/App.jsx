import React from 'react';
import { useSelector } from 'react-redux';
import SearchBar from './components/SearchBar';
import BrandSelector from './components/BrandSelector';
import OffersTable from './components/OffersTable';
import StatusMessage from './components/StatusMessage';

export default function App() {
  const { step, brands, offers, loading, error } = useSelector((state) => state.search);

  return (
    <div className="container py-4">
      <header className="mb-4 border-bottom pb-3">
        <h2 className="text-primary fw-bold">Поиск автозапчастей и аналогов</h2>
        <p className="text-muted mb-0">Favorit-parts API Integration</p>
        <p className="text-muted mb-0">Разработчик: <a href="https://hh.ru/resume/f7f9c47bff0fab94d80039ed1f7149316e7342" target="blank">Белов Александр</a></p>
      </header>

      <main>
        <SearchBar />

        <StatusMessage loading={loading} error={error} />

        {!loading && !error && step === 1 && brands.length > 0 && (
          <BrandSelector />
        )}

        {!loading && !error && step === 2 && offers.length > 0 && (
          <OffersTable />
        )}
      </main>
    </div>
  );
}
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchOffers } from '../store/searchSlice';

export default function BrandSelector() {
  const dispatch = useDispatch();
  const { brands, activePartNumber, apiKey, loading } = useSelector((state) => state.search);

  const handleSelectBrand = (brand) => {
    dispatch(fetchOffers({ number: activePartNumber, brand, key: apiKey }));
  };

  return (
    <div className="card shadow-sm mb-4 border-info">
      <div className="card-header bg-info bg-opacity-10 fw-bold text-info-emphasis">
        Этап 1: Выберите производителя для артикула «{activePartNumber}»
      </div>
      <div className="card-body">
        <p className="card-text text-secondary mb-3">
          Найдены предложения следующих брендов. Выберите бренд для загрузки цен и аналогов:
        </p>
        <div className="d-flex flex-wrap gap-2">
          {brands.map((brand) => (
            <button
              key={brand}
              type="button"
              className="btn btn-outline-primary px-4 py-2"
              onClick={() => handleSelectBrand(brand)}
              disabled={loading}
            >
              {brand}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
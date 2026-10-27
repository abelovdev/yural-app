import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setStep, toggleHideOutOfStock } from '../store/searchSlice';
import DesktopOfferRow from './offers/DesktopOfferRow';
import MobileOfferCard from './offers/MobileOfferCard';

export default function OffersTable() {
  const dispatch = useDispatch();
  const { offers, selectedBrand, activePartNumber, hideOutOfStock } = useSelector(
  (state) => state.search
);

  const filteredOffers = offers.filter((item) => {
    if (!hideOutOfStock) return true;
    const rawWarehouses = Array.isArray(item.warehouses) ? item.warehouses : [];
    const totalStock = rawWarehouses.reduce(
      (sum, wh) => sum + (wh.stock || 0),
      item.count || 0
    );
    return totalStock > 0;
  });

  return (
    <div className="card shadow-sm mb-4">
      {/* Шапка с мета-информацией и переключателем */}
      <div className="card-header bg-light d-flex flex-wrap justify-content-between align-items-center gap-2 py-3">
        <div>
          <span className="fw-bold fs-5 d-block d-sm-inline">Предложения и аналоги</span>
          <span className="badge bg-secondary ms-0 ms-sm-2">Артикул: {activePartNumber}</span>
          <span className="badge bg-primary ms-1">Бренд: {selectedBrand}</span>
        </div>

        <div className="d-flex align-items-center gap-2 gap-sm-3 w-100 w-sm-auto justify-content-between">
          <div className="form-check form-switch mb-0">
            <input
              className="form-check-input"
              type="checkbox"
              role="switch"
              id="hideOutOfStockCheck"
              checked={hideOutOfStock}
              onChange={() => dispatch(toggleHideOutOfStock())}
            />
            <label
              className="form-check-label text-secondary small user-select-none"
              htmlFor="hideOutOfStockCheck"
            >
              Скрыть (0 шт.)
            </label>
          </div>

          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={() => dispatch(setStep(1))}
          >
            ← Бренды
          </button>
        </div>
      </div>

      <div className="card-body p-0">
        {filteredOffers.length === 0 ? (
          <div className="p-4 text-center text-muted">
            Нет позиций, соответствующих выбранным фильтрам.
          </div>
        ) : (
          <>
            {/* Десктопная версия (таблица) */}
            <div className="table-responsive d-none d-md-block">
              <table className="table align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th scope="col" style={{ width: '85px' }}>Тип</th>
                    <th scope="col" style={{ width: '130px' }}>Производитель</th>
                    <th scope="col" style={{ width: '150px' }}>Артикул</th>
                    <th scope="col">Наименование</th>
                    <th scope="col" className="text-end" style={{ width: '200px' }}>Склад (Мин. цена)</th>
                    <th scope="col" className="text-center" style={{ width: '90px' }}>Наличие</th>
                    <th scope="col" className="text-end" style={{ width: '150px' }}>Цена от</th>
                    <th scope="col" className="text-center" style={{ width: '40px' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOffers.map((item, idx) => (
                    <DesktopOfferRow
                      key={`desktop-${item.goodsID || item.number}-${idx}`}
                      item={item}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Мобильная версия (список карточек) */}
            <div className="d-md-none divide-y">
              {filteredOffers.map((item, idx) => (
                <MobileOfferCard
                  key={`mobile-${item.goodsID || item.number}-${idx}`}
                  item={item}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
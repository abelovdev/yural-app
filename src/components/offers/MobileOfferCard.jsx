import React, { useState } from 'react';

export default function MobileOfferCard({ item }) {
  const [isOpen, setIsOpen] = useState(false);
  const rawWarehouses = Array.isArray(item.warehouses) ? item.warehouses : [];
  const sortedWarehouses = [...rawWarehouses].sort(
    (a, b) => (a.price ?? Infinity) - (b.price ?? Infinity)
  );
  const bestWarehouse = sortedWarehouses[0] || {
    code: '—',
    stock: item.count || 0,
    price: null,
  };
  const hasMultipleWarehouses = sortedWarehouses.length > 1;

  return (
    <div className="border-bottom p-3 bg-white">
      {/* Шапка карточки */}
      <div
        className="d-flex justify-content-between align-items-start mb-2"
        onClick={() => hasMultipleWarehouses && setIsOpen(!isOpen)}
        style={{ cursor: hasMultipleWarehouses ? 'pointer' : 'default' }}
      >
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            {item.isAnalog ? (
              <span className="badge bg-warning text-dark" style={{ fontSize: '0.7rem' }}>
                Аналог
              </span>
            ) : (
              <span className="badge bg-success" style={{ fontSize: '0.7rem' }}>
                Оригинал
              </span>
            )}
            <strong className="text-uppercase fs-6">{item.brand}</strong>
            <code className="text-primary fw-bold">{item.number}</code>
          </div>
          <div
            className="text-secondary small text-truncate"
            style={{ maxWidth: '240px' }}
          >
            {item.name}
          </div>
        </div>

        <div className="text-end">
          <div className="fw-bold text-success fs-6">
            {bestWarehouse.price
              ? `${Number(bestWarehouse.price).toLocaleString('ru-RU')} ₽`
              : '—'}
          </div>
          <span
            className={`badge ${
              bestWarehouse.stock > 0 ? 'bg-info text-dark' : 'bg-light text-muted border'
            }`}
          >
            {bestWarehouse.stock} шт.
          </span>
        </div>
      </div>

      {/* Футер карточки с кнопкой разворачивания складов */}
      {hasMultipleWarehouses && (
        <div className="d-flex justify-content-between align-items-center pt-2 mt-1 border-top border-light">
          <small className="text-muted">
            Склад: <strong>{bestWarehouse.code || 'Основной'}</strong>
          </small>

          <button
            type="button"
            className="btn btn-sm btn-outline-primary py-0 px-2"
            onClick={() => setIsOpen(!isOpen)}
            style={{ fontSize: '0.75rem' }}
          >
            {isOpen
              ? 'Скрыть склады ▲'
              : `Ещё ${sortedWarehouses.length - 1} склад(а) ▼`}
          </button>
        </div>
      )}

      {/* Выпадающий мобильный список складов */}
      {isOpen && hasMultipleWarehouses && (
        <div className="mt-3 p-2 bg-light rounded border">
          <div className="d-flex justify-content-between align-items-center mb-2 px-1">
            <small className="fw-bold text-secondary">
              Все склады ({sortedWarehouses.length}):
            </small>
          </div>
          <div style={{ maxHeight: '220px', overflowY: 'auto' }}>
            {sortedWarehouses.map((wh, whIdx) => (
              <div
                key={wh.id || whIdx}
                className={`d-flex justify-content-between align-items-center p-2 mb-1 rounded bg-white border-sm ${
                  whIdx === 0 ? 'border border-success' : ''
                }`}
              >
                <div>
                  <div className="fw-bold small">
                    {wh.code || wh.id || 'Склад'}
                    {whIdx === 0 && (
                      <span
                        className="badge bg-success ms-1"
                        style={{ fontSize: '0.6rem' }}
                      >
                        Мин. цена
                      </span>
                    )}
                  </div>
                  {wh.notRefund && (
                    <span className="badge bg-danger" style={{ fontSize: '0.6rem' }}>
                      Невозвратный
                    </span>
                  )}
                </div>

                <div className="text-end">
                  <div className="fw-bold text-success small">
                    {wh.price
                      ? `${Number(wh.price).toLocaleString('ru-RU')} ₽`
                      : '—'}
                  </div>
                  <span
                    className="badge bg-secondary"
                    style={{ fontSize: '0.65rem' }}
                  >
                    {wh.stock} шт.
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
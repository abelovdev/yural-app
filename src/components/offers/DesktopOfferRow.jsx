import React, { useState } from 'react';

export default function DesktopOfferRow({ item }) {
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
    <>
      <tr
        className={isOpen ? 'table-active' : ''}
        style={{ cursor: hasMultipleWarehouses ? 'pointer' : 'default' }}
        onClick={() => hasMultipleWarehouses && setIsOpen(!isOpen)}
      >
        <td>
          {item.isAnalog ? (
            <span className="badge bg-warning text-dark">Аналог</span>
          ) : (
            <span className="badge bg-success">Оригинал</span>
          )}
        </td>
        <td className="fw-bold text-uppercase">{item.brand}</td>
        <td>
          <code className="text-primary">{item.number}</code>
        </td>
        <td>{item.name}</td>
        <td className="text-end">
          <span className="fw-semibold text-secondary">
            {bestWarehouse.code || bestWarehouse.id || 'Основной'}
          </span>
          {bestWarehouse.notRefund && (
            <span className="badge bg-danger ms-1" style={{ fontSize: '0.65rem' }}>
              Невозвратный
            </span>
          )}
        </td>
        <td className="text-center">
          <span
            className={`badge ${
              bestWarehouse.stock > 0 ? 'bg-info text-dark' : 'bg-light text-muted border'
            }`}
          >
            {bestWarehouse.stock} шт.
          </span>
        </td>
        <td className="text-end">
          <div className="fw-bold text-success fs-6">
            {bestWarehouse.price
              ? `${Number(bestWarehouse.price).toLocaleString('ru-RU')} ₽`
              : '—'}
          </div>
          {hasMultipleWarehouses && (
            <small className="text-primary d-block" style={{ fontSize: '0.75rem' }}>
              + еще в {sortedWarehouses.length - 1} складах
            </small>
          )}
        </td>
        <td className="text-center">
          {hasMultipleWarehouses && (
            <span className="text-muted">{isOpen ? '▲' : '▼'}</span>
          )}
        </td>
      </tr>

      {/* Вложенный список всех складов */}
      {isOpen && hasMultipleWarehouses && (
        <tr>
          <td colSpan="8" className="bg-light p-3 border-bottom shadow-inner">
            <div className="card card-body border-0 shadow-sm p-3 bg-white ms-4">
              <div className="d-flex justify-content-between align-items-center mb-2 border-bottom pb-2">
                <span className="fw-semibold text-secondary">
                  Все склады и предложения для{' '}
                  <strong className="text-dark">
                    {item.brand} {item.number}
                  </strong>
                  :
                </span>
                <small className="text-muted">
                  Всего предложений: {sortedWarehouses.length}
                </small>
              </div>
              <div
                className="table-responsive"
                style={{ maxHeight: '300px', overflowY: 'auto' }}
              >
                <table className="table table-sm table-bordered align-middle mb-0">
                  <thead className="table-light sticky-top">
                    <tr>
                      <th>Склад / Код</th>
                      <th className="text-center">Остаток</th>
                      <th className="text-end">Цена</th>
                      <th className="text-center">Условия</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedWarehouses.map((wh, whIdx) => (
                      <tr
                        key={wh.id || whIdx}
                        className={whIdx === 0 ? 'table-success bg-opacity-10' : ''}
                      >
                        <td>
                          <span className="fw-bold">
                            {wh.code || wh.id || 'Склад'}
                          </span>
                          {whIdx === 0 && (
                            <span className="badge bg-success ms-2">
                              Лучшая цена
                            </span>
                          )}
                        </td>
                        <td className="text-center">
                          <span className="badge bg-secondary">{wh.stock} шт.</span>
                        </td>
                        <td className="text-end fw-bold text-success">
                          {wh.price
                            ? `${Number(wh.price).toLocaleString('ru-RU')} ₽`
                            : '—'}
                        </td>
                        <td className="text-center">
                          {wh.notRefund ? (
                            <span className="badge bg-danger">Невозвратный</span>
                          ) : (
                            <span
                              className="text-muted"
                              style={{ fontSize: '0.8rem' }}
                            >
                              Обычный возврат
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
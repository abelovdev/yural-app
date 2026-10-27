import React from 'react';

export default function StatusMessage({ loading, error }) {
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-primary me-3" role="status">
          <span className="visually-hidden">Загрузка...</span>
        </div>
        <span className="fs-5 text-secondary">Загрузка данных...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger d-flex align-items-center shadow-sm" role="alert">
        <div>
          <strong>Ошибка:</strong> {error}
        </div>
      </div>
    );
  }

  return null;
}
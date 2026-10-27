import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setPartNumber, fetchBrands } from '../store/searchSlice';

export default function SearchBar() {
  const dispatch = useDispatch();
  const { partNumber, loading } = useSelector((state) => state.search);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!partNumber.trim()) return;
    dispatch(fetchBrands({ number: partNumber }));
  };

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="row g-2">
            <div className="col-md-10">
              <label htmlFor="partNumber" className="form-label fw-semibold">
                Артикул детали
              </label>
              <input
                id="partNumber"
                type="text"
                className="form-control form-control-lg"
                value={partNumber}
                onChange={(e) => dispatch(setPartNumber(e.target.value))}
                placeholder="Введите номер детали (например: 71605000395 или 01089)"
                required
              />
            </div>

            <div className="col-md-2 d-flex align-items-end">
              <button
                type="submit"
                className="btn btn-primary btn-lg w-100"
                disabled={loading || !partNumber.trim()}
              >
                {loading ? 'Поиск...' : 'Найти'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
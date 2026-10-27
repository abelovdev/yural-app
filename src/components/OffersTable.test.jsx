import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import searchReducer from '../store/searchSlice';
import OffersTable from './OffersTable';

function renderWithRedux(ui, { initialState } = {}) {
  const store = configureStore({
    reducer: { search: searchReducer },
    preloadedState: { search: initialState },
  });
  return render(<Provider store={store}>{ui}</Provider>);
}

describe('OffersTable Integration Test', () => {
  const mockOffers = [
    {
      goodsID: '1',
      brand: 'DOLZ',
      number: '0267',
      name: 'Водяная помпа',
      isAnalog: false,
      count: 10,
      warehouses: [
        { id: 'wh1', code: 'МСК', price: 5000, stock: 2 },
        { id: 'wh2', code: 'СПБ', price: 4200, stock: 8 },
      ],
    },
    {
      goodsID: '2',
      brand: 'HEPU',
      number: 'P371',
      name: 'Помпа',
      isAnalog: true,
      count: 0,
      warehouses: [{ id: 'wh3', code: 'ДМД', price: 6000, stock: 0 }],
    },
  ];

  it('отображает деталь и выбирает склад с минимальной ценой', () => {
    renderWithRedux(<OffersTable />, {
      initialState: {
        offers: mockOffers,
        selectedBrand: 'DOLZ',
        partNumber: '0267',
        hideOutOfStock: false,
        step: 2,
      },
    });

    // Используем getAllByText, так как рендерятся верстки для десктопа и мобильного
    const prices = screen.getAllByText('4 200 ₽');
    expect(prices[0]).toBeInTheDocument();
  });

  it('скрывает позицию с 0 остатком при включении тумблера', () => {
    renderWithRedux(<OffersTable />, {
      initialState: {
        offers: mockOffers,
        selectedBrand: 'DOLZ',
        partNumber: '0267',
        hideOutOfStock: false,
        step: 2,
      },
    });

    // По умолчанию HEPU видна (и в таблице, и в мобильной карточке)
    expect(screen.getAllByText('HEPU').length).toBeGreaterThan(0);

    // Включаем тумблер фильтрации
    const toggle = screen.getByLabelText(/Скрыть/i);
    fireEvent.click(toggle);

    // Теперь HEPU не должна быть представлена ни в одном месте
    expect(screen.queryByText('HEPU')).not.toBeInTheDocument();
  });
});
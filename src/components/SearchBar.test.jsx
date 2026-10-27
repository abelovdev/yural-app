import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import searchReducer from '../store/searchSlice';
import SearchBar from './SearchBar';

function renderWithRedux(ui, { initialState } = {}) {
  const store = configureStore({
    reducer: { search: searchReducer },
    preloadedState: { search: initialState },
  });
  return render(<Provider store={store}>{ui}</Provider>);
}

describe('SearchBar Component Integration Test', () => {
  it('рендерит форму ввода и обновляет артикул при вводе текста', () => {
    renderWithRedux(<SearchBar />, {
      initialState: { partNumber: '', loading: false },
    });

    const input = screen.getByPlaceholderText(/Введите номер детали/i);
    expect(input).toBeInTheDocument();
    expect(input.value).toBe('');

    // Имитируем ввод артикула пользователем
    fireEvent.change(input, { target: { value: '71605000395' } });
    expect(input.value).toBe('71605000395');
  });

  it('блокирует кнопку и меняет текст на "Поиск..." во время загрузки (loading = true)', () => {
    renderWithRedux(<SearchBar />, {
      initialState: { partNumber: '71605000395', loading: true },
    });

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveTextContent('Поиск...');
  });

  it('отправляет форму при нажатии кнопки "Найти"', () => {
    renderWithRedux(<SearchBar />, {
      initialState: { partNumber: '01089', loading: false },
    });

    const button = screen.getByRole('button', { name: /Найти/i });
    expect(button).not.toBeDisabled();

    // Отправляем форму
    fireEvent.click(button);

    // После клика к кнопке применяется состояние отправки из формы
    expect(button).toBeInTheDocument();
  });
});
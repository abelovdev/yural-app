import searchReducer, { setPartNumber, toggleHideOutOfStock } from './searchSlice';

describe('searchSlice reducers', () => {
  const initialState = {
    partNumber: '',
    hideOutOfStock: false,
  };

  it('должен правильно обновлять partNumber', () => {
    const state = searchReducer(initialState, setPartNumber('71605000395'));
    expect(state.partNumber).toBe('71605000395');
  });

  it('должен переключать флаг hideOutOfStock', () => {
    const state = searchReducer(initialState, toggleHideOutOfStock());
    expect(state.hideOutOfStock).toBe(true);
  });
});
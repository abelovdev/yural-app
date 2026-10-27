import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_BASE_URL = '/api/hs/hsprice/';

export const fetchBrands = createAsyncThunk(
  'search/fetchBrands',
  async ({ number }, { rejectWithValue }) => {
    try {
      const cleanNumber = encodeURIComponent(number.trim());
      const response = await fetch(`${API_BASE_URL}?number=${cleanNumber}`);

      if (!response.ok) {
        return rejectWithValue(`Ошибка сервера: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        return rejectWithValue(data.error);
      }

      if (!data.goods || data.goods.length === 0 || !data.goods[0].brand) {
        return rejectWithValue('Детали c таким артикулом не найдены.');
      }

      const uniqueBrands = Array.from(
        new Set(data.goods.map((item) => item.brand).filter(Boolean))
      );

      return { brands: uniqueBrands };
    } catch (err) {
      return rejectWithValue('Ошибка сети при запросе брендов.');
    }
  }
);

export const fetchOffers = createAsyncThunk(
  'search/fetchOffers',
  async ({ number, brand }, { rejectWithValue }) => {
    try {
      const cleanNumber = encodeURIComponent(number.trim());
      const cleanBrand = encodeURIComponent(brand.trim());

      const response = await fetch(
        `${API_BASE_URL}?number=${cleanNumber}&brand=${cleanBrand}&analogues=on&info=on`
      );
      const data = await response.json();

      if (data.error) {
        return rejectWithValue(data.error);
      }

      if (!data.goods || data.goods.length === 0) {
        return rejectWithValue('Предложения не найдены.');
      }

      const offersList = [];
      data.goods.forEach((item) => {
        if (item.brand) {
          offersList.push({ ...item, isAnalog: false });
        }
        if (Array.isArray(item.analogues)) {
          item.analogues.forEach((analog) => {
            offersList.push({ ...analog, isAnalog: true });
          });
        }
      });

      return { offers: offersList, selectedBrand: brand };
    } catch (err) {
      return rejectWithValue('Ошибка сети при запросе предложений и аналогов.');
    }
  }
);

const searchSlice = createSlice({
  name: 'search',
  initialState: {
    partNumber: '',
    activePartNumber: '',
    selectedBrand: null,
    step: 1,
    brands: [],
    offers: [],
    hideOutOfStock: false,
    loading: false,
    error: null,
  },
  reducers: {
    setPartNumber: (state, action) => {
      state.partNumber = action.payload;
    },
    setStep: (state, action) => {
      state.step = action.payload;
    },
    toggleHideOutOfStock: (state) => {
      state.hideOutOfStock = !state.hideOutOfStock;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchBrands
      .addCase(fetchBrands.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        state.brands = [];
        state.offers = [];
        state.selectedBrand = null;
        state.activePartNumber = action.meta.arg.number;
      })
      .addCase(fetchBrands.fulfilled, (state, action) => {
        state.loading = false;
        state.brands = action.payload.brands;
        state.step = 1;
      })
      .addCase(fetchBrands.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // fetchOffers
      .addCase(fetchOffers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOffers.fulfilled, (state, action) => {
        state.loading = false;
        state.offers = action.payload.offers;
        state.selectedBrand = action.payload.selectedBrand;
        state.step = 2;
      })
      .addCase(fetchOffers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setPartNumber, setStep, toggleHideOutOfStock } = searchSlice.actions;
export default searchSlice.reducer;
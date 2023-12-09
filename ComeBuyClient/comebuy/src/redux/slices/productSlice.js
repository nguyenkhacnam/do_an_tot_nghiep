import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import productAPI from "../../api/productAPI";

export const getAllProduct = createAsyncThunk(
  'product/getAll',
  // Code async logic, tham số đầu tiên data là dữ liệu truyền vào khi gọi action
  async (data, { rejectWithValue }) => {
    const response = await productAPI.getAll()
    if (!response) {
      return rejectWithValue("Get All Failed");
    }
    else {
      // console.log(response)
      return response;
    }
  }
);

export const editProduct = createAsyncThunk(
  'product/edit',
  // Code async logic, tham số đầu tiên data là dữ liệu truyền vào khi gọi action
  async (data, { rejectWithValue }) => {
    const response = await productAPI.edit(data)
    if (response.status != 200 && response != "Product was updated successfully.") {
      return rejectWithValue("Get All Failed");
    }
    else {
      const response_2 = await productAPI.getProductWithID(data.productID)
      if (response_2.status != 200) {
        return rejectWithValue("Get All Failed");
      }
      else
        return response_2.data;
    }
  }
);

export const deleteProductByID = createAsyncThunk(
  'product/deletebyid',
  // Code async logic, tham số đầu tiên data là dữ liệu truyền vào khi gọi action
  async (productID, { rejectWithValue }) => {
    const response = await productAPI.deleteByID(productID)
    if (response.status != 200)
      return rejectWithValue("Get All Failed");
    else return productID
  }
);


export const getProductWithID = createAsyncThunk(
  'product/findOne',
  async (data, { rejectedWithValue }) => {
    const response = await productAPI.getProductWithID(data)
    if (!response) {
      return rejectedWithValue(" Find product failed")
    } else {
      return response.data
    }
  }
)

export const productSlice = createSlice({
  name: 'product',
  initialState: {
    productList: [],
    loading: false
  },
  reducers: {
    productListChange: (state, action) => {
      state.productList = action.payload;
    },
    productLoadingChange: (state, action) => {
      state.loading = action.payload;
    },
    addProduct: (state, action) => {
      state.productList.push(action.payload)
    }

  },
  extraReducers: {
    [getAllProduct.pending]: (state) => {
      state.loading = true;
    },
    [getAllProduct.fulfilled]: (state, action) => {
      state.loading = false;
      state.productList = action.payload;
    },
    [getAllProduct.rejected]: (state, action) => {
      state.loading = false;
    },
    [editProduct.pending]: (state) => {
      /// Nothing
    },
    [editProduct.fulfilled]: (state, action) => {
      state.productList = state.productList.map(member => {
        if (member.productID == action.payload.productID)
          return action.payload
        else return member
      });
    },
    [editProduct.rejected]: (state, action) => {
      state.loading = false;
    },
    [getProductWithID.pending]: (state) => {
      state.loading = true;
      console.log("Start slice");
    },
    [getProductWithID.fulfilled]: (state, action) => {
      state.loading = false;
      console.log("Successfully");
    },
    [getProductWithID.rejected]: (state, action) => {
      state.loading = false;
    },
    [deleteProductByID.pending]: (state) => {
      state.loading = true;
      console.log("Start slice");
    },
    [deleteProductByID.fulfilled]: (state, action) => {
      state.productList = state.productList.filter(member => (member.productID != action.payload));
      console.log("Successfully");
    },
    [deleteProductByID.rejected]: (state, action) => {
      state.loading = false;
    }
  }
})
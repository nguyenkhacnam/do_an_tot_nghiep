import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import cartApi from './../../api/cartAPI';

export const getAllCart = createAsyncThunk(
    'cart/getAll',
    // Code async logic, tham số đầu tiên data là dữ liệu truyền vào khi gọi action
    async (data, { rejectWithValue }) => {
        const response = await cartApi.getAll()
        if (!response) {
            return rejectWithValue("Get All Failed");
        }
        else {
            return response.data;
        }
    }
);

export const updateCart = createAsyncThunk(
    'cart/updateCart',
    async (data, { rejectedWithValue }) => {
        const response = await cartApi.updateCart(data)
        if (!response) {
            return rejectedWithValue("Updated failed !")
        } else {
            return response
        }
    }
);

export const deleteCartById = createAsyncThunk(
    'cart/deleteCartById',
    async (data, { rejectedWithValue }) => {
        const response = await cartApi.deleteCartById(data)
        if (!response) {
            return rejectedWithValue("Deleted failed !")
        } else {
            return response
        }
    }
);

export const addCart = createAsyncThunk(
    'cart/addCart',
    async (data, { rejectedWithValue }) => {
        const response = await cartApi.addCart(data)
        if (!response) {
            return rejectedWithValue("Add cart failed")
        } else {
            return response
        }
    }
)

export const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        cartList: [],
        loading: false
    },
    reducers: {
        cartListChange: (state, action) => {
            state.cartList = action.payload;
            localStorage.setItem('cart', JSON.stringify(action.payload))
        },
        cartLoadingChange: (state, action) => {
            state.loading = action.payload;
        },
        addCart: (state, action) => {
            state.cartList.push(action.payload)
        }

    },
    extraReducers: {
        [getAllCart.pending]: (state) => {
            state.loading = true;
        },
        [getAllCart.fulfilled]: (state, action) => {
            state.loading = false;
            state.branchList = action.payload;
        },
        [getAllCart.rejected]: (state, action) => {
            state.loading = false;
        },
        [updateCart.pending]: (state) => {
            state.loading = true;
            console.log(" pending...");
        },
        [updateCart.fulfilled]: (state, action) => {
            state.loading = false;
            console.log("fulfilled...");
        },
        [updateCart.rejected]: (state, action) => {
            state.loading = false;
            state.errorMessage = action.payload;
            console.log("rejected: " + state.errorMessage);
        },
        [deleteCartById.pending]: (state) => {
            state.loading = true;
            console.log(" pending...");
        },
        [deleteCartById.fulfilled]: (state, action) => {
            state.loading = false;
            console.log("fulfilled...");
        },
        [deleteCartById.rejected]: (state, action) => {
            state.loading = false;
            state.errorMessage = action.payload;
            console.log("rejected: " + state.errorMessage);
        },
        [addCart.pending]: (state) => {
            state.loading = true;
            console.log(" pending...");
        },
        [addCart.fulfilled]: (state, action) => {
            state.loading = false;
            console.log("fulfilled...");
        },
        [addCart.rejected]: (state, action) => {
            state.loading = false;
            state.errorMessage = action.payload;
            console.log("rejected: " + state.errorMessage);
        },
    }
})
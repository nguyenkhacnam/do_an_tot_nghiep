import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import productImageAPI from "../../api/productImageAPI";

export const getProductImageWithID = createAsyncThunk(
    'product/findOne',
    async (data, { rejectedWithValue }) => {
        const response = await productImageAPI.getProductImageWithID(data)
        if (!response) {
            return rejectedWithValue(" Find product image failed")
        } else {
            return response.data
        }
    }
)

export const productImageSlice = createSlice({
    name: 'productImage',
    initialState: {
        productImageList: [],
        loading: false
    },
    reducers: {
        productImageListChange: (state, action) => {
            state.productImageList = action.payload;
        },
        productImageLoadingChange: (state, action) => {
            state.loading = action.payload;
        },
        addProductImage: (state, action) => {
            state.productImageList.push(action.payload)
        }

    },
    extraReducers: {
        [getProductImageWithID.pending]: (state) => {
            state.loading = true;
            console.log("Start slice");
        },
        [getProductImageWithID.fulfilled]: (state, action) => {
            state.loading = false;
            console.log("Successfully");
        },
        [getProductImageWithID.rejected]: (state, action) => {
            state.loading = false;
        },
     
    }
})
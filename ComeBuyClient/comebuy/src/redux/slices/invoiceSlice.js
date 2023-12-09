import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import invoiceAPI from "../../api/invoiceAPI";

export const getAllInvoice = createAsyncThunk(
    'invoice/getAll',
    async (data, { rejectWithValue }) => {
        const response = await invoiceAPI.getAll()
        if (!response) {
            return rejectWithValue("Get All Failed");
        }
        else {
            return response;
        }
    }
);

export const updateInvoice = createAsyncThunk(
    'invoice/updateInvoice',
    async (data, { rejectedWithValue }) => {
        const response = await invoiceAPI.updateInvoice(data)
        if (!response) {
            return rejectedWithValue("Updated failed !")
        } else {
            return response
        }
    }
);

export const addInvoice = createAsyncThunk(
    "invoice/addInvoice",
    async (data, { rejectWithValue }) => {
        try {
            const response = await invoiceAPI.addInvoice(data);
            if (!response) {
                return rejectWithValue();
            } else {
                return response;
            }
        } catch (error) {
            console.log(error);
        }
    })


export const invoiceSlice = createSlice({
    name: 'invoice',
    initialState: {
        invoiceList: [],
        loading: false
    },
    reducers: {
        invoiceListChange: (state, action) => {
            state.invoiceList = action.payload;
        },
        invoiceLoadingChange: (state, action) => {
            state.loading = action.payload;
        },
        addInvoice: (state, action) => {
            state.invoiceList.push(action.payload)
        },
    },
    extraReducers: {
        [updateInvoice.pending]: (state) => {
            state.loading = true;
        },
        [updateInvoice.fulfilled]: (state, action) => {
            state.loading = false;
        },
        [updateInvoice.rejected]: (state, action) => {
            state.loading = false;
        },
        [addInvoice.pending]: (state) => {
            state.loading = true;
        },
        [addInvoice.fulfilled]: (state, action) => {
            state.loading = false;
        },
        [addInvoice.rejected]: (state, action) => {
            state.loading = false;
        }
    }
})
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import branchApi from './../../api/branchAPI';

export const getAllBranch = createAsyncThunk(
    'branch/getAll',
    // Code async logic, tham số đầu tiên data là dữ liệu truyền vào khi gọi action
    async (data, { rejectWithValue }) => {
        const response = await branchApi.getAll()
        if (!response) {
            return rejectWithValue("Get All Failed");
        }
        else {
            return response.data;
        }
    }
);

// export const editbranch = createAsyncThunk(
//     'branch/edit',
//     // Code async logic, tham số đầu tiên data là dữ liệu truyền vào khi gọi action
//     async (data, { rejectWithValue }) => {
//         const response = await branchAPI.edit(data)
//         if (response.status != 200 && response != "branch was updated successfully.") {
//             return rejectWithValue("Get All Failed");
//         }
//         else {
//             const response_2 = await branchAPI.getbranchWithID(data.branchID)
//             if (response_2.status != 200) {
//                 return rejectWithValue("Get All Failed");
//             }
//             else
//                 return response_2.data;
//         }
//     }
// );

// export const deletebranchByID = createAsyncThunk(
//     'branch/deletebyid',
//     // Code async logic, tham số đầu tiên data là dữ liệu truyền vào khi gọi action
//     async (branchID, { rejectWithValue }) => {
//         const response = await branchAPI.deleteByID(branchID)
//         if (response.status != 200)
//             return rejectWithValue("Get All Failed");
//         else return branchID
//     }
// );


// export const getbranchWithID = createAsyncThunk(
//     'branch/findOne',
//     async (data, { rejectedWithValue }) => {
//         const response = await branchAPI.getbranchWithID(data)
//         if (!response) {
//             return rejectedWithValue(" Find branch failed")
//         } else {
//             return response.data
//         }
//     }
// )

export const branchSlice = createSlice({
    name: 'branch',
    initialState: {
        branchList: [],
        loading: false
    },
    reducers: {
        branchListChange: (state, action) => {
            state.branchList = action.payload;
        },
        branchLoadingChange: (state, action) => {
            state.loading = action.payload;
        },
        addbranch: (state, action) => {
            state.branchList.push(action.payload)
        }

    },
    extraReducers: {
        [getAllBranch.pending]: (state) => {
            state.loading = true;
        },
        [getAllBranch.fulfilled]: (state, action) => {
            state.loading = false;
            state.branchList = action.payload;
        },
        [getAllBranch.rejected]: (state, action) => {
            state.loading = false;
        },
    }
})
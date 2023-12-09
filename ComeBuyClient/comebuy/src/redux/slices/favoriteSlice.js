import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import favoriteApi from './../../api/favoriteAPI';

export const getAllFavorite = createAsyncThunk(
    'favorite/getAll',
    // Code async logic, tham số đầu tiên data là dữ liệu truyền vào khi gọi action
    async (data, { rejectWithValue }) => {
        const response = await favoriteApi.getAll()
        if (!response) {
            return rejectWithValue("Get All Failed");
        }
        else {
            return response.data;
        }
    }
);

// export const updatefavorite = createAsyncThunk(
//     'favorite/updatefavorite',
//     async (data, { rejectedWithValue }) => {
//         const response = await favoriteApi.updatefavorite(data)
//         if (!response) {
//             return rejectedWithValue("Updated failed !")
//         } else {
//             return response
//         }
//     }
// );

export const deleteFavoriteById = createAsyncThunk(
    'favorite/deleteFavoriteById',
    async (id, { rejectedWithValue }) => {
        const response = await favoriteApi.deleteFavoriteById(id)
        if (!response) {
            return rejectedWithValue("Deleted failed !")
        } else {
            return response
        }
    }
);

export const addFavorite = createAsyncThunk(
    'favorite/addFavorite',
    async (data, { rejectedWithValue }) => {
        const response = await favoriteApi.addFavorite(data)
        if (!response) {
            return rejectedWithValue("Add favorite failed")
        } else {
            return response
        }
    }
)

export const favoriteSlice = createSlice({
    name: 'favorite',
    initialState: {
        favoriteList: [],
        loading: false
    },
    reducers: {
        favoriteListChange: (state, action) => {
            state.favoriteList = action.payload;
            localStorage.setItem('favorite', JSON.stringify(action.payload))
        },
        favoriteLoadingChange: (state, action) => {
            state.loading = action.payload;
        },
        addFavorite: (state, action) => {
            state.favoriteList.push(action.payload)
        }

    },
    extraReducers: {
        [getAllFavorite.pending]: (state) => {
            state.loading = true;
        },
        [getAllFavorite.fulfilled]: (state, action) => {
            state.loading = false;
            state.branchList = action.payload;
        },
        [getAllFavorite.rejected]: (state, action) => {
            state.loading = false;
        },
        // [updateFavorite.pending]: (state) => {
        //     state.loading = true;
        //     console.log(" pending...");
        // },
        // [updateFavorite.fulfilled]: (state, action) => {
        //     state.loading = false;
        //     console.log("fulfilled...");
        // },
        // [updateFavorite.rejected]: (state, action) => {
        //     state.loading = false;
        //     state.errorMessage = action.payload;
        //     console.log("rejected: " + state.errorMessage);
        // },
        [deleteFavoriteById.pending]: (state) => {
            state.loading = true;
            console.log(" pending...");
        },
        [deleteFavoriteById.fulfilled]: (state, action) => {
            state.loading = false;
            console.log("fulfilled...");
        },
        [deleteFavoriteById.rejected]: (state, action) => {
            state.loading = false;
            state.errorMessage = action.payload;
            console.log("rejected: " + state.errorMessage);
        },
        [addFavorite.pending]: (state) => {
            state.loading = true;
            console.log(" pending...");
        },
        [addFavorite.fulfilled]: (state, action) => {
            state.loading = false;
            console.log("fulfilled...");
        },
        [addFavorite.rejected]: (state, action) => {
            state.loading = false;
            state.errorMessage = action.payload;
            console.log("rejected: " + state.errorMessage);
        },
    }
})
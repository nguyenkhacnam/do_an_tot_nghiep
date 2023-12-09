import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import JWTApi from "../../api/JWTAPI";
import accountApi from "../../api/accountAPI";

const defaultUser = {
  "userID": "00000000-0000-0000-0000-000000000000",
  "name": "kkk",
  "dob": "kk",
  "avatar": "kk",
  "phoneNumber": "kkk",
  "email": "test.com",
  "password": "xxxxxxxxxxxxxxxxxxxx",
  "bio": "kkk",
  "address": "kk",
  "role": "kk",
  "sex": "kk",
  "cart": [],
  'branch': {
    "branchid" : '123455',
    "address": "Loading...."
  }
}

export const login = createAsyncThunk(
  'account/login',
  // Code async logic, tham số đầu tiên data là dữ liệu truyền vào khi gọi action
  async (data, { rejectWithValue }) => {
    const response = await JWTApi.login(data.email, data.password)
    if (!response.accessToken) {
      return rejectWithValue("Login Failed");
    }
    else {
      const jsonData = await accountApi.getAccountbyEmail(data.email)
      localStorage.setItem('idUser', jsonData.userID);
      localStorage.setItem('role', jsonData.role);
      localStorage.setItem('cart', JSON.stringify(jsonData.cart));
      return jsonData;
    }
  }
);


export const edit = createAsyncThunk(
  'account/edit',
  // Code async logic, tham số đầu tiên data là dữ liệu truyền vào khi gọi action
  async (data, { rejectWithValue }) => {
    const response = await accountApi.edit(data)
    if (!response.accessToken) {
      return rejectWithValue("Login Failed");
    }
    else {
      return response;
    }
  }
);


export const getAccountWithID = createAsyncThunk(
  'account/findOne',
  async (data, { rejectedWithValue }) => {
    const response = await accountApi.getAccountWithID(data)
    if (response.status != 200) {
      return rejectedWithValue(" Find account failed")
    } else {
      return response.data
    }
  }
)

export const getAccountWithEmail = createAsyncThunk(
  'account/findOneWithEmail',
  async (data, { rejectedWithValue }) => {
    const response = await accountApi.getAccountbyEmail(data)
    if (!response) {
      return false
    } else {
      return response
    }
  }
)

export const register = createAsyncThunk(
  "account/register",
  async ({ dataForReg }, { rejectWithValue }) => {
    try {
      const response = await accountApi.register(dataForReg);
      if (!response) {
        return rejectWithValue();
      } else {
        return response;
      }
    } catch (error) {
      console.log(error);
    }
  })

export const updateAccount = createAsyncThunk(
  "account/update",
  async (data, { rejectedWithValue }) => {
    const response = await accountApi.updateAccount(data)
    if (!response) {
      return rejectedWithValue(false)
    } else {
      return response.data
    }
  }
)

export const updatePassword = createAsyncThunk(
  "account/resetPassword",
  async (data, { rejectedWithValue }) => {
    const response = await accountApi.updatePasswordForAccount(data.password, data.userID)
    if (!response) {
      return rejectedWithValue(false)
    } else {
      return response.data
    }
  }
)

export const accountSlice = createSlice({
  name: 'account',
  initialState: {
    user: defaultUser,
    loading: false,
    errorMessage: 'this is message',
    isSignedIn: false,
    isRegSuccess: false
  },
  reducers: {
    logout: (state) => {
      state.isSignedIn = false;
      state.user = defaultUser;
    },
  },
  extraReducers: {
    [register.pending]: (state, action) => {
      state.loading = true
      state.isRegSuccess = false
    },
    [register.fulfilled]: (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.isRegSuccess = true;
    },
    [register.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
      state.isRegSuccess = false;
    },
    [login.pending]: (state) => {
      state.loading = true;
    },
    [login.fulfilled]: (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.isSignedIn = true
      localStorage.setItem("role", state.user.role)
    },
    [login.rejected]: (state, action) => {
      state.loading = false;
      state.errorMessage = action.payload;
    },
    [getAccountWithID.pending]: (state, action) => {
      state.loading = true;
      state.isRegSuccess = false;
    },
    [getAccountWithID.fulfilled]: (state, action) => {
      state.user = action.payload;
      state.loading = false;
      state.isRegSuccess = true;
    },
    [getAccountWithID.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
      state.isRegSuccess = false;
    },
    [getAccountWithEmail.pending]: (state, action) => {
      state.loading = true
    },
    [getAccountWithEmail.fulfilled]: (state, action) => {
      state.loading = false;
    },
    [getAccountWithEmail.rejected]: (state, action) => {
      state.loading = false;
    },
    [updateAccount.pending]: (state) => {
      state.loading = true;
      console.log(" pending...");
    },
    [updateAccount.fulfilled]: (state, action) => {
      state.loading = false;
      state.user = action.payload;
      console.log(" fulfilled: " + state.user);
    },
    [updateAccount.rejected]: (state, action) => {
      state.loading = false;
      state.errorMessage = action.payload;
      console.log("rejected: " + state.errorMessage);
    },
    [updatePassword.pending]: (state) => {
      state.loading = true;
      console.log(" pending...");
    },
    [updatePassword.fulfilled]: (state, action) => {
      state.loading = false;
      console.log(" fulfilled: " + state.user);
    },
    [updatePassword.rejected]: (state, action) => {
      state.loading = false;
      state.errorMessage = action.payload;
      console.log("rejected: " + state.errorMessage);
    },
  }
})

import DatabaseClient from './baseAPI.js'

const baseURL = 'authentication'

const JWTApi = {
    login: async (email,password) => {
        const res = await DatabaseClient.post('/' + baseURL, { email: email, password: password });
        try {
            await localStorage.setItem('accessToken',res.data.accessToken);
        } catch (e)
        {
            console.log('AsyncStorage Error');
        }
        try {
            await localStorage.setItem('refreshToken',res.data.refreshToken);
        } catch (e)
        {
            console.log('AsyncStorage Error');
        }
        return res.data;
    },
    RefreshToken: async refToken => {
        const res = await DatabaseClient.post('/' + baseURL + '/refreshToken', { token: refToken  });
        return res.data;
    },
    logout: async refToken => {
        const res = await DatabaseClient.post('/' + baseURL + 'logout', { token: refToken });
        return res.data
    }
}
export default JWTApi
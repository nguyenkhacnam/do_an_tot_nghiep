import { ai_server_URL, DELOYED_AI_SERVER_URL } from '../constant.js';
import axios from 'axios'

const AIServer = axios.create({
    // baseURL: "http://127.0.0.1:5000",
    baseURL: DELOYED_AI_SERVER_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

const aiApi = {
    recommendedSystem: async (data) => {
        const res = await AIServer.post('/rs', data)
            .catch(err => {
                console.log(err)
                return err.response
            })
        return res;
    },
    dataAnalysis: async (data) => {
        const res = await AIServer.post('/', data)
            .catch(err => { return err.response })
        return res;
    }
}
export default aiApi
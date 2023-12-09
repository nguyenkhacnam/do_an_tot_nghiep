import DatabaseClient from './baseAPI.js'

const baseURL = 'email'

const emailApi = {
    sendEmail: async (dataForSendMail) => {
        const res = await DatabaseClient.post(baseURL + '/verify', dataForSendMail)
        return res
    },
    sendOrder: async (dataForSendOrder) => {
        const res = await DatabaseClient.post(baseURL + '/sendOrder', dataForSendOrder)
        return res
    }
}
export default emailApi

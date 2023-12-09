import DatabaseClient from './baseAPI.js'

const baseURL = 'cart'

const cartApi = {
    getAll: async () => {
        const res = DatabaseClient.get('/' + baseURL)
            .catch(err => { return err.response })
        return res;
    },
    updateCart: async (data) => {
        const res = await DatabaseClient.put('/' + baseURL + '/' + data.cartID, data)
            .catch(err => { return err.response })
        return res;
    },
    deleteCartById: async (data) => {
        const res = await DatabaseClient.delete('/' + baseURL + '/' + data.cartID, data)
            .catch(err => { return err.message })
        return res;
    },
    addCart: async (data) => {
        const res = await DatabaseClient.post('/' + baseURL, data)
            .catch(err => { return err.response })
        return res;
    }
}
export default cartApi
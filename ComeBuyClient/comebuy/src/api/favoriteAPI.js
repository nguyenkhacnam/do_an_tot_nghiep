import DatabaseClient from './baseAPI.js'

const baseURL = 'favorite'

const favoriteApi = {
    getAll: async () => {
        const res = DatabaseClient.get('/' + baseURL)
            .catch(err => { return err.response })
        return res;
    },
    // updateCart: async (data) => {
    //     const res = await DatabaseClient.put('/' + baseURL + '/' + data.cartID, data)
    //         .catch(err => { return err.response })
    //     return res;
    // },
    deleteFavoriteById: async (id) => {
        const res = await DatabaseClient.delete('/' + baseURL + '/' + id, id)
            .catch(err => { return err.message })
        return res;
    },
    addFavorite: async (data) => {
        const res = await DatabaseClient.post('/' + baseURL, data)
            .catch(err => { return err.response })
        return res;
    }
}
export default favoriteApi
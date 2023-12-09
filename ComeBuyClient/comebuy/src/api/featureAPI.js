import DatabaseClient from './baseAPI.js'

const baseURL = 'feature'

const featureAPI = {
    getAll: async () => {
        const res = await DatabaseClient.get('/' + baseURL)
            .catch(err => { return err.response })
        return res.data;
    },
    edit: async (data) => {
        const res = await DatabaseClient.put('/' + baseURL + '/' + data.featureID, data)
            .catch(err => { return err.response })
        return res
    }
}
export default featureAPI
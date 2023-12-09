import DatabaseClient from './baseAPI.js'

const baseURL = 'banner'

const bannerApi = {
    getAll: async () => {
        const res = DatabaseClient.get('/' + baseURL)
            .catch(err => { return err.response })
        return res;
    },
    createNewBanner: async (data) => {
        const res = DatabaseClient.post('/' + baseURL,data)
            .catch(err => { return err.response })
        return res;
    },
    deleteBannerById: async (id) => {
        const res = await DatabaseClient.delete('/' + baseURL + '/' + id, id)
            .catch(err => { return err.message })
        return res;
    },
}
export default bannerApi
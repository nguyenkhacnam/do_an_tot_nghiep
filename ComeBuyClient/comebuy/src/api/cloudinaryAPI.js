import DatabaseClient from './baseAPI.js'

const baseURL = 'cloudinary'

const cloudinaryApi = {
    uploadImages: async (data) => {
        const res = await DatabaseClient.post('/' + baseURL, data)
            .catch(err => { return err.response })
        return res;
    },
    uploadBigImages: async (data) => {
        const res = await DatabaseClient.post('/' + baseURL + '/big', data)
            .catch(err => { return err.response })
        return res;
    },
}
export default cloudinaryApi
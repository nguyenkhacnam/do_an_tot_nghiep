import DatabaseClient from './baseAPI.js'

const baseURL = 'comment'

const commentApi = {
    getCommentsWithID: async (id) => {
        const res = DatabaseClient.get('/' + baseURL + `/findByProductID/${id}`)
            .catch(err => { return err.response })
        return res;
    },

    postNewComment: async (data) => {
        const res = DatabaseClient.post('/' + baseURL,data)
            .catch(err => { return err.response })
        return res;
    },
    
}
export default commentApi
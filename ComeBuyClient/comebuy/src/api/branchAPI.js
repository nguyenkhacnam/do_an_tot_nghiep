import DatabaseClient from './baseAPI.js'

const baseURL = 'branch'

const branchApi = {
    getAll: async () => {
        const res = DatabaseClient.get('/' + baseURL)
            .catch(err => { return err.response })
        return res;
    },
    getBranchWithID: async (id) => {
        const res = DatabaseClient.get('/' + baseURL + `/${id}`)
            .catch(err => { return err.response })
        return res;
    }
}
export default branchApi
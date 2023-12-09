import DatabaseClient from './baseAPI.js'

const baseURL = 'stock'

const stockApi = {
    getAllStockByBranch: async (branchID) => {
        const res = DatabaseClient.get('/' + baseURL + "/FindByBranch/" + branchID)
            .catch(err => { return err.response })
        return res;
    },
    createNewStock: async (data) => {
        const res = DatabaseClient.post('/' + baseURL, data)
            .catch(err => { return err.response })
        return res;
    },
    deleteStock: async (stockID) => {
        const res = DatabaseClient.delete("/" + baseURL + "/" + stockID)
            .catch(err => { return err.response })
        return res
    },
    updateStock: async (data) => {
        const res = DatabaseClient.put("/" + baseURL + "/" + data.id, data)
            .catch(err => { return err.response })
        return res
    },
}
export default stockApi
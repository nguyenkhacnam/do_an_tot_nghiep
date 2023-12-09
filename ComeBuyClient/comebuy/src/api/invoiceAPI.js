import DatabaseClient from './baseAPI.js'

const baseURL = 'invoice'

const invoiceAPI = {
    getAll: async () => {
        const res = await DatabaseClient.get('/' + baseURL)
            .catch(err => { return err.response })
        return res.data;
    },
    updateInvoice: async (data) => {
        const res = await DatabaseClient.put('/' + baseURL + '/' + data.invoiceID, data)
            .catch(err => { return err.response })
        return res.data;
    },
    RevenueByBranch: async (branchID) => {
        const res = await DatabaseClient.get('/' + baseURL + '/revenueByBranchID/' + branchID)
            .catch(err => { return err.response })
        return res;
    },
    addInvoice: async (newInvoice) => {
        const res = await DatabaseClient.post('/' + baseURL, newInvoice)
            .catch(err => { return err.response })
        return res
    }
}
export default invoiceAPI
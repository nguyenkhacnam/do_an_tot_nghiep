import DatabaseClient from './baseAPI.js'

const baseURL = 'invoiceItem'

const invoiceItemAPI = {
    addInvoiceItem: async (invoiceItem) => {
        const res = await DatabaseClient.post('/invoice/' + baseURL, invoiceItem)
            .catch(err => { return err.response })
        return res
    }
}
export default invoiceItemAPI
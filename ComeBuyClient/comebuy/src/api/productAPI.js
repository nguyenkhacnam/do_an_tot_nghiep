import DatabaseClient from './baseAPI.js'

const baseURL = 'product'

const productAPI = {
    getAll: async () => {
        const res = await DatabaseClient.get('/' + baseURL)
            .catch(err => { return err.response })
        return res.data;
    },

    edit: async (data) => {
        const res = await DatabaseClient.put('/' + baseURL + '/' + data.productID, data)
            .catch(err => { return err.response })
        return res
    },
    getProductWithID: async (id) => {
        const res = await DatabaseClient.get('/' + baseURL + `/${id}`)
            .catch(err => { return err.response })
        return res;
    },
    deleteAndUpdate_Feature: async (productID, newFeatures) => {
        const res = await DatabaseClient.post('/' + baseURL + "/DeleteAndUpdate/Feature",
            {
                productID: productID,
                featureID: newFeatures
            }).catch(err => { return err.response })
        return res
    },
    createNewProduct: async (newProduct) => {
        const res = await DatabaseClient.post('/' + baseURL, newProduct)
            .catch(err => { return err.response })
        return res
    },
    deleteByID: async (productID) => {
        const res = await DatabaseClient.delete('/' + baseURL + `/${productID}`)
            .catch(err => { return err.response })
        return res;
    },
    getProductFilterOptions: async () => {
        const res = await DatabaseClient.get('/' + baseURL + '/filter/feature')
            .catch(err => { return err.response })
        return res;
    },
    getRecordsFilter: async (filterOptions) => {
        const res = await DatabaseClient.post('/' + baseURL + '/filter', filterOptions)
            .catch(err => { return err.response })
        return res;
    }
}
export default productAPI
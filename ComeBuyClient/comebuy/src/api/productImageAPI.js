import DatabaseClient from './baseAPI.js'

const baseURL = 'productImage'

const productImageAPI = {
    getProductImageWithID: async (id) => {
        const res = await DatabaseClient.get('/' + baseURL + `/${id}`)
            .catch(err => { return err.response })
        return res;
    },
    addMany: async (list) => {
        // console.log(list)
        const res = await DatabaseClient.post('/' + baseURL + '/many', list)
            .catch(err => { return err.response })
        return res;
    },
    deleteImagesOfProduct: async (productID) => {
        const res = await DatabaseClient.delete('/' + baseURL + '/byproductid/' + productID)
            .catch(err => { return err.response })
        return res;
    }

}
export default productImageAPI
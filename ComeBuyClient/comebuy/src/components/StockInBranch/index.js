import { Box, Button, CircularProgress, Stack, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import stockApi from "../../api/stockAPI"
import SnackBarAlert from "../SnackBarAlert"
import ProductCardInStock from '../ProductCardInStock'
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import style from './style.js'
import AddProductInStockModal from '../AddProductInStockModal'
import UpdateAmountInStockModal from "../UpdateAmountInStockModel"
import { useDispatch } from "react-redux"
import { getAllInvoice } from "../../redux/slices/invoiceSlice.js"
import { unwrapResult } from "@reduxjs/toolkit"

const StockInBranch = (props) => {
    const { branch } = props
    const [stockList, setStockList] = useState([])
    const [loading, setLoading] = useState(false)
    const [openSuccessAlert, setOpenSuccessAlert] = useState(false);
    const [openErrorAlert, setOpenErrorAlert] = useState(false);
    const [openAddModal, setOpenAddModal] = useState(false)
    const [openUpdateModal, setOpenUpdateModal] = useState(false)
    const [messageError, setMessageError] = useState("No Error")
    const [messageSuccess, setMessageSuccess] = useState("Notification")
    const [selectedStock, setSelectedStock] = useState(null)

    const handleCloseModal = () => {
        setOpenAddModal(false)
        setOpenUpdateModal(false)
    }

    const handleUpdateAmountProduct = async (number) => {
        const updatedStock = {
            ...selectedStock,
            totalAmount: Number(selectedStock.totalAmount) + Number(number),
            remaining: Number(selectedStock.remaining) + Number(number)
        }
        const response = await stockApi.updateStock(updatedStock)
        if (response.status == 200) {
            setSelectedStock(updatedStock)
            setStockList(prevList => prevList.map(item => {
                if (item.id == updatedStock.id)
                    return updatedStock
                else return item
            }))
            setMessageSuccess("Update Quantity Successfully")
            setOpenSuccessAlert(true)
        }
        else {
            setMessageError("Update Quantity Failed :((")
            setOpenErrorAlert(true)
        }
    }

    const handleDeleteProduct = async (selectedStk) => {
        const response = await stockApi.deleteStock(selectedStk.id)
        if (response.status == 200) {
            const newList = stockList.filter((item) => item.id != selectedStk.id)
            setStockList(newList)
            setMessageSuccess("Thành công")
            setOpenSuccessAlert(true)
        }
        else {
            setMessageError("Delete Stock Failed :((")
            setOpenErrorAlert(true)
        }
    }

    const handleAddProduct = async (value) => {
        const newStock = {
            totalAmount: value.amount,
            remaining: value.amount,
            branchID: branch.branchID,
            productID: value.product.productID
        }
        const response = await stockApi.createNewStock(newStock)
        if (response.status == 200) {
            LoadData()  /// Using Load data cause response dont have product objects so child components will not function
            setMessageSuccess("Add Stock Successfully")
            setOpenSuccessAlert(true)
        }
        else {
            setMessageError("Add Stock Failed :((")
            setOpenErrorAlert(true)
        }
    }
    const handleClose = (event, reason) => {
        if (reason === 'clickaway')
            return;
        setOpenSuccessAlert(false);
        setOpenErrorAlert(false);

    };
    async function LoadData() {
        try {
            const response = await stockApi.getAllStockByBranch(branch.branchID)
            if (response.status === 200) {
                setStockList(response.data)
                setLoading(true)
                setMessageSuccess("Load Stock Successfully")
                setOpenSuccessAlert(true)
            }
            else {
                setMessageError("Load Stock Failed :((")
                setOpenErrorAlert(true)
            }
        }
        catch (err) {
            console.log(err)
        }
    }
    useEffect(() => {
        LoadData()
    }, [])
    const dispatch = useDispatch();

    const [invoiceList, setInvoiceList] = useState([])

    const filteredInvoiceItems = invoiceList?.reduce((accumulator, currentInvoice) => {
        console.log("🚀 ~ file: index.js:119 ~ filteredInvoiceItems ~ currentInvoice:", currentInvoice)
        
        if (currentInvoice.isPaid && branch.branchID === currentInvoice.branchid) {
          const { invoiceitem } = currentInvoice;
          accumulator.push(...invoiceitem);
        }
        return accumulator;
      }, []);

    
    useEffect(() => {
        async function fetchInvoice() {
            let temp = []
            if (invoiceList.length === 0) {
                try {
                    const resultAction = await dispatch(getAllInvoice())
                    const originalPromiseResult = unwrapResult(resultAction)
                    let tempList = []
                    originalPromiseResult?.data?.map((invoice) => {
                        let t = 0
                        invoice.invoiceitem.map(i => {
                            t = t + Number(i.total)
                        })
                        let obj = {
                            ...invoice,
                            total: t
                        }
                        tempList.push(obj)
                    })
                    setInvoiceList(tempList)
                } catch (rejectedValueOrSerializedError) {
                    console.log(rejectedValueOrSerializedError);
                }
            }
        }
        fetchInvoice()
        return () => {
            setInvoiceList({});
        };
    }, [])

    return (
        <Box sx={{ height: '30%', width: '100%' }}>
            <Stack>
                <Button sx={style.AddProductButton} startIcon={<AddShoppingCartIcon />} onClick={() => setOpenAddModal(true)}>Thêm sản phẩm vào kho</Button>
                {
                    stockList !== undefined && stockList.length > 0 ?
                        <Stack>
                            {
                                stockList.map((item) => {
                                    return (
                                    <ProductCardInStock
                                        key={item.id}
                                        filteredInvoiceItems={filteredInvoiceItems}
                                        stock={item}
                                        open={openUpdateModal}
                                        onClose={handleCloseModal}
                                        onDelete={handleDeleteProduct}
                                        openUpdateModal={() => {
                                            setOpenUpdateModal(true)
                                            setSelectedStock(item)
                                        }} />
                                )})
                            }
                        </Stack>
                        :
                        <Box sx={{ display: 'flex' }}>
                            { loading === false ? 
                                <CircularProgress />
                                :
                                <Typography variant='h6'>Không có sản phẩm nào để hiển thị...</Typography>
                            }
                        </Box>
                }
                <UpdateAmountInStockModal open={openUpdateModal} onClose={handleCloseModal} onSubmit={handleUpdateAmountProduct} />
                <AddProductInStockModal stockList={stockList} open={openAddModal} onClose={handleCloseModal} onSubmit={handleAddProduct} />
                <SnackBarAlert severity='success' open={openSuccessAlert} handleClose={handleClose} message={messageSuccess} />
                <SnackBarAlert severity='error' open={openErrorAlert} handleClose={handleClose} message={messageError} />
            </Stack>
        </Box >
    )
}
export default StockInBranch;
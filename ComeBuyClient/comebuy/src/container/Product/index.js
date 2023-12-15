import React, {
    useState,
    useEffect,
    useMemo,
    useCallback,
    memo
} from "react";
import { useDispatch, useSelector } from 'react-redux'
import { styled } from '@mui/material/styles';
import {
    DataGrid,
    GridActionsCellItem
} from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom'
import { Box, Stack, TableCell, tableCellClasses, Typography } from '@mui/material';
import { Button } from '@mui/material'
// icons 
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import InfoIcon from '@mui/icons-material/Info';
import ImportantDevicesIcon from '@mui/icons-material/ImportantDevices';
//components
import DetailProductModal from "../../components/DetailProductModal";
import { renderImportantTag } from "../../GridDataCellTemplate/ImportantTag";
// variables
import { productListSelector } from './../../redux/selectors'
//function 
import { deleteProductByID, editProduct, getAllProduct, productSlice } from './../../redux/slices/productSlice'
import SnackBarAlert from "../../components/SnackBarAlert";
import ColorSwitch from "./child";


const ProductTable = styled(DataGrid)(({ theme }) => ({
    height: 700,
    width: 1200,
    backgroundColor: 'white',
    alignSelf: 'center'

}));
const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const Product = () => {

    const _productList = useSelector(productListSelector)  // list get from store
    const dispatch = useDispatch()
    const [productList, setProductList] = useState(_productList)
    console.log("🚀 ~ file: index.js:55 ~ Product ~ productList:", productList)
    const navigate = useNavigate()
    const initalValue = { index: 0, value: null }
    //For Alert
    const [openSuccessAlert, setOpenSuccessAlert] = useState(false);
    const [openErrorAlert, setOpenErrorAlert] = useState(false);
    const [messageError, setMessageError] = useState("No Error")
    const [messageSuccess, setMessageSuccess] = useState("Notification")

    const handleClose = (event, reason) => {
        if (reason === 'clickaway')
            return;
        setOpenSuccessAlert(false);
        setOpenErrorAlert(false);
    };

    /// For modal
    const [openModal, setOpenModal] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(initalValue);

    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => setOpenModal(false);

    /// For GridData
    const [pageSize, setPageSize] = useState(25);
    const deleteProduct = useCallback(
        (value) => () => {
            dispatch(deleteProductByID(value))
                .unwrap()
                .then((originalPromiseResult) => {
                    setMessageSuccess("Delete Product Successfully")
                    setOpenSuccessAlert(true)
                })
                .catch((rejectedValueOrSerializedError) => {
                    setMessageError("Error Delete Product Failed")
                    setOpenErrorAlert(true)
                })
        }, [],
    );

    const handleEditProduct = useCallback(
        (value) => () => {
            navigate('/product/edit', { state: value })
        }, [],
    );

    const showDetail = useCallback(
        (value) => () => {
            setCurrentProduct({ index: Math.random(), value: value })
            // handleOpenModal()
        }, [],
    );

    const handleIsPublishedChange = (pr, value) => {
        dispatch(editProduct({ "productID": pr.id, "isPublished": value }))
            .unwrap()
            .then((originalPromiseResult) => {
                setMessageSuccess("Publish Product Successfully")
                setOpenSuccessAlert(true);
            })
            .catch((rejectedValueOrSerializedError) => {
                setMessageError("Publish Product Failed. Please Load Page Again")
                setOpenErrorAlert(true)
            })
    }


    const columns = useMemo(
        () => [
            { field: 'id', hide: true },
            { field: 'brand', headerName: 'Chi nhánh', width: 100 },
            { field: 'name', headerName: 'Tên', width: 180 },
            { field: 'memory', headerName: 'Memory', width: 70 },
            { field: 'gpu', headerName: 'GPU', width: 150 },
            { field: 'cpu', headerName: 'CPU', width: 200 },
            { field: 'weight', headerName: 'Cân nặng', width: 100 },
            {
                field: 'price', headerName: 'Giá', width: 150, 
                // renderCell: (params) => (
                //     renderImportantTag(params.value, 300)
                // )
            },
            {
                field: 'isPublished', headerName: 'Published', width: 120, renderCell: (params) => (
                    <ColorSwitch param={params} onIsPublishedChange={handleIsPublishedChange} />
                )
            },
            { field: 'origin', headerName: 'Xuất xứ', width: 80 },
            {
                field: 'actions',
                type: 'actions',
                headerName: 'Chức năng',
                width: 100,
                getActions: (params) => [
                    <GridActionsCellItem
                        icon={<InfoIcon />}
                        label="Chi tiết"
                        onClick={showDetail(params.row)}
                        showInMenu
                    />,
                    <GridActionsCellItem
                        icon={<EditIcon />}
                        label="Cập nhật"
                        onClick={handleEditProduct(params.row)}
                        showInMenu
                    />,
                    <GridActionsCellItem
                        icon={<DeleteIcon />}
                        label="Xóa"
                        onClick={deleteProduct(params.id)}
                        showInMenu
                    />,
                ],
            },
        ],
        [editProduct, showDetail, deleteProduct]
    );

    useEffect(() => {
        if (_productList.length === 0) {
            dispatch(getAllProduct())
                .unwrap()
                .then((originalPromiseResult) => {
                    setProductList(originalPromiseResult)
                    setMessageSuccess("Thành công")
                    setOpenSuccessAlert(true)
                })
                .catch((rejectedValueOrSerializedError) => {
                    console.log("Error load product")
                    setMessageError("Error Load Product List")
                    setOpenErrorAlert(true)
                })
        }
        if (_productList.length > 0) {
            setProductList(_productList)
            setMessageSuccess("Thành công")
            setOpenSuccessAlert(true)
        }
        return () => { setProductList({}) }
    }, [_productList])

    const handleOnCellClick = async (e) => {
        if (e.value != undefined) {
            setCurrentProduct({ index: Math.random(), value: e.row })
        }
    };

    useEffect(() => {
        if (currentProduct != initalValue)
            setOpenModal(true)
    }, [currentProduct])

    return (
        <Stack direction="column" sx={{
            width: "100%",
            height: "100%",
            justifyItems: 'center',
            alignItems: 'center',
            backgroundColor: 'grey',
            overflowY: 'auto'
        }}>
            <Box sx={{
                width: "90%",
                height: "95%",
                boxShadow: 5,
                borderRadius: 1,
                alignItems: 'center',
                justifyItems: 'center',
                backgroundColor:'white'
            }}>
                <Stack sx={{
                    width: "100%",
                    height: "100%"
                }}>
                    <Stack sx={{alignItems: 'center', justifyItems: 'center', pl: 2, pt: 2 }} direction={'row'} spacing={2}>
                        <ImportantDevicesIcon />
                        <Typography variant="h6">Quản lý sản phẩm</Typography>
                    </Stack>
                    <Button sx={{
                        width: 150,
                        backgroundColor: '#2E1534',
                        color: 'white', alignSelf: 'end',
                        m: 2,
                        borderRadius: 3,
                        '&:hover': {
                            backgroundColor: 'black',
                            color: 'white',
                        }
                    }} onClick={() => navigate('/product/add')}>Thêm sản phẩm</Button>
                    <DetailProductModal open={openModal} onClose={handleCloseModal} product={currentProduct.value} />
                    <ProductTable
                        pageSize={pageSize}
                        onPageSizeChange={(newPage) => setPageSize(newPage)}
                        pagination
                        columns={columns}
                        rows={productList}
                        getRowId={(row) => row.productID}
                        onCellDoubleClick={handleOnCellClick}
                    />
                    <SnackBarAlert severity='success' open={openSuccessAlert} handleClose={handleClose} message={messageSuccess} />
                    <SnackBarAlert severity='error' open={openErrorAlert} handleClose={handleClose} message={messageError} />
                    <Box sx={{height: 20}}></Box>
                    {/* <Routes>
                <Route path='add' element={<AddProduct />}></Route>
                <Route path='edit' element={<EditProduct />}></Route>
            </Routes> */}
                </Stack>
            </Box>
        </Stack>
    );
}

export default memo(Product);
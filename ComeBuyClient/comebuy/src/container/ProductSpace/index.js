import { Backdrop, Button, CircularProgress, Grid, Pagination, Stack, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BreadCrumb, FeatureSelect, FilterColumn, NavBar, ProductItem, SearchBar, SnackBarAlert } from "../../components";
import { getAllProduct } from "../../redux/slices/productSlice";
import FilterListIcon from '@mui/icons-material/FilterList';
import { getAllFeature } from "../../redux/slices/featureSlice";
import { AirbnbSlider, AirbnbThumbComponent, ExampleSlider, PrettoSlider } from "./style";
import io from "socket.io-client"

import { cartListSelector, productListSelector } from "../../redux/selectors";
import { WS_URL } from "../../constant";
import productAPI from "../../api/productAPI";
const ProductSpace = () => {
    const socket = io(WS_URL, {
        transports: ["websocket"]
    });
    const [productList, setProductList] = useState([])
    const [openSuccessAlert, setOpenSuccessAlert] = useState(false);
    const [openErrorAlert, setOpenErrorAlert] = useState(false);
    const [messageError, setMessageError] = useState("No Error")
    const [messageSuccess, setMessageSuccess] = useState("Notification")
    const [loading, setLoading] = useState(false)
    const [filterOptions, setFilterOptions] = useState({
        brand: [],
        ram: [],
        cpu: [],
        gpu: [],
        screendimension: [],
        weight: [],
        memory: [],
        year: []
    })
    const [selectedPrices, SetSelectedPrices] = useState([0, 3000])
    const [currentFeature, setCurrentFeature] = useState([])
    const [total, SetTotal] = useState(0)

    const handleFilter = (value) => {
        let newFilterOptions = Object.assign({}, filterOptions);  // Shallow copy for the reference value as object
        newFilterOptions[value.name.toLowerCase()] = value.option
        setFilterOptions(newFilterOptions)
    }

    const LoadRecords = async (offset) => {
        setLoading(true)
        const response = await productAPI.getRecordsFilter(
            Object.assign(
                filterOptions,
                { prices: selectedPrices },
                { demand: currentFeature },
                { offset: offset })
        );

        if (response.status == 200) {
            setProductList(response.data.data)
            SetTotal(response.data.total)
            setMessageSuccess("Load Product Successfully")
            setOpenSuccessAlert(true)
            setLoading(false)
        }
        else {
            console.log('Filter Failed', response)
            setMessageError("Error Load Product List")
            setOpenErrorAlert(true)
            setLoading(false)
        }
    }


    const handleClose = (event, reason) => {
        if (reason === 'clickaway')
            return;
        setOpenSuccessAlert(false);
        setOpenErrorAlert(false);
    };

    const handleSocket = () => {
        socket.on("update-new-product", (message) => {
            console.log(message);
        })
    }

    useEffect(() => {
        handleSocket()
        LoadRecords(1)
        // Load Feature
        return () => {
            setProductList({})
        }
    }, [])

    const handleFeatureChosen = (event) => {
        const {
            target: { value },
        } = event;
        setCurrentFeature(
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    return (
        <div style={{ width: '100%', height: '100%' }}>
            <Stack sx={{ width: '100%', height: '100%' }}>
                <NavBar ></NavBar>
                <Stack sx={{ pt: 2, pl: 2 }}>
                    <BreadCrumb />
                </Stack>
                <Grid container sx={{ width: '100%', height: '100%', mt: 2 }} spacing={2}>
                    <Grid item xs={3} sx={{ p: 2, backgroundColor: '#C69AD9' }}>
                        <FilterColumn getRecords={LoadRecords} changeSelectedPrices={(value) => SetSelectedPrices(value)} handleFeatureChosen={handleFeatureChosen} handleFilter={handleFilter} />
                    </Grid>
                    <Grid item xs={9} sx={{ p: 2 }}>
                        <Stack>
                            {
                                productList.length > 0 &&
                                <Stack sx={{ width: '100%' }}>
                                    <SearchBar productList={productList} />
                                </Stack>
                            }
                            <Typography variant="h6" fontWeight={'bold'} sx={{ alignSelf: 'center', m: 1 }}>Our Product</Typography>
                            <Box sx={{ backgroundColor: '#C69AD9', height: 5, width: '100%' }}></Box>
                            <Stack direction={"row"} flexWrap={"wrap"} sx={{ alignSelf: 'center', m: 2, justifyContent: 'center', alignItems: 'center' }}>
                                {
                                    productList.length > 0 ?
                                    productList.map((item, i) => (
                                        <ProductItem key={i} product={item} ></ProductItem>
                                    )) :
                                    <Typography variant="h6"> No Records</Typography>
                                }
                            </Stack>
                            {
                                Math.ceil(total / 9) > 1 &&
                                <Pagination
                                    sx={{ alignSelf: 'center', m: 1 }}
                                    count={Math.ceil(total / 9)}
                                    color="secondary"
                                    onChange={async (e) => {
                                        await LoadRecords(e.target.textContent)
                                    }}
                                />
                            }
                        </Stack>
                    </Grid>
                    <SnackBarAlert severity='success' open={openSuccessAlert} handleClose={handleClose} message={messageSuccess} />
                    <SnackBarAlert severity='error' open={openErrorAlert} handleClose={handleClose} message={messageError} />
                </Grid>
            </Stack>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </div >
    )
}

export default ProductSpace;
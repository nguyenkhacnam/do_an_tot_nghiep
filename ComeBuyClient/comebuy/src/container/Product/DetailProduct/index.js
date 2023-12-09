import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Chip, CircularProgress, Grid, Radio, Stack } from '@mui/material';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper";
import { styled } from '@mui/material/styles';
import BallotIcon from '@mui/icons-material/Ballot';
import style from './style.js'
import MemoryIcon from '@mui/icons-material/Memory';
import ScreenshotMonitorIcon from '@mui/icons-material/ScreenshotMonitor';
import InventoryIcon from '@mui/icons-material/Inventory';
import CableIcon from '@mui/icons-material/Cable';
import AutofpsSelectIcon from '@mui/icons-material/AutofpsSelect';
import ChromeReaderModeIcon from '@mui/icons-material/ChromeReaderMode';
import Battery3BarIcon from '@mui/icons-material/Battery3Bar';
import ScaleIcon from '@mui/icons-material/Scale';
import DescriptionIcon from '@mui/icons-material/Description';
import { useParams } from 'react-router';
import { useEffect, useState } from "react";
import productAPI from '../../../api/productAPI';
import { FeatureChart, NavBar, TechInforLine, BreadCrumb, BoxShopInfo, BigFooter } from '../../../components';
import DoneIcon from '@mui/icons-material/Done';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import AddTaskIcon from '@mui/icons-material/AddTask';
import InfoIcon from '@mui/icons-material/Info';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import Backdrop from '@mui/material/Backdrop';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { cartListSelector, currentUser } from '../../../redux/selectors.js';
import { useDispatch, useSelector } from 'react-redux';
import { addCart, cartSlice, updateCart } from '../../../redux/slices/cartSlice.js';
import ProductComment from '../../../components/ProductComment/index.js';
import RecommendedProductLine from '../../../components/RecommendedProductLine/index.js';
import { unwrapResult } from '@reduxjs/toolkit';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { addFavorite } from './../../../redux/slices/favoriteSlice';
import { TramRounded } from '@mui/icons-material';


const ProductImage = styled('img')({
    height: 300,
    width: 'auto',
    maxWidth: 500,
    alignSelf: 'center',
    backgroundSize: 'cover',
})
const CustomButton = styled(Button)({
    '&:hover': {
        backgroundColor: '#D93B48',
        color: 'white'
    }
})
const CustomButton1 = styled(Button)({
    '&:hover': {
        backgroundColor: 'grey',
        color: 'white'
    }
})
const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});



const DetailProduct = () => {
    const dispatch = useDispatch()
    const _cart = useSelector(cartListSelector)
    const _currentUser = useSelector(currentUser)
    const { id } = useParams()
    const [product, setProduct] = useState(null)
    const [error, setError] = useState(null)
    const [startAdding, setStartAdding] = useState(false)
    const [openBackdrop, setOpenBackdrop] = useState(false)
    const [openSnackbar, setOpenSnackbar] = React.useState(false);

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };

    const LoadData = async () => {
        const response = await productAPI.getProductWithID(id)
        if (response.status == 200)
            setProduct(response.data)
        else
            setError("Error Load Product!")
    }

    const updateAmount = async (item) => {
        try {
            const resultAction = await dispatch(updateCart(item))
            const originalPromiseResult = unwrapResult(resultAction)
            setOpenBackdrop(false)
            setOpenSnackbar(true)
        } catch (rejectedValueOrSerializedError) {
            setOpenBackdrop(false)
            alert(rejectedValueOrSerializedError);
        }
    }

    const addNewCart = async (temp) => {
        try {
            const resultAction = await dispatch(addCart(temp))
            const originalPromiseResult = unwrapResult(resultAction)
            setOpenBackdrop(false)
            setOpenSnackbar(true)
        } catch (rejectedValueOrSerializedError) {
            setOpenBackdrop(false)
            alert(rejectedValueOrSerializedError);
        }
    }
    const handleAddToFavorite = async () => {
        setOpenBackdrop(true)
        let temp = {
            productID: product.productID,
            userID: _currentUser.userID
        }
        try {
            const resultAction = await dispatch(addFavorite(temp))
            const originalPromiseResult = unwrapResult(resultAction)
            setOpenBackdrop(false)
            setOpenSnackbar(true)
            console.log(originalPromiseResult)
        } catch (rejectedValueOrSerializedError) {
            alert(rejectedValueOrSerializedError);
        }
    }

    const handleAddToCart = async () => {
        if (localStorage.getItem('role') == 'customer') {
            setOpenBackdrop(true)
            let isExisted = false;
            let newCart = [..._cart]
            if (localStorage.getItem('idUser') != '') {
                newCart = newCart.map((item) => {
                    if (item.productid == product.productID) {
                        isExisted = true
                        return {
                            "productid": product.productID,
                            "amount": item['amount'] + 1
                        }
                    }
                    else return item
                })
                dispatch(cartSlice.actions.cartListChange(newCart))
                //Update amount if cart existed
                if (isExisted === true) {
                    newCart.map((item) => {
                        if (item.productid == product.productID) {
                            updateAmount(item)
                        }
                    })
                } else {
                    newCart = [...newCart, {
                        "productid": product.productID,
                        "amount": 1
                    }]
                    dispatch(cartSlice.actions.cartListChange(newCart))
                    let temp = {
                        userID: _currentUser.userID,
                        productID: product.productID,
                        amount: 1
                    }
                    addNewCart(temp)
                }
            }
        } else {
            let isExisted = false
            let newCart = [..._cart]
            if (localStorage.getItem('idUser') == '') {
                newCart = newCart.map((item) => {
                    if (item.productid == product.productID) {
                        isExisted = true
                        return {
                            "productid": product.productID,
                            "amount": item['amount'] + 1
                        }
                    }
                    else return item
                })
                dispatch(cartSlice.actions.cartListChange(newCart))
            }
            if (!isExisted) {

                newCart = [...newCart, {
                    "productid": product.productID,
                    "amount": 1
                }]
                dispatch(cartSlice.actions.cartListChange(newCart))
            }
        }
    }


    useEffect(() => {
        LoadData()
        return () => setProduct(null);
    }, [id])

    return (
        <Stack sx={{ width: '100%', height: '100%' }}>
            <NavBar ></NavBar>
            <Stack sx={{ pt: 2, pl: 2 }}>
                <BreadCrumb />
            </Stack>
            <Grid container sx={{ width: '100%', height: '100%' }}>
                <Grid container item xs={8}>
                    {
                        product != null && error == null ?
                            <Box sx={style.boxContainer}>
                                <Box sx={style.boxInfor1}>
                                    <Grid item container>
                                        <Grid item xs={11}>
                                            <Typography xs={12} color="#152659" id="modal-modal-title" fontWeight='bold' variant="h6" component="h2">
                                                {product.name}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={1}>
                                            <Typography xs={12} color="#152659" id="modal-modal-title" fontWeight='bold' variant="h6" component="h2">
                                                {"$ " + product.price}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                    <Box sx={style.boxInfor_Line}></Box>
                                    <Grid item container>
                                        <Typography sx={{ marginBottom: 2 }} color="#152659" id="modal-modal-title" fontWeight='bold' variant="h6">
                                            Detail Images
                                        </Typography>
                                    </Grid>
                                    {
                                        product.productimage.length > 0 ?
                                            <Swiper slidesPerView={1} modules={[Pagination]} spaceBetween={30} pagination={{
                                                dynamicBullets: true,
                                            }}>
                                                {
                                                    product.productimage.map((item, i) => (
                                                        <SwiperSlide key={i}>
                                                            <Stack sx={{ width: '100%' }} >
                                                                <ProductImage src={item.imageURL}></ProductImage>
                                                            </Stack>
                                                        </SwiperSlide>
                                                    ))
                                                }
                                            </Swiper>
                                            :
                                            <Typography variant='h6' fontWeight='bold'>No Image</Typography>
                                    }
                                    <Box sx={{
                                        height: 50,
                                        backgroundColor: '#B360E6',
                                        width: '95%',
                                        borderRadius: '10px',
                                        boxShadow: 10,
                                        m: 2,
                                        padding: 1
                                    }}>
                                        <Stack direction='row' sx={{
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            paddingLeft: 1,
                                            paddingRight: 1,
                                            paddingTop: 1

                                        }}>
                                            <Stack direction='row' spacing={1}>
                                                <Typography fontWeight='bold' color='white' variant='h6'>Brand:</Typography>
                                                <Typography fontWeight='bold' color='white' variant='h6'>{product.brand}</Typography>
                                            </Stack>
                                            <Stack direction='row' spacing={1}>
                                                <Typography fontWeight='bold' color='white' variant='h6'>Origin:</Typography>
                                                <Typography fontWeight='bold' color='white' variant='h6'>{product.origin}</Typography>
                                            </Stack>
                                            <Stack direction='row' spacing={1}>
                                                <Typography fontWeight='bold' color='white' variant='h6'>Year:</Typography>
                                                <Typography fontWeight='bold' color='white' variant='h6'>2021</Typography>
                                            </Stack>
                                        </Stack>
                                    </Box>
                                    <FeatureChart data={product.feature.map(item => item.name)} />
                                    <Stack>
                                        <Typography sx={style.buttonFeature} color="white" id="modal-modal-title" fontWeight='bold' variant="body1">
                                            Feature
                                        </Typography>
                                    </Stack>
                                </Box>
                                <Box sx={style.boxInfor}>
                                    <Stack
                                        direction="row"
                                        spacing={1}
                                        padding={1}
                                        sx={style.boxInfor_Stack}>
                                        <BallotIcon />
                                        <Typography variant='h6' fontWeight='bold'>Technical Information</Typography>
                                    </Stack>
                                    <Grid container>
                                        <Grid item xs={6} paddingLeft={2}>
                                            <Stack xs={12} spacing={2} padding={2}>
                                                <TechInforLine Icon={<MemoryIcon />} Text={product.cpu} Title='CPU' />
                                                <Box sx={style.boxinfor_Stack_Line}></Box>
                                                <TechInforLine Icon={<ScreenshotMonitorIcon />} Text={product.screenDimension + ' inch, ' + product.colorCoverage + ' RGBs'} Title='Screen Dimension' />
                                                <Box sx={style.boxinfor_Stack_Line}></Box>
                                                <TechInforLine Icon={<InventoryIcon />} Text={product.memory + ' SSD'} Title='Store' />
                                                <Box sx={style.boxinfor_Stack_Line}></Box>
                                                <TechInforLine Icon={<CableIcon />} Text={product.externalIOPort} Title='External IO Port' />
                                                <Box sx={style.boxinfor_Stack_Line}></Box>
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={6} paddingLeft={2}>
                                            <Stack xs={12} spacing={2} padding={2}>
                                                <TechInforLine Icon={<AutofpsSelectIcon />} Text={product.ram + " GB"} Title='RAM' />
                                                <Box sx={style.boxinfor_Stack_Line}></Box>
                                                <TechInforLine Icon={<ChromeReaderModeIcon />} Text={product.gpu} Title="GPU" />
                                                <Box sx={style.boxinfor_Stack_Line}></Box>
                                                <TechInforLine Icon={<Battery3BarIcon />} Text={product.battery + "Whr"} Title="Battery" />
                                                <Box sx={style.boxinfor_Stack_Line}></Box>
                                                <TechInforLine Icon={<ScaleIcon />} Text={product.weight + ' kg'} Title="Weight" />
                                                <Box sx={style.boxinfor_Stack_Line}></Box>
                                            </Stack>
                                        </Grid>
                                    </Grid>
                                </Box>
                                <Box sx={style.boxDes}>
                                    <Stack
                                        direction="row"
                                        spacing={1}
                                        padding={1}
                                        sx={style.boxDes_Stack}>
                                        <DescriptionIcon />
                                        <Typography variant='h6' fontWeight='bold'>Description</Typography>
                                    </Stack>
                                    <Grid container sx={style.BoxDes_Grid} paddingLeft={4} paddingRight={4}>
                                        <Stack xs={12}>
                                            {
                                                product.productimage.length > 0 &&
                                                <ProductImage xs={12} src={product.productimage[0].imageURL}></ProductImage>
                                            }
                                            <Typography xs={12} sx={{ marginBottom: 2 }} variant='body1'>{product.description}</Typography>
                                        </Stack>
                                    </Grid>
                                </Box>

                            </Box>
                            : <Typography variant='h6'>No Data</Typography>
                    }
                </Grid>
                <Grid container item xs={4}>
                    <Box sx={style.boxHandle}>
                        {
                            product != null ?
                                <Stack>
                                    <Chip
                                        sx={{ backgroundColor: "#B3FFC9", color: 'black', fontWeight: 'bold' }}
                                        label="Comebuy is a reputable retailer in Vietnam"
                                        icon={<DoneIcon />}
                                    />
                                    <Typography variant='h6' fontWeight={'bold'} padding={1}>{product.name}</Typography>
                                    <Typography variant='body2' fontWeight={'bold'} sx={{ color: '#778899', pl: 1 }} >ID: {product.productID}</Typography>
                                    <Typography variant='h6' fontWeight={'bold'} sx={{ color: '#F23E2E', pl: 1 }} >$ {product.price}</Typography>
                                    <Box sx={{ p: 3, backgroundColor: '#FFFFF7', borderRadius: 2, boxShadow: 1, mt: 1 }}>
                                        <Chip
                                            sx={{ backgroundColor: 'inherit', color: 'black', fontWeight: 'bold' }}
                                            label="Free 1 to 1 for the first 15 days"
                                            icon={<ChangeCircleIcon color='error' />}
                                        />
                                        <Chip
                                            sx={{ backgroundColor: 'inherit', color: 'black', fontWeight: 'bold' }}
                                            label={`Support ${product.warranty}`}
                                            icon={<AddTaskIcon color='error' />}
                                        />
                                    </Box>
                                    <Stack direction="row" sx={{ alignItems: 'center' }}>
                                        <Typography variant='body1' fontWeight={'bold'} padding={1}>Version</Typography>
                                        <InfoIcon />
                                    </Stack>
                                    <Box sx={{ p: 1, backgroundColor: 'white', borderRadius: 2, boxShadow: 1, mt: 1 }}>
                                        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                                            <Radio
                                                checked={true}
                                                value="a"
                                                name="radio-buttons"
                                            />
                                            <Typography variant='body2' fontWeight={'bold'}>{product.screenDimension}", {product.colorCoverage}% RGB, {product.battery} Whr</Typography>
                                        </Stack>
                                        <Typography variant='body2' fontWeight={'bold'} sx={{ color: '#F23E2E', pl: 6 }}>${product.price}</Typography>
                                        <Stack direction="row" spacing={1} sx={{ color: '#F23E2E', pt: 1, pl: 3 }}>
                                            <Chip label="Official" color="primary" variant="outlined" />
                                            <Chip label="New Seal" color="success" variant="outlined" />
                                        </Stack>
                                    </Box>
                                    <CustomButton onClick={handleAddToCart} variant="filled" sx={{ color: 'white', backgroundColor: '#D92365', p: 1, mt: 2 }} startIcon={<AddTaskIcon />}>
                                        Add To Cart
                                    </CustomButton>
                                    {
                                        localStorage.getItem('idUser') != "" &&
                                        <CustomButton onClick={handleAddToFavorite} variant="filled" sx={{ color: 'white', backgroundColor: '#8C030E', p: 1, mt: 2 }} startIcon={<FavoriteIcon />}>
                                            Add To Favorite
                                        </CustomButton>
                                    }
                                    <CustomButton1 variant="filled" sx={{ p: 1, mt: 2, backgroundColor: 'black', color: 'white' }} startIcon={<LocalPhoneIcon />}>
                                        Hotline 0834344655
                                    </CustomButton1>
                                </Stack>
                                :
                                <Stack sx={{ width: '100%', height: '100%' }}>
                                    <CircularProgress></CircularProgress>
                                </Stack>
                        }
                    </Box>
                </Grid>
                <RecommendedProductLine productID={id} />
                <BoxShopInfo></BoxShopInfo>
                <ProductComment productID={id}></ProductComment>
                <BigFooter />
            </Grid>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={openBackdrop}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
                    Added successfully
                </Alert>
            </Snackbar>
        </Stack>
    )
}

export default DetailProduct
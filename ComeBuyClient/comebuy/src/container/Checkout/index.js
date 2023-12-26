
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux'

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { Button, Stack, Typography, Link, Breadcrumbs, TextField } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Avatar } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import DiamondIcon from '@mui/icons-material/Diamond';
import Radio from '@mui/material/Radio';
import { Slide } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

import Paypal from './../../components/Paypal/index';
import { CheckEmail, CheckPhoneNumber } from './../LoginAndRegister/ValidationDataForAccount'
import { isSignedIn_user, currentUser, cartListSelector } from '../../redux/selectors';
import { deleteCartById, getAllCart } from '../../redux/slices/cartSlice';
import { unwrapResult } from '@reduxjs/toolkit';
import { getAllProduct, getProductWithID } from '../../redux/slices/productSlice';
import { accountSlice } from '../../redux/slices/accountSlice';
import moment from 'moment'
import { addInvoice } from "../../redux/slices/invoiceSlice";
import { addInvoiceItem } from "../../redux/slices/invoiceItemSlice";
import emailApi from '../../api/emailAPI';

import logo from '../../assets/img/logoremovebg.png'
import axios from 'axios';
import './index.css'

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export const CheckoutPage = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const isSignedIn = useSelector(isSignedIn_user)

    const [isHideCompleteButton, setIsHideCompleteButton] = useState("flex")

    const [openPaymentMethodScreen, setOpenPaymentMethodScreen] = useState(false)
    const [openPayOnline, setOpenPayOnline] = useState(false)

    const [listCart, setListCart] = useState([])
    console.log("🚀 ~ file: index.js:63 ~ CheckoutPage ~ listCart:", listCart)
    const [listProd, setListProd] = useState([])
    console.log("🚀 ~ file: index.js:64 ~ CheckoutPage ~ listProd:", listProd)

    const [discount, setDiscount] = useState(0)
    const [typeCus, setTypeCus] = useState('Rare member')

    const _guestCart = useSelector(cartListSelector)

    const [selectedPayMethod, setSelectedPayMethod] = useState("Pay on delivery");
    const handleChangePayMethod = (event) => {
        if (event.target.value === 'Pay online') {
            setOpenPayOnline(true)
            setIsHideCompleteButton("none")
            setSelectedPayMethod(event.target.value);
        } else {
            setOpenPayOnline(false)
            setIsHideCompleteButton("flex")
            setSelectedPayMethod(event.target.value);
            MakePurchaseUnit()
        }
    };

    useEffect(() => {
        const fetchYourCart = async () => {
            if (localStorage.getItem('role') === 'customer') {
                let temp = []
                let listCart = []
                let listProd = []
                try {
                    const resultAction = await dispatch(getAllCart())
                    const originalPromiseResult = unwrapResult(resultAction)
                    temp = originalPromiseResult
                    for (let i = 0; i < temp?.length; i++) {
                        if (temp[i].userid === _currentUser.userID) {
                            listCart.push(temp[i])
                            const resultAction2 = await dispatch(getProductWithID(temp[i].productid))
                            const originalPromiseResult2 = unwrapResult(resultAction2)
                            listProd.push(originalPromiseResult2)
                        }
                    }
                    await setListCart(listCart.filter(item => item.amount > 0))
                    await setListProd(listProd)
                    await CountTotal(listCart, listProd)
                    await MakePurchaseUnit(listCart, listProd)
                } catch (rejectedValueOrSerializedError) {
                    alert(rejectedValueOrSerializedError)
                }
            } else {
                let temp = _guestCart
                let listCart = []
                let listProd = []
                for (let i = 0; i < temp?.length; i++) {
                    if (temp.productid != 'undefined') {
                        listCart.push(temp[i])
                        const resultAction2 = await dispatch(getProductWithID(temp[i].productid))
                        const originalPromiseResult2 = unwrapResult(resultAction2)
                        listProd.push(originalPromiseResult2)
                    }
                }
                await setListCart(listCart)
                await setListProd(listProd)
                await CountSubTotal(listCart, listProd)
                await MakePurchaseUnit(listCart, listProd)
            }
        }
        fetchYourCart()
    }, [])

    useEffect(() => {
        const Identify = () => {
            if (localStorage.getItem('role') === 'customer') {
                if (_currentUser.score < 2000) {
                    setDiscount(0)
                    setTypeCus("Rare Member")
                } else if (_currentUser.score >= 2000 && _currentUser.score < 5000) {
                    setDiscount(10)
                    setTypeCus("Silver Member")
                } else if (_currentUser.score >= 5000 && _currentUser.score < 20000) {
                    setDiscount(20)
                    setTypeCus("Golden Member")
                } else {
                    setDiscount(30)
                    setTypeCus("Diamond Member")
                }
            } else {
                setDiscount(0)
            }
        }
        if (discount === 0) {
            Identify()
        }

    }, [])

    const [purchaseUnits, setPurchaseUnits] = useState([])

    const MakePurchaseUnit = async (listCart, listProd) => {
        if (localStorage.getItem('role') === 'customer') {
            let sample = []
            let unitAmountObj = {
                currency_code: "USD",
                value: " " //price
            }

            for (let i = 0; i < listCart?.length; i++) {
                for (let j = 0; j < listProd?.length; j++) {
                    if (listProd[j].productID === listCart[i].productid) {
                        // amountObj = {
                        //     ...amountObj,
                        //     value: (Number(listCart[i].amount) * Number(listProd[j].price)) - Number(listCart[i].amount) * Number(listProd[j].price) * discount / 100
                        // }
                        unitAmountObj = {
                            ...unitAmountObj,
                            value: Number(listProd[j].price)
                        }
                        let temp = {
                            name: listProd[j].name,
                            unit_amount: unitAmountObj,
                            quantity: listCart[i].amount
                        }
                        sample.push(temp)
                    }
                }
            }
            setPurchaseUnits(...purchaseUnits, sample)
        } else {
            let sample = []
            let unitAmountObj = {
                currency_code: "USD",
                value: " " //price
            }

            for (let i = 0; i < listCart?.length; i++) {
                for (let j = 0; j < listProd?.length; j++) {
                    if (listProd[j].productID === listCart[i].productid) {
                        unitAmountObj = {
                            ...unitAmountObj,
                            value: Number(listProd[j].price)
                        }
                        let temp = {
                            name: listProd[j].name,
                            unit_amount: unitAmountObj,
                            quantity: listCart[i].amount
                        }
                        sample.push(temp)
                    }
                }
            }
            setPurchaseUnits(...purchaseUnits, sample)
        }

    }


    const [subTotal, setSubTotal] = useState(0)
    const CountTotal = async (_cart, prList) => {
        let newTotal = 0
        await _cart.map((item) => {
            let rs = prList.find((ite) => ite.productID == item.productid)
            if (rs != undefined)
                newTotal = newTotal + Number(Number(rs.price) * Number(item.amount))
        })
        // let t = newTotal - (newTotal * discount) / 100
        // let t2 = t + 2

        // await setSubTotal(t)
        // await setLastTotal(t2)
        setSubTotal(newTotal)
    }

    const CountSubTotal = async (_cart, prList) => {
        let newTotal = 0
        await _cart.map((item) => {
            let rs = prList.find((ite) => ite.productID == item.productid)
            if (rs != undefined)
                newTotal = newTotal + Number(Number(rs.price) * Number(item.amount))
        })
        setSubTotal(newTotal)
    }

    //for snackbar
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenSnackbar(false);
    };

    //for snackbar 2
    const [openSnackbar2, setOpenSnackbar2] = useState(false);
    const handleCloseSnackbar2 = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenSnackbar2(false);
    };

    //for customer is member
    const _currentUser = useSelector(currentUser)
    const [name, setName] = useState(_currentUser.name)
    const [phoneNumber, setPhoneNumber] = useState(_currentUser.phoneNumber)

    //for guest
    const [guestName, setGuestName] = useState('')
    const [guestPhoneNum, setGuestPhoneNum] = useState('')
    const [email, setEmail] = useState('')

    //general information
    const [addressShip, setAddressShip] = useState('')

    const [province, setProvince] = useState({})
    const [provinceList, setProvinceList] = useState([])

    const [district, setDistrict] = useState({})
    const [districtList, setDistrictList] = useState([])

    const [commune, setCommune] = useState({})
    const [communeList, setCommuneList] = useState([])

    const [bigAddress, setBigAddress] = useState('')

    //get province
    useEffect(() => {
        const getProvinceList = async () => {
            // const resProvince = await fetch('https://sheltered-anchorage-60344.herokuapp.com/province')
            const resProvince = await axios.get('https://vapi.vnappmob.com/api/province')
            setProvinceList(resProvince.data.results)
            // const resProv = resProvince.json()
            // setProvinceList(await resProv)
        }
        getProvinceList()
    }, [])

    function handleChangeProvince(event) {
        setProvince(event.target.value)
    }
    //get district
    useEffect(() => {
        const getDistrict = async () => {
            // const resDistrict = await fetch(`https://sheltered-anchorage-60344.herokuapp.com/district/?idProvince=${province.idProvince}`)
            const resDistrict = await axios.get(`https://vapi.vnappmob.com/api/province/district/${province?.province_id}`)
            setDistrictList(resDistrict.data.results)
            // const resDis = resDistrict.json()
            // setDistrictList(await resDis)
        }
        getDistrict()
    }, [province])

    function handleChangeDistrict(event) {
        setDistrict(event.target.value)
    }

    //get commune
    useEffect(() => {
        const getCommune = async () => {
            const reCommune = await axios.get(`https://vapi.vnappmob.com/api/province/ward/${district?.district_id}`)
            // const resCom = reCommune.json()
            setCommuneList(reCommune.data.results)
            // setCommuneList(await resCom)
        }
        getCommune()
    }, [district])

    async function handleChangeCommune(event) {
        setCommune(event.target.value)
    }

    function handleClickToCart(event) {
        event.preventDefault();
        if (localStorage.getItem('role') === 'customer') {
            navigate('/myplace/mycart')
        } else {
            navigate('/guestCart')
        }
    }

    const handleLogOut = () => {
        dispatch(accountSlice.actions.logout());
        localStorage.setItem('role', '')
        localStorage.setItem('idUser', '')
        localStorage.setItem('cart', JSON.stringify([]));
        navigate(0)
    }

    const handleChangeAddress = async (e) => {
        setAddressShip(e.target.value)
    }

    const handleToPayment = async () => {
        if (name === '' || phoneNumber === '' || addressShip === '') {
            setOpenSnackbar(true)
        } else {
            if (province === null || district === null && commune === null) {
                setOpenSnackbar(true)
            } else {
                const temp = addressShip + ', ' + commune.ward_name + ', ' + district.district_name + ', ' + province.province_name
                setBigAddress(temp)
                setOpenPaymentMethodScreen(true)
                // await MakePurchaseUnit()
                // console.log(purchaseUnits)
            }
        }
    }

    const [openConfirm, setOpenConfirm] = useState(false);
    const handleCloseConfirm = () => {
        setOpenConfirm(false);
    };
    const handleCompleteOrder = () => {
        setOpenConfirm(true)
    }

    const [placedOrderSuccessfully, setPlacedOrderSuccessfully] = useState(false)

    const handleClosePlacedOrderSuccessfully = () => {
        setPlacedOrderSuccessfully(false)
        navigate('/')
    }

    const [openBackdrop, setOpenBackdrop] = useState(false);
    const handleCloseBackdrop = async () => {
        handleCloseConfirm()
        if (localStorage.getItem('role') === "customer") {
            for (let i = 0; i < listCart?.length; i++) {
                try {
                    const resultAction = await dispatch(deleteCartById(listCart[i]))
                    const originalPromiseResult = unwrapResult(resultAction)
                } catch (rejectedValueOrSerializedError) {
                    alert(rejectedValueOrSerializedError);
                }
            }
        } else {
            localStorage.setItem('cart', JSON.stringify([]));
        }
        setOpenBackdrop(false);
        setPlacedOrderSuccessfully(true)
    };

    const handleAgreeCOD = () => {
        setOpenBackdrop(true)
        MakeInvoice();
    }

    const [invoiceId, setInvoiceId] = useState(' ')

    const MakeInvoice = async () => {
        var m = moment().format('H mm')
        var date = moment().format('D/M/YYYY')
        let tempID = ''
        if (localStorage.getItem('role') === "customer") {
            let temp = {
                moneyReceived: '0',
                isChecked: false,
                isPaid: false,
                date: date + ' ' + m,
                address: bigAddress,
                userID: _currentUser.userID,
                branchID: '9ef0b2b9-9920-4d15-982c-c4a4209700cd'
            }

            try {
                const resultAction = await dispatch(addInvoice(temp))
                const originalPromiseResult = unwrapResult(resultAction)
                console.log("🚀 ~ file: index.js:428 ~ MakeInvoice ~ originalPromiseResult:", originalPromiseResult)
                setInvoiceId(originalPromiseResult.data.data.invoiceID)
            } catch (rejectedValueOrSerializedError) {
                alert(rejectedValueOrSerializedError)
            }
        } else {
            let temp = {
                moneyReceived: "0",
                isChecked: false,
                isPaid: false,
                date: date + ' ' + m,
                address: bigAddress,
                userID: "49d42e91-39e3-4879-a3b0-76b3315f9e38",
                branchID: '9ef0b2b9-9920-4d15-982c-c4a4209700cd'
            }

            try {
                const resultAction = await dispatch(addInvoice(temp))
                const originalPromiseResult = unwrapResult(resultAction)
                setInvoiceId(originalPromiseResult.data.invoiceID)
            } catch (rejectedValueOrSerializedError) {
                alert(rejectedValueOrSerializedError)
            }
        }

    }

    useEffect(() => {
        const fetchData = async () => {
            console.log('buoc1')
            if (invoiceId !== ' ') {
                console.log('buoc1', invoiceId)
                _addInvoiceItem(invoiceId)
            }
        }
        fetchData()
    }, [invoiceId])

    const _addInvoiceItem = async (_invoiceId) => {
        console.log('buoc1')
        let stringOrder = ''
        for (let i = 0; i < listCart?.length; i++) {
            for (let j = 0; j < listProd?.length; j++) {
                if (listCart[i].productid === listProd[j].productID) {
                    let item = {
                        invoiceID: _invoiceId,
                        productID: listProd[j].productID,
                        amount: listCart[i].amount,
                        total: Number(listCart[i].amount) * Number(listProd[j].price)
                    }
                    console.log("🚀 ~ file: index.js:474 ~ const_addInvoiceItem= ~ item:", item)
                    stringOrder = stringOrder + "\n" + `${listProd[j].name} - Số lượng: ${listCart[i].amount} - Giá tiền: ${item.total} VND `
                    // t.push(item)
                    try {
                        console.log('buoc1')
                        const resultAction = await dispatch(addInvoiceItem(item))
                        const originalPromiseResult = unwrapResult(resultAction)
                    } catch (rejectedValueOrSerializedError) {
                        console.log(rejectedValueOrSerializedError)
                    }
                }
            }
        }

        if (localStorage.getItem('role') === "customer") {
            emailApi.sendOrder({
                to: _currentUser.email,
                subject: "Thông tin đơn hàng của bạn tại ComeBuy",
                text: "Cảm ơn bạn đã đặt hàng trên trang ComeBuy. \n" +
                    "Đơn hàng của bạn: \n" +
                    `Tên người mua: ${_currentUser.name} \n` +
                    `Số điện thoại: ${_currentUser.phoneNumber} \n` +
                    `Địa chỉ nhận hàng: ${bigAddress}` + "\n" +
                    "-------------------------------------------------------- \n" +
                    stringOrder + "\n" +
                    "-------------------------------------------------------- \n" +
                    `Tổng tiền: ${subTotal} VND` + "\n" +
                    "-------------------------------------------------------- \n" +
                    "Có điều gì thắc mắc không? Vui lòng liên hệ với cửa hàng của chúng tôi theo địa chỉ liên hệ bên dưới: ComeBuy.com"
            }).then(data => {
                handleCloseBackdrop()
            })
                .catch(err => console.log(err))
        } else {
            emailApi.sendOrder({
                to: email,
                subject: "Thông tin đặt hàng của bạn",
                text: "Cảm ơn bạn đã đặt hàng trên trang ComeBuy. \n" +
                    "Đơn hàng của bạn: \n" +
                    `Tên người mua: ${guestName} \n` +
                    `Số điện thoại: ${guestPhoneNum} \n` +
                    `Địa chỉ nhận hàng: ${bigAddress}` + "\n" +
                    "-------------------------------------------------------- \n" +
                    stringOrder + "\n" +
                    "-------------------------------------------------------- \n" +
                    `Total: ${subTotal} VND` + "\n" +
                    "-------------------------------------------------------- \n" +
                    "Có điều gì thắc mắc không? Vui lòng liên hệ với cửa hàng của chúng tôi theo địa chỉ liên hệ bên dưới: ComeBuy.com"
            }).then(data => {
                handleCloseBackdrop()
            })
                .catch(err => console.log(err))
        }
    }


    const handlePaymentGuest = () => {
        if (guestName === '' || guestPhoneNum === '' || addressShip === '' || email === '') {
            setOpenSnackbar(true)
        } else {
            if (province != null && district != null && commune != null) {
                setOpenSnackbar(true)
            } else {
                if (CheckEmail(email) && CheckPhoneNumber(guestPhoneNum)) {
                    alert("Move to payment method")
                } else {
                    setOpenSnackbar2(true)
                }
            }
        }
    }

    const breadcrumbs = [
        <Link
            underline="hover"
            key="2"
            style={{
                display: 'inline-block',
                fontSize: '0.85714em',
                color: '#338dbc',
                lineHeight: '1.3em',
                cursor: 'pointer'
            }}
            onClick={handleClickToCart}
        >
            Giỏ hàng
        </Link>,
        <Typography
            key="2"
            style={{
                display: 'inline-block',
                fontSize: '0.85714em',
                color: '#000D0A',
                lineHeight: '1.3em',
                fontFamily: 'sans-serif'
            }}
        >
            Thông tin giỏ hàng
        </Typography>,
        <Typography key="3"
            style={{
                display: 'inline-block',
                fontSize: '0.85714em',
                color: '#999999',
                lineHeight: '1.3em',
                fontFamily: 'sans-serif'
            }}>
            Thanh toán
        </Typography>,
    ];

    const handleClosePaymentMethodScreen = () => {
        setAddressShip('')
        setProvince(null)
        setDistrict(null)
        setCommune(null)
        setOpenPaymentMethodScreen(false)
    }
    const breadcrumbsPayment = [
        <Link
            underline="hover"
            key="2"
            style={{
                display: 'inline-block',
                fontSize: '0.85714em',
                color: '#338dbc',
                lineHeight: '1.3em',
                cursor: 'pointer'
            }}
            onClick={handleClickToCart}
        >
            Giỏ hàng
        </Link>,
        <Link
            underline="hover"
            key="2"
            style={{
                display: 'inline-block',
                fontSize: '0.85714em',
                color: '#338dbc',
                lineHeight: '1.3em',
                fontFamily: 'sans-serif',
                cursor: 'pointer'
            }}
            onClick={handleClosePaymentMethodScreen}
        >
            Thông tin giỏ hàng
        </Link>,
        <Typography key="3"
            style={{
                display: 'inline-block',
                fontSize: '0.85714em',
                color: '#000D0A',
                lineHeight: '1.3em',
                fontFamily: 'sans-serif'
            }}>
            Phương thức thanh toán
        </Typography>,
    ];

    return (
        <Grid container
            sx={{
                width: '100%',
                height: '100%',
                position: 'absolute',
                backgroundColor: 'white',
                resize: 'none',
            }}
            spacing={2}
        >
            {/* Cart information part */}

            {openPaymentMethodScreen ? (
                <Grid item xs={7} height="100%" >
                    <Stack direction="column" spacing={2} p="2rem" paddingLeft="12em">
                        <Stack direction="column"
                            sx={{
                                paddingBottom: '1em',
                                display: 'block'
                            }}>
                            <Button
                                sx={{
                                    marginLeft: '-1.2%',
                                    color: '#333333',
                                    fontSize: '2em',
                                    fontWeight: 'normal',
                                    lineHeight: '1em',
                                    display: 'block',
                                    marginBlockStart: '0.67em',
                                    marginBlockEnd: '0.67em',
                                    background: 'white !important',
                                    fontFamily: 'sans-serif'
                                }}
                                onClick={() => navigate('/')}
                            >
                                ComeBuy
                            </Button>
                            <Stack direction="row"
                                sx={{
                                    marginTop: '-2%',
                                    listStyleType: 'none',
                                    display: 'block',
                                    marginBlockEnd: '1em',
                                }}
                            >
                                <Breadcrumbs separator="›" style={{ color: '#000D0A' }} aria-label="breadcrumb">
                                    {breadcrumbsPayment}
                                </Breadcrumbs>
                            </Stack>
                            <Stack marginTop="-3%">
                                <Typography
                                    sx={{
                                        color: '#333333',
                                        fontSize: '1.28571em',
                                        fontWeight: 'normal',
                                        lineHeight: '1em',
                                        marginBlockStart: '0.83em',
                                        marginBlockEnd: '0.83em',
                                        display: 'block',
                                        fontFamily: 'sans-serif',
                                        margin: '40px 0'
                                    }}
                                >
                                    Phương thức vận chuyển
                                </Typography>
                            </Stack>
                            <Stack direction="row"
                                sx={{
                                    height: '2.5em',
                                    backgroundColor: '#fafafa',
                                    width: '97%',
                                    borderWidth: '1px',
                                    borderRadius: '8px',
                                    padding: '0.5em',
                                    justifyContent: 'space-between',
                                    marginTop: '0.25em'
                                }}>
                                <Stack direction="row" sx={{ marginTop: '0.5em' }}>
                                    <Radio
                                        checked
                                        value="1"
                                        name="radio-buttons"
                                        sx={{ marginTop: '-0.5em' }}
                                    />
                                    <Typography>Giao hàng khắp 64 tỉnh thành</Typography>
                                </Stack>
                                <Stack sx={{ marginTop: '0.55em' }}>
                                    <Typography>30,000₫</Typography>
                                </Stack>
                            </Stack>
                            <Stack marginTop="2em">
                                <Typography
                                    sx={{
                                        color: '#333333',
                                        fontSize: '1.28571em',
                                        fontWeight: 'normal',
                                        lineHeight: '1em',
                                        marginBlockStart: '0.83em',
                                        marginBlockEnd: '0.83em',
                                        display: 'block',
                                        fontFamily: 'sans-serif'
                                    }}
                                >
                                    Phương thức thanh toán
                                </Typography>
                            </Stack>
                            <Stack direction="row"
                                sx={{
                                    height: 'auto',
                                    backgroundColor: '#fafafa',
                                    width: '97%',
                                    borderWidth: '1px',
                                    borderRadius: '8px',
                                    padding: '1.15em',
                                    marginTop: '0.25em'
                                }}>
                                <Radio
                                    checked={selectedPayMethod === 'Pay on delivery'}
                                    onChange={handleChangePayMethod}
                                    value="Pay on delivery"
                                    name="radio-buttons"
                                    size="medium"
                                />
                                <img style={{
                                    marginRight: '10px',
                                    display: 'flex',
                                    alignSelf: 'center',
                                    width: '50px',
                                    height: '50px'
                                }}
                                    src="https://hstatic.net/0/0/global/design/seller/image/payment/cod.svg?v=1"
                                />
                                <Typography sx={{ marginTop: '0.5em' }}>Thanh toán khi giao hàng</Typography>
                            </Stack>

                            <Stack direction="column"
                                sx={{
                                    height: 'auto',
                                    backgroundColor: '#fafafa',
                                    width: '97%',
                                    borderWidth: '1px',
                                    borderRadius: '8px',
                                    padding: '1.15em',
                                    marginTop: '0.25em'
                                }}>
                                <Stack direction="row">
                                    <Radio
                                        checked={selectedPayMethod === 'Pay online'}
                                        onChange={handleChangePayMethod}
                                        value="Pay online"
                                        name="radio-buttons"
                                        size="medium"
                                    />
                                    <img style={{
                                        marginRight: '10px',
                                        display: 'flex',
                                        alignSelf: 'center',
                                        width: '50px',
                                        height: '50px'
                                    }}
                                        src="https://hstatic.net/0/0/global/design/seller/image/payment/other.svg?v=1"
                                    />
                                    <Typography sx={{ marginTop: '0.5em' }}>Thanh toán trực tuyến</Typography>
                                </Stack>
                                {openPayOnline ? (
                                    <>
                                        <hr style={{ height: '1px', width: '100%', backgroundColor: 'black' }}></hr>
                                        {/* <Typography sx={{
                                            textAlign: 'center',
                                            whiteSpace: 'pre-line',
                                            paddingLeft: '2em',
                                            paddingRight: '2em',
                                            color: '#737373',
                                            fontSize: '14px'
                                        }}
                                        >
                                            BIDV -
                                            NGUYEN KHAC NAM -
                                            Bank Account Number: 1234567896 -
                                            Transfer content : Your name-Phone number-Product ID
                                        </Typography> */}

                                        {/* <Typography sx={{
                                            textAlign: 'center',
                                            whiteSpace: 'pre-line',
                                            paddingLeft: '2em',
                                            paddingRight: '2em',
                                            color: '#737373',
                                            fontSize: '14px',
                                            fontWeight: 'bold',
                                            marginTop: '1.2em'
                                        }}
                                        >
                                            OR:
                                        </Typography> */}
                                        <div style={{ width: '50%', marginTop: '1.2em', alignSelf: 'center' }}>
                                            <Paypal _discount={discount} _lastTotal={subTotal} _bigAddress={bigAddress} _guestEmail={email} _guestName={guestName} _guestPhoneNumber={guestPhoneNum} cartList={listCart} prodList={listProd} purchases={purchaseUnits} />
                                        </div>
                                    </>
                                ) : (null)}
                            </Stack>

                            <Grid spacing={2} container sx={{ width: '100%', position: 'relative', marginTop: '2rem' }} className='custom-payment-done'>
                                <Grid item xs={6}>
                                    <a onClick={handleClosePaymentMethodScreen}
                                        style={{
                                            textDecoration: 'none',
                                            color: '#338dbc',
                                            transition: 'color 0.2s ease-in-out',
                                            display: 'inline-block',
                                            cursor: 'pointer',
                                            fontSize: '14px',
                                            fontFamily: 'sans-serif',
                                            lineHeight: '1.5em',
                                            marginLeft: '1.2em'
                                        }}
                                    >
                                       Trở lại thông tin thanh toán
                                    </a>
                                </Grid>
                                <Grid item xs={6}>
                                    <Button onClick={handleCompleteOrder} variant="contained" sx={{ backgroundColor: 'black', fontSize: '13px', display: `${isHideCompleteButton}` }} size="large" style={{
                                        // backgroundColor: '#b360e6'
                                    }}>
                                        Thanh toán khi giao hàng
                                    </Button>
                                </Grid>
                            </Grid>
                        </Stack>
                    </Stack>
                </Grid>
            ) : (
                localStorage.getItem('role') === 'customer' ? (
                    <Grid item xs={7} height="100%" className='custom-payment'>
                        <Stack direction="column" spacing={2} p="2rem" paddingLeft="12em">
                            <Stack direction="column"
                                sx={{
                                    paddingBottom: '1em',
                                    display: 'block'
                                }}>
                                <Button
                                    sx={{
                                        marginLeft: '-1.2%',
                                        color: '#333333',
                                        fontSize: '2em',
                                        fontWeight: 'normal',
                                        lineHeight: '1em',
                                        display: 'block',
                                        marginBlockStart: '0.67em',
                                        marginBlockEnd: '0.67em',
                                        background: 'white !important',
                                        fontFamily: 'sans-serif'
                                    }}
                                    onClick={() => navigate('/')}
                                >
                                    ComeBuy
                                </Button>
                                <Stack direction="row"
                                    sx={{
                                        marginTop: '-2%',
                                        listStyleType: 'none',
                                        display: 'block',
                                        marginBlockEnd: '1em',
                                    }}
                                >
                                    <Breadcrumbs separator="›" style={{ color: '#000D0A' }} aria-label="breadcrumb">
                                        {breadcrumbs}
                                    </Breadcrumbs>
                                </Stack>
                                <Stack marginTop="-3%">
                                    <Typography
                                        sx={{
                                            color: '#333333',
                                            fontSize: '1.28571em',
                                            fontWeight: 'normal',
                                            lineHeight: '1em',
                                            marginBlockStart: '0.83em',
                                            marginBlockEnd: '0.83em',
                                            display: 'block',
                                            fontFamily: 'sans-serif',
                                            margin: '40px 0'
                                        }}
                                    >
                                        Thông tin thanh toán sản phẩm
                                    </Typography>
                                </Stack>
                                <Stack direction="row" sx={{ width: '100%', position: 'relative' }} >
                                    <Avatar sx={{ height: '70px', width: '70px' }} alt="" src={_currentUser.avatar} />
                                    <Stack direction="column" marginLeft="0.1em">
                                        <p
                                            style={{
                                                marginBlockStart: '1em',
                                                marginBlockEnd: '1em',
                                                display: 'block',
                                                marginBottom: '0.75em',
                                                lineHeight: '1.5em',
                                                fontSize: '14px',
                                                fontFamily: 'sans-serif',
                                                marginTop: '0.1%',
                                                marginLeft: '1.2em'
                                            }}
                                        >{_currentUser.name} ({_currentUser.email})</p>
                                        <a
                                            onClick={handleLogOut}
                                            style={{
                                                textDecoration: 'none',
                                                color: '#338dbc',
                                                transition: 'color 0.2s ease-in-out',
                                                display: 'inline-block',
                                                cursor: 'pointer',
                                                fontSize: '14px',
                                                fontFamily: 'sans-serif',
                                                lineHeight: '1.5em',
                                                marginLeft: '1.2em',
                                                display: 'none'
                                            }}
                                        >
                                            Log out
                                        </a>
                                    </Stack>
                                </Stack>
                                <TextField
                                    fullWidth
                                    id="outlined-basic"
                                    label={_currentUser.name != '' ? null : 'Full name'}
                                    variant="outlined"
                                    sx={{
                                        color: '#333333',
                                        fontFamily: 'sans-serif',
                                        marginTop: '1em'
                                    }}
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                                <TextField
                                    fullWidth
                                    id="outlined-basic"
                                    label={_currentUser.phoneNumber != '' ? null : 'Phone number'}
                                    variant="outlined"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    sx={{
                                        color: '#333333',
                                        fontFamily: 'sans-serif',
                                        marginTop: '1.2rem'
                                    }} />
                                <TextField
                                    fullWidth
                                    id="outlined-basic"
                                    label="Nhập địa chỉ"
                                    variant="outlined"
                                    onChange={handleChangeAddress}
                                    sx={{
                                        color: '#333333',
                                        fontFamily: 'sans-serif',
                                        marginTop: '1.3rem'
                                    }}
                                />
                                <Grid spacing={2} container sx={{ width: '100%', position: 'relative', marginTop: '1em' }}>
                                    <Grid item xs={4}>
                                        <FormControl fullWidth>
                                            <InputLabel id="demo-simple-select-label">Tỉnh/Thành phố</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={province}
                                                label="Tỉnh/Thành phố"
                                                onChange={handleChangeProvince}
                                            >
                                                {provinceList?.map((province) => (
                                                    <MenuItem value={province}>{province.province_name}</MenuItem>
                                                )
                                                )}
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={4}>
                                        <FormControl fullWidth>
                                            <InputLabel id="demo-simple-select-label">Quận/Huyện</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={district}
                                                label="Quận/Huyện"
                                                onChange={handleChangeDistrict}
                                            >
                                                {districtList?.map((district) => (
                                                    <MenuItem value={district}>{district.district_name}</MenuItem>
                                                )
                                                )}
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={4}>
                                        <FormControl fullWidth>
                                            <InputLabel id="demo-simple-select-label">Xã/Phường</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={commune}
                                                label="Xã/Phường"
                                                onChange={handleChangeCommune}
                                            >
                                                {communeList?.map((commune) => (
                                                    <MenuItem value={commune}>{commune.ward_name}</MenuItem>
                                                )
                                                )}
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    <Grid spacing={2} container sx={{ width: '100%', position: 'relative', marginTop: '2rem', alignItems: 'center' }}>
                                        <Grid item xs={6}>
                                            <a onClick={() => navigate('/myplace/mycart')}
                                                style={{
                                                    textDecoration: 'none',
                                                    color: '#338dbc',
                                                    transition: 'color 0.2s ease-in-out',
                                                    display: 'inline-block',
                                                    cursor: 'pointer',
                                                    fontSize: '14px',
                                                    fontFamily: 'sans-serif',
                                                    lineHeight: '1.5em',
                                                    marginLeft: '-0.8em'
                                                }}
                                            >
                                                Quay lại giỏ hàng
                                            </a>
                                        </Grid>
                                        <Grid item xs={6} style={{
                                            marginRight: '-20px'
                                        }}>
                                            <Button onClick={handleToPayment} variant="contained" sx={{ fontSize: '14px' }} size="large" style={{
                                                backgroundColor: '#1976d2'
                                            }}>
                                                Tiếp tục Thanh toán sản phẩm
                                            </Button>
                                        </Grid>
                                    </Grid>

                                </Grid>
                            </Stack>
                        </Stack>
                    </Grid>
                ) : (
                    // Guest
                    <Grid item xs={7} height="100%" >
                        <Stack direction="column" spacing={2} p="2rem" paddingLeft="12em">
                            <Stack direction="column"
                                sx={{
                                    paddingBottom: '1em',
                                    display: 'block'
                                }}>
                                <Button
                                    onClick={() => navigate('/')}
                                    sx={{
                                        marginLeft: '-1.2%',
                                        color: '#333333',
                                        fontSize: '2em',
                                        fontWeight: 'normal',
                                        lineHeight: '1em',
                                        display: 'block',
                                        marginBlockStart: '0.67em',
                                        marginBlockEnd: '0.67em',
                                        background: 'white !important',
                                        fontFamily: 'sans-serif'
                                    }}

                                >ComeBuy
                                </Button>
                                <Stack direction="row"
                                    sx={{
                                        marginTop: '-2%',
                                        listStyleType: 'none',
                                        display: 'block',
                                        marginBlockEnd: '1em',
                                    }}
                                >
                                    <Breadcrumbs separator="›" style={{ color: '#000D0A' }} aria-label="breadcrumb">
                                        {breadcrumbs}
                                    </Breadcrumbs>
                                </Stack>
                                <Stack marginTop="-3%">
                                    <Typography
                                        sx={{
                                            color: '#333333',
                                            fontSize: '1.28571em',
                                            fontWeight: 'normal',
                                            lineHeight: '1em',
                                            marginBlockStart: '0.83em',
                                            marginBlockEnd: '0.83em',
                                            display: 'block',
                                            fontFamily: 'sans-serif'
                                        }}
                                    >
                                        Cart Information
                                    </Typography>
                                </Stack>
                                <p
                                    style={{
                                        marginBlockStart: '1em',
                                        marginBlockEnd: '1em',
                                        display: 'block',
                                        marginBottom: '0.75em',
                                        lineHeight: '1.5em',
                                        fontSize: '14px',
                                        fontFamily: 'sans-serif',
                                        marginTop: '0.1%'
                                    }}
                                >
                                    Did you have an account ?
                                    <a onClick={() => navigate('/login')}
                                        style={{
                                            textDecoration: 'none',
                                            color: '#338dbc',
                                            transition: 'color 0.2s ease-in-out',
                                            display: 'inline-block',
                                            cursor: 'pointer',
                                            fontSize: '14px',
                                            fontFamily: 'sans-serif',
                                            lineHeight: '1.5em',
                                            marginLeft: '0.5%'
                                        }}
                                    >
                                        Sign in
                                    </a>
                                </p>
                                <TextField
                                    fullWidth
                                    id="outlined-basic"
                                    label="Full name"
                                    variant="outlined"
                                    value={guestName}
                                    onChange={(e) => setGuestName(e.target.value)}
                                    sx={{
                                        color: '#333333',
                                        fontFamily: 'sans-serif',
                                        marginTop: '1em'
                                    }}
                                />
                                <Grid spacing={2} container sx={{ width: '100%', position: 'relative', marginTop: '0.25rem' }}>
                                    <Grid item xs={8}>
                                        <TextField
                                            fullWidth
                                            id="outlined-basic"
                                            label="Email"
                                            variant="outlined"
                                            onChange={(e) => setEmail(e.target.value)}
                                            sx={{
                                                color: '#333333',
                                                fontFamily: 'sans-serif',
                                            }}
                                        />
                                    </Grid>

                                    <Grid item xs={4}>
                                        <TextField
                                            fullWidth
                                            id="outlined-basic"
                                            label="Phone number"
                                            variant="outlined"
                                            onChange={(e) => setGuestPhoneNum(e.target.value)}
                                            sx={{
                                                color: '#333333',
                                                fontFamily: 'sans-serif',
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                                <TextField
                                    fullWidth
                                    id="outlined-basic"
                                    label="Your address"
                                    variant="outlined"
                                    onChange={handleChangeAddress}
                                    sx={{
                                        color: '#333333',
                                        fontFamily: 'sans-serif',
                                        marginTop: '1.3rem'
                                    }}
                                />
                                <Grid spacing={2} container sx={{ width: '100%', position: 'relative', marginTop: '1em' }}>
                                    <Grid item xs={4}>
                                        <FormControl fullWidth>
                                            <InputLabel id="demo-simple-select-label">City/Province</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={province}
                                                label="Province/City"
                                                onChange={handleChangeProvince}
                                            >
                                                {provinceList?.map((province) => (
                                                    <MenuItem value={province}>{province.province_name}</MenuItem>
                                                )
                                                )}
                                            </Select>
                                        </FormControl>

                                    </Grid>

                                    <Grid item xs={4}>
                                        <FormControl fullWidth>
                                            <InputLabel id="demo-simple-select-label">District</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={district}
                                                label="District"
                                                onChange={handleChangeDistrict}
                                            >
                                                {districtList?.map((district) => (
                                                    <MenuItem value={district}>{district.district_name}</MenuItem>
                                                )
                                                )}
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={4}>
                                        <FormControl fullWidth>
                                            <InputLabel id="demo-simple-select-label">Commune</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={commune}
                                                label="Commune"
                                                onChange={handleChangeCommune}
                                            >
                                                {communeList?.map((commune) => (
                                                    <MenuItem value={commune}>{commune.ward_name}</MenuItem>
                                                )
                                                )}
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    <Grid spacing={2} container sx={{ width: '100%', position: 'relative', marginTop: '2rem' }}>
                                        <Grid item xs={6}>
                                            <a onClick={() => navigate('/guestCart')}
                                                style={{
                                                    textDecoration: 'none',
                                                    color: '#338dbc',
                                                    transition: 'color 0.2s ease-in-out',
                                                    display: 'inline-block',
                                                    cursor: 'pointer',
                                                    fontSize: '14px',
                                                    fontFamily: 'sans-serif',
                                                    lineHeight: '1.5em',
                                                    marginLeft: '1.2em'
                                                }}
                                            >
                                                My Cart
                                            </a>
                                        </Grid>

                                        <Grid item xs={6}>
                                            <Button onClick={handleToPayment} sx={{ fontSize: '13px' }} >
                                                Continue to payment method
                                            </Button>
                                        </Grid>
                                    </Grid>

                                </Grid>
                            </Stack>
                        </Stack>
                    </Grid>
                )
            )}

            {/* Cart visualization part */}
            <Grid sx={{
                backgroundColor: '#fafafa',
                left: 0,
                backgroundPosition: 'left top',
                boxShadow: '1px 0 0 #e1e1e1 inset'
            }} height="auto" item xs={5}>
                {localStorage.getItem('role') === 'customer' ? (
                    <Stack direction="column" spacing={2} p="2rem" paddingRight="6em">
                        {listCart?.map((cart, index) => (
                            <Stack
                                key={index}
                                sx={{
                                    backgroundColor: '#F2F2F2',
                                    borderRadius: '8px',
                                    padding: '1em',
                                }}
                                direction="row"
                                width="100%">
                                {listProd?.map((prod) =>
                                    prod.productID === cart.productid ? (
                                        <img style={{
                                            width: '7em',
                                            height: '7em',
                                            borderRadius: '8px',
                                            background: '#fff',
                                            position: 'relative'
                                        }}
                                            alt={prod.name}
                                            src={prod.productimage[0]?.imageURL}
                                        />
                                    ) : (
                                        null
                                    )
                                )}
                                <Stack direction="column">
                                    <Typography sx={{ marginLeft: '1em', marginTop: '1em' }}>{cart.product.name}</Typography>
                                    <Typography sx={{ marginLeft: '1em', marginTop: '0.75em' }}> Số lượng: {cart.amount}</Typography>
                                </Stack>
                                {listProd.map((prod) =>
                                    prod.productID === cart.productid ? (
                                        <Typography sx={{ alignSelf: 'flex-end', fontWeight: 600 }}> {(Number(prod.price) * Number(cart.amount)).toLocaleString("en-US")}₫</Typography>
                                    ) : (null)
                                )}
                            </Stack>
                        ))}
                        <div style={{ height: '1px', width: '100%', backgroundColor: '#BFBFBF' }}></div>
                        <Grid container width="100%" spacing={1}>
                            <Grid item xs={8.5}>
                                <TextField
                                    fullWidth
                                    id="outlined-basic"
                                    label="Nhập mã giảm giá (nếu có)"
                                    variant="outlined"
                                    // onChange={handleChangeAddress}
                                    sx={{
                                        color: '#333333',
                                        fontFamily: 'sans-serif',
                                    }}
                                />
                            </Grid>
                            <Grid item xs={3.5} sx={{ height: '100%' }}>
                                <Button variant="contained" sx={{ fontSize: '14px', marginTop: '0.5em', width: '100%', height: '100%' }}>
                                    Sử dụng
                                </Button>
                            </Grid>
                        </Grid>
                        
                        <div style={{ height: '1px', width: '100%', backgroundColor: '#BFBFBF' }}></div>
                        <Stack direction="row" width='100%' justifyContent="space-between">
                            <Typography sx={{ marginTop: '1.2em', color: 'gray' }}>Tổng tiền sản phẩm</Typography>
                            <Typography sx={{
                                color: '#333333',
                                fontWeight: 800,
                                marginTop: '1.2em'
                            }}
                            >
                                {(subTotal - subTotal * discount / 100).toLocaleString("en-US")}₫
                            </Typography>
                        </Stack>
                        <Stack direction="row" width='100%' justifyContent="space-between">
                            <Typography sx={{ color: 'gray', marginTop: '-0.5em' }}>Vận chuyển ước tính (Tạm thời)</Typography>
                            <Typography sx={{
                                color: '#333333',
                                fontWeight: 800,
                                marginTop: '-0.5em'
                            }}
                            >
                                30,000₫
                            </Typography>
                        </Stack>
                        <Stack direction="row" width='100%' justifyContent="space-between">
                            <Typography sx={{ color: 'gray', marginTop: '-0.5em' }}>Giảm giá vận chuyển</Typography>
                            <Typography sx={{
                                color: '#333333',
                                fontWeight: 800,
                                marginTop: '-0.5em'
                            }}
                            >
                                -30,000₫
                            </Typography>
                        </Stack>
                        <div style={{ height: '1px', width: '100%', backgroundColor: '#BFBFBF' }}></div>

                        <Stack direction="row" width='100%' justifyContent="space-between">
                            <Typography sx={{ color: 'gray', marginTop: '1.2em' }}>Tổng</Typography>
                            <Typography sx={{
                                color: '#333333',
                                fontWeight: 600,
                                marginTop: '1.2em',
                                fontSize: '20px'
                            }}
                            >
                                {(Number(subTotal - subTotal * discount / 100)).toLocaleString("en-US")}₫
                            </Typography>
                        </Stack>
                    </Stack>
                ) : (
                    <Stack direction="column" spacing={2} p="2rem" paddingRight="6em">
                        {listCart.map((cart) => (
                            <Stack
                                sx={{
                                    backgroundColor: '#F2F2F2',
                                    borderRadius: '8px',
                                    padding: '1em',
                                    boxShadow: '0px 6px 6px -3px rgb(0 0 0 / 20%), 0px 10px 14px 1px rgb(0 0 0 / 14%), 0px 4px 18px 3px rgb(0 0 0 / 12%)'
                                }}
                                direction="row"
                                width="100%">
                                {listProd.map((prod) =>
                                    prod.productID === cart.productid ? (
                                        <img style={{
                                            width: '7em',
                                            height: '7em',
                                            borderRadius: '8px',
                                            background: '#fff',
                                            position: 'relative'
                                        }}
                                            alt={prod.name}
                                            src={prod.productimage[0]?.imageURL}
                                        />
                                    ) : (
                                        null
                                    )
                                )}
                                <Stack direction="column">
                                    {listProd.map((prod) =>
                                        prod.productID === cart.productid ? (
                                            <Typography sx={{ marginLeft: '1em', marginTop: '1em' }}>{prod.name}</Typography>
                                        ) : (
                                            null
                                        )
                                    )}
                                    <Typography sx={{ marginLeft: '1em', marginTop: '0.75em' }}> Quantity: {cart.amount}</Typography>
                                </Stack>
                                {listProd.map((prod) =>
                                    prod.productID === cart.productid ? (
                                        <Typography sx={{ alignSelf: 'flex-end', fontWeight: 800 }}> ${Number(prod.price) * Number(cart.amount)}</Typography>
                                    ) : (null)
                                )}
                            </Stack>
                        ))}
                        <div style={{ height: '1px', width: '100%', backgroundColor: '#BFBFBF' }}></div>
                        <Grid container width="100%" spacing={1}>
                            <Grid item xs={8.5}>
                                <TextField
                                    fullWidth
                                    id="outlined-basic"
                                    label="Discount code"
                                    variant="outlined"
                                    // onChange={handleChangeAddress}
                                    sx={{
                                        color: '#333333',
                                        fontFamily: 'sans-serif',
                                    }}
                                />
                            </Grid>
                            <Grid item xs={3.5} sx={{ height: '100%' }}>
                                <Button variant="contained" sx={{ fontSize: '14px', backgroundColor: 'gray', marginTop: '0.5em', width: '100%', height: '100%' }}>
                                    Use
                                </Button>
                            </Grid>
                        </Grid>
                        <div style={{ height: '1px', width: '100%', backgroundColor: '#BFBFBF' }}></div>
                        <Stack direction="column" width="100%">
                            <Typography sx={{
                                color: '#333333',
                                fontFamily: 'sans-serif', fontWeight: 300
                            }}
                            >RARE MEMBER
                            </Typography>
                            <Stack direction="row" width="100%">
                                <DiamondIcon sx={{ width: '17px', height: '17px' }} />
                                <Typography sx={{
                                    color: '#333333',
                                    fontFamily: 'sans-serif',
                                    fontSize: '13px',
                                    marginLeft: '0.5em'
                                }}>
                                    MEMBER - 0 point(s)
                                </Typography>
                            </Stack>
                        </Stack>
                        <div style={{ height: '1px', width: '100%', backgroundColor: '#BFBFBF' }}></div>
                        <Stack direction="row" width='100%' justifyContent="space-between">
                            <Typography sx={{ marginTop: '1.2em', color: 'gray' }}>Temporary cost</Typography>
                            <Typography sx={{
                                color: '#333333',
                                fontWeight: 800,
                                marginTop: '1.2em'
                            }}
                            >
                                ${subTotal}
                            </Typography>
                        </Stack>
                        <Stack direction="row" width='100%' justifyContent="space-between">
                            <Typography sx={{ color: 'gray', marginTop: '-0.5em' }}>Delivery cost</Typography>
                            <Typography sx={{
                                color: '#333333',
                                fontWeight: 800,
                                marginTop: '-0.5em'
                            }}
                            >
                                $2.00
                            </Typography>
                        </Stack>
                        <div style={{ height: '1px', width: '100%', backgroundColor: '#BFBFBF' }}></div>

                        <Stack direction="row" width='100%' justifyContent="space-between">
                            <Typography sx={{ color: 'gray', marginTop: '1.2em' }}>Total cost</Typography>
                            <Typography sx={{
                                color: '#333333',
                                fontWeight: 800,
                                marginTop: '1.2em',
                                fontSize: '20px'
                            }}
                            >
                                {subTotal + 2} USD
                            </Typography>
                        </Stack>
                    </Stack>
                )}
            </Grid>

            {/* snackbar */}
            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
                    {
                        _currentUser != null ?
                            ((name === '' || phoneNumber === '' || addressShip === '') ? "Vui lòng điền đầy đủ" : "Vui lòng điền vị trí của bạn")
                            :
                            ((guestName === '' || guestPhoneNum === '' || addressShip === '') ? "Vui lòng điền đầy đủ" : "Vui lòng điền vị trí của bạn")
                    }
                </Alert>
            </Snackbar>

            <Snackbar open={openSnackbar2} autoHideDuration={6000} onClose={handleCloseSnackbar2}>
                <Alert onClose={handleCloseSnackbar2} severity="warnings" sx={{ width: '100%' }}>
                    "Check your phone number and email whether it's an email"
                </Alert>
            </Snackbar>

            <Dialog
                open={openConfirm}
                TransitionComponent={Transition}
                keepMounted
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{"Vui lòng kiểm tra kỹ những thông tin dưới đây trước khi đặt hàng"}</DialogTitle>
                <DialogContent>
                    {localStorage.getItem('role') === "customer" ? (
                        <DialogContentText id="alert-dialog-slide-description">
                            Bạn đang sử dụng dịch vụ COD. <br />
                            Tên người mua hàng: {name} <br />
                            Số điện thoại : {phoneNumber} <br />
                            Địa chỉ: {bigAddress} <br />
                            Đơn hàng sẽ được gửi tới email của bạn: {_currentUser.email} <br />
                            Trong vòng 5 ngày đơn hàng của bạn sẽ được giao.
                        </DialogContentText>
                    ) : (
                        <DialogContentText id="alert-dialog-slide-description">
                            You are about using COD service. <br />
                            Order's name: {guestName} <br />
                            Order's phone number: {guestPhoneNum} <br />
                            Order's address: {bigAddress} <br />
                            An order will be sent to your email: {email} <br />
                            About 5 days your order will be delivered.
                        </DialogContentText>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenConfirm(false)}>Hủy bỏ</Button>
                    <Button onClick={handleAgreeCOD}>Xác nhận đặt hàng</Button>
                </DialogActions>
                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={openBackdrop}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
            </Dialog>

            <Dialog open={placedOrderSuccessfully}>
                <DialogTitle color='success'>Đã đặt hàng thành công. <br />
                Vui lòng kiểm tra email của bạn xem đơn hàng của bạn <br />
                </DialogTitle>
                <Button
                    onClick={handleClosePlacedOrderSuccessfully}
                    style={{
                        alignSelf: 'center',
                        width: '30px',
                        height: '30px',
                        borderRadius: '15px',
                        border: '1px solid #18608a',
                        backgroundColor: 'green',
                        color: 'black',
                        fontSize: '13px',
                        marginBottom: '10px',
                        fontWeight: 'bold',
                        padding: '12px 45px',
                    }}
                >
                    OK
                </Button>
            </Dialog>

            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={openBackdrop}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </Grid >
    )
}

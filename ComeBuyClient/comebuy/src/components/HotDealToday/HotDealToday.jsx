import React, { useEffect, useState } from 'react';
import { Badge, Button, Card } from 'antd';
import styled from 'styled-components';
import './index.css';
import { Link } from 'react-router-dom';
import { Text } from '../CardProductLarge/CardProductLarge';
import { CheckOutlined, HeartTwoTone, ShoppingCartOutlined } from '@ant-design/icons';
import { Alert, Backdrop, CircularProgress, Snackbar } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { cartListSelector, currentUser } from '../../redux/selectors';
import { addFavorite } from '../../redux/slices/favoriteSlice';
import { unwrapResult } from '@reduxjs/toolkit';
import { addCart, cartSlice, updateCart } from '../../redux/slices/cartSlice';
import { Statistic } from 'antd';
import { getAllInvoice } from '../../redux/slices/invoiceSlice';
const { Countdown } = Statistic;
const { Meta } = Card;

const HotDealToday = ({ productList }) => {
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [openBackdrop, setOpenBackdrop] = useState(false)
    const [product, setProduct] = useState({})
    // const discountedPrice = product.price - (product.price * (parseFloat(product.promotion) / 100))
    const dispatch = useDispatch()
    const _currentUser = useSelector(currentUser)
    const _cart = useSelector(cartListSelector)

    const filteredProducts = productList.filter(product => {
        const promotionValue = parseInt(product.promotion.replace('%', ''));
        return promotionValue > 24; // Lọc các sản phẩm có promotion > 25
    });

    const handleAddToFavorite = async (product) => {
        setOpenBackdrop(true)
        let temp = {
            productID: product.productID,
            userID: _currentUser.userID
        }
        console.log('temp', temp)
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

    const handleAddToCart = async (product) => {
        if (localStorage.getItem('role') === 'customer') {
            setOpenBackdrop(true)
            let isExisted = false;
            let newCart = [..._cart]
            if (localStorage.getItem('idUser') !== '') {
                newCart = newCart.map((item) => {
                    if (item.productid === product.productID) {
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
                    console.log('buoc21')
                    newCart.map((item) => {
                        if (item.productid == product.productID) {
                            updateAmount(item)
                        }
                    })
                } else {
                    console.log('buoc2')
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

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };
    
    
    // const [invoiceList, setInvoiceList] = useState([])
    // console.log("🚀 ~ file: HotDealToday.jsx:151 ~ HotDealToday ~ invoiceList:", invoiceList)

    // const filteredInvoiceItems = invoiceList?.reduce((accumulator, currentInvoice) => {
    //     if (currentInvoice.isChecked) {
    //       const { invoiceitem } = currentInvoice;
    //       accumulator.push(...invoiceitem);
    //     }
    //     return accumulator;
    //   }, []);
    // console.log("🚀 ~ file: HotDealToday.jsx:160 ~ filteredInvoiceItems ~ filteredInvoiceItems:", filteredInvoiceItems)

    // useEffect(() => {
    //     async function fetchInvoice() {
    //         let temp = []
    //         if (invoiceList.length === 0) {
    //             try {
    //                 const resultAction = await dispatch(getAllInvoice())
    //                 const originalPromiseResult = unwrapResult(resultAction)
    //                 let tempList = []
    //                 originalPromiseResult?.data?.map((invoice) => {
    //                     let t = 0
    //                     invoice.invoiceitem.map(i => {
    //                         t = t + Number(i.total)
    //                     })
    //                     let obj = {
    //                         ...invoice,
    //                         total: t
    //                     }
    //                     tempList.push(obj)
    //                 })
    //                 setInvoiceList(tempList)
    //             } catch (rejectedValueOrSerializedError) {
    //                 console.log(rejectedValueOrSerializedError);
    //             }
    //         }
    //     }
    //     fetchInvoice()
    //     return () => {
    //         setInvoiceList({});
    //     };
    // }, [])
    const deadline = Date.now() + 1000 * 60 * 60 * 2;
    return (
        <Div>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}
            >
                <h2>DEAL HOT HÔM NAY</h2>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '10px'
                    }}
                >
                    <p
                        style={{
                            color: 'red',
                            fontWeight: 'bold',
                            fontSize: '22px'
                        }}
                    >ĐANG DIỄN RA</p>
                    <Countdown value={deadline} />
                </div>
            </div>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                {
                    filteredProducts?.slice(0, 6)?.map((product, index) => {
                        // console.log("🚀 ~ file: HotDealToday.jsx:184 ~ filteredProducts?.slice ~ product:", product)
                        // const sold = filteredInvoiceItems?.filter(item => item?.productid === product.productID)
                        // console.log("🚀 ~ file: HotDealToday.jsx:230 ~ filteredProducts?.slice ~ sold:", sold)
                        const discountedPrice = product.price + (product.price * (parseFloat(product.promotion) / 100))
                        return (
                            <Badge count={product?.promotion} key={index}>
                                <Card
                                    hoverable
                                    style={{
                                        width: 240,
                                    }}
                                    cover={<img alt="Ảnh laptop" src={product.productimage[0]?.imageURL} />}
                                >
                                    <Link to={`/productSpace/` + product.productID}>
                                        <Meta title={product.name} />
                                    </Link>
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'flex-start',
                                            alignItems: 'center',
                                            gap: '5px',
                                            marginTop: '12px'
                                        }}>
                                        <Meta
                                            className='meta-custom'
                                            style={{
                                                color: 'red'
                                            }}
                                            title={product.price.toLocaleString('en-US') + '₫'} />
                                        <Meta
                                            style={{
                                                textDecorationLine: 'line-through'
                                            }}
                                            description={discountedPrice.toLocaleString('en-US') + '₫'} />
                                    </div>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        // alignItems: 'center',
                                        marginTop: '8px'
                                    }}>
                                        <div>
                                            {/* <Text>Đã bán: </Text> */}
                                            <Text style={{ color: '#52c41a' }}><CheckOutlined twoToneColor="#52c41a" /> Có hàng</Text>
                                        </div>
                                        <div
                                            style={{
                                                display: 'flex',
                                                gap: '5px',
                                            }}
                                        >
                                            {localStorage.getItem('idUser') !== "" && (
                                                <Button size='large' icon={<HeartTwoTone twoToneColor="#B360E6" style={{ fontSize: '20px', color: '#B360E6' }} />}
                                                    onClick={() => handleAddToFavorite(product)}
                                                ></Button>
                                            )}
                                            <Button size='large' icon={<ShoppingCartOutlined twoToneColor="#B360E6" style={{ fontSize: '21px', color: '#B360E6' }} />}
                                                onClick={() => handleAddToCart(product)}
                                            ></Button>
                                        </div>
                                    </div>
                                </Card>
                                <Backdrop
                                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                                    open={openBackdrop}
                                    style={{
                                        backgroundColor: 'transparent'
                                    }}
                                >
                                    <CircularProgress color="inherit" />
                                </Backdrop>

                                <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                                    <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
                                        Thêm thành công
                                    </Alert>
                                </Snackbar>
                            </Badge>
                        )
                    })
                }
            </div>
        </Div>
    )
}

export default HotDealToday

export const Div = styled.div`
    display: flex;
    flex-direction: column;
    padding: 0 30px 30px;
    background: #f1f1f1;
`
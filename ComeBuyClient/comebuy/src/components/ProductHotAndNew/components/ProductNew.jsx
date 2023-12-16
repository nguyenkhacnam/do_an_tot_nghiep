import { Badge, Button, Card } from 'antd'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import CardProductLarge, { Text } from '../../CardProductLarge/CardProductLarge';
import { HeartTwoTone, ShoppingCartOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import { Alert, Snackbar } from '@mui/material';
import { addFavorite } from '../../../redux/slices/favoriteSlice.js';
import { cartListSelector, currentUser } from '../../../redux/selectors.js';
import { addCart, cartSlice, updateCart } from '../../../redux/slices/cartSlice.js';
const { Meta } = Card;
const ProductNew = ({ products }) => {
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [openBackdrop, setOpenBackdrop] = useState(false)
    const [product, setProduct] = useState({})
    // const discountedPrice = product.price - (product.price * (parseFloat(product.promotion) / 100))
    const dispatch = useDispatch()
    const _currentUser = useSelector(currentUser)
    const _cart = useSelector(cartListSelector)
    const handleAddToFavorite = async () => {
        // setOpenBackdrop(true)
        let temp = {
            productID: product.productID,
            userID: _currentUser.userID
        }
        try {
            const resultAction = await dispatch(addFavorite(temp))
            const originalPromiseResult = unwrapResult(resultAction)
            // setOpenBackdrop(false)
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

    const handleAddToCart = async () => {
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

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            gap: '50px'
        }}>
            <CardProductLarge product={products[0]} />
            <div
                style={{
                    flex: '1',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '50px'
                }}
            >
                {
                    products?.slice(1, 9)?.map(product => {
                        const discountedPrice = product.price - (product.price * (parseFloat(product.promotion) / 100))
                        return (
                            <Badge count={product?.promotion}>
                                <Card
                                
                                    hoverable
                                    style={{
                                        width: 240,
                                    }}
                                    cover={<img alt="Ảnh laptop" src={product.productimage[0]?.imageURL} />}
                                >
                                    <Link to={`/productSpace/` + product.productID} >
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
                                            title={discountedPrice.toLocaleString('en-US') + '₫'} />
                                        <Meta
                                            style={{
                                                textDecorationLine: 'line-through'
                                            }}
                                            description={product.price.toLocaleString('en-US') + '₫'} />
                                    </div>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        // alignItems: 'center',
                                        marginTop: '15px'
                                    }}>
                                        <Text>Đã bán: </Text>
                                        <div
                                            style={{
                                                display: 'flex',
                                                gap: '5px',
                                            }}
                                        >
                                            {localStorage.getItem('idUser') !== "" && (
                                                <Button size='large' icon={<HeartTwoTone twoToneColor="#B360E6" style={{ fontSize: '20px', color: '#B360E6' }} />}
                                                    onClick={handleAddToFavorite}
                                                ></Button>
                                            )}
                                            <Button size='large' icon={<ShoppingCartOutlined twoToneColor="#B360E6" style={{ fontSize: '21px', color: '#B360E6' }} />}
                                                onClick={() => {
                                                    setProduct(product)
                                                    handleAddToCart()
                                                }}
                                            ></Button>
                                        </div>
                                    </div>
                                </Card>

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
        </div>
    )
}

export default ProductNew
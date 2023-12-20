import React, { useState } from 'react'
import { Div } from '../HotDealToday/HotDealToday';
import { Badge, Button, Card } from 'antd';
import { Link } from 'react-router-dom';
import { Text } from '../CardProductLarge/CardProductLarge';
import { CheckCircleOutlined, CheckOutlined, HeartTwoTone, ShoppingCartOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { cartListSelector, currentUser } from '../../redux/selectors';
import { addFavorite } from '../../redux/slices/favoriteSlice';
import { unwrapResult } from '@reduxjs/toolkit';
import { addCart, cartSlice, updateCart } from '../../redux/slices/cartSlice';
import { Alert, Backdrop, CircularProgress, Snackbar } from '@mui/material';
const { Meta } = Card;
const ProductBrand = ({ productList, title }) => {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openBackdrop, setOpenBackdrop] = useState(false)
  const [product, setProduct] = useState({})
  // const discountedPrice = product.price - (product.price * (parseFloat(product.promotion) / 100))
  const dispatch = useDispatch()
  const _currentUser = useSelector(currentUser)
  const _cart = useSelector(cartListSelector)

  const styles = {
    myElement: {
      opacity: 0,
      transition: 'opacity 195ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
      visibility: 'hidden',
    },
    clicked: {
      opacity: 1,
      transition: 'opacity 225ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
      visibility: 'visible',
    },
  };

  const [clicked, setClicked] = useState(false);

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
    <Div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <h2>{title}</h2>
        <p
          style={{
            color: 'red',
            fontWeight: 'bold',
            display: 'none'
          }}
        >Đang diễn ra</p>
      </div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '25px'
      }}>
        {
          productList?.slice(0, 12)?.map((product, index) => {
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
                      <Text>Đã bán: </Text>
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

export default ProductBrand
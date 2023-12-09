import React, { useState, useEffect } from 'react'
import { Add, Remove } from "@material-ui/icons";
import styled from "styled-components";
import NavBar from "../../components/NavBar/NavBar";
import { BigFooter, ProductInCart } from '../../components';
import { mobile } from "./responsive";

import { Typography, Link, Autocomplete, createFilterOptions, InputBase, Paper } from '@mui/material';
import { Stack, Breadcrumbs, TextField } from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { Button } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

import { useNavigate } from 'react-router';
import { getAllCart, updateCart, deleteCartById } from './../../redux/slices/cartSlice';
import { useDispatch, useSelector } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import { currentUser } from '../../redux/selectors';
import { getProductWithID } from '../../redux/slices/productSlice';

const Container = styled.div`
    background-color: white
`;

const Wrapper = styled.div`
  padding: 20px;
 background-color: #F2EBDF
  ${mobile({ padding: "10px" })}
`;

const Title = styled.h1`
  font-weight: 300;
  text-align: center;
  // font-family: serif
`;

const Top = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
`;

const TopButton = styled.button`
  padding: 10px;
  font-weight: 600;
  cursor: pointer;
  border: ${(props) => props.type === "filled" && "none"};
  background-color: ${(props) =>
    props.type === "filled" ? "#2C4001" : "transparent"};
  color: ${(props) => props.type === "filled" && "white"};
`;

const TopTexts = styled.div`
  ${mobile({ display: "none" })}
`;
const TopText = styled.span`
  text-decoration: underline;
  cursor: pointer;
  margin: 0px 10px;
`;

const Bottom = styled.div`
  display: flex;
  justify-content: space-between;
  ${mobile({ flexDirection: "column" })}

`;

const Summary = styled.div`
  flex: 1;
  // border: 0.5px solid lightslategrey;
  border-radius: 10px;
  padding: 20px;
  height: 50vh;
  box-shadow: 2px 2px 2px 2px;
  margin-top: 3%
`;

const SummaryTitle = styled.h1`
  font-weight: 200;
`;

const SummaryItem = styled.div`
  margin: 30px 0px;
  display: flex;
  justify-content: space-between;
  font-weight: ${(props) => props.type === "total" && "500"};
  font-size: ${(props) => props.type === "total" && "24px"};
`;

const SummaryItemText = styled.span``;

const SummaryItemPrice = styled.span``;

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction='d' ref={ref} {...props} />;
});

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const filter = createFilterOptions();

const CustomerCart = () => {

  const dispatch = useDispatch()
  const _currentUser = useSelector(currentUser)
  const navigate = useNavigate()

  const [isLoading, setIsLoading] = useState(true)
  const [cartList, setCartList] = useState([])
  const [prodList, setProdList] = useState([])
  const [subTotal, setSubTotal] = useState(0)
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [input, setInput] = useState('')
  const [output, setOutput] = useState([])

  useEffect(() => {
    setOutput([])
    cartList.filter(val => {
      if (val.product.name.toLowerCase().includes(input.toLowerCase())) {
        setOutput(output => [...output, val])
      }
    })
  }, [input])

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSnackbar(false);
  };

  const fetchYourCart = async (listCart, listProduct) => {
    let temp = []
    try {
      const resultAction = await dispatch(getAllCart())
      const originalPromiseResult = unwrapResult(resultAction)
      temp = originalPromiseResult
      for (let i = 0; i < temp.length; i++) {
        if (temp[i].userid === _currentUser.userID) {
          listCart.push(temp[i])
          const resultAction2 = await dispatch(getProductWithID(temp[i].productid))
          const originalPromiseResult2 = unwrapResult(resultAction2)
          listProduct.push(originalPromiseResult2)
        }
      }
      setIsLoading(false)
      await CountTotal(listCart, listProduct)
    } catch (rejectedValueOrSerializedError) {
      return rejectedValueOrSerializedError
    }
  }

  const CountTotal = async (_cart, prList) => {
    let newTotal = 0
    await _cart.map((item) => {
      let rs = prList.find((ite) => ite.productID == item.productid)
      if (rs != undefined)
        newTotal = newTotal + Number(Number(rs.price) * Number(item.amount))
    })
    setSubTotal(newTotal)
  }

  useEffect(() => {
    if (isLoading === true) {
      let listCart = []
      let listProduct = []
      let tempSubTotal = 0
      fetchYourCart(listCart, listProduct)
      setCartList(listCart)
      setmasterData(listCart)
      setProdList(listProduct)
    }
  }, [])

  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const [search, setSearch] = React.useState('')
  const [masterData, setmasterData] = React.useState([])

  const searchFilter = (text) => {
    if (text) {
      const newData = masterData.filter((item) => {
        const itemData = item.email ?
          item.email.toUpperCase()
          : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setCartList(newData);
      setSearch(text);
    } else {
      setCartList(masterData);
      setSearch(text);
    }
  }

  //handling change amount 
  const handleChangeAmount = async (value, actionType) => {
    let newListCart = cartList
    console.log(actionType);
    console.log(newListCart);
    console.log(value);
    if (actionType == "increase") {
      newListCart = newListCart.map((element) => {
        // let dataForUpdate = { ...element }
        if (element.productid == value) {
          return {
            ...element,
            "productid": element.productid,
            "amount": Number(element.amount) + 1
          }
        }
        else return element
      });
      newListCart.map(async (item) => {
        if (item.productid == value) {
          try {
            const resultAction = await dispatch(updateCart(item))
            const originalPromiseResult = unwrapResult(resultAction)
          } catch (rejectedValueOrSerializedError) {
            alert(rejectedValueOrSerializedError);
          }
        }
      })
      setCartList(newListCart)
      await CountTotal(newListCart, prodList)
    } else if (actionType === "decrease") {
      let sign = 1
      //sign 1: run updateCart when amount not = 0
      //sign 0: don't run anything
      newListCart = newListCart.map((element) => {
        if (element.productid == value) {
          if (element.amount === 0) {
            sign = 0
            setOpen(true)
          } else {
            sign = 1
            return {
              ...element,
              "productid": element.productid,
              "amount": Number(element.amount) - 1
            }
          }
        }
        else return element
      });
      if (sign === 1) {
        newListCart.map(async (item) => {
          if (item.productid == value) {
            try {
              const resultAction = await dispatch(updateCart(item))
              const originalPromiseResult = unwrapResult(resultAction)
            } catch (rejectedValueOrSerializedError) {
              alert(rejectedValueOrSerializedError);
            }
          }
        })
        setCartList(newListCart)
        await CountTotal(newListCart, prodList)
      } else {
        return
      }
    }
  }

  //handle agree dis-cart
  const handleAgree = async (item) => {
    try {
      const resultAction = await dispatch(deleteCartById(item))
      const originalPromiseResult = unwrapResult(resultAction)
      console.log(originalPromiseResult)
      for (let i = 0; i < cartList.length; i++) {
        if (cartList[i].cartID === item.cartID) {
          cartList.splice(i, 1)
        }
      }
      handleClose()
    } catch (rejectedValueOrSerializedError) {
      alert(rejectedValueOrSerializedError);
    }
  }

  const handleCheckout = () => {
    if (cartList.length > 0) {
      navigate('/myplace/mycart/checkout')
    } else {
      setOpenSnackbar(true)
    }
  }

  function handleClick(event) {
    event.preventDefault();
    navigate('/myplace')
  }

  function handleClickToHome(event) {
    event.preventDefault();
    navigate('/')
  }

  const breadcrumbs = [
    <Link
      underline="hover"
      key="2"
      style={{ color: '#000D0A' }}
      href="/myplace"
      onClick={handleClickToHome}
    >
      Home
    </Link>,
    <Link
      underline="hover"
      key="2"
      style={{ color: '#000D0A' }}
      href="/myplace"
      onClick={handleClick}
    >
      My place
    </Link>,
    <Typography key="3" style={{ color: '#000D0A' }}>
      My Cart
    </Typography>,
  ];

  const gotoProductScreen = () => navigate('/productSpace')
  const [num, setNum] = useState(2)

  return (

    <Container>
      <NavBar hiddenCartLabel={false} />
      <Stack direction="row"
        spacing={3}
        style={{ marginLeft: '15%', marginTop: '1%' }}
      >
        <Breadcrumbs separator="›" style={{ color: '#000D0A' }} aria-label="breadcrumb">
          {breadcrumbs}
        </Breadcrumbs>
      </Stack>
      <Wrapper>
        <Title>YOUR CART</Title>
        <Top>
          <TopButton onClick={gotoProductScreen}>CONTINUE SHOPPING</TopButton>
          <TextField
            sx={{ p: '2px 4px 2px 2px', display: 'flex', alignItems: 'center', width: 500 }}
            placeholder="Search cart "
            variant='outlined'
            inputProps={{ 'aria-label': 'Search cart' }}
            value={search}
            onChange={(text) => searchFilter(text.target.value)}
          />
          <TopButton onClick={handleCheckout} type="filled">CHECKOUT NOW</TopButton>
        </Top>
        <Bottom>
          <Stack sx={{ m: 2, p: 2 }}>
            {
              cartList.map((item, i) => (
                <>
                  <ProductInCart key={i} productInCart={item} handleChangeAmount={handleChangeAmount}></ProductInCart>
                  <Dialog
                    open={open}
                    TransitionComponent={Transition}
                    keepMounted
                    aria-describedby="alert-dialog-slide-description"
                  >
                    <DialogTitle>{"Discart"}</DialogTitle>
                    <DialogContent>
                      <DialogContentText id="alert-dialog-slide-description">
                        Are you sure want discart this product ?
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleClose}>Cancel</Button>
                      <Button onClick={() => handleAgree(item)}>Ok</Button>
                    </DialogActions>
                  </Dialog>
                </>
              ))
            }
          </Stack>
          <Summary>
            <SummaryTitle>ORDER SUMMARY</SummaryTitle>
            <SummaryItem>
              <SummaryItemText>Subtotal</SummaryItemText>
              <SummaryItemPrice>${subTotal}</SummaryItemPrice>
            </SummaryItem>
            <SummaryItem>
              <SummaryItemText>Estimated Shipping (Temporary)</SummaryItemText>
              <SummaryItemPrice>$ 2</SummaryItemPrice>
            </SummaryItem>
            <SummaryItem>
              <SummaryItemText>Shipping Discount (Temporary)</SummaryItemText>
              <SummaryItemPrice>$ -2</SummaryItemPrice>
            </SummaryItem>
            <div style={{ height: '1px', width: '100%', backgroundColor: 'black' }}></div>
            <SummaryItem type="total">
              <SummaryItemText>Total</SummaryItemText>
              <SummaryItemPrice>${subTotal}</SummaryItemPrice>
            </SummaryItem>
            <Button sx={{
              width: '100%',
              padding: '10px',
              backgroundColor: 'black',
              cursor: 'pointer',
              color: 'white',
              fontWeight: 600,
            }}
              variant="contained"
              onClick={handleCheckout}
            >
              CHECKOUT NOW
            </Button>
          </Summary>
        </Bottom>
      </Wrapper>
      <BigFooter />
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="warning" sx={{ width: '100%' }}>
          Add some product ti your cart first
        </Alert>
      </Snackbar>
    </Container >
  );
};

export default CustomerCart;
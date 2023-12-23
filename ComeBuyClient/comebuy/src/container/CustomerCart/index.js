import React, { useState, useEffect } from "react";
import { Add, Remove } from "@material-ui/icons";
import styled from "styled-components";
import NavBar from "../../components/NavBar/NavBar";
import { BigFooter, ProductInCart } from "../../components";
import { mobile } from "./responsive";

import {
  Typography,
  Link,
  Autocomplete,
  createFilterOptions,
  InputBase,
  Paper,
} from "@mui/material";
import { Stack, Breadcrumbs, TextField } from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { Button } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

import { useNavigate } from "react-router";
import {
  getAllCart,
  updateCart,
  deleteCartById,
  cartSlice,
} from "./../../redux/slices/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import { currentUser } from "../../redux/selectors";
import { getProductWithID } from "../../redux/slices/productSlice";
import './index.css'
const Container = styled.div`
  background-color: white;
`;

const Wrapper = styled.div`
  padding: 20px;
  background-color: #f2ebdf ${mobile({ padding: "10px" })};
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
  border: ${props => props.type === "filled" && "none"};
  background-color: ${props =>
    props.type === "filled" ? "#b360e6" : "transparent"};
  color: ${props => props.type === "filled" && "white"};
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
  width: 500px;
  /* flex: 1; */
  // border: 0.5px solid lightslategrey;
  border-radius: 10px;
  padding: 20px;
  height: 50vh;
  box-shadow: 2px 2px 2px 2px;
  margin-top: 3%;
`;

const SummaryTitle = styled.h1`
  font-weight: 200;
`;

const SummaryItem = styled.div`
  margin: 30px 0px;
  display: flex;
  justify-content: space-between;
  font-weight: ${props => props.type === "total" && "500"};
  font-size: ${props => props.type === "total" && "24px"};
`;

const SummaryItemText = styled.span``;

const SummaryItemPrice = styled.span``;

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="d" ref={ref} {...props} />;
});

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const filter = createFilterOptions();

const CustomerCart = () => {
  const dispatch = useDispatch();
  const _currentUser = useSelector(currentUser);
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [cartList, setCartList] = useState([]);
  console.log("🚀 ~ file: index.js:132 ~ CustomerCart ~ cartList:", cartList)
  const [prodList, setProdList] = useState([]);
  const [subTotal, setSubTotal] = useState(0);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState([]);
  const [isDeleteCart, setIsDeleteCart] = useState(false);
  useEffect(() => {
    setOutput([]);
    cartList.filter(val => {
      if (val.product.name.toLowerCase().includes(input.toLowerCase())) {
        setOutput(output => [...output, val]);
      }
    });
  }, [input]);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackbar(false);
  };

  const fetchYourCart = async (listCart, listProduct) => {
    let temp = [];
    try {
      const resultAction = await dispatch(getAllCart());
      const originalPromiseResult = unwrapResult(resultAction);
      temp = originalPromiseResult;
      for (let i = 0; i < temp.length; i++) {
        if (temp[i].userid === _currentUser.userID) {
          listCart.unshift(temp[i]);
          const resultAction2 = await dispatch(
            getProductWithID(temp[i].productid)
          );
          const originalPromiseResult2 = unwrapResult(resultAction2);
          listProduct.push(originalPromiseResult2);
        }
      }
      setIsLoading(false);
      await CountTotal(listCart, listProduct);
    } catch (rejectedValueOrSerializedError) {
      return rejectedValueOrSerializedError;
    }
  };

  const CountTotal = async (_cart, prList) => {
    let newTotal = 0;
    await _cart.map(item => {
      let rs = prList.find(ite => ite.productID == item.productid);
      if (rs != undefined)
        newTotal = newTotal + Number(Number(rs.price) * Number(item.amount));
    });
    setSubTotal(newTotal);
  };
  const [open1, setOpen1] = useState(false);

  useEffect(() => {
    if (isLoading === true) {
      let listCart = [];
      let listProduct = [];
      let tempSubTotal = 0;
      fetchYourCart(listCart, listProduct);
      setCartList(listCart);
      setmasterData(listCart);
      setProdList(listProduct);
      setOpen1(true)
    }
  }, []);

  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const [search, setSearch] = React.useState("");
  const [masterData, setmasterData] = React.useState([]);
  console.log(
    "🚀 ~ file: index.js:207 ~ CustomerCart ~ masterData:",
    masterData
  );

  const searchFilter = text => {
    if (text) {
      //   const filtered = props.products?.filter(product =>
      //     product.name.toLowerCase().includes(e.target.value?.toLowerCase())
      // );
      // setFilteredProducts(filtered);
      const newData = masterData.filter(item => {
        // const itemData = item.product.name
        //   ? item.product.name.toUpperCase()
        //   : "".toUpperCase();
        // const textData = text.toUpperCase();
        // return itemData.indexOf(textData) > -1;
        return item?.product?.name.toLowerCase().includes(text?.toLowerCase());
      });
      setCartList(newData);
      setSearch(text);
    } else {
      setCartList(masterData);
      setSearch(text);
    }
  };

  //handling change amount
  const handleChangeAmount = async (value, actionType) => {
    let newListCart = cartList;
    console.log(actionType);
    console.log(newListCart);
    console.log(value);
    if (actionType == "increase") {
      newListCart = newListCart.map(element => {
        // let dataForUpdate = { ...element }
        if (element.productid == value) {
          return {
            ...element,
            productid: element.productid,
            amount: Number(element.amount) + 1,
          };
        } else return element;
      });
      newListCart.map(async item => {
        if (item.productid == value) {
          try {
            const resultAction = await dispatch(updateCart(item));
            const originalPromiseResult = unwrapResult(resultAction);
          } catch (rejectedValueOrSerializedError) {
            alert(rejectedValueOrSerializedError);
          }
        }
      });
      console.log("newListCart", newListCart);
      setCartList(newListCart);
      await CountTotal(newListCart, prodList);
    } else if (actionType === "decrease") {
      let sign = 1;
      //sign 1: run updateCart when amount not = 0
      //sign 0: don't run anything
      newListCart = newListCart.map(element => {
        if (element.productid == value) {
          if (element.amount === 0) {
            sign = 0;
            setOpen(true);
          } else {
            sign = 1;
            return {
              ...element,
              productid: element.productid,
              amount: Number(element.amount) - 1,
            };
          }
        } else return element;
      });
      if (sign === 1) {
        newListCart.map(async item => {
          if (item.productid == value) {
            try {
              const resultAction = await dispatch(updateCart(item));
              const originalPromiseResult = unwrapResult(resultAction);
            } catch (rejectedValueOrSerializedError) {
              alert(rejectedValueOrSerializedError);
            }
          }
        });
        console.log("newListCart", newListCart);
        setCartList(newListCart);
        await CountTotal(newListCart, prodList);
      } else {
        return;
      }
    }
  };
  console.log("re-render");
  //handle agree dis-cart
  const handleAgree = async item => {
    console.log("🚀 ~ file: index.js:307 ~ handleAgree ~ item:", item)
    setIsDeleteCart(true);
    try {
      // dispatch(cartSlice.actions.removeCart(item));
      const resultAction = await dispatch(deleteCartById(item));
      console.log(
        "🚀 ~ file: index.js:308 ~ handleAgree ~ resultAction:",
        resultAction
      );
      const originalPromiseResult = unwrapResult(resultAction);
      console.log('originalPromiseResult', originalPromiseResult);
      // for (let i = 0; i < cartList.length; i++) {
      //   if (cartList[i].cartID === item.cartID) {
      //     cartList.splice(i, 1);
      //     // setCartList(cartList)
      //   }
      // }
      // const updatedCartList = cartList.filter(
      //   cart => cart.cartID !== item.cartID
      // );
      // console.log("🚀 ~ file: index.js:325 ~ handleAgree ~ updatedCartList:", updatedCartList)
      setCartList(cartList.filter(
        cart => cart.cartID !== item.cartID
      ));
      
      handleClose();
    } catch (rejectedValueOrSerializedError) {
      alert(rejectedValueOrSerializedError);
    } finally {
      setIsDeleteCart(false);
    }
  };

  const handleCheckout = () => {
    if (cartList.length > 0) {
      navigate("/myplace/mycart/checkout");
    } else {
      setOpenSnackbar(true);
    }
  };

  function handleClick(event) {
    event.preventDefault();
    navigate("/myplace");
  }

  function handleClickToHome(event) {
    event.preventDefault();
    navigate("/");
  }

  const breadcrumbs = [
    <Link
      underline="hover"
      key="2"
      style={{ color: "#000D0A" }}
      href="/myplace"
      onClick={handleClickToHome}
    >
      Trang chủ
    </Link>,
    <Link
      underline="hover"
      key="2"
      style={{ color: "#000D0A" }}
      href="/myplace"
      onClick={handleClick}
    >
      Danh mục chọn
    </Link>,
    <Typography key="3" style={{ color: "#000D0A" }}>
      Giỏ hàng
    </Typography>,
  ];

  const gotoProductScreen = () => navigate("/productSpace");
  const [num, setNum] = useState(2);
  console.log("re-render", cartList);
  console.log("re-render", cartList.reverse());
  return (
    <Container>
      <NavBar hiddenCartLabel={false} />
      <Stack
        direction="row"
        spacing={3}
        style={{ marginLeft: "15%", marginTop: "1%" }}
      >
        <Breadcrumbs
          separator="›"
          style={{ color: "#000D0A" }}
          aria-label="breadcrumb"
        >
          {breadcrumbs}
        </Breadcrumbs>
      </Stack>
      <Wrapper>
        <Title>GIỎ HÀNG CỦA BẠN</Title>
        <Top>
          <TopButton onClick={gotoProductScreen}>
            XEM CÁC SẢN PHẨM KHÁC
          </TopButton>
          <TextField
            sx={{
              p: "2px 4px 2px 2px",
              display: "flex",
              alignItems: "center",
              width: 500,
            }}
            className="custom-input-cart"
            placeholder="Tìm kiếm sản phẩm "
            variant="outlined"
            inputProps={{ "aria-label": "Tìm kiếm sản phẩm" }}
            value={search}
            onChange={text => searchFilter(text.target.value)}
          />
          <TopButton onClick={handleCheckout} type="filled" style={{
            background: '#1976d2'
          }}>
            THANH TOÁN NGAY
          </TopButton>
        </Top>
        <Bottom>
          <Stack sx={{ m: 2, p: 2 }}>
            {open1 && cartList && cartList?.map((item, i) => (
              <div key={i}>
                <ProductInCart
                  productInCart={item}
                  handleChangeAmount={handleChangeAmount}
                  onAgree={handleAgree}
                ></ProductInCart>
                <Dialog
                  open={open}
                  TransitionComponent={Transition}
                  keepMounted
                  aria-describedby="alert-dialog-slide-description"
                >
                  <DialogTitle>{"Discart"}</DialogTitle>
                  <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                      Bạn có chắc chắn muốn loại bỏ sản phẩm này?
                    </DialogContentText>
                  </DialogContent>
                    <DialogActions>
                      <Button onClick={handleClose}>Hủy</Button>
                      <Button onClick={() => handleAgree(item)}>Xác nhận</Button>
                    </DialogActions>
                </Dialog>
              </div>
            ))}
          </Stack>
          <Summary>
            <SummaryTitle>THÔNG TIN ĐẶT HÀNG</SummaryTitle>
            <SummaryItem>
              <SummaryItemText>Tổng (chưa tính vận chuyển)</SummaryItemText>
              <SummaryItemPrice>
                {subTotal.toLocaleString("en-US")}₫
              </SummaryItemPrice>
            </SummaryItem>
            <SummaryItem>
              <SummaryItemText>Vận chuyển ước tính (Tạm thời)</SummaryItemText>
              <SummaryItemPrice>30.000₫</SummaryItemPrice>
            </SummaryItem>
            <SummaryItem>
              <SummaryItemText>Giảm giá vận chuyển (Tạm thời)</SummaryItemText>
              <SummaryItemPrice>-30.000₫</SummaryItemPrice>
            </SummaryItem>
            <div
              style={{ height: "1px", width: "100%", backgroundColor: "black" }}
            ></div>
            <SummaryItem type="total">
              <SummaryItemText>Tổng: </SummaryItemText>
              <SummaryItemPrice>
                {subTotal.toLocaleString("en-US")}₫
              </SummaryItemPrice>
            </SummaryItem>
            <Button
              sx={{
                width: "100%",
                padding: "10px",
                // backgroundColor: "#b360e6",
                cursor: "pointer",
                color: "white",
                fontWeight: 600,
              }}
              variant="contained"
              onClick={handleCheckout}
            >
              THANH TOÁN NGAY
            </Button>
          </Summary>
        </Bottom>
      </Wrapper>
      <BigFooter />
      <Backdrop
        sx={{ color: "#fff", zIndex: theme => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Backdrop
        sx={{ color: "#fff", zIndex: theme => theme.zIndex.drawer + 1 }}
        open={isDeleteCart}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="warning"
          sx={{ width: "100%" }}
        >
          Add some product ti your cart first
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CustomerCart;

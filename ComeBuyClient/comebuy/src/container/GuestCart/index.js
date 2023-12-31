import * as React from "react";

import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Grid,
  Stack,
} from "@mui/material";
import "swiper/css";
import "swiper/css/pagination";
import { styled } from "@mui/material/styles";
import { useParams } from "react-router";
import {
  FeatureChart,
  NavBar,
  TechInforLine,
  BreadCrumb,
  BoxShopInfo,
  ProductInCart,
  BigFooter,
} from "../../components";
import { useDispatch, useSelector } from "react-redux";
import { cartListSelector } from "../../redux/selectors.js";
import { useState, useEffect } from "react";
import style from "./style.js";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { getAllProduct } from "../../redux/slices/productSlice";
import PaymentsIcon from "@mui/icons-material/Payments";
import { cartSlice } from "../../redux/slices/cartSlice";
import { useNavigate } from "react-router-dom";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import { message } from "antd";

const ProductImage = styled("img")({
  height: 300,
  width: "auto",
  maxWidth: 500,
  alignSelf: "center",
  backgroundSize: "cover",
});

const GuestCart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const _cart = useSelector(cartListSelector);
  const [cart, setCart] = useState(_cart);
  console.log("🚀 ~ file: index.js:52 ~ GuestCart ~ cart:", cart)
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  const [productList, setProductList] = useState([]);
  const [loading, setLoading] = useState(true);

  const CountTotal = async prList => {
    let newTotal = 0;
    await _cart.map(item => {
      let rs = prList.find(ite => ite.productID == item.productid);
      if (rs != undefined)
        newTotal = newTotal + Number(Number(rs.price) * Number(item.amount));
    });
    setTotal(newTotal);
  };

  const handleChangeAmount = (value, actionType) => {
    let newCart = [...cart];
    if (actionType == "increase") {
      newCart = cart.map(element => {
        if (element.productid == value) {
          return {
            productid: element.productid,
            amount: Number(element.amount) + 1,
          };
        } else return element;
      });
      dispatch(
        cartSlice.actions.cartListChange(
          newCart.filter(item => item != undefined)
        )
      );
    } else if (actionType == "decrease") {
      newCart = cart.map(element => {
        if (element.productid == value) {
          let rs = Number(element.amount) - 1;
          if (rs > 0)
            return {
              productid: element.productid,
              amount: Number(element.amount) - 1,
            };
        } else return element;
      });

      dispatch(
        cartSlice.actions.cartListChange(
          newCart.filter(item => item != undefined)
        )
      );
    }
  };

  const handleAgree = (value) => {
    console.log("🚀 ~ file: index.js:105 ~ handleAgree ~ value:", value)
    let cartFromLocalStorage = localStorage.getItem('cart');
    if (cartFromLocalStorage) {
        let cartArray = JSON.parse(cartFromLocalStorage);
        
        let newCart = cartArray.filter(item => item.productid !== value.productid);
        setCart(newCart)

        localStorage.setItem('cart', JSON.stringify(newCart));
    }
}

  useEffect(() => {
    const fetchData = async () => {
      dispatch(getAllProduct())
        .unwrap()
        .then(async originalPromiseResult => {
          setProductList(originalPromiseResult);
          setLoading(false);
          await CountTotal(originalPromiseResult);
        })
        .catch(rejectedValueOrSerializedError => {
          console.log(rejectedValueOrSerializedError);
        });
    };
    fetchData();
    return () => {
      setProductList({});
    };
  }, []);

  useEffect(() => {
    setCart(_cart);
    CountTotal(productList);
    return () => {
      setCart([]);
    };
  }, [_cart]);

  const handleCheckout = () => {
    // navigate('/myplace/mycart/checkout')
    navigate("/login");
    message.open({
      type: "warning",
      content: "Hãy đăng nhập để thực hiện chức năng này",
    });
  };

  return (
    <Stack sx={{ width: "100%", height: "100%" }}>
      <NavBar hiddenCartLabel={false}></NavBar>
      <Stack sx={{ pt: 2, pl: 2 }}>
        <BreadCrumb />
      </Stack>
      <Grid container sx={{ width: "100%", height: "100%" }}>
        <Grid container item xs={8} sx={{ p: 4 }}>
          {loading == false ? (
            <Box sx={style.boxInfor1}>
              <Stack
                direction="row"
                spacing={1}
                padding={1}
                sx={{ alignItems: "center", ml: 2, mb: 2 }}
              >
                <AddShoppingCartIcon />
                <Typography variant="h6" fontWeight="bold">
                  Cart ({cart.length})
                </Typography>
              </Stack>
              {cart.length > 0 ? (
                cart.map((item, i) => (
                  <ProductInCart
                    key={i}
                    productInCart={item}
                    handleChangeAmount={handleChangeAmount}
                    onAgree={handleAgree}
                  ></ProductInCart>
                ))
              ) : (
                <Stack sx={{ height: "100%", width: "100%" }}>
                  <Typography variant="h6">
                    There is nothing product in your cart!
                  </Typography>
                </Stack>
              )}
            </Box>
          ) : (
            <Stack>
              <CircularProgress />
            </Stack>
          )}
        </Grid>
        <Grid container item xs={4}>
          {!loading && (
            <Box sx={style.boxHandle}>
              {cart != null ? (
                <Stack>
                  <Stack
                    direction="row"
                    spacing={1}
                    padding={1}
                    sx={{ alignItems: "center" }}
                  >
                    <AddShoppingCartIcon />
                    <Typography variant="h6" fontWeight="bold">
                      Đặt hàng
                    </Typography>
                  </Stack>
                  <Box
                    sx={{
                      height: 3,
                      width: "100%",
                      backgroundColor: "#B360A0",
                      mt: 2,
                    }}
                  ></Box>
                  <Stack
                    direction="row"
                    sx={{ justifyContent: "space-between", p: 2 }}
                  >
                    <Typography variant="body1">
                      Tổng (chưa tính vận chuyển):
                    </Typography>
                    <Typography
                      variant="body1"
                      fontWeight={"bold"}
                      color="error"
                    >
                      {total} VND
                    </Typography>
                  </Stack>
                  <Stack
                    direction="row"
                    sx={{ justifyContent: "space-between", p: 2 }}
                  >
                    <Typography variant="body1">Khuyến mãi:</Typography>
                    <Typography
                      variant="body1"
                      fontWeight={"bold"}
                      color="error"
                    >
                      0 VND
                    </Typography>
                  </Stack>
                  <Box
                    sx={{
                      height: 3,
                      width: "100%",
                      backgroundColor: "#B360A0",
                    }}
                  ></Box>
                  <Stack
                    direction="row"
                    sx={{ justifyContent: "space-between", p: 2 }}
                  >
                    <Typography variant="body1">Tổng:</Typography>
                    <Typography
                      variant="body1"
                      fontWeight={"bold"}
                      color="error"
                    >
                      {total} VND
                    </Typography>
                  </Stack>
                  {(localStorage.getItem("role") === "" ||
                    localStorage.getItem("idUser") === "") && (
                    <Button
                      variant="filled"
                      sx={style.buttonCheckout}
                      onClick={handleCheckout}
                      endIcon={<PaymentsIcon />}
                    >
                      Thanh toán
                    </Button>
                  )}
                  {total >= 2000 && false ? (
                    <Box
                      sx={{
                        borderRadius: 5,
                        borderWidth: 2,
                        border: "1px solid green",
                        p: 2,
                        m: 2,
                        color: "green",
                        backgroundColor: "#C6FABC",
                      }}
                    >
                      <Stack direction={"row"} spacing={1} style={{}}>
                        <CheckIcon />
                        <Typography>
                          Orders are eligible for free shipping upon prepayment.
                        </Typography>
                      </Stack>
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        borderRadius: 5,
                        borderWidth: 2,
                        border: "1px solid red",
                        p: 2,
                        m: 2,
                        color: "white",
                        backgroundColor: "#D97557",
                        display: "none",
                      }}
                    >
                      <Stack direction={"row"} spacing={1}>
                        <ClearIcon />
                        <Typography>
                          Orders are not eligible for free shipping. Invoices
                          need to be over 2000.
                        </Typography>
                      </Stack>
                    </Box>
                  )}
                </Stack>
              ) : (
                <Stack sx={{ width: "100%", height: "100%" }}>
                  <CircularProgress></CircularProgress>
                </Stack>
              )}
            </Box>
          )}
        </Grid>
        <BoxShopInfo></BoxShopInfo>
        <BigFooter />
      </Grid>
    </Stack>
  );
};

export default GuestCart;

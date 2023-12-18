// import * as React from "react";
// import Card from '@mui/material/Card';
// import CardActions from '@mui/material/CardActions';
// import CardContent from '@mui/material/CardContent';
// import CardMedia from '@mui/material/CardMedia';
// import Button from '@mui/material/Button';
// import Typography from '@mui/material/Typography';
import {
  Alert,
  Box,
  CardActionArea,
  Snackbar,
  Stack,
  styled,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { Badge, Button, Card } from "antd";
import { Text } from "../CardProductLarge/CardProductLarge";
import { CheckOutlined, HeartTwoTone, ShoppingCartOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { cartListSelector, currentUser } from "../../redux/selectors";
import { addFavorite } from "../../redux/slices/favoriteSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { addCart, cartSlice, updateCart } from "../../redux/slices/cartSlice";
import "./index.css";
const { Meta } = Card;
const Img = styled("img")({
  margin: "auto",
  display: "block",
  maxWidth: "100%",
  height: 120,
});

const ProductItem = ({ product }) => {
  const navigate = useNavigate();
  const handleNavigateToDetail = () =>
    navigate("/productSpace/" + product.productID);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const discountedPrice =
    product.price - product.price * (parseFloat(product.promotion) / 100);
  const dispatch = useDispatch();
  const _currentUser = useSelector(currentUser);
  const _cart = useSelector(cartListSelector);
  const handleAddToFavorite = async () => {
    // setOpenBackdrop(true)
    let temp = {
      productID: product.productID,
      userID: _currentUser.userID,
    };
    try {
      const resultAction = await dispatch(addFavorite(temp));
      const originalPromiseResult = unwrapResult(resultAction);
      // setOpenBackdrop(false)
      setOpenSnackbar(true);
      console.log(originalPromiseResult);
    } catch (rejectedValueOrSerializedError) {
      alert(rejectedValueOrSerializedError);
    }
  };

  const updateAmount = async item => {
    try {
      const resultAction = await dispatch(updateCart(item));
      const originalPromiseResult = unwrapResult(resultAction);
      setOpenBackdrop(false);
      setOpenSnackbar(true);
    } catch (rejectedValueOrSerializedError) {
      setOpenBackdrop(false);
      alert(rejectedValueOrSerializedError);
    }
  };

  const addNewCart = async temp => {
    try {
      const resultAction = await dispatch(addCart(temp));
      const originalPromiseResult = unwrapResult(resultAction);
      setOpenBackdrop(false);
      setOpenSnackbar(true);
    } catch (rejectedValueOrSerializedError) {
      setOpenBackdrop(false);
      alert(rejectedValueOrSerializedError);
    }
  };

  const handleAddToCart = async () => {
    if (localStorage.getItem("role") === "customer") {
      setOpenBackdrop(true);
      let isExisted = false;
      let newCart = [..._cart];
      if (localStorage.getItem("idUser") !== "") {
        newCart = newCart.map(item => {
          if (item.productid === product.productID) {
            isExisted = true;
            return {
              productid: product.productID,
              amount: item["amount"] + 1,
            };
          } else return item;
        });
        dispatch(cartSlice.actions.cartListChange(newCart));
        //Update amount if cart existed
        if (isExisted === true) {
          newCart.map(item => {
            if (item.productid == product.productID) {
              updateAmount(item);
            }
          });
        } else {
          newCart = [
            ...newCart,
            {
              productid: product.productID,
              amount: 1,
            },
          ];
          dispatch(cartSlice.actions.cartListChange(newCart));
          let temp = {
            userID: _currentUser.userID,
            productID: product.productID,
            amount: 1,
          };
          addNewCart(temp);
        }
      }
    } else {
      let isExisted = false;
      let newCart = [..._cart];
      if (localStorage.getItem("idUser") == "") {
        newCart = newCart.map(item => {
          if (item.productid == product.productID) {
            isExisted = true;
            return {
              productid: product.productID,
              amount: item["amount"] + 1,
            };
          } else return item;
        });
        dispatch(cartSlice.actions.cartListChange(newCart));
      }
      if (!isExisted) {
        newCart = [
          ...newCart,
          {
            productid: product.productID,
            amount: 1,
          },
        ];
        dispatch(cartSlice.actions.cartListChange(newCart));
      }
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };
  return (
    <>
      <Badge count={product?.promotion}>
        <Card
          className="custom-card-product-item"
          hoverable
          style={{
            width: 240,
          }}
          cover={
            <img alt="Ảnh laptop" src={product.productimage[0]?.imageURL} />
          }
        >
          <Link
            to={`/productSpace/` + product.productID}
            style={{
              color: "black",
            }}
          >
            <Meta title={product.name} />
            <div
              style={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
                gap: "5px",
                marginTop: "12px",
              }}
            >
              <Meta
                className="meta-custom"
                style={{
                  color: "red",
                  fontSize: "20px",
                }}
                title={discountedPrice.toLocaleString("en-US") + "₫"}
              />
              <Meta
                style={{
                  textDecorationLine: "line-through",
                  fontSize: "16px",
                }}
                description={product.price.toLocaleString("en-US") + "₫"}
              />
            </div>
            <div
              style={{
                marginTop: "4px",
              }}
            >
              <Text>CPU: {product.cpu.split("(")[0].trim()}</Text>
              <Text>GPU: {product.gpu}</Text>
              <Text>RAM: {product.ram}GB</Text>
              <Text>Ổ cứng: {product.memory}GB SSD</Text>
              <Text>Màn hình: {product.screenDimension} Inch</Text>
              {/* <Text>Bảo hành: {product.warranty}</Text> */}
            </div>
          </Link>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              // alignItems: 'center'
            }}
          >
            <div>
              <Text>Đã bán: </Text>
              <Text style={{ color: "#52c41a" }}>
                <CheckOutlined twoToneColor="#52c41a" /> Có hàng
              </Text>
            </div>
            <div
              style={{
                display: "flex",
                gap: "5px",
              }}
            >
              {localStorage.getItem("idUser") !== "" && (
                <Button
                  size="large"
                  icon={
                    <HeartTwoTone
                      twoToneColor="#B360E6"
                      style={{ fontSize: "26px", color: "#B360E6" }}
                    />
                  }
                  onClick={handleAddToFavorite}
                ></Button>
              )}
              <Button
                size="large"
                icon={
                  <ShoppingCartOutlined
                    twoToneColor="#B360E6"
                    style={{ fontSize: "27px", color: "#B360E6" }}
                  />
                }
                onClick={handleAddToCart}
              ></Button>
            </div>
          </div>
        </Card>
      </Badge>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: "100%" }}
        >
          Thêm thành công
        </Alert>
      </Snackbar>
    </>
  );
};
export default ProductItem;

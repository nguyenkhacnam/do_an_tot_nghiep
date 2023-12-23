import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import {
  Box,
  CardActionArea,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Icon,
  IconButton,
  Stack,
  styled,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import productAPI from "../../api/productAPI";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ClearIcon from "@mui/icons-material/Clear";

const Img = styled("img")({
  margin: "auto",
  display: "block",
  maxWidth: "100%",
  height: 120,
  alignSelf: "center",
});

const ProductInCart = props => {
  console.log("productInCart", props.productInCart);
  const [product, setProduct] = useState(null);
  const [amount, setAmount] = useState(props.productInCart.amount);

  const navigate = useNavigate();
  const handleNavigateToDetail = () =>
    navigate("/productSpace/" + product.productID);

  useEffect(() => {
    const fetchData = async () => {
      const response = await productAPI.getProductWithID(
        props.productInCart.productid
      );
      if (response.status === 200) setProduct(response.data);
      else console.log("Load product failed");
    };
    fetchData();
  }, []);

  useEffect(() => {
    setAmount(props.productInCart.amount);
    return () => {
      setAmount(0);
    };
  }, [props.productInCart.amount]);
  const [isLoading1, setIsLoading1] = useState(false);

  return (
    <Card sx={{ p: 2, m: 1, boxShadow: 5 }}>
      {product != null ? (
        <Stack
          direction={"row"}
          sx={{ height: "100%", alignContent: "center" }}
        >
          <Img
            alt="complex"
            sx={{ maxWidth: 180 }}
            src={product.productimage[0]?.imageURL}
          />
          <CardContent sx={{ maxWidth: 500 }}>
            <Typography
              gutterBottom
              variant="body1"
              fontWeight={"bold"}
              component="div"
              onClick={handleNavigateToDetail}
            >
              {product.name}
            </Typography>
            <Typography
              gutterBottom
              variant="body2"
              color="#868C7D"
              component="div"
            >
              Warranty {product.warranty}
            </Typography>
            <Stack sx={{ p: 1 }} spacing={1}>
              <Box>CPU: {product.cpu}</Box>
              <Box>GPU: {product.gpu}</Box>
              <Box>RAM: {product.ram}</Box>
              <Box>Màn hình: {product.screenDimension}' inchs</Box>
            </Stack>
          </CardContent>
          <Stack
            direction={"row"}
            sx={{
              height: "10%",
              justifyContent: "center",
              alignSelf: "center",
              p: 2,
            }}
            spacing={1}
          >
            <IconButton
              onClick={() =>
                props.handleChangeAmount(
                  props.productInCart.productid,
                  "decrease"
                )
              }
              color="primary"
              aria-label="add to shopping cart"
            >
              <RemoveIcon />
            </IconButton>
            <Chip
              label={amount}
              sx={{ backgroundColor: "#B360E6", color: "white" }}
            />
            <IconButton
              onClick={() =>
                props.handleChangeAmount(
                  props.productInCart.productid,
                  "increase"
                )
              }
              color="primary"
              aria-label="add to shopping cart"
            >
              <AddIcon />
            </IconButton>
          </Stack>
          <Typography
            variant="body1"
            fontWeight={"bold"}
            sx={{ textAlign: "end", alignSelf: "center", minWidth: 100 }}
            color="#D94A56"
          >
            {(product.price * amount).toLocaleString("en-US")}₫
          </Typography>
          <Stack
            direction={"row"}
            sx={{
              height: "10%",
              justifyContent: "center",
              alignSelf: "center",
              p: 2,
              marginLeft: "3%",
            }}
            spacing={1}
          >
            <Dialog
              open={isLoading1}
              // TransitionComponent={Transition}
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
                <Button onClick={() => setIsLoading1(false)}>Hủy</Button>
                <Button onClick={() => {
                  props.onAgree(props.productInCart)}}>
                  Xóa
                </Button>
              </DialogActions>
            </Dialog>
            {/* <DialogActions> */}
              {/* <Button onClick={handleClose}>Hủy</Button> */}
              <Button onClick={() => setIsLoading1(true)}>
                Xóa
              </Button>
            {/* </DialogActions> */}
            <IconButton
              color="primary"
              aria-label="add to shopping cart"
              onClick={() => setIsLoading1(true)}
            >
              <ClearIcon color="error" />
            </IconButton>
            {/* <IconButton onClick={() => props.handleMoveItemToCart(props.productInFavorite)} color="primary" aria-label="add to shopping cart">
                            <ShoppingCartCheckoutSharp />
                        </IconButton> */}
          </Stack>
        </Stack>
      ) : (
        <Stack>
          <CircularProgress></CircularProgress>
        </Stack>
      )}
    </Card>
  );
};
export default ProductInCart;

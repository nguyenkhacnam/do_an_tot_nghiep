import { Grid, Stack, Typography, Button, styled } from "@mui/material";
import style from "./style";
import RecommendIcon from "@mui/icons-material/Recommend";
import { Swiper, SwiperSlide } from "swiper/react";
import { useEffect, useState } from "react";
import aiApi from "../../api/aiAPI";
import ProductItem from "./ProductItem";
import { useDispatch, useSelector } from "react-redux";
import { currentUser, productListSelector } from "../../redux/selectors";
import { getAllInvoice } from "../../redux/slices/invoiceSlice";
import { SignalCellularNullOutlined } from "@mui/icons-material";
import { unwrapResult } from "@reduxjs/toolkit";

const CustomButton = styled(Button)({
  color: "white",
  backgroundColor: "black",
  width: "100%",
  borderRadius: "5px",
  borderWidth: "3px",
  paddingLeft: 20,
  paddingRight: 20,

  "&:hover": {
    zIndex: 1,
    backgroundColor: "grey",
  },
});

const RecommendedProductLine = props => {
  const dispatch = useDispatch();
  const _productList = useSelector(productListSelector);
  const _currentUser = useSelector(currentUser);
  const [products, setProduct] = useState([]);

  useEffect( () => {
    let cancel = false;
    const fetchData = async () => {
    try {
      const resultAction = await dispatch(getAllInvoice());
      const originalPromiseResult = unwrapResult(resultAction);
      let newData = [];
      await originalPromiseResult.map(ite => {
        ite.invoiceitem.map(ite2 => {
          if (ite2.productid != null) {
            let Time = ite.date.split(" ");
            let processedTime = "7 00";
            if (Time.length != 1) processedTime = Time[1].replace(":", " ");
            newData.push({
              MaKhachHang: ite.userid,
              TenKhachHang: ite.account.name,
              MaSanPham: ite2.productid,
              Thoigian: processedTime,
              Amount: ite2.amount,
            });
          }
        });
      });

      const response = await aiApi.recommendedSystem({
        name: _currentUser.name,
        data: newData,
      });
      if (!cancel && response.status == 200) {
        let recommendedList = response.data.filter(
          ite => ite != props.productID
        );
        if (recommendedList.length == 1) {
          recommendedList.push(_productList[_productList.length - 1].productID);
          recommendedList.push(_productList[_productList.length - 2].productID);
        }
        setProduct(recommendedList);
      } else console.log("Loi ");
    } catch (rejectedValueOrSerializedError) {
      return rejectedValueOrSerializedError;
    }
    }
    fetchData()
    return () => {
      setProduct({});
      cancel = true;
    };
  }, []);

  return (
    <Grid container item xs={12} sx={style.boxShopInfo}>
      <Stack
        direction={"row"}
        spacing={2}
        sx={{ alignItems: "center", pl: 2, pr: 2, pb: 2 }}
      >
        <RecommendIcon />
        <Typography variant="h5" fontWeight={"bold"}>
          Những sản phẩm liên quan
        </Typography>
      </Stack>
      <Grid container item xs={12}>
        <Swiper slidesPerView={3} loop spacing={1}>
          {products.map((item, i) => (
            <SwiperSlide key={i}>
              <ProductItem product={item}></ProductItem>
            </SwiperSlide>
          ))}
        </Swiper>
      </Grid>
    </Grid>
  );
};
export default RecommendedProductLine;

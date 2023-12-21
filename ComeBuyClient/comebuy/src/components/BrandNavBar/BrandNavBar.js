import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import ButtonBase from "@mui/material/ButtonBase";
import Typography from "@mui/material/Typography";
import { Dropdown } from "antd";
import {
  AuditOutlined,
  CheckCircleOutlined,
  DollarOutlined,
  FallOutlined,
  MenuOutlined,
  MoneyCollectOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import "./index.css";
import HomeSearchProduct from "../HomeSearchProduct/HomeSearchProduct";
import { useSelector } from "react-redux";
import { productListSelector } from "../../redux/selectors";

const Title = styled(Typography)(({ theme }) => ({
  position: "relative",
  color: "black",
  letterSpacing: "2px",
  textDecoration: "underline",
  cursor: "pointer",
  pb: theme => `calc(${theme.spacing(1)} + 0px)`,
  "&:hover": {
    variant: "subtitle1",
    fontSize: 20,
  },
}));

const ImageMarked = styled("span")(({ theme }) => ({
  height: 3,
  width: 18,
  backgroundColor: theme.palette.common.white,
  position: "absolute",
  bottom: -2,
  left: "calc(50% - 9px)",
  transition: theme.transitions.create("opacity"),
}));

const NavigateBrandLine = value => {
  window.location.replace("#Line_" + value);
};
function BrandNavBar(props) {
  const brandLine = props.brandLine;
  const _productList = useSelector(productListSelector);
  console.log(
    "🚀 ~ file: BrandNavBar.js:37 ~ BrandNavBar ~ brandLine:",
    brandLine
  );
  const items = [
    // {
    //   key: "1",
    //   label: <Link to="/productSpace" >Laptop Acer</Link>,
    // },
    // {
    //   key: "2",
    //   label: <Link to="/productSpace">Laptop Apple</Link>,
    // },
    // {
    //   key: "3",
    //   label: <Link to="/productSpace">Laptop Asus </Link>,
    // },
    // {
    //   key: "4",
    //   label: <Link to="/productSpace">Laptop HP </Link>,
    // },
    // {
    //   key: "5",
    //   label: <Link to="/productSpace">Laptop Lenovo </Link>,
    // },
    // {
    //   key: "6",
    //   label: <Link to="/productSpace">Laptop MSI </Link>,
    // },
    // {
    //   key: "7",
    //   label: <Link to="/productSpace">Laptop LG </Link>,
    // },
  ];
  return (
    <div
      style={{
        padding: "0 30px",
      }}
    >
      <div
        style={{
          backgroundColor: "#f1f1f1",
          borderRadius: "10px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "50px",
          }}
        >
          <div
            style={{
              width: "280px",
              marginLeft: "40px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Dropdown
              menu={{
                items,
              }}
              placement="bottomLeft"
              arrow
            >
              <Button
                // icon={<MenuOutlined />}
                // color="#B360E6"
                style={{
                  color: "black",
                  display: "flex",
                  gap: "5px",
                  marginTop: "4px",
                  fontSize: '18px'
                }}
              >
                <MenuOutlined size={40} style={{
                  fontSize: '22px'
                }} />
                Danh mục sản phẩm
              </Button>
            </Dropdown>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              gap: "50px",
              flex: 1,
              // color: 'white',
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "flex-start",
                gap: "5px",
                alignItems: "center",
                fontSize: '18px',
                
              }}
            >
              <CheckCircleOutlined style={{
                color: '#B360E6 ',
                fontSize: '20px'
              }}/>
              <p> 100% chính hãng</p>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-start",
                gap: "5px",
                alignItems: "center",
                fontSize: '18',
                
              }}
            >
              <MoneyCollectOutlined style={{
                color: '#B360E6 ',
                fontSize: '20px'
              }}/>
              <p> Giá ưu đãi nhất</p>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-start",
                gap: "5px",
                alignItems: "center",
                fontSize: '18',
                
              }}
            >
              <DollarOutlined style={{
                color: '#B360E6 ',
                fontSize: '20px'
              }}/>
              <p> Miễn phí vận chuyển</p>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-start",
                gap: "5px",
                alignItems: "center",
                fontSize: '18',
                
              }}
            >
              <AuditOutlined style={{
                color: '#B360E6 ',
                fontSize: '20px'
              }}/>
              <p> Bảo hành nơi sử dụng</p>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-start",
                gap: "5px",
                alignItems: "center",
                fontSize: '18',
                
              }}
            >
              <FallOutlined style={{
                color: '#B360E6 ',
                fontSize: '20px'
              }}/>
              <p> Hàng trưng bày giảm giá</p>
            </div>
          </div>
          {/* <HomeSearchProduct 
                products={_productList}
              /> */}
        </div>
        <Box
          sx={{
            flexGrow: 1,
            display: { xs: "none", md: "flex", justifyContent: "space-evenly" },
          }}
        >
          {brandLine?.map((brand, i) => (
            <Title
              variant="subtitle2"
              onClick={() => NavigateBrandLine(brand.title)}
              key={i}
            >
              {brand.title}
              <ImageMarked className="MuiImageMarked-root" />
            </Title>
          ))}
        </Box>
      </div>
    </div>
  );
}

export default BrandNavBar;

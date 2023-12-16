import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAccountWithID } from "../../redux/slices/accountSlice";
import {
  BrandNavBar,
  NavBar,
  BrandLine,
  FeatureBar,
  BrandLineImage,
  LaptopImageLine,
  BigFooter,
  NewProductLine,
  LiveBanner,
} from "../../components";
import { unwrapResult } from "@reduxjs/toolkit";
import { cartSlice } from "./../../redux/slices/cartSlice";
import { getAllProduct } from "../../redux/slices/productSlice";
import { productListSelector } from "../../redux/selectors";
import { Box, Stack, Typography } from "@mui/material";
import bannerApi from "../../api/bannerAPI";
import { WS_URL, DEPLOYED_WS } from "../../constant";
import io from "socket.io-client";
import {
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Carousel, Menu } from "antd";
import HotDealToday from "../../components/HotDealToday/HotDealToday";

const HomePage = () => {
  // const socket = io(DEPLOYED_WS, {
  //     transports: ["websocket"]
  // });
  const _productList = useSelector(productListSelector);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [liveBanner, SetLiveBanner] = useState([]);

  useEffect(async () => {
    if (localStorage.getItem("idUser") != "") {
      try {
        const resultAction = await dispatch(
          getAccountWithID(localStorage.getItem("idUser"))
        );
        const originalPromiseResult = unwrapResult(resultAction);
        dispatch(cartSlice.actions.cartListChange(originalPromiseResult.cart));
        // handle result here
      } catch (rejectedValueOrSerializedError) {
        if (rejectedValueOrSerializedError != null) {
          console.log("Load User Failed");
        }
      }
    } else {
      const value = JSON.parse(localStorage.getItem("cart"));
      dispatch(cartSlice.actions.cartListChange(value));
    }
    handleSocket();
    await dispatch(getAllProduct())
      .unwrap()
      .then(originalPromiseResult => {})
      .catch(rejectedValueOrSerializedError => {
        console.log("Error load product");
      });
    await LoadBanner();
    return () => {};
  }, []);

  const handleSocket = () => {
    // socket.on("connect", () => {
    //     console.log('Connect socket successfully!'); // x8WIv7-mJelg7on_ALbx
    // });
    // socket.on("update-new-banner", (message) => {
    //     const data = JSON.parse(message)
    //     if (liveBanner.find(ite => ite.bannerID == data.bannerID) == undefined)
    //         SetLiveBanner(prev => [data, ...prev])
    // })
    // socket.on("delete-banner", async (message) => {
    //     await LoadBanner();
    // })
  };

  const LoadBanner = async () => {
    const response = await bannerApi.getAll();
    if (response?.status === 200) SetLiveBanner(response.data);
    else console.log("Load banner failed!");
  };

  const brandList = [
    // {
    //     title: 'Apple',
    //     url: 'https://images.unsplash.com/photo-1494698853255-d0fa521abc6c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1228&q=80',
    // },
    // {
    //     title: 'Dell',
    //     url: 'https://images.unsplash.com/photo-1622286346003-c5c7e63b1088?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    // },
    // {
    //     title: 'HP',
    //     url: 'https://images.unsplash.com/photo-1579362243176-b746a02bc030?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1181&q=80',
    // },
    // {
    //     title: 'Lenovo',
    //     url: 'https://images.unsplash.com/photo-1601406984081-44d85ce92f90?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    // },
    // {
    //     title: 'Acer',
    //     url: 'https://images.unsplash.com/photo-1629751372750-3ddb8f8bfd0b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1130&q=80',
    // },
    // {
    //     title: 'Razer',
    //     url: 'https://images.unsplash.com/photo-1629751372750-3ddb8f8bfd0b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1130&q=80',
    // },
    // {
    //     title: 'MSI',
    //     url: 'https://images.unsplash.com/photo-1629751372750-3ddb8f8bfd0b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1130&q=80',
    // },
    // {
    //     title: 'Huawei',
    //     url: 'https://images.unsplash.com/photo-1629751372750-3ddb8f8bfd0b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1130&q=80',
    // }
  ];
  function getItem(label, key, icon, children, type) {
    return {
      key,
      icon,
      children,
      label,
      type,
    };
  }
  const items = [
    getItem("Navigation One", "1", <MailOutlined />),
    getItem("Navigation One", "1", <MailOutlined />),
    getItem("Navigation One", "1", <MailOutlined />),
    getItem("Navigation One", "1", <MailOutlined />),
    getItem("Navigation One", "1", <MailOutlined />),
    getItem("Navigation One", "1", <MailOutlined />),
    getItem("Navigation Three", "sub4", <SettingOutlined />, [
      getItem("Option 9", "9"),
      getItem("Option 10", "10"),
      getItem("Option 11", "11"),
      getItem("Option 12", "12"),
    ]),
  ];

  const onChange = currentSlide => {
    console.log(currentSlide);
  };

  const contentStyle = {
    margin: 0,
    height: "700px",
    color: "#fff",
    lineHeight: "700px",
    textAlign: "center",
    background: "#364d79",
  };

  return (
    <Stack>
      <NavBar></NavBar>
      <Box
        sx={{ height: 2, m: 2, mt: 10, width: "95%", backgroundColor: "black" }}
      ></Box>
      <BrandNavBar brandLine={brandList}></BrandNavBar>
      <div
        style={{
            padding: '0 30px'
        }}
      >
          <div
            style={{
              width: "97%",
              display: "flex",
              justifyContent: "space-between",
              //   gap: "50px",
              alignItems: "center",
            }}
          >
            <div
                style={{
                    alignSelf: 'flex-start',
                    width: '350px',
                    height: '700px',
                    marginTop: '30px',
                    background: '#f1f1f1',
                    borderRadius: '10px'
                }}
            >
                <div
                    style={{
                        height: '50px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderBottom: '1px solid #B360E6'
                    }}
                >
                    <Link to='/productSpace' 
                        style={{
                            textDecoration: 'none',
                            color: 'black'
                        }}
                    >Laptop HP</Link>
                </div>
                <div
                    style={{
                        height: '50px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderBottom: '1px solid #B360E6'
                    }}
                >
                    <Link to='/productSpace' 
                        style={{
                            textDecoration: 'none',
                            color: 'black'
                        }}
                    >Laptop Acer</Link>

                </div>
                <div
                    style={{
                        height: '50px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderBottom: '1px solid #B360E6'
                    }}
                >
                    <Link to='/productSpace' 
                        style={{
                            textDecoration: 'none',
                            color: 'black'
                        }}
                    >Laptop Apple</Link>
                </div>
                <div
                    style={{
                        height: '50px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderBottom: '1px solid #B360E6'
                    }}
                >
                    <Link to='/productSpace' 
                        style={{
                            textDecoration: 'none',
                            color: 'black'
                        }}
                    >Laptop Asus </Link>
                </div>
                <div
                    style={{
                        height: '50px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderBottom: '1px solid #B360E6'
                    }}
                >
                    <Link to='/productSpace' 
                        style={{
                            textDecoration: 'none',
                            color: 'black'
                        }}
                    >Laptop Lenovo</Link>
                </div>
                <div
                    style={{
                        height: '50px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderBottom: '1px solid #B360E6'
                    }}
                >
                    <Link to='/productSpace' 
                        style={{
                            textDecoration: 'none',
                            color: 'black'
                        }}
                    >Laptop MSI</Link>
                </div>
                <div
                    style={{
                        height: '50px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderBottom: '1px solid #B360E6'
                    }}
                >
                    <Link to='/productSpace' 
                        style={{
                            textDecoration: 'none',
                            color: 'black'
                        }}
                    >Laptop LG </Link>
                </div>
                <div
                    style={{
                        height: '50px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderBottom: '1px solid #B360E6'
                    }}
                >
                    <Link to='/productSpace' 
                        style={{
                            textDecoration: 'none',
                            color: 'black'
                        }}
                    >Laptop HP</Link>
                </div>
                <div
                    style={{
                        height: '50px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderBottom: '1px solid #B360E6'
                    }}
                >
                    <Link to='/productSpace' 
                        style={{
                            textDecoration: 'none',
                            color: 'black'
                        }}
                    >Laptop HP</Link>
                </div>
              {/* <Menu
                // onClick={onClick}
                style={{
                  width: 256,
                  border: "1px solid #B360E6",
                }}
                mode="vertical"
                items={items}
              /> */}
            </div>
            <div></div>
            <div
              style={{
                width: "906px",
                margin: "30px",
                // display: 'flex',
                // justifyContent: 'flex-start',
                // gap: '50px'
              }}
            >
              <Carousel
                style={{
                  width: "100%",
                }}
                autoplay
                afterChange={onChange}
              >
                <div>
                  <h3 style={contentStyle}>
                    <img src="https://phucanhcdn.com/media/banner/13_Decb6ec3d9ee22b9e5ad80d1992d4104653.jpg" />
                  </h3>
                </div>
                <div>
                  <h3 style={contentStyle}>
                    <img src="https://phucanhcdn.com/media/banner/11_Jul1e10cf66f78fe27e8434e65e856433b7.jpg" />
                  </h3>
                </div>
                <div>
                  <h3 style={contentStyle}>
                    <img src="https://phucanhcdn.com/media/banner/05_Dec0125dabd65c267007f89c30c4d10953a.jpg" />
                  </h3>
                </div>
                <div>
                  <h3 style={contentStyle}>
                    <img src="https://phucanhcdn.com/media/banner/14_Decd1454cdd128dd1cdd91b11a6d761d9c0.jpg" />
                  </h3>
                </div>
              </Carousel>
            </div>
            <div>
              <div
                style={{
                  width: "424px",
                  height: "236px",
                }}
              >
                <img
                  style={{
                    width: "424px",
                    height: "236px",
                  }}
                  src="https://phucanh.vn/media/banner/12_Oct579702eb66a569ac47e496cba555e382.jpg"
                />
              </div>
              <div
                style={{
                  width: "424px",
                  height: "236px",
                }}
              >
                <img
                  style={{
                    width: "424px",
                    height: "236px",
                  }}
                  src="https://phucanh.vn/media/banner/12_Oct579702eb66a569ac47e496cba555e382.jpg"
                />
              </div>
              <div
                style={{
                  width: "424px",
                  height: "236px",
                }}
              >
                <img
                  style={{
                    width: "424px",
                    height: "236px",
                  }}
                  src="https://phucanh.vn/media/banner/12_Oct579702eb66a569ac47e496cba555e382.jpg"
                />
              </div>
            </div>
          </div>
      </div>

      <HotDealToday 
        productList={_productList}
      />
      <Stack sx={{ p: 2 }} spacing={5}>
        {/* <LiveBanner
                        onNavigate={() => navigate('/productSpace')}
                        urlImage='https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mac-compare-202206?wid=1806&hei=642&fmt=jpeg&qlt=90&.v=1652989686485'
                        banners={liveBanner}
                    ></LiveBanner> */}
        {_productList.length > 0 && <NewProductLine />}
        <FeatureBar></FeatureBar>
        <BrandLineImage
          urlImage="https://images.unsplash.com/photo-1615750173609-2fbf12fd1d2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
          BigText="CHỌN VÀ NHẬN CÔNG VIỆC CỦA BẠN MỘT CÁCH HIỆU QUẢ"
          SmallText="ComeBuy Store. The best way to buy the products you love."
        ></BrandLineImage>
        <Typography
          variant="h4"
          fontWeight={"bold"}
          sx={{ alignSelf: "center" }}
        >
          Cửa hàng của chúng tôi.
          <Typography
            variant="h4"
            fontWeight={"bold"}
            sx={{ color: "#BCBFB0" }}
          >
            Cách tốt nhất để mua các sản phẩm bạn yêu thích.
          </Typography>
        </Typography>
        <div>
          {_productList.length > 0 &&
            brandList.map((item, i) => {
              const stringID = "Line_" + item.title;
              return (
                <BrandLine
                  key={i}
                  id={stringID}
                  brandName={item.title}
                  url={item.url}
                ></BrandLine>
              );
            })}
        </div>
        <Typography
          variant="h4"
          fontWeight={"bold"}
          sx={{ alignSelf: "center" }}
        >
          Nhận xét.
          <Typography
            variant="h4"
            fontWeight={"bold"}
            sx={{ color: "#BCBFB0" }}
          >
            Đây là nơi niềm vui bắt đầu.
          </Typography>
        </Typography>
        <LaptopImageLine></LaptopImageLine>
      </Stack>
      <BigFooter />
    </Stack>
  );
};
export default HomePage;

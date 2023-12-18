import * as React from "react";
import Box from "@mui/material/Box";
// import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { Chip, CircularProgress, Grid, Radio, Stack } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper";
import { styled } from "@mui/material/styles";
import BallotIcon from "@mui/icons-material/Ballot";
import style from "./style.js";
import MemoryIcon from "@mui/icons-material/Memory";
import ScreenshotMonitorIcon from "@mui/icons-material/ScreenshotMonitor";
import InventoryIcon from "@mui/icons-material/Inventory";
import CableIcon from "@mui/icons-material/Cable";
import AutofpsSelectIcon from "@mui/icons-material/AutofpsSelect";
import ChromeReaderModeIcon from "@mui/icons-material/ChromeReaderMode";
import Battery3BarIcon from "@mui/icons-material/Battery3Bar";
import ScaleIcon from "@mui/icons-material/Scale";
import DescriptionIcon from "@mui/icons-material/Description";
import { useParams } from "react-router";
import { useEffect, useState } from "react";
import productAPI from "../../../api/productAPI";
import {
  FeatureChart,
  NavBar,
  TechInforLine,
  BreadCrumb,
  BoxShopInfo,
  BigFooter,
} from "../../../components";
import DoneIcon from "@mui/icons-material/Done";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
import AddTaskIcon from "@mui/icons-material/AddTask";
import InfoIcon from "@mui/icons-material/Info";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import Backdrop from "@mui/material/Backdrop";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { cartListSelector, currentUser } from "../../../redux/selectors.js";
import { useDispatch, useSelector } from "react-redux";
import {
  addCart,
  cartSlice,
  updateCart,
} from "../../../redux/slices/cartSlice.js";
import ProductComment from "../../../components/ProductComment/index.js";
import RecommendedProductLine from "../../../components/RecommendedProductLine/index.js";
import { unwrapResult } from "@reduxjs/toolkit";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { addFavorite } from "./../../../redux/slices/favoriteSlice";
import { CheckCircleTwoTone, TramRounded } from "@mui/icons-material";
import {
  Avatar,
  Button,
  Card,
  Carousel,
  Col,
  Divider,
  Image,
  List,
  Row,
  Space,
  Tabs,
} from "antd";
import "./index.css";
import {
  CheckOutlined,
  SyncOutlined,
  ThunderboltOutlined,
  UserOutlined,
  ZoomInOutlined,
} from "@ant-design/icons";
import ProductSameBrand from "../../../components/ProductSameBrand/ProductSameBrand.jsx";
import TextArea from "antd/es/input/TextArea.js";
import CommentsProduct from "../../../components/CommentsProduct/CommentsProduct.jsx";

const ProductImage = styled("img")({
  height: 300,
  width: "auto",
  maxWidth: 500,
  alignSelf: "center",
  backgroundSize: "cover",
});
const CustomButton = styled(Button)({
  "&:hover": {
    backgroundColor: "#D93B48",
    color: "white",
  },
});
const CustomButton1 = styled(Button)({
  "&:hover": {
    backgroundColor: "grey",
    color: "white",
  },
});
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const DetailProduct = () => {
  const dispatch = useDispatch();
  const _cart = useSelector(cartListSelector);
  const _currentUser = useSelector(currentUser);
  const { id } = useParams();
  const [product, setProducts] = useState(null);
  const [error, setError] = useState(null);
  const [startAdding, setStartAdding] = useState(false);
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [openSnackbar, setOpenSnackbar] = React.useState(false);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  const LoadData = async () => {
    const response = await productAPI.getProductWithID(id);
    if (response?.status === 200) setProducts(response.data);
    else setError("Error Load Product!");
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

  const handleAddToCart = async () => {
    if (localStorage.getItem("role") == "customer") {
      setOpenBackdrop(true);
      let isExisted = false;
      let newCart = [..._cart];
      if (localStorage.getItem("idUser") != "") {
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

  useEffect(() => {
    LoadData();
    return () => setProducts(null);
  }, [id]);

  const onChangeTabs = currentSlide => {
    console.log(currentSlide);
  };

  const contentStyle = {
    margin: 0,
    height: "500px",
    color: "#fff",
    lineHeight: "500px",
    textAlign: "center",
    // background: "#364d79",
  };

  const dataList = [
    { name: "Hướng dẫn đặt hàng Flash Sale", icon: <CheckOutlined /> },
    { name: "Hướng dẫn mua hàng", icon: <CheckOutlined /> },
    { name: "Chính sách bảo hành đổi trả", icon: <CheckOutlined /> },
    { name: "Chính sách mua trả góp", icon: <CheckOutlined /> },
    { name: " Chính sách giao hàng", icon: <CheckOutlined /> },
    { name: "Chính sách bảo hành tận nhà", icon: <CheckOutlined /> },
    { name: "Hỗ trợ khách hàng dự án, doanh nghiệp", icon: <CheckOutlined /> },
  ];

  const dataListHelp = [
    { name: "Mua online - Giao hàng nhanh chóng", icon: <CheckOutlined /> },
    { name: "Ship hàng toàn quốc", icon: <CheckOutlined /> },
    {
      name: "Nhận hàng và thanh toán tại nhà ( ship COD)",
      icon: <CheckOutlined />,
    },
  ];

  const listImage = [
    "https://anphat.com.vn/media/lib/05-12-2023/nbms0374.jpg",
    "https://anphat.com.vn/media/lib/10-11-2023/nbln07591.jpg",
    "https://anphat.com.vn/media/lib/07-10-2023/nbas1264.jpg",
  ];
  const discountedPrice =
    product?.price - product?.price * (parseFloat(product?.promotion) / 100);

  const onChange = key => {
    console.log(key);
  };
  const items = [
    {
      key: "1",
      label: "Tab 1",
      children: "Content of Tab Pane 1",
    },
    {
      key: "2",
      label: "Tab 2",
      children: "Content of Tab Pane 2",
    },
    {
      key: "3",
      label: "Tab 3",
      children: "Content of Tab Pane 3",
    },
  ];
  return (
    <Stack sx={{ width: "100%", height: "100%" }}>
      <NavBar></NavBar>
      <Stack sx={{ pt: 2, pl: 4 }}>
        <BreadCrumb />
      </Stack>
      <div
        style={{
          padding: "10px 35px",
        }}
      >
        <Row justify="center">
          <Col span={8}>
            <Space
              direction="vertical"
              size="middle"
              style={{
                display: "flex",
              }}
            >
              <Carousel afterChange={onChange}>
                {product?.productimage?.map(item => (
                  <div>
                    <h3 style={contentStyle}>
                      <img
                        src={item.imageURL}
                        width="100%"
                        height="auto"
                        maxWidth="500px"
                        style={{
                          maxHeight: "500px",
                          objectFit: "contain",
                        }}
                      />
                    </h3>
                  </div>
                ))}
              </Carousel>
              <div
                style={{
                  fontSize: "16px",
                  display: "flex",
                  justifyContent: "center",
                  color: "#9c27b0",
                }}
              >
                Nhấn vào bên dưới để phóng to Hình ảnh sản phẩm{" "}
                <ZoomInOutlined />
              </div>
              <Space>
                {product?.productimage?.slice(0, 3)?.map(item => (
                  <Image width={200} src={item.imageURL} />
                ))}
              </Space>
            </Space>
          </Col>
          <Col span={10}>
            <div
                style={{
                    padding: '0 15px'
                }}
            >
              <h2>{product?.name}</h2>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  gap: "5px",
                  height: "30px",
                }}
              >
                <h4>Mã sản phẩm:</h4>
                <p>{product?.productID}</p>
                <p
                  style={{
                    marginLeft: "30px",
                    fontSize: "18px",
                    fontWeight: "bold",
                  }}
                >
                  <SyncOutlined
                    spin
                    style={{
                      marginRight: "5px",
                      color: "#52c41a",
                    }}
                  />
                  Miễn phí 1 đổi 1 trong 15 ngày
                </p>
              </div>
              <Divider
                style={{
                  margin: "10px 0",
                }}
              />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  alignItems: "st",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    gap: "5px",
                    marginBottom: "10px",
                  }}
                >
                  <CheckCircleTwoTone
                    twoToneColor="#52c41a"
                    style={{ color: "#52c41a" }}
                  />
                  CPU: {product?.cpu}
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    gap: "5px",
                    marginBottom: "10px",
                  }}
                >
                  <CheckCircleTwoTone
                    twoToneColor="#52c41a"
                    style={{ color: "#52c41a" }}
                  />
                  RAM: {product?.ram}GB
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    gap: "5px",
                    marginBottom: "10px",
                  }}
                >
                  <CheckCircleTwoTone
                    twoToneColor="#52c41a"
                    style={{ color: "#52c41a" }}
                  />
                  Ổ cứng: {product?.memory}GB SSD
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    gap: "5px",
                    marginBottom: "10px",
                  }}
                >
                  <CheckCircleTwoTone
                    twoToneColor="#52c41a"
                    style={{ color: "#52c41a" }}
                  />
                  VGA: {product?.gpu}
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    gap: "5px",
                    marginBottom: "10px",
                  }}
                >
                  <CheckCircleTwoTone
                    twoToneColor="#52c41a"
                    style={{ color: "#52c41a" }}
                  />
                  Màn hình: {product?.screenDimension}inh
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    gap: "5px",
                    marginBottom: "10px",
                  }}
                >
                  <CheckCircleTwoTone
                    twoToneColor="#52c41a"
                    style={{ color: "#52c41a" }}
                  />
                  Pin: {product?.battery} Wh
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    gap: "5px",
                    marginBottom: "10px",
                  }}
                >
                  <CheckCircleTwoTone
                    twoToneColor="#52c41a"
                    style={{ color: "#52c41a" }}
                  />
                  Cân nặng: {product?.weight} kg
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    gap: "5px",
                    marginBottom: "10px",
                  }}
                >
                  <CheckCircleTwoTone
                    twoToneColor="#52c41a"
                    style={{ color: "#52c41a" }}
                  />
                  Bảo hành: {product?.warranty}
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    gap: "5px",
                    marginBottom: "10px",
                  }}
                >
                  <CheckCircleTwoTone
                    twoToneColor="#52c41a"
                    style={{ color: "#52c41a" }}
                  />
                  Giao tiếp và kết nối: {product?.externalIOPort}
                </div>
              </div>
              <Space>
                <div
                  style={{
                    width: "705px",
                    backgroundColor: "#f1f1f1",
                    padding: "0 15px",
                    height: "190px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      gap: "40px",
                      height: "35px",
                    }}
                  >
                    <h4
                      style={{
                        display: "inline-block",
                        width: "150px",
                      }}
                    >
                      Giá niêm yết:
                    </h4>
                    <h4
                      style={{
                        textDecorationLine: "line-through",
                        fontSize: "24px",
                      }}
                    >
                      {product?.price.toLocaleString("en-US") + "₫"}
                    </h4>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      gap: "40px",
                      height: "35px",
                    }}
                  >
                    <h4
                      style={{
                        display: "inline-block",
                        width: "150px",
                      }}
                    >
                      Giá khuyến mại:
                    </h4>
                    <h4
                      style={{
                        color: "red",
                        fontSize: "28px",
                      }}
                    >
                      {discountedPrice.toLocaleString("en-US") + "₫"}
                    </h4>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      gap: "40px",
                      height: "35px",
                      marginTop: "20px",
                    }}
                  >
                    <h4
                      style={{
                        display: "inline-block",
                        width: "150px",
                      }}
                    >
                      Chấp nhận thanh toán:
                    </h4>
                    <div
                      style={{
                        color: "red",
                        fontSize: "24px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "5px",
                        height: "40px",
                        flexDirection: "column",
                        marginTop: "53px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                        //   justifyContent: "center",
                          alignItems: "center",
                          gap: "5px",
                          height: "40px",
                        }}
                      >
                        <p
                          style={{
                            fontSize: "16px",
                          }}
                        >
                          Thanh toán PAYPAL
                        </p>
                        <Avatar
                          shape="square"
                          src="https://play-lh.googleusercontent.com/bDCkDV64ZPT38q44KBEWgicFt2gDHdYPgCHbA3knlieeYpNqbliEqBI90Wr6Tu8YOw=w240-h480-rw"
                          icon={<UserOutlined />}
                        />
                      </div>
                      <div
                        style={{
                          display: "flex",
                        //   justifyContent: "center",
                          alignItems: "center",
                          gap: "5px",
                        }}
                      >
                        <p
                          style={{
                            fontSize: "16px",
                          }}
                        >
                          Thanh toán tiền mặt
                        </p>
                        <Avatar
                          shape="square"
                          src="https://png.pngtree.com/png-clipart/20200224/original/pngtree-cash-in-hand-icon-cartoon-style-png-image_5208190.jpg"
                          icon={<UserOutlined />}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Space>
              <div
                style={{
                  margin: "30px 0",
                }}
              ></div>
              <Button
                type="primary"
                block
                size="large"
                style={{
                  height: "56px",
                  backgroundColor: "#ce0707 !important",
                  borderColor: "#ce0707",
                }}
                className="custom-button"
                onClick={() => {
                  // setProduct(product)
                  handleAddToCart();
                }}
              >
                THÊM VÀO GIỎ HÀNG
              </Button>
              <div
                style={{
                  margin: "0 0 30px",
                }}
              ></div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <Button
                  type="primary"
                  block
                  size="large"
                  style={{
                    height: "56px",
                  }}
                >
                  GỌI MUA HÀNG: 0329465355
                </Button>
                <Button
                  type="primary"
                  block
                  size="large"
                  style={{
                    height: "56px",
                    backgroundColor: "white !important",
                    borderColor: "#ce0707",
                  }}
                  className="custom-btn-1"
                  onClick={handleAddToFavorite}
                >
                  THÊM VÀO YÊU THÍCH
                </Button>
              </div>
            </div>
          </Col>
          <Col span={6}>
            <div
                style={{
                    padding: '0 50px'
                }}
            >
                <Space
                  direction="vertical"
                  size="middle"
                  style={{
                    display: "flex",
                  }}
                >
                  <Card
                    className="card-product-custom"
                    title="Trợ giúp"
                    bordered={false}
                    style={{
                      width: 360,
                      height: 430,
                    }}
                  >
                    {dataList?.map(data => (
                      <div
                        style={{
                          //   flexDirection: "column",
                          display: "flex",
                          justifyContent: "flex-start",
                          gap: "5px",
                        }}
                      >
                        <p>{data.icon}</p>
                        <p>{data.name}</p>
                      </div>
                    ))}
                  </Card>
                  <Card
                    className="card-product-custom"
                    title="MUA HÀNG NHANH CHÓNG, TIỆN LỢI"
                    bordered={false}
                    style={{
                      width: 360,
                      height: 230,
                    }}
                  >
                    {dataListHelp?.map(data => (
                      <div
                        style={{
                          //   flexDirection: "column",
                          display: "flex",
                          justifyContent: "flex-start",
                          gap: "5px",
                        }}
                      >
                        <p>{data.icon}</p>
                        <p>{data.name}</p>
                      </div>
                    ))}
                  </Card>
                </Space>
            </div>
          </Col>
          <Divider orientation="left">MÔ TẢ SẢN PHẨM</Divider>
        </Row>
        <Row>
          <Col span={16}>
            <div>
              <h1>{product?.name}</h1>
            </div>
            <div>{product?.description}</div>
          </Col>
          <Col span={8}>
            <div
                style={{
                    padding: '0 0 0 136px'
                }}
            >
                <h3>
                  <ThunderboltOutlined />
                  KHUYẾN MẠI CỰC HOT ĐỪNG BỎ LỠ !!!
                </h3>
                <di sty>
                  {listImage.map((image, index) => (
                    <img src={image} key={index} width="500px" height="300px" />
                  ))}
                </di>
            </div>
          </Col>
          <Divider orientation="left">BÌNH LUẬN VỀ SẢN PHẨM</Divider>
        </Row>
        <Row>
          <Col span={16}>
            <CommentsProduct productID={id} />
          </Col>
          <Col span={8}></Col>
          <Divider />
        </Row>
        <Row>
          <Col span={24}>
            <ProductSameBrand />
          </Col>
        </Row>
      </div>
      <BigFooter />
      <Backdrop
        sx={{ color: "#fff", zIndex: theme => theme.zIndex.drawer + 1 }}
        open={openBackdrop}
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
          severity="success"
          sx={{ width: "100%" }}
        >
          Thêm thành công
        </Alert>
      </Snackbar>
    </Stack>
  );
};

export default DetailProduct;

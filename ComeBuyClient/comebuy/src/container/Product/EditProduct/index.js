import { Button, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { Grid, Stack, TextField } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { editProduct } from "../../../redux/slices/productSlice";
import { memo, useEffect, useState } from "react";
import style from "./style.js";
import Box from "@mui/material/Box";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper";
import { featureListSelector } from "../../../redux/selectors";
import { getAllFeature } from "../../../redux/slices/featureSlice";
import SnackBarAlert from "../../../components/SnackBarAlert";
import cloudinaryApi from "../../../api/cloudinaryAPI";
//icon styles
import BallotIcon from "@mui/icons-material/Ballot";
import MemoryIcon from "@mui/icons-material/Memory";
import ScreenshotMonitorIcon from "@mui/icons-material/ScreenshotMonitor";
import InventoryIcon from "@mui/icons-material/Inventory";
import CableIcon from "@mui/icons-material/Cable";
import AutofpsSelectIcon from "@mui/icons-material/AutofpsSelect";
import ChromeReaderModeIcon from "@mui/icons-material/ChromeReaderMode";
import Battery3BarIcon from "@mui/icons-material/Battery3Bar";
import ScaleIcon from "@mui/icons-material/Scale";
import DescriptionIcon from "@mui/icons-material/Description";
import TextFieldForEdit from "../../../components/TextFieldForEdit";
import GradientIcon from "@mui/icons-material/Gradient";
import PriceChangeIcon from "@mui/icons-material/PriceChange";
import LanguageIcon from "@mui/icons-material/Language";
import AddModeratorIcon from "@mui/icons-material/AddModerator";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import CottageIcon from "@mui/icons-material/Cottage";
import ImageForEditProduct from "../../../components/ImageForEditProduct";
import FeatureSelect from "../../../components/FeatureSelect/index.js";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import productImageAPI from "../../../api/productImageAPI";
import PreviewImagesModal from "../../../components/PreviewImagesModal";
import ImageNotSupportedIcon from "@mui/icons-material/ImageNotSupported";
import { productAPI } from "../../../api";
import { ConstructionOutlined } from "@mui/icons-material";

const EditProduct = () => {
  const location = useLocation();
  const product = location.state;
  console.log("🚀 ~ file: index.js:45 ~ EditProduct ~ product:", product);
  const _featureList = useSelector(featureListSelector);
  const [openSuccessAlert, setOpenSuccessAlert] = useState(false);
  const [openErrorAlert, setOpenErrorAlert] = useState(false);
  const [messageError, setMessageError] = useState("No Error");
  const [messageSuccess, setMessageSuccess] = useState("Notification");
  const [featureList, setFeatureList] = useState(_featureList); /// All of features
  const [currentFeature, setCurrentFeature] = useState(
    product?.feature?.map(item => item.name)
  ); ///feature of current product
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleClose = (event, reason) => {
    if (reason === "clickaway") return;
    setOpenSuccessAlert(false);
    setOpenErrorAlert(false);
  };

  // properties for edit product
  const [name, SetName] = useState(product?.name);
  const [brand, SetBrand] = useState(product?.brand);
  const [cpu, SetCPU] = useState(product?.cpu);
  const [ram, SetRam] = useState(product?.ram);
  const [gpu, SetGPU] = useState(product?.gpu);
  const [memory, SetMemory] = useState(product?.memory);
  const [description, SetDescription] = useState(product?.description);
  const [screenDimension, SetScreenDimension] = useState(
    product?.screenDimension
  );
  const [battery, SetBattery] = useState(product?.battery);
  const [weight, SetWeight] = useState(product?.weight);
  const [origin, SetOrigin] = useState(product?.origin);
  const [externalIOPort, SetExternalIOPort] = useState(product?.externalIOPort);
  const [colorCoverage, SetColorCoverage] = useState(product?.colorCoverage);
  const [warranty, SetWarranty] = useState(product?.warranty);
  const [year, SetYear] = useState(product?.year);
  const [price, SetPrice] = useState(product?.price);
  const [productImages, SetProductImages] = useState(product?.productimage);
  const [previewSource, SetPreviewSource] = useState([]);
  const [openPreviewModal, SetOpenPreviewModal] = useState(false);

  const handleImageChange = async e => {
    if (e.target.files) {
      const listFile = [];
      for (let i = 0; i < e.target.files.length; i++) {
        let reader = new FileReader();
        reader.readAsDataURL(e.target.files[i]);
        reader.onloadend = () => {
          listFile.push(reader.result);
          if (i == e.target.files.length - 1) SetPreviewSource(listFile);
        };
      }
    }
  };

  const handleUploadImages = async () => {
    if (!previewSource) return;
    try {
      const response = await cloudinaryApi.uploadImages(
        JSON.stringify({ data: previewSource })
      );
      if (response) {
        setMessageSuccess("Upload Images Product To Storage Successfully");
        setOpenSuccessAlert(true);
        SetOpenPreviewModal(false);
        const newImagesList = [];
        response.data.map(imgurl => {
          newImagesList.push({
            imageURL: imgurl,
            productid: product?.productID,
          });
        });
        SetProductImages(productImages.concat(newImagesList));
      } else {
        setMessageError("Upload Images Product Failed");
        setOpenErrorAlert(true);
      }
    } catch (err) {
      setMessageError("Upload Images Product Failed");
      setOpenErrorAlert(true);
    }
  };

  useEffect(() => {
    if (previewSource.length >= 1) {
      SetOpenPreviewModal(true);
    }
  }, [previewSource]);

  const handleValueChange = event => {
    switch (event.target.name) {
      case "Tên sản phẩm":
        SetName(event.target.value);
        break;
      case "CPU":
        SetCPU(event.target.value);
        break;
      case "GPU":
        SetGPU(event.target.value);
        break;
      case "Màn hình":
        SetScreenDimension(event.target.value);
        break;
      case "Độ phủ màu":
        SetColorCoverage(event.target.value);
        break;
      case "Ổ cứng":
        SetMemory(event.target.value);
        break;
      case "Giao tiếp và kết nối":
        SetExternalIOPort(event.target.value);
        break;
      case "RAM":
        SetRam(event.target.value);
        break;
      case "Nhà sản xuất":
        SetBrand(event.target.value);
        break;
      case "Giá":
        SetPrice(event.target.value);
        break;
      case "Bảo hành":
        SetWarranty(event.target.value);
        break;
      case "Xuất xứ":
        SetOrigin(event.target.value);
        break;
      case "Cân nặng":
        SetWeight(event.target.value);
        break;
      case "Pin":
        SetBattery(event.target.value);
        break;
      case "Mô tả chi tiết":
        SetDescription(event.target.value);
        break;
      case "Năm sản xuất":
        SetYear(event.target.value);
        break;
    }
  };

  const deleteImage = image => {
    SetProductImages(
      productImages.filter(img => {
        if (img.productImageID != image.productImageID) return img;
      })
    );
  };

  const handleFeatureChosen = event => {
    const {
      target: { value },
    } = event;
    setCurrentFeature(typeof value === "string" ? value.split(",") : value);
  };

  const UpdateImages = async () => {
    const response = await productImageAPI.deleteImagesOfProduct(
      product?.productID
    );
    if (response != undefined && response.status == 200) {
      const response_2 = await productImageAPI.addMany(
        productImages.map(item => {
          return Object.assign(item, { productid: product?.productID });
        })
      );
      return response_2.status == 200 ? true : false;
    } else {
      console.log("Error update images");
      return false;
    }
  };

  const UpdateSpecifications = () => {
    const newProduct = {
      productID: product?.productID,
      ram: ram,
      memory: memory,
      gpu: gpu,
      cpu: cpu,
      name: name,
      brand: brand,
      description: description,
      weight: weight,
      origin: origin,
      screenDimension: screenDimension,
      colorCoverage: colorCoverage,
      price: price,
      externalIOPort: externalIOPort,
      battery: battery,
      warranty: warranty,
      promotion: product?.promotion,
      year: year,
    };
    console.log(
      "🚀 ~ file: index.js:218 ~ UpdateSpecifications ~ newProduct:",
      newProduct
    );
    dispatch(editProduct(newProduct))
      .unwrap()
      .then(originalPromiseResult => {
        setMessageSuccess("Cập nhật thành công");
        setOpenSuccessAlert(true);
      })
      .catch(rejectedValueOrSerializedError => {
        setMessageError("Edit Product Failed");
        setOpenErrorAlert(true);
      });
  };

  const ConvertToFeatureIDList = _featureList => {
    const converted_List = currentFeature.map(value => {
      return featureList.filter(item => item.name == value)[0].featureID;
    });
    return converted_List;
  };

  const UpdateFeature = async () => {
    if (product?.feature.length !== currentFeature.length) {
      const response = await productAPI.deleteAndUpdate_Feature(
        product?.productID,
        ConvertToFeatureIDList(currentFeature)
      );
      if (response.status === 200) {
        console.log("Update Feature Successfully");
        return true;
      } else {
        console.log("Update Feature Failed");
        return false;
      }
    } else {
      for (let i = 0; i < currentFeature.length; i++) {
        if (currentFeature[i] != product?.feature[i]) {
          const response = await productAPI.deleteAndUpdate_Feature(
            product?.productID,
            ConvertToFeatureIDList(currentFeature)
          );
          if (response.status == 200) {
            console.log("Update Feature Successfully");
            return true;
          } else {
            console.log("Update Feature Failed");
            return false;
          }
        }
      }
      return true;
    }
  };

  const SaveChange = async () => {
    let isCheck = true;
    if (
      productImages.length === product?.productimage.length &&
      product?.feature.length === currentFeature.length
    ) {
      console.log("first218");
      for (let i = 0; i < productImages.length; i++) {
        if (productImages[i] !== product?.productimage[i]) {
          console.log("first21811");

          ///// check status of updating images and features successfully or not
          //// Flow -> update images -> update feature -> update specification
          if (UpdateImages() && (await UpdateFeature())) {
            isCheck = false;
            UpdateSpecifications();
          } else {
            isCheck = false;
            setMessageError("Edit Product Failed");
            setOpenErrorAlert(true);
          }
          break;
        }
      }
      if (isCheck) UpdateSpecifications();
    } else if (UpdateImages() && (await UpdateFeature()))
      UpdateSpecifications();
    else {
      setMessageError("Edit Product Failed");
      setOpenErrorAlert(true);
    }
  };

  useEffect(() => {
    dispatch(getAllFeature())
      .unwrap()
      .then(originalPromiseResult => {
        setFeatureList(originalPromiseResult);
        setMessageSuccess("Thành công");
        setOpenSuccessAlert(true);
      })
      .catch(rejectedValueOrSerializedError => {
        setMessageError("Load Feature Failed");
        setOpenErrorAlert(true);
      });
  }, []);

  useEffect(() => {
    setCurrentFeature(product?.feature.map(item => item.name));
    SetName(product?.name);
    SetBattery(product?.battery);
    SetBrand(product?.brand);
    SetCPU(product?.cpu);
    SetGPU(product?.gpu);
    SetExternalIOPort(product?.externalIOPort);
    SetWeight(product?.weight);
    SetColorCoverage(product?.colorCoverage);
    SetDescription(product?.description);
    SetMemory(product?.memory);
    SetOrigin(product?.origin);
    SetPrice(product?.price);
    SetProductImages(product?.productimage);
    SetRam(product?.ram);
    SetYear(product?.year);
    SetWarranty(product?.warranty);
    SetScreenDimension(product?.screenDimension);
  }, [product]);

  return (
    <Stack sx={style.boxContainer}>
      <Box sx={style.boxInfor}>
        <Stack
          direction="row"
          spacing={1}
          padding={1}
          sx={style.boxInfor_Stack}
        >
          <BallotIcon />
          <Typography variant="h6" fontWeight="bold">
            Chỉnh sửa thông số kỹ thuật
          </Typography>
        </Stack>
        <PreviewImagesModal
          open={openPreviewModal}
          onSubmit={handleUploadImages}
          onClose={() => SetOpenPreviewModal(false)}
          images={previewSource}
        ></PreviewImagesModal>
        <Box
          sx={{ backgroundColor: "#8F8EBF", height: 5, width: "100%" }}
        ></Box>
        <Typography variant="h6" fontWeight="bold">
          Hình ảnh
        </Typography>
        {productImages?.length > 0 ? (
          <Swiper
            slidesPerView={1}
            modules={[Pagination]}
            spaceBetween={30}
            pagination={true}
          >
            {productImages?.map((item, i) => (
              <SwiperSlide key={i}>
                <ImageForEditProduct image={item} deleteImage={deleteImage} />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <Stack
            sx={{
              backgroundColor: "#5F5DA6",
              padding: 2,
              margin: 3,
              borderRadius: 5,
            }}
          >
            <Typography
              sx={{ alignSelf: "center", color: "white", margin: 2 }}
              variant="h6"
              fontWeight="bold"
            >
              No Images
            </Typography>
          </Stack>
        )}
        <Button
          component="label"
          sx={style.AddImageButton}
          endIcon={<AddPhotoAlternateIcon />}
        >
          <Typography variant="overline" fontWeight="bold">
            Tải ảnh sản phẩm
          </Typography>
          <input
            multiple
            accept="image/*"
            type="file"
            hidden
            onChange={handleImageChange}
          />
        </Button>
        <Grid sx={{ marginTop: 5 }} container>
          <Grid item xs={12}>
            <FeatureSelect
              item="true"
              features={featureList}
              currentFeature={currentFeature}
              handleFeatureChange={handleFeatureChosen}
            />
          </Grid>
          <Grid item xs={6} paddingLeft={2}>
            <Stack item="true" xs={12} spacing={2} padding={2}>
              <TextFieldForEdit
                Icon={<DriveFileRenameOutlineIcon />}
                Text={name}
                Title="Tên sản phẩm"
                onChange={handleValueChange}
              />
              <Box sx={style.boxinfor_Stack_Line}></Box>
              <TextFieldForEdit
                Icon={<MemoryIcon />}
                Text={cpu}
                Title="CPU"
                onChange={handleValueChange}
              />
              <Box sx={style.boxinfor_Stack_Line}></Box>
              <TextFieldForEdit
                Icon={<ScreenshotMonitorIcon />}
                Text={screenDimension}
                Title="Màn hình"
                onChange={handleValueChange}
              />
              <Box sx={style.boxinfor_Stack_Line}></Box>
              <TextFieldForEdit
                Icon={<InventoryIcon />}
                Text={memory}
                Title="Ổ cứng"
                onChange={handleValueChange}
              />
              <Box sx={style.boxinfor_Stack_Line}></Box>
              <TextFieldForEdit
                Icon={<CableIcon />}
                Text={externalIOPort}
                Title="Giao tiếp và kết nối"
                onChange={handleValueChange}
              />
              <Box sx={style.boxinfor_Stack_Line}></Box>
              <TextFieldForEdit
                Icon={<LanguageIcon />}
                Text={origin}
                Title="Xuất xứ"
                onChange={handleValueChange}
              />
              <Box sx={style.boxinfor_Stack_Line}></Box>
              <TextFieldForEdit
                Icon={<AddModeratorIcon />}
                Text={warranty}
                Title="Bảo hành"
                onChange={handleValueChange}
              />
              <Box sx={style.boxinfor_Stack_Line}></Box>
            </Stack>
          </Grid>
          <Grid item xs={6} paddingLeft={2}>
            <Stack item="true" xs={12} spacing={2} padding={2}>
              <TextFieldForEdit
                Icon={<CottageIcon />}
                Text={brand}
                Title="Nhà sản xuất"
                onChange={handleValueChange}
              />
              <Box sx={style.boxinfor_Stack_Line}></Box>
              <TextFieldForEdit
                Icon={<AutofpsSelectIcon />}
                Text={ram}
                Title="RAM (GB)"
                onChange={handleValueChange}
              />
              <Box sx={style.boxinfor_Stack_Line}></Box>
              <TextFieldForEdit
                Icon={<ChromeReaderModeIcon />}
                Text={gpu}
                Title="GPU"
                onChange={handleValueChange}
              />
              <Box sx={style.boxinfor_Stack_Line}></Box>
              <TextFieldForEdit
                Icon={<Battery3BarIcon />}
                Text={battery}
                Title="Pin (Whr)"
                onChange={handleValueChange}
              />
              <Box sx={style.boxinfor_Stack_Line}></Box>
              <TextFieldForEdit
                Icon={<ScaleIcon />}
                Text={weight}
                Title="Cân nặng (kg)"
                onChange={handleValueChange}
              />
              <Box sx={style.boxinfor_Stack_Line}></Box>
              <TextFieldForEdit
                Icon={<GradientIcon />}
                Text={colorCoverage}
                Title="Độ phủ màu (RGBs)"
                onChange={handleValueChange}
              />
              <Box sx={style.boxinfor_Stack_Line}></Box>
              <TextFieldForEdit
                Icon={<PriceChangeIcon />}
                Text={price}
                Title="Giá (VNĐ)"
                onChange={handleValueChange}
              />
              <Box sx={style.boxinfor_Stack_Line}></Box>
              <TextFieldForEdit
                Icon={<PriceChangeIcon />}
                Text={year}
                Title="Năm sản xuất"
                onChange={handleValueChange}
              />
              <Box sx={style.boxinfor_Stack_Line}></Box>
            </Stack>
          </Grid>
          <Grid item xs={12} paddingLeft={2} paddingTop={2}>
            <Stack item="true" xs={12} spacing={1}>
              <Stack direction="row" spacing={1}>
                <DescriptionIcon />
                <Typography fontWeight="bold">Mô tả chi tiết</Typography>
              </Stack>
              <TextField
                label="Mô tả chi tiết"
                name="Mô tả chi tiết"
                multiline
                placeholder={product?.description}
                defaultValue={product?.description}
                variant="standard"
                onChange={handleValueChange}
              />
            </Stack>
            <Box item="true" sx={style.boxinfor_Stack_Line}></Box>
          </Grid>
          <Grid item xs={12} paddingLeft={2} paddingTop={2}></Grid>
        </Grid>
        <Stack
          sx={{ width: "100%", justifyContent: "center" }}
          direction="row"
          spacing={3}
        >
          <Button
            sx={style.BackButton}
            variant="contained"
            onClick={() => navigate("/product")}
          >
            Hủy
          </Button>
          <Button
            sx={style.SaveButton}
            variant="contained"
            onClick={SaveChange}
          >
            Lưu
          </Button>
        </Stack>
      </Box>

      {/* Alert init */}
      <SnackBarAlert
        severity="success"
        open={openSuccessAlert}
        handleClose={handleClose}
        message={messageSuccess}
      />
      <SnackBarAlert
        severity="error"
        open={openErrorAlert}
        handleClose={handleClose}
        message={messageError}
      />
    </Stack>
  );
};

export default memo(EditProduct);

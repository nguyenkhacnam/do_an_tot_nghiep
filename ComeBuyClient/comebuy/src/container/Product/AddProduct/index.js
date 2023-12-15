import { Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Grid, Stack, TextField } from '@mui/material'
import { useDispatch, useSelector } from "react-redux";
import { memo, useEffect, useState } from "react";
import style from './style.js'
import Box from '@mui/material/Box';
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper";
import { featureListSelector } from "../../../redux/selectors";
import { getAllFeature } from "../../../redux/slices/featureSlice";
import { getAllProduct } from "../../../redux/slices/productSlice";
import SnackBarAlert from "../../../components/SnackBarAlert";
import cloudinaryApi from "../../../api/cloudinaryAPI"
//icon styles
import AddBoxIcon from '@mui/icons-material/AddBox';
import MemoryIcon from '@mui/icons-material/Memory';
import ScreenshotMonitorIcon from '@mui/icons-material/ScreenshotMonitor';
import InventoryIcon from '@mui/icons-material/Inventory';
import CableIcon from '@mui/icons-material/Cable';
import AutofpsSelectIcon from '@mui/icons-material/AutofpsSelect';
import ChromeReaderModeIcon from '@mui/icons-material/ChromeReaderMode';
import Battery3BarIcon from '@mui/icons-material/Battery3Bar';
import ScaleIcon from '@mui/icons-material/Scale';
import DescriptionIcon from '@mui/icons-material/Description';
import GradientIcon from '@mui/icons-material/Gradient';
import PriceChangeIcon from '@mui/icons-material/PriceChange';
import LanguageIcon from '@mui/icons-material/Language';
import AddModeratorIcon from '@mui/icons-material/AddModerator';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import CottageIcon from '@mui/icons-material/Cottage';
import ImageForEditProduct from "../../../components/ImageForEditProduct";
import FeatureSelect from "../../../components/FeatureSelect/index.js";
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import productImageAPI from "../../../api/productImageAPI";
import PreviewImagesModal from "../../../components/PreviewImagesModal";
import { productAPI } from "../../../api";
import TextFieldForAdd from "../../../components/TextFieldForAdd";
import { ConfirmDialog } from "../../../components";
import accountApi from "../../../api/accountAPI.js";
import { accountSlice } from "../../../redux/slices/accountSlice.js";

const AddProduct = () => {
    const dispatch = useDispatch()
    const _featureList = useSelector(featureListSelector)
    const [openSuccessAlert, setOpenSuccessAlert] = useState(false);
    const [openErrorAlert, setOpenErrorAlert] = useState(false);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false)
    const [messageError, setMessageError] = useState("No Error")
    const [messageSuccess, setMessageSuccess] = useState("Notification")
    const [featureList, setFeatureList] = useState(_featureList);  /// All of features 
    const [currentFeature, setCurrentFeature] = useState([])  ///feature of current product
    const navigate = useNavigate()

    const handleClose = (event, reason) => {
        if (reason === 'clickaway')
            return;
        setOpenSuccessAlert(false)
        setOpenErrorAlert(false)
        setOpenConfirmDialog(false)
    };

    // properties for edit product
    const [name, SetName] = useState("")
    const [brand, SetBrand] = useState("")
    const [cpu, SetCPU] = useState("")
    const [ram, SetRam] = useState("")
    const [gpu, SetGPU] = useState("")
    const [memory, SetMemory] = useState("")
    const [description, SetDescription] = useState("")
    const [screenDimension, SetScreenDimension] = useState("")
    const [battery, SetBattery] = useState("")
    const [weight, SetWeight] = useState("")
    const [origin, SetOrigin] = useState("")
    const [externalIOPort, SetExternalIOPort] = useState("")
    const [colorCoverage, SetColorCoverage] = useState("")
    const [warranty, SetWarranty] = useState("")
    const [price, SetPrice] = useState("")
    const [productImages, SetProductImages] = useState([])
    const [previewSource, SetPreviewSource] = useState([])
    const [year, SetYear] = useState("")
    const [openPreviewModal, SetOpenPreviewModal] = useState(false)


    const handleImageChange = async (e) => {
        if (e.target.files) {
            const listFile = []
            for (let i = 0; i < e.target.files.length; i++) {
                let reader = new FileReader();
                reader.readAsDataURL(e.target.files[i])
                reader.onloadend = () => {
                    listFile.push(reader.result);
                    if (i == e.target.files.length - 1)
                        SetPreviewSource(listFile)
                }
            }
        }
    };

    const handleUploadImages = async () => {
        if (!previewSource) return
        try {
            const response = await cloudinaryApi.uploadImages(JSON.stringify({ data: previewSource }))
            if (response) {
                setMessageSuccess("Upload Images Product To Storage Successfully")
                setOpenSuccessAlert(true)
                SetOpenPreviewModal(false)
                const newImagesList = []
                response.data.map((imgurl) => {
                    newImagesList.push({
                        imageURL: imgurl
                    })
                })
                SetProductImages(productImages.concat(newImagesList))
            }
            else {
                setMessageError("Upload Images Product Failed")
                setOpenErrorAlert(true)
            }
        }
        catch (err) {
            setMessageError("Upload Images Product Failed")
            setOpenErrorAlert(true)
        }
    }

    useEffect(() => {
        if (previewSource.length >= 1) {
            SetOpenPreviewModal(true)
        }
    }, [previewSource])

    const handleValueChange = (event) => {
        switch (event.target.name) {
            case 'Name':
                SetName(event.target.value)
                break
            case 'CPU':
                SetCPU(event.target.value)
                break
            case 'GPU':
                SetGPU(event.target.value)
                break
            case 'Screen Dimension':
                SetScreenDimension(event.target.value)
                break
            case 'Color Coverage':
                SetColorCoverage(event.target.value)
                break
            case 'Store':
                SetMemory(event.target.value)
                break
            case 'External IO Port':
                SetExternalIOPort(event.target.value)
                break
            case 'RAM':
                SetRam(event.target.value)
                break
            case 'Brand':
                SetBrand(event.target.value)
                break
            case 'Price':
                SetPrice(event.target.value)
                break
            case 'Warranty':
                SetWarranty(event.target.value)
                break
            case 'Origin':
                SetOrigin(event.target.value)
                break
            case 'Weight':
                SetWeight(event.target.value)
                break
            case 'Battery':
                SetBattery(event.target.value)
                break
            case 'Description':
                SetDescription(event.target.value)
                break
            case 'Year':
                SetYear(event.target.value)
                break
        }
    };

    const deleteImage = (image) => {
        SetProductImages(productImages.filter((img) => {
            if (img.imageURL != image.imageURL)
                return img
        }));
    }

    const handleFeatureChosen = (event) => {
        const {
            target: { value },
        } = event;
        setCurrentFeature(
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    const AddImages = async (productID, images) => {
        const response = await productImageAPI.addMany(images)
        return response.status == 200 ? true : false
    };

    const ConvertToFeatureIDList = (_featureList) => {
        const converted_List = currentFeature.map((value) => {
            return featureList.filter((item) => (item.name == value))[0].featureID
        })
        return converted_List;
    }

    const AddFeature = async (productID) => {
        const response = await productAPI.deleteAndUpdate_Feature(productID, ConvertToFeatureIDList(currentFeature))
        if (response.status == 200) {
            return true;
        }
        else {
            console.log("Add Feature Failed")
            return false
        }
    }

    const ClearDataAndUpdateStore = () => {
        dispatch(getAllProduct())
            .unwrap()
            .then((originalPromiseResult) => {
                navigate("/product")
            })
            .catch((rejectedValueOrSerializedError) => {

            })
    }

    const handleAddProduct = async () => {
        setOpenConfirmDialog(false)
        const newProduct = {
            "name": name,
            "description": description,
            "ram": ram,
            "memory": memory,
            "gpu": gpu,
            "cpu": cpu,
            "brand": brand,
            "weight": weight,
            "origin": origin,
            "screenDimension": screenDimension,
            "colorCoverage": colorCoverage,
            "externalIOPort": externalIOPort,
            "battery": battery,
            "warranty": warranty,
            "promotion": '0',
            "price": price,
            "year": year,
            "keyIndex": 0,
        }

        try {
            const result = await productAPI.createNewProduct(newProduct)
            if (result.status === 200) {
                const images = productImages.map((item) => {
                    return { ...item, productid: result.data.productID }
                })
                if (await AddFeature(result.data.productID)) {
                    if (await AddImages(result.data.productID, images)) {
                        setMessageSuccess("Add New Product Successfully")
                        setOpenSuccessAlert(true)
                        ClearDataAndUpdateStore()
                    }
                    else {
                        setMessageError("Load Images Failed")
                        setOpenErrorAlert(true)
                    }

                }
                else {
                    setMessageError("Load Feature Failed")
                    setOpenErrorAlert(true)
                }

            }
            else {
                setMessageError("Add Product Failed")
                setOpenErrorAlert(true)
            }
        }
        catch (e) {
            console.log(e)
        }


    }

    useEffect(() => {
        dispatch(getAllFeature())
            .unwrap()
            .then((originalPromiseResult) => {
                setFeatureList(originalPromiseResult)
                setMessageSuccess("Thành công")
                setOpenSuccessAlert(true)
            })
            .catch((rejectedValueOrSerializedError) => {
                setMessageError("Load Feature Failed")
                setOpenErrorAlert(true)
            })
    }, [])



    return (
        <Stack
            sx={style.boxContainer}>
            <Box sx={style.boxInfor}>
                <Stack
                    direction="row"
                    spacing={1}
                    padding={1}
                    sx={style.boxInfor_Stack}>
                    <AddBoxIcon />
                    <Typography variant='h6' fontWeight='bold'>Add New Product</Typography>
                </Stack>
                <PreviewImagesModal open={openPreviewModal} onSubmit={handleUploadImages} onClose={() => SetOpenPreviewModal(false)} images={previewSource}></PreviewImagesModal>
                <Box sx={{ backgroundColor: '#8F8EBF', height: 5, width: '100%' }}></Box>
                <Typography variant='h6' fontWeight='bold'>Images</Typography>
                {
                    productImages.length > 0 ?
                        <Swiper slidesPerView={1} modules={[Pagination]} spaceBetween={30} pagination={true}>
                            {
                                productImages.map((item, i) => (
                                    <SwiperSlide key={i}>
                                        <ImageForEditProduct image={item} deleteImage={deleteImage} />
                                    </SwiperSlide>
                                ))
                            }
                        </Swiper>
                        :
                        <Stack sx={{ backgroundColor: '#5F5DA6', padding: 2, margin: 3, borderRadius: 5 }}>
                            <Typography sx={{ alignSelf: 'center', color: 'white', margin: 2 }} variant='h6' fontWeight='bold'>No Images</Typography>
                        </Stack>
                }
                <Button component="label" sx={style.AddImageButton} endIcon={<AddPhotoAlternateIcon />}>
                    <Typography variant="overline" fontWeight="bold">Upload Image</Typography>
                    <input multiple accept="image/*" type="file" hidden onChange={handleImageChange} />
                </Button>
                <Grid sx={{ marginTop: 5 }} container>
                    <Grid item xs={12}>
                        <FeatureSelect item="true" features={featureList} currentFeature={currentFeature} handleFeatureChange={handleFeatureChosen} />
                    </Grid>
                    <Grid item xs={6} paddingLeft={2}>
                        <Stack item="true" xs={12} spacing={2} padding={2}>
                            <TextFieldForAdd inputConfig="text" Icon={<DriveFileRenameOutlineIcon />} Text={name} Title='Name' onChange={handleValueChange} />
                            <Box sx={style.boxinfor_Stack_Line}></Box>
                            <TextFieldForAdd inputConfig="text" Icon={<MemoryIcon />} Text={cpu} Title='CPU' onChange={handleValueChange} />
                            <Box sx={style.boxinfor_Stack_Line}></Box>
                            <TextFieldForAdd inputConfig="number" Icon={<ScreenshotMonitorIcon />} Text={screenDimension} Title='Screen Dimension (inch)' onChange={handleValueChange} />
                            <Box sx={style.boxinfor_Stack_Line}></Box>
                            <TextFieldForAdd inputConfig="number" Icon={<InventoryIcon />} Text={memory} Title='Store (SSD)' onChange={handleValueChange} />
                            <Box sx={style.boxinfor_Stack_Line}></Box>
                            <TextFieldForAdd inputConfig="text" Icon={<CableIcon />} Text={externalIOPort} Title='External IO Port' onChange={handleValueChange} />
                            <Box sx={style.boxinfor_Stack_Line}></Box>
                            <TextFieldForAdd inputConfig="text" Icon={<LanguageIcon />} Text={origin} Title='Origin' onChange={handleValueChange} />
                            <Box sx={style.boxinfor_Stack_Line}></Box>
                            <TextFieldForAdd inputConfig="text" Icon={<AddModeratorIcon />} Text={warranty} Title='Warranty' onChange={handleValueChange} />
                            <Box sx={style.boxinfor_Stack_Line}></Box>
                        </Stack>
                    </Grid>
                    <Grid item xs={6} paddingLeft={2}>
                        <Stack item="true" xs={12} spacing={2} padding={2}>
                            <TextFieldForAdd inputConfig="text" Icon={<CottageIcon />} Text={brand} Title='Brand' onChange={handleValueChange} />
                            <Box sx={style.boxinfor_Stack_Line}></Box>
                            <TextFieldForAdd inputConfig="number" Icon={<AutofpsSelectIcon />} Text={ram} Title='RAM (GB)' onChange={handleValueChange} />
                            <Box sx={style.boxinfor_Stack_Line}></Box>
                            <TextFieldForAdd inputConfig="text" Icon={<ChromeReaderModeIcon />} Text={gpu} Title="GPU" onChange={handleValueChange} />
                            <Box sx={style.boxinfor_Stack_Line}></Box>
                            <TextFieldForAdd inputConfig="number" Icon={<Battery3BarIcon />} Text={battery} Title="Battery (Whr)" onChange={handleValueChange} />
                            <Box sx={style.boxinfor_Stack_Line}></Box>
                            <TextFieldForAdd inputConfig="number" Icon={<ScaleIcon />} Text={weight} Title="Weight (kg)" onChange={handleValueChange} />
                            <Box sx={style.boxinfor_Stack_Line}></Box>
                            <TextFieldForAdd inputConfig="number" Icon={<GradientIcon />} Text={colorCoverage} Title="Color Coverage (RGBs)" onChange={handleValueChange} />
                            <Box sx={style.boxinfor_Stack_Line}></Box>
                            <TextFieldForAdd inputConfig="number" Icon={<PriceChangeIcon />} Text={price} Title="Price (USD)" onChange={handleValueChange} />
                            <Box sx={style.boxinfor_Stack_Line}></Box>
                            <TextFieldForAdd inputConfig="number" Icon={<AccessTimeIcon />} Text={year} Title="Year" onChange={handleValueChange} />
                            <Box sx={style.boxinfor_Stack_Line}></Box>
                        </Stack>
                    </Grid>
                    <Grid item xs={12} paddingLeft={2} paddingTop={2}>
                        <Stack item="true" xs={12} spacing={1}>
                            <Stack
                                direction="row"
                                spacing={1}>
                                <DescriptionIcon />
                                <Typography fontWeight='bold'>Description</Typography>
                            </Stack>
                            <TextField
                                name='Description'
                                label='Description'
                                multiline
                                placeholder={""}
                                defaultValue={""}
                                onChange={handleValueChange}
                                variant="standard"
                            />
                        </Stack>
                        <Box item="true" sx={style.boxinfor_Stack_Line}></Box>
                    </Grid>
                    <Grid item xs={12} paddingLeft={2} paddingTop={2}>
                    </Grid>
                </Grid>
                <Stack sx={{ width: '100%', justifyContent: 'center' }} direction='row' spacing={3}>
                    <Button sx={style.BackButton} variant="contained" onClick={() => navigate('/product')}>Back</Button>
                    <Button sx={style.SaveButton} variant="contained" onClick={() => setOpenConfirmDialog(true)}>Save</Button>
                </Stack>
            </Box>

            {/* Alert init */}
            <SnackBarAlert severity='success' open={openSuccessAlert} handleClose={handleClose} message={messageSuccess} />
            <SnackBarAlert severity='error' open={openErrorAlert} handleClose={handleClose} message={messageError} />
            <ConfirmDialog
                body="Please check the product information again to make sure. This operation cannot be redo. If you are sure, please confirm!"
                title="Confirm Action?"
                open={openConfirmDialog} handleClose={handleClose} handleConfirm={handleAddProduct} />
        </Stack>
    )
}

export default memo(AddProduct);
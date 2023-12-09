import { Backdrop, Button, CircularProgress, Grid, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import bannerApi from "../../api/bannerAPI";
import cloudinaryApi from "../../api/cloudinaryAPI";
import AddBannerModal from "../AddBannerModal";
import BannerItem from "./child";

const BannerManage = () => {
    const [banners, SetBanners] = useState([])
    const [openModal, SetOpenModal] = useState(false)
    const [type, SetType] = useState(1)
    const [loading, SetLoading] = useState(false)
    useEffect(async () => {
        await LoadNewData()
    }, [])

    const LoadNewData = async () => {
        const response = await bannerApi.getAll()
        if (response.status == 200)
            SetBanners(response.data)
        else console.log("Load banner failed");
    }

    const HandleCreateNewBanner = async (url) => {
        const response = await bannerApi.createNewBanner({ url: url })
        if (response.status = 200) {
            SetLoading(false)
            await LoadNewData();
        }
        else {
            SetLoading(false)
            console.log.apply('Upload Image Failed')
        }
    }

    const DeleteBanner = async (id) => {
        SetLoading(true)
        const response = await bannerApi.deleteBannerById(id)
        if (response.status = 200) {
            SetLoading(false)
            await LoadNewData();
        }
        else {
            SetLoading(false)
            console.log.apply('Delete Banner Failed')
        }
    }

    const UploadNewBanner = async (value1, value2) => {
        SetOpenModal(false)
        SetLoading(true)
        if (type == 2) {
            const data = [value1]
            try {
                const response = await cloudinaryApi.uploadBigImages(JSON.stringify({ data: data }))
                if (response.status = 200) {
                    await HandleCreateNewBanner(response.data[0])
                }
                else {
                    console.log('Upload to Cloudinary Failed')
                    SetLoading(false)
                }
            }
            catch (err) {
                console.log(err);
                SetLoading(false)
            }
        }
        else await HandleCreateNewBanner(value2)
    }
    return (
        <Stack
            justifyContent="center"
            alignItems="center"
        >
            <Typography variant="h5" fontWeight={'bold'}>Banner Management</Typography>
            <Button sx={{
                width: 150,
                backgroundColor: '#2E1534',
                color: 'white',
                alignSelf: 'end',
                borderRadius: 3,
                marginRight: 15,
                marginBottom: 7,
                marginTop: 5,
                '&:hover': {
                    backgroundColor: 'black',
                    color: 'white',
                }
            }} onClick={() => SetOpenModal(true)}>Add Banner</Button>
            <Stack
                direction={'row'}
                justifyContent="center"
                flexWrap={'wrap'}
                rowGap={3}
                spacing={3}
                sx={{ width: '100%' }}
            >
                {
                    banners.map(item => (
                        <BannerItem HandleDelete={DeleteBanner} key={item.bannerID} item={item}></BannerItem>
                    ))
                }
            </Stack>
            {
                openModal &&
                <AddBannerModal
                    open={openModal}
                    SetOpenModal={SetOpenModal}
                    SetType={SetType}
                    type={type}
                    UploadNewBanner={UploadNewBanner}
                />
            }
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </Stack>

    )
}
export default BannerManage;
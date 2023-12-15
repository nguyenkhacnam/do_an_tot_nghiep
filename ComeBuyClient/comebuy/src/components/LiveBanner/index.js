
import { BrandNavBar, Slider, NavBar, BrandLine, FeatureBar } from '../../components'
import { styled } from '@mui/material/styles';
import { Grid, Stack } from '@mui/material';
import { Typography } from '@mui/material';
import Button from '@mui/material/Button';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import "./style.css";

const ImgFeatureLine = styled('img')(({ theme }) => ({
    width: '70%',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    borderRadius: 10,
    boxShadow: 10,


    [theme.breakpoints.down('sm')]: {
        display: 'none',
    },

}));

const Container = styled(Stack)(({ theme }) => ({
    spacing: 2,
    display: 'flex',
    height: 650,
    position: 'relative',
    justifyContent: 'top',
    alignItems: 'center',
    flexDirection: 'column',
    backgroundColor: 'white',
    p: 5,
    mt: 10,
    borderRadius: 10,
    boxShadow: 50

}))

const Text = styled(Typography)(({ theme }) => ({
    color: 'white',
    zIndex: '3',
    height: 'auto',
    fontSize: '50px',
    fontWeight: 'bold',
    marginTop: '4%',
    display: 'flex',
}))
const SmallText = styled(Typography)(({ theme }) => ({

    color: 'darkgrey',
    zIndex: '3',
    height: 70,
    fontSize: '15px',
    fontWeight: 'bold',
}))

const CustomButton = styled(Button)(({ theme }) => ({
    variant: 'outlined',
    color: 'black',
    zIndex: '3',
    fontWeight: 'bold',
    border: '2px solid black',
    marginTop: '3%',
    bottom: 0,
}))

export default function LiveBanner(props) {
    return (
        <Container>
            <Swiper
                className='swiper-livebanner'
                spaceBetween={30}
                centeredSlides={true}
                autoplay={{
                    delay: 2500,
                    disableOnInteraction: false,
                }}
                pagination={{
                    clickable: true,
                }}
                navigation={true}
                modules={[Autoplay, Pagination, Navigation]}
            >
                {
                    props.banners.length > 0 ?
                        props.banners.map(item => (
                            <SwiperSlide className='swiper-slide-livebanner' key={item.url}>
                                <ImgFeatureLine src={item.url}></ImgFeatureLine>
                            </SwiperSlide>
                        )
                        )
                        :
                        <SwiperSlide className='swiper-slide-livebanner'>
                            <ImgFeatureLine src={props.urlImage}></ImgFeatureLine>
                        </SwiperSlide>
                }
            </Swiper>
            {/* <ImgFeatureLine src={props.urlImage}></ImgFeatureLine> */}
            <CustomButton endIcon={<ArrowRightIcon />} onClick={props.onNavigate}>Xem thêm</CustomButton>
        </Container>
    )
}
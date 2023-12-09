import React, { useEffect, useState } from "react";
import Grid from '@mui/material/Grid'
import { styled } from '@mui/material/styles';
import { Swiper, SwiperSlide } from "swiper/react";
import BrandItem from "./BrandItem/BrandItem";
import Button from '@mui/material/Button';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useDispatch, useSelector } from "react-redux";
import { getAllProduct } from "../../redux/slices/productSlice";
import {productListSelector} from "../../redux/selectors"

const Img = styled('img')({
    maxWidth: '100%',
    maxHeight: '100%',
});

const CustomButton = styled(Button)({
    color: 'black',
    fontWeight: 'bold',
    borderRadius: '5px',
    borderWidth: '3px',
    marginBottom: '5px',
    hover: {
        color: 'white',
        backgroundColor: 'white',
        border: '5px solid'
    }

    //   '&:hover, &.Mui-focusVisible': {
    //     zIndex: 1,
    //     '& .MuiImageBackdrop-root': {
    //         opacity: 0.15,
    //     },
    //     '& .MuiImageMarked-root': {
    //         opacity: 0,
    //     },
    //     '& .MuiTypography-root': {
    //         border: '5px solid currentColor',
    //         height: '80%'
    //     },
    // },
})

const Line = styled(Grid)(({ theme }) => ({
    backgroundColor: 'white'
}))


const  BrandLine = (props) => {
    const _productList  = useSelector(productListSelector)
    const brandName = props.brandName
    const dispatch = useDispatch()
    const [productList, setProductList] = useState([])
    useEffect(() => {
        setProductList(_productList.filter(ite => ite.brand == brandName && ite.isPublished == true))
    }, [])
    return (
        <Line id={props.id} sx={{p: 2}} className='BrandLine' container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 2 }}>
            <Grid container justifyContent={'flex-end'} item xs={12} className='BrandLine__ImgBrand' >
                <CustomButton endIcon={<NavigateNextIcon />} >
                    {brandName}
                </CustomButton>
            </Grid>
                <Swiper slidesPerView={3} loop spacing={1}>
                    {
                        productList && productList.map((item, i) => (
                            <SwiperSlide key={i} >
                                <BrandItem item={item}></BrandItem>
                            </SwiperSlide>
                        ))
                    }
                </Swiper>
        </Line>
    )
}

export default BrandLine;
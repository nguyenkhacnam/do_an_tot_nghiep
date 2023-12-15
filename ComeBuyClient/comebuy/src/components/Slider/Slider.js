import React, { useState, useEffect, memo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { useDispatch, useSelector } from 'react-redux'
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper";
import { getAllProduct } from '../../redux/slices/productSlice'
import SliderItem from "./SliderItem/SliderItem";


const Slider = () => {
    const dispatch = useDispatch()
    const [productList, setProductList] = useState([])
    useEffect(() => {
        dispatch(getAllProduct())
            .unwrap()
            .then((originalPromiseResult) => {
                setProductList(originalPromiseResult)
            })
            .catch((rejectedValueOrSerializedError) => {
                console.log("Error load product")
            })
            return () => {
                setProductList({})
            }
    }, [])

    return (
        <Swiper pagination={true} modules={[Pagination]} loop>
            {
                productList.map((item, i) => (
                    <SwiperSlide key={i}>
                        <SliderItem image={item.productimage[0]?.imageURL}></SliderItem>
                    </SwiperSlide>
                ))
            }
        </Swiper>

    )
}

export default memo(Slider);
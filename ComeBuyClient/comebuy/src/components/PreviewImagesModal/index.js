import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Grid, Stack } from '@mui/material';
import { Swiper, SwiperSlide } from "swiper/react";
import { useDispatch, useSelector } from 'react-redux'
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper";
import { styled } from '@mui/material/styles';
import SendIcon from '@mui/icons-material/Send';

const ProductImage = styled('img')({
    height: 400,
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
})
const CustomButton = styled(Button)({
  
  backgroundColor : 'teal',
  '&:hover': {
    backgroundColor : '#0BD458'
  }

})

const PreviewImagesModal = (props) => {
    return (
        <div>
            <Modal
                open={props.open}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    height: 500,
                    transform: 'translate(-50%, -50%)',
                    width: 1000,
                    bgcolor: 'background.paper',
                    borderRadius: '10px',
                    boxShadow: 24,
                    p: 4,
                    overflowY: 'scroll',
                    maxHeight: 700,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Typography variant='h6' fontWeight={'bold'}>Review Images</Typography>
                    <Box sx={{width: '100%', backgroundColor: '#2E1534', height: 3}}></Box>
                    <Swiper slidesPerView={1} modules={[Pagination]} spaceBetween={30} pagination={true}>
                        {
                            props.images.map((item, i) => (
                                <SwiperSlide key={i}>
                                    <Stack sx={{width: '100%', justifyContent:'center'}}>
                                        <ProductImage src={item} key={item} />
                                    </Stack>
                                </SwiperSlide>
                            ))
                        }

                    </Swiper>
                    <Stack direction={'row'} sx={{width: '100%', justifyContent:'center',mt:2}} spacing={2}>
                    <Button onClick={props.onClose} variant='contained' color='error'>Back</Button>
                    <CustomButton onClick={props.onSubmit} sx={{backgroundColor: '#0BD458'}} variant='contained' endIcon={<SendIcon />}>Submit</CustomButton>
                    </Stack>
                </Box>

            </Modal>
        </div >
    );
}
export default PreviewImagesModal;
import { Grid, Stack, Typography, Box, Button, styled } from "@mui/material"
import style from "./style"
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import InfoIcon from '@mui/icons-material/Info';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import StoreMallDirectoryIcon from '@mui/icons-material/StoreMallDirectory';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

const CustomButton = styled(Button)({
    color: 'white',
    backgroundColor: 'black',
    width: '100%',
    borderRadius: '5px',
    borderWidth: '3px',
    paddingLeft: 20,
    paddingRight: 20,

    '&:hover': {
        zIndex: 1,
        backgroundColor: 'grey'
    },
})


const BoxShopInfo = () => {
    return (
        <Grid container item xs={10} sx={style.boxShopInfo}>
            <Grid container item xs={8} >
                <Stack>
                    <Typography variant='h5' fontWeight={'bold'}>Tự tin mua sắm với Comebuy</Typography>
                    <Grid container sx={{ p: 3 }}>
                        <Grid container item xs={6} sx={{ p: 2 }}>
                            <Stack spacing={2}>
                                <AddCircleIcon />
                                <Typography variant="h6" fontWeight={'bold'}>Bảo hành an toàn</Typography>
                                <Typography variant="body1">
                                Tất cả các sản phẩm bán ra đều tuân theo các điều kiện bảo hành của nhà sản xuất và nhà cung cấp. Nếu có vấn đề về chất lượng sản phẩm, chúng tôi cam kết hỗ trợ bạn đến cùng.</Typography>
                            </Stack>

                        </Grid>
                        <Grid container item xs={6} sx={{ p: 2 }}>
                            <Stack spacing={2}>
                                <CurrencyExchangeIcon />
                                <Typography variant="h6" fontWeight={'bold'}>Hỗ trợ trao đổi 1-1</Typography>
                                <Typography variant="body1">
                                Với thời gian dùng thử lên tới 15 ngày, bạn sẽ được hỗ trợ đổi 1-1 hoặc hoàn tiền 100% nếu có sai sót hoặc cảm thấy sản phẩm không đáp ứng được nhu cầu.</Typography>
                            </Stack>
                        </Grid>
                        <Grid container xs={12} item>
                            <Box sx={{ height: 3, width: '90%', backgroundColor: 'black', mt: 4, ml: 4, mr: 4 }}></Box>
                        </Grid>
                        <Grid container xs={12} item>
                            <Stack sx={{ width: '100%', p: 4 }} spacing={2}>
                                <InfoIcon />
                                <Typography variant="h6" fontWeight={'bold'}>Thông tin hữu ích</Typography>
                                <Grid container item xs={12}>
                                    <Grid container item xs={6} sx={{ p: 2 }}>
                                        <Stack spacing={2} >
                                            <CustomButton startIcon={<LocalPhoneIcon />}>Gọi mua hàng : 0329465355</CustomButton>
                                            <CustomButton startIcon={<StoreMallDirectoryIcon />}>Gọi khiếu nại: 0329465355</CustomButton>
                                            <CustomButton startIcon={<LocalPhoneIcon />}>Gọi bảo hành : 0329465355</CustomButton>
                                        </Stack>

                                    </Grid>
                                    <Grid container item xs={6} sx={{ p: 2 }}>
                                        <Stack spacing={2}>
                                            <CustomButton startIcon={<LocalShippingIcon />}>Giao hàng và thanh toán</CustomButton>
                                            <CustomButton startIcon={<AttachMoneyIcon />}>Miễn phí vận chuyển</CustomButton>
                                            <CustomButton startIcon={<LocalPhoneIcon />}>Chính sách bảo hành</CustomButton>
                                        </Stack>
                                    </Grid>
                                </Grid>
                            </Stack>
                        </Grid>
                    </Grid>
                </Stack>
            </Grid>
            <Grid container item xs={4}>
                <img src='https://thinkpro.vn/_nuxt/img/thinkpro-footer.d5b4dbc.png'></img>
            </Grid>
        </Grid>
    )
}

export default BoxShopInfo
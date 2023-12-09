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
                    <Typography variant='h5' fontWeight={'bold'}>Shop with confidence with Comebuy</Typography>
                    <Grid container sx={{ p: 3 }}>
                        <Grid container item xs={6} sx={{ p: 2 }}>
                            <Stack spacing={2}>
                                <AddCircleIcon />
                                <Typography variant="h6" fontWeight={'bold'}>Safety warranty</Typography>
                                <Typography variant="body1">
                                    All products sold by ThinkPro are subject to the manufacturer's and supplier's warranty conditions. If there is a problem with product quality, ThinkPro is committed to supporting you to the end.</Typography>
                            </Stack>

                        </Grid>
                        <Grid container item xs={6} sx={{ p: 2 }}>
                            <Stack spacing={2}>
                                <CurrencyExchangeIcon />
                                <Typography variant="h6" fontWeight={'bold'}>Support 1-1 exchange</Typography>
                                <Typography variant="body1">
                                    With a trial period of up to 15 days, you will be supported to exchange 1-1 or 100% refund if there is an error or feel that the product does not meet the needs.</Typography>
                            </Stack>
                        </Grid>
                        <Grid container xs={12} item>
                            <Box sx={{ height: 3, width: '90%', backgroundColor: 'black', mt: 4, ml: 4, mr: 4 }}></Box>
                        </Grid>
                        <Grid container xs={12} item>
                            <Stack sx={{ width: '100%', p: 4 }} spacing={2}>
                                <InfoIcon />
                                <Typography variant="h6" fontWeight={'bold'}>Useful Information</Typography>
                                <Grid container item xs={12}>
                                    <Grid container item xs={6} sx={{ p: 2 }}>
                                        <Stack spacing={2} >
                                            <CustomButton startIcon={<LocalPhoneIcon />}>Hotline : 0939.888</CustomButton>
                                            <CustomButton startIcon={<StoreMallDirectoryIcon />}>Chain Stores</CustomButton>
                                            <CustomButton startIcon={<LocalPhoneIcon />}>Hotline : 0939.888</CustomButton>
                                        </Stack>

                                    </Grid>
                                    <Grid container item xs={6} sx={{ p: 2 }}>
                                        <Stack spacing={2}>
                                            <CustomButton startIcon={<LocalShippingIcon />}>Delivery and Payment</CustomButton>
                                            <CustomButton startIcon={<AttachMoneyIcon />}>Service Cost</CustomButton>
                                            <CustomButton startIcon={<LocalPhoneIcon />}>Hotline : 0939.888</CustomButton>
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
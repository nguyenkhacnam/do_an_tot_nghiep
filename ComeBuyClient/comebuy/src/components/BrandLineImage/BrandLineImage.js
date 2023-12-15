
import { styled } from '@mui/material/styles';
import { Grid } from '@mui/material';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';


const ImgFeatureLine = styled('img')(({ theme }) => ({
    width: '100%',
    height: 700,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    position: 'absolute',
    item: true,
    

    [theme.breakpoints.down('sm')]: {
        display: 'none',
    },

}));

const Container = styled(Grid)(({ theme }) => ({
    display: 'flex',
    height: 700,
    position: 'relative',
    justifyContent: 'top',
    alignItems: 'flex-end',
    flexDirection: 'column',
    backgroundColor:'white'
}))

const Text = styled(Typography)(({ theme }) => ({
    color: 'black',
    zIndex: '3',
    height: 'auto',
    fontSize: '35px',
    fontWeight: 'bold',
    backgroundColor: 'white',
    padding: '10px',
    borderRadius: '5px',
    marginTop: '2%',
    marginRight: '3%',
    display: 'flex',
    wordWrap: 'break-word',
    
}))
const SmallText = styled(Typography)(({ theme }) => ({
    
    color: 'coral',
    zIndex: '3',
    height: 100,
    width: 150,
    fontSize: '20px',
    fontWeight: 'bold',
    wordWrap: 'break-word'
    
}))

const CustomButton = styled(Button)(({ theme }) => ({
    variant: 'outlined',
    color: 'black',
    zIndex: '3',
    fontWeight: 'bold',
    border: '2px solid black',
    marginRight: '3%',
    marginTop: '2%',
    bottom: 0
}))



export default function BrandLineImage(props) {
    return (
        <Container>
            <ImgFeatureLine src={props.urlImage}></ImgFeatureLine>
            <Text>{props.BigText}</Text>
            <CustomButton endIcon={<ArrowRightIcon />}>Xem thêm</CustomButton>
        </Container>
    )
}
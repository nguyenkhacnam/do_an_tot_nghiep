import * as React from 'react';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';
import Button from '@mui/material/Button';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useSelector } from 'react-redux';
import { productListSelector } from '../../../redux/selectors';
import { CircularProgress } from '@mui/material';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'

const Img = styled('img')({
  margin: 'auto',
  display: 'block',
  maxWidth: '100%',
  maxHeight: 200,
});

const CustomButton = styled(Button)(() => ({
  backgroundColor: '#B360E6',
  '&:hover': {
    zIndex: 1,
    backgroundColor: '#B360AA'
  },
}));

const ProductItem = (props) => {
  const navigate = useNavigate()
  const _productList = useSelector(productListSelector)
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const temp = _productList.filter(ite => ite.productID == props.product)
    setProduct(temp[0]);
    setLoading(false)
    return () => {
      setProduct({})
      setLoading(false)
    }

  }, [])
  const handleNavigateToDetail = () => navigate('/productSpace/' + props.product)
  return (
    <Paper
      sx={{
        p: 2,
        margin: 'auto',
        maxWidth: 400,
        flexGrow: 1,
        backgroundColor: (theme) =>
          theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
      }}
    >{
        !loading && product != null ?
          <Grid container spacing={2}>
            <Grid item>
              <ButtonBase sx={{ width: 128, height: 128 }}>
                <Img alt="complex" src={product.productimage[0].imageURL} />
              </ButtonBase>
            </Grid>
            <Grid item xs={12} sm container>
              <Grid item xs container direction="column" spacing={2}>
                <Grid item xs>
                  <Typography gutterBottom variant="subtitle2" component="div">
                    {product.name.split(" (")[0]}
                  </Typography>
                  {/* <Typography variant="body2" gutterBottom>
                  {product.screenDimension}
                  </Typography> */}
                  <Typography variant="caption" color="text.secondary">
                    {product.productID}
                  </Typography>
                </Grid>
                <Grid item>
                  <CustomButton variant="contained"
                    endIcon={<ShoppingCartIcon />}
                    onClick={handleNavigateToDetail}
                  >Buy Now</CustomButton>
                </Grid>
              </Grid>
              <Grid item>
                <Typography variant="subtitle1" color={'error'}>
                  ${product.price}
                </Typography>
              </Grid>
            </Grid>
          </Grid> :
          <CircularProgress></CircularProgress>
      }
    </Paper>
  );
}
export default ProductItem;
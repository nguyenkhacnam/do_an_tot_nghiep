import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import productAPI from '../../api/productAPI';
import { useState, useEffect, memo } from 'react'
import { Button, Stack, styled } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import DetailProductModal from '../DetailProductModal';

const ProductCardInStock = (props) => {
  const [product, setProduct] = useState(null)
 
  async function LoadData() {
    try {
      const response = await productAPI.getProductWithID(props.stock.product.productid)
      if (response.status == 200) {
        setProduct(response.data)
      }
      else {

      }
    }
    catch (err) {
      console.log(err)
    }
  }
  useEffect(() => {
    LoadData()
    return () => {
      setProduct({}); // This worked for me
    };
  }, [])

  return (
    <Card sx={{ display: 'flex', p: 1, margin: 2, boxShadow: 2 }}>
      {
        product != null &&
        <CardMedia
          component="img"
          sx={{ width: 200, height: 150, resize: true, alignSelf: 'center' }}
          image={product != null ? product.productimage[0].imageURL : "https://images.unsplash.com/photo-1530893609608-32a9af3aa95c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=464&q=80"}
          alt="Live from space album cover"
        />
      }
      <Stack sx={{ display: 'flex', width: '100%', flexDirection: 'row', borderRadius: 3 }}>
        <CardContent sx={{ flex: '1 0 auto'}}>
          <Typography sx={{margin: 1}} component="div" variant="h6" color='#2e1534' fontWeight='bold'>
            {product != null ? product.name : props.stock.product.name}
          </Typography>
          <Typography sx={{margin: 1}} variant="body1" color='#2e1534' component="div">
            {product != null ? "From $" + product.price : null}
          </Typography>
          <Typography sx={{margin: 1}} variant="body1" color="teal" component="div">
            {props.stock != null ? "Total :" + props.stock.totalAmount : null}
          </Typography>
          <Typography sx={{margin: 1}}  variant="body1" color="#BF2604" component="div">
            {props.stock != null ? "Remaining: " + props.stock.remaining : null}
          </Typography>
        </CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1, alignSelf: 'flex-start' }}>
          <IconButton onClick={() => props.onDelete(props.stock)}>
            <DeleteIcon />
          </IconButton>
          <IconButton onClick={props.openUpdateModal}>
            <AddShoppingCartIcon/>
          </IconButton>
        </Box>
      </Stack>
     
    </Card>
  );
}
export default ProductCardInStock

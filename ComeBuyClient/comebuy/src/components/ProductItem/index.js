import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Box, CardActionArea, Stack, styled } from '@mui/material';
import { useNavigate } from "react-router-dom";

const Img = styled('img')({
  margin: 'auto',
  display: 'block',
  maxWidth: '100%',
  height: 120,
});

const ProductItem = (props) => {
  const navigate = useNavigate()
  const handleNavigateToDetail = () => navigate('/productSpace/' + props.product.productID)

  return (
    <Card sx={{ width: 300, height: 380, p: 2, m:1, boxShadow: 5 }}>
      <CardActionArea sx={{height: '100%'}} onClick={handleNavigateToDetail}>
        <Img alt="complex"
          src={props.product.productimage[0].imageURL} />
        <CardContent>
          <Typography gutterBottom variant="body1" fontWeight={'bold'} component="div">
            {props.product.name}
          </Typography>
          <Typography gutterBottom variant="body2" color='#868C7D'  component="div">
            Warranty {props.product.warranty}
          </Typography>
          <Stack sx={{p : 1}} spacing={1}>
            <Box>
              CPU: {props.product.cpu}
            </Box>
            <Box>
              GPU: {props.product.gpu} 
            </Box>
            <Box>
              RAM: {props.product.ram}
            </Box>
            <Box>
              Screen: {props.product.screenDimension}' inch
            </Box>
          </Stack>
          <Typography variant="body1" fontWeight={'bold'} sx={{textAlign: 'end', alignSelf: 'end'}} color="#D94A56">
            $ {props.product.price}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
export default ProductItem
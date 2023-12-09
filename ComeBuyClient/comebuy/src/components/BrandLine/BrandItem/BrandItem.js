import * as React from 'react';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';
import Button from '@mui/material/Button';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useNavigate } from 'react-router-dom'
import { Stack } from '@mui/material';

const Img = styled('img')({
  margin: 'auto',
  display: 'block',
  maxWidth: '100%',
  maxHeight: '100%',
});

const CustomButton = styled(Button)(() => ({
  backgroundColor: 'black'
}));

const BrandItem = (props) => {
  const navigate = useNavigate()

  return (
    <Paper

      sx={{
        p: 1,
        margin: 'auto',
        maxWidth: 450,
        height: 180,
        maxheight: 180,
        flexGrow: 1,
        backgroundColor: (theme) =>
          theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
      }}
    >
      <Grid container spacing={2}>
        <Grid item>
          <ButtonBase sx={{ width: 120, height: 120 }}>
            <Img alt="complex" src={props.item.productimage[0].imageURL} />
          </ButtonBase>
        </Grid>
        <Grid item xs={12} sm container>
          <Grid item xs={10} container direction="column" spacing={1}>
            <Grid item xs={8}>
              <Typography variant="subtitle2" fontWeight={'bold'}>
                {props.item.name.split(' (')[0]}
              </Typography>
              <Stack sx={{ p: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  CPU: {props.item.cpu}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  GPU: {props.item.gpu}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Screen: {props.item.screenDimension} inch
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={2}>
              <CustomButton
                size="small"
                variant='contained'
                onClick={() => navigate("/productSpace/" + props.item.productID)}>Buy now</CustomButton>
            </Grid>
          </Grid>
          <Grid item xs={2}>
            <Typography variant="subtitle1" component="div" color='error'>
              ${props.item.price}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}
export default BrandItem;
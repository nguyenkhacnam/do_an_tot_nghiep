import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';

export default function BannerItem(props) {
  return (
    <Card sx={{ maxWidth: 345, minWidth: 300 }}>
      <CardMedia
        component="img"
        height="140"
        image={props.item.url}
        alt="green iguana"
      />
      <CardActions sx={{ alignItems: 'flex-end'}}>
        <Button onClick={async () => props.HandleDelete(props.item.bannerID)} size="small">Delete</Button>
      </CardActions>
    </Card>
  );
}

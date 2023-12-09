import * as React from 'react';
import Box from '@mui/material/Box';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';

export default function LaptopImageLine() {
  return (
    <Box sx={{ width: '100%', height: 'auto', overflowY: 'scroll' }}>
      <ImageList variant="masonry" cols={5} gap={8}>
        {itemData.map((item) => (
          <ImageListItem key={item.img}>
            <img
              src={`${item.img}?w=248&fit=crop&auto=format`}
              srcSet={`${item.img}?w=248&fit=crop&auto=format&dpr=2 2x`}
              alt={item.title}
              loading="lazy"
            />
          </ImageListItem>
        ))}
      </ImageList>
    </Box>
  );
}

const itemData = [
  {
    img: 'https://images.unsplash.com/photo-1512429234305-12fe5b0b0f07?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
    title: 'Bed',
  },
  {
    img: 'https://images.unsplash.com/photo-1596003906949-67221c37965c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80',
    title: 'Books',
  },
  {
    img: 'https://images.unsplash.com/photo-1594823274242-19036bf455e9?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80',
    title: 'Sink',
  },
  {
    img: 'https://images.unsplash.com/photo-1513918596785-a2fcc5a5d302?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80',
    title: 'Kitchen',
  },
  {
    img: 'https://images.unsplash.com/photo-1540397106260-e24a507a08ea?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1183&q=80',
    title: 'Blinds',
  },
  {
    img: 'https://images.unsplash.com/photo-1595161397851-cb282659df5e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=436&q=80',
    title: 'Chairs',
  },
  {
    img: 'https://images.unsplash.com/photo-1595327656903-2f54e37ce09b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=435&q=80',
    title: 'Laptop',
  },
  {
    img: 'https://images.unsplash.com/photo-1630794180018-433d915c34ac?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1332&q=80',
    title: 'Doors',
  },
  {
    img: 'https://images.unsplash.com/photo-1636211990414-8edec17ba047?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80',
    title: 'Coffee',
  },
  {
    img: 'https://images.unsplash.com/photo-1579362243176-b746a02bc030?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1181&q=80',
    title: 'Storage',
  },
  {
    img: 'https://images.unsplash.com/photo-1583223667854-e0e05b1ad4f3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    title: 'Candle',
  },
  {
    img: 'https://images.unsplash.com/photo-1636211992838-251a43d72ad2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80',
    title: 'Coffee table1',
  },
  {
    img: 'https://images.unsplash.com/photo-1578598336057-368c764c0596?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=436&q=80',
    title: 'Coffee tableq',
  },
  {
    img: 'https://images.unsplash.com/photo-1587614382346-4ec70e388b28?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    title: 'Coffee tablew',
  },
  {
    img: 'https://images.unsplash.com/photo-1609240873846-54f18451f365?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80',
    title: 'Coffee table3',
  },
  {
    img: 'https://images.unsplash.com/photo-1611078489935-0cb964de46d6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
    title: 'Coffee table4',
  },
];
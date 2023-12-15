import React, { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';

const Title = styled(Typography)(({theme}) => ({
    position: 'relative',
    color: 'black',
    letterSpacing: '2px',
    textDecoration: 'underline',
    cursor:'pointer',
    pb: (theme) => `calc(${theme.spacing(1)} + 0px)`,
    '&:hover' : {
        variant:'subtitle1',
        fontSize: 20
    }
}))


const ImageMarked = styled('span')(({ theme }) => ({
    height: 3,
    width: 18,
    backgroundColor: theme.palette.common.white,
    position: 'absolute',
    bottom: -2,
    left: 'calc(50% - 9px)',
    transition: theme.transitions.create('opacity'),
}));

const NavigateBrandLine = (value) => {
    window.location.replace("#Line_" + value)
}
function BrandNavBar(props) {
    const brandLine = props.brandLine;
    console.log("🚀 ~ file: BrandNavBar.js:37 ~ BrandNavBar ~ brandLine:", brandLine)
    return (
        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex', justifyContent: 'space-evenly' } }}>
            {brandLine.map((brand, i) => (
                <Title
                    variant = "subtitle2"
                    onClick={() => NavigateBrandLine(brand.title)}
                    key={i}
                >
                    {brand.title}
                    <ImageMarked className="MuiImageMarked-root" />
                </Title>
            ))}
        </Box>

    )
}

export default BrandNavBar;
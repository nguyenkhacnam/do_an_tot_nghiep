import { Box, Stack } from "@mui/material"
import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useState } from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getAllProduct } from "../../redux/slices/productSlice";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { productListSelector } from "../../redux/selectors";

const NewProductLine = () => {

    const _productList = useSelector(productListSelector)
    const [data, setData] = useState(null)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {

        let isCancel = false
        if (isCancel) return
        else {
            let listPr = _productList.slice().sort((a, b) => {
                return a.keyIndex - b.keyIndex
            })
            console.log(listPr)
            const newData = []
            for (var i = listPr.length - 1; i >= 0 ; i--) {
                if (listPr[i].isPublished == true)
                    newData.push(listPr[i])
                if (newData.length == 2) break;
            }
            setData(newData)
        }

        return () => {
            setData({})
            isCancel = true
        }
    }, [])

    return (
        <Stack direction={'row'} sx={{ width: '100%', p: 3 }} spacing={2}>
            {
                data &&
                data.map((ite, i) => (
                    <Card key={i} sx={{ width: '45%', p: 3, display: 'flex', boxShadow: 2 }}>
                        <Box>
                            <CardContent>
                                <Typography gutterBottom variant="h5" fontWeight={'bold'}>
                                    {ite.name.split(' (')[0]}
                                </Typography>
                                <Typography gutterBottom variant="subtitle1" fontStyle={'italic'} sx={{ color: 'teal', cursor: 'pointer', textDecoration: 'underline' }}>
                                    New
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Click to view product details. Buy today to receive many great promotions from Comebuy.
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button size="small"
                                    sx={{ textDecoration: 'underline' }}
                                    onClick={() => navigate("/productSpace/" + ite.productID)}>Learn More</Button>
                            </CardActions>
                        </Box>
                        <CardMedia
                            component="img"
                            height="200"
                            image={ite.productimage[0]?.imageURL} />
                    </Card>
                ))
            }
        </Stack>
    )
}
export default NewProductLine
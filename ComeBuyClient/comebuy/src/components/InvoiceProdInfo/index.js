import * as React from "react"
import { useDispatch } from 'react-redux'
import { unwrapResult } from '@reduxjs/toolkit';
import { getProductWithID } from '../../redux/slices/productSlice';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';



const ProdInfo = (props) => {

    const [product, setProduct] = React.useState([]);

    const { productID } = props

    const dispatch = useDispatch()

    React.useEffect(async () => {
        if (product.length === 0) {
            try {
                const resultAction = await dispatch(getProductWithID(productID))
                const originalPromiseResult = unwrapResult(resultAction)
                // handle result here
                setProduct([...product, originalPromiseResult])
            } catch (rejectedValueOrSerializedError) {
                // handle error here
                console.log(rejectedValueOrSerializedError.message);
            }
        }
        return () => {
            setProduct({});
        };
    }, [])

    return (
        <div>
            {product != 0 ? (
                <div style={{
                    maxWidth: 700,
                    height: 'auto',
                    backgroundColor: '#BFBFBF',
                    padding: '10px',
                    display: 'flex',
                    flexDirection: 'row',
                }}>
                    <img alt="" src={product[0].productimage[0].imageURL} style={{ width: 250, height: 250 }} />
                    <div style={{ display: 'flex', flexDirection: 'column', padding: '15px' }}>
                        <div style={{ display: 'flex', flexDirection: 'row' }}>
                            <Typography style={{ fontWeight: 'bold' }}>Brand:</Typography>
                            <Typography style={{ marginLeft: '5px' }}>{product[0].brand}</Typography>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'row' }}>
                            <Typography style={{ fontWeight: 'bold' }}>Name:</Typography>
                            <Typography style={{ marginLeft: '5px' }}>{product[0].name}</Typography>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'row' }}>
                            <Typography style={{ fontWeight: 'bold' }}>Price:</Typography>
                            <Typography style={{ marginLeft: '5px' }}>${product[0].price}</Typography>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'row' }}>
                            <Typography style={{ fontWeight: 'bold' }}>RAM/GPU/CPU:</Typography>
                            <Typography style={{ marginLeft: '5px' }}>{`${product[0].ram} GB / ${product[0].gpu} / ${product[0].cpu}`}</Typography>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'row' }}>
                            <Typography style={{ fontWeight: 'bold' }}>ROM/Weight/External IO Port:</Typography>
                            <Typography style={{ marginLeft: '5px' }}>{`${product[0].memory} GB / ${product[0].weight} kg / ${product[0].externalIOPort}`}</Typography>
                        </div>
                    </div>
                </div>
            ) : (
                <Box sx={{ display: 'flex', flex: 1, flexDirection: 'row' }}>
                    <CircularProgress style={{ backgroundColor: 'transparent' }} />
                    <Typography style={{ marginTop: '5px', marginLeft: '5px' }}>Getting info...</Typography>
                </Box>
            )}
        </div>
    )
}

export default ProdInfo
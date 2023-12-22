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

    React.useEffect(() => {
        const fetchData = async () => {
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
        }

        fetchData()
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
                    <img alt="" src={product[0].productimage[0]?.imageURL} style={{ width: 250, height: 250 }} />
                    <div style={{ display: 'flex', flexDirection: 'column', padding: '15px' }}>
                        <div style={{ display: 'flex', flexDirection: 'row' }}>
                            <Typography style={{ fontWeight: 'bold' }}>Nhà sản xuất:</Typography>
                            <Typography style={{ marginLeft: '5px' }}>{product[0].brand}</Typography>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'row' }}>
                            <Typography style={{ fontWeight: 'bold' }}>Tên:</Typography>
                            <Typography style={{ marginLeft: '5px' }}>{product[0].name}</Typography>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'row' }}>
                            <Typography style={{ fontWeight: 'bold' }}>Giá:</Typography>
                            <Typography style={{ marginLeft: '5px' }}>{product[0].price.toLocaleString("en-US")} VND</Typography>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'row' }}>
                            <Typography style={{ fontWeight: 'bold' }}>RAM/GPU/CPU:</Typography>
                            <Typography style={{ marginLeft: '5px' }}>{`${product[0].ram} GB / ${product[0].gpu} / ${product[0].cpu}`}</Typography>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'row' }}>
                            <Typography style={{ fontWeight: 'bold' }}>Ổ cứng/Cân nặng/Cổng kết nối:</Typography>
                            <Typography style={{ marginLeft: '5px' }}>{`${product[0].memory} GB / ${product[0].weight} kg / ${product[0].externalIOPort}`}</Typography>
                        </div>
                    </div>
                </div>
            ) : (
                <Box sx={{ display: 'flex', flex: 1, flexDirection: 'row' }}>
                    <CircularProgress style={{ backgroundColor: 'transparent' }} />
                    <Typography style={{ marginTop: '5px', marginLeft: '5px' }}>Đang lấy thông tin...</Typography>
                </Box>
            )}
        </div>
    )
}

export default ProdInfo
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import ProductSelect from '../ProductSelect';
import TextFieldForAdd from '../TextFieldForAdd';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import WarningIcon from '@mui/icons-material/Warning';
import { useState } from 'react'
import { Stack } from '@mui/material';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: 3,
    p: 4,
};

const AddProductInStockModal = (props) => {
    const [amount, setAmount] = useState(0)
    const [selectedProduct, setSelectedProduct] = useState(null)
    const [Error, setError] = useState({
        isError: false,
        message: "No Error"
    })
    const currentList = props.stockList.map((item) => item.productid)

    const onProductChange = (e, value) => {
        setSelectedProduct(value)
    }
    const handleAddProduct = () => {
        if (selectedProduct != null) {
            props.onSubmit({
                amount: amount,
                product: selectedProduct
            });
            props.onClose()
        }
        else if (amount == 0) setError({ isError: true, message: "Amount is not allowed to equal 0!" })
        else setError({ isError: true, message: "Please select the product!" })
    }

    return (
        <div>
            <Modal
                open={props.open}
                onClose={props.onClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Add Product
                    </Typography>
                    <Box sx={{ height: 5, backgroundColor: '#2e1534', width: '100%', mt: 1, mb: 1, borderRadius: 5 }}></Box>
                    <Typography id="modal-modal-description" sx={{ mb: 2 }}>
                        Fill the information.
                    </Typography>
                    <ProductSelect existedProduct={currentList} sx={{ mb: 2 }} onChange={onProductChange} />
                    <TextFieldForAdd inputConfig="number" Icon={<AddShoppingCartIcon />} Text={amount} Title='Amount' onChange={(event) => setAmount(event.target.value)}></TextFieldForAdd>
                    {
                        Error.isError &&
                        <Stack direction='row' spacing={2} sx={{ margin: 1 }}>
                            <WarningIcon sx={{ color: 'red' }} />
                            <Typography sx={{ color: 'red' }}>{Error.message}</Typography>
                        </Stack>
                    }
                    <Button sx={{justifySelf:'center'}} onClick={handleAddProduct}>Submit</Button>
                </Box>
            </Modal>
        </div>
    );
}
export default AddProductInStockModal
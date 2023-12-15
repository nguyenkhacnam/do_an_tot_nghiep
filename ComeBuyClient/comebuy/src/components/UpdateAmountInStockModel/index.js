import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
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

const UpdateAmountInStockModal = (props) => {
    const [amount, setAmount] = useState(0)
    const [Error, setError] = useState({
        isError: false,
        message: "No Error"
    })

    const handleAddAmountProduct = () => {
        if (Number(amount) != 0) {
            props.onSubmit(amount);
            props.onClose()
        }
        else setError({ isError: true, message: "Số lượng không được phép bằng 0!" })
    }

    return (
        <div>
            <Modal
                open={props.open}
                onClose={props.onClose}
            >
                <Box sx={style}>
                    <Typography variant="h6" component="h2">
                    Thêm số lượng sản phẩm
                    </Typography>
                    <Box sx={{ height: 5, backgroundColor: '#2e1534', width: '100%', mt: 1, mb: 1, borderRadius: 5 }}></Box>
                    <Typography sx={{ mb: 2 }}>
                    Vui lòng điền thông tin.
                    </Typography>
                    <TextFieldForAdd inputConfig="number" Icon={<AddShoppingCartIcon />} Text={amount} Title='Số lượng' onChange={(event) => setAmount(event.target.value)}></TextFieldForAdd>
                    {
                        Error.isError &&
                        <Stack direction='row' spacing={2} sx={{margin: 1}}>
                            <WarningIcon sx ={{color: 'red'}}/>
                            <Typography sx={{ color: 'red' }}>{Error.message}</Typography>
                        </Stack>
                    }
                    <Button onClick={handleAddAmountProduct}>Nhập</Button>
                </Box>
            </Modal>
        </div>
    );
}
export default UpdateAmountInStockModal
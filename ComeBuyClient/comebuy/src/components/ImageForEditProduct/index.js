import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Grid, styled } from '@mui/material';

import style from './style.js'

const DeleteButton = styled(Button)(({ theme }) => ({
    alignSelf: 'flex-start',
    margin: 10,
    backgroundColor: '#F51B06',
    '&:hover': {
        backgroundColor: '#A81B06',
    }
}))

const ProductImage = styled('img')(({ theme }) => ({
    alignSelf: 'center',
    position: 'absolute',
    width: '100%',
    height: '100%'
}))

const ImageForEditProduct = (props) => {
    const [open, setOpen] = React.useState(false);
    const handleClickOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)
    const handleDelete = () => {
        props.deleteImage(props.image)
        handleClose()
    }
    return (
        <Grid sx={style.container}>
            <ProductImage item="true" xs={12} src={props.image.imageURL}></ProductImage>
            <DeleteButton item="true" variant="contained" onClick={handleClickOpen} startIcon={<DeleteIcon />}>Delete</DeleteButton>
            <Dialog
                item="true"
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Do you really want to delete this photo?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                       You have just deleted this photo. Please confirm again for reliability because this action is not allowed to redo?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Disagree</Button>
                    <Button onClick={handleDelete} autoFocus>
                        Agree
                    </Button>
                </DialogActions>
            </Dialog>
        </Grid>
    )
}

export default ImageForEditProduct;
import {
    Grid,
    Stack,
    Typography,
    Box,
    Button,
    styled,
    CircularProgress,
    ListItem,
    Divider,
    List,
    ListItemAvatar,
    ListItemText,
    Avatar,
    Fab,
    TextField,
    Modal
} from "@mui/material"
import style from "./style"
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import MessageIcon from '@mui/icons-material/Message';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import SendIcon from '@mui/icons-material/Send';
import React, { useEffect, useState } from "react";
import commentApi from "../../api/commentAPI";
import EditIcon from '@mui/icons-material/Edit';
import { useSelector } from "react-redux";
import { currentUser } from "netlify-identity-widget";
import { useNavigate } from "react-router";
import SnackBarAlert from "../SnackBarAlert";
import RateReviewIcon from '@mui/icons-material/RateReview';

const CustomButton = styled(Button)({
    color: 'white',
    backgroundColor: 'black',
    width: '100%',
    borderRadius: '5px',
    borderWidth: '3px',
    marginBottom: '20px',
    paddingLeft: 20,
    paddingRight: 20,

    '&:hover': {
        zIndex: 1,
        backgroundColor: 'grey'
    },
})


const ProductComment = (props) => {

    const navigate = useNavigate()
    const _currentUser = useSelector(currentUser)
    const [comments, setComments] = useState([])
    const [loading, setLoading] = useState(true)
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [newCommentBody, setNewCommentBody] = useState(null)
    const [openSuccessAlert, setOpenSuccessAlert] = useState(false);
    const [openErrorAlert, setOpenErrorAlert] = useState(false);
    const [messageError, setMessageError] = useState("No Error")
    const [messageSuccess, setMessageSuccess] = useState("Notification")

    const handleCloseAlert = (event, reason) => {
        if (reason === 'clickaway')
            return;
        setOpenSuccessAlert(false);
        setOpenErrorAlert(false);
    };


    const HandlePostNewComment = async () => {
        
        if (newCommentBody == null) {
            setMessageError("Comment is not allowed empty! :((")
            setOpenErrorAlert(true)
            handleClose()
        }
        else if (localStorage.getItem('idUser') == "") {
            setMessageError("Please login before comment!")
            setOpenErrorAlert(true)
            handleClose()
            navigate('/login')
        }
        else {
            const newComment = {
                "userID": localStorage.getItem('idUser'),
                "productID": props.productID,
                "body": newCommentBody,
                "postDate": Date.now().toString()
            }
            const response = await commentApi.postNewComment(newComment)
            if (response.status == 200) {
                setComments(response.data)
                setMessageSuccess("Post Comment Successfully")
                setOpenSuccessAlert(true)
                handleClose()
            }
            else {
                setMessageError("Post comment Failed ! :((")
                setOpenErrorAlert(true)
                handleClose()
            }
        }
    }

    useEffect(async () => {
            let cancel = false
            const response = await commentApi.getCommentsWithID(props.productID)
            if (!cancel && response.status == 200) {
                if (cancel) return;
                setComments(response.data)
                setLoading(false)
            }
            else {
                console.log("Load comment failed")
                setLoading(false)
            };

        return () => {
            cancel = true;
        };
    }, [])


    // useEffect(async () => {
    //     const abortController = new AbortController();
    //     const response = await commentApi.getCommentsWithID(props.productID)
    //     if ( response.status == 200) {
    //         setComments(response.data)
    //         setLoading(false)
    //     }
    //     else {
    //         console.log("Load comment failed")
    //         setLoading(false)
    //     };
    //     return () => {
    //         abortController.abort();
    //     }
    // }, [])

    return (
        <Grid container item xs={12} sx={style.boxComment}>
            <Stack sx={{ width: '100%' }}>
                <Stack direction={'row'} sx={{ alignItems: 'center', p: 2 }} spacing={2}>
                    <MessageIcon />
                    <Typography variant='h5' fontWeight={'bold'}>Reviews and Comments</Typography>
                </Stack>
                {loading == true ?
                    <Grid container item xs={12} sx={{ p: 3, width: '100%' }}>
                        <CircularProgress></CircularProgress>
                    </Grid>
                    :
                    <Grid container item xs={12} sx={{ pr: 2, pl: 2, width: '100%', maxHeight: 500, overflowY: 'scroll' }}>
                        {
                            !comments.length > 0 ?
                                <Stack spacing={2} sx={{ boxShadow: 5, p: 4, borderRadius: 5 }}>
                                    <ChatBubbleOutlineIcon />
                                    <Typography variant="h6" fontWeight={'bold'}>There are no reviews and comments yet</Typography>
                                    <Typography variant="body1">
                                        Should buy or not? Please help my brother.
                                    </Typography>
                                    {/* <Button onClick={handleOpen} sx={{ backgroundColor: '#B360E6' }} variant="contained" startIcon={<SendIcon />}>Post Comment</Button> */}
                                </Stack>
                                :
                                <Stack spacing={1} sx={{ width: '100%' }}>
                                    <List sx={{ width: '100%', maxWidth: 860, bgcolor: 'background.paper' }}>
                                        {
                                            comments.map((item, i) => (
                                                <ListItem alignItems="flex-start" key={i} sx={{ p: 2 }}>
                                                    <ListItemAvatar>
                                                        <Avatar src={item.account.avatar} />
                                                    </ListItemAvatar>
                                                    <ListItemText
                                                        primary={item.account.name}
                                                        secondary={
                                                            <React.Fragment>
                                                                <Typography
                                                                    sx={{ display: 'inline' }}
                                                                    component="span"
                                                                    variant="body1"
                                                                    color="text.primary"
                                                                >
                                                                    {item.account.name}
                                                                </Typography>
                                                                -  {item.body}

                                                            </React.Fragment>

                                                        }
                                                    />
                                                </ListItem>
                                            ))
                                        }
                                    </List>

                                </Stack>
                        }
                        <Grid container xs={12} item>
                            <Box sx={{ height: 3, width: '90%', backgroundColor: 'black', mt: 4, ml: 4, mr: 4, mb: 4 }}></Box>
                        </Grid>
                    </Grid>
                }
                <Fab onClick={handleOpen} sx={{ alignSelf: 'flex-start' }} variant="extended" size="medium" color="secondary" aria-label="post">
                    <EditIcon sx={{ mr: 1 }} />
                    Post Comment
                </Fab>
            </Stack>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Stack sx={style.modal} spacing={1}>
                    <RateReviewIcon fontSize="large" />
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Write your comment below. We appreciate your assistance!
                    </Typography>
                    <TextField onChange={(e) => setNewCommentBody(e.target.value)}>
                    </TextField>
                    <Button onClick={HandlePostNewComment} variant="contained" color="secondary" endIcon={<SendIcon />}>Post</Button>
                </Stack>
            </Modal>
            <SnackBarAlert severity='success' open={openSuccessAlert} handleClose={handleCloseAlert} message={messageSuccess} />
            <SnackBarAlert severity='error' open={openErrorAlert} handleClose={handleCloseAlert} message={messageError} />

        </Grid>
    )
}

export default ProductComment
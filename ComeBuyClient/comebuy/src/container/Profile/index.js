import React, { useState, useEffect } from 'react'
import { currentUser } from '../../redux/selectors';
import { useSelector, useDispatch } from 'react-redux';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Box, Button } from '@mui/material';
import { Backdrop } from '@mui/material';
import { CircularProgress } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { styled } from '@mui/material/styles';


import { unwrapResult } from '@reduxjs/toolkit'


import { login } from '../../redux/slices/accountSlice';
import { useNavigate } from 'react-router';
import ProfileManage from './../../components/ProfileManage/index';
import { BigFooter } from '../../components';

const BGImg = styled('img')({
    height: '100%',
    width: '100%',
    position: 'absolute',
    resize: true,
})

const Profile = () => {

    const dispatch = useDispatch()

    const [openBackdrop, setOpenBackdrop] = useState(false);

    const [canAccess, setCanAccess] = useState(false);

    const _currentUser = useSelector(currentUser)

    const [passwordShown, setPasswordShown] = useState(false);

    const [password, setPassword] = useState('')

    const [openLoginFailed, setOpenLoginFailed] = useState(false);

    const handleCloseLoginFailed = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenLoginFailed(false);
    };

    // Password toggle handler
    const togglePassword = () => {
        setPasswordShown(!passwordShown);
    };

    //handle login function
    const handleLogin = async () => {
        if (password === null || password === '') {
            setOpenLoginFailed(true)
        } else {
            setOpenBackdrop(true)
            try {
                const resultAction = await dispatch(login({ email: _currentUser.email, password: password }))
                const originalPromiseResult = unwrapResult(resultAction)
                setOpenBackdrop(false)
                setCanAccess(true)
            } catch (rejectedValueOrSerializedError) {
                if (rejectedValueOrSerializedError != null) {
                    setOpenBackdrop(false)
                    setOpenLoginFailed(true)
                    setPassword("")
                }
            }
        }
    }

    const navigate = useNavigate();
    const handleForgotPassword = () => {
        setTimeout(() => {
            navigate('/myplace/resetpassword')
        }, 1000)
        setOpenBackdrop(true)
    }

    return (
        <div>
            {canAccess ? (
                <ProfileManage />
            ) : (
                // PasswordForm
                <div style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                }}>
                    <BGImg src='https://images.unsplash.com/photo-1490810194309-344b3661ba39?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1448&q=80' />
                    <Stack direction="column" spacing={3}
                        style={{
                            width: 300,
                            height: 310,
                            backgroundColor: '#141E26',
                            zIndex: '1',
                            position: 'relative',
                            padding: '2%',
                            borderRadius: '25px',
                            top: 200
                        }}>
                        <Stack direction="row" spacing={3} >
                            <Avatar alt="" src={_currentUser.avatar} sx={{ width: 100, height: 100 }} />
                            <Typography style={{ marginTop: '13%', fontSize: '20px', fontWeight: 'bold', color: '#F2F1F0' }}>{_currentUser.name}</Typography>
                        </Stack>
                        <Stack flexDirection="flex-start" direction="row" spacing={2}>
                            <input style={{ backgroundColor: '#F2F1F0', borderRadius: '15px', fontSize: '17px', width: '450px', paddingLeft: '5%' }}
                                id="outlined-basic"
                                type={passwordShown ? "text" : "password"}
                                placeholder="Password"
                                variant="standard"
                                onChange={(e) => setPassword(e.target.value)}
                            >
                            </input>
                            {passwordShown ? (
                                <IconButton onClick={togglePassword}>
                                    <VisibilityIcon color="success" />
                                </IconButton>
                            ) : (
                                <IconButton onClick={togglePassword}>
                                    <VisibilityOffIcon style={{ color: '#F2F1F0' }} />
                                </IconButton>
                            )}

                        </Stack>
                        <Button onClick={handleForgotPassword}
                            style={{
                                fontSize: '11px',
                                color: '#F2F1F0',
                                textDecoration: 'underline',
                                alignSelf: 'flex-start'
                            }}>
                            Forgot password ?
                        </Button>
                        <Button
                            onClick={handleLogin}
                            variant='outlined'
                            size="small"
                            style={{
                                borderRadius: '20px',
                                border: '1px solid #18608a',
                                backgroundColor: '#27735D',
                                color: '#C5D3D9',
                                fontSize: '13px',
                                fontWeight: 'bold',
                                padding: '12px 45px',
                                letterSpacing: '1px',
                            }}
                        >
                            Sign in
                        </Button>
                    </Stack>
                </div>
            )}
            {/*Snackbar*/}
            <Snackbar open={openLoginFailed} autoHideDuration={6000} onClose={handleCloseLoginFailed}>
                <Alert onClose={handleCloseLoginFailed} severity="error" sx={{ width: '100%' }}>
                    Something went wrong ! Please check your password.
                </Alert>
            </Snackbar>

            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={openBackdrop}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </div>
    )
}

export default Profile
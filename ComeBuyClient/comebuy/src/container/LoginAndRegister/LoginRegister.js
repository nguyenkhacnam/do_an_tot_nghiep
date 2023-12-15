import { ReactComponent as Register1SVG } from '../../assets/img/register2.svg'
import { ReactComponent as Register2SVG } from '../../assets/img/register1.svg'
import './TestUI.css'
import './LoginRegister.css'

//LIBRARY
//React + Redux
import React, { useState, useRef, useEffect } from 'react'
import { unwrapResult } from '@reduxjs/toolkit'
import { useNavigate } from 'react-router';
//M-UI
import { TextField, Checkbox, Typography, FormControlLabel, Modal, Box, Button, Dialog, DialogTitle } from '@material-ui/core';
import { Fab, Stack } from '@mui/material'
import IconButton from '@mui/material/IconButton';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Alert from '@mui/material/Alert';
import { makeStyles } from "@material-ui/core";
import { Autorenew } from "@material-ui/icons";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import HomeIcon from '@mui/icons-material/Home';

//From file
import { currentUser, isSignedIn_user, loading_user, messageError } from '../../redux/selectors'
//For redux
import { useDispatch, useSelector } from 'react-redux'
import { register, login, getAccountWithEmail } from '../../redux/slices/accountSlice'
import CountDown from './CountDown'
import * as Validation from './ValidationDataForAccount'
import emailApi from '../../api/emailAPI';

//Beside
import clsx from "clsx";

//Style for refresh button in verify modal
const useStyles = makeStyles((theme) => ({
    refresh: {
        marginRight: "10px",
        marginTop: "7px",
        cursor: "pointer",
        margin: "auto",
        "&.spin": {
            animation: "$spin 1s 1",
            pointerEvents: 'none'
        }
    },
    "@keyframes spin": {
        "0%": {
            transform: "rotate(0deg)"
        },
        "100%": {
            transform: "rotate(360deg)"
        }
    }
}));

const LoginRegister = () => {

    const [addClass, setAddClass] = useState("")

    const _currentUser = useSelector(currentUser)
    const _loadingUser = useSelector(loading_user)
    const _isSignedIn = useSelector(isSignedIn_user)
    const _messageError = useSelector(messageError)

    //STATE
    //for checking is email isEmailExisted
    const [isEmailExisted, setIsEmailExisted] = useState(false)

    //For checkbox in modal
    const [isChecked, setIsChecked] = useState(false);

    //For check password
    const [cfPass, setCfPass] = useState("");

    //Data for register
    const [dataForReg, setDataForReg] = useState({
        phoneNumber: "0111111111",
        name: "",
        dob: "1/1/2000",
        avatar: "https://www.pngitem.com/pimgs/m/150-1503945_transparent-user-png-default-user-image-png-png.png",
        email: "",
        password: "",
        address: "Viet nam",
        role: "customer",
        sex: "male",
    })

    //for open error alert password
    const [openPasswordError, setOpenPasswordError] = useState(false);

    //for open error alert CFpassword
    const [openCfPasswordError, setOpenCfPasswordError] = useState(false);

    //for open error alert password in login
    const [openPasswordLoginError, setOpenPasswordLoginError] = useState(false);

    //for open error alert username
    const [openUsernameError, setOpenUsernameError] = useState(false);

    //for open error alert email
    const [openEmailError, setOpenEmailError] = useState(false);

    //for open error alert email in login
    const [openEmailLoginError, setOpenEmailLoginError] = useState(false);

    //For show password
    const [passwordShown, setPasswordShown] = useState(false);

    //For email login 
    const [emailUser, setEmailUser] = useState(null);

    //For password login 
    const [passwordUser, setPasswordUser] = useState(null);

    //For show password
    const [cfPasswordShown, setCfPasswordShown] = useState(false);

    //UseState for auto focusing
    const [pin1, setPin1] = useState("")
    const [pin2, setPin2] = useState("")
    const [pin3, setPin3] = useState("")
    const [pin4, setPin4] = useState("")
    const [pin5, setPin5] = useState("")

    //For modal terms
    const [openModal, setOpenModal] = useState(false);

    //For modal verify
    const [openModalVerify, setOpenModalVerify] = useState(false);

    //For toggle refresh button
    const [toggleRefresh, setToggleRefresh] = useState(false);

    //for dialog alert that you reg successfully or not
    const [openDialogRegSuccessfully, setOpenDialogRegSuccessfully] = useState(false);

    const [openDialogRegFailed, setOpenDialogRegFailed] = useState(false);

    //For animation refresh in verify
    const [spin, setSpin] = useState(false);
    const classes = useStyles();

    //For register button
    const [canReg, setCanReg] = useState(true);

    //for backdrop
    const [openBackdrop, setOpenBackdrop] = useState(false);

    const [verifyCode, setVerifyCode] = useState('')

    //for redux
    const dispatch = useDispatch();


    // Password toggle handler
    const togglePassword = () => {
        // When the handler is invoked
        // inverse the boolean state of passwordShown
        setPasswordShown(!passwordShown);
    };

    // Password toggle handler
    const toggleCfPassword = () => {
        // When the handler is invoked
        // inverse the boolean state of passwordShown
        setCfPasswordShown(!cfPasswordShown);
    };

    //useRef for auto focusing in verify code modal
    const pin1Ref = useRef(null)
    const pin2Ref = useRef(null)
    const pin3Ref = useRef(null)
    const pin4Ref = useRef(null)
    const pin5Ref = useRef(null)

    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => setOpenModal(false);

    const handleOpenModalVerify = () => { setOpenModalVerify(true); setToggleRefresh(false) };
    const handleCloseModalVerify = () => { setOpenModalVerify(false) }


    const handleForgotPassword = () => {
        navigate('/forgetpasswordinlogin')
    }

    const handleCloseDialogRegSuccessfully = () => {
        setOpenDialogRegSuccessfully(false);
        setCanReg(true);
        setDataForReg({
            phoneNumber: "0111111111",
            name: "",
            dob: "1/1/2000",
            avatar: "https://www.pngitem.com/pimgs/m/150-1503945_transparent-user-png-default-user-image-png-png.png",
            email: "",
            password: "",
            address: "Viet nam",
            role: "customer",
            sex: "male",
        });
        setCfPass("")
        setIsChecked(false)
        handleCloseModal()
    };

    const [openLoginFailed, setOpenLoginFailed] = React.useState(false);
    const handleCloseLoginFailed = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenLoginFailed(false);
    };

    const handleCloseDialogRegFailed = () => {
        setOpenDialogRegFailed(false);
        setCanReg(true);
        setDataForReg({
            ...dataForReg,
            email: ""
        })
        setIsChecked(false)
        handleCloseModal()
    };

    //For countdown caution
    const onTimesup = () => {
        setToggleRefresh(true);
    }

    const refreshCanvas = () => {
        setSpin(true);
        setTimeout(() => {
            setSpin(false);
            setToggleRefresh(false);
        }, 2000);
        setOpenBackdrop(!openBackdrop);
        let temp = generateOTP()
        setVerifyCode(temp)
    };

    const navigate = useNavigate()
    useEffect(() => {
        if (_currentUser.email !== '' && _isSignedIn == true) {
            navigate('/')
        }
    }, [_currentUser]);

    //handle login function
    const handleLogin = async () => {
        if (emailUser === null) {
            setOpenEmailLoginError(true);
        } else {
            if (passwordUser === null) {
                setOpenPasswordLoginError(true)
            } else {
                try {
                    const resultAction = await dispatch(login({ email: emailUser, password: passwordUser }))
                    console.log("🚀 ~ file: LoginRegister.js:263 ~ handleLogin ~ resultAction:", resultAction)
                    const originalPromiseResult = unwrapResult(resultAction)
                    // handle result here
                } catch (rejectedValueOrSerializedError) {
                    if (rejectedValueOrSerializedError != null) {
                        setOpenLoginFailed(true)
                    }
                }
            }
        }
    }

    //generate verify code
    function generateOTP() {
        let num = '1234567890'
        let OTP = '';
        for (let i = 0; i < 5; i++) {
            OTP += num[Math.floor(Math.random() * 10)];
        }
        return OTP
    }

    const handleCreateAccount = async () => {
        //validate username first -> email -> password
        //validate username
        if (dataForReg.name.length <= 5 || dataForReg.name === "" || Validation.CheckUsername(dataForReg.name)) {
            setOpenUsernameError(true);
        } else {
            //Validate email
            if (!Validation.CheckEmail(dataForReg.email)) {
                setOpenEmailError(true);
            } else {
                //validate password
                if (dataForReg.password.length < 8) {
                    setOpenPasswordError(true);
                } else {
                    if (!Validation.CheckPassword(dataForReg.password)) {
                        setOpenPasswordError(true)
                    } else {
                        if (dataForReg.password !== cfPass) {
                            setOpenCfPasswordError(true)
                        } else {
                            setOpenBackdrop(!openBackdrop);
                            let temp = generateOTP()
                            setVerifyCode(temp)
                        }
                    }
                }
            }
        }
    }

    useEffect(() => {
        if (verifyCode != '') {
            emailApi.sendEmail({
                to: dataForReg.email,
                subject: "VERIFY FROM COMEBUY ",
                text: verifyCode
            }).then(data => {
                handleOpenModalVerify();
                setOpenBackdrop(false)
            })
                .catch(err => console.log(err))
        } else {
            return
        }
    }, [verifyCode])

    const [openWrongVerify, setOpenWrongVerify] = useState(false)
    const handleCloseWrongVerify = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenWrongVerify(false);
    };

    const [isRegistering, setIsRegistering] = useState(0)

    useEffect(() => {
        if (isRegistering === 0) {
            return;
        } else if (isRegistering === 1) {
            setOpenBackdrop(false)
            setOpenDialogRegSuccessfully(true)
        } else {
            setOpenBackdrop(false)
            setOpenDialogRegFailed(true)
        }
    }, [isRegistering])


    const [openEmailExisted, setOpenEmailExisted] = useState(false)
    const handleOpenEmailExisted = () => {
        setOpenEmailExisted(true)
    }

    const handleVerifyAndReg = async () => {
        let here = pin1 + pin2 + pin3 + pin4 + pin5
        try {
            if (here === verifyCode) {
                setOpenBackdrop(true)
                const resultAction = await dispatch(register({ dataForReg }))
                const originalPromiseResult = unwrapResult(resultAction)
                // handle result here
                if (originalPromiseResult.status === 409) {
                    handleCloseModalVerify()
                    setOpenBackdrop(false)
                    handleOpenEmailExisted()
                } else {
                    handleCloseModalVerify()
                    setOpenDialogRegFailed(false)
                    setIsRegistering(1)
                }
            } else {
                setOpenWrongVerify(true)
            }
        } catch (rejectedValueOrSerializedError) {
            //handle error here
            if (rejectedValueOrSerializedError != null) {
                handleCloseModalVerify()
                setOpenDialogRegSuccessfully(false)
                setIsRegistering(2)
            }
        }
    }

    return (
        <div className={`container ${addClass}`}>
            <div className="forms-container">
                <div className="signin-signup">
                    <form className='sign-up-form'>
                        <Stack width="70%" justifyItems="center" direction="column" spacing={2}>
                            <h2 className="title">Đăng ký</h2>
                            {/*USERNAME*/}
                            <TextField
                                className='text-field-in-form'
                                name="username"
                                variant='outlined'
                                label="Tên tài khoản"
                                type="text"
                                fullWidth
                                value={dataForReg.name}
                                onFocus={() => setOpenUsernameError(false)}
                                onChange={(e) => setDataForReg({ ...dataForReg, name: e.target.value })}
                            />

                            {/*EMAIL*/}
                            <TextField
                                style={{
                                    maxWidth: '380px',
                                    lineHeight: '1',
                                    fontWeight: '600',
                                    fontSize: '1.1rem',
                                    color: '#333',
                                }}
                                name="email"
                                variant='outlined'
                                label="Email"
                                type="email"
                                fullWidth
                                value={dataForReg.email}
                                onFocus={() => {
                                    setOpenEmailError(false)
                                    setOpenEmailExisted(false)
                                }}
                                onChange={(e) => setDataForReg({ ...dataForReg, email: e.target.value })}
                            />

                            {/*PASSWORD */}
                            <Stack direction="row" width="100%" spacing={1.5}>
                                <TextField
                                    name="password"
                                    variant='outlined'
                                    label="Mật khẩu"
                                    style={{
                                        maxWidth: '380px',
                                        lineHeight: '1',
                                        fontWeight: '600',
                                        fontSize: '1.1rem',
                                        color: '#333',
                                    }}
                                    type={passwordShown ? "text" : "password"}
                                    fullWidth
                                    value={dataForReg.password}
                                    onFocus={() => setOpenPasswordError(false)}
                                    onChange={(e) => setDataForReg({ ...dataForReg, password: e.target.value })}
                                />
                                {passwordShown ? (
                                    <IconButton style={{ backgroundColor: '#ead1ea' }} onClick={togglePassword}>
                                        <VisibilityIcon color="success" />
                                    </IconButton>
                                ) : (
                                    <IconButton style={{ backgroundColor: '#ead1ea' }} onClick={togglePassword}>
                                        <VisibilityOffIcon />
                                    </IconButton>
                                )}
                            </Stack>

                            {/*Confirm password */}
                            <Stack direction="row" spacing={1.5}>
                                <TextField
                                    name="password"
                                    variant='outlined'
                                    label="Nhập lại mật khẩu"
                                    style={{
                                        maxWidth: '380px',
                                        lineHeight: '1',
                                        fontWeight: '600',
                                        fontSize: '1.1rem',
                                        color: '#333',
                                    }}
                                    type={cfPasswordShown ? "text" : "password"}
                                    fullWidth
                                    value={cfPass}
                                    onFocus={() => setOpenCfPasswordError(false)}
                                    onChange={(e) => setCfPass(e.target.value)}
                                />
                                {cfPasswordShown ? (
                                    <IconButton style={{ backgroundColor: '#ead1ea' }} onClick={toggleCfPassword}>
                                        <VisibilityIcon color="success" />
                                    </IconButton>
                                ) : (
                                    <IconButton style={{ backgroundColor: '#ead1ea' }} onClick={toggleCfPassword}>
                                        <VisibilityOffIcon />
                                    </IconButton>
                                )}
                            </Stack>


                            {/*button for opening modal term */}
                            {(!openModal && isChecked) ? (
                                <div style={{ display: 'flex', flexDirection: 'row', marginTop: '10px' }}>
                                    <CheckCircleRoundedIcon
                                        style={{
                                            color: 'black',
                                            width: '26px',
                                            height: '26px',
                                            marginBottom: '-10px',
                                            paddingTop: '0px'
                                        }}
                                    />
                                    <p style={{ fontSize: '13px', fontWeight: 'bold', marginLeft: '5px', marginTop: '7px' }}>
                                        Accepted all the terms in this web.
                                    </p>
                                </div>
                            ) : (
                                <Button
                                    onClick={handleOpenModal}
                                    variant='outlined'
                                    size="small"
                                    style={{
                                        maxWidth: '400px',
                                        height: '10%',
                                        borderRadius: '15px',
                                        color: 'black',
                                        marginTop: '10px',
                                        marginBottom: '10px'
                                    }}
                                >
                                    Xem điều khoản đăng ký
                                </Button>
                            )}
                            <div style={{
                                width: '100%',
                                paddingLeft: '25%',
                                paddingRight: '60%'
                            }}>
                                <Button
                                    onClick={() => handleCreateAccount()}
                                    disabled={canReg}
                                    style={{
                                        marginTop: '10px',
                                        borderRadius: '20px',
                                        border: '1px solid #18608a',
                                        backgroundColor: '#000000',
                                        color: '#ffffff',
                                        fontSize: '13px',
                                        fontWeight: 'bold',
                                        padding: '12px 45px',
                                        letterSpacing: '1px',
                                    }}
                                >
                                    Đăng ký
                                </Button>
                            </div>
                            <Modal
                                open={openModal}
                                onClose={handleCloseModal}
                                aria-labelledby="modal-modal-title"
                                aria-describedby="modal-modal-description"
                            >
                                <Box sx={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    width: '40%',
                                    height: 'auto',
                                    bgcolor: 'background.paper',
                                    border: '2px solid #000',
                                    boxShadow: 24,
                                    p: 7,
                                }}>
                                    <Typography id="modal-modal-title" variant="h6" component="h2">
                                        ComeBuy's terms
                                    </Typography>
                                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                                        While we know it's easy to overlook these Terms of Service, it's important to clarify our responsibilities and your responsibilities during your use of Google services.
                                        These Terms of Service reflect the way Google does business, the laws our company must follow, and some of the things we have always believed to be true. These Terms of Service therefore help define Google's relationship with you when you interact with our services. For example, these terms cover the following topics:

                                        Our Responsibilities: This is a description of how we deliver and develop our services
                                        Your responsibilities: This section outlines some rules that you must follow when using our services
                                        Content in Google services: This section describes the intellectual property rights to the content you see in our services, regardless of whether it belongs to you, Google, or someone else.
                                        In the event of a problem or disagreement: This section describes other legal rights you have and what you should know in the event someone violates these terms
                                        It is very important to understand these terms because by using our services you agree to these terms.
                                    </Typography>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                size="large"
                                                color='success'
                                                onChange={() => {
                                                    if (isChecked) {
                                                        setIsChecked(false)
                                                        setCanReg(true)
                                                    } else {
                                                        setIsChecked(true)
                                                        setCanReg(false)
                                                    }
                                                }} checked={isChecked}
                                            />}
                                        style={{ fontFamily: '-moz-initial' }}
                                        label="I accept all terms"
                                    />
                                    <br></br>
                                    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                                        <Button onClick={handleCloseModal}>Continue</Button>
                                    </Box>
                                </Box>
                            </Modal>
                        </Stack>
                        {/*Dialog for having registered successfully or email existed */}
                        {openDialogRegFailed ? (
                            <Dialog open={openDialogRegFailed} onClose={handleCloseDialogRegFailed}>
                                <DialogTitle color='error'>Registered failed</DialogTitle>
                                <Button
                                    onClick={handleCloseDialogRegFailed}
                                    style={{
                                        alignSelf: 'center',
                                        width: '30px',
                                        height: '30px',
                                        borderRadius: '15px',
                                        border: '1px solid #18608a',
                                        backgroundColor: 'red',
                                        color: 'black',
                                        fontSize: '13px',
                                        marginBottom: '10px',
                                        fontWeight: 'bold',
                                        padding: '12px 45px',
                                    }}
                                >
                                    OK
                                </Button>
                            </Dialog>
                        ) : null
                        }

                        {openDialogRegSuccessfully ?
                            (
                                <Dialog open={openDialogRegSuccessfully} onClose={handleCloseDialogRegSuccessfully}>
                                    <DialogTitle>Registered successfully</DialogTitle>
                                    <Button
                                        onClick={handleCloseDialogRegSuccessfully}
                                        style={{
                                            alignSelf: 'center',
                                            width: '30px',
                                            height: '30px',
                                            borderRadius: '15px',
                                            border: '1px solid #18608a',
                                            backgroundColor: 'green',
                                            color: '#ffffff',
                                            fontSize: '13px',
                                            marginBottom: '10px',
                                            fontWeight: 'bold',
                                            padding: '12px 45px',
                                        }}
                                    >
                                        OK
                                    </Button>
                                </Dialog>
                            ) : null}

                        <Modal
                            open={openModalVerify}
                            onClose={handleCloseModalVerify}
                            aria-labelledby="modal-verify-title"
                            aria-describedby="modal-verify-description"
                        >
                            <Box sx={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: '40%',
                                height: 'auto',
                                bgcolor: 'background.paper',
                                border: '2px solid #000',
                                boxShadow: 24,
                                p: 4,
                            }}
                            >
                                <Typography
                                    id="modal-verify-title"
                                    variant="h6"
                                    component="h2"
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'flex-end',
                                        position: 'absolute',
                                        marginBottom: '10px',
                                    }}>
                                    Verify
                                </Typography>
                                <Typography id="modal-verify-description" style={{ marginTop: '40px' }}>
                                    We sent a verified code. Please check your email
                                </Typography>

                                <div class="container-modal-verify">
                                    <div class="userInput-modal-verify">
                                        <input
                                            ref={pin1Ref}
                                            className='input-verify'
                                            type="text"
                                            id='ist'
                                            maxLength="1"
                                            onKeyUp={() => {
                                                pin2Ref.current.focus()
                                            }}
                                            onChange={
                                                (e) => {
                                                    setPin1(e.target.value)
                                                }
                                            }
                                        />
                                        <input
                                            ref={pin2Ref}
                                            className='input-verify'
                                            type="text"
                                            maxLength="1"
                                            onKeyUp={() => {
                                                pin3Ref.current.focus()
                                            }}
                                            onChange={(e) => {
                                                setPin2(e.target.value)
                                            }
                                            } />
                                        <input
                                            ref={pin3Ref}
                                            className='input-verify'
                                            type="text"
                                            maxLength="1"
                                            onKeyUp={() => {
                                                pin4Ref.current.focus()
                                            }}
                                            onChange={(e) => {
                                                setPin3(e.target.value)
                                            }
                                            } />
                                        <input
                                            ref={pin4Ref}
                                            className='input-verify'
                                            type="text"
                                            maxLength={1}
                                            onKeyUp={() => {
                                                pin5Ref.current.focus()
                                            }}
                                            onChange={(e) => {
                                                setPin4(e.target.value)
                                            }} />
                                        <input
                                            ref={pin5Ref}
                                            className='input-verify'
                                            type="text"
                                            maxLength={1}
                                            onChange={(e) => {
                                                setPin5(e.target.value)
                                            }
                                            } />
                                    </div>
                                    <div style={{
                                        marginTop: '15px',
                                        display: 'flex',
                                        justifyContent: 'flex-end'
                                    }}>
                                        {
                                            toggleRefresh ? (
                                                <Stack style={{ flexDirection: "flex-end" }} direction="row">
                                                    <Autorenew
                                                        className={clsx({
                                                            [classes.refresh]: true,
                                                            spin: spin
                                                        })}
                                                        onClick={() => { refreshCanvas() }}
                                                        spin={360}
                                                    />
                                                    <Button
                                                        onClick={handleVerifyAndReg}
                                                        style={{
                                                            width: 'auto',
                                                            borderRadius: '20px',
                                                            backgroundColor: '#18608a',
                                                            color: '#ffffff',
                                                            fontSize: '13px',
                                                            fontWeight: 'bold',
                                                            letterSpacing: '1px',
                                                        }}
                                                    >
                                                        CONFIRM
                                                    </Button>
                                                </Stack>) : (
                                                <Stack direction="row" >
                                                    <CountDown onTimesup={onTimesup} />
                                                    <Button
                                                        onClick={handleVerifyAndReg}
                                                        style={{
                                                            width: 'auto',
                                                            borderRadius: '20px',
                                                            backgroundColor: '#18608a',
                                                            color: '#ffffff',
                                                            fontSize: '13px',
                                                            fontWeight: 'bold',
                                                            letterSpacing: '1px',
                                                        }}
                                                    >
                                                        CONFIRM
                                                    </Button>
                                                </Stack>

                                            )
                                        }
                                    </div>
                                </div>
                            </Box>
                        </Modal>

                        {/*Snackbar*/}
                        <Snackbar open={openWrongVerify} autoHideDuration={6000} onClose={handleCloseWrongVerify}>
                            <Alert onClose={handleCloseWrongVerify} severity="error" sx={{ width: '100%' }}>
                                Wrong verify code. Please try again.
                            </Alert>
                        </Snackbar>
                    </form>


                    {/* LOGIN */}
                    <form action="#" className="sign-in-form">
                        {/*PASSWORD */}
                        <Stack direction="column" width='100%' spacing={2}>
                            <h2 className="title">Đăng nhập</h2>
                            {/*EMAIL*/}
                            <TextField
                                name="email"
                                variant='outlined'
                                label="Email"
                                type="email"
                                fullWidth
                                value={emailUser}
                                onFocus={() => setOpenEmailLoginError(false)}
                                onChange={(e) => setEmailUser(e.target.value)}
                            />
                            {openEmailLoginError ? (
                                <Alert style={{ marginTop: '15px' }} severity="warning">Please type email</Alert>
                            ) : (
                                null
                            )}
                            <Stack direction="row" width="100%" spacing={2}>
                                <TextField
                                    style={{
                                        maxWidth: '380px',
                                        lineHeight: '1',
                                        fontWeight: '600',
                                        fontSize: '1.1rem',
                                        color: '#333',
                                    }}
                                    name="password"
                                    variant='outlined'
                                    label="Mật khẩu"
                                    type={passwordShown ? "text" : "password"}
                                    fullWidth
                                    value={passwordUser}
                                    onFocus={() => setOpenPasswordLoginError(false)}
                                    onChange={(e) => setPasswordUser(e.target.value)}
                                />
                                {passwordShown ? (
                                    <IconButton style={{ backgroundColor: '#ead1ea' }} onClick={togglePassword}>
                                        <VisibilityIcon color="success" />
                                    </IconButton>
                                ) : (
                                    <IconButton style={{ backgroundColor: '#ead1ea' }} onClick={togglePassword}>
                                        <VisibilityOffIcon />
                                    </IconButton>
                                )}
                            </Stack>
                            <Button
                                onClick={handleForgotPassword}
                                sx={{
                                    maxWidth: '60px'
                                }}
                            >Quên mật khẩu ?</Button>
                        </Stack>
                        {openPasswordLoginError ? (
                            <Alert severity="warning">
                                Type password
                            </Alert>
                        ) : (
                            null
                        )}

                        <Button
                            onClick={() => handleLogin()}
                            style={{
                                marginTop: '2%',
                                borderRadius: '20px',
                                border: '1px solid #18608a',
                                backgroundColor: '#000000',
                                color: '#ffffff',
                                fontSize: '13px',
                                fontWeight: 'bold',
                                padding: '12px 45px',
                                letterSpacing: '1px',
                            }}
                        >
                            Đăng nhập
                        </Button>
                        {
                            _loadingUser == true ?
                                <p>loading.....</p> :
                                null
                        }
                    </form>
                </div>
            </div >

            <div className="panels-container">
                <div className="panel left-panel">
                    <div className="content">
                        <h3 style={{
                            opacity: 0
                        }}>Mới ở đây à?</h3>
                        <p style={{
                            opacity: 0
                        }}>
                        Sở hữu chiếc laptop tốt nhất trên ComeBuy luôn là sự lựa chọn tốt nhất của bạn
                        </p>
                        <button className="btn transparent" id="sign-up-btn" onClick={() => setAddClass('sign-up-mode')}>
                            Đăng ký
                        </button>
                    </div>
                    <Register2SVG className="image" />
                </div>
                <div className="panel right-panel">
                    <div className="content">
                        <h3 style={{
                            opacity: 0
                        }}>Một trong số chúng tôi ?</h3>
                        <p style={{
                            opacity: 0
                        }}>
                        Hãy đăng nhập ngay bây giờ. Một điều gì đó hoàn hảo đang chờ đợi bạn
                        </p>
                        <button className="btn transparent" id="sign-in-btn" onClick={() => setAddClass('')}>
                            Đăng nhập
                        </button>
                    </div>
                    <Register1SVG className="image" />
                </div>
                <Fab sx={{ position: 'absolute', backgroundColor: '#EA8BFA' }} onClick={() => navigate('/')} size="small" color="secondary" aria-label="add">
                    <HomeIcon sx={{ color: 'white' }} />
                </Fab>
            </div>
            {/*Snackbar*/}
            <Snackbar open={openLoginFailed} autoHideDuration={6000} onClose={handleCloseLoginFailed}>
                <Alert onClose={handleCloseLoginFailed} severity="error" sx={{ width: '100%' }}>
                    Something went wrong ! Please check your email and password.
                </Alert>
            </Snackbar>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={openBackdrop}
            >
                <CircularProgress color="inherit" />
            </Backdrop>

            {/*Snackbar for username error*/}
            <Snackbar open={openUsernameError} autoHideDuration={3000} >
                <Alert severity="error" sx={{ width: 'auto' }}>
                    Username can't have length under 5 and can't have
                    only space or any of these letter /^ *$.,;:@#""''-!`~%&\/(){ }[]/
                </Alert>
            </Snackbar>

            {/*Snackbar for email error*/}
            <Snackbar open={openEmailError} autoHideDuration={3000} >
                <Alert severity="error" sx={{ width: 'auto' }}>
                    Please type email
                </Alert>
            </Snackbar>

            {/*Snackbar for password error*/}
            <Snackbar open={openPasswordError} autoHideDuration={3000} >
                <Alert severity="error" sx={{ width: 'auto' }}>
                    Password has to have at least 8 letters, one number, one lowercase and one uppercase letter
                </Alert>
            </Snackbar>

            {/*Snackbar for cf password error*/}
            <Snackbar open={openCfPasswordError} autoHideDuration={3000} >
                <Alert severity="error" sx={{ width: 'auto' }}>
                    Password is not match
                </Alert>
            </Snackbar>

            {/*Snackbar for cf password error*/}
            <Snackbar open={openEmailExisted} autoHideDuration={3000} >
                <Alert severity="warning" sx={{ width: 'auto' }}>
                    Account with this email was existed
                </Alert>
            </Snackbar>

        </div >
    )
}

export default LoginRegister
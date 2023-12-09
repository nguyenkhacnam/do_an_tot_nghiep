import * as React from 'react';
import { useDispatch } from 'react-redux'
import ReactToPrint from 'react-to-print';
import { updateInvoice } from '../../redux/slices/invoiceSlice';
import { unwrapResult } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';

import CusInfo from './../InvoiceCusInfo/index';

import Header from '../CounterHeader';
import MainDetails from '../CounterMainDetails';
import ClientDetails from '../CounterClientDetails';
import Dates from '../CounterDates';
import TablePrint from '../CounterTablePrint';
import Notes from '../CounterNotes';
import Footer from '../CounterFooter';

import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Popover from '@mui/material/Popover';
import Button from '@mui/material/Button';
import { Modal } from '@mui/material';
import { Stack } from '@mui/material';
import TableInvoiceItem from '../InvoiceTableInvoiceItem';
import { currentUser } from '../../redux/selectors';
import ProdInfo from './../InvoiceProdInfo/index';
import IOSSwitch from './../InvoiceIOSSwitch/index';
import ReceiptIcon from '@mui/icons-material/Receipt';
const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const steps = ['Checked', 'Delivered'];

const Row = (props) => {
    const componentRef = React.useRef()
    const handlePrint = () => {
        window.print()
    }
    const _currentUser = useSelector(currentUser)

    const { row } = props;
    const [open, setOpen] = React.useState(false);

    //for open backdrop
    const [openBackdrop, setOpenBackdrop] = React.useState(false);
    const handleCloseBackdrop = () => {
        setOpenBackdrop(false);
    };
    const handleToggleBackdrop = () => {
        setOpenBackdrop(!openBackdrop);
    };

    //Get customer information
    const [anchorEl, setAnchorEl] = React.useState(null);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const openHover = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    //Get invoice detail (address)
    const [anchorE3, setAnchorE3] = React.useState(null);
    const handleClickInvoiceID = (event) => {
        setAnchorE3(event.currentTarget);
    };
    const handleCloseInvoiceID = () => {
        setAnchorE3(null);
    };
    const openHoverInvoiceID = Boolean(anchorE3);
    const id3 = open ? 'simple-popover' : undefined;

    //Get product information
    const [anchorEl2, setAnchorEl2] = React.useState(null);
    const handleClickProductId = (event) => {
        setAnchorEl2(event.currentTarget)
    }
    const handleProductPopoverOpen = (event) => {
        setAnchorEl2(event.currentTarget);
    };
    const handleProductPopoverClose = () => {
        setAnchorEl2(null);
    };
    const openProductHover = Boolean(anchorEl2);
    const id2 = open ? 'simple-popover' : undefined;


    //Execute process of managing invoice
    const [disablePaid, setDisablePaid] = React.useState(false)
    const [disableCheck, setDisableCheck] = React.useState(false)

    const [isChecked, setIsChecked] = React.useState(row.isChecked)
    const [isPaid, setIsPaid] = React.useState(row.isPaid)

    const [dataForUpdate, setDataForUpdate] = React.useState({
        invoiceID: row.invoiceID,
        moneyReceived: row.moneyReceived,
        total: row.total,
        isChecked: row.isChecked,
        isPaid: row.isPaid
    })

    //for snackbar
    const [openSnackbar, setOpenSnackbar] = React.useState(false);
    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };

    const [updating, setUpdating] = React.useState(false)

    const dispatch = useDispatch()

    React.useEffect(() => {
        if (updating === true) {
            setOpenBackdrop(true)
        } else {
            setOpenBackdrop(false)
        }
    }, [updating])

    const handleClickPaidInvoice = async () => {
        setUpdating(true)
        let temp = dataForUpdate
        try {
            if (temp.isChecked === true) {
                temp = {
                    ...temp,
                    isPaid: true,
                    moneyReceived: invoiceTotal
                }
            } else {
                temp = {
                    ...temp,
                    isChecked: true,
                }
            }
            const resultAction = await dispatch(updateInvoice(temp))
            const originalPromiseResult = unwrapResult(resultAction)
            setDataForUpdate(temp)
            console.log("temp:" + temp)
            console.log("dataforup:" + dataForUpdate)
            setActiveStep(activeStep + 1)
            setUpdating(false)
            setOpenSnackbar(true)
        } catch (rejectedValueOrSerializedError) {
            // handle error here
            console.log(rejectedValueOrSerializedError.message);
        }
    }

    function Total() {
        let total = 0;
        for (let i = 0; i < row.invoiceitem.length; i++) {
            total = total + Number(row.invoiceitem[i].total)
        }
        return total;
    }

    const [invoiceTotal, setInvoiceTotal] = React.useState(0)

    React.useEffect(() => {
        if (invoiceTotal === 0) {
            setInvoiceTotal(Total())
        }
    }, [])

    const [openModalBill, setOpenModalBill] = React.useState(false)
    const closeModalBill = () => {
        setOpenModalBill(false)
    }

    const [activeStep, setActiveStep] = React.useState(0);

    React.useEffect(() => {
        let t = false
        const setActive = () => {
            if (Boolean(row.isChecked) === true) {
                if (Boolean(row.isPaid) === true) {
                    setActiveStep(2)
                } else {
                    setActiveStep(1)
                }
            } else {
                setActiveStep(0)
            }
        }
        if (t === false) {
            setActive()
            t = true
        }
    }, [])
    return (
        <React.Fragment >
            <TableRow sx={{ '& > *': { borderBottom: 'set', backgroundColor: 'white' } }}>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        sx={{ backgroundColor: 'white' }}
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon style={{ color: 'black' }} /> : <KeyboardArrowDownIcon style={{ color: 'black' }} />}
                    </IconButton>
                </TableCell>
                <TableCell scope="row">
                    <Box>
                        <Typography style={{ color: 'black', fontWeight: 'bold', fontSize: '13px' }}>{row.invoiceID}</Typography>
                    </Box>
                </TableCell>
                <TableCell align="center">
                    <Button
                        aria-describedby={id}
                        onClick={handleClick}
                        sx={{ fontSize: '13px', color: 'green' }}
                    >
                        {row.account.userid}
                    </Button>
                    <Popover
                        id={id}
                        open={openHover}
                        anchorEl={anchorEl}
                        onClose={handleClose}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                    >
                        <CusInfo userID={row.account.userid} />
                    </Popover>
                </TableCell>
                <TableCell align="center" style={{ color: 'black', fontSize: '13px' }}>{row.date}</TableCell>
                <TableCell align="center" style={{ color: 'black', fontWeight: 'bold', fontSize: '13px' }}>{invoiceTotal}</TableCell>
                <TableCell align="center">
                    <Box sx={{ width: '100%' }}>
                        <Stepper activeStep={activeStep} alternativeLabel>
                            {steps.map((label) => (
                                <Step color='success' key={label}>
                                    <StepLabel sx={{ fontSize: '7px' }}>{label}</StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                        <div>
                            <React.Fragment>
                                <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                                    <Box sx={{ flex: '1 1 auto' }} />
                                    {activeStep !== steps.length ? (
                                        <Button onClick={handleClickPaidInvoice} sx={{ fontSize: '9px' }} >
                                            Done
                                        </Button>
                                    ) : (
                                        null
                                    )}
                                </Box>
                            </React.Fragment>
                        </div>
                    </Box>
                </TableCell>
                {dataForUpdate.isPaid ? (
                    <TableCell align="center">
                        <Button sx={{ fontSize: '13px' }} onClick={() => setOpenModalBill(true)}>Print</Button>
                    </TableCell>
                ) : (
                    <TableCell align="center">
                        <Typography sx={{ fontSize: '13px' }}>Execute</Typography>
                    </TableCell>
                )}
            </TableRow>
            <TableRow sx={{ '& > *': { borderBottom: 'set', backgroundColor: 'white' } }}>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0, backgroundColor: 'white', marginLeft: '10%' }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography variant="h7" style={{ fontSize: '13px', fontWeight: 'bold', color: 'black', textDecoration: 'underline' }} gutterBottom component="div">
                                Details:
                            </Typography>
                            <Typography variant="h8" style={{ fontSize: '13px', fontWeight: 'bold', color: 'black' }} gutterBottom component="div">
                                Ship to: {row.address}
                            </Typography>
                            <Table size="small" aria-label="purchases">
                                <TableHead>
                                    <TableRow>
                                        <TableCell style={{ color: 'black', fontSize: '13px' }}>Product ID</TableCell>
                                        <TableCell align="center" style={{ color: 'black', fontSize: '13px' }}>Amount</TableCell>
                                        <TableCell align="center" style={{ color: 'black', fontSize: '13px' }}>Total price (USD)</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {row.invoiceitem.map((detailsRow) => (
                                        detailsRow.productid != null ? (
                                            <TableRow key={detailsRow.productid}>
                                                <TableCell component="th" scope="row">
                                                    <Button
                                                        aria-describedby={id}
                                                        onClick={handleProductPopoverOpen}
                                                        style={{ fontSize: '13px', fontWeight: 'bold', color: '#52BF04', fontStyle: 'italic' }}
                                                    >
                                                        {detailsRow.productid}
                                                    </Button>
                                                    <Popover
                                                        id={id}
                                                        open={openProductHover}
                                                        anchorEl={anchorEl2}
                                                        anchorOrigin={{
                                                            vertical: 'top',
                                                            horizontal: 'right',
                                                        }}
                                                        onClose={handleProductPopoverClose}
                                                    // disableRestoreFocus
                                                    >
                                                        <ProdInfo productID={detailsRow.productid} />
                                                    </Popover>
                                                </TableCell>
                                                <TableCell align="center" style={{ fontSize: '13px', color: 'black' }}>{detailsRow.amount}</TableCell>
                                                <TableCell align="center" style={{ fontSize: '13px', fontWeight: 'bold', color: 'black' }}>{detailsRow.total}</TableCell>
                                            </TableRow>
                                        ) : (
                                            null
                                        )
                                    )
                                    )}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={openBackdrop}
            >
                <CircularProgress color="inherit" />
            </Backdrop>

            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
                    Updated successfully !
                </Alert>
            </Snackbar>
            <Modal
                open={openModalBill}
                onClose={closeModalBill}

            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '45%',
                    height: 'auto',
                    bgcolor: 'background.paper',
                    border: '2px solid #000',
                    p: 4,
                    boxShadow: 5,
                    borderRadius: 10,
                }}
                >
                    <Stack ref={componentRef} sx={{ paddingTop: '3rem' }} direction="column" width="100%">
                        <Stack direction="row" width="100%" sx={{ marginRight: '2rem', backgroundColor: 'grey' }}>
                            <Stack direction="column" width="100%">
                                <Header handlePrint={handlePrint} />
                                <Dates
                                    invoiceDate={row.date}
                                />
                            </Stack>
                            <Stack direction="column" width="100%">
                                <h1
                                    style={{
                                        fontSize: '30px',
                                        fontWeight: 'bold',
                                        letterSpacing: '0.1rem',
                                        marginTop: '1.2rem'
                                    }}
                                >
                                    ComeBuy
                                </h1>
                                <Typography
                                    sx={{
                                        marginTop: '-7%',
                                        fontSize: '13px',
                                        color: 'grey',
                                        marginLeft: '2rem'
                                    }}
                                >
                                    invoice at branch
                                </Typography>
                            </Stack>
                        </Stack>
                        {/* <div style={{ height: '0.5px', backgroundColor: 'grey', marginLeft: '3rem', marginRight: '3rem' }}> </div> */}
                        <Stack direction="row" width="100%" sx={{ marginRight: '2rem', marginTop: '1.5rem', backgroundColor: 'grey' }}>
                            <Stack width="50%">
                                <ClientDetails
                                    clientName={row.account.name}
                                    clientAddress={row.account.address}
                                />
                            </Stack>
                            <Stack>
                                <MainDetails contact={_currentUser.phoneNumber} name={"Printed by " + _currentUser.name}
                                    address={"ComeBuy Store"} />
                            </Stack>
                        </Stack>

                        <TableInvoiceItem
                            list={row.invoiceitem}
                            total={invoiceTotal}
                        />
                        <Notes notes="Online" />
                        <div style={{ marginLeft: '2rem', marginRight: '2rem', height: '1px', backgroundColor: 'grey' }}></div>
                        <Footer
                            name={"Printed by " + _currentUser.name}
                            address={"ComeBuy Store"}
                            email={"Printer Email: " + _currentUser.email}
                            phone={"Printer phone: " + _currentUser.phoneNumber}
                        />
                    </Stack>
                    <ReactToPrint
                        trigger={() => (
                            <Button style={{ marginTop: '5%', width: '50%', marginLeft: '50%' }} variant="outlined">
                                Print / Download
                            </Button>
                        )}
                        content={() => componentRef.current}
                    // onAfterPrint={() => AfterPrint()}
                    />
                </Box>
            </Modal>
        </React.Fragment >
    );
}

export default Row
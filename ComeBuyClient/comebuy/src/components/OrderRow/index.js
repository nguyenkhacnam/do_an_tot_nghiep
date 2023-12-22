import { Button, IconButton, TableRow } from '@mui/material';
import * as React from 'react'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ProdInfo from '../InvoiceProdInfo';
import Popover from '@mui/material/Popover';
import { Collapse, Box, Typography, TableCell, Table, TableHead, TableBody } from '@mui/material';
import { unwrapResult } from '@reduxjs/toolkit';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';

import { useDispatch } from 'react-redux';

const steps = ['Đã xác nhận', 'Đã vận chuyển'];

const OrderRow = (props) => {
    const { row } = props;
    const [open, setOpen] = React.useState(false);

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

    const [updating, setUpdating] = React.useState(false)

    const dispatch = useDispatch()

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
                        {open ? <KeyboardArrowUpIcon sx={{ color: 'black' }} /> : <KeyboardArrowDownIcon sx={{ color: 'black' }} />}
                    </IconButton>
                </TableCell>
                <TableCell scope="row">
                    <Typography
                        sx={{ fontSize: '13px' }}
                        aria-describedby={id}
                    >
                        #{row.invoiceID}
                    </Typography>
                </TableCell>
                <TableCell align="center">
                    <Typography
                        sx={{ fontSize: '13px' }}
                        aria-describedby={id}
                    >
                        {row.date}
                    </Typography>
                </TableCell>
                <TableCell align="center" style={{ color: 'black', fontWeight: 'bold', fontSize: '14px' }}>{invoiceTotal}</TableCell>
                <TableCell align="center" style={{ color: 'black', fontSize: '14px' }}>
                    <Box sx={{ width: '100%' }}>
                        <Stepper activeStep={activeStep} alternativeLabel>
                            {steps.map((label) => (
                                <Step color='success' key={label}>
                                    <StepLabel sx={{ fontSize: '7px' }}>{label}</StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                    </Box>
                </TableCell>
            </TableRow>
            <TableRow sx={{ '& > *': { borderBottom: 'set', backgroundColor: 'white' } }}>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0, backgroundColor: 'white', marginLeft: '10%' }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography variant="h7" style={{ fontWeight: 'bold', color: 'black', textDecoration: 'underline' }} gutterBottom component="div">
                                Chi tiết:
                            </Typography>
                            <Typography variant="h8" style={{ fontSize: '14px', fontWeight: 'bold', color: 'black' }} gutterBottom component="div">
                                Nhận đơn hàng tại địa chỉ: {row.address}
                            </Typography>
                            <Table size="small" aria-label="purchases">
                                <TableHead>
                                    <TableRow>
                                        <TableCell style={{ color: 'black' }}>ID Sản phẩm</TableCell>
                                        <TableCell align="center" style={{ color: 'black' }}>Số lượng</TableCell>
                                        <TableCell align="center" style={{ color: 'black' }}>Tổng tiền(VND)</TableCell>
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
                                                        style={{ fontWeight: 'bold', fontSize: '14px', color: 'black', fontStyle: 'italic' }}
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
                                                <TableCell align="center" sx={{ fontSize: '13px' }}>{detailsRow.amount}</TableCell>
                                                <TableCell align="center" style={{ fontWeight: 'bold', color: 'black', fontSize: '13px' }}>{detailsRow.total}</TableCell>
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
        </React.Fragment >
    )
}

export default OrderRow;

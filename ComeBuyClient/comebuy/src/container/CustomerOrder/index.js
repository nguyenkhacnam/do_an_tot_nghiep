import React from 'react'
import { Stack, Box, TablePagination, TableRow, TableCell, TextField, Button, IconButton } from '@mui/material';
import NavBar from './../../components/NavBar/NavBar';
import BigFooter from './../../components/BigFooter/index';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import OrderRow from './../../components/OrderRow/index';
import { Paper, Table, TableBody, TableHead, TableContainer } from '@mui/material';

import { useDispatch, useSelector } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import { getAllInvoice } from '../../redux/slices/invoiceSlice';
import { currentUser } from '../../redux/selectors';

export const CustomerOrderSpace = () => {
    const [invoiceList, setInvoiceList] = React.useState([])
    const _currentUser = useSelector(currentUser)

    const dispatch = useDispatch();

    //for paginating
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    React.useEffect(() => {
        async function fetchInvoice() {
            let temp = []
            if (invoiceList.length === 0) {
                try {
                    const resultAction = await dispatch(getAllInvoice())
                    const originalPromiseResult = unwrapResult(resultAction)
                    originalPromiseResult?.data?.map((i) => {
                        if (i.userid === _currentUser.userID) {
                            temp.push(i)
                        }
                    })
                    setInvoiceList(temp)
                } catch (rejectedValueOrSerializedError) {
                    console.log(rejectedValueOrSerializedError);
                }
            }
        }
        fetchInvoice()
        return () => {
            setInvoiceList({});
        };
    }, [])

    const [fromDate, setFromDate] = React.useState('');
    const [toDate, setToDate] = React.useState('')

    const makeDate = (ostr) => {
        let index = ostr.indexOf(' ', 0)
        let str = ostr.slice(0, index)
        let i1 = str.indexOf('/', 0)
        let i2 = str.indexOf('/', i1 + 1)
        let day = str.slice(0, i1)
        let month = str.slice(i1 + 1, i2)
        let year = str.slice(i2 + 1, str.length)
        let here = new Date(year + '-' + month + '-' + day)
        return here;
    }

    const [output, setOutput] = React.useState([])
    console.log('output', output);
    const [changeDataBySearch, setChangeDataBySearch] = React.useState(false)

    const [openSnackbar, setOpenSnackbar] = React.useState(false)

    const handleCloseSnackbar = () => setOpenSnackbar(false)


    const handleSearch = () => {
        let temp = []
        if (new Date(fromDate) > new Date(toDate)) {
            setOpenSnackbar(true)
        } else {
            invoiceList?.map((i) => {
                if (fromDate != '') {
                    if (toDate != '') {
                        if ((makeDate(i.date) >= new Date(fromDate)) && (makeDate(i.date) <= new Date(toDate))) {
                            temp.push(i)
                        }
                    } else {
                        if (makeDate(i.date) >= new Date(fromDate)) {
                            temp.push(i)
                        }
                    }
                } else {
                    if (toDate != '') {
                        if (makeDate(i.date) <= new Date(toDate)) {
                            temp.push(i)
                        }
                    } else {
                        setChangeDataBySearch(false)
                    }
                }
            })
            setOutput(temp)
            setChangeDataBySearch(true)
        }
    }

    const handleRefresh = () => {
        setFromDate('')
        setToDate('')
        setChangeDataBySearch(false)
    }
    return (
        <Stack direction="column" sx={{
            width: "100%",
            height: "100%",
            // justifyItems: 'center',
            // alignItems: 'center',
            backgroundColor: 'grey',
            overflowY: 'auto',
            position: 'absolute'
        }}>
            <NavBar></NavBar>
            <Box sx={{
                width: "90%",
                height: "90%",
                boxShadow: 10,
                marginTop: 5,
                alignSelf: 'center',
                borderRadius: 3,
                alignItems: 'center',
                justifyItems: 'center',
                backgroundColor: 'white',
                marginBottom: 5
            }}>
                <Stack sx={{
                    width: "100%",
                    height: "100%",
                    marginBottom: 5
                }}>
                    <Stack direction="row" spacing={2} 
                        style={{
                            marginLeft: '250px'
                        }}
                    sx={{
                        marginTop: 3,
                        marginBottom: 2,
                        marginLeft: 10,
                    }}>
                        <TextField
                            id="date"
                            label="Từ ngày"
                            type="date"
                            value={fromDate}
                            sx={{
                                width: 220,
                                fontSize: '14px'
                            }}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            onChange={e => setFromDate(e.target.value)}
                        />
                        <TextField
                            id="date"
                            label="Đến ngày"
                            type="date"
                            value={toDate}
                            sx={{
                                width: 220,
                                fontSize: '14px'
                            }}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            onChange={e => setToDate(e.target.value)}
                        />
                        <Button onClick={handleSearch} sx={{ fontSize: '14px' }} color="success" variant="outlined" startIcon={<SearchIcon />}>
                            Tìm kiếm theo ngày
                        </Button>
                        <IconButton onClick={handleRefresh} style={{ backgroundColor: 'white' }}>
                            <RefreshIcon style={{ backgroundColor: 'white' }} />
                        </IconButton>
                    </Stack>
                    <TableContainer
                        style={{
                            height: 600,
                            width: 1200,
                            mb: 2,
                            alignSelf: 'center',
                            backgroundColor: 'white',
                        }}
                        component={Paper}
                    >
                        <Table stickyHeader aria-label="sticky table" >
                            <TableHead style={{
                                backgroundColor: 'white', borderRadius: '15px'
                            }}>
                                <TableRow>
                                    <TableCell />
                                    <TableCell style={{ color: '#0D0D0D', fontWeight: 'bold' }}>ID Hóa đơn</TableCell>
                                    <TableCell align="center" style={{ color: '#0D0D0D', fontWeight: 'bold' }}>Ngày đặt hàng</TableCell>
                                    <TableCell align="center" style={{ color: '#0D0D0D', fontWeight: 'bold' }}>Tổng&nbsp;(VND)</TableCell>
                                    <TableCell align="center" style={{ color: '#0D0D0D', fontWeight: 'bold' }}>Trạng thái đơn hàng</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {changeDataBySearch != true ? (
                                    invoiceList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        ?.map((row) => (
                                            <OrderRow key={row.invoiceID} row={row} />
                                        ))

                                ) : (
                                    output.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row) => (
                                            <OrderRow key={row.invoiceID} row={row} />
                                        ))
                                )}
                            </TableBody>
                        </Table>
                        <TablePagination
                            rowsPerPageOptions={[10, 25, 50]}
                            component="div"
                            style={{}}
                            count={invoiceList.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            sx={{ color: 'black' }}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </TableContainer>
                </Stack>
            </Box>
            <BigFooter />
        </Stack>
    )
}

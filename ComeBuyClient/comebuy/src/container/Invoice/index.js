import * as React from 'react';
import { useDispatch } from 'react-redux'
import { getAllInvoice } from '../../redux/slices/invoiceSlice';
import { unwrapResult } from '@reduxjs/toolkit';
import Row from '../../components/InvoiceRow';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import NavigationIcon from '@mui/icons-material/Navigation';
import TablePagination from '@mui/material/TablePagination';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import { Stack, Box, IconButton } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { TextField } from '@mui/material';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import SearchIcon from '@mui/icons-material/Search';
import { Button } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import SnackBarAlert from './../../components/SnackBarAlert/index';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RemoveDoneIcon from '@mui/icons-material/RemoveDone';
import SortIcon from '@mui/icons-material/Sort';
import FilterListIcon from '@mui/icons-material/FilterList';


const BGImg = styled('img')({
    height: '100%',
    width: '100%',
    position: 'fixed',

})

const actions = [
    { icon: <CheckCircleIcon />, name: 'Hiển thị đơn hàng hoàn thành' },
    { icon: <RemoveDoneIcon />, name: 'Hiển thi đơn hàng chưa hoàn thành' },
    // { icon: <SortIcon />, name: 'Hiển thị đơn hàng tăng' },
    // { icon: <FilterListIcon />, name: 'Hiển thị đơn hàng giảm' }

];

const Invoice = () => {

    const [invoiceList, setInvoiceList] = React.useState([])

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
                    let tempList = []
                    originalPromiseResult?.data?.map((invoice) => {
                        let t = 0
                        invoice.invoiceitem.map(i => {
                            t = t + Number(i.total)
                        })
                        let obj = {
                            ...invoice,
                            total: t
                        }
                        tempList.push(obj)
                    })
                    setInvoiceList(tempList)
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
    const [changeDataBySearch, setChangeDataBySearch] = React.useState(false)

    const [openSnackbar, setOpenSnackbar] = React.useState(false)

    const handleCloseSnackbar = () => setOpenSnackbar(false)


    const handleSearch = () => {
        let temp = []
        if (new Date(fromDate) > new Date(toDate)) {
            setOpenSnackbar(true)
        } else {
            invoiceList.map((i) => {
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

    const handleSpeedDialClick = (action) => {
        if (action.name === 'Hiển thị đơn hàng hoàn thành') {
            let temp = []
            invoiceList.map((i) => {
                if (i.isPaid === true && i.isChecked === true) {
                    temp.push(i)
                }
            })
            setOutput(temp)
            setChangeDataBySearch(true)
        } else if (action.name === 'Hiển thi đơn hàng chưa hoàn thành') {
            let temp = []
            invoiceList.map((i) => {
                if (i.isPaid === false || i.isChecked === false) {
                    temp.push(i)
                }
            })
            setOutput(temp)
            setChangeDataBySearch(true)
        } else if (action.name === 'Show increased orders') {
            let temp = invoiceList
            temp.sort((a, b) => {
                return a.total - b.total
            })
            setOutput(temp)
            setChangeDataBySearch(true)
        } else {
            let temp = invoiceList
            temp.sort((a, b) => {
                return b.total - a.total
            })
            setOutput(temp)
            setChangeDataBySearch(true)
        }
    }


    return (
        <Stack direction="column" sx={{
            width: "100%",
            height: "100%",
            justifyItems: 'center',
            alignItems: 'center',
            backgroundColor: 'grey',
            overflowY: 'auto'
        }}>
            {console.log('invoiceList', invoiceList)}
            <Box sx={{
                width: "90%",
                height: "95%",
                boxShadow: 10,
                borderRadius: 3,
                alignItems: 'center',
                justifyItems: 'center',
                backgroundColor: 'white'
            }}>
                <Stack sx={{
                    width: "100%",
                    height: "100%"
                }}>
                    <Stack direction="row" spacing={2} 
                        style={{
                            marginLeft: '160px'
                        }}
                    sx={{
                        mt: 3,
                        mb: 2,
                        ml: 11
                    }}>
                        <TextField
                            id="date"
                            label="Từ ngày"
                            type="date"
                            size="small"
                            value={fromDate}
                            sx={{
                                width: 220,
                                fontSize: '8px'
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
                            size="small"
                            sx={{
                                width: 220,
                                fontSize: '8px'
                            }}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            onChange={e => setToDate(e.target.value)}
                        />
                        <Button onClick={handleSearch} color="success" variant="outlined" startIcon={<SearchIcon />}>
                            Tìm kiếm
                        </Button>
                        <IconButton onClick={handleRefresh} style={{ backgroundColor: 'white' }}>
                            <RefreshIcon style={{ backgroundColor: 'white' }} />
                        </IconButton>
                    </Stack>
                    <TableContainer
                        style={{
                            height: 720,
                            width: 1400,
                            alignSelf: 'center',
                            backgroundColor: 'white',
                        }}
                        component={Paper}
                    >
                        <Table stickyHeader aria-label="sticky table" >
                            <TableHead style={{ backgroundColor: 'white', borderRadius: '15px' }}>
                                <TableRow>
                                    <TableCell />
                                    <TableCell style={{ color: '#0D0D0D', fontWeight: 'bold', fontSize: '13px' }}>ID Hóa đơn</TableCell>
                                    <TableCell align="center" style={{ color: '#0D0D0D', fontWeight: 'bold', fontSize: '13px' }}>ID Khách hàng</TableCell>
                                    <TableCell align="center" style={{ color: '#0D0D0D', fontWeight: 'bold', fontSize: '13px' }}>Ngày</TableCell>
                                    <TableCell align="center" style={{ color: '#0D0D0D', fontWeight: 'bold', fontSize: '13px' }}>Tổng&nbsp;(VND)</TableCell>
                                    <TableCell align="center" style={{ color: '#0D0D0D', fontWeight: 'bold', fontSize: '13px' }}>Trạng thái</TableCell>
                                    <TableCell align="center" style={{ color: '#0D0D0D', fontWeight: 'bold', fontSize: '13px' }}>In hóa đơn</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {changeDataBySearch != true ? (
                                    invoiceList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row) => (
                                            <Row key={row.invoiceID} row={row} />
                                        ))

                                ) : (
                                    output.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row) => (
                                            <Row key={row.invoiceID} row={row} />
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
                    <Box sx={{ height: 'auto', transform: 'translateZ(0px)', flexGrow: 1 }}>
                        <SpeedDial
                            ariaLabel="SpeedDial basic example"
                            sx={{ position: 'absolute', bottom: 16, right: 16 }}
                            icon={<SpeedDialIcon />}
                        >
                            {actions.map((action) => (
                                <SpeedDialAction
                                    key={action.name}
                                    icon={action.icon}
                                    tooltipTitle={action.name}
                                    onClick={() => handleSpeedDialClick(action)}
                                />
                            ))}
                        </SpeedDial>
                    </Box>

                </Stack>
            </Box>

            <SnackBarAlert open={openSnackbar} handleClose={handleCloseSnackbar} severity="error" message="From date can not be greater than To Date" />
        </Stack>
    )
}
export default Invoice;
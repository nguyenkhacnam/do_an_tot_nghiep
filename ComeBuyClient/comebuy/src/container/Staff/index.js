import * as React from 'react';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import { renderStatus } from '../../GridDataCellTemplate/StatusTag';
import { renderAvatar } from '../../GridDataCellTemplate/Avatar';
import { useEffect, useState } from 'react'
import SnackBarAlert from "../../components/SnackBarAlert";
import accountApi from '../../api/accountAPI';
import { Button, Stack, styled, Typography } from '@mui/material';
import { ConfirmDialog, UserInfoPopOver } from '../../components';
import { useNavigate } from 'react-router';
import { Box } from '@mui/system';
import ImportantDevicesIcon from '@mui/icons-material/ImportantDevices';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';



const BGImg = styled('img')({
    height: '100%',
    width: '100%',
    position: 'absolute',
    resize: true,
})
const ProductTable = styled(DataGrid)(({ theme }) => ({
    height: 700,
    width: 1200,
    alignSelf: 'center',
    backgroundColor: 'white',
}));


const Staff = () => {
    const navigate = useNavigate()
    const [accountList, setAccountList] = useState([])
    const [openSuccessAlert, setOpenSuccessAlert] = useState(false);
    const [openErrorAlert, setOpenErrorAlert] = useState(false);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false)
    const [messageError, setMessageError] = useState("No Error")
    const [messageSuccess, setMessageSuccess] = useState("Notification")
    const [selectedAccount, setSelectedAccount] = useState(null)

    const handleClose = (event, reason) => {
        if (reason === 'clickaway')
            return;
        setOpenSuccessAlert(false);
        setOpenErrorAlert(false);
        setOpenConfirmDialog(false);
    };
    async function LoadData() {
        try {
            const response = await accountApi.getAll()
            if (response.status == 200) {
                setAccountList(response.data)
                setMessageSuccess("Thành công")
                setOpenSuccessAlert(true)
            }
            else {
                setMessageError("Load Account Failed :((")
                setOpenErrorAlert(true)
            }
        }
        catch (err) {
            console.log(err)
        }
    }
    useEffect(() => {
        LoadData()
    }, [])

    const handleDeleteUser = async () => {
        if (selectedAccount.row.role == 'customer' || selectedAccount.row.role == 'admin') {
            setMessageError("you are not allowed to deleted Customer's account or Admin :((")
            setOpenErrorAlert(true)
            handleClose()
            return
        }

        const response = await accountApi.deleteAccount(selectedAccount.id)
        if (response.status == 200) {
            /// Type this to set new vlue for state
            setAccountList((prevList) => prevList.filter((item) => (item.userID != selectedAccount.id)))
            setMessageSuccess("Delete Account Successfully")
            setOpenSuccessAlert(true)
            handleClose()
        }
        else {
            console.log("error")
            setMessageError("Delete Account Failed :((")
            setOpenErrorAlert(true)
            handleClose()
        }
    }

    const deleteUser = React.useCallback(
        (value) => async () => {
            setSelectedAccount(value)
            setOpenConfirmDialog(true)
        },
        [],
    );


    const columns = React.useMemo(
        () => [
            {
                field: 'name',
                headerName: 'Tên',
                width: 250,
                renderCell: (params) => (
                    <UserInfoPopOver user={params.row} />
                )
            },
            {
                field: 'avatar',
                width: 120,
                editable: true,
                renderCell: (params) => (
                    renderAvatar(params)
                )
            },
            { field: 'dob', headerName: 'Ngày sinh', width: 130 },
            {
                field: 'role', headerName: 'Quyền', width: 150, renderCell: (params) => (
                    renderStatus(params)
                )
            },
            {
                field: 'phoneNumber', headerName: 'Số điện thoại', width: 200,
                valueFormatter: (params) => {
                    if (params.value == "") {
                        return "Chưa cập nhật";
                    }
                    return params.value;
                }
            },
            {
                field: 'branch', headerName: 'Chi nhánh', width: 200,
                valueFormatter: (params) => {
                    if (params.value == null) {
                        return "Chưa cập nhật";
                    }

                    return params.value.address;
                }
            },
            {
                field: 'actions',
                type: 'actions',
                headerName: 'Chức năng',
                width: 100,
                getActions: (params) => [
                    <GridActionsCellItem
                        icon={<DeleteIcon />}
                        label="Delete"
                        onClick={deleteUser(params)}
                    />,
                ],
            },
        ],
        [deleteUser],
    );

    return (
        <Stack direction="column" sx={{
            width: "100%",
            height: "100%",
            justifyItems: 'center',
            alignItems: 'center',
            backgroundColor: 'grey',
            overflowY: 'auto'
        }}>
            <Box sx={{
                width: "90%",
                height: "95%",
                boxShadow: 10,
                borderRadius: 3,
                alignItems: 'center',
                justifyItems: 'center',
                backgroundColor: '#D2D5FA'
            }}>
                <Stack sx={{
                    width: "100%",
                    height: "100%"
                }}>
                    <Stack sx={{ alignItems: 'center', justifyItems: 'center', pl: 2, pt: 2 }} direction={'row'} spacing={2}>
                        <AccountCircleIcon />
                        <Typography variant="h6">Quản lý nhân viên</Typography>
                    </Stack>
                    <Button sx={{
                        width: 150,
                        backgroundColor: '#2E1534',
                        color: 'white', alignSelf: 'end',
                        ml: 2,
                        mr: 2,
                        mb:2,
                        borderRadius: 3,
                        '&:hover': {
                            backgroundColor: 'black',
                            color: 'white',
                        }
                    }} onClick={() => navigate('/staff/add')}>Thêm nhân viên</Button>
                    <ProductTable
                        rowHeight={100}
                        columns={columns}
                        rows={accountList}
                        pagination
                        getRowId={(row) => row.userID} />
                    <ConfirmDialog
                        body="Vui lòng kiểm tra lại thông tin sản phẩm để đảm bảo. Thao tác này không thể làm lại. Nếu bạn chắc chắn, vui lòng xác nhận!"
                        title="Xác nhận thông tin"
                        open={openConfirmDialog} handleClose={handleClose} handleConfirm={handleDeleteUser} />
                    <SnackBarAlert severity='success' open={openSuccessAlert} handleClose={handleClose} message={messageSuccess} />
                    <SnackBarAlert severity='error' open={openErrorAlert} handleClose={handleClose} message={messageError} />
                    <Box sx={{height: 20}}></Box>
                </Stack>
            </Box>
        </Stack>
    );
}

export default Staff;
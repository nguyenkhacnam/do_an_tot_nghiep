import { Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Grid, Stack, TextField } from '@mui/material'
import { useDispatch } from "react-redux";
import { memo, useEffect, useState } from "react";
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import style from './style.js'
import Box from '@mui/material/Box';
import EmailIcon from '@mui/icons-material/Email';
import PasswordIcon from '@mui/icons-material/Password';
import SnackBarAlert from "../../../components/SnackBarAlert";
import AddReactionIcon from '@mui/icons-material/AddReaction';
//icon styles
import TextFieldForAdd from "../../../components/TextFieldForAdd";
import { ConfirmDialog, RoleSelect } from "../../../components";
import { SignalCellularNull } from "@material-ui/icons";
import BusinessIcon from '@mui/icons-material/Business';
import WarningIcon from '@mui/icons-material/Warning';
import { default_avatar } from './../../../constant'
import accountApi from "../../../api/accountAPI.js";
import branchApi from "../../../api/branchAPI.js";
import BranchSelect from "../../../components/BranchSelect/index.js";

const AddStaff = () => {

    const dispatch = useDispatch()
    const [openSuccessAlert, setOpenSuccessAlert] = useState(false);
    const [openErrorAlert, setOpenErrorAlert] = useState(false);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false)
    const [messageError, setMessageError] = useState("No Error")
    const [messageSuccess, setMessageSuccess] = useState("Notification")
    const [role, SetRole] = useState("staff")
    const navigate = useNavigate()

    const handleClose = (event, reason) => {
        if (reason === 'clickaway')
            return;
        setOpenSuccessAlert(false)
        setOpenErrorAlert(false)
        setOpenConfirmDialog(false)
    };

    // properties for edit product
    const [name, SetName] = useState("")
    const [email, SetEmail] = useState("")
    const [password, SetPassword] = useState("")
    const [confirmPassword, SetConfirmPassword] = useState("")
    const [branchAddress, SetBranchAddress] = useState("")
    const [existedBranch, setExistedBranch] = useState("")
    const [branchList, setBranchList] = useState([])

    const handleBranchChange = (event) => {
        setExistedBranch(event.target.value);
      };


    async function LoadData() {
        try {
            const response = await branchApi.getAll()
            if (response.status == 200) {
                setBranchList(response.data)
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

    const handleValueChange = (event) => {
        switch (event.target.name) {
            case 'Name':
                SetName(event.target.value)
                break
            case 'Email':
                SetEmail(event.target.value)
                break
            case 'Password':
                SetPassword(event.target.value)
                break
            case 'Confirm Password':
                SetConfirmPassword(event.target.value)
                break
            case 'Branch Address':
                SetBranchAddress(event.target.value)
                break

        }
    };

    const handleAddNewMember = async () => {
        if (password !== confirmPassword) {
            setOpenConfirmDialog(false)
            setMessageError("Confirm Password is incorrect!")
            setOpenErrorAlert(true)
            return
        }
        else {
            const newAccount = {
                name: name,
                email: email,
                password: password,
                phoneNumber: "",
                dob: "06/05/2001",
                avatar: default_avatar,
                address: "",
                role: role,
                sex: "male",
                bio: "",
                branchAddress: branchAddress,
                branchID: existedBranch
            }
            console.log(newAccount)
            const response = await accountApi.createNewAccount(newAccount)
            switch (response.status) {
                case 200: {
                    setOpenConfirmDialog(false)
                    setMessageSuccess("Add Member Successfully!")
                    setOpenSuccessAlert(true)
                    return
                }
                case 409: {
                    setOpenConfirmDialog(false)
                    setMessageError("Account is Existed!")
                    setOpenErrorAlert(true)
                    return
                }
                case 405: {
                    setOpenConfirmDialog(false)
                    setMessageError("Branch Address is empty or null, Manager need Branch!")
                    setOpenErrorAlert(true)
                    return
                }
                default: {
                    setMessageError("Add Failed!")
                    setOpenErrorAlert(true)
                    setOpenConfirmDialog(false)
                    return
                }
            }

        }
    }

    const handleRoleChange = (event) => {
        SetRole(event.target.value);
    };

    return (
        <Stack
            sx={style.boxContainer}>
            <Box sx={style.boxInfor}>
                <Stack
                    direction="row"
                    spacing={1}
                    padding={1}
                    sx={style.boxInfor_Stack}>
                    <AddReactionIcon />
                    <Typography variant='h6' fontWeight='bold'>Thêm mới nhân viênr</Typography>
                </Stack>
                <Grid container>
                    <Grid item xs={12} paddingLeft={2}>
                        <Stack xs={12} spacing={2} padding={2}>
                            <TextFieldForAdd inputConfig="text" Icon={<DriveFileRenameOutlineIcon />} Text={name} Title='Tên nhân viên' onChange={handleValueChange} />
                            <Box sx={style.boxinfor_Stack_Line}></Box>
                            <TextFieldForAdd inputConfig="email" Icon={<EmailIcon />} Text={email} Title='Email' onChange={handleValueChange} />
                            <Box sx={style.boxinfor_Stack_Line}></Box>
                            <TextFieldForAdd inputConfig="password" Icon={<PasswordIcon />} Text={password} Title='Mật khẩu' onChange={handleValueChange} />
                            <Box sx={style.boxinfor_Stack_Line}></Box>
                            <TextFieldForAdd inputConfig="password" Icon={<PasswordIcon />} Text={confirmPassword} Title='Nhập lại mật khẩu' onChange={handleValueChange} />
                            <Box sx={style.boxinfor_Stack_Line}></Box>
                            <RoleSelect value={role} handleChange={handleRoleChange} />
                            {
                                role == "manager" &&
                                <Stack xs={12} spacing={2} padding={2}>
                                    <Stack spacing={2} padding={2}
                                        sx={{
                                            borderRadius: 2,
                                            border: 'solid 1px #BF0426',
                                            boxShadow: 5
                                        }}>
                                        <WarningIcon sx={{color: 'red'}} />
                                        <Typography fontWeight='bold' variant="body1" color='#BF0426'>
                                            One manager must connect to one branch.
                                            Confirm to create a manager that means you are creating a branch too.
                                            Please check carefully!</Typography>
                                    </Stack>
                                    <TextFieldForAdd inputConfig="text" Icon={<BusinessIcon />} Text={branchAddress} Title='Branch Address' onChange={handleValueChange} />
                                    <BranchSelect value={existedBranch} branchList={branchList.filter((item) => (item.userid == null || item.account == null))} handleChange={handleBranchChange}></BranchSelect>
                                    <Box sx={style.boxinfor_Stack_Line}></Box>
                                </Stack>
                            }
                        </Stack>
                    </Grid>
                    <Grid item xs={12} paddingLeft={2} paddingTop={2}></Grid>
                </Grid>
                <Stack sx={{ width: '100%', justifyContent: 'center' }} direction='row' spacing={3}>
                    <Button sx={style.BackButton} variant="contained" onClick={() => navigate('/staff')}>Hủy</Button>
                    <Button sx={style.SaveButton} variant="contained" onClick={() => setOpenConfirmDialog(true)}>Lưu</Button>
                </Stack>
            </Box>
            <SnackBarAlert severity='success' open={openSuccessAlert} handleClose={handleClose} message={messageSuccess} />
            <SnackBarAlert severity='error' open={openErrorAlert} handleClose={handleClose} message={messageError} />
            <ConfirmDialog
                body="Please check the product information again to make sure. This operation cannot be redo. If you are sure, please confirm!"
                title="Confirm Action?"
                open={openConfirmDialog} handleClose={handleClose} handleConfirm={handleAddNewMember} />
        </Stack>
    )
}

export default AddStaff;
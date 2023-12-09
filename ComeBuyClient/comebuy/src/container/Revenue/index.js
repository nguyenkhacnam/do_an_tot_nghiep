import * as React from 'react';
import Box from '@mui/material/Box';
import { useState, useEffect } from 'react'
import branchApi from '../../api/branchAPI';
import { SnackBarAlert, StockInBranch, RevenueChart } from '../../components';
import { StyledTab, StyledTabs, TabPanel } from './child'
import { useSelector } from 'react-redux';
import { currentUser } from './../../redux/selectors';


export default function Revenue() {
    const _currentUser = useSelector(currentUser)
    const [value, setValue] = useState(0);
    const [branchList, setBranchList] = useState([])
    const [openSuccessAlert, setOpenSuccessAlert] = useState(false);
    const [openErrorAlert, setOpenErrorAlert] = useState(false);
    const [messageError, setMessageError] = useState("No Error")
    const [messageSuccess, setMessageSuccess] = useState("Notification")

    const handleClose = (event, reason) => {
        if (reason === 'clickaway')
            return;
        setOpenSuccessAlert(false);
        setOpenErrorAlert(false);

    };
    async function LoadData() {
        try {
            const response = await branchApi.getAll()
            if (response.status == 200) {
                if (localStorage.getItem('role') == "admin")
                    setBranchList(response.data)
                else if (localStorage.getItem('role') == "manager"){    
                    setBranchList(response.data.filter(ite => ite.branchID == _currentUser.branch.branchid))
                }
                setMessageSuccess("Load Branch Successfully")
                setOpenSuccessAlert(true)
            }
            else {
                setMessageError("Load Branch Failed :((")
                setOpenErrorAlert(true)
            }
        }
        catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        LoadData()
        return () => {
            setBranchList({}); // This worked for me
        };
    }, [])

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: '100%', height: '100%' }}>
            <Box sx={{ bgcolor: '#2e1534' }}>
                <StyledTabs
                    value={value}
                    onChange={handleChange}
                    variant="scrollable"
                    aria-label="styled tabs example"
                >
                    {
                        branchList.length > 0 && branchList.map((item, index) => (
                            <StyledTab key={index} label={item.address} />
                        ))
                    }
                </StyledTabs>
                <Box sx={{ p: 1 }} />
            </Box>
            {
                branchList.length > 0 && branchList.map((item, _index) =>
                (
                    <TabPanel style={{ width: '100%', height: '100%' }} key={_index} value={value} index={_index}>
                        <RevenueChart branchID={item.branchID}></RevenueChart>
                    </TabPanel>
                ))
            }
            <SnackBarAlert severity='success' open={openSuccessAlert} handleClose={handleClose} message={messageSuccess} />
            <SnackBarAlert severity='error' open={openErrorAlert} handleClose={handleClose} message={messageError} />
        </Box>
    );
}
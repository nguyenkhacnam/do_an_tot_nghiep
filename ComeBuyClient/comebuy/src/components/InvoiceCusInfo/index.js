import * as React from "react"
import { useDispatch } from 'react-redux'
import { unwrapResult } from '@reduxjs/toolkit';
import { getAccountWithID } from '../../redux/slices/accountSlice';
import CircularProgress from '@mui/material/CircularProgress';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';


const CusInfo = (props) => {
    const [customer, setCustomer] = React.useState([]);

    const { userID } = props

    const dispatch = useDispatch()

    React.useEffect(async () => {
        if (customer.length === 0) {
            try {
                const resultAction = await dispatch(getAccountWithID(userID))
                const originalPromiseResult = unwrapResult(resultAction)
                // handle result here
                setCustomer([...customer, originalPromiseResult])
            } catch (rejectedValueOrSerializedError) {
                // handle error here
                console.log(rejectedValueOrSerializedError.message);
            }
        }
        return () => {
            setCustomer({});
        };
    }, [])

    React.useEffect(() => {
        if (customer.length != 0) {
        }
    }, [customer])

    return (
        <div>
            {customer != 0 ? (
                <div style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: '#F2F2F2',
                    padding: '10px',
                    display: 'flex',
                    flexDirection: 'row',
                }}>
                    <Avatar alt="" src={customer[0].avatar} sx={{ width: 100, height: 100 }} />
                    <div style={{ display: 'flex', flexDirection: 'column', padding: '15px' }}>
                        <div style={{ display: 'flex', flexDirection: 'row' }}>
                            <Typography style={{ fontWeight: 'bold' }}>Email:</Typography>
                            <Typography style={{ marginLeft: '5px', color: '#404040', fontWeight: 'italic', textDecoration: 'underline' }}>{customer[0].email}</Typography>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'row' }}>
                            <Typography style={{ fontWeight: 'bold' }}>Name:</Typography>
                            <Typography style={{ marginLeft: '5px', color: '#404040' }}>{customer[0].name}</Typography>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'row' }}>
                            <Typography style={{ fontWeight: 'bold' }}>Contact:</Typography>
                            <Typography style={{ marginLeft: '5px', color: '#404040' }}>{customer[0].phoneNumber}</Typography>
                        </div>
                    </div>
                </div>
            ) : (
                <Box sx={{ display: 'flex', flex: 1, flexDirection: 'row', backgroundColor: '#F2F2F2' }}>
                    <CircularProgress style={{ backgroundColor: 'transparent' }} />
                    <Typography style={{ marginTop: '5px', marginLeft: '5px', color: '#404040' }}>Getting info...</Typography>
                </Box>
            )}
        </div>
    )
}

export default CusInfo
import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const RoleSelect = (props) => {
    return (
        <Box sx={{ minWidth: 120}}>
            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Quyền</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={props.value}
                    label="Role"
                    onChange={props.handleChange}
                >
                    <MenuItem value='staff'>Nhân viên</MenuItem>
                    {/* <MenuItem value='manager'>Quản lý</MenuItem> */}
                </Select>
            </FormControl>
        </Box>
    );
}
export default RoleSelect;
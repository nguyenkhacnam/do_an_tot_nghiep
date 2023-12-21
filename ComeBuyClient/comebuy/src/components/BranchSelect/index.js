import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const BranchSelect = (props) => {
    console.log('props.branchList',props.branchList);
    return (
        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
            <InputLabel id="demo-select-small">Select existed branch</InputLabel>
            <Select
                labelId="demo-select-small"
                id="demo-select-small"
                value={props.value}
                label="Select existed branch"
                onChange={props.handleChange}
            >
                {
                    props.branchList.map((item) => (
                        <MenuItem key={item.branchID} value={item.branchID}>{item.address}</MenuItem>
                    ))
                }
            </Select>
        </FormControl>
    );
}
export default BranchSelect
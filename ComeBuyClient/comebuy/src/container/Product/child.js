import * as React from 'react';
import { alpha, styled } from '@mui/material/styles';
import { pink } from '@mui/material/colors';
import Switch from '@mui/material/Switch';

const GreenSwitch = styled(Switch)(({ theme }) => ({
  '& .MuiSwitch-switchBase.Mui-checked': {
    color: '#B360E6',
    '&:hover': {
      backgroundColor: alpha('#B360E6', theme.palette.action.hoverOpacity),
    },
  },
  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
    backgroundColor: '#B360E6',
  },
}));

const label = { inputProps: { 'aria-label': 'Switch demo' } };

const ColorSwitch = (props) => {
  return (
    <GreenSwitch  {...label} checked={props.param.row.isPublished} color="secondary" 
    onChange={(e) => props.onIsPublishedChange(props.param , e.target.checked)}/>
  );
}
export default ColorSwitch;
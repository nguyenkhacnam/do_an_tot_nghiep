import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import { useEffect, useState } from 'react'
import { Stack } from '@mui/material';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

function getStyles(name, personName, theme) {
    return {
        fontWeight:
            personName.indexOf(name) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
}

const FeatureSelect = (props) => {
    const theme = useTheme();
    return (
        <Stack item="true" sx={{ marginLeft: 2}}>
            <FormControl sx={{ m: 1 }}>
                <InputLabel >Thương hiệu</InputLabel>
                <Select
                    multiple
                    value={props.currentFeature}
                    onChange={props.handleFeatureChange}
                    input={<OutlinedInput label="Thương hiệu" />}
                    renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.map((value) => (
                                <Chip key={value} label={value} />
                            ))}
                        </Box>
                    )}
                    MenuProps={MenuProps}
                >
                    {props?.features?.map((item) => (
                        <MenuItem
                            key={item.name}
                            value={item.name}
                            style={getStyles(item.name, props.features, theme)}
                        >
                            {item.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Stack>
    );
}
export default FeatureSelect;
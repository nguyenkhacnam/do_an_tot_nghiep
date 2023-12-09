import { Stack, TextField } from '@mui/material'
import Typography from '@mui/material/Typography';
import { memo } from 'react';

const TextFieldForEdit = (props) => {

    return (
        /// Set key to re render child component when props change :))))
        <Stack key={props.Text} spacing={1}>
            <Stack
                direction="row"
                spacing={1}>
                {props.Icon}
                <Typography fontWeight='bold'>{props.Title}</Typography>
            </Stack>
            <TextField
                autoFocus
                name={props.Title.split(' (')[0]}
                label={props.Title}
                placeholder={props.Text.toString()}
                defaultValue={props.Text}
                onChange={props.onChange}
                variant="standard"
            />
        </Stack>
    )
}

export default memo(TextFieldForEdit,
    (prevProps, nextProps) => (prevProps.Text != nextProps.Text));
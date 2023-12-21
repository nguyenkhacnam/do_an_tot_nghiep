import { Stack, TextField } from '@mui/material'
import Typography from '@mui/material/Typography';
import { memo } from 'react';

const TextFieldForAdd = (props) => {

    return (
        /// Set key to re-render child component when props change :))))
        <Stack key={props.Text} spacing={1}>
            <Stack
                direction="row"
                spacing={1}>
                {props.Icon}
                <Typography fontWeight='bold'>{props.Title}</Typography>
            </Stack>
            <TextField
                // value={props.value}
                type={props.inputConfig}
                autoFocus
                name={props.Title.split(' (')[0]}
                label={props.Title}
                defaultValue={props.Text}
                placeholder={props.Text.toString()}
                variant="standard"
                onChange={props.onChange}
            />
        </Stack>
    )
}

export default memo(
    TextFieldForAdd,
    (prevProps, nextProps) => (prevProps.Text != nextProps.Text));
import { Alert, Snackbar } from "@mui/material";


const SnackBarAlert = (props) => {
    return (
        <Snackbar open={props.open} autoHideDuration={2000} onClose={props.handleClose}>
            <Alert onClose={props.handleClose} severity={props.severity} sx={{ width: '100%' }}>
                {props.message}
            </Alert>
        </Snackbar>
    )
}

export default SnackBarAlert;

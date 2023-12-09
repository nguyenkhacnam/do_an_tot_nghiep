import { Grid, Typography } from "@mui/material"

const ManagerHome = () => {
    return (
        <Grid sx={{ alignItems: 'center' }}>
            <Typography variant="h4" fontWeight={'bold'}
                sx={{
                    position: 'absolute',
                    zIndex: 2,
                    top: '50%',
                    left: '30%',
                    backgroundColor: 'white',
                    borderRadius: 7,
                    p: 2
                }}>Welcome to Comebuy Management Site</Typography>
            <img
                src='https://images.unsplash.com/photo-1661961112951-f2bfd1f253ce?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1172&q=80'
                style={{ height: '100%', width: '100%', position: "absolute" }}
            ></img>
        </Grid>
    )
}
export default ManagerHome
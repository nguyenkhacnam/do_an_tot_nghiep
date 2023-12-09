import { Stack } from '@mui/material'
import Typography from '@mui/material/Typography';

const TechInforLine = ({ Icon, Title, Text }) => {
    return (
        <Stack spacing={1}> 
            <Stack
                direction="row"
                spacing={1}>
                {Icon}
                <Typography fontWeight='bold'>{Title}</Typography>
            </Stack>
            <Typography sx={{paddingLeft: 5}}>{Text}</Typography>
        </Stack>
    )
}

export default TechInforLine;
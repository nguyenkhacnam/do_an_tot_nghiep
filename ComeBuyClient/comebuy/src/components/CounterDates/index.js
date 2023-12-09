import { Typography } from "@mui/material"

const Dates = ({ invoiceDate, dueDate }) => {
  return (
    <>
      <Typography sx={{ marginTop: '-7%', fontSize: '13px', marginLeft: '3.5rem', color: 'grey' }}>{invoiceDate}</Typography>
    </>
  )
}
export default Dates

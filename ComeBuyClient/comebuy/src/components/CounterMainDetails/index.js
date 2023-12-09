import { Stack, Typography } from "@mui/material";

const MainDetails = ({ name, address, contact }) => {
  return (
    <div style={{
      width: '100%',
      marginRight: '2rem',
    }}>
      <Typography
        style={{
          fontSize: '14px',
          fontWeight: 'bold',
          alignSelf: 'flex-end'
        }}
      >
        Staff: {name}
      </Typography>
      <Typography
        style={{
          fontSize: '14px',
          fontWeight: 'bold',
          alignSelf: 'flex-end'
        }}
      >
        Staff phone: {contact}
      </Typography>
      <Typography
        style={{
          fontSize: '14px',
          fontStyle: 'italic',
          alignSelf: 'flex-end'
        }}
      >
        {address}
      </Typography>
    </div>
  )
}
export default MainDetails

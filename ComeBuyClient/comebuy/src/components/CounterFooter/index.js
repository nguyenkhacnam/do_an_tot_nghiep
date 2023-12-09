import { Stack, Typography } from "@mui/material";

const Footer = ({
  name,
  email,
  phone,
  address
}) => {
  return (
    <>
      <footer style={{
        display: 'table-footer-group',
        borderWidth: '1px',
        borderColor: 'gray',
        marginLeft: '3rem',
        marginTop: '1rem'
      }}>
        <Stack direction="column" width="100%" spacing={2} style={{ display: 'flex', justifyContent: 'center', justifyItems: 'center' }}>
          <Stack width="100%" spacing={3} direction="row">
            <li style={{ fontFamily: 'serif' }} >
              <span style={{ fontWeight: 'bold', fontFamily: 'serif' }}>Name:</span> {name}
            </li>

            <li style={{ fontFamily: 'serif' }} >
              <span style={{ fontWeight: 'bold', fontFamily: 'serif' }}>Email:</span> {email}
            </li>
          </Stack>
          <Stack width="100%" spacing={3} direction="row">
            <li style={{ fontFamily: 'serif' }} >
              <span style={{ fontWeight: 'bold', fontFamily: 'serif' }}>Phone:</span> {phone}
            </li>

            <li style={{ fontFamily: 'serif' }} >
              <span style={{ fontWeight: 'bold', fontFamily: 'serif' }}>Store address:</span> {address}
            </li>
          </Stack>
          <div style={{ marginLeft: '2rem', marginRight: '2rem', height: '1px', backgroundColor: 'grey' }}></div>
          <Typography sx={{ fontSize: '13px', fontStyle: 'italic', color: 'grey', m:2 }}> * All products sold by ComeBuy are subject to the manufacturer's and supplier's warranty conditions. If there is a problem with product quality, ComeBuy is committed to supporting you to the end.</Typography>
          <Typography sx={{ fontSize: '13px', fontStyle: 'italic', color: 'grey',m:2 }}> ** With a trial period of up to 15 days, you will be supported to exchange 1-1 or 100% refund if there is an error or feel that the product does not meet the needs.</Typography>
          <Typography style={{  fontFamily: 'serif', fontStyle: 'italic' }}>*** Thanks for supporting our store. We'll always welcome you to explore ❤️</Typography>
        </Stack>
      </footer>
    </>
  )
}
export default Footer
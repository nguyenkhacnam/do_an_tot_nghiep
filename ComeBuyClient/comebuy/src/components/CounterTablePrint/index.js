import React from "react"

const TablePrint = ({ list, total }) => {
  return (
    <>
      <table width="100%" style={{ marginLeft: '1.5rem', marginTop: '1.5rem' }}>
        <thead>
          <tr style={{ marginRight: '2rem' }}>
            <td style={{ letterSpacing: '0.1rem', fontSize: '14px', color: 'grey' }}>Description</td>
            <td style={{ letterSpacing: '0.1rem', fontSize: '14px', color: 'grey' }}>Quantity</td>
            <td style={{ letterSpacing: '0.1rem', fontSize: '14px', color: 'grey' }}>Price</td>
            <td style={{ letterSpacing: '0.1rem', fontSize: '14px', color: 'grey' }}>Amount</td>
          </tr>
        </thead>
        {list.map(({ id, description, quantity, price, amount }) => (
          <React.Fragment key={id}>
            <tbody>
              <tr>
                <td style={{ fontSize: '13px' }} >{description}</td>
                <td style={{ fontFamily: 'serif', display: 'flex', justifyContent: 'center', fontSize: '13px' }}>{quantity}</td>
                <td style={{ fontSize: '13px' }}>${price}</td>
                <td style={{ fontSize: '13px' }}>${amount}</td>
              </tr>
            </tbody>
          </React.Fragment>
        ))}
      </table>
      <div style={{ height: '0.5px', backgroundColor: 'grey', marginLeft: '2rem', marginRight: '2rem' }}> </div>
      <div>
        <h2 style={{
          marginRight: '1.5rem',
          display: 'flex',
          justifyContent: 'flex-end',
          justifyItems: 'flex-end',
          fontWeight: 'bold'
        }}
        >
          Total cost. {total} USD
        </h2>
      </div>
    </>
  )
}

export default TablePrint

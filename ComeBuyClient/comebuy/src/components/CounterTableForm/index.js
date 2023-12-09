import React, { useState, useEffect, useCallback, } from "react"
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai"
import { v4 as uuidv4 } from "uuid"
import { Stack, TextField, Button } from "@mui/material"
import { useSelector } from "react-redux"
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import { productListSelector } from "../../redux/selectors"
import ProdInfo from "../InvoiceProdInfo"
import { OptionUnstyled } from "@mui/base"
import { DetailProductModal } from ".."


const filter = createFilterOptions();
const TableForm = ({
  description,
  setDescription,
  quantity,
  setQuantity,
  price,
  setPrice,
  amount,
  setAmount,
  list,
  setList,
  total,
  setTotal,
}) => {
  const [isEditing, setIsEditing] = useState(false)

  const _productList = useSelector(productListSelector)  // list get from store
  const [listProduct, setListProduct] = useState(_productList)

  // Submit form function
  const handleSubmit = (e) => {
    e.preventDefault()

    if (!quantity) {
      alert("Please fill in quantity")
    } else {
      const newItems = {
        id: description.productID,
        description: description.name,
        quantity,
        price,
        amount,
      }
      setDescription(null)
      setQuantity("")
      setPrice("")
      setAmount("")
      setList([...list, newItems])
      setIsEditing(false)
    }
  }
  const [openModal, setOpenModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const handleCloseModal = () => setOpenModal(false);

  useEffect(() => {
    if (currentProduct != null)
      setOpenModal(true)
  }, [currentProduct])

  // Calculate items amount function
  useEffect(() => {
    const calculateAmount = (amount) => {
      setAmount(quantity * price)
    }
    calculateAmount(amount)
  }, [amount, price, quantity, setAmount])

  // Calculate total amount of items in table
  useEffect(() => {
    // let rows = document.querySelectorAll("amount")
    let sum = 0

    for (let i = 0; i < list.length; i++) {
      sum += parseInt(list[i].amount)
      setTotal(sum)
    }
  }, [list])

  // Edit function
  const editRow = (id) => {
    const editingRow = list.find((row) => row.id === id)
    setList(list.filter((row) => row.id !== id))
    setIsEditing(true)
    setDescription(editingRow.description)
    setQuantity(editingRow.quantity)
    setPrice(editingRow.price)
  }

  // Delete function
  const deleteRow = (id) => setList(list.filter((row) => row.id !== id))

  return (
    <>
      <Stack direction="row" padding="2%" spacing={2} sx={{ alignItems: "center" }}>
        <Autocomplete
          value={description}
          onChange={(event, newValue) => {
            if (typeof newValue === 'string') {
              setDescription({
                name: newValue,
              });
            } else if (newValue && newValue.inputValue) {
              // Create a new value from the user input
              setDescription({
                name: newValue.inputValue,
              });
            } else {
              setDescription(newValue);
              setPrice(newValue.price)
              setCurrentProduct(newValue)
              setOpenModal(true)
            }
          }}
          filterOptions={(options, params) => {
            const filtered = filter(options, params);

            const { inputValue } = params;
            // Suggest the creation of a new value
            const isExisting = options.some((option) => inputValue === option.name);
            if (inputValue !== '' && !isExisting) {
              filtered.push({
                inputValue,
                name: `Add "${inputValue}"`,
              });
            }
            return filtered;
          }}
          selectOnFocus
          clearOnBlur
          handleHomeEndKeys
          id="free-solo-with-text-demo"
          options={listProduct}
          getOptionLabel={(option) => {
            // Value selected with enter, right from the input
            if (typeof option === 'string') {
              return option;
            }
            // Add "xxx" option created dynamically
            if (option.inputValue) {
              return option.inputValue;
            }
            // Regular option
            return option.name;
          }}
          renderOption={(props, option) => <li {...props}>{option.name}</li>}
          sx={{ width: 300 }}
          freeSolo
          renderInput={(params) => (
            <TextField {...params} label="Search for product" />
          )}
        />
        <DetailProductModal open={openModal} onClose={handleCloseModal} product={currentProduct} />
        <TextField
          label="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          variant="outlined"
        />
        <Button variant="contained" sx={{ backgroundColor: 'green' }} onClick={handleSubmit}>
          Add
        </Button>
      </Stack>

      {/* Table items */}

      <table width="100%">
        <thead>
          <tr style={{ backgroundColor: '#F2F2F2' }}>
            <td style={{ fontWeight: 'bold', fontSize: '17px' }}>Product</td>
            <td style={{ fontWeight: 'bold', fontSize: '17px' }}>Quantity</td>
            <td style={{ fontWeight: 'bold', fontSize: '17px' }}>Price</td>
            <td style={{ fontWeight: 'bold', fontSize: '17px' }} className="amount">Amount</td>
          </tr>
        </thead>
        {list.map(({ id, description, quantity, price, amount }) => (
          <React.Fragment key={id}>
            <tbody>
              <tr className="h-10">
                <td style={{ fontSize: '16px' }}>{description}</td>
                <td style={{ fontSize: '16px' }}>{quantity}</td>
                <td style={{ fontSize: '16px' }}>💸{price}</td>
                <td style={{ fontSize: '16px' }} className="amount">💸{amount}</td>
                <td>
                  <button onClick={() => editRow(id)}>
                    <AiOutlineEdit style={{ color: 'green' }} className="text-green-500 font-bold text-xl" />
                  </button>
                </td>
                <td>
                  <button onClick={() => deleteRow(id)}>
                    <AiOutlineDelete style={{ color: 'red' }} className="text-red-500 font-bold text-xl" />
                  </button>
                </td>
              </tr>
            </tbody>
          </React.Fragment>
        ))}
      </table>

      <div>
        <h2 style={{ fontSize: '30px', display: 'flex', justifyContent: 'flex-end' }} >
          Cost. {
            total
          } USD
        </h2>
      </div>
    </>
  )
}

export default TableForm
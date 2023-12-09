import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import productAPI from '../../api/productAPI';
import { useState, useEffect } from 'react'

const ProductSelect = (props) => {
    const [options, setOptions] = useState([])
    async function LoadData() {
        try {
            const response = await productAPI.getAll()
            if (response) {
                const processedProduct = []
                response.map((item) => {
                    if (!props.existedProduct.includes(item.productID))
                        processedProduct.push(item)
                })
                setOptions(processedProduct.map((option) => {
                    const firstLetter = option.name[0].toUpperCase();
                    return {
                        firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
                        ...option,
                    };
                }))
            }
        }
        catch (err) {
                console.log(err)
            }
        }
    useEffect(() => {
            LoadData()
            return () => {
                setOptions({}); // This worked for me
            };
        }, [])


        return (
            <Autocomplete
                id="grouped-demo"
                options={options.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
                groupBy={(option) => option.firstLetter}
                getOptionLabel={(option) => option.name}
                sx={{ width: 300, margin: 3}}
                renderInput={(params) => <TextField {...params} label="Please select product!" />}
                onChange={props.onChange}
            />
        );
    }
    export default ProductSelect
import * as React from 'react';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Autocomplete from '@mui/material/Autocomplete';
import { useNavigate } from 'react-router-dom';
import { makeStyles } from '@mui/styles';

const SearchBar = (props) => {
    const navigate = useNavigate()
    return (
        <Stack spacing={2} sx={{ width: 500, m: 2, alignSelf: 'center' }}>
            <Autocomplete
                freeSolo
                id="free-solo-2-demo"
                disableClearable
                onChange={(event, newValue) => {
                    const selectedProduct = props.productList.filter(item => item.name == newValue)
                    if (selectedProduct.length != 0)
                        navigate('/productSpace/' + selectedProduct[0].productID)
                    else console.log('Product is not existed')
                }}
                color='secondary'
                options={props.productList.map((option) => option.name)}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Tìm kiếm Laptop..."
                        InputProps={{
                            ...params.InputProps,
                            type: 'search',
                        }}
                    />
                )}
            />
        </Stack>
    );
}
export default SearchBar
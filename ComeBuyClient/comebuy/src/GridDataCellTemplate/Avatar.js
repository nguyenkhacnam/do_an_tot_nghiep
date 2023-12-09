import { Avatar, styled } from "@mui/material";
import { Box, } from "@mui/system";
import { jsx as _jsx } from "react/jsx-runtime";


const Img = styled('img')((theme) => ({
    height: '100%',
    width: '100%',
    borderRadius: 50
}))

const _Avatar = (props) => {
    return (
        <Box sx={{ borderRadius: 5, height: 100, width: 100 }}>
            <Avatar sx={{ height: 70, width: 70, marginTop: 2 }} src={props.url}></Avatar>
        </Box>
    )
}


export function renderAvatar(params) {
    return /*#__PURE__*/_jsx(_Avatar, {
        url: (params.value && params.value!= null) ? params.value.toString() : 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80'
    });
}
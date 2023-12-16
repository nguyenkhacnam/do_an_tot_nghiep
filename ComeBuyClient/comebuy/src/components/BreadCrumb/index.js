import * as React from 'react';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import HomeIcon from '@mui/icons-material/Home';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import GrainIcon from '@mui/icons-material/Grain';
import { useNavigate } from 'react-router-dom';


const BreadCrumb = () => {
    const handleClick = (event) => {
        // event.preventDefault()
        // navigate('/')
    }
    return (
        <div role="presentation" onClick={handleClick}>
            <Breadcrumbs aria-label="breadcrumb">
                <Link
                    underline="hover"
                    sx={{ display: 'flex', alignItems: 'center' }}
                    color="secondary"
                    href="/"
                >
                    <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                    Trang chủ
                </Link>
                <Link
                    underline="hover"
                    sx={{ display: 'flex', alignItems: 'center' }}
                    color="secondary"
                    href="/productSpace"
                >
                    <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                    Sản phẩm
                </Link>
               
                <Typography
                    sx={{ display: 'flex', alignItems: 'center' }}
                    color="secondary"
                >
                    <GrainIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                    Chi tiết sản phẩm
                </Typography>
            </Breadcrumbs>
        </div>
    );
}
export default BreadCrumb

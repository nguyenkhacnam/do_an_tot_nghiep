import React from 'react';
import BannerManage from '../container/BannerManage';
import DataAnalysis from '../container/DataAnalysis';
import ManagerHome from '../container/ManagerHome';
import Product from '../container/Product';
import AddProduct from '../container/Product/AddProduct';
import EditProduct from '../container/Product/EditProduct';
import Revenue from '../container/Revenue';
import Staff from '../container/Staff';
import AddStaff from '../container/Staff/AddStaff';
import Stock from '../container/Stock';


const adminRoutes = [
    {
        name: 'Product',
        path: '/product/*',
        page: <Product />,
    },
    {
        name: 'addProduct',
        path: '/product/add',
        page: <AddProduct />,
    },
    {
        name: 'editProduct',
        path: '/product/edit',
        page: <EditProduct />,
    },
    {
        name: 'Staff',
        path: '/staff',
        page: <Staff />,
    },
    {
        name: 'addStaff',
        path: '/staff/add',
        page: <AddStaff />,
    },
    {
        name: 'Stock',
        path: '/stock',
        page: <Stock />,
    },
    {
        name: 'Revenue',
        path: '/revenue',
        page: <Revenue />,
    },
    {
        name: 'Data Analysis',
        path: '/dataAnalysis/*',
        page: <DataAnalysis />,
    },
    {
        name: 'Banner Manage',
        path: '/bannerManage/*',
        page: <BannerManage />,
    },
    {
        name: 'Manager Home',
        path: '/',
        page: <ManagerHome />
    }
]

const adminMenuItems = [
    {
        name: 'Product',
        path: '/product/*',
        page: <Product />,
    },
    {
        name: 'Staff',
        path: '/staff',
        page: <Staff />,
    },
    {
        name: 'Stock',
        path: '/stock',
        page: <Stock />,
    },
    {
        name: 'Revenue',
        path: '/revenue',
        page: <Revenue />,
    },
    {
        name: 'Data Analysis',
        path: '/dataAnalysis/*',
        page: <DataAnalysis />,
    },
    {
        name: 'Banner Manage',
        path: '/bannerManage/*',
        page: <BannerManage />,
    },
]


export { adminRoutes, adminMenuItems };
import { Tabs } from 'antd';
import React from 'react'
import ProductHot from '../ProductHotAndNew/components/ProductHot';
import { useSelector } from 'react-redux';
import { productListSelector } from '../../redux/selectors';
import ProductSameBrandItem from './components/ProductSameBrandItem';
import RelativalProduct from './components/RelativalProduct';

const ProductSameBrand = () => {
    const products  = useSelector(productListSelector)
    const onChange = (key) => {
        console.log(key);
    };
    const items = [
        {
            key: '1',
            label: <h4>SẢN PHẨM CÙNG HÃNG</h4>,
            children: <ProductSameBrandItem products={products} />,
        },
        {
            key: '2',
            label: <h4>SẢN PHẨM LIÊN QUAN</h4>,
            children: <ProductSameBrandItem products={products} />,
        },
    ];
    return (
        <div>
            <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
        </div>
    )
}

export default ProductSameBrand
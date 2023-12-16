import { Tabs } from 'antd'
import React from 'react'
import ProductHot from './components/ProductHot';
import ProductNew from './components/ProductNew';

const ProductHotAndNew = ({products}) => {
    const onChange = (key) => {
        console.log(key);
    };
    const items = [
        {
            key: '1',
            label: <h4>SẢN PHẨM HOT</h4>,
            children: <ProductHot products={products}/>,
        },
        {
            key: '2',
            label: <h4>SẢN PHẨM MỚI</h4>,
            children: <ProductNew products={products}/>,
        },
    ];
    return (
        <div>
            <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
        </div>
    )
}

export default ProductHotAndNew
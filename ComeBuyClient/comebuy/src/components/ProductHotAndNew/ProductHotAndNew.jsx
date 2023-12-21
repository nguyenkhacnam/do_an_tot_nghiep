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
            label: <h4 style={{
                margin: '0',
                fontSize: '22px'
            }}>SẢN PHẨM HOT</h4>,
            children: <ProductHot products={products}/>,
        },
        {
            key: '2',
            label: <h4 style={{
                margin: '0',
                fontSize: '22px'
            }}>SẢN PHẨM MỚI</h4>,
            children: <ProductNew products={products}/>,
        },
    ];
    return (
        <div
            style={{
                margin: '0 -60px',
                padding: '0 60px 40px 60px',
                backgroundColor: '#f1f1f1'
            }}
        >
            <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
        </div>
    )
}

export default ProductHotAndNew
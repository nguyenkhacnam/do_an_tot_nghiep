import React, { useState } from 'react';
import { Avatar, Input, List, Space } from 'antd';
import './index.css'
import { Link } from 'react-router-dom';
const { Search } = Input;

const HomeSearchProduct = (props) => {
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [isVisible, setIsVisible] = useState(false)
    const onSearch = (value) => {
        const filtered = props.products?.filter(product =>
            product.name.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredProducts(filtered);
        if (value) {
            setIsVisible(true)
        }
    };

    const onChange = (e) => {
        const filtered = props.products?.filter(product =>
            product.name.toLowerCase().includes(e.target.value?.toLowerCase())
        );
        setFilteredProducts(filtered);
        if (e.target.value) {
            setIsVisible(true)
        } else {
            setIsVisible(false)
        }
    };

    return (
        <Space direction="vertical" className='custom-space'>
            <Search
                placeholder="Tìm kiếm sản phẩm..."
                allowClear
                enterButton="Tìm kiếm"
                size="large"
                onSearch={onSearch}
                // onClick={() => {console.log('buoc2222');}}
                onChange={onChange}
            />
            <div
                style={{
                    position: 'absolute',
                    top: '-8px',
                    left: '0',
                    color: 'black',
                    backgroundColor: '#f8f8f8',
                    width: '503px'
                }}
            >
                {isVisible && (
                    <List
                        itemLayout="horizontal"
                        dataSource={filteredProducts?.slice(0, 7)}
                        renderItem={(product, index) => {
                            const discountedPrice = product.price + (product.price * (parseFloat(product.promotion) / 100))
                            return (
                                <List.Item
                                    style={{
                                        marginLeft: '10px'
                                    }}
                                >
                                    <List.Item.Meta
                                        avatar={<Avatar src={product?.productimage[0]?.imageURL} />}
                                        title={<Link to={`/productSpace/` + product.productID
                                        }>{product.name}</Link>}
                                        description={
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'flex-start',
                                                    alignItems: 'center',
                                                    gap: '6px',
                                                    margin: '0'
                                                }}
                                            >
                                                <p
                                                    style={{
                                                        color: 'red',
                                                        fontSize: '15px',
                                                        margin: '0'
                                                    }}
                                                >{product.price.toLocaleString('en-US') + '₫'}</p>
                                                <p
                                                    style={{
                                                        textDecorationLine: 'line-through',
                                                        margin: '0'
                                                    }}
                                                >{discountedPrice.toLocaleString('en-US') + '₫'}</p>
                                            </div>
                                        }
                                    />
                                </List.Item>
                            )
                        }}
                    />
                )}
            </div>
        </Space>
    );
}

export default HomeSearchProduct;

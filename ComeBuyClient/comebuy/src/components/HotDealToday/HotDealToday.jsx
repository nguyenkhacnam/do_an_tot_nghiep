import React from 'react';
import { Badge, Card } from 'antd';
import styled from 'styled-components';
import './index.css';
import { Link } from 'react-router-dom';
const { Meta } = Card;

const HotDealToday = ({ productList }) => {
    return (
        <Div>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}
            >
                <h2>DEAL HOT HÔM NAY</h2>
                <p
                    style={{
                        color: 'red',
                        fontWeight: 'bold'
                    }}
                >Đang diễn ra</p>
            </div>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                {
                    productList?.slice(0, 6)?.map(product => {
                        const discountedPrice = product.price - (product.price * (parseFloat(product.promotion) / 100))
                        return (
                            <Badge count={product?.promotion}>
                                <Link to={`/productSpace/` + product.productID}>
                                    <Card
                                        hoverable
                                        style={{
                                            width: 240,
                                        }}
                                        cover={<img alt="Ảnh laptop" src={product.productimage[0]?.imageURL} />}
                                    >
                                        <Meta title={product.name} />
                                        <div
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'flex-start',
                                                alignItems: 'center',
                                                gap: '5px',
                                                marginTop: '12px'
                                            }}>
                                            <Meta
                                                className='meta-custom'
                                                style={{
                                                    color: 'red'
                                                }}
                                                title={discountedPrice.toLocaleString('en-US') + '₫'} />
                                            <Meta
                                                style={{
                                                    textDecorationLine: 'line-through'
                                                }}
                                                description={product.price.toLocaleString('en-US')+ '₫'} />
                                        </div>
                                        <p>Đã bán: </p>
                                    </Card>
                                </Link>
                            </Badge>
                        )
                    })
                }
            </div>
        </Div>
    )
}

export default HotDealToday

export const Div = styled.div`
    display: flex;
    flex-direction: column;
    padding: 0 30px 30px;
    background: #f1f1f1;
`
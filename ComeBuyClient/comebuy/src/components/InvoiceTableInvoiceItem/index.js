import React, { useState, useEffect } from "react"
import { useDispatch } from "react-redux"
import { unwrapResult } from "@reduxjs/toolkit"
import { getProductWithID } from "../../redux/slices/productSlice"

export default function TableInvoiceItem({ list, total }) {

    const [listProduct, setListProduct] = useState([])

    const dispatch = useDispatch()
    const fetchListProduct = async () => {
        let listTemp = []
        for (let i = 0; i < list.length; i++) {
            if (list[i].productid === null) {
                let price = list[i].total / list[i].amount;
                let temp = {
                    productID: null,
                    name: "This product might not be on shop anymore",
                    price: price
                }
                listTemp = [...listTemp, temp]
            } else {
                const resultAction = await dispatch(getProductWithID(list[i].productid))
                const originalPromiseResult = unwrapResult(resultAction)
                // handle result here
                listTemp = [...listTemp, originalPromiseResult]
            }
        }

        setListProduct(listTemp)
        setReady(true)
    }
    const [ready, setReady] = useState(false)
    useEffect(async () => {
        if (ready === false) {
            fetchListProduct()
        }
    }, [ready])

    return (
        <>
            <table width="100%" style={{ marginLeft: '1.5rem', marginTop: '1.5rem' }}>
                <thead>
                    <tr style={{ marginRight: '2rem' }}>
                        <td style={{ letterSpacing: '0.1rem', fontSize: '14px', color: 'grey' }}>Description</td>
                        <td style={{ letterSpacing: '0.1rem', fontSize: '14px', color: 'grey' }}>Quantity</td>
                        <td style={{ letterSpacing: '0.1rem', fontSize: '14px', color: 'grey' }}>Price</td>
                        <td style={{ letterSpacing: '0.1rem', fontSize: '14px', color: 'grey' }}>Amount</td>
                    </tr>
                </thead>
                {listProduct.map((p) => (
                    <React.Fragment>
                        <tbody>
                            <tr>
                                <td style={{ fontSize: '13px' }}>{p.name}</td>
                                {
                                    list.map((i) => (
                                        p.productID === i.productid ? (
                                            <td style={{ fontFamily: 'serif', display: 'flex', justifyContent: 'center', fontSize: '13px' }}>{i.amount}</td>
                                        ) : (
                                            null
                                        )
                                    ))
                                }
                                <td style={{ fontFamily: 'serif', width: 'auto' }}>💸{p.price}</td>
                                {
                                    list.map((i) => (
                                        p.productID === i.productid ? (
                                            <td style={{ fontFamily: 'serif' }}>💸{i.total}</td>
                                        ) : (
                                            null
                                        )
                                    ))
                                }
                            </tr>
                        </tbody>
                    </React.Fragment>
                ))}
            </table>

            <div>
                <h2 style={{ display: 'flex', justifyContent: 'flex-end', justifyItems: 'flex-end', fontWeight: 'bold', fontFamily: 'serif' }}>
                    Total cost. {total} USD
                </h2>
            </div>
        </>
    )
}

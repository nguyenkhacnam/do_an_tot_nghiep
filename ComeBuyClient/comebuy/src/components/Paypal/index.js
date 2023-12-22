import React, { useRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { currentUser } from "../../redux/selectors";
import moment from 'moment'
import { addInvoice } from "../../redux/slices/invoiceSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { addInvoiceItem } from "../../redux/slices/invoiceItemSlice";
import emailApi from "../../api/emailAPI";

import { Dialog, Button } from "@mui/material";
import { DialogTitle } from "@mui/material";
import { deleteCartById } from "../../redux/slices/cartSlice";
import { useNavigate } from 'react-router-dom';

export default function Paypal({ _discount, _lastTotal, cartList, purchases, prodList, _bigAddress, _guestEmail, _guestName, _guestPhoneNumber }) {

    const _currentUser = useSelector(currentUser)
    const dispatch = useDispatch()
    const paypal = useRef();
    const navigate = useNavigate()

    const [paidSuccessfully, setPaidSuccessfully] = useState(false)

    const handleCloseDialog = async () => {
        // setPaidSuccessfully(false)
        // setStartAddInvoiceItem(true)
        if (localStorage.getItem('role') === "customer") {
            for (let i = 0; i < cartList.length; i++) {
                try {
                    const resultAction = await dispatch(deleteCartById(cartList[i]))
                    const originalPromiseResult = unwrapResult(resultAction)
                } catch (rejectedValueOrSerializedError) {
                    alert(rejectedValueOrSerializedError);
                }
            }
            setPaidSuccessfully(false)
            navigate('/')
        } else {
            localStorage.setItem('cart', JSON.stringify([]));
            setPaidSuccessfully(false)
            navigate('/')
        }

    }

    const [orderData, setOrderData] = useState({
        date: ' ',
        moneyReceived: '0',
        isChecked: false,
        isPaid: false,
        address: _bigAddress,
        userID: _currentUser.userID,
        branchID: '9ef0b2b9-9920-4d15-982c-c4a4209700cd'
    })

    const [orderDataItem, setOrderDataItem] = useState({
        invoiceid: '',
        productid: '',
        amount: 0,
        total: 0
    })

    // const [listOrderDataItem, setListOrderDataItem] = useState([])

    const [listItem, setListItem] = useState([])

    const _addInvoiceItem = async (_invoiceId) => {
        let t = []
        let stringOrder = ''
        for (let i = 0; i < cartList.length; i++) {
            for (let j = 0; j < prodList.length; j++) {
                if (cartList[i].productid === prodList[j].productID) {
                    let item = {
                        invoiceID: _invoiceId,
                        productID: prodList[j].productID,
                        amount: cartList[i].amount,
                        total: Number(cartList[i].amount) * Number(prodList[j].price)
                    }
                    t.push(item)
                    stringOrder = stringOrder + "\n" + `${prodList[j].name} - Số lượng: ${cartList[i].amount} - Giá tiền: ${item.total.toLocaleString('en-US')} VND`
                }
            }
        }
        if (localStorage.getItem('role') === "customer") {
            emailApi.sendOrder({
                to: _currentUser.email,
                subject: "Thông tin đơn hàng của bạn tại ComeBuy",
                text: "Cảm ơn bạn đã đặt hàng trên trang ComeBuy. \n" +
                    "Đơn hàng của bạn: \n" +
                    `Tên người mua: ${_currentUser.name} \n` +
                    `Số điện thoại: ${_currentUser.phoneNumber} \n` +
                    `Địa chỉ nhận hàng: ${_bigAddress}` + "\n" +
                    "-------------------------------------------------------- \n" +
                    stringOrder + "\n" +
                    "-------------------------------------------------------- \n" +
                    `Tổng tiền: ${_lastTotal.toLocaleString('en-US')} VND` + "\n" +
                    "-------------------------------------------------------- \n" +
                    `Phiếu giảm giá: ${_discount} %` + "\n" +
                    "-------------------------------------------------------- \n" +
                    `Tiền vận chuyển: 0 VND` + "\n" +
                    "-------------------------------------------------------- \n" +
                    `Tổng: ${(_lastTotal + 0 - (_lastTotal * _discount / 100)).toLocaleString('en-US')} VND` + "\n" +
                    "-------------------------------------------------------- \n" +
                    "Có điều gì thắc mắc không? Vui lòng liên hệ với cửa hàng của chúng tôi theo địa chỉ liên hệ bên dưới: ComeBuy.com"
            }).then(data => {
                setListItem(t)
                setStartAddInvoiceItem(true)
            })
                .catch(err => console.log(err))
        } else {
            emailApi.sendOrder({
                to: _guestEmail,
                subject: "Thông tin đặt hàng của bạn",
                text: "Cảm ơn bạn đã đặt hàng trên trang ComeBuy. \n" +
                    "Đơn hàng của bạn: \n" +
                    `Tên người mua: ${_guestName} \n` +
                    `Số điện thoại: ${_guestPhoneNumber} \n` +
                    `Địa chỉ nhận hàng: ${_bigAddress}` + "\n" +
                    "-------------------------------------------------------- \n" +
                    stringOrder + "\n" +
                    "-------------------------------------------------------- \n" +
                    `Tiền vận chuyển: 0 VND` + "\n" +
                    "-------------------------------------------------------- \n" +
                    `Tổng tiền sản phẩm: ${_lastTotal} VND` + "\n" +
                    "-------------------------------------------------------- \n" +
                    `Tổng: ${_lastTotal + 0} VND` + "\n" +
                    "-------------------------------------------------------- \n" +
                    "Có điều gì thắc mắc không? Vui lòng liên hệ với cửa hàng của chúng tôi theo địa chỉ liên hệ bên dưới: ComeBuy.com"
            }).then(data => {
                setListItem(t)
                setStartAddInvoiceItem(true)
            })
                .catch(err => console.log(err))
        }

    }
    const [startAddInvoiceItem, setStartAddInvoiceItem] = useState(false)
    const [isCompleted, setIsCompleted] = useState(false)
    useEffect(() => {
        if (isCompleted === true) {
            setPaidSuccessfully(true)
        }
    }, [isCompleted])

    useEffect(() => {
        const addItem = async () => {
            for (let i = 0; i < listItem.length; i++) { 
                try {
                    const resultAction = await dispatch(addInvoiceItem(listItem[i]))
                    const originalPromiseResult = unwrapResult(resultAction)
                } catch (rejectedValueOrSerializedError) {
                    console.log(rejectedValueOrSerializedError)
                }
            }
            setStartAddInvoiceItem(false)
            setIsCompleted(true)
        }
        if (startAddInvoiceItem === true) {
            addItem()
        }
    }, [startAddInvoiceItem])

    const [startAddInvoice, setStartAddInvoice] = useState(false)

    const MakeInvoice = async () => {
        if (localStorage.getItem('role') === 'customer') {
            var m = moment().format('H mm')
            var date = moment().format('D/M/YYYY')
            let tempID = ''
            let temp = {
                ...orderData,
                moneyReceived: _lastTotal,
                isChecked: false,
                isPaid: false,
                date: date + ' ' + m,
                userID: _currentUser.userID,
                address: _bigAddress,
                branchID: '9ef0b2b9-9920-4d15-982c-c4a4209700cd'
            }
            setOrderData(temp)
            setStartAddInvoice(true)
        } else {
            var m = moment().format('H mm')
            var date = moment().format('D/M/YYYY')
            let tempID = ''
            let temp = {
                ...orderData,
                moneyReceived: _lastTotal.toString(),
                isChecked: false,
                isPaid: false,
                date: date + ' ' + m,
                address: _bigAddress,
                userID: "49d42e91-39e3-4879-a3b0-76b3315f9e38",
                branchID: '9ef0b2b9-9920-4d15-982c-c4a4209700cd'
            }
            setOrderData(temp)
            setStartAddInvoice(true)
        }

    }

    const [invoiceId, setInvoiceId] = useState(' ')

    useEffect(() => {
        const fetchData = async () => {
            if (invoiceId !== ' ') {
                _addInvoiceItem(invoiceId)
            }
        }
        fetchData()
    }, [invoiceId])

    useEffect(() => {
        const fetchData = async () => {
            if (startAddInvoice === true) {
                try {
                    console.log('orderData', orderData)
                    const resultAction = await dispatch(addInvoice(orderData))
                    const originalPromiseResult = unwrapResult(resultAction)
                    setInvoiceId(originalPromiseResult?.data?.data?.invoiceID)
                } catch (rejectedValueOrSerializedError) {
                    alert(rejectedValueOrSerializedError)
                    setStartAddInvoice(false)
                }
            }
        }
        fetchData()
    }, [startAddInvoice])

    useEffect(() => {
        if (localStorage.getItem('role') === 'customer') {
            window.paypal
                .Buttons({
                    createOrder: (data, actions, err) => {
                        return actions.order.create({
                            intent: "CAPTURE",
                            purchase_units: [{
                                amount: {
                                    currency_code: "USD",
                                    value: _lastTotal + 2 - (_lastTotal * _discount / 100),
                                    breakdown: {
                                        item_total: {
                                            currency_code: "USD",
                                            value: _lastTotal
                                        },
                                        discount: {
                                            currency_code: 'USD',
                                            value: (_lastTotal * _discount) / 100
                                        },
                                        shipping: {
                                            currency_code: 'USD',
                                            value: 2
                                        }
                                    }
                                },
                                items: purchases
                            }],
                        });
                    },
                    onApprove: async (data, actions) => {
                        const order = await actions.order.capture();
                        await MakeInvoice()
                    },
                    onError: (err) => {
                        console.log(err);
                    },
                })
                .render(paypal.current);
        } 
        // else {
        // window.paypal
        //         .Buttons({
        //             createOrder: (data, actions, err) => {
        //                 return actions.order.create({
        //                     intent: "CAPTURE",
        //                     purchase_units: [{
        //                         amount: {
        //                             currency_code: "USD",
        //                             value: _lastTotal + 2,
        //                             breakdown: {
        //                                 item_total: {
        //                                     currency_code: "USD",
        //                                     value: _lastTotal
        //                                 },
        //                                 shipping: {
        //                                     currency_code: 'USD',
        //                                     value: 2
        //                                 }
        //                             }
        //                         },
        //                         items: purchases
        //                     }],
        //                 });
        //             },
        //             onApprove: async (data, actions) => {
        //                 const order = await actions.order.capture();
        //                 await MakeInvoice()
        //             },
        //             onError: (err) => {
        //                 console.log(err);
        //             },
        //         })
        //         .render(paypal.current);
        // }
    }, []);

    return (
        <div>
            <div ref={paypal}></div>
            {/* {console.log(cartList)}
            {console.log(prodList)} */}
            {/* {console.log(purchases)}
            {console.log(_discount)}
            {console.log(_lastTotal)} */}

            <Dialog open={paidSuccessfully}>
                <DialogTitle color='success'>Đã thanh toán thành công</DialogTitle>
                <Button
                    onClick={handleCloseDialog}
                    sx={{
                        alignSelf: 'center',
                        width: '30px',
                        height: '30px',
                        borderRadius: '15px',
                        border: '1px solid #18608a',
                        backgroundColor: 'green',
                        color: 'black',
                        fontSize: '13px',
                        marginBottom: '10px',
                        fontWeight: 'bold',
                        padding: '12px 45px',
                    }}
                >
                    Đóng 
                </Button>
            </Dialog>
        </div>
    );
}
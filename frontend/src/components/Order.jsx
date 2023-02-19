import React from 'react'

export default function Order({ orderData }) {
    const { productName, orderPrice } = orderData;
    return (
        <>
            <td>{productName}</td>
            <td>{orderPrice}</td>
        </>
    )
}

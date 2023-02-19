import React from "react";
import { over } from "stompjs";
import SockJS from "sockjs-client";
import Order from "./Order";

const SOCKET_URL = "http://localhost:8080/";
let stompClient = null;

export default function Main() {
  const [subscribed, setSubscribed] = React.useState(false);
  const [formData, setFormData] = React.useState({
    productName: "",
    orderPrice: ""
  });
  const [orders, setOrders] = React.useState([]);
  const { productName, orderPrice } = formData;


  //Subscribe
  const onSuccess = () => {
    stompClient.subscribe("/topic/orders", onMessageRecieved);
    setSubscribed(true);
  };
  const onError = () => {
    console.error("Something went wrong");
    setSubscribed(false);
  };
  const handleSubscribe = () => {
    var sock = new SockJS(SOCKET_URL);
    stompClient = over(sock);
    stompClient.connect({}, onSuccess, onError);
  };

  //Disconnect
  let handleDisconnect = () => {
    stompClient.disconnect({});
    setSubscribed(false);
  }

  //Send Message (Place Order)
  const onSubmit = (e) => {
    e.preventDefault();
    stompClient.send("/app/order", {}, JSON.stringify({ productName: productName, orderPrice: orderPrice }));
    setFormData({ productName: "", orderPrice: "" });
  }


  //On Message Received
  let onMessageRecieved = (payload) => {
    let payloadData = JSON.parse(payload.body)
    setOrders(payloadData);
  }

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  return (
    <>
      {
        subscribed ? (
          <div className="alert alert-success" role="alert">
            Status: Connected
          </div>
        ) : (
          <div className="alert alert-danger" role="alert">
            Status: Disconnected
          </div>
        )
      }
      <div className="container text-center mt-3">
        <div className="row">
          {
            subscribed ? (
              <div className="col">
                <div className="card">
                  <div className="card-body">
                    <h5>Place Order</h5>
                    <form onSubmit={onSubmit}>
                      <div className="row">
                        <div className="col">
                          <input
                            type="text"
                            className="form-control"
                            name="productName"
                            value={productName}
                            onChange={(e) => onChange(e)}
                            placeholder="Product Name"
                          />
                        </div>
                        <div className="col">
                          <input
                            type="number"
                            className="form-control"
                            name="orderPrice"
                            value={orderPrice}
                            onChange={(e) => onChange(e)}
                            placeholder="Order Price"
                          />
                        </div>
                      </div>
                      <button className="btn btn-dark w-100 mt-2" type="submit" disabled={!orderPrice || !productName}>
                        Place Order
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            ) : (
              <div className="col"></div>
            )
          }
          <div className="col">
            {!subscribed ? (
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSubscribe}
              >
                Subscribe
              </button>
            ) : (
              <>
                <div className="alert alert-success" role="alert">
                  You're Subscribed!
                </div>
                <button type="button" className="btn btn-danger" onClick={handleDisconnect}>Disconnect</button>
              </>
            )}
          </div>
          {
            subscribed ? (
              <div className="col">
                <div className="card">
                  <div className="card-body">
                    <h5>My Orders</h5>
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Product Name</th>
                          <th>Order Price</th>
                        </tr>
                      </thead>
                      {
                        orders?.map((e) => (
                          <tbody>
                            <tr>
                              <Order orderData={JSON.parse(e)} />
                            </tr>
                          </tbody>
                        ))
                      }
                    </table>
                  </div>
                </div>
              </div>
            ) : (
              <div className="col"></div>
            )
          }
        </div>
      </div>
    </>
  );
}
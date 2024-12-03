import React from "react";
import CanvasRenderer from "./CanvasRenderer";
import { Info, Edit, XCircle } from "lucide-react";
import { AuthContext } from "../../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const OrderItem = ({ order, onUpdate }) => {
  const navigate = useNavigate();
  const [currentType, setCurrentType] = useState("shirt");
  const [price, setPrice] = useState(20);
  const [color, setColor] = useState("#ffffff");
  const [size, setSize] = useState("M");
  const [frontImage, setFrontImage] = useState(null);
  const [backImage, setBackImage] = useState(null);
  const [uploadedFrontImage, setUploadedFrontImage] = useState(null);
  const [uploadedBackImage, setUploadedBackImage] = useState(null);

  console.log("Order Item:", order);
  useEffect(() => {
    const fetchDesign = async () => {
      try {
        const orderUrl = `http://localhost:5000/order-items/${order.orderItem.id}`;
        console.log("orderUrl", orderUrl);
        const orderResponse = await fetch(orderUrl, {
          // method: "GET",
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
            // "id": id,
          },
        });

        if (!orderResponse.ok) {
          console.error("Error fetching design:", orderResponse.statusText);
          return;
        }

        const orderData = await orderResponse.json();
        setUploadedFrontImage(
          orderData.frontsideImageUrl ? `http://localhost:5000${orderData.frontsideImageUrl}` : null
        );
        setUploadedBackImage(
          orderData.backsideImageUrl ? `http://localhost:5000${orderData.backsideImageUrl}` : null
        );

        const productData = orderData.product;

        // Cập nhật state với dữ liệu từ server;
        setCurrentType(productData.name || "shirt");
        setPrice(productData.price || 20);
        setColor(productData.color || "#ffffff");
        setSize(productData.size || "M");
        setFrontImage(
          `http://localhost:5000${productData.frontsideImageUrl}` || null
        );
        setBackImage(
          `http://localhost:5000${productData.backsideImageUrl}` || null
        );
      } catch (error) {
        console.error("Error loading design:", error);
      }
    };

    fetchDesign();
  }, [order.orderItem.id]);

  const deleteOrder = async () => {
    const token = sessionStorage.getItem("accessToken");
    try {
      const response = await fetch(
        `http://localhost:5000/orders/${order.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      onUpdate();
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  return (
    <div className="flex items-center gap-4 py-4 px-2 border-b border-gray-200">
      {/* Product Image */}
      <div className="w-40 h-40 flex-shrink-0">
        <CanvasRenderer
          baseImageSrc={frontImage}
          colorOverlay={color}
          uploadedImage={uploadedFrontImage}
        />
      </div>

      {/* Order Details */}
      <div className="flex-1">
        <h3 className="text-lg font-bold">Order ID: {order.id}</h3>
        <p className="text-sm text-gray-600">Address: {order.address}</p>
        <p className="text-sm text-gray-500">Quantity: {order.quantity}</p>
        <p className="text-sm text-gray-500">
          Total Price: ${order.totalPrice}
        </p>
      </div>

      {/* Order Status */}
      <div className="flex-1 text-center text-gray-500">
        {order.status}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          className="p-2 hover:bg-gray-100 rounded"
          onClick={() => {
            navigate(`/store/orders/info/${order.orderItem.id}`);
          }}
        >
          <Info size={16} />
        </button>
        {/* <button
          className="p-2 hover:bg-gray-100 rounded"
          onClick={() => {
            // navigate(`/store/orders/edit/${order.orderItem.id}`);
          }}
        >
          <Edit size={16} />
        </button> */}
        <button className="p-2 hover:bg-gray-100 rounded" onClick={deleteOrder}>
          <XCircle size={16} />
        </button>
      </div>
    </div>
  );
};

export default OrderItem;
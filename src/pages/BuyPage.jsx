import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DesignPage from "./DesignPage";
import Cookies from "js-cookie";

const BuyPage = ({ isPreview = false, buyItem = false }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [address, setAddress] = useState("");
  const [productId, setProductId] = useState(null);

  const [isEditing, setIsEditing] = useState(!!id);

  useEffect(() => {
    if (isEditing) {
      const fetchOrder = async () => {
        try {
          const response = await fetch(`http://localhost:5000/orders/${id}`, {
            headers: {
              Authorization: `Bearer ${Cookies.get("accessToken")}`,
            },
          });

          if (!response.ok) {
            console.error("Error fetching order:", response.statusText);
            return;
          }

          const data = await response.json();
          setQuantity(data.quantity);
          setAddress(data.address);
          setProductId(data.orderItem.id);
        } catch (error) {
          console.error("Error fetching order:", error);
        }
      };

      fetchOrder();
    }
  }, [isEditing]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!buyItem) {
      console.error("Not buying item");
      return;
    }

    const orderData = {
      quantity,
      address,
      orderItemId: id,
    };

    try {
      const response = await fetch("http://localhost:5000/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        console.error("Error creating order:", response.statusText);
        return;
      }

      const data = await response.json();
      console.log("Order created successfully:", data);
      navigate("/store/orders");
    } catch (error) {
      console.error("Error creating order:", error);
    }
  };

  return (
    <div style={styles.container}>
      <h1 className="text-4xl font-bold text-gray-800 text-center mb-6">
        Buy Product
      </h1>

      <DesignPage isPreview={true} idx={productId} />

      {/* Form Section */}
      <div style={styles.formSection}>
        {/* Quantity */}
        <div style={styles.inputGroup}>
          <label htmlFor="quantity" style={styles.label}>
            Quantity:
          </label>
          <input
            id="quantity"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            min="1"
            style={styles.input}
            disabled={isPreview}
          />
        </div>

        {/* Address */}
        <div style={styles.inputGroup}>
          <label htmlFor="address" style={styles.label}>
            Address:
          </label>
          <textarea
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            rows="4"
            style={styles.textarea}
            disabled={isPreview}
          />
        </div>

        {/* Submit Button */}
        {!isPreview && (
          <button
            type="submit"
            style={{
              ...styles.button,
              backgroundColor:
                address === "" || quantity < 1 ? "gray" : "#4CAF50",
              cursor: address === "" || quantity < 1 ? "not-allowed" : "pointer",
            }}
            onClick={handleSubmit}
            disabled={address === "" || quantity < 1}
          >
            Place Order
          </button>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    fontFamily: "Arial, sans-serif",
    margin: "20px auto",
    maxWidth: "600px",
  },
  formSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: "20px",
    gap: "20px",
  },
  inputGroup: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "start",
  },
  label: {
    fontWeight: "bold",
    marginBottom: "5px",
    fontSize: "18px",
  },
  input: {
    width: "100%",
    padding: "10px",
    fontSize: "16px",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
  textarea: {
    width: "100%",
    padding: "10px",
    fontSize: "16px",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    color: "white",
    border: "none",
    borderRadius: "5px",
  },
};

export default BuyPage;

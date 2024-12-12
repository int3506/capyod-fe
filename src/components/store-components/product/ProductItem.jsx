import React from "react";
import CanvasRenderer from "./CanvasRenderer";
import { Info, Edit, Copy, ShoppingBasket, XCircle } from "lucide-react";
import { AuthContext } from "../../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import LoginRequired from "../../LoginRequired";

const ProductItem = ({ product, onUpdate, isSelected, onSelect, canEdit }) => {
  const navigate = useNavigate();
  const { isLoggedIn } = React.useContext(AuthContext);
  let baseImageSrc = product.product.frontsideImageUrl;
  const colorOverlay = product.product.color;
  let uploadedImage = product.frontsideImageUrl;
  if (baseImageSrc) {
    baseImageSrc = "http://localhost:5000" + baseImageSrc;
  }
  if (uploadedImage) {
    uploadedImage = "http://localhost:5000" + uploadedImage;
  }
  console.log(product);
  console.log("Base Image Source:", baseImageSrc);
  console.log("Color Overlay:", colorOverlay);
  console.log("Uploaded Image:", uploadedImage);

  const duplicateDesign = async () => {
    if (!isLoggedIn) {
      console.error("You need to log in to save the design!");
      return;
    }

    const token = Cookies.get("accessToken");

    try {
      console.log("Product ID:", product);
      const orderFormData = new FormData();
      orderFormData.append("productId", product.product.id);

      let frontImageUrl = null;
      if (product.frontsideImageUrl) {
        frontImageUrl = "http://localhost:5000" + product.frontsideImageUrl;
      }

      let backImageUrl = null;
      if (product.backsideImageUrl) {
        backImageUrl = "http://localhost:5000" + product.backsideImageUrl;
      }

      if (frontImageUrl) {
        const response = await fetch(frontImageUrl);
        if (!response.ok) {
          console.error("Error fetching frontsideImage:", response.statusText);
          return;
        }
        const frontImageBlob = await response.blob();
        orderFormData.append(
          "frontsideImage",
          frontImageBlob,
          "server_front_image.png"
        );
      }

      if (backImageUrl) {
        const response = await fetch(backImageUrl);
        if (!response.ok) {
          console.error("Error fetching backsideImage:", response.statusText);
          return;
        }
        const backImageBlob = await response.blob();
        orderFormData.append(
          "backsideImage",
          backImageBlob,
          "server_back_image.png"
        );
      }

      for (let pair of orderFormData.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
      }

      console.log({
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: orderFormData,
      });

      const orderResponse = await fetch("http://localhost:5000/order-items", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: orderFormData,
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        console.error("Error duplicating order item:", errorData);
        return;
      }

      const orderData = await orderResponse.json();
      console.log("Order item duplicated successfully:", orderData);
      onUpdate();
    } catch (error) {
      console.error("Error saving design:", error);
    }
  };

  const deleteProduct = async () => {
    const token = Cookies.get("accessToken");
    try {
      const response = await fetch(
        `http://localhost:5000/order-items/${product.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error deleting product:", errorData);
        return;
      }

      console.log("Product deleted successfully");
      onUpdate();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <tr className="hover:bg-gray-50">
      {/* Checkbox */}
      <td className="p-4 text-center">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(product.id)}
        />
      </td>

      {/* Product Image */}
      <td className="p-4 flex justify-center items-center">
        <div className="w-40 h-40 flex-shrink-0">
          <CanvasRenderer
            baseImageSrc={baseImageSrc}
            colorOverlay={colorOverlay}
            uploadedImage={uploadedImage}
          />
        </div>
      </td>

      {/* Product Details */}
      <td className="p-4 text-center">
        <div className="flex-1">
          <h3 className="text-lg font-bold">{product.name}</h3>
          <p className="text-sm text-gray-600">{product.description}</p>
          <p className="text-sm text-gray-500">{`${product.product.size} • $${product.price}`}</p>
        </div>
      </td>

      {/* Inventory */}
      <td className="p4 text-center">All in stock</td>

      {/* Status */}
      <td className="p-4 text-center">Published</td>

      {/* Actions */}
      <td className="p-4 flex justify-center items-center gap-2">
        <button
          className="p-2 hover:bg-gray-100 rounded"
          onClick={() => navigate(`/store/products/preview/${product.id}`)}
        >
          <Info size={16} />
        </button>
        {canEdit && (
          <button
            className="p-2 hover:bg-gray-100 rounded"
            onClick={() => navigate(`/store/products/edit/${product.id}`)}
          >
            <Edit size={16} />
          </button>
        )}
        <LoginRequired
          onSuccess={() => navigate(`/store/products/buy/${product.id}`)}
        >
          <button className="p-2 hover:bg-gray-100 rounded">
            <ShoppingBasket size={16} />
          </button>
        </LoginRequired>
        {canEdit && (
          <button
            className="p-2 hover:bg-gray-100 rounded"
            onClick={deleteProduct}
          >
            <XCircle size={16} />
          </button>
        )}
      </td>
    </tr>
  );
};

export default ProductItem;

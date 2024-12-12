import React, { useState, useEffect, useRef, useContext } from "react";
import tshirtFrontImage from "../assets/store/front_shirt.png";
import tshirtBackImage from "../assets/store/back_shirt.png";
import sweaterFrontImage from "../assets/store/front_sweater.png";
import sweaterBackImage from "../assets/store/back_sweater.png";
import hoodieFrontImage from "../assets/store/front_hoodie.png";
import hoodieBackImage from "../assets/store/back_hoodie.png";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import Cookies from "js-cookie";

const DesignPage = ({ isPreview = false, idx = null }) => {
  const params = useParams(); // Lấy ID từ URL khi chỉnh sửa
  const id = idx !== null ? idx : params.id;
  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  // Trạng thái để phân biệt tạo mới hay chỉnh sửa
  const [isEditing, setIsEditing] = useState(!!id);

  // State ban đầu
  const [currentType, setCurrentType] = useState("shirt");
  const [price, setPrice] = useState(200000);
  const [color, setColor] = useState("#ffffff");
  const [size, setSize] = useState("M");
  const [uploadedFrontImage, setUploadedFrontImage] = useState(null);
  const [uploadedBackImage, setUploadedBackImage] = useState(null);
  const [productID, setProductID] = useState(null);

  useEffect(() => {
    // Khi chỉnh sửa, tải dữ liệu thiết kế từ server
    if (isEditing) {
      const fetchDesign = async () => {
        try {
          const orderUrl = `http://localhost:5000/order-items/${id}`;
          console.log("orderUrl", orderUrl);
          const orderResponse = await fetch(orderUrl, {
            // method: "GET",
            headers: {
              Authorization: `Bearer ${Cookies.get("accessToken")}`,
              // "id": id,
            },
          });

          if (!orderResponse.ok) {
            console.error("Error fetching design:", orderResponse.statusText);
            return;
          }

          const orderData = await orderResponse.json();
          setProductID(orderData.product.id);

          // const productUrl = `http://localhost:5000/products/${orderData.product.id}`;
          // const productResponse = await fetch(productUrl, {
          //   method: "GET",
          //   headers: {
          //     Authorization: `Bearer ${Cookies.get("accessToken")}`,
          //     // id: orderData.product.id,
          //   },
          // });

          // if (!productResponse.ok) {
          //   console.error("Error fetching design:", productResponse.statusText);
          //   return;
          // }

          // const productData = await productResponse.json();
          const productData = orderData.product;

          // Cập nhật state với dữ liệu từ server
          setCurrentType(productData.name || "shirt");
          setPrice(productData.price || 20);
          setColor(productData.color || "#ffffff");
          setSize(productData.size || "M");
          setUploadedFrontImage(
            orderData.frontsideImageUrl
              ? `http://localhost:5000${orderData.frontsideImageUrl}`
              : null
          );
          setUploadedBackImage(
            orderData.backsideImageUrl
              ? `http://localhost:5000${orderData.backsideImageUrl}`
              : null
          );
        } catch (error) {
          console.error("Error loading design:", error);
        }
      };

      fetchDesign();
    }
  }, [isEditing, id]);

  const baseFrontCanvasRef = useRef(null);
  const overlayFrontCanvasRef = useRef(null);
  const baseBackCanvasRef = useRef(null);
  const overlayBackCanvasRef = useRef(null);

  const getFrontImage = () => {
    switch (currentType) {
      case "shirt":
        return tshirtFrontImage;
      case "sweater":
        return sweaterFrontImage;
      case "hoodie":
        return hoodieFrontImage;
      default:
        return tshirtFrontImage;
    }
  };

  const getBackImage = () => {
    switch (currentType) {
      case "shirt":
        return tshirtBackImage;
      case "sweater":
        return sweaterBackImage;
      case "hoodie":
        return hoodieBackImage;
      default:
        return tshirtBackImage;
    }
  };

  const renderCanvasLayers = (
    baseCanvasRef,
    overlayCanvasRef,
    imageSrc,
    overlayColor
  ) => {
    const baseCanvas = baseCanvasRef.current;
    const overlayCanvas = overlayCanvasRef.current;

    const baseCtx = baseCanvas.getContext("2d");
    const overlayCtx = overlayCanvas.getContext("2d");

    const img = new Image();
    img.src = imageSrc;

    img.onload = () => {
      baseCanvas.width = img.width;
      baseCanvas.height = img.height;
      overlayCanvas.width = img.width;
      overlayCanvas.height = img.height;

      baseCtx.globalAlpha = 1;
      baseCtx.drawImage(img, 0, 0, img.width, img.height);

      overlayCtx.globalAlpha = 0.9;
      overlayCtx.fillStyle = overlayColor;
      overlayCtx.fillRect(0, 0, overlayCanvas.width, overlayCanvas.height);

      overlayCtx.globalCompositeOperation = "destination-in";
      overlayCtx.drawImage(img, 0, 0, img.width, img.height);

      overlayCtx.globalCompositeOperation = "source-over";
    };
  };

  useEffect(() => {
    renderCanvasLayers(
      baseFrontCanvasRef,
      overlayFrontCanvasRef,
      getFrontImage(),
      color
    );
    renderCanvasLayers(
      baseBackCanvasRef,
      overlayBackCanvasRef,
      getBackImage(),
      color
    );
  }, [currentType, color]);

  const handleImageUpload = (e, setImage) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveDesign = async () => {
    if (!isLoggedIn) {
      console.error("You need to log in to save the design!");
      return;
    }

    const token = Cookies.get("accessToken");

    try {
      const productFormData = new FormData();
      productFormData.append("name", `${currentType}`);
      productFormData.append("description", `Custom ${currentType} design`);
      productFormData.append("price", price);
      productFormData.append("color", color);
      productFormData.append("size", size);

      const frontBlob = await new Promise((resolve) =>
        baseFrontCanvasRef.current.toBlob(resolve)
      );
      const backBlob = await new Promise((resolve) =>
        baseBackCanvasRef.current.toBlob(resolve)
      );

      productFormData.append("frontsideImage", frontBlob, "front.png");
      productFormData.append("backsideImage", backBlob, "back.png");

      const productMethod = isEditing ? "PATCH" : "POST";
      const productUrl = isEditing
        ? `http://localhost:5000/products/${productID}`
        : "http://localhost:5000/products";

      console.log({
        productMethod,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: productFormData,
      });

      const productResponse = await fetch(productUrl, {
        method: productMethod,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: productFormData,
      });

      if (!productResponse.ok) {
        const errorData = await productResponse.json();
        console.error("Error creating product:", errorData);
        return;
      }

      const productData = await productResponse.json();
      console.log("Product created successfully:", productData);

      const orderFormData = new FormData();
      orderFormData.append("productId", productData.id);

      if (uploadedFrontImage) {
        const frontImageBlob = await fetch(uploadedFrontImage).then((res) =>
          res.blob()
        );
        orderFormData.append(
          "frontsideImage",
          frontImageBlob,
          "uploaded_front.png"
        );
      }

      if (uploadedBackImage) {
        const backImageBlob = await fetch(uploadedBackImage).then((res) =>
          res.blob()
        );
        orderFormData.append(
          "backsideImage",
          backImageBlob,
          "uploaded_back.png"
        );
      }

      for (let pair of orderFormData.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
      }

      const orderMethod = isEditing ? "PATCH" : "POST";
      const orderUrl = isEditing
        ? `http://localhost:5000/order-items/${id}`
        : "http://localhost:5000/order-items";

      const orderResponse = await fetch(orderUrl, {
        method: orderMethod,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: orderFormData,
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        console.error("Error creating order item:", errorData);
        return;
      }

      const orderData = await orderResponse.json();
      console.log("Order item created successfully:", orderData);

      navigate("/store/products");
    } catch (error) {
      console.error("Error saving design:", error);
    }
  };

  return (
    <div style={styles.container}>
      <h1 className="text-4xl font-bold text-gray-800 text-center mb-6">
        Thiết kế áo của bạn
      </h1>

      {/* Phần hiển thị áo mặt trước */}
      <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", justifyContent: "center", alignItems: "center" }}>
        <div
          style={{ display: "flex", flexDirection: "column", flexWrap: "wrap"}}
        >
          <h2 className="text-lg font-bold text-gray-700 mb-4 text-center">
            Mặt trước
          </h2>
          <div style={styles.displaySection}>
            <div
              style={{ position: "relative", width: "300px", height: "300px" }}
            >
              <canvas ref={baseFrontCanvasRef} style={styles.canvas}></canvas>
              <canvas
                ref={overlayFrontCanvasRef}
                style={styles.canvas}
              ></canvas>
            </div>
            <div
              style={{
                ...styles.uploadArea,
                border: isPreview ? "0px" : "2px dashed black",
                background: uploadedFrontImage
                  ? `url(${uploadedFrontImage}) no-repeat center/contain`
                  : "transparent",
              }}
              onClick={() => document.getElementById("fileUploadFront").click()}
            >
              {!uploadedFrontImage && !isPreview && (
                <span>Nhấn để tải ảnh lên</span>
              )}
            </div>
            <input
              type="file"
              id="fileUploadFront"
              accept="image/*"
              style={styles.hiddenInput}
              onChange={(e) => handleImageUpload(e, setUploadedFrontImage)}
            />
          </div>
        </div>

        {/* Phần hiển thị áo mặt sau */}
        <div
          style={{ display: "flex", flexDirection: "column", flexWrap: "wrap" }}
        >
          <h2 className="text-lg font-bold text-gray-700 mb-4 text-center">
            Mặt sau
          </h2>
          <div style={styles.displaySection}>
            <div
              style={{ position: "relative", width: "300px", height: "300px" }}
            >
              <canvas ref={baseBackCanvasRef} style={styles.canvas}></canvas>
              <canvas ref={overlayBackCanvasRef} style={styles.canvas}></canvas>
            </div>
            <div
              style={{
                ...styles.uploadArea,
                border: isPreview ? "0px" : "2px dashed black",
                background: uploadedBackImage
                  ? `url(${uploadedBackImage}) no-repeat center/contain`
                  : "transparent",
              }}
              onClick={() => document.getElementById("fileUploadBack").click()}
            >
              {!uploadedBackImage && !isPreview && (
                <span>Nhấn để tải ảnh lên</span>
              )}
            </div>
            <input
              type="file"
              id="fileUploadBack"
              accept="image/*"
              style={styles.hiddenInput}
              onChange={(e) => handleImageUpload(e, setUploadedBackImage)}
            />
          </div>
        </div>
      </div>

      {/* Nút chọn loại áo */}
      <div style={styles.buttonGroup}>
        <button
          onClick={() => setCurrentType("shirt")}
          style={{
            ...styles.switchButton,
            backgroundColor: currentType === "shirt" ? "#4CAF50" : "#ccc",
          }}
          disabled={isPreview}
        >
          T-Shirt
        </button>
        <button
          onClick={() => setCurrentType("sweater")}
          style={{
            ...styles.switchButton,
            backgroundColor: currentType === "sweater" ? "#4CAF50" : "#ccc",
          }}
          disabled={isPreview}
        >
          Sweater
        </button>
        <button
          onClick={() => setCurrentType("hoodie")}
          style={{
            ...styles.switchButton,
            backgroundColor: currentType === "hoodie" ? "#4CAF50" : "#ccc",
          }}
          disabled={isPreview}
        >
          Hoodie
        </button>
      </div>

      {/* Chọn màu sắc */}
      <div style={styles.optionsContainer}>
        <label htmlFor="colorPicker" style={styles.optionLabel}>
          {isPreview ? "Màu áo:" : "Chọn màu áo:"}
        </label>
        <input
          type="color"
          id="colorPicker"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          style={styles.colorPicker}
          disabled={isPreview}
        />
      </div>

      {/* Chọn size */}
      <div style={styles.optionsContainer}>
        <label style={styles.optionLabel}>
          {isPreview ? "Size:" : "Chọn size:"}
        </label>
        <select
          value={size}
          onChange={(e) => setSize(e.target.value)}
          style={styles.selectBox}
          disabled={isPreview}
        >
          <option value="S">S</option>
          <option value="M">M</option>
          <option value="L">L</option>
          <option value="XL">XL</option>
          <option value="XXL">XXL</option>
        </select>
      </div>

      {/* Chọn giá */}
      <div style={styles.optionsContainer}>
        <label htmlFor="priceInput" style={styles.optionLabel}>
          Giá (VNĐ):
        </label>
        <input
          type="number"
          id="priceInput"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          style={styles.priceInput}
          disabled={isPreview}
        />
      </div>

      {/* Nút lưu */}
      {!isPreview && (
        <button onClick={saveDesign} style={styles.saveButton}>
          Lưu mẫu áo
        </button>
      )}
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    fontFamily: "Arial, sans-serif",
  },
  displaySection: {
    margin: "auto",
    position: "relative",
    width: "300px",
    height: "300px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  canvas: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "300px",
    height: "300px",
    zIndex: 1,
  },
  image: {
    width: "300px",
    height: "300px",
    objectFit: "cover",
  },
  uploadArea: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "100px",
    height: "100px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    backgroundSize: "contain",
    zIndex: 2,
    pointerEvents: "auto",
  },
  hiddenInput: {
    display: "none",
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    marginTop: "20px",
  },
  switchButton: {
    padding: "10px 20px",
    margin: "0 5px",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  saveButton: {
    padding: "10px 20px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "20px",
  },
  optionsContainer: {
    margin: "10px 0",
  },
  optionLabel: {
    marginRight: "10px",
    fontWeight: "bold",
  },
  colorPicker: {
    cursor: "pointer",
  },
  selectBox: {
    padding: "5px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  priceInput: {
    padding: "5px",
    width: "100px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
};

export default DesignPage;

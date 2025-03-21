"use client";
import { useState, useEffect } from "react";
import BarcodeScannerComponent from "react-qr-barcode-scanner";

export default function BarcodeScanner() {
  const [barcode, setBarcode] = useState(null);
  const [productData, setProductData] = useState(null);

  const handleScan = (err, result) => {
    if (result) {
      console.log("Scanned Barcode:", result.text);
      setBarcode(result.text);
      fetchProductData(result.text);
    }
  };

  const fetchProductData = async (barcode) => {
    try {
      const response = await fetch(`/api/getBarcodeData?barcode=${barcode}`);
      const data = await response.json();
      setProductData(data);
      console.log("Product Data:", data);
    } catch (error) {
      console.error("Error fetching product data:", error);
    }
  };
  

  return (
    <div className="max-w-lg mx-auto mt-6 p-4 border shadow-lg text-center">
      <h2 className="text-xl font-bold mb-4">Scan a Barcode</h2>
      <BarcodeScannerComponent onUpdate={handleScan} className="mb-4" />
      {barcode && (
        <p className="mt-4 text-lg font-semibold">Scanned Code: {barcode}</p>
      )}
      {productData && (
        <div className="mt-4 p-3 border rounded bg-gray-100 text-left">
          <h3 className="font-semibold text-lg">Product Details:</h3>
          <p>
            <strong>Name:</strong> {productData.products?.[0]?.title || "N/A"}
          </p>
          <p>
            <strong>Brand:</strong> {productData.products?.[0]?.brand || "N/A"}
          </p>
          <p>
            <strong>Category:</strong>{" "}
            {productData.products?.[0]?.category || "N/A"}
          </p>
        </div>
      )}
    </div>
  );
}

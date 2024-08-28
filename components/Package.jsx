"use client";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

export default function Package() {
  const [packageData, setPackageData] = useState(null);

  useEffect(() => {
    // Extract package data and error from query parameters
    const query = new URLSearchParams(window.location.search);
    const packageData = query.get("packageData");

    if (packageData) {
      setPackageData(JSON.parse(packageData));
    }
  }, []);

  if (!packageData || !packageData.finalPackage) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-2xl p-8 shadow-md rounded">
        <CardHeader className="text-center mb-6">
          <CardTitle className="text-3xl font-bold">Event Package</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Display Venue Details */}
          <Card className="mb-6 p-4 border rounded shadow">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Venue</CardTitle>
            </CardHeader>
            <CardContent>
              {packageData.finalPackage
                .filter((item) => item.serviceType === "Venue")
                .map((item, index) => (
                  <div key={index} className="mb-4">
                    <p className="text-lg font-medium">
                      {item.venueDetails.name}
                    </p>
                    <p className="text-gray-500">Vendor: {item.vendorName}</p>
                    <p className="text-gray-500">Price: {item.price} PKR</p>
                    <p className="text-gray-500">
                      Capacity: {item.venueDetails.capacity}
                    </p>
                    <p className="text-gray-500">
                      Amenities: {item.venueDetails.amenities.join(", ")}
                    </p>
                  </div>
                ))}
            </CardContent>
          </Card>

          {/* Display Catering Details */}
          <Card className="mb-6 p-4 border rounded shadow">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Catering</CardTitle>
            </CardHeader>
            <CardContent>
              {packageData.finalPackage
                .filter((item) => item.serviceType === "Catering")
                .map((item, index) => (
                  <div key={index} className="mb-4">
                    <p className="text-lg font-medium">{item.serviceName}</p>
                    <p className="text-gray-500">Vendor: {item.vendorName}</p>
                    <p className="text-gray-500">Price: {item.price} PKR</p>
                  </div>
                ))}
            </CardContent>
          </Card>

          {/* Display Photography Details */}
          <Card className="mb-6 p-4 border rounded shadow">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">
                Photography
              </CardTitle>
            </CardHeader>
            <CardContent>
              {packageData.finalPackage
                .filter((item) => item.serviceType === "Photography")
                .map((item, index) => (
                  <div key={index} className="mb-4">
                    <p className="text-lg font-medium">{item.serviceName}</p>
                    <p className="text-gray-500">Vendor: {item.vendorName}</p>
                    <p className="text-gray-500">Price: {item.price} PKR</p>
                    <p className="text-gray-500">Details: {item.details}</p>
                  </div>
                ))}
            </CardContent>
          </Card>

          {/* Display Sound System Details */}
          <Card className="mb-6 p-4 border rounded shadow">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">
                Sound System
              </CardTitle>
            </CardHeader>
            <CardContent>
              {packageData.finalPackage
                .filter((item) => item.serviceType === "Sound System")
                .map((item, index) => (
                  <div key={index} className="mb-4">
                    <p className="text-lg font-medium">{item.serviceName}</p>
                    <p className="text-gray-500">Vendor: {item.vendorName}</p>
                    <p className="text-gray-500">Price: {item.price} PKR</p>
                    <p className="text-gray-500">Details: {item.details}</p>
                  </div>
                ))}
            </CardContent>
          </Card>

          {/* Display Total Cost */}
          <div className="flex justify-center items-center mt-8">
            <p className="text-xl font-bold">
              Total Cost: {packageData.totalCost} PKR
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import { useRouter } from "next/router";
import React from "react";
import { FaArrowRight } from "react-icons/fa";

export default function EmptyCart() {
    const router = useRouter();
    const backToHome = () => {
        const query: any = {};
        router.push({
          pathname: "/",
          query,
        });
      };
  return (
    <div className="w-full">
      <div className="flex flex-col items-center justify-center space-y-3">
        <img
          src="/public/assets/img/empty-cart.png"
          className="w-[25%] h-[35%] mb-3"
          alt="Empty cart"
        />
        <span className="text-indigo-900 lg:text-3xl text-md font-bold">
          Looks Like Your Cart is Empty
        </span>
        <div className="flex justify-center">
          <button
            type="button"
            onClick={backToHome}
            className="button rounded-md bg-gray-500 text-white py-2 px-3 flex items-center focus:outline-none focus:ring focus:ring-gray-300 hover:bg-gray-700"
          >
            Start Renting
            <FaArrowRight className="ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
}

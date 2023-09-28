import { createRazorPayOrder } from "../api/user/orders.api";


function loadScript(src: string) {
  return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
          resolve(true);
      };
      script.onerror = () => {
          resolve(false);
      };
      document.body.appendChild(script);
  });
}


export const  displayRazorpay = async (orderId: number) => {
  const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
  );

  if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
  }

  // creating a new order
  const result = await createRazorPayOrder({orderId});

  if (!result) {
      alert("Server error. Are you online?");
      return;
  }

  const paymentObject = new window.Razorpay(result.clientConfig);
  paymentObject.open();
}

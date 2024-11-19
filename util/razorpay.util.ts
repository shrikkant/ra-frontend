import { createRazorPayOrder, processPayment } from "../api/user/orders.api";


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


export const displayRazorpay = async (orderId: number, success) => {
    const res = await loadScript(
        "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
        alert("Razorpay SDK failed to load. Are you online?");
        return;
    }

    // creating a new order
    const result: any = await createRazorPayOrder({ orderId });
    const config = result.clientConfig;

    if (result.isTestMode) {
        config.handler = function (paymentResponse) {
            processPayment(paymentResponse).then((res) => {
                success(res);
            })
        }
    } else {
        config.handler = function (paymentResponse) {
            success(paymentResponse);
        }
    }

    if (!result) {
        alert("Server error. Are you online?");
        return;
    }

    const paymentObject = new (window as any).Razorpay(config);
    paymentObject.open();
    return;
}

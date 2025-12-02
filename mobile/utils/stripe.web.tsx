import { loadStripe } from "@stripe/stripe-js";
import { Elements, useStripe, useElements, CardElement } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export function StripeProvider({ children }: any) {
    return <Elements stripe={stripePromise}>{children}</Elements>;
}

export { useStripe, useElements, CardElement };
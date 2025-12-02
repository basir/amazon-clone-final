import React, { useState, useEffect } from 'react';
import { ScrollView, Alert } from 'react-native';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { Button, ButtonText } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Divider } from '@/components/ui/divider';
import { Image } from '@/components/ui/image';
import { Input, InputField } from '@/components/ui/input';
import { FormControl, FormControlLabel, FormControlLabelText } from '@/components/ui/form-control';
import { Radio, RadioGroup, RadioIndicator, RadioIcon, RadioLabel } from '@/components/ui/radio';
import { CircleIcon } from '@/components/ui/icon';
import { Header } from '../components';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from '../firebaseConfig';
import { Platform } from 'react-native';

import { useStripe, useElements, CardElement } from "@/utils/stripe";
import { orderAPI } from '@/services/api';
import { router } from 'expo-router';
import { showAlert } from '@/utils';

const isWeb = Platform.OS === "web";

export default function CheckoutScreen() {
    const { items, totalAmount, clearCart } = useCart();
    const { user } = useAuth();


    const stripe = useStripe();
    const elements = isWeb ? useElements() : null;

    const [address, setAddress] = useState({
        street: '123 Main St',
        city: 'Seattle',
        state: 'WA',
        zipCode: '98109',
        country: 'USA'
    });
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [loading, setLoading] = useState(false);
    const [clientSecret, setClientSecret] = useState<string | null>(null);

    const fetchPaymentIntentClientSecret = async () => {
        try {
            const functions = getFunctions(app);
            const createPaymentIntent = httpsCallable(functions, 'createPaymentIntent');
            const response = await createPaymentIntent({
                amount: totalAmount,
                currency: 'usd',
            });
            const { clientSecret } = response.data as any;
            return clientSecret;
        } catch (error) {
            console.error('Error fetching payment intent:', error);
            Alert.alert('Error', 'Failed to initialize payment. Please try again.');
            return null;
        }
    };

    const initializePaymentSheet = async () => {
        const clientSecret = await fetchPaymentIntentClientSecret();

        if (!clientSecret) return;

        if (!isWeb) {
            await stripe.initPaymentSheet({
                paymentIntentClientSecret: clientSecret,
                merchantDisplayName: "Amazon Clone",
                customFlow: false
            });
        }
        setClientSecret(clientSecret);
    };

    const handlePlaceOrder = async () => {
        if (!user) return;
        setLoading(true);
        try {
            if (isWeb && paymentMethod === "card") {
                const card = elements.getElement(CardElement);
                if (!card) {
                    alert("Card element missing");
                    return;
                }

                const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                    payment_method: {
                        card,
                    },
                });

                if (error) {
                    alert(error.message);
                    return;
                }
            }

            if (!isWeb && paymentMethod === "card") {
                const { error } = await stripe.presentPaymentSheet();
                if (error) {
                    showAlert(`Error code: ${error.code}: ${error.message}`);
                    setLoading(false);
                    return;
                }
            }
            const orderData = {
                userId: user.id,
                items: items.map(item => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    price: item.product?.price || 0,
                    productName: item.product?.name || '',
                    productImage: item.product?.images[0] || ''
                })),
                totalAmount,
                shippingAddress: { ...address, id: Date.now().toString() },
                status: 'pending',
                statusHistory: [{ status: 'pending', date: new Date().toISOString() }],
                paymentStatus: paymentMethod === 'card' ? 'paid' : 'pending',
                createdAt: new Date().toISOString(),
                orderNumber: `AMZ-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(Math.random() * 10000)}`
            };

            await orderAPI.create(orderData);
            await clearCart();

            // Alert.alert('Success', 'Your order has been placed!', [
            //     { text: 'OK', onPress: () => router.replace('/orders') }
            // ]);

            showAlert('Success. Your order has been placed!');
            router.replace('/orders')
        } catch (error) {
            console.error('Error placing order:', error);
            showAlert('Error: Failed to place order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (paymentMethod === 'card' && totalAmount > 0) {
            initializePaymentSheet();
        }
    }, [paymentMethod, totalAmount]);

    return (
        <Box className="flex-1 bg-gray-100">
            <Header />
            <ScrollView>
                <VStack className="gap-2 p-4">
                    <Heading className="text-xl">Checkout</Heading>

                    <Box className="bg-white p-4 rounded-md">
                        <Heading className="text-md mb-2">1. Shipping Address</Heading>
                        <VStack className="gap-1">
                            <FormControl>
                                <FormControlLabel><FormControlLabelText>Street Address</FormControlLabelText></FormControlLabel>
                                <Input><InputField value={address.street} onChangeText={t => setAddress({ ...address, street: t })} /></Input>
                            </FormControl>
                            <HStack className="gap-2">
                                <FormControl className="flex-1">
                                    <FormControlLabel><FormControlLabelText>City</FormControlLabelText></FormControlLabel>
                                    <Input><InputField value={address.city} onChangeText={t => setAddress({ ...address, city: t })} /></Input>
                                </FormControl>
                                <FormControl className="flex-1">
                                    <FormControlLabel><FormControlLabelText>State</FormControlLabelText></FormControlLabel>
                                    <Input><InputField value={address.state} onChangeText={t => setAddress({ ...address, state: t })} /></Input>
                                </FormControl>
                            </HStack>
                            <HStack className="gap-2">
                                <FormControl className="flex-1">
                                    <FormControlLabel><FormControlLabelText>Zip Code</FormControlLabelText></FormControlLabel>
                                    <Input><InputField value={address.zipCode} onChangeText={t => setAddress({ ...address, zipCode: t })} /></Input>
                                </FormControl>
                                <FormControl className="flex-1">
                                    <FormControlLabel><FormControlLabelText>Country</FormControlLabelText></FormControlLabel>
                                    <Input><InputField value={address.country} onChangeText={t => setAddress({ ...address, country: t })} /></Input>
                                </FormControl>
                            </HStack>
                        </VStack>
                    </Box>

                    <Box className="bg-white p-4 rounded-md">
                        <Heading className="text-md mb-2">2. Payment Method</Heading>
                        <RadioGroup value={paymentMethod} onChange={setPaymentMethod}>
                            <VStack className="gap-1">
                                <Radio value="card">
                                    <RadioIndicator className="mr-2"><RadioIcon as={CircleIcon} /></RadioIndicator>
                                    <RadioLabel>Credit/Debit Card</RadioLabel>
                                </Radio>
                                <Radio value="cash">
                                    <RadioIndicator className="mr-2"><RadioIcon as={CircleIcon} /></RadioIndicator>
                                    <RadioLabel>Cash on Delivery</RadioLabel>
                                </Radio>
                            </VStack>
                        </RadioGroup>
                    </Box>

                    <Box className="bg-white p-4 rounded-md">
                        <Heading className="text-md mb-2">3.Order Summary</Heading>

                        {/* Cart Items List */}
                        <VStack className="gap-2 mb-3">
                            {items.map((item) => (
                                <HStack key={item.productId} className="gap-3 pb-2 border-b border-gray-200">
                                    <Image
                                        source={{ uri: item.product?.images[0] }}
                                        alt={item.product?.name}
                                        className="w-16 h-16 rounded-md"
                                        resizeMode="cover"
                                    />
                                    <VStack className="flex-1 gap-1">
                                        <Text className="text-sm font-medium" numberOfLines={2}>
                                            {item.product?.name}
                                        </Text>
                                        <HStack className="justify-between items-center">
                                            <Text className="text-xs text-gray-600">Qty: {item.quantity}</Text>
                                            <Text className="text-sm font-semibold">
                                                ${((item.product?.price || 0) * item.quantity).toFixed(2)}
                                            </Text>
                                        </HStack>
                                    </VStack>
                                </HStack>
                            ))}
                        </VStack>

                        <VStack className="gap-1">
                            <HStack className="justify-between">
                                <Text>Items:</Text>
                                <Text>${totalAmount.toFixed(2)}</Text>
                            </HStack>
                            <HStack className="justify-between">
                                <Text>Shipping:</Text>
                                <Text className="text-green-600">FREE</Text>
                            </HStack>
                            <Divider className="my-2" />
                            <HStack className="justify-between">
                                <Heading className="text-md text-red-600">Order Total:</Heading>
                                <Heading className="text-md text-red-600">${totalAmount.toFixed(2)}</Heading>
                            </HStack>
                        </VStack>

                    </Box>
                    <Box className="bg-white p-4 rounded-md">

                        {isWeb && <CardElement />}
                        <Button
                            className="mt-4 bg-yellow-400"
                            onPress={handlePlaceOrder}
                            isDisabled={loading}
                        >
                            {loading ? (
                                <ButtonText className="text-black">Processing...</ButtonText>
                            ) : (
                                <ButtonText className="text-black">Place Your Order</ButtonText>
                            )}
                        </Button>
                    </Box>

                </VStack>
            </ScrollView>
        </Box>
    );
}

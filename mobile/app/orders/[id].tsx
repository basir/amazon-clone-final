import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Image } from "@/components/ui/image";
import { Divider } from "@/components/ui/divider";
import { Spinner } from "@/components/ui/spinner";
import { Button, ButtonText } from "@/components/ui/button";
import { useLocalSearchParams, router } from 'expo-router';
import { Header } from '../../components';
import { orderAPI } from '../../services/api';
import { Order } from '../../types';

export default function OrderDetailScreen() {
    const { id } = useLocalSearchParams();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await orderAPI.getById(String(id));
                setOrder(response.data);
            } catch (error) {
                console.error('Error fetching order:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [id]);

    if (loading) {
        return (
            <Box className="flex-1 justify-center items-center bg-white">
                <Spinner size="large" className="text-primary-500" />
            </Box>
        );
    }

    if (!order) {
        return (
            <Box className="flex-1 justify-center items-center bg-white">
                <Text>Order not found</Text>
            </Box>
        );
    }

    return (
        <Box className="flex-1 bg-gray-100">
            {/* <Header /> */}
            <ScrollView>
                <VStack className="gap-4 p-4">
                    <Heading className="text-xl">Order Details</Heading>

                    <Box className="bg-white p-4 rounded-md">
                        <VStack className="gap-1">
                            <Text className="text-lg font-bold">Order #{order.orderNumber}</Text>
                            <Text className="text-gray-500">Placed on {new Date(order.createdAt).toLocaleDateString()}</Text>
                            <Divider className="my-2" />
                            <HStack className="justify-between">
                                <Text>Order Total</Text>
                                <Text className="font-bold">${order.totalAmount.toFixed(2)}</Text>
                            </HStack>
                            <HStack className="justify-between">
                                <Text>Status</Text>
                                <Text className="text-green-600 font-bold uppercase">{order.status}</Text>
                            </HStack>
                        </VStack>
                    </Box>

                    <Box className="bg-white p-4 rounded-md">
                        <Heading className="text-md mb-2">Shipping Address</Heading>
                        <Text>{order.shippingAddress.street}</Text>
                        <Text>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</Text>
                        <Text>{order.shippingAddress.country}</Text>
                    </Box>

                    <Box className="bg-white p-4 rounded-md">
                        <Heading className="text-md mb-2">Items</Heading>
                        <VStack className="gap-4">
                            {order.items.map((item, index) => (
                                <VStack key={index}>
                                    <HStack className="gap-4">
                                        <Image
                                            source={{ uri: item.productImage }}
                                            alt={item.productName}
                                            className="h-20 w-20 rounded-sm"
                                            resizeMode="contain"
                                        />
                                        <VStack className="flex-1 justify-center">
                                            <Text className="font-medium" numberOfLines={2}>{item.productName}</Text>
                                            <Text className="text-gray-500">Qty: {item.quantity}</Text>
                                            <Text className="font-bold">${item.price}</Text>
                                        </VStack>
                                    </HStack>
                                    {index < order.items.length - 1 && <Divider className="mt-2" />}
                                </VStack>
                            ))}
                        </VStack>
                    </Box>

                    <Button
                        className="bg-yellow-400 mb-4"
                        onPress={() => router.push('/(tabs)')}
                    >
                        <ButtonText className="text-black">Continue Shopping</ButtonText>
                    </Button>
                </VStack>
            </ScrollView>
        </Box>
    );
}

import React from 'react'
import axios from 'axios'

export const getMyOrders = async (token, userId) => {
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/sweets/user/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching user orders");
        throw error;
    }
}

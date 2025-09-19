import { sweetApi } from '@/lib/api/sweetApi'

// Prefer the consolidated API client to ensure consistent base URL and headers
export const getMyOrders = async (token, userId) => {
    try {
        // Use the existing endpoint for user order history if available
        const data = await sweetApi.getUserOrderHistory(userId, token)
        return data
    } catch (error) {
        // Fallback to legacy purchases endpoint if order history fails
        try {
            const data = await sweetApi.getUserPurchases(userId, token)
            return data
        } catch (innerError) {
            console.error('Error fetching user orders:', innerError?.response?.data || innerError?.message || innerError)
            throw innerError
        }
    }
}

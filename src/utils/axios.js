import axios from "axios";
import axiosRetry from "axios-retry";

export const createHttpClient = (config = {}) => {
    const client = axios.create(config);
    axiosRetry(client, {
        retries: 3,
        retryDelay: axiosRetry.exponentialDelay,
        retryCondition: (error) => error.response?.status === 429 || axiosRetry.isNetworkOrIdempotentRequestError(error)
    });
    return client;
};
import axios from "axios";
import { userListSchema } from "./schema.js";
import Cookies from "js-cookie";

// Updated fetchUsers function to accept pagination parameters
export const fetchUsers = async (page = 1, limit = 10) => {
  try {
    const token = Cookies.get("access_token");
    if (!token) {
      throw new Error("No authentication token found.");
    }
    const response = await axios.get(import.meta.env.VITE_USERS_API_ROUTE, {
      params: {
        page,
        limit,
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data.status === "success") {
      const rawUsers = response.data.data.data.map((user) => ({
        id: user.id.toString(),
        firstName: user.first_name,
        lastName: user.last_name,
        username: user.username.toLowerCase(),
        email: user.email.toLowerCase(),
        phoneNumber: user.phone,
        status: user.status,
        role: user.role,
        createdAt: new Date(user.created_at || Date.now()),
        updatedAt: new Date(user.updated_at || Date.now()),
      }));

      const validationResult = userListSchema.safeParse(rawUsers);

      if (!validationResult.success) {
        console.error("User data validation failed:", validationResult.error);
        return {
          users: [],
          total: 0,
          page,
          limit,
        };
      }

      return {
        users: validationResult.data,
        total: response.data.data.meta.total || 0,
        page: response.data.data.meta.page || page,
        limit: response.data.data.meta.limit || limit,
      };
    }

    console.warn("No successful response from users API");
    return {
      users: [],
      total: 0,
      page,
      limit,
    };
  } catch (error) {
    console.error("Error fetching users:", error);
    return {
      users: [],
      total: 0,
      page,
      limit,
    };
  }
};
// Updated initialization to potentially accept pagination
export const initializeUsers = async (page, limit) => {
  return await fetchUsers(page, limit);
};

// Fallback for SSR or static generation
export const users = [];

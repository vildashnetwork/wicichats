// import { create } from "zustand";
// import axiosInstance from "../lib/axios";
// import toast from "react-hot-toast";
// import { io } from "socket.io-client";

// const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:4000" : "/";

// export const useAuthStore = create((set, get) => ({
//   authUser: null,
//   isSigningUp: false,
//   isLoggingIn: false,
//   isUpdatingProfile: false,
//   onlineUsers: [],
//   socket: null,

//   isCheckingAuth: true,

//   // checkAuth: async () => {
//   //   try {
//   //     const res = await axiosInstance.get("/auth/check");
//   //     set({ authUser: res.data });
//   //     get().connectSocket();
//   //   } catch (error) {
//   //     console.log("Error in checkAuth", error);
//   //     set({ authUser: null });
//   //   } finally {
//   //     set({ isCheckingAuth: false });
//   //   }
//   // },


//   checkAuth: async () => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       set({ authUser: null, isCheckingAuth: false });
//       return;
//     }

//     try {
//       const res = await axiosInstance.get("/auth/check"); // token is automatically sent
//       set({ authUser: res.data });
//       get().connectSocket();
//     } catch (error) {
//       console.log("Error in checkAuth", error);
//       set({ authUser: null });
//     } finally {
//       set({ isCheckingAuth: false });
//     }
//   },

//   // signup: async (data) => {
//   //   set({ isSigningUp: true });
//   //   try {
//   //     const res = await axiosInstance.post("/auth/signup", data);
//   //     set({ authUser: res.data });
//   //     toast.success("Account created successfully");
//   //     get().connectSocket();
//   //   } catch (error) {
//   //     toast.error(error.response.data.message);
//   //   } finally {
//   //     set({ isSigningUp: false });
//   //   }
//   // },

//   // login: async (data) => {
//   //   set({ isLoggingIn: true });
//   //   try {
//   //     const res = await axiosInstance.post("/auth/login", data);
//   //     set({ authUser: res.data });
//   //     toast.success("Logged in successfully");
//   //     get().connectSocket();
//   //   } catch (error) {
//   //     toast.error(error.response.data.message);
//   //   } finally {
//   //     set({ isLoggingIn: false });
//   //   }
//   // },
//   login: async (data) => {
//     set({ isLoggingIn: true });
//     try {
//       const res = await axiosInstance.post("/auth/login", data);
//       set({ authUser: res.data.user }); // assuming res.data.user has user info
//       localStorage.setItem("token", res.data.token); // save JWT
//       toast.success("Logged in successfully");
//       get().connectSocket();
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Login failed");
//     } finally {
//       set({ isLoggingIn: false });
//     }
//   },

//   signup: async (data) => {
//     set({ isSigningUp: true });
//     try {
//       const res = await axiosInstance.post("/auth/signup", data);
//       set({ authUser: res.data.user });
//       localStorage.setItem("token", res.data.token);
//       toast.success("Account created successfully");
//       get().connectSocket();
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Signup failed");
//     } finally {
//       set({ isSigningUp: false });
//     }
//   },

//   logout: async () => {
//     try {
//       await axiosInstance.post("/auth/logout");
//       set({ authUser: null });
//       toast.success("Logged out successfully");
//       get().disconnectSocket();
//     } catch (error) {
//       toast.error(error.response.data.message);
//     }
//   },

//   updateProfile: async (data) => {
//     set({ isUpdatingProfile: true });
//     try {
//       const res = await axiosInstance.put("/auth/update-profile", data);

//       if (res.data) {
//         set({ authUser: res.data });
//         toast.success("Profile updated successfully");
//       } else {
//         toast.error("Failed to update profile");
//       }
//     } catch (error) {
//       if (
//         error.response &&
//         error.response.data &&
//         error.response.data.message
//       ) {
//         toast.error(error.response.data.message);
//       } else {
//         toast.error("An unexpected error occurred");
//       }
//     } finally {
//       set({ isUpdatingProfile: false });
//     }
//   },

//   connectSocket: () => {
//     const { authUser } = get();
//     if (!authUser || get().socket?.connected) return;

//     const socket = io(BASE_URL, {
//       query: { userId: authUser._id },
//     });
//     socket.connect();
//     set({ socket: socket });

//     socket.on("getOnlineUsers", (userIds) => {
//       set({ onlineUsers: userIds });
//     });
//   },

//   disconnectSocket: () => {
//     if (get().socket?.connected) get().socket.disconnect();
//   },
// }));






// src/store/useAuthStore.js
import { create } from "zustand";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:4000" : "/";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  onlineUsers: [],
  socket: null,
  isCheckingAuth: true,

  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const res = await axiosInstance.get("/auth/check", {
        headers: { Authorization: `Bearer ${token}` },
      });

      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      console.log("Error in checkAuth", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },


  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      localStorage.setItem("token", res.data.token);
      toast.success("Logged in successfully");
      get().connectSocket();
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      localStorage.removeItem("token");
      toast.success("Logged out successfully");
      get().disconnectSocket();
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  },



  // signup: async (data) => {
  //   set({ isSigningUp: true });
  //   try {
  //     const res = await axiosInstance.post("/auth/signup", data);
  //     set({ authUser: res.data });
  //     localStorage.setItem("token", res.data.token);
  //     toast.success("Account created successfully");
  //     get().connectSocket();
  //   } catch (error) {
  //     toast.error(error.response?.data?.message || "Signup failed");
  //   } finally {
  //     set({ isSigningUp: false });
  //   }
  // },

  // login: async (data) => {
  //   set({ isLoggingIn: true });
  //   try {
  //     const res = await axiosInstance.post("/auth/login", data);
  //     set({ authUser: res.data });
  //     localStorage.setItem("token", res.data.token);
  //     toast.success("Logged in successfully");
  //     get().connectSocket();
  //   } catch (error) {
  //     toast.error(error.response?.data?.message || "Login failed");
  //   } finally {
  //     set({ isLoggingIn: false });
  //   }
  // },

  // logout: async () => {
  //   try {
  //     await axiosInstance.post("/auth/logout");
  //     set({ authUser: null });
  //     localStorage.removeItem("token");
  //     toast.success("Logged out successfully");
  //     get().disconnectSocket();
  //   } catch (error) {
  //     toast.error(error.response?.data?.message || "Logout failed");
  //   }
  // },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      if (res.data) {
        set({ authUser: res.data });
        toast.success("Profile updated successfully");
      } else {
        toast.error("Failed to update profile");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An unexpected error occurred");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      query: { userId: authUser._id },
    });

    socket.connect();
    set({ socket });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },

  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },
}));

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import apiRequest from '../api/api'

export const useStore = create(
  persist(
    (set, get) => ({
      // Auth State
      user: null,
      token: null,
      
      login: async (email, password) => {
        const data = await apiRequest('/auth/login', 'POST', { email, password });
        set({ user: data.user, token: data.access_token });
        return data;
      },
      
      register: async (email, password) => {
        return await apiRequest('/auth/register', 'POST', { email, password });
      },
      
      logout: () => set({ user: null, token: null, cart: [] }),

      // Product State (Cache for Frontend)
      products: [],
      fetchProducts: async () => {
        const data = await apiRequest('/products');
        set({ products: data });
      },

      addProduct: async (productData) => {
        const token = get().token;
        const newProduct = await apiRequest('/products', 'POST', productData, token);
        set((state) => ({ products: [...state.products, newProduct] }));
      },

      removeStoreProduct: async (productId) => {
        const token = get().token;
        await apiRequest(`/products/${productId}`, 'DELETE', null, token);
        set((state) => ({ products: state.products.filter(p => p.id !== productId) }));
      },

      updateStoreProduct: async (productId, updateData) => {
        const token = get().token;
        const updated = await apiRequest(`/products/${productId}`, 'PATCH', updateData, token);
        set((state) => ({
          products: state.products.map(p => p.id === productId ? updated : p)
        }));
      },

      // Cart State
      cart: [],
      addToCart: (product) => {
        const cart = get().cart;
        const item = cart.find((i) => i.id === product.id);
        if (item) {
          set({
            cart: cart.map((i) =>
              i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
            ),
          });
        } else {
          set({ cart: [...cart, { ...product, quantity: 1 }] });
        }
      },
      removeFromCart: (productId) =>
        set({ cart: get().cart.filter((i) => i.id !== productId) }),
      updateQuantity: (productId, quantity) => {
        if (quantity < 1) return;
        set({
          cart: get().cart.map((i) =>
            i.id === productId ? { ...i, quantity } : i
          ),
        });
      },
      clearCart: () => set({ cart: [] }),
      
      cartTotal: () => {
        return get().cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },

      // Order State
      orders: [],
      fetchOrders: async () => {
        const token = get().token;
        const data = await apiRequest('/orders', 'GET', null, token);
        set({ orders: data });
      },

      placeOrder: async () => {
        const { cart, token, user, clearCart } = get();
        if (!user || cart.length === 0) return;

        const items = cart.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price
        }));

        const order = await apiRequest('/orders', 'POST', { items }, token);
        clearCart();
        return order;
      }
    }),
    {
      name: 'elite-clothier-storage',
    }
  )
)

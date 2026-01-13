import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Vendor chunks
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'react-vendor';
            }
            if (id.includes('@radix-ui')) {
              return 'ui-vendor';
            }
            if (id.includes('@tanstack/react-query')) {
              return 'query-vendor';
            }
            if (id.includes('react-hook-form') || id.includes('@hookform')) {
              return 'form-vendor';
            }
            // Other node_modules
            return 'vendor';
          }
          // Admin pages (large dashboard)
          if (id.includes('/admin/')) {
            return 'admin';
          }
          // Auth pages
          if (id.includes('/SignIn') || id.includes('/SignUp') || id.includes('/AuthCallback')) {
            return 'auth';
          }
          // Product pages
          if (id.includes('/ProductDetail') || id.includes('/AllProducts') || id.includes('/AllCategories')) {
            return 'products';
          }
          // Checkout flow
          if (id.includes('/Cart') || id.includes('/Checkout') || id.includes('/OrderConfirmation')) {
            return 'checkout';
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000, // Increase limit to 1MB for better chunking
  },
}));

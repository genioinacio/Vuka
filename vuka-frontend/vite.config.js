import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { fileURLToPath } from 'url'

// Como você está usando módulos ES, definimos o __dirname manualmente
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // O "@" agora aponta diretamente para a pasta src
      "@": path.resolve(__dirname, "./src"),
    },
    // Isso ajuda o Vite a encontrar arquivos .jsx e .js sem você precisar digitar a extensão
    extensions: ['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json']
  },
  // Otimização para evitar erros de cache durante o desenvolvimento
  optimizeDeps: {
    force: true 
  }
})
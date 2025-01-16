# Gunakan image Node.js sebagai base image untuk membangun aplikasi
FROM node:18 AS build

# Set direktori kerja
WORKDIR /app

# Salin file package.json dan package-lock.json (atau yarn.lock) ke dalam container
COPY package*.json ./

# Install dependencies
RUN npm install

# Salin semua file proyek ke dalam container
COPY . .

# Bangun aplikasi Vue.js
RUN npm install -g serve

# Gunakan image Nginx untuk menjalankan aplikasi
FROM node:18

# Salin hasil build dari tahap sebelumnya ke direktori yang sesuai pada Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 8080
EXPOSE 8080

# Jalankan Nginx untuk melayani aplikasi
CMD ["serve", "-s", ".", "--listen", "8080"]

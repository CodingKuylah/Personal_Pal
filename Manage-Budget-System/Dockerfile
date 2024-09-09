# Menggunakan Bun sebagai base image
FROM oven/bun:latest

# Set working directory
WORKDIR /app

# Menyalin file package.json dan bun.lockb
COPY package.json bun.lockb ./

# Menginstal dependencies
RUN bun install

# Menyalin sisa aplikasi
COPY . .

# Menjalankan aplikasi
CMD ["bun", "run", "start"]

FROM node:18

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

RUN npm run build

# Install serve globally
RUN npm install -g serve

EXPOSE 3000

# Use serve to serve the build directory
CMD ["serve", "-s", "dist", "-l", "3000"]
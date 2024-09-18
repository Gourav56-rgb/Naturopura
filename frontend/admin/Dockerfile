# Stage 1: Build the application
FROM node:16.17.0-bullseye-slim AS dev

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Next.js application
CMD npm run dev
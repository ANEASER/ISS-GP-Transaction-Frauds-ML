# Stage 1: Build the React frontend
FROM node:20.11.0-alpine AS frontend-builder
WORKDIR /app/frontend

# Copy package.json and package-lock.json first to leverage Docker caching
COPY ./package.json ./package-lock.json ./
RUN npm install

# Copy the rest of the frontend code and build the React app
COPY . .
RUN npm run build

# Stage 2: Create the final image with Node.js
FROM node:20.11.0
WORKDIR /app

# Copy the built React app from the frontend builder stage
COPY --from=frontend-builder /app/frontend/build /app/frontend/build

# Expose the port on which the Node.js server will run
EXPOSE 3000

# Install 'serve' globally to serve static files
RUN npm install -g serve

# Command to serve the static files using 'serve'
CMD ["serve", "-s", "frontend/build", "-l", "3000"]

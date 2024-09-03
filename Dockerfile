# Stage 1: Build the angular app
FROM node:18-alpine AS build

WORKDIR /app

# Copy package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Angular app in production mode
RUN npm run build --prod

# Stage 2: Serve the angular app using nginx
FROM nginx:alpine

# Copy the build output to the nginx html directory
COPY --from=build /app/dist/apartment_app/browser /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

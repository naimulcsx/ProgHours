FROM node:20.16.0-alpine

# Set working directory
WORKDIR /app

# Copy build files
COPY . .

# Install production dependencies only
RUN npm install

# Expose port from environment variable with fallback
EXPOSE 3380

# Start the server
CMD ["node", "server.js"]
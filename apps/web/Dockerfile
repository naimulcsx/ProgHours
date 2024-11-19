FROM node:20.16.0-alpine

# Set working directory
WORKDIR /app

# Copy build files
COPY build/client ./client
COPY build/server ./server

# Create server.js file
RUN echo "import { createRequestHandler } from '@remix-run/express'; \
import express from 'express'; \
import * as build from './server/index.js'; \
\
const app = express(); \
const port = process.env.PORT || 3380; \
\
app.use(express.static('./client')); \
\
app.all( \
  '*', \
  createRequestHandler({ \
    build, \
  }), \
); \
\
app.listen(port, () => { \
  console.log(\`Server is running on port \${port}\`); \
});" > server.js

# Copy package files
COPY build/server/package.json ./

# Install production dependencies only
RUN npm install

# Expose port from environment variable with fallback
EXPOSE 3380

# Start the server
CMD ["node", "server.js"]
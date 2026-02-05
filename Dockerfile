FROM node:18-slim

WORKDIR /app

# Copy backend files
COPY backend/package*.json ./backend/
RUN cd backend && npm install

# Copy .env file if it exists
COPY backend/.env* ./backend/ 2>/dev/null || true

# Copy all backend files
COPY backend/index.js ./backend/

EXPOSE 3000

CMD ["node", "backend/index.js"]

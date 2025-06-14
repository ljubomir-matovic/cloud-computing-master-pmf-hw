FROM node:18

# Set the working directory
WORKDIR /app/express


# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Define environment variables
ENV PORT=80

# Expose the port the app runs on
EXPOSE $PORT

# Start the application
CMD ["npm", "start"]
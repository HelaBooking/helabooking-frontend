# STAGE 1: Build the React Application #################################
FROM node:lts-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# This usually creates a 'dist' folder (Vite) or 'build' folder (CRA)
RUN npm run build

# STAGE 2: Serve with Nginx ########################################
FROM nginx:alpine
WORKDIR /usr/share/nginx/html
# Remove default Nginx static assets
RUN rm -rf ./*
# NOTE: Change '/app/dist' to '/app/build' if you are using Create React App
COPY --from=build /app/dist .
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY env.sh /docker-entrypoint.d/env.sh
RUN chmod +x /docker-entrypoint.d/env.sh

EXPOSE 80
ENTRYPOINT ["/docker-entrypoint.d/env.sh"]
CMD ["nginx", "-g", "daemon off;"]
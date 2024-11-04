# Choose node version which source  is running on docker image 
FROM node:18

# Create new folder that contain the source code on docker image
WORKDIR /usr/src/app

# Copy all file and folder in source code exclude the files in dockerignore file 
COPY . . 

# Run command install library from the package.json file on docker image
RUN npm install 

#Exposing the containers port and mapping local machine port to the container port
EXPOSE 3500

# Run command start source code in development mode 
CMD ["npm", "run", "start:dev"] 


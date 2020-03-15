## UserHobbies app
  This project is small backend app to manage Users and User's Hobbies. This program made by Node.js with express and using mongodb with mongoose.
  
## Project Information

  ### Tech stack
    * Nodejs with Typescript, MongoDB with mongoose, Test with Mocha
    
  ### Tech details
    * Nodejs with Typescript
    * Express framework
    * There are 2 different Mongo collections: User {id, name, gobbies}, Hobbies{id, passionLevel, name, year}
    * Hobbies are not embedded in the User Schema (used Mongo refs)
    * Endpoints are CRUD of users and hobbies.
    * Swagger used
    * Unit test by Mocha

  ### Requirements
    * Node 12
    * MongoDB 4.2
    
  ### Common setup
  
  Clone the repo and install the dependencies.
  
  ```bash
  git clone https://github.com/Holybag/UserHobbies.git
  cd UserHobbies
  ```
  
  ```bash
  npm install
  ```
  
  ### How to run development
  
  To start the development server, run the following

  ```bash
  npm run dev
  ```

  ### How to build typescript
  
  To build the development, run the following

  ```bash
  tsc
  ```
  
  ### How to run
  
  To start the express server, run the following

  ```bash
  npm run start
  ```


  Open [http://localhost:3000](http://localhost:3000) and take a look around.



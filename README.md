# CRUD API

Task is https://github.com/AlreadyBored/nodejs-assignments/blob/main/assignments/crud-api/assignment.md

[![Product Name Screen Shot][product-screenshot]](https://user-images.githubusercontent.com/9417113/212694133-8ac38514-0aa7-4f86-981d-b62f99c4515d.png)

## How to install
1. Clone the repo
```sh
git clone https://github.com/Nevmerzhitskaya/nodejs-task4
```

2. Install NPM packages
```sh
npm install
```

3. Create .env file, where you should insert PORT=port_number. You can use .env.example as example.

## How to run

Run the application in develop mode 
```sh
npm run start:dev
```

Run the application in production mode 
```sh
npm run start:prod
```

Run the application in test mode 
```sh
npm run test
```

## API

1. Implemented endpoint `api/users`:

- **GET** `api/users` is used to get all persons
- **GET** `api/users/{userId}` is used to get user by id
- **POST** `api/users` is used to create record about new user and store it in database
- **PUT** `api/users/{userId}` is used to update existing user
- **DELETE** `api/users/{userId}` is used to delete existing user from database

2. Users are stored as `objects` that have following properties:
    - `id` — unique identifier (`string`, `uuid`) generated on server side
    - `username` — user's name (`string`, **required**)
    - `age` — user's age (`number`, **required**)
    - `hobbies` — user's hobbies (`array` of `strings` or empty `array`, **required**)


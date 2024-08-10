frontend - cd frontend/workwise && npm i && npm run dev
backend - cd backend && npm i && npx prisma generate &&  node src/server.js
## Authentication
- **JWT Token Required:** All routes except `/login` and `/signup` require the user to be authenticated using a JWT token.
- **Header Format:** `Authorization: Bearer <token>`

---

## User Routes

### 1. Sign Up
- **Endpoint:** `POST /`
- **Description:** Register a new user.
- **Request Body:**
  ```json
  {
    "username": "string",
    "password": "string",
    "email": "string"
  }
Response:
json
Copy code
{
  "message": "User registered successfully",
  "user": {
    "id": "string",
    "username": "string",
    "email": "string"
  }
}
2. Login
Endpoint: POST /login
Description: Authenticate a user and return a JWT token.
Request Body:
json
Copy code
{
  "username": "string",
  "password": "string"
}
Response:
json
Copy code
{
  "message": "Login successful",
  "token": "JWT token"
}
3. Get User Details
Endpoint: GET /
Description: Retrieve the authenticated user's details.
Headers: Authorization: Bearer <token>
Response:
json
Copy code
{
  "user": {
    "id": "string",
    "username": "string",
    "email": "string"
  }
}
Product Routes
1. Get All Products
Endpoint: GET /products
Description: Retrieve a list of all products.
Headers: Authorization: Bearer <token>
Response:
json
Copy code
[
  {
    "id": "string",
    "name": "string",
    "description": "string",
    "price": "number",
    "discount": "number"
  }
]
2. Get a Single Product
Endpoint: GET /product
Description: Retrieve details of a single product.
Headers: Authorization: Bearer <token>
Response:
json
Copy code
{
  "id": "string",
  "name": "string",
  "description": "string",
  "price": "number",
  "discount": "number"
}
3. Add a New Product
Endpoint: POST /product
Description: Add a new product.
Headers: Authorization: Bearer <token>
Request Body:
json
Copy code
{
  "name": "string",
  "description": "string",
  "price": "number",
  "discount": "number" // Optional
}
Response:
json
Copy code
{
  "message": "Product added successfully",
  "product": {
    "id": "string",
    "name": "string",
    "description": "string",
    "price": "number",
    "discount": "number"
  }
}
4. Edit a Product
Endpoint: PUT /product/:id
Description: Edit the details of an existing product.
Headers: Authorization: Bearer <token>
Request Body:
json
Copy code
{
  "name": "string",
  "description": "string",
  "price": "number",
  "discount": "number" // Optional
}
Response:
json
Copy code
{
  "message": "Product updated successfully",
  "product": {
    "id": "string",
    "name": "string",
    "description": "string",
    "price": "number",
    "discount": "number"
  }
}
5. Delete a Product
Endpoint: DELETE /product/:id
Description: Delete a product by its ID.
Headers: Authorization: Bearer <token>
Response:
json
Copy code
{
  "message": "Product deleted successfully"
}
Cart Routes
1. Add Product to Cart
Endpoint: POST /cart
Description: Add a product to the user's cart.
Headers: Authorization: Bearer <token>
Request Body:
json
Copy code
{
  "product_id": "string",
  "quantity": "number"
}
Response:
json
Copy code
{
  "message": "Product added to cart",
  "cartItem": {
    "product": {
      "id": "string",
      "name": "string",
      "price": "number"
    },
    "quantity": "number"
  }
}
2. Get Cart Items
Endpoint: GET /cart
Description: Retrieve all items in the user's cart.
Headers: Authorization: Bearer <token>
Response:
json
Copy code
[
  {
    "product": {
      "id": "string",
      "name": "string",
      "price": "number"
    },
    "quantity": "number"
  }
]
3. Remove Product from Cart
Endpoint: DELETE /cart
Description: Remove a product from the user's cart.
Headers: Authorization: Bearer <token>
Request Body:
json
Copy code
{
  "product_id": "string"
}
Response:
json
Copy code
{
  "message": "Product removed from cart"
}
Notes
All POST, PUT, and DELETE requests must include the Content-Type: application/json header to indicate that the request body is in JSON format.
Error Handling: Handle possible errors such as invalid tokens, missing fields, and other issues on both the server and client sides.
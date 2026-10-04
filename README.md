\# ShopNow 🛒



ShopNow is a full-stack online shopping application built with React, Spring Boot, and PostgreSQL.



It allows customers to browse products, manage their cart and wishlist, place orders, track orders, and manage their accounts. Admins can manage products, users, orders, and stock.



\## Features



\### Customer



\* Register and login

\* Browse and search products

\* Filter products by category

\* View product details

\* Add products to cart

\* Manage wishlist

\* Checkout and place orders

\* View order confirmation

\* View and track orders

\* Cancel pending orders

\* Write product reviews and ratings

\* Edit profile

\* Change password

\* Logout



\### Admin



\* Admin login

\* Dashboard

\* Add, edit, and delete products

\* Manage product stock

\* View and manage orders

\* Update order status

\* Manage users

\* Search and filter users

\* Add, edit, and delete customers



\## Technologies



\### Frontend



\* React

\* JavaScript

\* React Router

\* Vite

\* CSS

\* Context API



\### Backend



\* Java

\* Spring Boot

\* Spring Security

\* Spring Data JPA

\* Hibernate

\* JWT

\* BCrypt

\* Maven



\### Database



\* PostgreSQL



\## Project Structure



```text

shopnow/

├── backend/

│   ├── src/

│   └── pom.xml

│

├── frontend/

│   ├── src/

│   ├── public/

│   └── package.json

│

├── .gitignore

└── README.md

```



\## How to Run



\### 1. Clone the project



```bash

git clone https://github.com/osman-zaila/shopnow.git

cd shopnow

```



\### 2. Setup Database



Create a PostgreSQL database named:



```text

online\_shopping

```



Configure your local database password using an environment variable.



\### 3. Run Backend



Open a terminal inside the `backend` folder:



```bash

.\\mvnw.cmd spring-boot:run

```



Backend:



```text

http://localhost:8080

```



\### 4. Run Frontend



Open another terminal inside the `frontend` folder:



```bash

npm install

npm run dev

```



Frontend:



```text

http://localhost:5179

```



\## Security



ShopNow uses:



\* JWT authentication

\* Role-based access control

\* BCrypt password hashing

\* Protected customer routes

\* Protected admin routes



Database passwords and other private credentials are kept out of GitHub.



\## Responsive Design



ShopNow is designed to work on:



\* Desktop

\* Tablet

\* Mobile



\## Project Status



\*\*Completed ✅\*\*



The main customer and admin e-commerce features are implemented and tested.



\## Future Improvements



\* Online payment integration

\* Product image upload

\* Email notifications

\* Password reset

\* Advanced analytics

\* Deployment



\## Author



\*\*Osman Zaila\*\*



GitHub: https://github.com/osman-zaila




# AltSzama - Product Requirements Document

## 1. Introduction

Altszama is a web application designed to simplify the process of ordering food at the workplace, especially when done regularly.
It allows users to make one shared order together, simplifies the process of making an order via phone by grouping the same dishes 
together, and later helps with tracking the payments and balance between the group.

## 2. Functional Requirements

### 2.1. Authentication

*   Users must be able to log in to the application using their Google account.
*   The application must be able to handle authentication for multiple teams.

### 2.2. Restaurants

*   Users must be able to create, view, edit, and delete restaurants.
*   Each restaurant must have a name and an optional address and phone number.

### 2.3. Dishes

*   Users must be able to add, edit, and delete dishes for each restaurant.
*   Each dish must have a name, a price, and an optional description.

### 2.4. Orders

*   Users must be able to create, view, edit, and delete orders. The user who created the order effectively becomes the Order Creator.
*   Each order must be associated with a restaurant and a team.
*   Order Creator must be able to change the state of an order to "ordering", "ordered", "delivered", or "rejected".
*   Order Creator must be able to include the information about the time and date of the order.
*   Order Creator must be able to include the information about potential discounts as well as additional payments, 
    such as packaging fee per each person or delivery fee per whole order, that should later split between the participants.
*   Order Creator must be able to include the information on how they can be paid back. The permitted options are cash, bank transfer (bank account number is required), or BLIK transfer (telephone number is required). Multiple payment types can be allowed for a single order.

### 2.5. Order Entries

*   Users must be able to add, edit, and remove their own entries from an order.
*   Each order entry must be associated with a dish and optionally a number of side dishes that comes with a dish (e.g. a burger with a salad).
*   Order entries cannot be added or modified after the state of the order has changed from "created" to "ordering", "ordered", "delivered", or "rejected".
*   Once the order is ordered, users must be able to mark their order entries as paid.

### 2.6. Balance

*   Users must be able to view their current balance, based on both orders they created and made, and orders they just participated in.

## 3. Assumptions and Dependencies

### 3.1. Assumptions

*   Users will have a Google account.
*   Users will have a modern web browser with JavaScript enabled.

### 3.2. Dependencies

*   The application depends on the Google authentication service for user authentication.

## 4. User Journeys

### 4.1. Authentication

**4.1.1. User logs in with Google**

*   **Frontend Route:** `/login`
*   **Backend API:** `POST /api/auth/googleLogin/authorizationCode`
*   **Description:** User navigates to the login page, clicks the "Login with Google" button, authenticates with Google, and is then redirected back to the application, logged in.

### 4.2. Restaurants

**4.2.1. User views the list of restaurants**

*   **Frontend Route:** `/restaurants`
*   **Backend API:** `GET /api/restaurants.json`
*   **Description:** User navigates to the "Restaurants" page, where a list of all restaurants is displayed.

**4.2.2. User creates a new restaurant**

*   **Frontend Route:** `/restaurants/create`
*   **Backend API:** `POST /api/restaurants/save`
*   **Description:** User navigates to the "Restaurants" page, clicks "Create Restaurant", fills out the restaurant details form, and clicks "Save". The new restaurant is created, and the user is redirected to the restaurant list.

**4.2.3. User views a restaurant's details**

*   **Frontend Route:** `/restaurants/:id`
*   **Backend API:** `GET /api/restaurants/{restaurantId}/show.json`
*   **Description:** User navigates to the "Restaurants" page, clicks on a restaurant, and is taken to a page displaying the restaurant's details, including its dishes.

**4.2.4. User edits a restaurant**

*   **Frontend Route:** `/restaurants/:id` (The edit form is on the show page)
*   **Backend API:** `PUT /api/restaurants/update`
*   **Description:** User navigates to a restaurant's details page, clicks "Edit", updates the restaurant details in the form, and clicks "Save". The restaurant is updated, and the user is redirected to the restaurant's details page.

**4.2.5. User deletes a restaurant**

*   **Frontend Route:** `/restaurants/:id`
*   **Backend API:** `DELETE /api/restaurants/{restaurantId}/delete`
*   **Description:** User navigates to a restaurant's details page, clicks "Delete". The restaurant is deleted, and the user is redirected to the restaurant list.

### 4.3. Dishes

**4.3.1. User adds a new dish to a restaurant**

*   **Frontend Route:** `/restaurants/:id` (The add dish form is on the show page)
*   **Backend API:** `POST /api/restaurants/{restaurantId}/dishes/save`
*   **Description:** User navigates to a restaurant's details page, clicks "Add Dish", fills out the dish details form, and clicks "Save". The new dish is added to the restaurant, and the user is redirected to the restaurant's details page.

**4.3.2. User edits a dish**

*   **Frontend Route:** `/restaurants/:id` (The edit form is on the show page)
*   **Backend API:** `PUT /api/restaurants/{restaurantId}/dishes/update`
*   **Description:** User navigates to a restaurant's details page, clicks "Edit" next to a dish, updates the dish details in the form, and clicks "Save". The dish is updated, and the user is redirected to the restaurant's details page.

**4.3.3. User deletes a dish**

*   **Frontend Route:** `/restaurants/:id`
*   **Backend API:** `DELETE /api/dishes/{dishId}/delete`
*   **Description:** User navigates to a restaurant's details page and clicks the "Delete" button next to a dish. The dish is deleted from the restaurant.

### 4.4. Orders

**4.4.1. User views today's orders**

*   **Frontend Route:** `/orders/today`
*   **Backend API:** `GET /api/orders/today.json`
*   **Description:** User navigates to the "Today's Orders" page, where a list of all orders for the current day is displayed.

**4.4.2. User views all orders**

*   **Frontend Route:** `/orders/all`
*   **Backend API:** `GET /api/orders/all.json`
*   **Description:** User navigates to the "All Orders" page, where a list of all orders is displayed.

**4.4.3. User creates a new order**

*   **Frontend Route:** `/orders/create`
*   **Backend API:** `POST /api/orders/save`
*   **Description:** User navigates to the "Today's Orders" page, clicks "Create Order", selects a restaurant in the form, and clicks "Save". The new order is created, and the user is redirected to the order's details page. As a creator, the user can provide information about discounts, additional payments, and how they can be paid back.

**4.4.4. User views an order's details**

*   **Frontend Route:** `/orders/:id/show`
*   **Backend API:** `GET /api/orders/{orderId}/show.json`
*   **Description:** User navigates to an order's details page, where the details of the order are displayed, including a list of order entries.

**4.4.5. User edits an order**

*   **Frontend Route:** `/orders/:id/edit`
*   **Backend API:** `PUT /api/orders/update`
*   **Description:** User navigates to an order's details page, clicks "Edit", updates the order details in the form, and clicks "Save". The order is updated, and the user is redirected to the order's details page. As a creator, the user can update information about discounts, additional payments, and how they can be paid back.

**4.4.6. User deletes an order**

*   **Frontend Route:** `/orders/:id/show`
*   **Backend API:** `DELETE /api/orders/{orderId}/delete`
*   **Description:** User navigates to an order's details page, clicks "Delete". The order is deleted, and the user is redirected to the today's orders page.

**4.4.7. User changes the state of an order**

*   **Frontend Route:** `/orders/:id/show`
*   **Backend APIs:**
    *   `PUT /api/orders/{orderId}/set_as_created`
    *   `PUT /api/orders/{orderId}/set_as_ordering`
    *   `PUT /api/orders/{orderId}/set_as_ordered`
    *   `PUT /api/orders/{orderId}/set_as_delivered`
    *   `PUT /api/orders/{orderId}/set_as_rejected`
*   **Description:** User navigates to an order's details page and can change the state of the order to "ordering", "ordered", "delivered", or "rejected".

### 4.5. Order Entries

**4.5.1. User adds an entry to an order**

*   **Frontend Route:** `/orders/:id/make_an_order`
*   **Backend API:** `POST /api/order_entries/save`
*   **Description:** User navigates to an order's details page and selects a dish from the restaurant's menu. The dish is added as an entry to the order. The user can also specify side dishes.

**4.5.2. User edits an order entry**

*   **Frontend Route:** `/orders/:id/make_an_order`
*   **Backend API:** `PUT /api/order_entries/update`
*   **Description:** User navigates to an order's details page and can edit the details of their order entry, including the side dishes.

**4.5.3. User removes an entry from an order**

*   **Frontend Route:** `/orders/:id/make_an_order`
*   **Backend API:** `DELETE /api/order_entries/{orderEntryId}/dish_entry/{dishEntryId}/delete`
*   **Description:** User navigates to an order's details page and can remove their entry from a given order.

**4.5.4. User marks an order entry as paid**

*   **Frontend Route:** `/orders/:id/show`
*   **Backend APIs:**
    *   `PUT /api/order_entries/{orderEntryId}/confirm_as_paid`
    *   `PUT /api/order_entries/{orderEntryId}/revert_to_unpaid`
*   **Description:** User navigates to an order's details page and can mark their order entry as paid.

### 4.6. Balance

**4.6.1. User views their balance**

*   **Frontend Route:** `/balance`
*   **Backend API:** (No direct API endpoint, balance is calculated from orders)
*   **Description:** User navigates to the "Balance" page, where the user's current balance is displayed, along with a history of their transactions.

### 5. Non-Functional Requirements

**5.1. Framework**

* The application is built using Angular, using the latest version of Angular and Angular Material 3 design framework. All design elements must be based on Material Design 3 guidelines.
* The application is built using TypeScript.

**5.2. Design**

* The design must be responsive, allowing for both desktop and mobile devices.
* The design of the application must look like a professional-looking web application, but using a minimalist approach to it.

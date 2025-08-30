# Challenge

# 😈 Application Overview

## Infrastructure Diagram

<img width="881" height="546" alt="app overview drawio" src="https://github.com/user-attachments/assets/19dc16d7-00f9-426e-9ee6-2ddf0a8ef211" />

## Update Order Flow Diagram

<img width="1441" height="541" alt="flowdiagram drawio" src="https://github.com/user-attachments/assets/e86427b2-5b46-4c67-aab7-5839b8a5d0c6" />

## Frontend Views

### Main Dashboard

<img width="3014" height="1644" alt="dashboard" src="https://github.com/user-attachments/assets/477f5956-ef48-4efb-95d7-a4541aea6913" />

Redirections:

- “Order Dashboard” button: redirects to the /orders view.
- “Robot Manager” button: redirects to the /robots view.

### Orders Dashboard

<img width="3014" height="1644" alt="ordersdashboard" src="https://github.com/user-attachments/assets/6d24db78-6085-44ff-895c-95b35dedff88" />

Redirections:

- “← Go to main dashboard”: redirects to the / view.
- “Go to robots →”: redirects to the /robots view.

Functionalities:

- List the existing orders.
- Assign a robot to a specific order.
- Update the status of a specific order.
- Filter orders by: client, restaurant, status and robot.

### Robots Dashboard

<img width="3014" height="1644" alt="robotsdashboard" src="https://github.com/user-attachments/assets/f8f163bb-0240-4d49-9612-918b677dd313" />

Redirections:

- “← Go to main dashboard”: redirects to the / view.
- “← Go to Orders”: redirects to the /orders view.

Functionalities:

- List the existing robots.
- Update the status of a specific order.
- Filter robots by: robot id, status and last known location.

## Backend Endpoints

Postman Collection:

[Kiwibot API.postman_collection.json](Kiwibot%20Challenge%2020435839312a80e5844ce01a43eb6500/Kiwibot_API.postman_collection.json)

### GET /orders → Get a list of orders

Query Params:

- client → string
- restaurant → string
- status → ‘completed’ | ‘delivered’ | ‘picked_up’ | ‘assigned’ | ‘pending’
- robot → string

### POST /orders → Create a order

JSON Body:

```json
{
    "clientId": 1,
    "restaurantId": 2,
    "items": [
        {
            "description": "Hot Dog",
            "unitPrice": "20.10",
            "quantity": 1
        },
        {
            "description": "Hamburguer",
            "unitPrice": "30.20",
            "quantity": 1
        }
    ]
}
```

### PATCH /orders/:id → Assign a available robot to an order

Path Variables

- id

### PATCH /orders/:id/status → Go to the next status of an order

Path Variables

- id

### GET /robots → Get a list of robots

Query Params

- lastKnownLocation → string
- robot → string
- status → ‘available’ | ‘busy’ | ‘offline’

### POST /robots → Create a robot

### PATCH /robots/:id → Change the status of a robot

Path Variables

- id

JSON Body

```json
{
    "status": "busy"
}
```

## Database ER Diagram

<img width="831" height="451" alt="erdiagram" src="https://github.com/user-attachments/assets/dc67b3b0-bd6b-4ed1-8ca6-dd6c26f13af1" />

# 🤯 Design choices and rationale

## Clean Architecture

Clean Architecture was adopted to decouple the business logic from external dependencies. This separation allows unit tests to focus on the application and domain layers, which hold the core logic and provide the most value when tested. By relying on abstractions (like repositories) instead of concrete implementations, the need for complex mocking is reduced. The actual implementations of these abstractions reside in the infrastructure layer and adhere to contracts defined in the domain. These implementations are injected through the adapters/controllers layer, enabling the system to remain flexible, scalable, and easy to maintain. As a result, the project can evolve and change technologies (e.g., databases or frameworks) without impacting the core business logic.

### Project structure

```
app
└ src
  └ adapters                      -> Adapters Layer
    └ controllers
    └ validators                  
  └ app                           -> Next.js app folder
    └ api                         -> Next.js API routes
  └ application                   -> Application Layer
    └ use_cases
      └ orders
        └ __tests__               -> unit tests per resource
  └ components                    -> UI Components
  └ domain                        -> Domain Layer
    └ entities
    └ repositories                -> Contracts or abstractions (interfaces)
  └ infrastructure                -> Infrastructure Layer
    └ db/orm/drizzle
      └ repositories              -> Contracts implementations
      └ schema                    -> Drizzle schemas
    └ utils
```

## Design Patterns

To manage the controlled transitions between different statuses in an order’s lifecycle, the [**State**](https://refactoring.guru/design-patterns/state) design pattern was implemented. This pattern allows an object to change its behavior when its internal state changes, effectively encapsulating state-specific logic in separate classes.

In this case, there’s an abstraction representing a generic state (e.g., OrderState) that defines common behavior through methods. Concrete classes such as CompletedState, PendingState, etc., implement this abstraction and define their own behavior. This makes it possible to delegate logic to each specific state without modifying the core Order class.

This approach provides:

- Scalability: Adding a new order status only requires creating a new class that implements the state interface.
- Separation of concerns: Each state handles only its own behavior.
- Maintainability: No need to touch existing code when new states are added, following the Open/Closed Principle.

## Handling Race Conditions

To prevent race conditions and ensure data consistency, it’s essential to use transactions and lock the rows being queried when updating the status of an order or assigning a robot to an order.

A robot can only be assigned to one order at a time and must return to the "available" state after completing its task. If two users try to assign a robot to the same order simultaneously without properly locking the relevant rows, two robots might end up marked as busy, but only one would actually be linked to the order. This leads to data inconsistency.

## DTO Validation

To ensure the integrity and reliability of the data that enters the system, we validate all incoming request payloads using Zod, a TypeScript-first schema declaration and validation library. Validation is performed inside the controllers layer, right before any data reaches the application logic. Each controller receives a req.body or req.query, parses it through a Zod schema (the DTO), and either proceeds with the logic or returns a validation error.

This allow us to:

- Prevent malformed data from reaching the business logic
- Provide consistent and descriptive error messages to clients
- Keep our domain layer clean and safe

# 🛠️ Setup Instructions

Make sure you have **Node.js** installed on your machine and a **.env** file in the root of the project with a `DATABASE_URL` variable pointing to your PostgreSQL database connection URL.

- Clone the repository
    
    ```bash
    git clone https://github.com/Alejandro2134/delivery-order-processing-system.git
    cd delivery-order-processing-system
    ```
    
- Install dependencies
    
    ```bash
    npm i
    ```
    

## Using Docker Compose

- Run container (This will spin up both the **PostgreSQL** database and the app in containers)
    
    ```bash
    docker compose up -d
    ```
    
- Apply database migrations
    
    ```bash
    npm run db:migrate
    ```
    
- Seed the database (adds sample clients and restaurants)
    
    ```bash
    npm run db:seed
    ```
    

## Using Node.js

- Start the app (Make sure you have a PostgreSQL database running locally or remotely)
    
    ```bash
    npm run dev
    ```
    
- Apply database migrations
    
    ```bash
    npm run db:migrate
    ```
    
- Seed the database (adds sample clients and restaurants)
    
    ```bash
    npm run db:seed
    ```
    

# 👜 Github Repository

Yo can see the code of the application on the following Github repository: https://github.com/Alejandro2134/delivery-order-processing-system

# ☁️ Deployed Application

You can access the deployed application via this link: [https://kiwibot-414943463580.us-central1.run.app/](https://kiwibot-414943463580.us-central1.run.app/)



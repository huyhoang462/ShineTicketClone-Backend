## ⚙️ Setup & Installation

1.  **Clone this repository:**

    ```sh
    git clone https://github.com/huyhoang462/ShineTicketClone-Backend
    cd ShineTicketClone-Backend
    ```

2.  **Install dependencies:**

    ```sh
    npm install
    ```

3.  **Setup Environment Variables:**

    - This project requires environment variables to connect to the database and manage security tokens.
    - Copy the example environment file:
      ```sh
      cp .env.example .env
      ```
    - Now, open the newly created `.env` file and fill in your own values for the database connection, JWT secrets, and email credentials.

4.  **Start the development server:**
    ```sh
    npm run dev
    ```
    The backend server should now be running on `http://localhost:8080`.

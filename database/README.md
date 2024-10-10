
# Database Setup

This directory contains the SQL schema used to create and manage the database for the application. The database is built using PostgreSQL, and `pgAdmin4` has been utilized for creating and managing the database structure.

## Prerequisites

Before setting up the database, ensure that you have the following installed:
- **PostgreSQL**: The database system used.
- **pgAdmin4**: A web-based management tool for PostgreSQL, used for managing the database.

## Database Overview

The database schema includes the following tables:
1. **payments**: Stores payment-related data including `amount`, `purchased_at` and `expires_at`.
2. **problems**: Stores problem details such as `description`, `status`, `title`, `results`, `input_data`, and `user` information.
3. **statistics**: Stores statistics related to problems, such as `processing_time`, `cpu_usage`, `memory_usage`, and the associated `problem_id`.

### Table Details
  
- **payments**: Contains payment details with information on amounts and timestamps.
  - Columns: `id`, `amount`, `purchased_at`, `expires_at`
  - Foreign key references `user_id` (later removed in an alteration).

- **problems**: Stores the problems created within the system.
  - Columns: `id`, `description`, `status`, `created_at`, `title`, `results`, `user`, `solved_at`, `input_data`

- **statistics**: Contains performance data associated with problem solving.
  - Columns: `id`, `problem_id`, `processing_time`, `cpu_usage`, `memory_usage`, `created_at`

### Modifications and Alterations

Several modifications are made to the schema after initial table creation, including:
- Dropping the foreign key and `user_id` column from the `payments` table.
- Adding new column `expires_at` to the `payments` table.
- Adding new columns (`results`, `user`, `solved_at`, `input_data`) to the `problems` table.
- Adding new columns (`cpu_usage`, `memory_usage`) to the `statistics` table.

Refer to the `database.txt` file for full SQL commands and further details on table structures and modifications.

## Setting Up the Database

1. **Open pgAdmin4**: Connect to your PostgreSQL instance.
2. **Run the SQL Script**:
   - In the pgAdmin4 interface, open the query tool.
   - Load the `database.txt` file, which contains the SQL code for setting up the tables and making alterations.
   - Execute the script to create and modify the database schema as needed.

## Important Files

- `database.txt`: Contains the SQL commands used to create and modify the database schema.

## Notes

- The schema is designed to support various functionalities of the application, such as payments, problem submission, and statistics tracking.
- Ensure that your PostgreSQL server is configured properly and accessible before running the SQL script.


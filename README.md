# Expense Tracker

A simple web application to track your daily expenses with monthly summaries and filtering capabilities.

## Features

- Add, edit, and delete expenses
- Categorize expenses
- Filter expenses by month
- View monthly and all-time summaries
- Responsive design

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Spring Boot
- **Database**: SQL
- **Build Tool**: Maven

## Getting Started

### Prerequisites

- Java 11 or higher
- Maven 3.6.3 or higher
- Node.js (for frontend development)
 
### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/expense-tracker.git
   cd expense-tracker
   ```

2. Build the application:
   ```bash
   mvn clean install
   ```

### Running the Application

1. Start the Spring Boot application:
   ```bash
   mvn spring-boot:run
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:8081
   ```

## API Endpoints

- `GET /api/expenses` - Get all expenses
- `POST /api/expenses` - Create a new expense
- `PUT /api/expenses/{id}` - Update an existing expense
- `DELETE /api/expenses/{id}` - Delete an expense

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

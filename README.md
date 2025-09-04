# Hotel Room Management Admin App

This is a full-stack Single Page Application (SPA) for managing hotel room bookings. It provides an admin-facing interface to create, view, edit, and cancel room reservations. The project is built with an ASP.NET Core Web API backend and an Angular front end.

## Features

- **Booking Management**: Full CRUD (Create, Read, Update, Delete) functionality for room bookings.
- **Dynamic Price Calculation**: The booking form provides a real-time price estimate based on the selected room and duration.
- **Conflict Prevention**: The backend prevents double-booking the same room for overlapping time slots.
- **Advanced Filtering**: The main booking list can be filtered by room, room type, and a specific date range.
- **Conditional Refunds**: Cancelling a booking correctly calculates the refund (100%, 50%, or 0%) based on the time until the booking.
- **Email Notifications**: Users automatically receive an HTML-formatted confirmation email upon a successful booking.
- **Responsive Design**: The user interface is designed to be fully functional and visually appealing on both desktop and mobile devices.

## Tech Stack

- **Backend**: ASP.NET Core 8, Dapper, SQL Server
- **Frontend**: Angular 17, TypeScript, SCSS
- **Database**: Microsoft SQL Server

---

## Setup and Installation

### Prerequisites

- .NET 8 SDK
- Node.js and Angular CLI
- SQL Server

### 1. Database Setup

1.  Open SQL Server Management Studio (SSMS).
2.  Create a new, empty database named `HotelManagementDB`.
3.  Open the `init-db.sql` file (located in the root of this repository) in SSMS.
4.  Execute the script. This will create all necessary tables, stored procedures, and initial data for rooms and room types.

### 2. Backend Setup

1.  Navigate to the backend project directory: `cd BACKEND/WebApplication1/WebApplication1`.
2.  Update the `DefaultConnection` string in `appsettings.json` with your SQL Server credentials.
3.  Initialize the Secret Manager to handle SMTP credentials securely:
    ```bash
    dotnet user-secrets init
    ```
4.  Set your SMTP credentials using the following commands (replace placeholders with your actual credentials):
    ```bash
    dotnet user-secrets set "SmtpSettings:Server" "smtp.gmail.com"
    dotnet user-secrets set "SmtpSettings:Port" "587"
    dotnet user-secrets set "SmtpSettings:SenderName" "Hotel MS"
    dotnet user-secrets set "SmtpSettings:SenderEmail" "your-email@gmail.com"
    dotnet user-secrets set "SmtpSettings:Username" "your-email@gmail.com"
    dotnet user-secrets set "SmtpSettings:Password" "your-16-character-app-password"
    ```
5.  Run the backend application from Visual Studio or by using the command:
    ```bash
    dotnet run
    ```
    The API will be running at `https://localhost:7060`.

### 3. Frontend Setup

1.  Navigate to the front-end project directory: `cd FrontEnd/hotel-ms-app`.
2.  Install the necessary packages:
    ```bash
    npm install
    ```
3.  Run the front-end application:
    ```bash
    ng serve
    ```
4.  Open your browser and navigate to `http://localhost:4200`.

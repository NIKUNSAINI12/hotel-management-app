# Hotel Management App

This project is a full-stack hotel room booking management system with an ASP.NET Core backend and an Angular front end.

## Database Setup

1.  Ensure you have SQL Server installed.
2.  Open SQL Server Management Studio (SSMS).
3.  Create a new, empty database named `HotelManagementDB`.
4.  Open the `init-db.sql` file from this project in SSMS.
5.  Execute the script. This will create all the necessary tables, stored procedures, and initial data.
6.  Update the `DefaultConnection` string in the `BACKEND/WebApplication1/appsettings.json` file with your SQL Server credentials.

## Running the Application

### Backend
1. Open the `BACKEND` solution in Visual Studio.
2. Run the project (press F5).

### Frontend
1. Navigate to the `FrontEnd/hotel-ms-app` folder.
2. Run `npm install`.
3. Run `ng serve`.
4. Open your browser to `http://localhost:4200`.

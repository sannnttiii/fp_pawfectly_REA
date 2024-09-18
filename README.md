Project Documentation: https://docs.google.com/document/d/1aeaEg8LID4X1J54BPkWzpKKI3nwea3G-DIHp1iTljWo/edit?usp=sharing

Setup Project:
1. Pull the latest changes from the repository:
   - git pull
2. Navigate to the frontend directory and install dependencies:
  - cd fp_pawfectly_REA
  - npm install
3. Start the frontend project:
  - npm start
4. Navigate to the backend directory:
  - cd go_backend
5. Run the backend server:
  - go run main.go
6. Set up PostgreSQL:
  - Create a database named pawfectly.
7. Ensure that the PostgreSQL user and password match the credentials specified in main.go. If they don't match, adjust them accordingly in your PostgreSQL setup or update main.go with the correct credentials.
8. Open the SQL file pawfectlypostgres.sql located in the sql folder. Execute the SQL commands in PostgreSQL to set up the database schema.

package main

import (
	"bytes"
	"context"

	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"strconv"

	"github.com/jackc/pgx/v4"
	"github.com/stretchr/testify/assert"
)

func TestSignupHandler(t *testing.T) {
	dbURL := "postgres://postgres:postgres@localhost:5432/pawfectly"
	conn, err := pgx.Connect(context.Background(), dbURL)
	if err != nil {
		t.Fatalf("Unable to connect to database: %v", err)
	}
	defer conn.Close(context.Background())

	req := httptest.NewRequest(http.MethodPost, "/api/signup", bytes.NewBufferString(`{"email":"test@example.com","password":"password123"}`))
	req.Header.Set("Content-Type", "application/json")
	rr := httptest.NewRecorder()

	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		signupHandler(conn, w, r)
	})

	handler.ServeHTTP(rr, req)
	assert.Equal(t, http.StatusOK, rr.Code, "Expected status code 200")

	var response map[string]interface{}
	err = json.Unmarshal(rr.Body.Bytes(), &response)
	if err != nil {
		t.Fatalf("Error unmarshalling response: %v", err)
	}

	assert.Equal(t, "User created successfully", response["message"], "Expected success message")
	userID := response["user_id"].(float64)
	assert.NotNil(t, response["user_id"], "Expected user_id in response")
	assert.NotNil(t, response["encode"], "Expected encode in response")

	// hapus data setelah ditesting
	_, err = conn.Exec(context.Background(), "DELETE FROM users WHERE id=$1", int(userID))
	if err != nil {
		t.Fatalf("Error deleting test user: %v", err)
	}
}

func insertTestPetsData(conn *pgx.Conn) error {
	_, err := conn.Exec(context.Background(), `
		INSERT INTO users ( email, password, pet_type, name, gender, age, pet_breeds, image_pet, city, bio) VALUES
		( 'tes1@gmail.com', '123456', 'dog', 'Buddy', 'male', 3, 'Poodle', 'image1_url', 'CityA', 'Friendly dog'),
		('tes2@gmail.com', '123456', 'cat', 'Whiskers', 'female', 2, 'Mix', 'image2_url', 'CityB', 'Playful cat'),
		( 'tes@gmail.com', '123456', 'dog', 'Rex', 'male', 5, 'German Shepherd', 'image3_url', 'CityC', 'Loyal dog')
	`)
	return err
}

func TestFetchPetsHandler(t *testing.T) {
	dbURL := "postgres://postgres:postgres@localhost:5432/pawfectly"
	conn, err := pgx.Connect(context.Background(), dbURL)
	if err != nil {
		t.Fatalf("Unable to connect to database: %v", err)
	}
	defer conn.Close(context.Background())

	// Insert test data
	err = insertTestPetsData(conn)
	if err != nil {
		t.Fatalf("Error inserting test data: %v", err)
	}

	// Fetch the user ID associated with the email 'tes@gmail.com'
	var userID int
	err = conn.QueryRow(context.Background(), "SELECT id FROM users WHERE email=$1", "tes@gmail.com").Scan(&userID)
	if err != nil {
		t.Fatalf("Error fetching user ID: %v", err)
	}

	userIDStr := strconv.Itoa(userID)

	req := httptest.NewRequest(http.MethodGet, "/api/pets?id="+userIDStr, nil)
	rr := httptest.NewRecorder()

	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		fetchPetsHandler(conn, w, r)
	})
	handler.ServeHTTP(rr, req)

	assert.Equal(t, http.StatusOK, rr.Code, "Expected status code 200")

	var response []map[string]interface{}
	err = json.Unmarshal(rr.Body.Bytes(), &response)
	if err != nil {
		t.Fatalf("Error unmarshalling response: %v", err)
	}
	actualPetsCount := len(response)

	expectedPetsCount := 2 // sesuaikan dengan jumlah test data
	assert.Equal(t, actualPetsCount, expectedPetsCount, "Expected correct number of pets in response")

	for _, pet := range response {
		// tidak termasuk user dengan email test@gmail.com
		assert.NotEqual(t, userID, int(pet["id"].(float64)), "The logged-in user's pets should not be included")
	}

	// hapus data setelah ditesting
	_, err = conn.Exec(context.Background(), "DELETE FROM users WHERE email LIKE '%tes%'")
	if err != nil {
		t.Fatalf("Error deleting test user: %v", err)
	}
}

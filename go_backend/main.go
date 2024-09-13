package main

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"reflect"
	"strconv"
	"time"

	"github.com/jackc/pgx/v4"
	"github.com/rs/cors"
	"golang.org/x/crypto/bcrypt"
)

var conn *pgx.Conn

// Encrypt password dengan bcrypt
func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	return string(bytes), err
}

func CheckPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

func handler(w http.ResponseWriter, r *http.Request) {
	rows, err := conn.Query(context.Background(), "SELECT email,password,pet_type FROM users")
	if err != nil {
		http.Error(w, "Unable to fetch users", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var users []map[string]string

	for rows.Next() {
		var email, password, pet_type string
		if err := rows.Scan(&email, &password, &pet_type); err != nil {
			http.Error(w, "Error scanning row", http.StatusInternalServerError)
			return
		}
		user := map[string]string{"email": email, "password": password, "pet_type": pet_type}
		users = append(users, user)
	}

	if rows.Err() != nil {
		http.Error(w, "Error iterating rows", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(users); err != nil {
		http.Error(w, "Error encoding JSON", http.StatusInternalServerError)
	}
}

type User struct {
	ID        int    `json:"id"`
	Email     string `json:"email"`
	Password  string `json:"password"`
	PetType   string `json:"petType"`
	PetImage  string `json:"image"`
	PetBreeds string `json:"petBreeds"`
	Gender    string `json:"gender"`
	Name      string `json:"name"`
	Age       int    `json:"age"`
	City      string `json:"city"`
	Bio       string `json:"bio"`
}

func signupHandler(w http.ResponseWriter, r *http.Request) {

	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var user User
	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	var userID int
	// var encodedString = base64.StdEncoding.EncodeToString([]byte(user.Password))
	encodedString, err := HashPassword(user.Password)
	if err != nil {
		fmt.Println("Error hashing password:", err)
		return
	}

	err = conn.QueryRow(context.Background(), "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id", user.Email, encodedString).Scan(&userID)
	if err != nil {
		log.Printf("Error executing query: %v\n", err)
		http.Error(w, "Failed to create user", http.StatusInternalServerError)
		return
	}

	response := map[string]interface{}{"message": "User created successfully", "user_id": userID, "encode": encodedString}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func setPetTypeHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var user User
	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	_, err = conn.Exec(context.Background(), "UPDATE users SET pet_type = $1 WHERE id=$2", user.PetType, user.ID)
	if err != nil {
		fmt.Println(err.Error())
		return
	}
	fmt.Println("update success!, ", user.PetType, user.ID)

	if err != nil {
		log.Printf("Error executing query: %v\n", err)
		http.Error(w, "Failed to create user", http.StatusInternalServerError)
		return
	}

	response := map[string]interface{}{"message": "Set PetType successfully", "user_id": user.ID}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func setProfile(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	err := r.ParseMultipartForm(10 << 20) // Limit your max input length to 10 MB
	if err != nil {
		fmt.Println("Error parsing form data:", err)
		http.Error(w, "Invalid form data", http.StatusBadRequest)
		return
	}

	var user User
	user.PetBreeds = r.FormValue("pet_breeds")
	user.Gender = r.FormValue("gender")
	user.Name = r.FormValue("name")
	user.City = r.FormValue("city")
	user.Bio = r.FormValue("bio")

	file, handler, err := r.FormFile("image")
	if err == nil {
		defer file.Close()
		imagePath := filepath.Join("images", "profpic")
		if _, err := os.Stat(imagePath); os.IsNotExist(err) {
			os.MkdirAll(imagePath, os.ModePerm)
		}
		fileName := fmt.Sprintf("%d-%s", user.ID, filepath.Base(handler.Filename))
		filePath := filepath.Join(imagePath, fileName)
		f, err := os.Create(filePath)
		if err != nil {
			fmt.Println("Error creating file:", err)
			http.Error(w, "Failed to save image", http.StatusInternalServerError)
			return
		}
		defer f.Close()
		io.Copy(f, file)
		user.PetImage = fileName
	}

	age, err := strconv.Atoi(r.FormValue("age"))
	if err != nil {
		fmt.Println("Error converting age:", err)
		http.Error(w, "Invalid age value", http.StatusBadRequest)
		return
	}
	user.Age = age
	fmt.Println(reflect.TypeOf(age))

	id, err := strconv.Atoi(r.FormValue("id"))
	if err != nil {
		fmt.Println("Error converting id:", err)
		http.Error(w, "Invalid id value", http.StatusBadRequest)
		return
	}
	user.ID = id

	fmt.Println("USER ", user.PetImage, user.PetBreeds, user.Gender, user.Name, user.Age, user.City, user.Bio, user.ID)

	_, err = conn.Exec(context.Background(), "UPDATE users SET pet_breeds=$1, gender=$2, name=$3, age=$4, city=$5, bio=$6, image_pet=COALESCE(NULLIF($7, ''), image_pet) WHERE id=$8",
		user.PetBreeds, user.Gender, user.Name, user.Age, user.City, user.Bio, user.PetImage, user.ID)
	if err != nil {
		fmt.Println("Database update error:", err)
		http.Error(w, "Failed to update profile", http.StatusInternalServerError)
		return
	}

	fmt.Println("Update success! User:", user.PetType, user.PetImage)

	response := map[string]interface{}{"message": "Profile updated successfully", "user_id": user.ID, "image_pet": user.PetImage}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func loginHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var user User
	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	var userID int
	var storedHash string
	var petType string
	var imagePet string

	err = conn.QueryRow(context.Background(), "SELECT id, password, pet_type, image_pet FROM users WHERE email=$1", user.Email).Scan(&userID, &storedHash, &petType, &imagePet)
	if err != nil {
		log.Printf("Error fetching user: %v\n", err)
		http.Error(w, "User not found", http.StatusUnauthorized)
		return
	}

	if !CheckPasswordHash(user.Password, storedHash) {
		log.Println("Invalid password")
		http.Error(w, "Invalid credentials", http.StatusUnauthorized)
		return
	}

	response := map[string]interface{}{"message": "Login successful", "user_id": userID, "petType": petType, "image_pet": imagePet}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func fetchPetsHandler(w http.ResponseWriter, r *http.Request) {
	userID := r.URL.Query().Get("id")
	if userID == "" {
		http.Error(w, "User ID is required", http.StatusBadRequest)
		return
	}

	query := `
		SELECT u.id, u.pet_type, u.name, u.gender, u.age, u.pet_breeds, u.image_pet, u.city, u.bio
		FROM users u
		WHERE u.id <> $1
		AND NOT EXISTS (
			SELECT 1 
			FROM matches m 
			WHERE (m.userid1 = $1 AND m.userid2 = u.id)
			   OR (m.userid1 = u.id AND m.userid2 = $1 AND status='match')
			   OR (m.userid1 = u.id AND m.userid2 = $1 AND status='unmatch')
		);
	`

	rows, err := conn.Query(context.Background(), query, userID)
	if err != nil {
		http.Error(w, `{"error": "Unable to fetch pets"}`, http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var pets []map[string]interface{}

	for rows.Next() {
		var id, age int
		var petType, name, gender, petBreeds, imagePet, city, bio string

		if err := rows.Scan(&id, &petType, &name, &gender, &age, &petBreeds, &imagePet, &city, &bio); err != nil {
			log.Printf("Error scanning row: %v", err)
			http.Error(w, `{"error": "Error scanning row"}`, http.StatusInternalServerError)
			return
		}

		pet := map[string]interface{}{
			"id":        id,
			"petType":   petType,
			"name":      name,
			"gender":    gender,
			"age":       age,
			"petBreeds": petBreeds,
			"image_pet": imagePet,
			"city":      city,
			"bio":       bio,
		}
		pets = append(pets, pet)
	}

	if rows.Err() != nil {
		log.Printf("Error iterating rows: %v", rows.Err())
		http.Error(w, `{"error": "Error iterating rows"}`, http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(pets); err != nil {
		http.Error(w, `{"error": "Error encoding JSON"}`, http.StatusInternalServerError)
	}
}

func fetchProfile(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	userID := r.URL.Query().Get("id")
	if userID == "" {
		http.Error(w, "User ID is required", http.StatusBadRequest)
		return
	}

	var user User
	err := conn.QueryRow(context.Background(), "SELECT id, email, password, pet_type, image_pet, pet_breeds, gender, name, age, city, bio FROM users WHERE id=$1", userID).Scan(
		&user.ID, &user.Email, &user.Password, &user.PetType, &user.PetImage, &user.PetBreeds, &user.Gender, &user.Name, &user.Age, &user.City, &user.Bio,
	)
	if err != nil {
		log.Printf("Error fetching user: %v\n", err)
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(user); err != nil {
		http.Error(w, "Failed to encode response", http.StatusInternalServerError)
	}
}

func setMatch(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	idLogin := r.URL.Query().Get("userid1")
	if idLogin == "" {
		http.Error(w, "userid1 is required", http.StatusBadRequest)
		return
	}

	idChoosen := r.URL.Query().Get("userid2")
	if idChoosen == "" {
		http.Error(w, "userid2 is required", http.StatusBadRequest)
		return
	}

	status := r.URL.Query().Get("status")
	if status == "" {
		http.Error(w, "Status is required", http.StatusBadRequest)
		return
	}

	// Check if a record exists
	var currentStatus string
	var respons string
	var matchesId int

	err := conn.QueryRow(context.Background(), `
		SELECT status 
		FROM matches 
		WHERE (userid1 = $1 AND userid2 = $2)
		   OR (userid1 = $2 AND userid2 = $1)
	`, idLogin, idChoosen).Scan(&currentStatus)

	if err != nil {
		if err == pgx.ErrNoRows {
			// if not found and user want to match, insert a new record with status 'pending'
			if status == "match" {
				err = conn.QueryRow(context.Background(), `
					INSERT INTO matches (userid1, userid2, status)
					VALUES ($1, $2, 'pending')
					RETURNING id
				`, idLogin, idChoosen).Scan(&matchesId)
				if err != nil {
					log.Printf("Error inserting new match: %v\n", err)
					http.Error(w, "Failed to insert new match", http.StatusInternalServerError)
					return
				}
				respons = "pending"

			} else if status == "unmatch" {
				// if not found and user dont want to match, insert a new record with status 'unmatch'
				// If not found and user doesn't want to match, insert a new record with status 'unmatch'
				err = conn.QueryRow(context.Background(), `
					INSERT INTO matches (userid1, userid2, status)
					VALUES ($1, $2, 'unmatch')
					RETURNING id
				`, idLogin, idChoosen).Scan(&matchesId)
				if err != nil {
					log.Printf("Error inserting new match: %v\n", err)
					http.Error(w, "Failed to insert new match", http.StatusInternalServerError)
					return
				}
				respons = "unmatch"
			}
		} else {
			log.Printf("Error querying match: %v\n", err)
			http.Error(w, "Failed to check match", http.StatusInternalServerError)
			return
		}
	} else {
		// if exists user want to match, insert a new record with status 'pending'
		if status == "match" {
			if currentStatus == "pending" {
				err = conn.QueryRow(context.Background(), `
					UPDATE matches
					SET status = 'match'
					WHERE (userid1 = $1 AND userid2 = $2)
					   OR (userid1 = $2 AND userid2 = $1)
					RETURNING id
				`, idLogin, idChoosen).Scan(&matchesId)
				if err != nil {
					log.Printf("Error updating match to 'match': %v\n", err)
					http.Error(w, "Failed to update match", http.StatusInternalServerError)
					return
				}
				respons = "match"
			}
		} else if status == "unmatch" {
			if currentStatus == "pending" {
				err = conn.QueryRow(context.Background(), `
					UPDATE matches
					SET status = 'unmatch'
					WHERE (userid1 = $1 AND userid2 = $2)
					   OR (userid1 = $2 AND userid2 = $1)
					RETURNING id
				`, idLogin, idChoosen).Scan(&matchesId)
				if err != nil {
					log.Printf("Error updating match to 'unmatch': %v\n", err)
					http.Error(w, "Failed to update match", http.StatusInternalServerError)
					return
				}
				respons = "unmatch"
			}
		}
	}

	response := map[string]interface{}{"message": "Match successfully processed", "respons": respons, "matchesId": matchesId}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func sendMessage(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req struct {
		Message   string `json:"message"`
		MatchesID int    `json:"matchesId"`
		SenderID  int    `json:"senderId"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Bad request", http.StatusBadRequest)
		return
	}

	// Insert the message into the database
	_, err := conn.Exec(context.Background(), `
		INSERT INTO messages (matches_id, sender_id, message) 
		VALUES ($1, $2, $3)
	`, req.MatchesID, req.SenderID, req.Message)
	if err != nil {
		log.Printf("Error inserting message: %v\n", err)
		http.Error(w, "Failed to insert message", http.StatusInternalServerError)
		return
	}

	response := map[string]interface{}{"message": req.Message, "senderId": req.SenderID}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func getMessages(w http.ResponseWriter, r *http.Request) {
	type Message struct {
		ID        int       `json:"id"`
		Message   string    `json:"message"`
		SenderID  int       `json:"senderId"`
		CreatedAt time.Time `json:"createdAt"` // Use time.Time for TIMESTAMP
	}

	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	matchesId := r.URL.Query().Get("matchesId")
	if matchesId == "" {
		http.Error(w, "matchesId is required", http.StatusBadRequest)
		return
	}

	rows, err := conn.Query(context.Background(), `
		SELECT id, message, sender_id, created_at
		FROM messages
		WHERE matches_id = $1
		ORDER BY created_at
	`, matchesId)
	if err != nil {
		log.Printf("Error querying messages: %v\n", err)
		http.Error(w, "Failed to retrieve messages", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var messages []Message

	for rows.Next() {
		var m Message
		if err := rows.Scan(&m.ID, &m.Message, &m.SenderID, &m.CreatedAt); err != nil {
			log.Printf("Error scanning message: %v\n", err)
			http.Error(w, "Failed to scan messages", http.StatusInternalServerError)
			return
		}
		messages = append(messages, m)
	}

	if err := rows.Err(); err != nil {
		log.Printf("Error iterating messages: %v\n", err)
		http.Error(w, "Error retrieving messages", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(map[string]interface{}{
		"messages": messages,
	}); err != nil {
		log.Printf("Error encoding response: %v\n", err)
		http.Error(w, "Failed to encode response", http.StatusInternalServerError)
	}
}

func getListMessages(w http.ResponseWriter, r *http.Request) {
	type ListMessage struct {
		UserID          int       `json:"userId"`
		NameUserChoosen string    `json:"nameUserChoosen"`
		AgeUserChoosen  int       `json:"ageUserChoosen"`
		MatchesID       int       `json:"matchesId"`
		ProfilePic      string    `json:"profilePic"`
		LastMessage     string    `json:"lastMessage"`
		LastMessageTime time.Time `json:"lastMessageTime"`
	}

	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	userID := r.URL.Query().Get("userID")
	if userID == "" {
		http.Error(w, "userID is required", http.StatusBadRequest)
		return
	}

	rows, err := conn.Query(context.Background(), `
	SELECT u.id AS user_id, u.name, u.age, u.image_pet AS image_pet, m.id AS match_id, msg.message, msg.created_at
	FROM matches m
	INNER JOIN users u
	ON (m.userid1 = u.id OR m.userid2 = u.id) AND u.id <> $1
	LEFT JOIN messages msg
	ON msg.matches_id = m.id
	ORDER BY msg.created_at DESC
	LIMIT 1;
	`, userID)
	if err != nil {
		log.Printf("Error querying messages: %v\n", err)
		http.Error(w, "Failed to retrieve messages", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var messages []ListMessage

	for rows.Next() {
		var m ListMessage
		if err := rows.Scan(&m.UserID, &m.NameUserChoosen, &m.AgeUserChoosen, &m.ProfilePic, &m.MatchesID, &m.LastMessage, &m.LastMessageTime); err != nil {
			log.Printf("Error scanning message: %v\n", err)
			http.Error(w, "Failed to scan messages", http.StatusInternalServerError)
			return
		}
		messages = append(messages, m)
	}

	if err := rows.Err(); err != nil {
		log.Printf("Error iterating messages: %v\n", err)
		http.Error(w, "Error retrieving messages", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(map[string]interface{}{
		"messages": messages,
	}); err != nil {
		log.Printf("Error encoding response: %v\n", err)
		http.Error(w, "Failed to encode response", http.StatusInternalServerError)
	}
}

func main() {
	var err error
	// conn, err = pgx.Connect(context.Background(), "postgres://postgres:postgres@localhost:5432/pawfectly")
	conn, err = pgx.Connect(context.Background(), "postgres://default:VEaAruPg7fk9@ep-spring-lab-a1ne9eij.ap-southeast-1.aws.neon.tech:5432/verceldb?sslmode=require")

	if err != nil {
		log.Fatalf("Unable to connect to database: %v\n", err)
	}
	defer conn.Close(context.Background())
	// Handler untuk melayani file gambar dari go_backend/images/profpic
	fileServer := http.FileServer(http.Dir("./images/profpic"))
	http.Handle("/images/profpic/", http.StripPrefix("/images/profpic/", fileServer))

	http.HandleFunc("/api/signup", signupHandler)
	http.HandleFunc("/api/setPetType", setPetTypeHandler)
	http.HandleFunc("/api/setProfile", setProfile)
	http.HandleFunc("/api/login", loginHandler)
	http.HandleFunc("/api/pets", fetchPetsHandler)
	http.HandleFunc("/api/getProfile", fetchProfile)
	http.HandleFunc("/api/setMatch", setMatch)
	http.HandleFunc("/api/sendMessage", sendMessage)
	http.HandleFunc("/api/messages", getMessages)
	http.HandleFunc("/api/listRoom", getListMessages)
	http.HandleFunc("/", handler)
	c := cors.New(cors.Options{
		// AllowedOrigins:   []string{"http://localhost:3000"},
		AllowedOrigins:   []string{"https://pawfectly-beta.vercel.app"},
		AllowedMethods:   []string{"GET", "POST", "OPTIONS"},
		AllowedHeaders:   []string{"Content-Type"},
		AllowCredentials: true,
	})

	// Wrap your handlers with the CORS middleware
	handler := c.Handler(http.DefaultServeMux)

	fmt.Println("Server is running on port 8082...")
	if err := http.ListenAndServe(":8082", handler); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}

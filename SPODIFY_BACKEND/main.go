package main

import (
	"context"
	"encoding/json" // decoding json responses
	"fmt"           // printing output
	"log"
	"os"   // operating system
	"time" // time management

	"github.com/joho/godotenv"              // loading .env
	"github.com/zmb3/spotify"               // spotify API
	"golang.org/x/oauth2/clientcredentials" // OAuth2 client credentials
)

type TokenData struct { // holds access token/expiry
	AccessToken string    `json:"access_token"` // api authentication
	Expiry      time.Time `json:"expiry"`       // token expiration
}

func loadLocalToken() (TokenData, error) { // saves the loal access token info into random access memory
	var data TokenData
	bytes, err := os.ReadFile("token.json") // read token.json into bytes
	if err != nil {                         // file not found
		return data, err
	}
	err = json.Unmarshal(bytes, &data) // decode JSON bytes into TokenData struct
	return data, err
}

func loadDotEnv() {
	err := godotenv.Load() // load .env file
	if err != nil {
		log.Fatalf("Error loading .env file: %v", err)
	}
}

func loadLocalCredentials() (string, string) { // return spotify client id and client secret from .env
	spotifyClientID := os.Getenv("SPOTIFY_CLIENT_ID")
	spotifyClientSecret := os.Getenv("SPOTIFY_CLIENT_SECRET")
	if spotifyClientID == "" || spotifyClientSecret == "" {
		log.Fatal("SPOTIFY_CLIENT_ID or SPOTIFY_CLIENT_SECRET not found in .env file")
	}
	return spotifyClientID, spotifyClientSecret
}

func loadRemoteToken(clientID, clientSecret string) (string, time.Time) {
	config := &clientcredentials.Config{ // initialize OAuth2 client credentials
		ClientID:     clientID,
		ClientSecret: clientSecret,
		TokenURL:     spotify.TokenURL,
	}
	token, err := config.Token(context.Background()) // send HTTP Request for token
	if err != nil {
		log.Fatalf("Failed to get token: %v", err)
	}
	return token.AccessToken, token.Expiry
}

func main() {
	tokenData, err := loadLocalToken()                    // load local access token info into random access memory
	if err != nil || time.Now().After(tokenData.Expiry) { // if an error occured or the token has expired
		fmt.Println("Fetching new access token...")
		loadDotEnv()
		fmt.Println(loadRemoteToken(loadLocalCredentials()))
		// save the new token info
	}
}

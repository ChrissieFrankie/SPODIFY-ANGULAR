package main

import (
	"encoding/json" // decoding json responses
	"fmt"           // printing output
	"os"            // operating system
	"time"          // time management
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

func main() {
	tokenData, err := loadLocalToken()                    // load local access token info into random access memory
	if err != nil || time.Now().After(tokenData.Expiry) { // if an error occured or the token has expired
		fmt.Println("Fetching new access token...")
		// fetch the new token info
		// save the new token info
	}
}

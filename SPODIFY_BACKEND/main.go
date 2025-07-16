package main

import (
	"SPODIFY_BACKEND/accesstokenmanifestation"
	"fmt"
)

func main() {
	tokenData := accesstokenmanifestation.ManifestAccessToken()
	fmt.Println(tokenData.AccessToken)
}

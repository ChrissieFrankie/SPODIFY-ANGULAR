package main

import (
	accesstoken "SPODIFY_BACKEND/accesstoken"
	"fmt"
)

func main() {
	tokenData := accesstoken.Manifest()
	fmt.Println(tokenData.AccessToken)
}

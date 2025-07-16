package recordspotify

import (
	"encoding/json"
	"fmt"
	"net/http"
)

func getUserPlaylists(accessToken, userID string) (map[string]string, error) {
	url := fmt.Sprintf("https://api.spotify.com/v1/users/%s/playlists", userID) // request api url
	req, _ := http.NewRequest("GET", url, nil)                                  // http request
	req.Header.Set("Authorization", "Bearer "+accessToken)                      // setup header
	resp, err := http.DefaultClient.Do(req)                                     // execute request to get response
	if err != nil {
		return nil, fmt.Errorf("failed to fetch playlists: %w", err)
	}
	defer resp.Body.Close() // done reading body
	var result struct {     // list of playlists
		Items []struct {
			ID   string `json:"id"`
			Name string `json:"name"`
		} `json:"items"`
	}

	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil { // decode json result
		return nil, fmt.Errorf("failed to decode playlists: %w", err)
	}

	playlists := make(map[string]string)    // create map
	for _, playlist := range result.Items { // load map
		playlists[playlist.ID] = playlist.Name
	}

	return playlists, nil
}

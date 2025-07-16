package recordspotify

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
)

type TrackInfo struct {
	ID      string
	Name    string
	Album   string
	Artists []string
}

func getAllPlaylistsTracks(accessToken string, playlists map[string]string) (map[string]map[string]TrackInfo, error) {
	result := make(map[string]map[string]TrackInfo) // initialize map

	for playlistID := range playlists { // loop through playlists
		tracks, err := getPlaylistTracks(accessToken, playlistID) // load tracks
		if err != nil {
			log.Printf("Failed to fetch tracks for playlist %s: %v", playlistID, err)
			continue
		}
		result[playlistID] = tracks // record tracks
	}

	return result, nil
}

func getPlaylistTracks(accessToken, playlistID string) (map[string]TrackInfo, error) {
	url := fmt.Sprintf("https://api.spotify.com/v1/playlists/%s/tracks", playlistID) // request api url
	req, _ := http.NewRequest("GET", url, nil)                                       // http request
	req.Header.Set("Authorization", "Bearer "+accessToken)                           // setup header

	resp, err := http.DefaultClient.Do(req) // execute request to get response
	if err != nil {
		return nil, fmt.Errorf("failed to fetch tracks: %w", err)
	}
	defer resp.Body.Close() // done reading body

	var result struct { // list of songs
		Items []struct {
			Track struct {
				ID    string `json:"id"`
				Name  string `json:"name"`
				Album struct {
					Name string `json:"name"`
				} `json:"album"`
				Artists []struct {
					Name string `json:"name"`
				} `json:"artists"`
			} `json:"track"`
		} `json:"items"`
	}

	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil { // decode json result
		return nil, fmt.Errorf("failed to decode track info: %w", err)
	}

	tracks := make(map[string]TrackInfo) // create map
	for _, item := range result.Items {  // load map
		t := item.Track
		if t.ID == "" { // skip local or missing tracks
			continue
		}
		artistNames := []string{}
		for _, a := range t.Artists {
			artistNames = append(artistNames, a.Name)
		}
		tracks[t.ID] = TrackInfo{
			ID:      t.ID,
			Name:    t.Name,
			Album:   t.Album.Name,
			Artists: artistNames,
		}
	}
	return tracks, nil
}

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

func Capture(tokenData, userID string) map[string]map[string]TrackInfo { // return user playlists tracks
	userIDPlaylists, _ := getUserPlaylists(tokenData, userID)
	userIDPlaylistsTracks, _ := getAllPlaylistsTracks(tokenData, userIDPlaylists)
	return userIDPlaylistsTracks
}

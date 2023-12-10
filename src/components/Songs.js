import React from "react";
import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Select from "react-select";
import NavBar from "./NavBar";

// Define API URL
const API_ENDPOINT = process.env.REACT_APP_PROXY;

// Creates the songs table
function Songs() {

  // Setting variables and state
  const navigate = useNavigate();
  const [songs, setSongs] = useState([]);
  const [releaseMap, setReleaseMap] = useState([]);
  const [songName, setSongName] = useState("");
  const [singleSongName, setSingleSongName] = useState("");
  const [releaseID, setReleaseID] = useState("");
  const [genreID, setGenreID] = useState();
  const [genreMap, setGenreMap] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Function to retrieve songs
  const loadSongs = async () => {    
    const response = await fetch(`${API_ENDPOINT}/api/songs`);
    const data = await response.json();
    setSongs(data);
  }
  
  // function to load releases
  const loadReleases = async () => {
    const response = await fetch(`${API_ENDPOINT}/api/releases`);
    const data = await response.json();
    setReleaseMap(data.map((release) => (
      {value: release.release_id, label: release.release_name}
    )));
  }

  // function to load genres
  const loadGenres = async () => {
    const response = await fetch(`${API_ENDPOINT}/api/genres`);
    const data = await response.json();
    setGenreMap(data.map((genre) => (
      {value: genre.genre_id, label: genre.genre_name}
    )));
  }

  // Function to retrieve a single song
  const loadSingleSong = async (song_id) => {

    const response = await fetch(`${API_ENDPOINT}/api/songs/${song_id}`);
    const data = await response.json();
    setSongs(data);
}

  // function to create a new song
  const createSong = async () => {
      const newSong = {songName, releaseID, genreID}

      const response = await fetch(`${API_ENDPOINT}/api/songs`, {
          method: "POST",
          body: JSON.stringify(newSong),
          headers: {
              "content-type": "application/json"
          }
      });

      if (response.status === 200) {
          alert(`Added new song: ${songName}`);
          loadSongs();
      } else {
          alert("New song not added. Check required fields");
      }
  }

  const deleteSong = async (song_id, song_name) => {
      const response = await fetch(`${API_ENDPOINT}/api/songs/${song_id}`, {
          method: "DELETE"});

      if (response.status === 200){
          alert(`Deleted ${song_name}`);
          loadSongs();
      } else {
          alert("Song not deleted");
      }
  }

  const confirmDelete = (song_id, song_name) => {
    if (window.confirm(`Are you sure you want to delete ${song_name}?`)){
        deleteSong(song_id, song_name)
  } 
}

  const editSong = (song) => {     
      // navigate to edit page, sending state props to the edit page/component 
      navigate("/editSong", { state: { 
        songToEdit: song,
        releaseMap: releaseMap,
        genreMap: genreMap
      }});
  }

  const searchSongs = (searchQuery) => {
    navigate("/songSearchResults", { state: { 
      searchQuery: searchQuery
    }});
  }

  useEffect(() => {
      loadSongs();
      loadGenres();
      loadReleases();
  }, []);

  return (
    <div>
      <NavBar></NavBar>
      <h2>Songs</h2>

      <div className="search-container">
        <h3>Search for a Song</h3>
        <form action="" className="search-form">
          <label for="searchQuery"></label>
          <input
            type="text"
            name="searchQuery"
            className="form-create-input" 
            onChange={e => setSearchQuery(e.target.value)}></input>
          <button 
            className="search-button edit-button"
            onClick={() => {searchSongs(searchQuery)}}
            >Search</button>
          </form>
        </div>

      <form className="form-create" action="">
        <h3 className="form-title">Add a new Song</h3>
        <label for="songName">Song Name: </label>
        <input 
          name="songName"
          type="text" 
          id="song-name" 
          className="form-create-input" 
          onChange={e => setSongName(e.target.value)}
        />
        <label for="releaseID">Release: </label>
        <Select 
          options={releaseMap}
          onChange={(selected) => setReleaseID(selected.value)}
          name="releaseID"
          id="release-id" 
        />
        <label for="genreID">Genre: </label>
        <Select 
          options={genreMap}
          onChange={(selected) => setGenreID(selected.value)}
          name="genreID"
          id="genreID" 
        />
        <button 
          type="button" 
          className="form-button add-button"
          onClick = {() => createSong()}
        >Add</button>
      </form>

      <div className="table-container">
      <h3 className="table-title">Song List</h3>
        <table className="table">
          <thead>
            <tr className="table-heading">
              <th>ID</th>
              <th>Song</th>
              <th>Release Name</th>
              <th>Genre</th>
              <th>Stream Count</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {songs.map((song) => (
              <tr className="table-rows">
                <td>{song.song_id}</td>
                <td>{song.song_name}</td>
                <td>{song.release_name}</td>
                <td>{song.genre_name}</td>
                <td>{song.stream_count}</td>
                <td className="table-button">
                    <button 
                      className="edit-button"
                      onClick={() => editSong(song)}
                    >Edit</button>
                </td>
                <td className="table-button">
                    <button
                      className="delete-button"
                      onClick={() => confirmDelete(song.song_id, song.song_name)}
                    >Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Songs;
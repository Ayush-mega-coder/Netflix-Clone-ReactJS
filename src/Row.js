import React, { useState, useEffect } from "react";
import axios from "./axios";
import "./Row.css";
import Youtube from 'react-youtube';
import movieTrailer from "movie-trailer";

const base_url = "https://image.tmdb.org/t/p/original/";

//in this fun we are passing isLargeRow prop from app.js to specify that it is large row
function Row({ title, fetchUrl, isLargeRow }) {
  const [movies, setMovies] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState("");

  //A snippet of code which runs based on a specific condition

  useEffect(() => {
    //if [], run once when the row loads and dont run again
    //if we add anything inside [] then everytime something is added to that the function runs again
    async function fetchData() {
      const request = await axios.get(fetchUrl);
      setMovies(request.data.results);
      return request;
    }
    fetchData();
  }, [fetchUrl]);

  const opts = {
    height: "390",
    width: "100%",
    playerVars:{
      //https://developers.google.com/youtube/player_parameters
      autoplay: 1,
    }

  };

  const handleClick = (movie)=>{
    if(trailerUrl){
      setTrailerUrl('');
    }
      else{
        movieTrailer(movie?.name || "")
        .then(url => {
          const urlParams = new URLSearchParams(new URL(url).search);
          setTrailerUrl(urlParams.get('v'));

        }).catch((error)=> console.log(error));
      }
    };



  return (
    <div className="row">
      {/* title */}
      <h2>{title}</h2>

      <div className="row_posters">
        {movies.map((movie) => (
          <img
            key={movie.id}
            //adding on click for trailer popup
            onClick={()=> handleClick(movie)}
            //if it is large row that show other poster and else show another
            className={`row_poster ${isLargeRow && "row_posterLarge"} `}
            src={`${base_url}${
              isLargeRow ? movie.poster_path : movie.backdrop_path
            }`}
            alt={movie.name}
          />
        ))}
      </div>
      {trailerUrl && <Youtube videoId={trailerUrl} opts={opts}/>}
    </div>
  );
}

export default Row;

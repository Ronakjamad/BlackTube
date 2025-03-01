import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
  const [videos, setVideos] = useState([]);
  const [title, setTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);

  // Fetch videos from backend
  useEffect(() => {
    axios.get("https://blacktube-backend.onrender.com/videos")

      .then((response) => setVideos(response.data))
      .catch((error) => console.error("Error fetching videos:", error));
  }, []);

  // Handle file selection
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  // Upload video
  const handleUpload = async () => {
    if (!selectedFile || !title) {
      alert("Please provide a title and select a video.");
      return;
    }

    const formData = new FormData();
    formData.append("video", selectedFile);
    formData.append("title", title);

    try {
      const response = await axios.post(
        "http://localhost:5000/upload",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setVideos([...videos, response.data.video]);
      setTitle("");
      setSelectedFile(null);
      alert("Video uploaded successfully!");
    } catch (error) {
      console.error("Error uploading video:", error);
      alert("Failed to upload video.");
    }
  };

  // Handle Video Selection for Playing
  const handleVideoSelect = (video) => {
    setSelectedVideo(video);
  };

  return (
    <div className="container">
      <h1>🎥 BlackTube</h1>

      {/* Video Upload Section */}
      <div className="auth-container">
        <h2>Upload a Video</h2>
        <input
          type="text"
          placeholder="Enter video title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input type="file" accept="video/*" onChange={handleFileChange} />
        <button onClick={handleUpload}>Upload</button>
      </div>

      {/* Video Player Section */}
      {selectedVideo && (
        <div className="video-player">
          <video width="720" height="400" controls>
            <source
              src={`http://localhost:5000/uploads/${selectedVideo.filename}`}
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
          <h3>{selectedVideo.title}</h3>
        </div>
      )}

      {/* Display Uploaded Videos */}
      <h2>📺 Video Library</h2>
      <div className="video-container">
        {videos.length > 0 ? (
          videos.map((video) => (
            <button
              key={video._id}
              onClick={() => handleVideoSelect(video)}
              className="video-card"
            >
              {video.title}
            </button>
          ))
        ) : (
          <p>No videos uploaded yet.</p>
        )}
      </div>
    </div>
  );
};

export default App;

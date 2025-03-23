import React, { useState } from "react";
import "./Card.css";

const Card = ({ project, isLiked, toggleLike }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = project.images || [{ original: project.image }];

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleLikeClick = () => {
    toggleLike(project.id);
  };

  return (
    <div
      className="card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="card-image-container">
        <img
          src={images[currentImageIndex].original}
          alt={project.title}
          className="card-image"
        />
        <span className="badge">NEW BUILDING</span>
        <span
          className={`heart-icon ${isLiked ? "liked" : ""}`}
          onClick={handleLikeClick}
        >
          <span>{isLiked ? "❤️" : "♡"}</span>
        </span>
        {isHovered && images.length > 1 && (
          <div className="slider-controls">
            <button className="slider-btn prev" onClick={handlePrevImage}>
              ◄
            </button>
            <button className="slider-btn next" onClick={handleNextImage}>
              ►
            </button>
          </div>
        )}
      </div>
      <div className="card-content">
        <div className="card-header">
          <h3 className="card-title">{project.title}</h3>
          <span className="card-price">${project.price.toLocaleString()}</span>
        </div>
        <p className="card-address">• {project.address}</p>
        <div className="card-details">
          <span>🛏️ {project.beds} Beds</span>
          <span>🛁 {project.baths} Baths</span>
          <span>📏 {project.size} sqft</span>
        </div>
      </div>
    </div>
  );
};

export default Card;

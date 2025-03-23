import React from 'react';
import Card from '../Card/Card';
import './Grid.css';

const Grid = ({ projects, likedProjects, toggleLike }) => {
  return (
    <div className="grid">
      {projects.map((project) => (
        <Card
          key={project.id}
          project={project}
          isLiked={likedProjects.includes(project.id)}
          toggleLike={toggleLike}
        />
      ))}
    </div>
  );
};

export default Grid;
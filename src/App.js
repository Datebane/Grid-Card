import React from "react";
import Grid from "./components/Grid/Grid";
import Pagination from "./components/Pagination/Pagination";
import "./App.css";

const App = () => {
  const [projects, setProjects] = React.useState([]);
  const [currentPage, setCurrentPage] = React.useState(() => {
    const savedPage = localStorage.getItem("currentPage");
    return savedPage ? parseInt(savedPage, 10) : 0;
  });
  const [totalPages, setTotalPages] = React.useState(1);
  const [error, setError] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [likedProjects, setLikedProjects] = React.useState(() => {
    const savedLikes = localStorage.getItem("likedProjects");
    return savedLikes ? JSON.parse(savedLikes) : [];
  });

  React.useEffect(() => {
    localStorage.removeItem("likedProjects");
    localStorage.removeItem("currentPage");
  }, []);

  React.useEffect(() => {
    localStorage.setItem("likedProjects", JSON.stringify(likedProjects));
  }, [likedProjects]);

  React.useEffect(() => {
    localStorage.setItem("currentPage", currentPage.toString());
  }, [currentPage]);

  const fetchProjects = async (page) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://crm.server.pro-part.es/api/v1/secondary-projects/integration/projects?accessKey=A7gjfjj0WdBynt8d&secretKey=tGH5UlZcgNtAPrfq9MnmMhWji9j5vYXn&isPagination=true&size=30&page=${page}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch projects: ${response.statusText} (Status: ${response.status})`
        );
      }

      const data = await response.json();
      console.log("API Response:", data);

      if (!data || typeof data !== "object") {
        throw new Error("Invalid API response: Response is not an object");
      }

      const items = Array.isArray(data.projects) ? data.projects : [];
      if (!items.length) {
        console.log("No projects found in response. Response structure:", data);
      }

      const transformedProjects = items.map((item, index) => {
        console.log("Processing item:", item);
        return {
          id: item._id || `project-${page}-${index}`,
          title: item.generalInfo?.name || "Unnamed Project",
          price: item.generalInfo?.price || 0,
          address: item.generalInfo?.province || "Unknown Location",
          beds: item.generalInfo?.rooms || 0,
          baths: item.generalInfo?.bathrooms || 0,
          size: item.generalInfo?.size || 0,
          image:
            item.images?.[0]?.original || "https://via.placeholder.com/350x200",
          images: item.images || [],
        };
      });

      const sortedProjects = transformedProjects.sort((a, b) =>
        a.id.localeCompare(b.id)
      );

      setProjects(sortedProjects);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchProjects(currentPage);
  }, [currentPage]);

  const handlePageChange = (page) => {
    if (page < 1) return;
    setCurrentPage(page - 1);
  };

  const toggleLike = (projectId) => {
    setLikedProjects((prev) =>
      prev.includes(projectId)
        ? prev.filter((id) => id !== projectId)
        : [...prev, projectId]
    );
  };

  return (
    <div className="app">
      <h1>Project Listing</h1>
      {loading && <p className="loading">Loading...</p>}
      {error && <p>Error: {error}. Please try again later.</p>}
      {!loading && !error && projects.length === 0 && (
        <p>
          No projects found. Try adjusting the page or check if the API is
          returning data.
        </p>
      )}
      {!loading && !error && projects.length > 0 && (
        <>
          <Grid
            projects={projects}
            likedProjects={likedProjects}
            toggleLike={toggleLike}
          />
          <Pagination
            currentPage={currentPage + 1}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};

export default App;

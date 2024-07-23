import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import parse from 'html-react-parser'; // Import html-react-parser
import './Profile.css'; // Import the CSS file for styling
import twitterLogo from '../../assets/logos/twitter-logo.png';
import mediumLogo from '../../assets/logos/medium-logo.png';

const Profile = () => {
  const [author, setAuthor] = useState(null);
  const [tab, setTab] = useState("about");
  const [visiblePosts, setVisiblePosts] = useState([]);
  const [postsToShow, setPostsToShow] = useState(5); // Number of posts to be displayed initially
  const [sortOption, setSortOption] = useState("date"); // Default sorting option is set to Latest

  useEffect(() => {
    fetch("/data/author.json")
      .then((response) => response.json())
      .then((data) => {
        setAuthor(data.author);
        setVisiblePosts(data.author.posts.slice(0, postsToShow));
      });
  }, [postsToShow]);

  // Load 5 more posts when the user scrolls

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        setPostsToShow((prevPostsToShow) => prevPostsToShow + 5); 
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle sorting of posts

  useEffect(() => {
    if (author) {
      let sortedPosts = [...author.posts];
      if (sortOption === "date") {
        sortedPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
      } else if (sortOption === "views") {
        sortedPosts.sort((a, b) => b.views - a.views);
      }
      setVisiblePosts(sortedPosts.slice(0, postsToShow));
    }
  }, [author, sortOption, postsToShow]);

  const extractFirstParagraphText = (htmlString) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");
    const firstParagraph = doc.querySelector("p");
    return firstParagraph ? firstParagraph.textContent.substring(0, 100) : "";
  };

  // Formatting date
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();

    let daySuffix;
    if (day === 1 || day === 21 || day === 31) {
      daySuffix = "st";
    } else if (day === 2 || day === 22) {
      daySuffix = "nd";
    } else if (day === 3 || day === 23) {
      daySuffix = "rd";
    } else {
      daySuffix = "th";
    }

    return `${day}${daySuffix} ${month} ${year}`;
  };

  
  if (!author) return <div className="loading-screen">Loading</div>;

  return (
    <div className="profile-container">
      <section className="author-info">
        <img src={author.profilePicture} alt="Profile" className="profile-picture" />
        <div className="author-details">
          <h1>{author.name}</h1>
          <p>{author.shortDescription}</p>
          <div className="social-links">
            <a href="https://x.com/bethnoveck" target="_blank" rel="noopener noreferrer">
              <img src={twitterLogo} alt="Twitter" className="social-logo" />
            </a>
            <a href="https://bethnoveck.medium.com/" target="_blank" rel="noopener noreferrer">
              <img src={mediumLogo} alt="Medium" className="social-logo" />
            </a>
          </div>
        </div>
      </section>
      <section>
        <div className="tab-buttons">
          <button
            className={tab === "about" ? "active-tab" : "inactive-tab"}
            onClick={() => setTab("about")}
          >
            About Me
          </button>
          <button
            className={tab === "posts" ? "active-tab" : "inactive-tab"}
            onClick={() => setTab("posts")}
          >
            Posts
          </button>
        </div>
        {tab === "about" ? (
          <div className="about-section">
            {/* Parse and render the HTML content of aboutMe */}
            {author.aboutMe && parse(author.aboutMe)}
          </div>
        ) : (
          <div className="posts-list-section">
            <div className="sort-container">
              <span className="sort-by-text">Sort By:</span>
              <select
                className="sort-dropdown"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="date">Latest</option>
                <option value="views">Popularity</option>
              </select>
            </div>
            <ul>
              {visiblePosts.map((post) => (
                <li key={post.id} className="post-list-item">
                  <Link to={`/post/${post.id}`} className="post-item-link">
                    <div className="post-list-content">
                      <div className="post-list-text">
                        <h5>{post.title}</h5>
                        <p>{extractFirstParagraphText(post.body)}...</p>
                        <span className="post-list-date">{formatDate(post.date)}</span>
                      </div>
                      <img src={post.picture} alt={post.title} className="post-list-image" />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </div>
  );
};

export default Profile;

import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import parse from 'html-react-parser';
import { Badge } from 'react-bootstrap';
import './Post.css'; 

const Post = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [author, setAuthor] = useState(null);
  const [selection, setSelection] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const bodyRef = useRef(null);

  useEffect(() => {
    fetch('/data/author.json')
      .then((response) => response.json())
      .then((authorData) => {
        const foundPost = authorData.author.posts.find((post) => post.id === id);
        setPost(foundPost);
        setAuthor(authorData.author);
      });
  }, [id]);

  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const selectedText = selection.toString();
        const { startContainer, endContainer } = range;

        // Ensure selection is within a single text node
        if (selectedText.length > 0 && selectedText.length <= 280 && startContainer === endContainer && startContainer.nodeType === 3) {
          const rect = range.getBoundingClientRect();
          setSelection(range);
          setMenuPosition({ x: rect.left + window.scrollX, y: rect.bottom + window.scrollY });
          setShowMenu(true);
        } else {
          setShowMenu(false);
        }
      } else {
        setShowMenu(false);
      }
    };

    document.addEventListener('mouseup', handleSelection);
    return () => {
      document.removeEventListener('mouseup', handleSelection);
    };
  }, []);

  const handleHighlight = () => {
    if (selection) {
      const range = selection.cloneRange();
      const span = document.createElement('span');
      span.className = 'highlight';
      range.surroundContents(span);

      window.getSelection().removeAllRanges();
      setSelection(null);
      setShowMenu(false);
    }
  };

  const handleTweet = () => {
    const selectedText = window.getSelection().toString();
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(selectedText)}`;
    window.open(tweetUrl, '_blank');
  };

  const handleShare = () => {
    navigator.clipboard.writeText('https://rebootdemocracy.ai/');
    setPopupMessage('Link Copied!');
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 2000);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();

    const suffix = (day) => {
      if (day > 3 && day < 21) return 'th';
      switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
      }
    };

    return `${day}${suffix(day)} ${month} ${year}`;
  };

  if (!post || !author) return <div className='loading-screen'>Loading...</div>;

  return (
    <div className="post-container">
      <h1 className="post-title">{post.title}</h1>
      <div className="author-info">
        <Link to={`/`}>
          <img src={author.profilePicture} alt={author.name} className="author-picture" />
        </Link>
        <div>
          <Link to={`/`} className="author-name">
            {author.name}
          </Link>
          <p className="post-date">{formatDate(post.date)}</p>
        </div>
      </div>
      <div className="share-container">
        <button className="share-button" onClick={handleShare}>Share Article</button>
      </div>
      <img src={post.picture} alt={post.title} className="post-image" />
      <div ref={bodyRef} className="post-body">{parse(post.body)}</div>
      <div className="tags-container">
        {post.tags.map((tag, index) => (
          <Badge key={index} bg="primary" className="tag-badge">{tag}</Badge>
        ))}
      </div>
      {showMenu && (
        <div
          className="context-menu"
          style={{
            top: `${menuPosition.y}px`,
            left: `${menuPosition.x}px`,
            zIndex: 1000,
          }}
        >
          <button onClick={handleHighlight}>Highlight</button>
          <button onClick={handleTweet}>Tweet</button>
        </div>
      )}
      {showPopup && (
        <div className="copy-popup">{popupMessage}</div>
      )}
    </div>
  );
};

export default Post;

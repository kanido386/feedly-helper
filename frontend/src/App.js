import { useState } from 'react';
import './App.css';

function parseArticles(result) {
  if (!result) return [];
  return result
    .split('\n')
    .map(line => {
      const match = line.match(/\(([^)]+)\)/);
      return match ? match[1] : null;
    })
    .filter(Boolean);
}

function App() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);
  const [copied, setCopied]     = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/feedly`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      const { result } = await response.json();
      setArticles(parseArticles(result));
    } catch (err) {
      setError(err.message || 'Failed to fetch articles.');
    } finally {
      setLoading(false);
    }
  };

  const copyAll = async () => {
    const text = articles.map(url => `- [${url}](${url})`).join('\n');
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="App">
      <div className="App-container">

        <div className="App-topbar">
          <div className="App-brand">
            <span className="App-brand-icon">✦</span>
            <h1 className="App-title">Feedly Helper</h1>
          </div>
          <button className="App-button" onClick={fetchData} disabled={loading}>
            {loading ? (
              <span className="App-button-loading">
                <span className="dot">·</span>
                <span className="dot">·</span>
                <span className="dot">·</span>
              </span>
            ) : 'Fetch'}
          </button>
        </div>

        {error && <div className="App-error">{error}</div>}

        {!loading && !error && articles.length > 0 && (
          <div className="App-results">
            <div className="App-meta">
              <span className="App-count">{articles.length} unread articles</span>
              <button className="App-copy-button" onClick={copyAll}>
                {copied ? '✓ Copied!' : 'Copy all'}
              </button>
            </div>
            <ul className="App-list">
              {articles.map((url, index) => {
                const hostname = new URL(url).hostname;
                const path = new URL(url).pathname;
                return (
                  <li key={index} className="App-list-item" style={{ '--i': Math.min(index, 20) }}>
                    <a href={url} target="_blank" rel="noopener noreferrer">
                      <span className="App-item-index">{index + 1}</span>
                      <img
                        className="App-favicon"
                        src={`https://www.google.com/s2/favicons?domain=${hostname}&sz=32`}
                        alt=""
                      />
                      <span className="App-item-content">
                        <span className="App-article-domain">{hostname}</span>
                        <span className="App-article-path">{path}</span>
                      </span>
                      <span className="App-item-arrow">→</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {!loading && !error && articles.length === 0 && (
          <p className="App-empty">No articles fetched yet.</p>
        )}

      </div>
    </div>
  );
}

export default App;

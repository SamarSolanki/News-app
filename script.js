const apiKey = '33f9cd48429445bd93dcc40cb59a6e71';
const newsContainer = document.getElementById('news-container');

async function fetchNews(category = 'general', isFallback = false) {
  let url;

  if (!isFallback) {
    url = `https://newsapi.org/v2/top-headlines?country=us&category=${category}&pageSize=10&apiKey=${apiKey}`;
  } else {
    url = `https://newsapi.org/v2/everything?q=${category}&sortBy=publishedAt&pageSize=10&language=en&apiKey=${apiKey}`;
  }

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'ok' && data.articles.length > 0) {
      displayArticles(data.articles, isFallback);
    } else if (!isFallback) {
      fetchNews(category, true); // fallback to old news
    } else {
      newsContainer.innerHTML = `<p>No news found even in older articles for <strong>${category}</strong>.</p>`;
    }
  } catch (error) {
    console.error('Error fetching news:', error);
    newsContainer.innerHTML = '<p>⚠️ Failed to load news. Please check your internet connection.</p>';
  }
}

function displayArticles(articles, isFallback = false) {
  newsContainer.innerHTML = '';

  if (isFallback) {
    const fallbackLabel = document.createElement('p');
    fallbackLabel.textContent = '🔁 Showing older articles due to no recent updates.';
    fallbackLabel.style.textAlign = 'center';
    fallbackLabel.style.color = '#ffcc00';
    newsContainer.appendChild(fallbackLabel);
  }

  articles.forEach(article => {
    const articleEl = document.createElement('div');
    articleEl.className = 'article';

    const publishedAt = new Date(article.publishedAt);
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    };
    const formattedDate = publishedAt.toLocaleString('en-US', options);

    articleEl.innerHTML = `
      <img src="${article.urlToImage || 'https://via.placeholder.com/300x180'}" alt="News Image" />
      <div class="article-content">
        <h3>${article.title}</h3>
        <p class="pub-date">📅 ${formattedDate}</p>
        <a href="${article.url}" target="_blank">Read more</a>
      </div>
    `;
    newsContainer.appendChild(articleEl);
  });
}

function updateLiveTime() {
  const now = new Date();
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  };

  const formatted = now.toLocaleString('en-US', options);
  document.getElementById('live-date-time').textContent = `🗓️ ${formatted}`;
}

// Start live time
setInterval(updateLiveTime, 1000);
updateLiveTime();

// Load default news
fetchNews();

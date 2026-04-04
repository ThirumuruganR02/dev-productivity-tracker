const express = require('express');
const router = express.Router();

// GET /api/github/commits — Fetch real commits from GitHub
router.get('/commits', async (req, res) => {
  try {
    const username = process.env.GITHUB_USERNAME;

    // Fetch all repos first
    const reposRes = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=10&sort=updated`,
      { headers: { 'User-Agent': 'dev-productivity-tracker' } }
    );
    const repos = await reposRes.json();

    // Fetch recent commits from each repo
    const commitPromises = repos.slice(0, 5).map(async (repo) => {
      const commitsRes = await fetch(
        `https://api.github.com/repos/${username}/${repo.name}/commits?per_page=5`,
        { headers: { 'User-Agent': 'dev-productivity-tracker' } }
      );
      const commits = await commitsRes.json();
      if (!Array.isArray(commits)) return [];
      return commits.map(c => ({
        repo: repo.name,
        message: c.commit.message,
        date: c.commit.author.date,
        author: c.commit.author.name
      }));
    });

    const allCommits = (await Promise.all(commitPromises)).flat();
    allCommits.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json({ username, totalCommits: allCommits.length, commits: allCommits.slice(0, 20) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/github/stats — GitHub summary stats
router.get('/stats', async (req, res) => {
  try {
    const username = process.env.GITHUB_USERNAME;

    const userRes = await fetch(
      `https://api.github.com/users/${username}`,
      { headers: { 'User-Agent': 'dev-productivity-tracker' } }
    );
    const user = await userRes.json();

    const reposRes = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=100`,
      { headers: { 'User-Agent': 'dev-productivity-tracker' } }
    );
    const repos = await reposRes.json();

    // Count languages
    const languages = {};
    repos.forEach(r => {
      if (r.language) {
        languages[r.language] = (languages[r.language] || 0) + 1;
      }
    });

    res.json({
      username: user.login,
      name: user.name,
      publicRepos: user.public_repos,
      followers: user.followers,
      topLanguages: languages,
      recentRepos: repos.slice(0, 5).map(r => ({
        name: r.name,
        language: r.language,
        stars: r.stargazers_count,
        updatedAt: r.updated_at
      }))
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
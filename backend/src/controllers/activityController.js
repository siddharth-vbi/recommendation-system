import { View, Like, Search, Template } from '../models/index.js';
import sequelize from '../config/database.js';

export async function trackView(req, res) {
  const { templateId } = req.body;
  if (!templateId) return res.status(400).json({ error: 'templateId required' });

  await View.create({ templateId, userId: req.userId });
  res.json({ success: true });
}

export async function toggleLike(req, res) {
  const { templateId } = req.body;
  if (!templateId) return res.status(400).json({ error: 'templateId required' });

  const existing = await Like.findOne({ where: { templateId, userId: req.userId } });

  if (existing) {
    await existing.destroy();
    return res.json({ liked: false });
  }

  await Like.create({ templateId, userId: req.userId });
  res.json({ liked: true });
}

export async function trackSearch(req, res) {
  const { query } = req.body;
  if (!query || !query.trim()) return res.status(400).json({ error: 'query required' });

  await Search.create({ query: query.trim(), userId: req.userId });
  res.json({ success: true });
}

export async function getRecentSearches(req, res) {
  const searches = await Search.findAll({
    where: { userId: req.userId },
    order: [['createdAt', 'DESC']],
    limit: 10,
    raw: true,
  });
  res.json(searches);
}

export async function getLikedIds(req, res) {
  const likes = await Like.findAll({
    where: { userId: req.userId },
    attributes: ['templateId'],
    raw: true,
  });
  res.json(likes.map((l) => l.templateId));
}

export async function getViewCounts(req, res) {
  const counts = await View.findAll({
    where: { userId: req.userId },
    attributes: [
      'templateId',
      [sequelize.fn('COUNT', sequelize.col('templateId')), 'count'],
    ],
    group: ['templateId'],
    raw: true,
  });

  const result = {};
  counts.forEach((row) => {
    result[row.templateId] = parseInt(row.count, 10);
  });
  res.json(result);
}

export async function getCategoryViewCounts(req, res) {
  const templates = await Template.findAll({ raw: true });
  const templateMap = {};
  templates.forEach((t) => { templateMap[t.id] = t; });

  const viewRows = await View.findAll({
    where: { userId: req.userId },
    attributes: ['templateId'],
    raw: true,
  });
  const counts = {};

  viewRows.forEach((v) => {
    const t = templateMap[v.templateId];
    if (t) {
      counts[t.category] = (counts[t.category] || 0) + 1;
    }
  });

  res.json(counts);
}

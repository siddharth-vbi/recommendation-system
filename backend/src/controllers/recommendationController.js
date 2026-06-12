import { Template, View, Like } from '../models/index.js';
import sequelize from '../config/database.js';
import {
  getSimilarTemplates,
  getPersonalizedRecommendations,
  getTrendingTemplates,
  getMostViewedTemplates,
} from '../services/recommendationService.js';

export async function getSimilar(req, res) {
  const currentTemplate = await Template.findByPk(req.params.id, { raw: true });
  if (!currentTemplate) return res.status(404).json({ error: 'Template not found' });

  const allTemplates = await Template.findAll({ raw: true });
  const similar = getSimilarTemplates(currentTemplate, allTemplates);
  res.json(similar);
}

export async function getPersonalized(req, res) {
  const allTemplates = await Template.findAll({ raw: true });

  const viewRows = await View.findAll({
    where: { userId: req.userId },
    attributes: ['templateId'],
    order: [['createdAt', 'DESC']],
    raw: true,
  });

  const likeRows = await Like.findAll({
    where: { userId: req.userId },
    raw: true,
  });

  const viewedIds = new Set(viewRows.map((v) => v.templateId));
  const likedIds = new Set(likeRows.map((l) => l.templateId));
  const categoryCounts = {};

  viewRows.forEach((v) => {
    const t = allTemplates.find((tpl) => tpl.id === v.templateId);
    if (t) {
      categoryCounts[t.category] = (categoryCounts[t.category] || 0) + 1;
    }
  });

  const recommendations = getPersonalizedRecommendations(
    allTemplates,
    categoryCounts,
    likedIds,
    viewedIds
  );
  res.json(recommendations);
}

export async function getTrending(req, res) {
  const allTemplates = await Template.findAll({ raw: true });

  const viewRows = await View.findAll({
    where: { userId: req.userId },
    attributes: ['templateId'],
    order: [['createdAt', 'DESC']],
    raw: true,
  });

  const viewedIds = viewRows.map((v) => v.templateId);
  const trending = getTrendingTemplates(allTemplates, viewedIds);
  res.json(trending);
}

export async function getMostViewed(req, res) {
  const allTemplates = await Template.findAll({ raw: true });

  const counts = await View.findAll({
    where: { userId: req.userId },
    attributes: [
      'templateId',
      [sequelize.fn('COUNT', sequelize.col('templateId')), 'count'],
    ],
    group: ['templateId'],
    order: [[sequelize.fn('COUNT', sequelize.col('templateId')), 'DESC']],
    raw: true,
  });

  const viewCounts = {};
  counts.forEach((row) => {
    viewCounts[row.templateId] = parseInt(row.count, 10);
  });

  const mostViewed = getMostViewedTemplates(allTemplates, viewCounts);
  res.json(mostViewed);
}

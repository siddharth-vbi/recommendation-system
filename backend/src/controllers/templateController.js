import { Template } from '../models/index.js';
import {
  CATEGORIES,
  filterTemplates,
  getSearchSuggestions,
} from '../services/recommendationService.js';

export async function getCategories(req, res) {
  res.json(CATEGORIES);
}

export async function getTemplates(req, res) {
  const { search, category } = req.query;
  const templates = await Template.findAll({ raw: true });
  const filtered = filterTemplates(templates, search || '', category || 'All');
  res.json(filtered);
}

export async function getTemplateById(req, res) {
  const template = await Template.findByPk(req.params.id, { raw: true });
  if (!template) return res.status(404).json({ error: 'Template not found' });
  res.json(template);
}

export async function getSuggestions(req, res) {
  const { query } = req.query;
  if (!query) return res.json([]);
  const templates = await Template.findAll({ raw: true });
  const suggestions = getSearchSuggestions(query, templates);
  res.json(suggestions);
}

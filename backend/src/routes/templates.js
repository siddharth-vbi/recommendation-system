import { Router } from 'express';
import {
  getCategories,
  getTemplates,
  getTemplateById,
  getSuggestions,
} from '../controllers/templateController.js';

const router = Router();

router.get('/categories', getCategories);
router.get('/', getTemplates);
router.get('/suggestions', getSuggestions);
router.get('/:id', getTemplateById);

export default router;

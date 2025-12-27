const router = require('express').Router();
const liveFeedController = require('../controllers/live-feed');
const auth = require('../middleweares/auth');

// Routes publiques
router.get('/', liveFeedController.all);
router.get('/latest', liveFeedController.latest);
router.get('/breaking', liveFeedController.breaking);

// Routes admin
router.get('/admin/all', auth.checkManyRole(['administrateur', 'journaliste', 'redacteur']), liveFeedController.allForAdmin);
router.post('/', auth.checkManyRole(['administrateur', 'journaliste', 'redacteur']), liveFeedController.add);
router.put('/:id', auth.checkManyRole(['administrateur', 'journaliste', 'redacteur']), liveFeedController.update);
router.delete('/:id', auth.checkManyRole(['administrateur', 'journaliste', 'redacteur']), liveFeedController.delete);

module.exports = router;

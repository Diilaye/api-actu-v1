const router = new require('express').Router();

router.get('/dashboard-stats', require('../middleweares/auth').checkManyRole(['administrateur', 'journaliste', 'redacteur']), require('../controllers/dashboard').getStats);

module.exports = router;

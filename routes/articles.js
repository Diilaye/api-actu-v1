const router = new require('express').Router();


router.get('/', require('../controllers/article').all);
router.get('/top', require('../controllers/article').topArticle);
router.get('/une', require('../controllers/article').uneArticles);
router.get('/article/:slug', require('../controllers/article').slug);


router.post('/', require('../middleweares/auth').checkManyRole(['administrateur','journaliste' ,'redacteur']), require('../controllers/article').add);

router.put('/active/:id',  require('../middleweares/auth').checkManyRole(['administrateur','journaliste' ,'redacteur']), require('../controllers/article').ActiveArticle);
router.put('/:id',  require('../middleweares/auth').checkManyRole(['administrateur','journaliste' ,'redacteur']), require('../controllers/article').update);



module.exports = router;
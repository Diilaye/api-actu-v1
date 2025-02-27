const router = new require('express').Router();


router.get('/', require('../controllers/article').all);
router.get('/top', require('../controllers/article').topArticle);
router.get('/une', require('../controllers/article').uneArticles);
router.get('/articleActualite', require('../controllers/article').articleActualite);
router.get('/articlePolitique', require('../controllers/article').articlePolitique);
router.get('/unePolitique', require('../controllers/article').unePolitique);
router.get('/articleEconomie', require('../controllers/article').articleEconomie);
router.get('/uneEconomie', require('../controllers/article').uneEconomie);
router.get('/articleInvestigation', require('../controllers/article').articleInvestigation);
router.get('/uneInvestigation', require('../controllers/article').uneInvestigation);
router.get('/articleContribution', require('../controllers/article').articleContribution);
router.get('/articleChoixRedac', require('../controllers/article').articleChoixRedac);
router.get('/articleSport', require('../controllers/article').articleSport);
router.get('/articleCulture', require('../controllers/article').articleCulture);
router.get('/articleAfrique', require('../controllers/article').articleAfrique);
router.get('/articleInternal', require('../controllers/article').articleInternal);
router.get('/article/:slug', require('../controllers/article').slug);


router.post('/', require('../middleweares/auth').checkManyRole(['administrateur','journaliste' ,'redacteur']), require('../controllers/article').add);

router.put('/active/:id',  require('../middleweares/auth').checkManyRole(['administrateur','journaliste' ,'redacteur']), require('../controllers/article').ActiveArticle);
router.put('/:id',  require('../middleweares/auth').checkManyRole(['administrateur','journaliste' ,'redacteur']), require('../controllers/article').update);



module.exports = router;
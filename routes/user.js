
const router = new require('express').Router();





router.get('/auth', require('../middleweares/auth').checkRole(''), require('../controllers/admin').getAuth);

// router.get('/import', require('../controllers/admin').importArticle);

router.post('/', require('../controllers/admin').store);

router.post('/auth', require('../controllers/admin').auth);

router.post('/client', require('../controllers/admin').addClient);

router.get('/', require('../controllers/admin').all);
// router.get('/', require('../middleweares/auth').checkRole('aministrateur'), require('../controllers/admin').all);

router.get(':id/', require('../middleweares/auth').checkRole('aministrateur'), require('../controllers/admin').one);

router.put('/:id', require('../middleweares/auth').checkRole(''), require('../controllers/admin').update);


module.exports = router;
const router = new require('express').Router();


router.get('/', require('../controllers/categories').all);

router.get('/slug/:slug', require('../controllers/categories').slug);

router.get('/:id', require('../controllers/categories').one);

router.put('/:id', require('../controllers/categories').update);

router.delete('/:id', require('../controllers/categories').delete);

router.post('/', require('../middleweares/auth').checkRole('aministrateur'), require('../controllers/categories').add);



module.exports = router;
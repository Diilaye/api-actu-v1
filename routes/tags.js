const router = new require('express').Router();


router.get('/', require('../controllers/tags').all);

router.get('/slug/:slug', require('../controllers/tags').slug);


router.get('/:id', require('../controllers/tags').one);

router.put('/:id', require('../controllers/tags').update);

router.delete('/:id', require('../controllers/tags').delete);

router.post('/', require('../middleweares/auth').checkRole('administrateur'),require('../controllers/tags').add);



module.exports = router;
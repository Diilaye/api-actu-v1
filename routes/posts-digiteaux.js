const router = new require('express').Router();


router.get('/', require('../controllers/posts-digiteaux').all);


router.post('/', require('../middleweares/auth').checkRole('administrateur'), require('../controllers/posts-digiteaux').add);

router.put('/:id', require('../middleweares/auth').checkRole('administrateur'), require('../controllers/posts-digiteaux').update);



module.exports = router;
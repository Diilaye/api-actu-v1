const router = new require('express').Router();


router.get('/', require('../controllers/emission').all);


router.post('/', require('../middleweares/auth').checkRole('administrateur'), require('../controllers/emission').add);

router.put('/:id', require('../middleweares/auth').checkRole('administrateur'), require('../controllers/emission').update);



module.exports = router;
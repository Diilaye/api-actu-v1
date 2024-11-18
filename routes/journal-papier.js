const router = new require('express').Router();


router.get('/', require('../controllers/journal-papier').all);


router.post('/', require('../middleweares/auth').checkRole('administrateur'), require('../controllers/journal-papier').add);

router.put('/:id', require('../middleweares/auth').checkRole('administrateur'), require('../controllers/journal-papier').update);



module.exports = router;
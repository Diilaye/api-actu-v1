const router = new require('express').Router();


router.get('/', require('../controllers/key-word').all);

router.get('/:id', require('../controllers/key-word').one);

router.put('/:id', require('../controllers/key-word').update);

router.delete('/:id', require('../controllers/key-word').delete);

router.post('/', require('../middleweares/auth').checkRole('aministrateur'),require('../controllers/key-word').add);



module.exports = router;
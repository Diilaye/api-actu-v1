const router = new require('express').Router();


router.get('/', require('../controllers/sous-rubrique').all);

router.get('/:id', require('../controllers/sous-rubrique').one);

router.put('/:id', require('../controllers/sous-rubrique').update);

router.delete('/:id', require('../controllers/sous-rubrique').delete);

router.post('/', require('../middleweares/auth').checkRole('aministrateur'),require('../controllers/sous-rubrique').add);



module.exports = router;
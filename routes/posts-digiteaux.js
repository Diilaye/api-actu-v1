const router = new require('express').Router();


router.get('/', require('../controllers/posts-digiteaux').all);


router.post('/', require('../middleweares/auth').checkManyRole(['administrateur' ,'redacteur']), require('../controllers/posts-digiteaux').add);

router.put('/:id', require('../middleweares/auth').checkManyRole(['administrateur' ,'redacteur']), require('../controllers/posts-digiteaux').update);



module.exports = router;
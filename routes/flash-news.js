const router = new require('express').Router();


router.get('/', require('../controllers/flash-news').all);


router.post('/',  require('../middleweares/auth').checkManyRole(['administrateur','journaliste' ,'redacteur']), require('../controllers/flash-news').add);

router.put('/:id',  require('../middleweares/auth').checkManyRole(['administrateur','journaliste' ,'redacteur']), require('../controllers/flash-news').update);



module.exports = router;
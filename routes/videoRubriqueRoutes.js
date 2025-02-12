const express = require('express');
const router = express.Router();
const videoRubriqueController = require('../controllers/videoRubriqueController');

// 🔹 Route pour ajouter une vidéo
router.post('/', videoRubriqueController.createVideo);

// 🔹 Route pour récupérer toutes les vidéos
router.get('/', videoRubriqueController.getAllVideos);

// 🔹 Route pour récupérer une vidéo par ID
router.get('/:id', videoRubriqueController.getVideoById);

// 🔹 Route pour mettre à jour une vidéo
router.put('/:id', videoRubriqueController.updateVideo);

// 🔹 Route pour supprimer une vidéo
router.delete('/:id', videoRubriqueController.deleteVideo);

module.exports = router;

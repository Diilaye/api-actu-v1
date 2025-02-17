const VideoRubrique = require('../models/video-rubrique');

// ✅ Créer une nouvelle vidéo
exports.createVideo = async (req, res) => {



    try {

        const { titre, emission, url ,image  , isLive} = req.body;

        const newVideo = new VideoRubrique({
            titre,
            emission,
            url,
            image,
            isLive
        });

        await newVideo.save();
        return  res.status(201).json({ message: "Vidéo ajoutée avec succès", video: newVideo });

    } catch (error) {
        res.status(500).json({ message: "Erreur lors de l'ajout de la vidéo", error });
    }
};

// ✅ Récupérer toutes les vidéos
exports.getAllVideos = async (req, res) => {
    try {
        const videos = await VideoRubrique.find().populate('image').sort({ createdAt: -1 }); // Trier par date décroissante
        res.status(200).json(videos);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des vidéos", error });
    }
};

// ✅ Récupérer une seule vidéo par ID
exports.getVideoById = async (req, res) => {
    try {
        const video = await VideoRubrique.findById(req.params.id).populate('image');
        if (!video) {
            return res.status(404).json({ message: "Vidéo non trouvée" });
        }
        res.status(200).json(video);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération de la vidéo", error });
    }
};

// ✅ Mettre à jour une vidéo
exports.updateVideo = async (req, res) => {
    try {
        const updatedVideo = await VideoRubrique.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('image');
        if (!updatedVideo) {
            return res.status(404).json({ message: "Vidéo non trouvée" });
        }
        res.status(200).json({ message: "Vidéo mise à jour avec succès", video: updatedVideo });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la mise à jour de la vidéo", error });
    }
};

// ✅ Supprimer une vidéo
exports.deleteVideo = async (req, res) => {
    try {
        const deletedVideo = await VideoRubrique.findByIdAndDelete(req.params.id);
        if (!deletedVideo) {
            return res.status(404).json({ message: "Vidéo non trouvée" });
        }
        res.status(200).json({ message: "Vidéo supprimée avec succès" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression de la vidéo", error });
    }
};

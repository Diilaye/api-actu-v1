const LiveFeedModel = require('../models/live-feed');

// Ajouter un nouveau feed live
exports.add = async (req, res) => {
    try {
        const liveFeed = new LiveFeedModel(req.body);
        await liveFeed.save();

        return res.status(201).json({
            message: 'Feed live ajouté avec succès',
            status: 'OK',
            data: liveFeed,
            statusCode: 201
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Erreur serveur',
            status: 'NOT OK',
            error: error.message,
            statusCode: 500
        });
    }
};

// Modifier un feed live
exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        req.body.dateModification = new Date();
        
        const liveFeed = await LiveFeedModel.findByIdAndUpdate(id, req.body, { new: true })
            .populate('categorie')
            .populate('image')
            .populate('auteur')
            .populate('article');

        if (!liveFeed) {
            return res.status(404).json({
                message: 'Feed live non trouvé',
                status: 'NOT OK',
                statusCode: 404
            });
        }

        return res.status(200).json({
            message: 'Feed live modifié avec succès',
            status: 'OK',
            data: liveFeed,
            statusCode: 200
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Erreur serveur',
            status: 'NOT OK',
            error: error.message,
            statusCode: 500
        });
    }
};

// Récupérer tous les feeds live (pour le frontend public)
exports.all = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 20;
        const skip = (page - 1) * pageSize;

        const totalFeeds = await LiveFeedModel.countDocuments({ statusOnline: 'on' });

        const feeds = await LiveFeedModel.find({ statusOnline: 'on' })
            .sort({ priorite: -1, date: -1 })
            .skip(skip)
            .limit(pageSize)
            .populate('categorie')
            .populate('image')
            .populate('auteur')
            .populate('article')
            .exec();

        return res.status(200).json({
            message: 'Liste des feeds live récupérée avec succès',
            status: 'OK',
            data: feeds,
            totalPages: Math.ceil(totalFeeds / pageSize),
            page,
            pageSize,
            totalFeeds,
            statusCode: 200
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Erreur serveur',
            status: 'NOT OK',
            error: error.message,
            statusCode: 500
        });
    }
};

// Récupérer tous les feeds (pour l'admin)
exports.allForAdmin = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 20;
        const skip = (page - 1) * pageSize;
        const statusFilter = req.query.status || 'on';

        const filter = statusFilter === 'all' ? {} : { statusOnline: statusFilter };
        const totalFeeds = await LiveFeedModel.countDocuments(filter);

        const feeds = await LiveFeedModel.find(filter)
            .sort({ date: -1 })
            .skip(skip)
            .limit(pageSize)
            .populate('categorie')
            .populate('image')
            .populate('auteur')
            .populate('article')
            .exec();

        return res.status(200).json({
            message: 'Liste des feeds live récupérée avec succès',
            status: 'OK',
            data: feeds,
            totalPages: Math.ceil(totalFeeds / pageSize),
            page,
            pageSize,
            totalFeeds,
            statusCode: 200
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Erreur serveur',
            status: 'NOT OK',
            error: error.message,
            statusCode: 500
        });
    }
};

// Récupérer les dernières actualités (pour le bandeau déroulant)
exports.latest = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;

        const feeds = await LiveFeedModel.find({ statusOnline: 'on' })
            .sort({ priorite: -1, date: -1 })
            .limit(limit)
            .populate('categorie')
            .populate('image')
            .exec();

        return res.status(200).json({
            message: 'Dernières actualités récupérées avec succès',
            status: 'OK',
            data: feeds,
            statusCode: 200
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Erreur serveur',
            status: 'NOT OK',
            error: error.message,
            statusCode: 500
        });
    }
};

// Récupérer les actualités urgentes/breaking
exports.breaking = async (req, res) => {
    try {
        const feeds = await LiveFeedModel.find({ 
            statusOnline: 'on',
            type: { $in: ['breaking', 'urgent'] }
        })
            .sort({ priorite: -1, date: -1 })
            .limit(5)
            .populate('categorie')
            .populate('image')
            .populate('article')
            .exec();

        return res.status(200).json({
            message: 'Actualités urgentes récupérées avec succès',
            status: 'OK',
            data: feeds,
            statusCode: 200
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Erreur serveur',
            status: 'NOT OK',
            error: error.message,
            statusCode: 500
        });
    }
};

// Supprimer un feed
exports.delete = async (req, res) => {
    try {
        const { id } = req.params;
        
        const liveFeed = await LiveFeedModel.findByIdAndUpdate(
            id, 
            { statusOnline: 'del' }, 
            { new: true }
        );

        if (!liveFeed) {
            return res.status(404).json({
                message: 'Feed live non trouvé',
                status: 'NOT OK',
                statusCode: 404
            });
        }

        return res.status(200).json({
            message: 'Feed live supprimé avec succès',
            status: 'OK',
            statusCode: 200
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Erreur serveur',
            status: 'NOT OK',
            error: error.message,
            statusCode: 500
        });
    }
};

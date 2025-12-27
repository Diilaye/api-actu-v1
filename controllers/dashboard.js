const articleModel = require('../models/article');
const categorieModel = require('../models/categories');
const tagsModel = require('../models/tags');
const userModel = require('../models/admin');
const emissionModel = require('../models/emission-model');
const flashNewsModel = require('../models/flash-news');

exports.getStats = async (req, res) => {
    try {
        // Compter les articles par statut
        const totalArticles = await articleModel.countDocuments();
        const articlesPublies = await articleModel.countDocuments({ statut: 'publie' });
        const articlesBrouillon = await articleModel.countDocuments({ statut: 'brouillon' });
        const articlesArchives = await articleModel.countDocuments({ statut: 'archive' });

        // Compter les articles en ligne vs hors ligne
        const articlesOnline = await articleModel.countDocuments({ statusOnline: 'on' });
        const articlesOffline = await articleModel.countDocuments({ statusOnline: 'off' });

        // Compter les autres entités
        const totalCategories = await categorieModel.countDocuments();
        const totalTags = await tagsModel.countDocuments();
        const totalUsers = await userModel.countDocuments();
        const totalEmissions = await emissionModel.countDocuments();
        const totalFlashNews = await flashNewsModel.countDocuments();

        // Articles récents (7 derniers jours)
        const dateSevenDaysAgo = new Date();
        dateSevenDaysAgo.setDate(dateSevenDaysAgo.getDate() - 7);
        const recentArticles = await articleModel.countDocuments({
            date: { $gte: dateSevenDaysAgo }
        });

        // Top 5 catégories avec le plus d'articles
        const topCategories = await articleModel.aggregate([
            { $match: { statut: 'publie' } },
            { $group: { _id: '$categorie', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: 'categories',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'categorie'
                }
            },
            { $unwind: '$categorie' },
            {
                $project: {
                    _id: 0,
                    categorieId: '$categorie._id',
                    categorieTitre: '$categorie.titre',
                    count: 1
                }
            }
        ]);

        return res.status(200).json({
            message: 'Statistiques récupérées avec succès',
            status: 'OK',
            data: {
                articles: {
                    total: totalArticles,
                    publies: articlesPublies,
                    brouillon: articlesBrouillon,
                    archives: articlesArchives,
                    online: articlesOnline,
                    offline: articlesOffline,
                    recent: recentArticles
                },
                categories: {
                    total: totalCategories,
                    top: topCategories
                },
                tags: {
                    total: totalTags
                },
                users: {
                    total: totalUsers
                },
                emissions: {
                    total: totalEmissions
                },
                flashNews: {
                    total: totalFlashNews
                }
            },
            statusCode: 200
        });

    } catch (error) {
        console.error('Erreur lors de la récupération des statistiques:', error);
        return res.status(500).json({
            message: 'Erreur serveur',
            status: 'NOT OK',
            error: error.message,
            statusCode: 500
        });
    }
};

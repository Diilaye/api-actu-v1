

const articleModel = require('../models/article');

const cST = require('../utils/title-to-slug');
const {Types} = require("mongoose");

const getLookupArticle =  (cat  ,  limit , une = null , skip = 0) => [
    // 🔍 1. Filtrer les articles par catégorie et typeUne
    {
        $match: {
            categorie: new Types.ObjectId(cat),
            typeUne: une == null ? {  $ne: "rubrique" } : { $eq: "rubrique" },
            statut: "publie"
        }
    },
    // 🔄 2. Lookup pour récupérer la catégorie
    {
        $lookup: {
            from: "categories",
            localField: "categorie",
            foreignField: "_id",
            as: "categorie"
        }
    },
    { $unwind: { path: "$categorie", preserveNullAndEmptyArrays: true } },

    // 🔄 3. Lookup pour récupérer les tags
    {
        $lookup: {
            from: "tags",
            localField: "tags",
            foreignField: "_id",
            as: "tags"
        }
    },
    { $unwind: { path: "$tags", preserveNullAndEmptyArrays: true } },
    // 🔄 4. Lookup pour récupérer l'image
    {
        $lookup: {
            from: "media",
            localField: "image",
            foreignField: "_id",
            as: "image"
        }
    },
    { $unwind: { path: "$image", preserveNullAndEmptyArrays: true } },

    // 🔄 5. Lookup pour récupérer l'auteur
    {
        $lookup: {
            from: "user-admin",
            localField: "author",
            foreignField: "_id",
            as: "author"
        }
    },
    { $unwind: { path: "$author", preserveNullAndEmptyArrays: true } },

    // 📅 6. Trier par date décroissante (du plus récent au plus ancien)
    { $sort: { date: -1 } },

    // 🎯 7. Limiter à 10 articles
    { $limit: limit },

    // 🎯 7. Limiter à 10 articles
    { $skip: skip },

    // 🛠 8. Projeter les champs souhaités (Optionnel)
    {
        $project: {
            "id": "\$_id",
            titre: 1,
            slug: 1,
            description: 1,
            typeUne: 1,
            statusOnline: 1,
            keyWorod: {titre : 1, slug: 1},
            date: 1,
            categorie: {  "id": "\$categorie._id", titre: 1, slug: 1 ,color  : 1, bgColor: 1 },
            tags: { "id": "\$tags._id", titre: 1, slug: 1 },
            image: { "id": "\$image._id", url: 1 },
            author: {
                id: "$author._id",
                nom: "$author.nom",
                prenom: "$author.prenom"
            }
        }
    }
]


const objectPopulate = [{
    path: 'author',
    select: 'nom prenom'
}, {
    path: 'categorie',
    select: 'titre slug color bgColor'
}, {
    path: 'tags',
    select: 'titre slug'
}, {
    path: 'keyWorod',
    select: 'titre slug'
}, {
    path: 'image',
    select: 'url'
}];

exports.add = async (req, res) => {

    try {
        let {
            titre,

            description,

            typeUne,

            categorie,

            tags,

            keyWorod,

            image,

            statut,


        } = req.body;


        const article = articleModel();

        article.titre = titre;

        article.slug = cST.convertToSlug(titre)

        article.description = description;

        article.typeUne = typeUne;

        article.categorie = categorie;

        article.tags = tags;

        article.keyWorod = keyWorod;

        article.image = image;

        article.statut = statut || 'publie';

        article.author = req.user.id_user;


        const articleSave = await  article.save();

        return res.status(201).json({
            message: 'creation réussi',
            status: 'OK',
            data: articleSave,
            statusCode: 201
        });


    } catch (error) {

        return res.status(404).json({
            message: 'erreur server ',
            status: 'NOT OK',
            data: error,
            statusCode: 404
        });


    }

}

exports.update = async (req,res) => {

    try {
       
    let {
        titre,

        description,

        typeUne,

        categorie,

        tags,

        keyWorod,

        image,

        statut,


    } = req.body;


    const article = await articleModel.findById(req.params.id);

    article.titre = titre;

    article.description = description;

    article.typeUne = typeUne;

    article.categorie = categorie;

    article.tags = tags;

    article.keyWorod = keyWorod;

    article.image = image;

    if (statut) article.statut = statut;

    //article.author = req.user.id_user;


    const articleSave = await  article.save();

    return res.status(200).json({
        message: 'modification réussi',
        status: 'OK',
        data: articleSave,
        statusCode: 201
    });


    } catch (error) {

        return res.status(404).json({
            message: 'erreur server ',
            status: 'NOT OK',
            data: error,
            statusCode: 404
        });


    }

}

exports.ActiveArticle = async (req,res) => {

    try {
       
    let {
        statusOnline,
    } = req.body;


    const article = await articleModel.findByIdAndDelete(req.params.id);

    

    return res.status(200).json({
        message: 'modification réussi',
        status: 'OK',
        data: article,
        statusCode: 201
    });


    } catch (error) {

        return res.status(404).json({
            message: 'erreur server ',
            status: 'NOT OK',
            data: error,
            statusCode: 404
        });


    }

}

exports.all = async (req, res) => {

    try {

        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 13;
        const skip = (page - 1) * pageSize;
        // Compter le nombre total de documents
        const totalProduits = await articleModel.countDocuments({ statut: 'publie' });

        const articles = await articleModel.find({ statut: 'publie' }).sort({ date: -1 }).skip(skip)  // Trier par date (du plus récent au plus ancien)
            .limit(pageSize).populate(objectPopulate).exec();

     
        return res.status(200).json({
            message: 'liste réussi',
            status: 'OK',
            data: articles,
            totalPages: Math.ceil(totalProduits / pageSize),
            page,
            pageSize,
            statusCode: 200
        });

    } catch (error) {

        return res.status(404).json({
            message: 'erreur server ',
            status: 'NOT OK',
            data: error,
            statusCode: 404
        });


    }


}

exports.allForAdmin = async (req, res) => {

    try {

        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 13;
        const skip = (page - 1) * pageSize;
        const statut = req.query.statut || 'all';
        
        let filter = {};
        if (statut !== 'all') {
            filter.statut = statut;
        }
        
        // Compter le nombre total de documents
        const totalProduits = await articleModel.countDocuments(filter);

        const articles = await articleModel.find(filter).sort({ date: -1 }).skip(skip)
            .limit(pageSize).populate(objectPopulate).exec();

     
        return res.status(200).json({
            message: 'liste réussi',
            status: 'OK',
            data: articles,
            totalPages: Math.ceil(totalProduits / pageSize),
            page,
            pageSize,
            statusCode: 200
        });

    } catch (error) {

        return res.status(404).json({
            message: 'erreur server ',
            status: 'NOT OK',
            data: error,
            statusCode: 404
        });


    }


}

exports.topArticle = async (req, res) => {

    try {

        const articles = await articleModel.find({
            typeUne: 'top',
            statut: 'publie'
        }).populate(objectPopulate).exec();

        return res.status(200).json({
            message: 'liste réussi',
            status: 'OK',
            data: articles[articles.length - 1],
            statusCode: 200
        });

    } catch (error) {

        return res.status(404).json({
            message: 'erreur server ',
            status: 'NOT OK',
            data: error,
            statusCode: 404
        });


    }


}

exports.uneArticles = async (req, res) => {
    try {
        const articles = await articleModel.find({ typeUne: 'une', statut: 'publie' })
            .sort({ date: -1 })  // Trier par date (du plus récent au plus ancien)
            .limit(5)                  // Garder uniquement les 5 derniers
            .populate(objectPopulate)
            .exec();

        return res.status(200).json({
            message: 'Liste des 5 derniers articles récupérée avec succès',
            status: 'OK',
            data: articles,
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

exports.articleActualite = async (req, res) => {

    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 13;
        const skip = (page - 1) * pageSize;
        // Compter le nombre total de documents
        const totalProduits = await articleModel.countDocuments({ categorie: new Types.ObjectId("669b0b3bfe714afd6cf57389")});

        const articles = await articleModel.aggregate(getLookupArticle("669b0b3bfe714afd6cf57389" , pageSize , null, skip));

        return res.status(200).json({
            message: "Liste des articles récupérée avec succès",
            status: "OK",
            data: articles,
            totalPages: Math.ceil(totalProduits / pageSize),
            page,
            pageSize,
            statusCode: 200
        });

    } catch (error) {
        return res.status(500).json({
            message: "Erreur serveur",
            status: "NOT OK",
            error: error.message,
            statusCode: 500
        });
    }

};

exports.articleCategorie = async (req, res) => {

    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 13;
        const skip = (page - 1) * pageSize;
        const catId= req.query.categorie;
        // Compter le nombre total de documents
        const totalProduits = await articleModel.countDocuments({ categorie: new Types.ObjectId(req.query.categorie), statut: 'publie' });

       // const articles = await articleModel.aggregate(getLookupArticle(req.query.categorie , pageSize , null, skip));

        const articles = await articleModel.find({categorie :req.query.categorie, statut: 'publie' }).sort({ date: -1 }).skip(skip)  // Trier par date (du plus récent au plus ancien)
            .limit(pageSize).populate(objectPopulate).exec();

        return res.status(200).json({
            message: "Liste des articles récupérée avec succès",
            status: "OK",
            data: articles,
            totalPages: Math.ceil(totalProduits / pageSize),
            page,
            pageSize,
            statusCode: 200
        });

    } catch (error) {
        return res.status(500).json({
            message: "Erreur serveur",
            status: "NOT OK",
            error: error.message,
            statusCode: 500
        });
    }

};


exports.articlePolitique = async (req, res) => {
    try {

        const articles = await articleModel.aggregate(getLookupArticle("669b0b67fe714afd6cf5738b" , 5));

        return res.status(200).json({
            message: 'Liste des 5 derniers articles récupérée avec succès',
            status: 'OK',
            data: articles,
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

exports.unePolitique = async (req, res) => {
    try {

        const articles = await articleModel.aggregate(getLookupArticle("669b0b67fe714afd6cf5738b" , 1 , "une"));
        return res.status(200).json({
            message: 'Liste des 5 derniers articles récupérée avec succès',
            status: 'OK',
            data: articles[0],
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

exports.articleEconomie = async (req, res) => {
    try {
        const articles = await articleModel.aggregate(getLookupArticle("669b0b7cfe714afd6cf5738d" , 5));

        return res.status(200).json({
            message: 'Liste des 5 derniers articles récupérée avec succès',
            status: 'OK',
            data: articles,
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

exports.uneEconomie = async (req, res) => {
    try {
        const articles = await articleModel.aggregate(getLookupArticle("669b0b7cfe714afd6cf5738d" , 1 , 'une'));

        return res.status(200).json({
            message: 'Liste des 5 derniers articles récupérée avec succès',
            status: 'OK',
            data: articles[0],
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

exports.articleInvestigation = async (req, res) => {
    try {
        const articles = await articleModel.aggregate(getLookupArticle("669d23ed2d40ea6ee75cfc2f" , 5 ));

        return res.status(200).json({
            message: 'Liste des 5 derniers articles récupérée avec succès',
            status: 'OK',
            data: articles,
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

exports.uneInvestigation = async (req, res) => {
    try {
        const articles = await articleModel.aggregate(getLookupArticle("669d23ed2d40ea6ee75cfc2f" , 1,'une' ));

        return res.status(200).json({
            message: 'Liste des 5 derniers articles récupérée avec succès',
            status: 'OK',
            data: articles[0],
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


exports.articleContribution = async (req, res) => {
    try {
        const articles = await articleModel.aggregate(getLookupArticle("66a1525888d3a2b60cc75d1b" , 7 ));


        return res.status(200).json({
            message: 'Liste des 5 derniers articles récupérée avec succès',
            status: 'OK',
            data: articles,
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

exports.articleChoixRedac = async (req, res) => {
    try {
        const articles = await articleModel.aggregate(getLookupArticle("66a1513888d3a2b60cc75d18" , 4 ));


        return res.status(200).json({
            message: 'Liste des 5 derniers articles récupérée avec succès',
            status: 'OK',
            data: articles,
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

exports.articleSport = async (req, res) => {
    try {
        const articles = await articleModel.aggregate(getLookupArticle("669b0b86fe714afd6cf5738f" , 5 ));

        return res.status(200).json({
            message: 'Liste des 5 derniers articles récupérée avec succès',
            status: 'OK',
            data: articles,
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

exports.articleCulture = async (req, res) => {
    try {
        const articles = await articleModel.aggregate(getLookupArticle("66a4810c87d32bedea8fa364" , 5 ));


        return res.status(200).json({
            message: 'Liste des 5 derniers articles récupérée avec succès',
            status: 'OK',
            data: articles,
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


exports.articleAfrique = async (req, res) => {
    try {
        const articles = await articleModel.aggregate(getLookupArticle("669b0b98fe714afd6cf57391" , 5 ));

        return res.status(200).json({
            message: 'Liste des 5 derniers articles récupérée avec succès',
            status: 'OK',
            data: articles,
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

exports.articleInternational = async (req, res) => {
    try {
        const articles = await articleModel.aggregate(getLookupArticle("669d23ad2d40ea6ee75cfc26" , 5 ));



        return res.status(200).json({
            message: 'Liste des 5 derniers articles récupérée avec succès',
            status: 'OK',
            data: articles,
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

exports.slug = async (req, res) => {

    try {

        let {
            slug
        } = req.params;

        console.log(slug);
        

        const article = await articleModel.findOne({
            slug: slug,
            statut: 'publie'
        }).populate(objectPopulate).exec();

 



        return res.status(200).json({
            message: 'liste réussi',
            status: 'OK',
            data: article,
            statusCode: 200
        });

    } catch (error) {

        return res.status(404).json({
            message: 'erreur server ',
            status: 'NOT OK',
            data: error,
            statusCode: 404
        });


    }


}


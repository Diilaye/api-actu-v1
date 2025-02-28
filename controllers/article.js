const articleModel = require('../models/article');

const cST = require('../utils/title-to-slug');

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


    } = req.body;


    const article = await articleModel.findById(req.params.id);

    article.titre = titre;

    article.description = description;

    article.typeUne = typeUne;

    article.categorie = categorie;

    article.tags = tags;

    article.keyWorod = keyWorod;

    article.image = image;

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

        const articles = await articleModel.find({}).populate(objectPopulate).exec();

     
        return res.status(200).json({
            message: 'liste réussi',
            status: 'OK',
            data: articles,
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
            typeUne: 'top'
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
        const articles = await articleModel.find({ typeUne: 'une' })
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
        const articles = await articleModel.find({categorie: "669b0b3bfe714afd6cf57389"  , typeUne: { $not: /rubrique/ }})
            .sort({ date: -1 })  // Trier par date (du plus récent au plus ancien)
            .limit(10)                  // Garder uniquement les 5 derniers
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

exports.articlePolitique = async (req, res) => {
    try {
        const articles = await articleModel.find({categorie: "669b0b67fe714afd6cf5738b"  , typeUne: { $not: /rubrique/ }})
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

exports.unePolitique = async (req, res) => {
    try {
        const articles = await articleModel.find({categorie: "669b0b67fe714afd6cf5738b"  , typeUne:  "rubrique" })
            .sort({ date: -1 })  // Trier par date (du plus récent au plus ancien)
            .limit(1)                  // Garder uniquement les 5 derniers
            .populate(objectPopulate)
            .exec();

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
        const articles = await articleModel.find({categorie: "669b0b7cfe714afd6cf5738d"  , typeUne: { $not: /rubrique/ }})
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

exports.uneEconomie = async (req, res) => {
    try {
        const articles = await articleModel.find({categorie: "669b0b7cfe714afd6cf5738d"  , typeUne:  "rubrique" })
            .sort({ date: -1 })  // Trier par date (du plus récent au plus ancien)
            .limit(1)                  // Garder uniquement les 5 derniers
            .populate(objectPopulate)
            .exec();

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
        const articles = await articleModel.find({categorie: "66a1513888d3a2b60cc75d18"  , typeUne: { $not: /rubrique/ }})
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

exports.uneInvestigation = async (req, res) => {
    try {
        const articles = await articleModel.find({categorie: "66a1513888d3a2b60cc75d18"  , typeUne:  "rubrique" })
            .sort({ date: -1 })  // Trier par date (du plus récent au plus ancien)
            .limit(1)                  // Garder uniquement les 5 derniers
            .populate(objectPopulate)
            .exec();

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
        const articles = await articleModel.find({categorie: "66a1525888d3a2b60cc75d1b"})
            .sort({ date: -1 })  // Trier par date (du plus récent au plus ancien)
            .limit(7)                  // Garder uniquement les 5 derniers
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

exports.articleChoixRedac = async (req, res) => {
    try {
        const articles = await articleModel.find({categorie: "66a1513888d3a2b60cc75d18"})
            .sort({ date: -1 })  // Trier par date (du plus récent au plus ancien)
            .limit(4)                  // Garder uniquement les 5 derniers
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

exports.articleSport = async (req, res) => {
    try {
        const articles = await articleModel.find({categorie: "669b0b86fe714afd6cf5738f"})
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

exports.articleCulture = async (req, res) => {
    try {
        const articles = await articleModel.find({categorie: "66a4810c87d32bedea8fa364"  })
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


exports.articleAfrique = async (req, res) => {
    try {
        const articles = await articleModel.find({categorie: "669b0b98fe714afd6cf57391"})
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

exports.articleInternal = async (req, res) => {
    try {
        const articles = await articleModel.find({categorie: "669d23ad2d40ea6ee75cfc26"  })
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

exports.slug = async (req, res) => {

    try {

        let {
            slug
        } = req.params;

        console.log(slug);
        

        const article = await articleModel.findOne({
            slug: slug
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


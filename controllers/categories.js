const categorieModel = require('../models/categories');

const sousCategorieModel = require('../models/sous-rubrique');

const articleModel = require('../models/article');

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



            // color,

            // bgColor,

            // photoCouverture,


        } = req.body;

        const categorie = categorieModel();

        categorie.titre = titre;

        categorie.slug = titre.split(' ').join('-');

        // categorie.color = color;

        categorie.author = req.user.id_user;

        // categorie.bgColor = bgColor;

        // categorie.photoCouverture = photoCouverture;

        const categorieSave = await categorie.save();

        return res.status(201).json({
            message: 'creation réussi',
            status: 'OK',
            data: categorieSave,
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

exports.one = async (req, res) => {

    try {

        const categorie = await categorieModel.findById(req.params.id).exec();

        const sousRubriques = await sousCategorieModel.find({
            categorie: req.params.id
        }).exec();

        const articles = await articleModel.find({
            categorie: req.params.id
        }).populate(objectPopulate).limit(50).sort({date: -1}).exec();


        return res.status(200).json({
            message: 'liste réussi',
            status: 'OK',
            data: {
                "categorie": categorie,
                "sous-rubrique": sousRubriques,
                "articles": articles
            },
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

exports.slug = async (req, res) => {



    try {

        const categorie = await categorieModel.find({
            slug : req.params.slug.toUpperCase()
        }).exec();




        const sousRubriques = await sousCategorieModel.find({
            categorie: categorie[0].id
        }).exec();

        const articles = await articleModel.find({
            categorie: categorie[0].id
        }).populate(objectPopulate).sort({ date: -1 }).limit(100).exec();


        return res.status(200).json({
            message: 'liste réussi',
            status: 'OK',
            data: {
                "categorie": categorie[0],
                "sous-rubrique": sousRubriques ,
                "articles": articles
            },
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

exports.all = async (req, res) => {


    try {

        const categories = await categorieModel.find({}).exec();

        return res.status(200).json({
            message: 'liste réussi',
            status: 'OK',
            data: categories,
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


exports.update = async (req, res) => {

    
   



    try {


        let {

            titre,
    
            statusOnline,
    
            color,
    
            bgColor,
    
            photoCouverture
    
        } = req.body;
    
        const categorie = await categorieModel.findById(req.params.id);
    
        if (titre != undefined) {
            categorie.titre = titre;
            categorie.slug = titre.split(' ').join('-');
        }
    
        if (color != undefined) {
            categorie.color = color;
        }
    
        if (bgColor != undefined) {
            categorie.bgColor = bgColor;
    
        }
    
        if (photoCouverture != undefined) {
            categorie.photoCouverture = photoCouverture;
        }
    
        if (statusOnline != undefined) {
            categorie.statusOnline = statusOnline;
        }
    
        const categorieSave = await categorie.save();
    
        return res.status(200).json({
            message: 'update réussi',
            status: 'OK',
            data: categorieSave,
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

exports.delete = async (req, res) => {

    try {

        const categorie = await categorieModel.findByIdAndDelete(req.params.id).excec();


        return res.status(200).json({
            message: 'delete réussi',
            status: 'OK',
            data: categorie,
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
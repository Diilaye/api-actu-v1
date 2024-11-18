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

    article.author = req.user.id_user;


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


    const article = await articleModel.findById(req.params.id);

    article.statusOnline = statusOnline;

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


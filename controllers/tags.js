
const tagModel = require('../models/tags');
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
            titre
        } = req.body;

        const tag = tagModel();

        tag.titre = titre;

        tag.slug = titre.split(' ').join('-');

        const tagSave = await tag.save();

        return res.status(201).json({
            message: 'creation réussi',
            status: 'OK',
            data: tagSave,
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

        const tags = await tagModel.find({}).exec();

        return res.status(200).json({
            message: 'liste réussi',
            status: 'OK',
            data: tags,
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

        console.log(req.params.name);
        

        const tag = await tagModel.find({
            slug : req.params.slug
        }).exec();

        

    

        const articles = await articleModel.find({
            tags: tag[0].id
        }).populate(objectPopulate).exec();


        return res.status(200).json({
            message: 'liste réussi',
            status: 'OK',
            data: {
                "tag": tag[0],
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

exports.one = async (req, res) => {
    try {

        const tag = await tagModel.findById(req.params.id).exec();

        return res.status(201).json({
            message: 'liste réussi',
            status: 'OK',
            data: tag,
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


exports.update = async (req, res) => {


    try {
        let {
            titre,
            statusOnline
        } = req.body;

        const tag = await tagModel.findById(req.params.id);

        if (titre != undefined) {
            tag.titre = titre;
            tag.slug = titre.split(' ').join('-');
        }

        if (statusOnline != undefined) {
            tag.statusOnline = statusOnline;
        }


        const tagSave = await tag.save();

        return res.status(200).json({
            message: 'update réussi',
            status: 'OK',
            data: tagSave,
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

        const tag = await tagModel.findByIdAndDelete(req.params.id);

        return res.status(200).json({
            message: 'delete réussi',
            status: 'OK',
            data: tag,
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
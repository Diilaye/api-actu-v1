const sectionModel = require('../models/sections');


exports.add = async (req, res) => {

    try {

        let {
            type,

            categorie,

            limit,

            skip,

            nombreArticle,

            isMouvable,

        } = req.body;

        const section = await sectionModel();

        section.type = type;

        section.categorie = categorie;

        section.limit = limit;

        section.skip = skip;

        section.nombreArticle = nombreArticle;

        section.isMouvable = isMouvable;

        const sectionSave = await section.save();

        return res.status(201).json({
            message: 'creation réussi',
            status: 'OK',
            data: sectionSave,
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

        const section = await sectionModel.findById(req.params.id).exec();

        return res.status(200).json({
            message: 'liste réussi',
            status: 'OK',
            data: section,
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

        const sections = await sectionModel.find({}).exec();

        return res.status(200).json({
            message: 'creation réussi',
            status: 'OK',
            data: sections,
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
            type,

            categorie,

            limit,

            skip,

            nombreArticle,

            isMouvable,

        } = req.body;

        const section = await sectionModel.findById(req.params.id).exec();

        if (type != undefined) {
            section.type = type;
        }

        if (categorie != undefined) {
            section.categorie = categorie;
        }

        if (limit != undefined) {
            section.limit = limit;
        }

        if (skip != undefined) {
            section.skip = skip;
        }

        if (nombreArticle != undefined) {
            section.nombreArticle = nombreArticle;
        }

        if (isMouvable != undefined) {
            section.isMouvable = isMouvable;
        }

        const sectionSave = await section.save();

        return res.status(201).json({
            message: 'creation réussi',
            status: 'OK',
            data: sectionSave,
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

exports.delete = async (req, res) => {

    try {

        const section = await sectionModel.findByIdAndDelete(req.params.id).exec();

        return res.status(200).json({
            message: 'liste réussi',
            status: 'OK',
            data: section,
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
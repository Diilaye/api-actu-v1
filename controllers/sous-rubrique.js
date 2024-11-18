const sousRubriqueModel = require("../models/sous-rubrique");

const objectPopulate = [{
    path: 'categorie',
    select: 'titre'
}];


exports.add = async (req, res) => {

    try {

        let {

            titre,

            categorie,

            // color,

            // bgColor,
// 
            // photoCouverture,

        } = req.body;

        const sousRubrique = sousRubriqueModel();

        sousRubrique.titre = titre;

        sousRubrique.categorie = categorie;

        sousRubrique.slug = titre.split(' ').join('-');

        // sousRubrique.color = color;

        // sousRubrique.bgColor = bgColor;

        // sousRubrique.photoCouverture = photoCouverture;

        const sousRubriqueSave = await sousRubrique.save();


        return res.status(201).json({
            message: 'creation réussi',
            status: 'OK',
            data: sousRubriqueSave,
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

        const sousRubrique = await sousRubriqueModel.findById(req.params.id);

        return res.status(200).json({
            message: 'creation réussi',
            status: 'OK',
            data: sousRubrique,
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

        const sousRubrique = await sousRubriqueModel.find({}).populate(objectPopulate);

        return res.status(200).json({
            message: 'liste réussi',
            status: 'OK',
            data: sousRubrique,
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

            categorie,

            color,

            bgColor,

            photoCouverture,

            statusOnline

        } = req.body;

        const sousRubrique = await sousRubriqueModel.findById(req.params.id).exec();

        if (titre != undefined) {
            sousRubrique.titre = titre;
            sousRubrique.slug = titre.split(' ').join('-');
        }

        if (categorie != undefined) {
            sousRubrique.categorie = categorie;
        }

        if (color != undefined) {
            sousRubrique.color = color;
        }

        if (bgColor != undefined) {
            sousRubrique.bgColor = bgColor;
        }

        if (photoCouverture != undefined) {
            sousRubrique.photoCouverture = photoCouverture;
        }

        if (statusOnline != undefined) {
            sousRubrique.statusOnline = statusOnline;
        }


        const sousRubriqueSave = await sousRubrique.save();


        return res.status(200).json({
            message: 'modifications réussi',
            status: 'OK',
            data: sousRubriqueSave,
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

        const sousRubrique = await sousRubriqueModel.findByIdAndDelete(req.params.id);

        return res.status(200).json({
            message: 'delete réussi',
            status: 'OK',
            data: sousRubrique,
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
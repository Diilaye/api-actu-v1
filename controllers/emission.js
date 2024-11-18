
const emissionsModel = require('../models/emission-model');

const objectPopulate = [{
    path: 'author',
    select: 'nom prenom'
}, {
    path: 'photoCouverture',
    select: 'url'
}, {
    path: 'author',
    select: 'nom prenom'
}];

exports.add = async (req, res) => {

    try {

        let {




            type,

            titre,

            heure,


            photoCouverture,

            urlMedia,

            description



        } = req.body;

        const emission = emissionsModel();

        emission.type = type;

        emission.titre = titre;

        emission.heure = heure;

        emission.urlMedia = urlMedia;

        emission.description = description;

        emission.photoCouverture = photoCouverture;

        emission.slug = titre.split(' ').join('-');;

        // categorie.color = color;

        emission.author = req.user.id_user;

        // categorie.bgColor = bgColor;

        // categorie.photoCouverture = photoCouverture;

        const emissionSave = await emission.save();

        return res.status(201).json({
            message: 'creation réussi',
            status: 'OK',
            data: emissionSave,
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

            type,

            titre,

            heure,

            photoCouverture,

            urlMedia,

            description,

            statusOnline

        } = req.body;

        const emission = await  emissionsModel.findById(req.params.id);

        if(type != undefined) {
            emission.type = type;
        }

        if(titre != undefined) {
            emission.titre = titre;
            emission.slug = titre.split(' ').join('-');
        }

        if(heure != undefined) {
            emission.heure = heure;
        }

        if(urlMedia != undefined) {
            emission.urlMedia = urlMedia;
        }

        if(description != undefined) {
            emission.description = description;
        }

        if(photoCouverture != undefined) {
            emission.photoCouverture = photoCouverture;
        }

        if(statusOnline != undefined) {
            emission.statusOnline = statusOnline;
        }

        const emissionSave = await emission.save();

        return res.status(200).json({
            message: 'modif réussi',
            status: 'OK',
            data: emissionSave,
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

        const emissions = await emissionsModel.find({}).populate(objectPopulate).exec();

        return res.status(200).json({
            message: 'liste réussi',
            status: 'OK',
            data: emissions,
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

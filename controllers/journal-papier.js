const postsDigiteauxModel = require("../models/journal-papier");


const objectPopulate = [{
    path: 'author',
    select: 'nom prenom'
}, {
    path: 'image',
    select: 'url'
}, {
    path: 'file',
    select: 'url'
}];

exports.add = async (req, res) => {

    try {

        let {

            // file,

            image,


        } = req.body;

        const posts = postsDigiteauxModel();

        // posts.file = file;

        posts.image = image;

        posts.author = req.user.id_user;


        const postSave = await posts.save();

        return res.status(201).json({
            message: 'creation réussi',
            status: 'OK',
            data: postSave,
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

            image,

            statusOnline


        } = req.body;

        const posts = await  postsDigiteauxModel.findById(req.params.id);

        if(image != undefined) {
            posts.image = image;
        }

        if(statusOnline !=undefined) {
            posts.statusOnline = statusOnline;
        }

        const postSave = await posts.save();

        return res.status(200).json({
            message: 'modif réussi',
            status: 'OK',
            data: postSave,
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

        const posts = await postsDigiteauxModel.find({}).populate(objectPopulate).exec();

        return res.status(200).json({
            message: 'liste réussi',
            status: 'OK',
            data: posts,
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
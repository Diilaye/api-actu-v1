
const userModel = require('../models/admin');

const filesModel = require('../models/file');

const categorieModel = require('../models/categories');

const tagModel = require('../models/tags');

const articleModel = require('../models/article');



const bcrytjs = require('bcryptjs');

const jwt = require('jsonwebtoken');

const axios = require('axios');

const fs = require('fs');

const pathT = require('path');

const downloadImage = async (url, folderPath, fileName) => {
    // Vérifiez si le dossier existe, sinon créez-le
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
  
    const filePath = pathT.join(folderPath, fileName);
  
    try {
      const response = await axios({
        url,
        method: 'GET',
        responseType: 'stream'
      });
  
      return new Promise((resolve, reject) => {
        const writer = fs.createWriteStream(filePath);
        response.data.pipe(writer);
  
        writer.on('finish', resolve);
        writer.on('error', reject);
      });
    } catch (error) {
      console.error(`Error downloading image: ${error.message}`);
    }
  };

exports.importArticle= async (req,res) => {

   

        
    try {

        const apiUrl = 'https://actu221.net/jsonapi/node/article?page[limit]=50&page[offset]=200&sort=-nid';

        const response = await axios.get(apiUrl);
        const articlesData = response.data.data;

        if (!articlesData || articlesData.length === 0) {
        return res.status(404).send('No articles found');
        }

        const articles = await Promise.all(articlesData.map(async (articleData) => {
        const { title, body, path, created, changed } = articleData.attributes;
        const id = articleData.id;
        

        const image = articleData.relationships.field_media_image_fields.data.id;

        const apiUrlCat = 'https://actu221.net/jsonapi/node/article/'+id+'/field_rubrique';

        const apiUrlTag = 'https://actu221.net/jsonapi/node/article/'+id+'/field_tags';

        const apiUrlImage = 'https://actu221.net/jsonapi/media/image_media/'+image+'/thumbnail';

        const responseCat = await axios.get(apiUrlCat);
        const catData = responseCat.data.data;
      
        

        const responseTag = await axios.get(apiUrlTag);
        const tagData = responseTag.data.data[0];
     

        const responseImg = await axios.get(apiUrlImage);
        const imageDataJ = responseImg.data.data.attributes.uri.url;
    
        
        
        

        const imageUrl = "https://actu221.net"+ imageDataJ;
        
        const uploadsFolderPath = pathT.join(__dirname, '..' ,'uploads');

       
        
        const fileName = responseImg.data.data.attributes.filename;
    
        await downloadImage(imageUrl, uploadsFolderPath, fileName)
        .then(() => console.log('Image downloaded successfully!'))
        .catch(err => console.error(`Failed to download image: ${err.message}`));

        const file = filesModel();

        file.url = '/actu221-file/'+ responseImg.data.data.attributes.filename;

        console.log('/actu221-file/'+ responseImg.data.data.attributes.filename);

        file.type= responseImg.data.data.attributes.filemime

        const fSave = await file.save();


        const categorieF = await categorieModel.findOne({
            titre : catData == null ? "ACTUALITES" :  catData.attributes.name.replaceAll('é','e').toUpperCase().split('-')[0]
        });

   
        

        let categorieSave ;

        if(categorieF ==null) {

            const catC = categorieModel();

            catC.titre =  catData.attributes.name.toUpperCase();

            catC.showMenu = "0";

            catC.slug =  catData.attributes.name.split(' ').join('-').toUpperCase();

            catC.author = "66912f9ec60ee5e778f7f77a";

            categorieSave = await catC.save();
        }


        const tagF = await tagModel.findOne({
            titre : tagData.attributes.name
        });

        let tagSave ;

        if(tagF ==null) {
            
            const tag = tagModel();

            tag.titre = tagData.attributes.name;
    
            tag.slug = tagData.attributes.name.split(' ').join('-');
    
            tagSave = await tag.save();
          
        }

        const article = articleModel();

        article.titre = title;

        article.description = body.value;

        article.typeUne = 'none';

        article.categorie = categorieF ==undefined ?  categorieSave.id : categorieF.id;

        article.tags = tagF ==undefined ?  tagSave.id : tagF.id ;

        article.keyWorod = ['keyWorod','keyword2'];

        article.image = fSave.id;

        article.author = "66912f9ec60ee5e778f7f77a";


        const articleSave = await article.save();

        
        return articleSave ;
        }));

        res.json({
            articles,
            "taille" : articles.length
        });

       
    } catch (error) {
        res.status(500).send(`Error fetching articles: ${error.message}`);
    }

}

exports.store = async (req, res) => {
    try {

        let {

            service,

            nom,

            prenom,

            telephone,

            email,

            password,

        } = req.body;

        const user = userModel();

        user.service = service;
        user.nom = nom;
        user.prenom = prenom;
        user.telephone = telephone;
        user.email = email;

        user.password = bcrytjs.hashSync(password, bcrytjs.genSaltSync(10));

        const token = jwt.sign({
            id_user: user.id,
            service_user: user.service
        }, process.env.JWT_SECRET, { expiresIn: '8784h' });

        user.token = token;

        const userSave = await user.save();



        return res.status(201).json({
            message: 'creation réussi',
            status: 'OK',
            data: userSave,
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

exports.addClient = async (req, res) => {
    try {

        let {



            email,

            password,

        } = req.body;

        const user = userModel();

        user.email = email;

        user.password = bcrytjs.hashSync(password, bcrytjs.genSaltSync(10));

        const token = jwt.sign({
            id_user: user.id,
            service_user: user.service
        }, process.env.JWT_SECRET, { expiresIn: '8784h' });

        user.token = token;

        const userSave = await user.save();



        return res.status(201).json({
            message: 'creation réussi',
            status: 'OK',
            data: userSave,
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



exports.auth = async (req, res) => {

   

    try {

        let { email, password } = req.body;


        const user = await userModel.findOne({
            email
        }).exec();
    
        if (user != undefined) {
    
            if (bcrytjs.compareSync(password, user.password)) {
    
                const token = jwt.sign({
                    id_user: user.id,
                    service_user: user.service,
                }, process.env.JWT_SECRET, { expiresIn: '8784h' });
    
                user.token = token;
    
                const saveUser = await user.save();
    
                return res.status(200).json({
                    message: 'Connection réussi',
                    status: 'OK',
                    data: saveUser,
                    statusCode: 200
                });
    
            } else {
    
                return res.status(404).json({
                    message: 'Identifiant incorrect',
                    status: 'NOT OK',
                    data: null,
                    statusCode: 404
                });
            }
    
        } else {
    
            return res.status(404).json({
                message: 'Identifiant incorrect',
                status: 'NOT OK',
                data: null,
                statusCode: 404
            });
        }
    

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


        const user = await userModel.findById(req.params.id).excec();

        return res.status(200).json({
            message: 'liste réussi',
            status: 'OK',
            data: user,
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

exports.getAuth = async (req, res) => {

    try {


        const user = await userModel.findById(req.user.id_user).excec();

        return res.status(200).json({
            message: 'liste réussi',
            status: 'OK',
            data: user,
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

        const users = await userModel.find(req.query);
        
        return res.status(200).json({
            message: 'liste réussi',
            status: 'OK',
            data: users,
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

            nom,
    
            prenom,
    
            telephone,
    
            email,

            service,
    
            oldpassword,
    
            newPassword,
    
            photoProfile,
    
            statusOnline
    
        } = req.body;
    
        const user = await userModel.findById(req.params.id).exec();
    
        if (user != undefined) {
    
            if (nom != undefined) {
                user.nom = nom;
            }

            if (service != undefined) {
                user.service = service;
            }
    
            if (statusOnline != undefined) {
                user.statusOnline = statusOnline;
            }
    
            if (prenom != undefined) {
                user.prenom = prenom;
            }
    
            if (telephone != undefined) {
                user.telephone = telephone;
            }
    
            if (email != undefined) {
                user.email = email;
            }
    
            if (oldpassword != undefined) {
    
                if (bcrytjs.compareSync(oldpassword, user.password)) {
                    user.password = bcrytjs.hashSync(newPassword, bcrytjs.genSaltSync(10))
                }
    
            }
    
            if (photoProfile != undefined) {
                user.photoProfile = photoProfile;
            }
    
            const userSave = await user.save();
    
            return res.status(200).json({
                message: 'modification réussi',
                status: 'OK',
                data: userSave,
                statusCode: 200
            });
    
    
        } else {
            return res.status(404).json({
                message: 'erreur server ',
                status: 'NOT OK',
                data: error,
                statusCode: 404
            });
        }
       


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

        const user = await userModel.findByIdAndDelete(req.params.id).excec();

        return res.status(200).json({
            message: 'delete réussi',
            status: 'OK',
            data: user,
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
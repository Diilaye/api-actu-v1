exports.base64 = async (base) => {

    if (base === undefined) {
        return false;
    } else {
        // to declare some path to store your converted image
        // const matches = base.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
        const regex = /^data:(.+)\?(.+);base64,(.+)$/;
        const matches = base.match(regex);
            response = {};
        
        if (matches.length !== 4) {
            return new Error('Invalid input string');
        }

        response.type = matches[2];

        response.data = Buffer(matches[3], 'base64');

        let decodedImg = response;

     
        

        let imageBuffer = decodedImg.data;

        let type = decodedImg.type;




        let fileName = matches[1];

        console.log(require('path').join(__filename, '..', '..', 'uploads', fileName + '.' + type.split('/')[1]))

        require('fs').writeFileSync(require('path').join(__filename, '..','..', 'uploads', fileName + '.' + type.split('/')[1]), imageBuffer, 'utf8');

        const stats = require('fs').statSync(require('path').join(__filename, '..', '..', 'uploads', fileName + '.' + type.split('/')[1]));

        const fileSizeInBytes = stats.size / (1024 * 1024);

        if (fileSizeInBytes > 10) {

            require('fs').unlinkSync(require('path').join(__filename, '..', '..', 'uploads', fileName + '.' + type.split('/')[1]));
            return 'File to large';

        } else {
            return {
                'url': `/actu221-file/${fileName}.${type.split('/')[1]}`,
                'type': type
            };
        }




    }

}
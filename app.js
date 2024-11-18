
const app = require('express')();

require('dotenv').config({
    path: './.env'
});


app.use(require('cors')());

app.use(require('body-parser').json({
    limit: '10000mb'
}));

app.use(require('body-parser').urlencoded({
    extended: true,
    limit: '10000mb'
}));

app.use('/actu221-file', require('express').static('uploads'));


app.use('/api/v1/users', require('./routes/user'));
app.use('/api/v1/categories', require('./routes/categories'));
app.use('/api/v1/sous-categories', require('./routes/sous-rubrique'));
app.use('/api/v1/tags', require('./routes/tags'));
app.use('/api/v1/mots-cles', require('./routes/key-world'));
app.use('/api/v1/flash-news', require('./routes/flash-news'));
app.use('/api/v1/posts-digiteaux', require('./routes/posts-digiteaux'));
app.use('/api/v1/journal-papier', require('./routes/journal-papier'));
app.use('/api/v1/emissions', require('./routes/emission'));
app.use('/api/v1/articles', require('./routes/articles'));
app.use('/api/v1/files', require('./routes/file'));



require('./config/db')().then(_ => {
    const port = process.env.PORT
    app.listen(port, () => {
        console.log(process.env.MONGO_RUI);
        console.log(`Server started on ${port}`);
    });
});
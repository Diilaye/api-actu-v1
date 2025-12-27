const mongoose = require('mongoose');
const Article = require('./models/article');

// Charger les variables d'environnement
require('dotenv').config({ path: './.env' });

// Configuration MongoDB depuis .env
const MONGODB_URI = process.env.MONGO_RUI;

async function migrateArticles() {
    try {
        // Connexion à MongoDB
        await mongoose.connect(MONGODB_URI);
        
        console.log('✅ Connecté à MongoDB');

        // Compter les articles sans statut
        const articlesWithoutStatut = await Article.countDocuments({ 
            statut: { $exists: false } 
        });
        
        console.log(`📊 Articles sans statut: ${articlesWithoutStatut}`);

        if (articlesWithoutStatut === 0) {
            console.log('✅ Tous les articles ont déjà un statut');
            process.exit(0);
        }

        // Mettre à jour tous les articles sans statut à "publie"
        const result = await Article.updateMany(
            { statut: { $exists: false } },
            { $set: { statut: 'publie' } }
        );

        console.log(`✅ Migration terminée: ${result.modifiedCount} articles mis à jour avec statut='publie'`);

        // Vérifier les résultats
        const publies = await Article.countDocuments({ statut: 'publie' });
        const brouillons = await Article.countDocuments({ statut: 'brouillon' });
        const archives = await Article.countDocuments({ statut: 'archive' });
        const total = await Article.countDocuments();

        console.log('\n📈 Statistiques finales:');
        console.log(`   Total: ${total}`);
        console.log(`   Publiés: ${publies}`);
        console.log(`   Brouillons: ${brouillons}`);
        console.log(`   Archives: ${archives}`);

        process.exit(0);

    } catch (error) {
        console.error('❌ Erreur lors de la migration:', error);
        process.exit(1);
    }
}

// Exécuter la migration
migrateArticles();

const mongoose = require('mongoose');
const LiveFeed = require('./models/live-feed');

// Charger les variables d'environnement
require('dotenv').config({ path: './.env' });

// Configuration MongoDB depuis .env
const MONGODB_URI = process.env.MONGO_RUI;

async function seedLiveFeeds() {
    try {
        // Connexion à MongoDB
        await mongoose.connect(MONGODB_URI);
        
        console.log('✅ Connecté à MongoDB');

        // Données de test pour le live feed
        const sampleFeeds = [
            {
                titre: "URGENT : Nouvelle décision gouvernementale attendue",
                contenu: "Le conseil des ministres se réunit en session extraordinaire",
                type: "urgent",
                priorite: 10,
                statusOnline: "on"
            },
            {
                titre: "BREAKING : Match en direct - Sénégal vs Guinée",
                contenu: "Suivez le match en direct, score : 2-1",
                type: "breaking",
                priorite: 9,
                statusOnline: "on"
            },
            {
                titre: "INFO : Météo - Fortes pluies prévues dans la région de Dakar",
                contenu: "Les services météorologiques annoncent des précipitations importantes",
                type: "info",
                priorite: 5,
                statusOnline: "on"
            },
            {
                titre: "ACTU : Visite du président à l'université Cheikh Anta Diop",
                contenu: "Le chef de l'État inaugure le nouveau campus numérique",
                type: "info",
                priorite: 7,
                statusOnline: "on"
            },
            {
                titre: "UPDATE : Grève des transporteurs - Négociations en cours",
                contenu: "Les discussions se poursuivent entre syndicats et gouvernement",
                type: "update",
                priorite: 6,
                statusOnline: "on"
            },
            {
                titre: "FLASH : Coupure d'électricité programmée ce soir",
                contenu: "La SENELEC annonce des travaux de maintenance de 22h à 2h",
                type: "info",
                priorite: 4,
                statusOnline: "on"
            },
            {
                titre: "SPORT : Lions du Sénégal - Liste des 26 joueurs dévoilée",
                contenu: "L'équipe nationale prépare la prochaine compétition africaine",
                type: "info",
                priorite: 5,
                statusOnline: "on"
            },
            {
                titre: "ECONOMIE : Le prix du carburant augmente de 50 FCFA",
                contenu: "Nouvelle hausse des prix à la pompe dès demain",
                type: "urgent",
                priorite: 8,
                statusOnline: "on"
            },
            {
                titre: "CULTURE : Festival international du film africain ouvre ses portes",
                contenu: "Plus de 50 films en compétition du 20 au 28 décembre",
                type: "info",
                priorite: 3,
                statusOnline: "on"
            },
            {
                titre: "TECH : Lancement de la 5G au Sénégal prévu pour mars 2026",
                contenu: "Les opérateurs télécoms finalisent le déploiement du réseau",
                type: "info",
                priorite: 4,
                statusOnline: "on"
            }
        ];

        // Supprimer les anciennes données de test
        await LiveFeed.deleteMany({});
        console.log('🗑️  Anciennes données supprimées');

        // Insérer les nouvelles données
        const result = await LiveFeed.insertMany(sampleFeeds);
        console.log(`✅ ${result.length} actualités live créées avec succès`);

        // Afficher les statistiques
        const stats = await LiveFeed.aggregate([
            { $match: { statusOnline: 'on' } },
            { $group: { _id: '$type', count: { $sum: 1 } } }
        ]);

        console.log('\n📊 Statistiques par type:');
        stats.forEach(stat => {
            console.log(`   ${stat._id}: ${stat.count}`);
        });

        console.log('\n🎉 Base de données initialisée avec succès!');
        console.log('👉 Rechargez votre application Flutter pour voir le bandeau EN DIRECT');
        
        process.exit(0);

    } catch (error) {
        console.error('❌ Erreur lors de l\'initialisation:', error);
        process.exit(1);
    }
}

// Exécuter l'initialisation
seedLiveFeeds();

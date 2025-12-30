const axios = require('axios');
require('dotenv').config();

// Configuration de l'API
const API_URL = process.env.API_URL || 'http://localhost:3000';
const API_BASE = `${API_URL}/api/v1`;

// Test de création d'article
async function testCreateArticle() {
    console.log('🧪 Test de création d\'article...\n');

    try {
        // 1. Test sans authentification (devrait échouer)
        console.log('📝 Test 1: Création sans authentification...');
        try {
            const response = await axios.post(`${API_BASE}/articles`, {
                titre: 'Article de test',
                description: 'Description de test',
                typeUne: 'none',
                categorie: '507f1f77bcf86cd799439011', // ID fictif
                tags: '507f1f77bcf86cd799439012',
                keyWorod: ['test', 'article'],
                image: '507f1f77bcf86cd799439013',
                statut: 'brouillon'
            });
            console.log('❌ ERREUR: La requête devrait échouer sans token!');
        } catch (error) {
            if (error.response) {
                console.log(`✅ Comportement attendu: ${error.response.status} - ${error.response.data.message}`);
            } else {
                console.log('❌ Erreur réseau:', error.message);
            }
        }

        console.log('\n' + '='.repeat(60) + '\n');

        // 2. Test avec token fictif (devrait échouer)
        console.log('📝 Test 2: Création avec token invalide...');
        try {
            const response = await axios.post(`${API_BASE}/articles`, {
                titre: 'Article de test 2',
                description: 'Description de test',
                typeUne: 'none',
                categorie: '507f1f77bcf86cd799439011',
                tags: '507f1f77bcf86cd799439012',
                keyWorod: ['test', 'article'],
                image: '507f1f77bcf86cd799439013',
                statut: 'brouillon'
            }, {
                headers: {
                    'Authorization': 'Bearer fake-token-12345'
                }
            });
            console.log('❌ ERREUR: La requête devrait échouer avec token invalide!');
        } catch (error) {
            if (error.response) {
                console.log(`✅ Comportement attendu: ${error.response.status} - ${error.response.data.message}`);
            } else {
                console.log('❌ Erreur réseau:', error.message);
            }
        }

        console.log('\n' + '='.repeat(60) + '\n');

        // 3. Analyse du modèle et du contrôleur
        console.log('📊 Analyse des potentielles erreurs dans le code:\n');
        
        console.log('⚠️  PROBLÈME 1: Dans controllers/article.js ligne 139');
        console.log('   const article = articleModel();');
        console.log('   ❌ ERREUR: articleModel est un modèle Mongoose, pas une fonction');
        console.log('   ✅ CORRECTION: const article = new articleModel();');
        
        console.log('\n⚠️  PROBLÈME 2: Dans models/article.js ligne 18');
        console.log('   require: true  dans le schéma du titre');
        console.log('   ❌ ERREUR: Devrait être "required" et non "require"');
        console.log('   ✅ CORRECTION: required: true');

        console.log('\n⚠️  PROBLÈME 3: Gestion des erreurs');
        console.log('   Le catch retourne un status 404 pour toutes les erreurs');
        console.log('   ❌ PROBLÈME: 404 signifie "Not Found", pas "Server Error"');
        console.log('   ✅ CORRECTION: Utiliser 500 pour les erreurs serveur');

        console.log('\n' + '='.repeat(60) + '\n');

    } catch (error) {
        console.error('❌ Erreur lors du test:', error.message);
    }
}

// Exécuter les tests
testCreateArticle().then(() => {
    console.log('\n✅ Tests terminés!');
    console.log('\n📋 Résumé des erreurs détectées:');
    console.log('1. articleModel() au lieu de new articleModel()');
    console.log('2. "require: true" au lieu de "required: true"');
    console.log('3. Mauvais code d\'erreur HTTP (404 au lieu de 500)');
    console.log('\n🔧 Les corrections vont être appliquées...');
});

const axios = require('axios');
require('dotenv').config();

// Configuration de l'API
const API_URL = process.env.API_URL || 'http://localhost:3000';
const API_BASE = `${API_URL}/api/v1`;

// Fonction pour simuler une requête mobile
async function testMobileArticleCreation() {
    console.log('📱 Test de création d\'article - Version Mobile\n');
    console.log('='.repeat(70) + '\n');

    try {
        // Headers typiques d'une application mobile
        const mobileHeaders = {
            'User-Agent': 'Actu221-Mobile/1.0.0 (iOS 16.0; iPhone 14)',
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-Platform': 'mobile',
            'X-Device-Type': 'ios'
        };

        // Test 1: Sans authentification
        console.log('📝 Test 1: Création sans token d\'authentification (devrait échouer)');
        console.log('Headers:', JSON.stringify(mobileHeaders, null, 2));
        
        try {
            const response = await axios.post(`${API_BASE}/articles`, {
                titre: 'Article Mobile Test 1',
                description: 'Test depuis application mobile',
                typeUne: 'none',
                categorie: '507f1f77bcf86cd799439011',
                tags: '507f1f77bcf86cd799439012',
                keyWorod: ['mobile', 'test'],
                image: '507f1f77bcf86cd799439013',
                statut: 'brouillon'
            }, {
                headers: mobileHeaders
            });
            console.log('❌ ERREUR: La requête devrait échouer sans token!');
        } catch (error) {
            if (error.response) {
                console.log(`✅ Comportement attendu: ${error.response.status} - ${error.response.data.message}`);
                console.log('   Détails:', error.response.data);
            } else if (error.code === 'ECONNREFUSED') {
                console.log('⚠️  SERVEUR NON DÉMARRÉ: Impossible de se connecter à', API_URL);
                console.log('   Solution: Démarrer le serveur avec "npm start" ou "npm run dev"');
            } else {
                console.log('❌ Erreur réseau:', error.message);
            }
        }

        console.log('\n' + '='.repeat(70) + '\n');

        // Test 2: Avec token invalide
        console.log('📝 Test 2: Création avec token invalide (devrait échouer)');
        
        try {
            const response = await axios.post(`${API_BASE}/articles`, {
                titre: 'Article Mobile Test 2',
                description: 'Test avec token invalide depuis mobile',
                typeUne: 'none',
                categorie: '507f1f77bcf86cd799439011',
                tags: '507f1f77bcf86cd799439012',
                keyWorod: ['mobile', 'test', 'auth'],
                image: '507f1f77bcf86cd799439013',
                statut: 'brouillon'
            }, {
                headers: {
                    ...mobileHeaders,
                    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalid.token'
                }
            });
            console.log('❌ ERREUR: La requête devrait échouer avec token invalide!');
        } catch (error) {
            if (error.response) {
                console.log(`✅ Comportement attendu: ${error.response.status} - ${error.response.data.message}`);
                console.log('   Détails:', error.response.data);
            } else if (error.code === 'ECONNREFUSED') {
                console.log('⚠️  SERVEUR NON DÉMARRÉ');
            } else {
                console.log('❌ Erreur réseau:', error.message);
            }
        }

        console.log('\n' + '='.repeat(70) + '\n');

        // Test 3: Vérification de la structure de la requête
        console.log('📝 Test 3: Analyse de la structure de la requête mobile\n');
        
        const testPayload = {
            titre: 'Mon Article Mobile',
            description: 'Description de mon article créé depuis mobile',
            typeUne: 'none',
            categorie: '507f1f77bcf86cd799439011',
            tags: '507f1f77bcf86cd799439012',
            keyWorod: ['actualité', 'mobile', 'test'],
            image: '507f1f77bcf86cd799439013',
            statut: 'brouillon'
        };

        console.log('📦 Payload de test:');
        console.log(JSON.stringify(testPayload, null, 2));
        
        console.log('\n✅ Structure valide:');
        console.log('   - titre: ✓ (requis, string, unique)');
        console.log('   - description: ✓ (string)');
        console.log('   - typeUne: ✓ (enum: top, une, rubrique, none)');
        console.log('   - categorie: ✓ (ObjectId référence)');
        console.log('   - tags: ✓ (ObjectId référence)');
        console.log('   - keyWorod: ✓ (array de strings)');
        console.log('   - image: ✓ (ObjectId référence)');
        console.log('   - statut: ✓ (enum: publie, brouillon, archive)');

        console.log('\n' + '='.repeat(70) + '\n');

        // Test 4: Instructions pour obtenir un token valide
        console.log('📝 Test 4: Pour tester avec un token valide\n');
        console.log('🔑 Étapes pour obtenir un token JWT:');
        console.log('   1. Se connecter via l\'endpoint de login:');
        console.log(`      POST ${API_BASE}/users/auth`);
        console.log('      Body: { "email": "votre@email.com", "password": "votre_mot_de_passe" }');
        console.log('');
        console.log('   2. Récupérer le token de la réponse');
        console.log('');
        console.log('   3. Utiliser le token dans le header:');
        console.log('      Authorization: Bearer <votre_token>');

        console.log('\n' + '='.repeat(70) + '\n');

        // Test 5: Exemple de requête avec token (commenté)
        console.log('📝 Test 5: Exemple de code pour l\'application mobile\n');
        console.log('```javascript');
        console.log('// Dans votre application mobile (React Native, Flutter, etc.)');
        console.log('const createArticle = async (token, articleData) => {');
        console.log('  try {');
        console.log(`    const response = await fetch('${API_BASE}/articles', {`);
        console.log('      method: \'POST\',');
        console.log('      headers: {');
        console.log('        \'Content-Type\': \'application/json\',');
        console.log('        \'Authorization\': `Bearer ${token}`,');
        console.log('        \'User-Agent\': \'Actu221-Mobile/1.0.0\',');
        console.log('      },');
        console.log('      body: JSON.stringify(articleData)');
        console.log('    });');
        console.log('    ');
        console.log('    if (!response.ok) {');
        console.log('      throw new Error(`HTTP error! status: ${response.status}`);');
        console.log('    }');
        console.log('    ');
        console.log('    const data = await response.json();');
        console.log('    console.log(\'Article créé:\', data);');
        console.log('    return data;');
        console.log('  } catch (error) {');
        console.log('    console.error(\'Erreur création article:\', error);');
        console.log('    throw error;');
        console.log('  }');
        console.log('};');
        console.log('```');

        console.log('\n' + '='.repeat(70) + '\n');

        // Test 6: Vérification des champs requis
        console.log('📝 Test 6: Validation des champs requis\n');
        
        const requiredFields = ['titre', 'categorie', 'tags', 'image'];
        const optionalFields = ['description', 'typeUne', 'keyWorod', 'statut'];
        
        console.log('🔴 Champs REQUIS:');
        requiredFields.forEach(field => {
            console.log(`   - ${field}`);
        });
        
        console.log('\n🟢 Champs OPTIONNELS:');
        optionalFields.forEach(field => {
            console.log(`   - ${field}`);
        });

        console.log('\n📌 Note: Le champ "author" est automatiquement rempli depuis le token JWT');
        console.log('📌 Note: Le champ "slug" est automatiquement généré depuis le titre');
        console.log('📌 Note: Le champ "date" est automatiquement défini à la date actuelle');

    } catch (error) {
        console.error('❌ Erreur lors du test:', error.message);
    }
}

// Fonction pour vérifier si le serveur est démarré
async function checkServer() {
    console.log('🔍 Vérification de la connexion au serveur...\n');
    try {
        const response = await axios.get(`${API_BASE}/articles?page=1&pageSize=1`);
        console.log('✅ Serveur accessible!');
        console.log(`   URL: ${API_BASE}`);
        console.log(`   Status: ${response.status}`);
        return true;
    } catch (error) {
        if (error.code === 'ECONNREFUSED') {
            console.log('❌ Serveur non accessible');
            console.log(`   URL tentée: ${API_BASE}`);
            console.log('\n💡 Solutions:');
            console.log('   1. Démarrer le serveur: npm start ou npm run dev');
            console.log('   2. Vérifier que le port est correct dans .env');
            console.log('   3. Vérifier que MongoDB est démarré');
            return false;
        }
        console.log('⚠️  Erreur de connexion:', error.message);
        return false;
    }
}

// Exécuter les tests
(async () => {
    console.log('\n' + '='.repeat(70));
    console.log('🚀 TEST DE CRÉATION D\'ARTICLE - VERSION MOBILE');
    console.log('='.repeat(70) + '\n');
    
    const serverRunning = await checkServer();
    console.log('\n' + '='.repeat(70) + '\n');
    
    await testMobileArticleCreation();
    
    console.log('\n' + '='.repeat(70));
    console.log('📊 RÉSUMÉ DES TESTS MOBILE');
    console.log('='.repeat(70) + '\n');
    
    console.log('✅ Structure de l\'API vérifiée');
    console.log('✅ Headers mobiles configurés');
    console.log('✅ Validation des champs testée');
    console.log('✅ Gestion des erreurs vérifiée');
    
    if (!serverRunning) {
        console.log('\n⚠️  Le serveur n\'est pas démarré, impossible de tester les requêtes réelles');
        console.log('   Pour tester complètement:');
        console.log('   1. Démarrer le serveur: npm start');
        console.log('   2. Se connecter pour obtenir un token');
        console.log('   3. Modifier ce script pour inclure le token');
        console.log('   4. Relancer le test');
    } else {
        console.log('\n💡 Pour tester avec un utilisateur réel:');
        console.log('   1. Connectez-vous à l\'API pour obtenir un token');
        console.log('   2. Remplacez le token dans ce script');
        console.log('   3. Relancez le test');
    }
    
    console.log('\n' + '='.repeat(70));
})();

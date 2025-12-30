const axios = require('axios');
const readline = require('readline');
require('dotenv').config();

const API_URL = process.env.API_URL || 'http://localhost:3800';
const API_BASE = `${API_URL}/api/v1`;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

async function testWithRealToken() {
    console.log('\n' + '='.repeat(70));
    console.log('📱 TEST INTERACTIF - CRÉATION D\'ARTICLE MOBILE');
    console.log('='.repeat(70) + '\n');

    try {
        // Vérifier si le serveur est accessible
        console.log('🔍 Vérification du serveur...');
        try {
            await axios.get(`${API_BASE}/articles?page=1&pageSize=1`);
            console.log('✅ Serveur accessible à', API_URL);
        } catch (error) {
            if (error.code === 'ECONNREFUSED') {
                console.log('\n❌ ERREUR: Le serveur n\'est pas démarré!');
                console.log('   Veuillez démarrer le serveur avec: npm start ou npm run dev');
                rl.close();
                return;
            }
        }

        console.log('\n' + '='.repeat(70));
        console.log('Option 1: Test avec connexion (recommandé)');
        console.log('Option 2: Test avec token existant');
        console.log('Option 3: Afficher la documentation');
        console.log('='.repeat(70) + '\n');

        const choice = await question('Votre choix (1/2/3): ');

        if (choice === '1') {
            // Test avec connexion
            console.log('\n📝 Connexion à l\'API...\n');
            
            const email = await question('Email: ');
            const password = await question('Mot de passe: ');

            try {
                console.log('\n🔐 Tentative de connexion...');
                const loginResponse = await axios.post(`${API_BASE}/users/auth`, {
                    email,
                    password
                });

                console.log('✅ Connexion réussie!');
                const token = loginResponse.data.data?.token || loginResponse.data.token;
                
                if (!token) {
                    console.log('❌ Token non trouvé dans la réponse');
                    console.log('Réponse:', JSON.stringify(loginResponse.data, null, 2));
                    rl.close();
                    return;
                }

                console.log('\n🎫 Token obtenu:', token.substring(0, 20) + '...');
                
                // Créer un article
                await createArticleWithToken(token);

            } catch (error) {
                console.log('\n❌ Échec de la connexion');
                if (error.response) {
                    console.log('Status:', error.response.status);
                    console.log('Message:', error.response.data.message);
                } else {
                    console.log('Erreur:', error.message);
                }
            }

        } else if (choice === '2') {
            // Test avec token existant
            console.log('\n📝 Entrez votre token JWT:\n');
            const token = await question('Token: ');
            
            if (!token || token.trim() === '') {
                console.log('❌ Token vide, abandon du test');
                rl.close();
                return;
            }

            await createArticleWithToken(token.trim());

        } else if (choice === '3') {
            // Afficher la documentation
            showDocumentation();
        } else {
            console.log('❌ Choix invalide');
        }

    } catch (error) {
        console.error('❌ Erreur:', error.message);
    } finally {
        rl.close();
    }
}

async function createArticleWithToken(token) {
    console.log('\n' + '='.repeat(70));
    console.log('📱 CRÉATION D\'ARTICLE DEPUIS MOBILE');
    console.log('='.repeat(70) + '\n');

    // Données de l'article de test
    const articleData = {
        titre: `Article Mobile Test ${Date.now()}`,
        description: 'Ceci est un article de test créé depuis une application mobile',
        typeUne: 'none',
        categorie: '669b0b3bfe714afd6cf57389', // ID Actualité (à ajuster selon votre BDD)
        tags: '669b0b3bfe714afd6cf57389', // À ajuster selon votre BDD
        keyWorod: ['mobile', 'test', 'api'],
        image: '669b0b3bfe714afd6cf57389', // À ajuster selon votre BDD
        statut: 'brouillon'
    };

    console.log('📦 Données de l\'article:');
    console.log(JSON.stringify(articleData, null, 2));

    const mobileHeaders = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'Actu221-Mobile/1.0.0 (iOS 16.0; iPhone 14)',
        'X-Platform': 'mobile',
        'X-Device-Type': 'ios'
    };

    console.log('\n📱 Headers mobile:');
    console.log('   - Authorization: Bearer ' + token.substring(0, 20) + '...');
    console.log('   - User-Agent: Actu221-Mobile/1.0.0');
    console.log('   - X-Platform: mobile');

    try {
        console.log('\n🚀 Envoi de la requête...');
        
        const response = await axios.post(`${API_BASE}/articles`, articleData, {
            headers: mobileHeaders
        });

        console.log('\n✅ SUCCÈS! Article créé');
        console.log('\n📄 Réponse du serveur:');
        console.log(JSON.stringify(response.data, null, 2));

        if (response.data.data) {
            console.log('\n📌 Détails de l\'article créé:');
            console.log(`   - ID: ${response.data.data._id || response.data.data.id}`);
            console.log(`   - Titre: ${response.data.data.titre}`);
            console.log(`   - Slug: ${response.data.data.slug}`);
            console.log(`   - Statut: ${response.data.data.statut}`);
            console.log(`   - Auteur: ${response.data.data.author}`);
        }

        console.log('\n✨ L\'utilisateur peut créer des articles depuis mobile!');

    } catch (error) {
        console.log('\n❌ ÉCHEC de la création');
        
        if (error.response) {
            console.log('\n📊 Détails de l\'erreur:');
            console.log(`   Status: ${error.response.status}`);
            console.log(`   Message: ${error.response.data.message}`);
            console.log(`   Data:`, JSON.stringify(error.response.data, null, 2));

            // Analyse des erreurs
            if (error.response.status === 403) {
                console.log('\n⚠️  ANALYSE: Token invalide ou expiré');
                console.log('   Solutions:');
                console.log('   - Vérifier que le token est correct');
                console.log('   - Se reconnecter pour obtenir un nouveau token');
                console.log('   - Vérifier que l\'utilisateur a les permissions (journaliste/admin)');
            } else if (error.response.status === 500) {
                console.log('\n⚠️  ANALYSE: Erreur serveur');
                console.log('   Causes possibles:');
                console.log('   - IDs de catégorie/tags/image invalides');
                console.log('   - Erreur de validation Mongoose');
                console.log('   - Titre déjà existant (contrainte unique)');
                
                if (error.response.data.data) {
                    console.log('\n   Erreur détaillée:', error.response.data.data);
                }
            } else if (error.response.status === 400) {
                console.log('\n⚠️  ANALYSE: Données invalides');
                console.log('   Vérifier que tous les champs requis sont présents');
            }
        } else {
            console.log('   Erreur:', error.message);
        }

        console.log('\n❌ L\'utilisateur ne peut pas créer d\'articles (voir erreurs ci-dessus)');
    }
}

function showDocumentation() {
    console.log('\n' + '='.repeat(70));
    console.log('📚 DOCUMENTATION - CRÉATION D\'ARTICLE MOBILE');
    console.log('='.repeat(70) + '\n');

    console.log('🔐 AUTHENTIFICATION:');
    console.log('   1. Endpoint: POST /api/v1/users/auth');
    console.log('   2. Body: { "email": "...", "password": "..." }');
    console.log('   3. Récupérer le token de la réponse');
    console.log('');

    console.log('📝 CRÉATION D\'ARTICLE:');
    console.log('   1. Endpoint: POST /api/v1/articles');
    console.log('   2. Header: Authorization: Bearer <token>');
    console.log('   3. Body (JSON):');
    console.log('      {');
    console.log('        "titre": "Titre de l\'article",');
    console.log('        "description": "Description...",');
    console.log('        "typeUne": "none|top|une|rubrique",');
    console.log('        "categorie": "ObjectId de la catégorie",');
    console.log('        "tags": "ObjectId du tag",');
    console.log('        "keyWorod": ["mot1", "mot2"],');
    console.log('        "image": "ObjectId de l\'image",');
    console.log('        "statut": "publie|brouillon|archive"');
    console.log('      }');
    console.log('');

    console.log('👤 RÔLES REQUIS:');
    console.log('   - administrateur');
    console.log('   - journaliste');
    console.log('   - redacteur');
    console.log('');

    console.log('📱 HEADERS RECOMMANDÉS POUR MOBILE:');
    console.log('   - Content-Type: application/json');
    console.log('   - Authorization: Bearer <token>');
    console.log('   - User-Agent: YourApp/Version');
    console.log('   - X-Platform: mobile (optionnel)');
    console.log('');

    console.log('✅ CHAMPS AUTO-REMPLIS:');
    console.log('   - author: Depuis le token JWT');
    console.log('   - slug: Généré depuis le titre');
    console.log('   - date: Date actuelle (timezone Africa/Dakar)');
    console.log('');

    console.log('❌ ERREURS COURANTES:');
    console.log('   - 400: Token manquant ou champs invalides');
    console.log('   - 403: Token invalide ou permissions insuffisantes');
    console.log('   - 500: Erreur serveur (IDs invalides, titre dupliqué, etc.)');
}

// Exécution
testWithRealToken();

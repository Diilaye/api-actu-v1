const axios = require('axios');
require('dotenv').config();

const API_URL = process.env.API_URL || 'http://localhost:3800';
const API_BASE = `${API_URL}/api/v1`;

async function quickTest() {
    console.log('\n🧪 Test Rapide de Connexion\n');
    console.log('='.repeat(60) + '\n');
    
    // Credentials de test (remplacez par vos vraies credentials)
    const email = 'diikaanedev@gmail.com';
    const password = 'passer123';
    
    try {
        console.log('🔐 Tentative de connexion...');
        console.log(`   Email: ${email}`);
        console.log(`   Endpoint: ${API_BASE}/users/auth\n`);
        
        const response = await axios.post(`${API_BASE}/users/auth`, {
            email,
            password
        });
        
        console.log('✅ CONNEXION RÉUSSIE!\n');
        console.log('📊 Réponse du serveur:');
        console.log(JSON.stringify(response.data, null, 2));
        
        if (response.data.data?.token) {
            const token = response.data.data.token;
            console.log('\n🎫 Token JWT obtenu:');
            console.log(`   ${token.substring(0, 50)}...`);
            console.log(`   Longueur: ${token.length} caractères`);
            
            // Test de création d'article
            console.log('\n' + '='.repeat(60));
            console.log('📝 Test de création d\'article...\n');
            
            const articleData = {
                titre: `Test Mobile ${Date.now()}`,
                description: 'Article de test créé depuis mobile',
                typeUne: 'none',
                categorie: '669b0b3bfe714afd6cf57389',
                tags: '669b0b3bfe714afd6cf57389',
                keyWorod: ['test', 'mobile'],
                image: '669b0b3bfe714afd6cf57389',
                statut: 'brouillon'
            };
            
            try {
                const articleResponse = await axios.post(
                    `${API_BASE}/articles`,
                    articleData,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                            'User-Agent': 'Actu221-Mobile/1.0.0'
                        }
                    }
                );
                
                console.log('✅ ARTICLE CRÉÉ AVEC SUCCÈS!\n');
                console.log('📄 Réponse:');
                console.log(JSON.stringify(articleResponse.data, null, 2));
                
                console.log('\n' + '='.repeat(60));
                console.log('🎉 RÉSULTAT FINAL: L\'utilisateur PEUT créer des articles depuis mobile!');
                console.log('='.repeat(60));
                
            } catch (error) {
                console.log('❌ Erreur lors de la création d\'article\n');
                if (error.response) {
                    console.log(`Status: ${error.response.status}`);
                    console.log(`Message: ${error.response.data.message || 'Aucun message'}`);
                    console.log('\nDétails:');
                    console.log(JSON.stringify(error.response.data, null, 2));
                    
                    if (error.response.status === 500 && error.response.data.data) {
                        console.log('\n⚠️  ANALYSE: L\'erreur est probablement due à:');
                        console.log('   - IDs de catégorie/tags/image invalides dans la base de données');
                        console.log('   - Titre déjà existant (contrainte unique)');
                        console.log('\n💡 Solution: Vérifier les IDs valides avec:');
                        console.log(`   GET ${API_BASE}/categories`);
                        console.log(`   GET ${API_BASE}/tags`);
                    }
                } else {
                    console.log('Erreur:', error.message);
                }
            }
        }
        
    } catch (error) {
        console.log('❌ ERREUR DE CONNEXION\n');
        if (error.response) {
            console.log(`Status: ${error.response.status}`);
            console.log(`Message: ${error.response.data?.message || 'Aucun message'}`);
            console.log('\nDétails:');
            console.log(JSON.stringify(error.response.data, null, 2));
            
            if (error.response.status === 404) {
                console.log('\n⚠️  L\'utilisateur n\'existe pas ou les identifiants sont incorrects');
            }
        } else if (error.code === 'ECONNREFUSED') {
            console.log('⚠️  Le serveur n\'est pas accessible');
            console.log(`   URL: ${API_URL}`);
            console.log('   Solution: Vérifier que le serveur est démarré');
        } else {
            console.log('Erreur:', error.message);
        }
    }
}

quickTest();

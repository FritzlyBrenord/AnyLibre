import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  console.log('=== DEBUT REQUETE GENERATE-PROFILE ===');
  
  try {
    const body = await request.json();
    const { userInput } = body;

    console.log('User input reçu:', userInput);

    if (!userInput || userInput.trim().length === 0) {
      console.log('Erreur: userInput vide');
      return NextResponse.json(
        { 
          error: 'Le texte utilisateur est requis',
          details: 'Le champ userInput ne peut pas être vide'
        },
        { status: 400 }
      );
    }

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

    if (!OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY non configurée dans .env.local');
      return NextResponse.json(
        { 
          error: 'Configuration manquante',
          details: 'La clé API OpenAI n\'est pas configurée dans .env.local'
        },
        { status: 500 }
      );
    }

    console.log('API Key trouvée, longueur:', OPENAI_API_KEY.length);

    const prompt = `En tant qu'expert en rédaction de profils freelance, réécris et améliore la description suivante pour qu'elle soit plus attractive pour les clients. Crée un texte professionnel, engageant et persuasif entre 250 et 500 caractères.

Texte original: "${userInput}"

Instructions:
- Réécris en français professionnel
- Mets en valeur les compétences et l'expertise
- Utilise un ton confiant mais accessible
- Structure avec des phrases percutantes
- Garde entre 250 et 500 caractères
- Pas de listes à puces, texte continu
- Focus sur la valeur apportée au client
- Retourne uniquement le texte optimisé sans commentaires

Description optimisée:`;

    console.log('Envoi requête à OpenAI...');

    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'Tu es un expert en rédaction de profils freelance. Tu aides les freelances à se démarquer avec des descriptions percutantes. Tu réponds uniquement avec le texte optimisé, sans commentaires.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    console.log('Statut réponse OpenAI:', openaiResponse.status);

    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text();
      console.error('Erreur OpenAI détaillée:', {
        status: openaiResponse.status,
        statusText: openaiResponse.statusText,
        errorText: errorText
      });
      
      let errorMessage = `Erreur OpenAI: ${openaiResponse.status}`;
      
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.error?.message || errorText;
      } catch {
        errorMessage = errorText || openaiResponse.statusText;
      }
      
      throw new Error(errorMessage);
    }

    const data = await openaiResponse.json();
    console.log('Réponse OpenAI complète:', JSON.stringify(data, null, 2));

    const description = data.choices[0]?.message?.content?.trim();

    if (!description) {
      console.error('Aucune description dans la réponse OpenAI');
      throw new Error('Aucune réponse générée par le service IA');
    }

    console.log('Description générée:', description);
    console.log('Longueur:', description.length);
    console.log('=== FIN REQUETE SUCCES ===');

    return NextResponse.json({ 
      description,
      tokens: data.usage?.total_tokens 
    });

  } catch (error) {
    console.error('=== ERREUR CRITIQUE ===');
    console.error('Erreur API generate-profile:', error);
    console.error('Stack:', (error as Error).stack);
    console.error('=== FIN ERREUR ===');
    
    return NextResponse.json(
      { 
        error: 'Erreur lors de la génération',
        details: (error as Error).message
      },
      { status: 500 }
    );
  }
}
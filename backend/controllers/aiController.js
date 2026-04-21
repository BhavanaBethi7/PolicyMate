const axios = require('axios');

// Helper function to call AI API (Groq or OpenAI)
const callAIAPI = async (messages, maxTokens = 500) => {
  const useGroq = !!process.env.GROQ_API_KEY;
  
  if (!useGroq && !process.env.OPENAI_API_KEY) {
    throw new Error('Neither GROQ_API_KEY nor OPENAI_API_KEY is configured');
  }

  const apiUrl = useGroq 
    ? 'https://api.groq.com/openai/v1/chat/completions'
    : 'https://api.openai.com/v1/chat/completions' || 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.0-flash:generateContent?key=' ;
  
  const apiKey = useGroq ? process.env.GROQ_API_KEY : process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY;
  const model = useGroq ? 'llama-3.3-70b-versatile' : 'gpt-3.5-turbo' || 'gemini-3.0-flash';

  const response = await axios.post(
    apiUrl,
    {
      model,
      messages,
      max_tokens: maxTokens,
      temperature: messages[0]?.temperature || 0.5
    },
    {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    }
  );

  return response.data.choices[0].message.content;
};

// Parse user text input into structured profile data
const parseProfileText = async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({
        success: false,
        message: 'Text input is required'
      });
    }

    const prompt = `
Parse the following user information into a structured JSON profile. Extract only the information that is clearly mentioned. Return null for fields not mentioned.

User text: "${text}"

Return ONLY a JSON object with these exact fields (no markdown, no code blocks):
{
  "name": "full name if mentioned",
  "age": "age as number if mentioned", 
  "gender": "Male/Female/Other if mentioned",
  "educationLevel": "10th/12th/Diploma/Undergraduate/Postgraduate",
  "course": "field of study if mentioned",
  "state": "state of residence if mentioned",
  "category": "General/OBC/SC/ST/EWS if mentioned",
  "income": "annual family income as number if mentioned",
  "locationType": "Urban/Rural if mentioned"
}

Only return the JSON object, no additional text.
`;

    const messages = [
      {
        role: 'system',
        content: 'You are a data extraction assistant. Parse user input into structured JSON format. Return ONLY valid JSON, no markdown.'
      },
      {
        role: 'user',
        content: prompt,
        temperature: 0.1
      }
    ];

    const aiResponse = await callAIAPI(messages, 500);
    
    try {
      const cleanedResponse = aiResponse
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();
      const parsedProfile = JSON.parse(cleanedResponse);
      
      res.status(200).json({
        success: true,
        profile: parsedProfile
      });
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      console.log('Raw response:', aiResponse);
      res.status(500).json({
        success: false,
        message: 'Failed to parse AI response',
        error: parseError.message
      });
    }
  } catch (error) {
    console.error('AI parsing error:', error.message);
    
    if (error.response?.status === 429) {
      return res.status(429).json({
        success: false,
        message: 'API rate limit exceeded'
      });
    }
    
    if (error.response?.status === 401) {
      return res.status(401).json({
        success: false,
        message: 'Invalid API key - check GROQ_API_KEY or OPENAI_API_KEY'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while processing AI request',
      error: error.message
    });
  }
};

// Explain why a scheme matches user profile
const explainSchemeMatch = async (req, res) => {
  try {
    const { profile, scheme } = req.body;
    
    if (!profile || !scheme) {
      return res.status(400).json({
        success: false,
        message: 'Profile and scheme data are required'
      });
    }

    const prompt = `
Explain why the following user profile matches the eligibility criteria for this government scheme. Provide a clear, concise explanation in 3-4 bullet points.

User Profile:
- Education: ${profile.educationLevel}
- Course: ${profile.course || 'Not specified'}
- State: ${profile.state}
- Category: ${profile.category}
- Income: ${profile.income || 'Not specified'}
- Age: ${profile.age || 'Not specified'}
- Gender: ${profile.gender || 'Not specified'}
- Location: ${profile.locationType || 'Not specified'}

Scheme Details:
- Name: ${scheme.name}
- Category: ${scheme.category}
- Description: ${scheme.description}
- Education Required: ${scheme.eligibility.education.join(', ')}
- Categories: ${scheme.eligibility.categories.join(', ')}
- Income Limit: ${scheme.eligibility.income}
- States: ${scheme.eligibility.states.join(', ')}
- Age Range: ${scheme.eligibility.age ? `${scheme.eligibility.age.min}-${scheme.eligibility.age.max}` : 'Any'}
- Gender: ${scheme.eligibility.gender}
- Location Type: ${scheme.eligibility.locationType}

Provide the explanation in a clear, encouraging tone. Focus on the positive matches.
`;

    const messages = [
      {
        role: 'system',
        content: 'You are a helpful assistant explaining government scheme eligibility. Be encouraging and clear.'
      },
      {
        role: 'user',
        content: prompt,
        temperature: 0.7
      }
    ];

    const explanation = await callAIAPI(messages, 300);
    
    res.status(200).json({
      success: true,
      explanation
    });
  } catch (error) {
    console.error('AI explanation error:', error.message);
    
    if (error.response?.status === 429) {
      return res.status(429).json({
        success: false,
        message: 'API rate limit exceeded'
      });
    }
    
    if (error.response?.status === 401) {
      return res.status(401).json({
        success: false,
        message: 'Invalid API key'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while generating explanation',
      error: error.message
    });
  }
};

// Answer user queries about schemes
const askAboutSchemes = async (req, res) => {
  try {
    const { query, schemes } = req.body;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Query is required'
      });
    }

    let schemesContext = '';
    if (schemes && schemes.length > 0) {
      schemesContext = '\n\nAvailable Schemes:\n' + 
        schemes.map((scheme, index) => 
          `${index + 1}. ${scheme.name} - ${scheme.description.substring(0, 100)}...`
        ).join('\n');
    }

    const prompt = `
Answer the user's question about government schemes, scholarships, internships, or job opportunities. Be helpful and accurate.

User Question: "${query}"
${schemesContext}

Provide a clear, informative answer. If the question is about specific schemes mentioned above, focus on those. If you don't have enough information, suggest what additional details would be helpful.
`;

    const messages = [
      {
        role: 'system',
        content: 'You are a knowledgeable assistant about government schemes and opportunities in India. Provide accurate, helpful information.'
      },
      {
        role: 'user',
        content: prompt,
        temperature: 0.5
      }
    ];

    const answer = await callAIAPI(messages, 400);
    
    res.status(200).json({
      success: true,
      answer
    });
  } catch (error) {
    console.error('AI query error:', error.message);
    
    if (error.response?.status === 429) {
      return res.status(429).json({
        success: false,
        message: 'API rate limit exceeded'
      });
    }
    
    if (error.response?.status === 401) {
      return res.status(401).json({
        success: false,
        message: 'Invalid API key'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while processing query',
      error: error.message
    });
  }
};

module.exports = {
  parseProfileText,
  explainSchemeMatch,
  askAboutSchemes
};

const axios = require('axios');

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

Return a JSON object with these exact fields:
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

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a data extraction assistant. Parse user input into structured JSON format.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.1
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const aiResponse = response.data.choices[0].message.content;
    
    try {
      const parsedProfile = JSON.parse(aiResponse);
      
      res.status(200).json({
        success: true,
        profile: parsedProfile
      });
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      res.status(500).json({
        success: false,
        message: 'Failed to parse AI response'
      });
    }
  } catch (error) {
    console.error('AI parsing error:', error);
    
    if (error.response?.status === 401) {
      return res.status(500).json({
        success: false,
        message: 'AI service configuration error'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while processing AI request'
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

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant explaining government scheme eligibility. Be encouraging and clear.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 300,
        temperature: 0.7
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const explanation = response.data.choices[0].message.content;
    
    res.status(200).json({
      success: true,
      explanation
    });
  } catch (error) {
    console.error('AI explanation error:', error);
    
    if (error.response?.status === 401) {
      return res.status(500).json({
        success: false,
        message: 'AI service configuration error'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while generating explanation'
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

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a knowledgeable assistant about government schemes and opportunities in India. Provide accurate, helpful information.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 400,
        temperature: 0.5
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const answer = response.data.choices[0].message.content;
    
    res.status(200).json({
      success: true,
      answer
    });
  } catch (error) {
    console.error('AI query error:', error);
    
    if (error.response?.status === 401) {
      return res.status(500).json({
        success: false,
        message: 'AI service configuration error'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while processing query'
    });
  }
};

module.exports = {
  parseProfileText,
  explainSchemeMatch,
  askAboutSchemes
};

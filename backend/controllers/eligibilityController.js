// In backend/controllers/eligibilityController.js

const Scheme = require('../models/Scheme');
const axios = require('axios');
const { explainSchemeMatch, askAboutSchemes } = require('./aiController');

// Get AI explanations for schemes (intelligent AI analysis)
const getAIEnhancedEligibility = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log('Getting AI-enhanced eligibility for user:', userId);
    
    // Get user profile
    const Profile = require('../models/Profile');
    const profile = await Profile.findOne({ userId });
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    // Get all active schemes from database
    const schemes = await Scheme.find({ active: true });
    console.log(`Found ${schemes.length} schemes to analyze`);

    if (schemes.length === 0) {
      return res.status(200).json({
        success: true,
        schemes: [],
        totalSchemes: 0
      });
    }

    // Prepare compact scheme format for AI
    const schemesCompact = schemes.map(s => {
      const edu = Array.isArray(s.eligibility.education) ? s.eligibility.education.join(',') : (s.eligibility.education || 'Any');
      const states = Array.isArray(s.eligibility.states) ? s.eligibility.states.join(',') : (s.eligibility.states || 'Any');
      const cats = Array.isArray(s.eligibility.categories) ? s.eligibility.categories.join(',') : (s.eligibility.categories || 'Any');
      const locType = Array.isArray(s.eligibility.locationType) ? s.eligibility.locationType.join(',') : (s.eligibility.locationType || 'Any');
      return `${s._id}|${s.name}|Edu:${edu}|States:${states}|Cat:${cats}|Income:${s.eligibility.income || 'Any'}|Age:${s.eligibility.age?.min || 'Any'}-${s.eligibility.age?.max || 'Any'}|Gender:${s.eligibility.gender || 'Any'}|Loc:${locType}`;
    }).join('\n');

    // Compact AI Analysis Prompt (optimized for token efficiency)
    const aiAnalysisPrompt = `Analyze eligibility for user against schemes.

USER: Edu=${profile.educationLevel||'?'},State=${profile.state||'?'},Cat=${profile.category||'General'},Income=${profile.income||'?'},Age=${profile.age||'?'},Gender=${profile.gender||'?'},Loc=${profile.locationType||'?'}

SCHEMES (format: ID|Name|Edu:|States:|Cat:|Income:|Age:|Gender:|Loc:):
${schemesCompact}

IMPORTANT: Return ONLY valid JSON array with NO line breaks in explanation strings. Use simple text only.
[{"schemeId":"id","matchPercentage":85,"explanation":"simple reason without special chars"}]`;

    // Check if API key exists
    if (!process.env.GROQ_API_KEY && !process.env.OPENAI_API_KEY) {
      return res.status(400).json({
        success: false,
        message: 'GROQ_API_KEY or OPENAI_API_KEY not configured. Please set one in your .env file.'
      });
    }

    const useGroq = !!process.env.GROQ_API_KEY;
    console.log(`🤖 Calling ${useGroq ? 'Groq' : 'OpenAI'} API for intelligent analysis...`);
    
    const apiUrl = useGroq 
      ? 'https://api.groq.com/openai/v1/chat/completions'
      : 'https://api.openai.com/v1/chat/completions';
    
    const apiKey = useGroq ? process.env.GROQ_API_KEY : process.env.OPENAI_API_KEY;
    // Use llama-3.3-70b-versatile for Groq
    const model = useGroq ? 'llama-3.3-70b-versatile' : 'gpt-3.5-turbo';

    try {
      const aiResponse = await axios.post(
        apiUrl,
        {
          model,
          messages: [
            {
              role: 'user',
              content: aiAnalysisPrompt
            }
          ],
          max_tokens: 1000,
          temperature: 0.1
        },
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const aiResponseText = aiResponse.data.choices[0].message.content.trim();
      console.log('✅ AI response received:', aiResponseText.substring(0, 200));

      // Parse AI response - extract JSON array from response
      let aiResults;
      try {
        // Remove markdown code blocks and extra text
        let cleanedResponse = aiResponseText
          .replace(/```json\n?/g, '')
          .replace(/```\n?/g, '')
          .trim();
        
        // Extract JSON array if embedded in text
        const jsonMatch = cleanedResponse.match(/\[\s*\{[\s\S]*\}\s*\]/);
        if (jsonMatch) {
          cleanedResponse = jsonMatch[0];
        }
        
        // Clean the JSON: escape unescaped quotes in values and fix line breaks
        cleanedResponse = cleanedResponse
          .replace(/\n/g, ' ')  // Replace newlines with spaces
          .replace(/\r/g, '')   // Remove carriage returns
          .replace(/: "([^"]*)"([,\}\]])/g, (match, value, end) => {
            // Escape any unescaped quotes within the value
            const escaped = value.replace(/"/g, '\\"');
            return `: "${escaped}"${end}`;
          });
        
        aiResults = JSON.parse(cleanedResponse);
        
        // Ensure it's an array
        if (!Array.isArray(aiResults)) {
          aiResults = [aiResults];
        }
      } catch (parseError) {
        console.error('❌ Failed to parse AI response:', parseError.message);
        console.log('Raw response (first 500 chars):', aiResponseText.substring(0, 500));
        throw parseError;
      }

      // Merge AI results with scheme data
      const enhancedSchemes = schemes.map(scheme => {
        const aiResult = aiResults.find(r => r.schemeId === scheme._id.toString());
        
        return {
          scheme: {
            _id: scheme._id,
            name: scheme.name,
            category: scheme.category,
            description: scheme.description,
            benefits: scheme.benefits,
            amount: scheme.amount,
            duration: scheme.duration,
            applicationProcess: scheme.applicationProcess,
            officialLink: scheme.officialLink,
            applicationLink: scheme.applicationLink,
            lastDate: scheme.lastDate,
            eligibility: scheme.eligibility  // Add this for state filtering
          },
          matchPercentage: aiResult?.matchPercentage || 0,
          aiExplanation: aiResult?.explanation || 'Scheme eligibility not fully analyzed'
        };
      });

      // Sort by match percentage
      enhancedSchemes.sort((a, b) => b.matchPercentage - a.matchPercentage);

      // Return only schemes with >30% match
      const relevantSchemes = enhancedSchemes.filter(s => s.matchPercentage > 30);

      return res.status(200).json({
        success: true,
        schemes: relevantSchemes.slice(0, 15),
        totalSchemes: schemes.length,
        aiEnabled: true,
        aiProvider: useGroq ? 'Groq' : 'OpenAI'
      });

    } catch (aiError) {
      console.error('❌ AI API Error:', aiError.message);
      console.error('Error details:', {
        status: aiError.response?.status,
        statusText: aiError.response?.statusText,
        data: aiError.response?.data
      });
      
      // Try OpenAI if Groq hits rate limit
      if (aiError.response?.status === 429 && useGroq) {
        console.log('🔄 Groq rate limited, trying OpenAI fallback...');
        try {
          const openAIResponse = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
              model: 'gpt-3.5-turbo',
              messages: [
                {
                  role: 'user',
                  content: aiAnalysisPrompt
                }
              ],
              max_tokens: 1000,
              temperature: 0.1
            },
            {
              headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
              }
            }
          );

          const aiResponseText = openAIResponse.data.choices[0].message.content.trim();
          console.log('✅ OpenAI fallback succeeded');

          let aiResults = JSON.parse(aiResponseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim());
          if (!Array.isArray(aiResults)) aiResults = [aiResults];

          const enhancedSchemes = schemes.map(scheme => {
            const aiResult = aiResults.find(r => r.schemeId === scheme._id.toString());
            return {
              scheme: {
                _id: scheme._id,
                name: scheme.name,
                category: scheme.category,
                description: scheme.description,
                benefits: scheme.benefits,
                amount: scheme.amount,
                duration: scheme.duration,
                applicationProcess: scheme.applicationProcess,
                officialLink: scheme.officialLink,
                applicationLink: scheme.applicationLink,
                lastDate: scheme.lastDate,
                eligibility: scheme.eligibility
              },
              matchPercentage: aiResult?.matchPercentage || 0,
              aiExplanation: aiResult?.explanation || 'Scheme eligibility not fully analyzed'
            };
          });

          enhancedSchemes.sort((a, b) => b.matchPercentage - a.matchPercentage);
          const relevantSchemes = enhancedSchemes.filter(s => s.matchPercentage > 30);

          return res.status(200).json({
            success: true,
            schemes: relevantSchemes.slice(0, 15),
            totalSchemes: schemes.length,
            aiEnabled: true,
            aiProvider: 'OpenAI (Groq fallback)'
          });
        } catch (openAIError) {
          console.error('❌ OpenAI fallback also failed:', openAIError.message);
          console.error('OpenAI error details:', {
            status: openAIError.response?.status,
            data: openAIError.response?.data
          });
          console.log('🔄 Trying Gemini API as final fallback...');
          try {
            console.log('🔑 Gemini API Key:', process.env.GEMINI_API_KEY ? '✓ Loaded' : '✗ Missing');
            
            const geminiResponse = await axios.post(
              `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
              {
                contents: [{
                  parts: [{
                    text: aiAnalysisPrompt
                  }]
                }],
                generationConfig: {
                  temperature: 0.1,
                  maxOutputTokens: 1000
                }
              },
              {
                headers: {
                  'Content-Type': 'application/json'
                }
              }
            );

            const aiResponseText = geminiResponse.data.candidates[0].content.parts[0].text.trim();
            console.log('✅ Gemini fallback succeeded');

            let aiResults = JSON.parse(aiResponseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim());
            if (!Array.isArray(aiResults)) aiResults = [aiResults];

            const enhancedSchemes = schemes.map(scheme => {
              const aiResult = aiResults.find(r => r.schemeId === scheme._id.toString());
              return {
                scheme: {
                  _id: scheme._id,
                  name: scheme.name,
                  category: scheme.category,
                  description: scheme.description,
                  benefits: scheme.benefits,
                  amount: scheme.amount,
                  duration: scheme.duration,
                  applicationProcess: scheme.applicationProcess,
                  officialLink: scheme.officialLink,
                  applicationLink: scheme.applicationLink,
                  lastDate: scheme.lastDate,
                  eligibility: scheme.eligibility
                },
                matchPercentage: aiResult?.matchPercentage || 0,
                aiExplanation: aiResult?.explanation || 'Scheme eligibility not fully analyzed'
              };
            });

            enhancedSchemes.sort((a, b) => b.matchPercentage - a.matchPercentage);
            const relevantSchemes = enhancedSchemes.filter(s => s.matchPercentage > 30);

            return res.status(200).json({
              success: true,
              schemes: relevantSchemes.slice(0, 15),
              totalSchemes: schemes.length,
              aiEnabled: true,
              aiProvider: 'Gemini (OpenAI/Groq fallback)'
            });
          } catch (geminiError) {
            console.error('❌ Gemini fallback also failed:', geminiError.message);
            console.error('Gemini error details:', {
              status: geminiError.response?.status,
              statusText: geminiError.response?.statusText,
              data: geminiError.response?.data
            });
            console.log('🔄 All AI providers failed, using rule-based matching...');
            return executeRuleBasedMatching(schemes, profile, res);
          }
        }
      }
      
      if (aiError.response?.status === 401) {
        return res.status(401).json({
          success: false,
          message: 'Invalid API key. Please check your GROQ_API_KEY, OPENAI_API_KEY, or GEMINI_API_KEY in .env',
          error: aiError.message
        });
      }
      
      if (aiError.response?.status === 400) {
        return res.status(400).json({
          success: false,
          message: 'Invalid request to AI API. Possible model or API format issue.',
          error: aiError.message,
          details: aiError.response?.data
        });
      }

      console.log('🔄 AI failed, falling back to rule-based matching...');
      return executeRuleBasedMatching(schemes, profile, res);
    }
  } catch (error) {
    console.error('❌ Eligibility Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error getting eligibility',
      error: error.message
    });
  }
};

// Enhanced rule-based matching fallback
const executeRuleBasedMatching = async (schemes, profile, res) => {
  console.log('📊 Using enhanced rule-based matching...');
  
  const matchedSchemes = schemes.map(scheme => {
    let matchPercentage = 30; // Base score
    let reasons = [];

    // Education match (25 points)
    if (scheme.eligibility.education && Array.isArray(scheme.eligibility.education)) {
      if (scheme.eligibility.education.includes(profile.educationLevel)) {
        matchPercentage += 25;
        reasons.push(`Education matches: ${profile.educationLevel}`);
      } else if (scheme.eligibility.education.length === 0 || scheme.eligibility.education.includes('Any')) {
        matchPercentage += 15;
        reasons.push('Education: Open to all levels');
      }
    }

    // State match (20 points)
    if (scheme.eligibility.states && Array.isArray(scheme.eligibility.states)) {
      if (scheme.eligibility.states.includes(profile.state)) {
        matchPercentage += 20;
        reasons.push(`State eligible: ${profile.state}`);
      } else if (scheme.eligibility.states.includes('All')) {
        matchPercentage += 10;
        reasons.push('Available across all states');
      }
    }

    // Category match (15 points)
    if (scheme.eligibility.categories && Array.isArray(scheme.eligibility.categories)) {
      if (scheme.eligibility.categories.includes(profile.category)) {
        matchPercentage += 15;
        reasons.push(`Category match: ${profile.category}`);
      } else if (scheme.eligibility.categories.includes('General')) {
        matchPercentage += 5;
      }
    }

    // Income match (10 points)
    if (scheme.eligibility.income && profile.income) {
      const incomeLimit = scheme.eligibility.income;
      if (profile.income <= incomeLimit) {
        matchPercentage += 10;
        reasons.push(`Income eligible: ₹${profile.income} ≤ ₹${incomeLimit}`);
      }
    }

    // Age match (5 points)
    if (scheme.eligibility.age && profile.age) {
      if (profile.age >= scheme.eligibility.age.min && profile.age <= scheme.eligibility.age.max) {
        matchPercentage += 5;
        reasons.push(`Age range: ${scheme.eligibility.age.min}-${scheme.eligibility.age.max}`);
      }
    }

    // Location match (5 points)
    if (scheme.eligibility.locationType && profile.locationType) {
      if (scheme.eligibility.locationType.includes(profile.locationType)) {
        matchPercentage += 5;
        reasons.push(`Location: ${profile.locationType}`);
      }
    }

    matchPercentage = Math.min(matchPercentage, 95);

    return {
      scheme: {
        _id: scheme._id,
        name: scheme.name,
        category: scheme.category,
        description: scheme.description,
        benefits: scheme.benefits,
        amount: scheme.amount,
        duration: scheme.duration,
        applicationProcess: scheme.applicationProcess,
        officialLink: scheme.officialLink,
        applicationLink: scheme.applicationLink,
        lastDate: scheme.lastDate,
        eligibility: scheme.eligibility
      },
      matchPercentage,
      aiExplanation: reasons.length > 0 
        ? `✓ ${reasons.join('\n✓ ')}\n\nYou are eligible for this scheme based on your profile. Visit the official link to apply.`
        : 'Scheme available. Please verify eligibility criteria on the official website.'
    };
  });

  matchedSchemes.sort((a, b) => b.matchPercentage - a.matchPercentage);
  const relevantSchemes = matchedSchemes.filter(s => s.matchPercentage > 30);

  return res.status(200).json({
    success: true,
    schemes: relevantSchemes.slice(0, 15),
    totalSchemes: schemes.length,
    aiEnabled: false,
    note: 'Using rule-based matching. For AI-enhanced results, configure GROQ_API_KEY in .env'
  });
};

// Smart scheme search using AI
const smartSchemeSearch = async (req, res) => {
  try {
    const { profile } = req.body;
    
    if (!profile) {
      return res.status(400).json({
        success: false,
        message: 'Profile data is required'
      });
    }

    console.log('🔍 Smart scheme search for profile:', profile);

    // Get all active schemes
    const schemes = await Scheme.find({ active: true });
    
    if (schemes.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No schemes available',
        schemes: []
      });
    }

    const useGroq = !!process.env.GROQ_API_KEY;
    const apiUrl = useGroq 
      ? 'https://api.groq.com/openai/v1/chat/completions'
      : 'https://api.openai.com/v1/chat/completions';
    
    const apiKey = useGroq ? process.env.GROQ_API_KEY : process.env.OPENAI_API_KEY;
    const model = useGroq ? 'llama-3.3-70b-versatile' : 'gpt-3.5-turbo';

    // Prepare compact scheme format for AI
    const schemesCompact = schemes.map(s => {
      const edu = Array.isArray(s.eligibility.education) ? s.eligibility.education.join(',') : (s.eligibility.education || 'Any');
      const states = Array.isArray(s.eligibility.states) ? s.eligibility.states.join(',') : (s.eligibility.states || 'Any');
      const cats = Array.isArray(s.eligibility.categories) ? s.eligibility.categories.join(',') : (s.eligibility.categories || 'Any');
      return `${s._id}|${s.name}|Edu:${edu}|States:${states}|Cat:${cats}|Income:${s.eligibility.income || 'Any'}`;
    }).join('\n');

    // AI Analysis Prompt
    const aiAnalysisPrompt = `Analyze eligibility for user against schemes.

USER: Edu=${profile.educationLevel||'?'},State=${profile.state||'?'},Cat=${profile.category||'General'},Income=${profile.income||'?'},Age=${profile.age||'?'},Gender=${profile.gender||'?'}

SCHEMES (format: ID|Name|Edu:|States:|Cat:|Income:):
${schemesCompact}

IMPORTANT: Return ONLY valid JSON array with NO line breaks in explanation strings. Use simple text only.
[{"schemeId":"id","matchPercentage":85,"explanation":"simple reason"}]`;

    if (!apiKey) {
      // Fallback: return schemes without AI matching
      const enhancedSchemes = schemes.map(scheme => ({
        scheme: {
          _id: scheme._id,
          name: scheme.name,
          category: scheme.category,
          description: scheme.description,
          benefits: scheme.benefits,
          amount: scheme.amount,
          duration: scheme.duration,
          applicationProcess: scheme.applicationProcess,
          officialLink: scheme.officialLink,
          applicationLink: scheme.applicationLink,
          lastDate: scheme.lastDate,
          featured: scheme.featured,
          eligibility: scheme.eligibility
        },
        matchPercentage: 75,
        aiExplanation: 'Matches your profile criteria'
      }));

      return res.status(200).json({
        success: true,
        schemes: enhancedSchemes.slice(0, 15),
        totalSchemes: schemes.length,
        aiEnabled: false
      });
    }

    console.log(`🤖 Calling ${useGroq ? 'Groq' : 'OpenAI'} API for intelligent analysis...`);
    
    try {
      const axios = require('axios');
      const aiResponse = await axios.post(
        apiUrl,
        {
          model,
          messages: [
            {
              role: 'user',
              content: aiAnalysisPrompt
            }
          ],
          max_tokens: 1000,
          temperature: 0.1
        },
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const aiResponseText = aiResponse.data.choices[0].message.content.trim();
      console.log('✅ AI response received:', aiResponseText.substring(0, 200));

      // Parse AI response
      let aiResults;
      try {
        let cleanedResponse = aiResponseText
          .replace(/```json\n?/g, '')
          .replace(/```\n?/g, '')
          .trim();
        
        const jsonMatch = cleanedResponse.match(/\[\s*\{[\s\S]*\}\s*\]/);
        if (jsonMatch) {
          cleanedResponse = jsonMatch[0];
        }
        
        cleanedResponse = cleanedResponse
          .replace(/\n/g, ' ')
          .replace(/\r/g, '');
        
        aiResults = JSON.parse(cleanedResponse);
        
        if (!Array.isArray(aiResults)) {
          aiResults = [aiResults];
        }
      } catch (parseError) {
        console.error('❌ Failed to parse AI response:', parseError.message);
        aiResults = [];
      }

      // Merge AI results with scheme data
      const enhancedSchemes = schemes.map(scheme => {
        const aiResult = aiResults.find(r => r.schemeId === scheme._id.toString());
        
        return {
          scheme: {
            _id: scheme._id,
            name: scheme.name,
            category: scheme.category,
            description: scheme.description,
            benefits: scheme.benefits,
            amount: scheme.amount,
            duration: scheme.duration,
            applicationProcess: scheme.applicationProcess,
            officialLink: scheme.officialLink,
            applicationLink: scheme.applicationLink,
            lastDate: scheme.lastDate,
            featured: scheme.featured,
            eligibility: scheme.eligibility
          },
          matchPercentage: aiResult?.matchPercentage || 50,
          aiExplanation: aiResult?.explanation || 'Scheme eligibility not fully analyzed'
        };
      });

      // Sort by match percentage
      enhancedSchemes.sort((a, b) => b.matchPercentage - a.matchPercentage);

      // Return only schemes with >30% match
      const relevantSchemes = enhancedSchemes.filter(s => s.matchPercentage > 30);

      return res.status(200).json({
        success: true,
        schemes: relevantSchemes.slice(0, 15),
        totalSchemes: schemes.length,
        aiEnabled: true,
        aiProvider: useGroq ? 'Groq' : 'OpenAI'
      });

    } catch (aiError) {
      console.error('❌ AI API Error:', aiError.message);
      
      // Fallback without AI
      const enhancedSchemes = schemes.map(scheme => ({
        scheme: {
          _id: scheme._id,
          name: scheme.name,
          category: scheme.category,
          description: scheme.description,
          benefits: scheme.benefits,
          amount: scheme.amount,
          duration: scheme.duration,
          applicationProcess: scheme.applicationProcess,
          officialLink: scheme.officialLink,
          applicationLink: scheme.applicationLink,
          lastDate: scheme.lastDate,
          featured: scheme.featured,
          eligibility: scheme.eligibility
        },
        matchPercentage: 70,
        aiExplanation: 'Matches your profile criteria'
      }));

      return res.status(200).json({
        success: true,
        schemes: enhancedSchemes.slice(0, 15),
        totalSchemes: schemes.length,
        aiEnabled: false
      });
    }

  } catch (error) {
    console.error('Smart search error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error in smart search',
      error: error.message
    });
  }
};

// Parse natural language text to profile
const parseTextToProfile = async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({
        success: false,
        message: 'Text input is required'
      });
    }

    console.log('📝 Parsing text to profile...');

    const useGroq = !!process.env.GROQ_API_KEY;
    const apiUrl = useGroq 
      ? 'https://api.groq.com/openai/v1/chat/completions'
      : 'https://api.openai.com/v1/chat/completions';
    
    const apiKey = useGroq ? process.env.GROQ_API_KEY : process.env.OPENAI_API_KEY;
    const model = useGroq ? 'llama-3.3-70b-versatile' : 'gpt-3.5-turbo';

    const prompt = `Parse the following text into a structured profile JSON. Extract only clearly mentioned information.

Text: "${text}"

Return ONLY valid JSON (no markdown):
{
  "name": "name if mentioned",
  "age": "number if mentioned",
  "gender": "Male/Female/Other if mentioned",
  "educationLevel": "10th/12th/Diploma/Undergraduate/Postgraduate",
  "course": "field of study if mentioned",
  "state": "state if mentioned",
  "category": "General/OBC/SC/ST/EWS if mentioned",
  "income": "annual income as number if mentioned",
  "locationType": "Urban/Rural if mentioned"
}`;

    const axios = require('axios');
    const response = await axios.post(
      apiUrl,
      {
        model,
        messages: [
          {
            role: 'system',
            content: 'You are a data extraction assistant. Return only valid JSON.'
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
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const aiResponse = response.data.choices[0].message.content;
    
    try {
      const cleanedResponse = aiResponse
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();
      const parsedProfile = JSON.parse(cleanedResponse);

      // Get schemes for user
      const schemes = await Scheme.find({ active: true }).limit(5);

      res.status(200).json({
        success: true,
        profile: parsedProfile,
        schemes: schemes,
        totalSchemes: schemes.length,
        aiProvider: useGroq ? 'Groq' : 'OpenAI'
      });
    } catch (parseError) {
      console.error('Parse error:', parseError.message);
      res.status(500).json({
        success: false,
        message: 'Failed to parse profile from text',
        error: parseError.message
      });
    }

  } catch (error) {
    console.error('Text to profile error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error parsing text to profile',
      error: error.message
    });
  }
};

// Get scheme details
const getSchemeDetails = async (req, res) => {
  try {
    const { schemeId } = req.params;
    
    const scheme = await Scheme.findById(schemeId);
    
    if (!scheme) {
      return res.status(404).json({
        success: false,
        message: 'Scheme not found'
      });
    }

    res.status(200).json({
      success: true,
      scheme
    });
  } catch (error) {
    console.error('Get scheme details error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching scheme details',
      error: error.message
    });
  }
};

// Get all schemes
const getAllSchemes = async (req, res) => {
  try {
    const schemes = await Scheme.find({ active: true });
    
    res.status(200).json({
      success: true,
      schemes,
      totalSchemes: schemes.length
    });
  } catch (error) {
    console.error('Get all schemes error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching schemes',
      error: error.message
    });
  }
};

module.exports = {
  getAIEnhancedEligibility,
  smartSchemeSearch,
  parseTextToProfile,
  getSchemeDetails,
  getAllSchemes,
  executeRuleBasedMatching
};
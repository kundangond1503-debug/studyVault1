import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { DBManager } from './src/server-db';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { Resource, UserPortfolio } from './src/types';

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

// Initialize file-based database
DBManager.initialize();

// Enable JSON body parsing
app.use(express.json());

// Initialize Gemini Client
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    console.log('Gemini API client initialized successfully.');
  } catch (error) {
    console.error('Failed to initialize Gemini Client:', error);
  }
} else {
  console.warn('GEMINI_API_KEY is not defined in the environment. AI features will run in fallback mock mode.');
}

// ---------------------- API Endpoints ----------------------

// 1. Get Resources (with filter and search)
app.get('/api/resources', (req, res) => {
  try {
    let resources = DBManager.getResources();
    const { branch, semester, materialType, search, verified, premium } = req.query;

    if (branch && branch !== 'all') {
      resources = resources.filter(r => r.branch.toLowerCase() === (branch as string).toLowerCase());
    }

    if (semester && semester !== 'all') {
      const semNum = parseInt(semester as string, 10);
      if (!isNaN(semNum)) {
        resources = resources.filter(r => r.semester === semNum);
      }
    }

    if (materialType && materialType !== 'all') {
      resources = resources.filter(r => r.materialType === materialType);
    }

    if (verified === 'true') {
      resources = resources.filter(r => r.verified);
    }

    if (premium === 'true') {
      resources = resources.filter(r => r.premium);
    } else if (premium === 'false') {
      resources = resources.filter(r => !r.premium);
    }

    if (search) {
      const keyword = (search as string).toLowerCase().trim();
      resources = resources.filter(r => 
        r.title.toLowerCase().includes(keyword) ||
        r.description.toLowerCase().includes(keyword) ||
        r.courseName.toLowerCase().includes(keyword) ||
        r.courseCode.toLowerCase().includes(keyword) ||
        r.topic.toLowerCase().includes(keyword) ||
        r.content.toLowerCase().includes(keyword)
      );
    }

    res.json(resources);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to retrieve resources', details: error.message });
  }
});

// 2. Get Single Resource
app.get('/api/resources/:id', (req, res) => {
  const resource = DBManager.getResourceById(req.params.id);
  if (!resource) {
    return res.status(404).json({ error: 'Resource not found' });
  }
  res.json(resource);
});

// 3. Upload Resource
app.post('/api/resources', (req, res) => {
  try {
    const { 
      title, 
      description, 
      courseName, 
      courseCode, 
      branch, 
      semester, 
      materialType, 
      topic, 
      content,
      uploaderName,
      uploaderId,
      premium
    } = req.body;

    if (!title || !courseName || !branch || !semester || !materialType || !content) {
      return res.status(400).json({ error: 'Missing required resource fields' });
    }

    const uId = uploaderId || 'user_anonymous';
    const uName = uploaderName || 'Anonymous Contributor';
    const isPremium = premium === true;

    const newResource: Resource = {
      id: 'res_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
      title,
      description: description || 'No description provided.',
      courseName,
      courseCode: courseCode || 'N/A',
      branch,
      semester: parseInt(semester, 10),
      materialType,
      topic: topic || 'General Topics',
      content,
      fileUrl: `/simulated/study_resource_${Date.now()}.pdf`,
      fileSize: `${(content.length / 1024 / 2).toFixed(1)} MB`, // simulated size
      upvotes: 0,
      downvotes: 0,
      commentsCount: 0,
      comments: [],
      uploadedBy: uName,
      uploaderId: uId,
      uploaderRep: 10, // Default uploader starting rep or fetched rep
      createdAt: new Date().toISOString(),
      verified: false, // Uploaded by student, awaiting admin verification
      premium: isPremium
    };

    const saved = DBManager.addResource(newResource);
    res.status(201).json(saved);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to upload resource', details: error.message });
  }
});

// 4. Vote on Resource
app.post('/api/resources/:id/vote', (req, res) => {
  try {
    const { voteType, userId } = req.body; // 'up' or 'down'
    if (voteType !== 'up' && voteType !== 'down') {
      return res.status(400).json({ error: 'Invalid voteType' });
    }

    const updated = DBManager.voteResource(req.params.id, voteType, userId);
    if (!updated) {
      return res.status(404).json({ error: 'Resource not found' });
    }
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to record vote', details: error.message });
  }
});

// 5. Comment on Resource
app.post('/api/resources/:id/comment', (req, res) => {
  try {
    const { userName, text } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Comment text is required' });
    }

    const comment = DBManager.addComment(req.params.id, text, userName);
    if (!comment) {
      return res.status(404).json({ error: 'Resource not found' });
    }
    res.status(201).json(comment);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to add comment', details: error.message });
  }
});

// 6. Get Portfolios (Contributors & Reputation Leaderboard)
app.get('/api/portfolios', (req, res) => {
  try {
    const portfolios = DBManager.getPortfolios();
    // Sort by reputation score descending
    const sorted = [...portfolios].sort((a, b) => b.reputationScore - a.reputationScore);
    res.json(sorted);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to retrieve portfolios', details: error.message });
  }
});

// 7. Get Team Members
app.get('/api/team', (req, res) => {
  const team = [
    {
      name: 'Neeraj Sonkar',
      role: 'Project Lead & Full-Stack Architect',
      studentId: 'NEERDBB3CE',
      branch: 'Computer Science & Engineering',
      bio: 'Pioneered the core syllabus mapping engine and full-stack integrations. Enjoys building scalable cloud architectures and modular web designs.',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80'
    },
    {
      name: 'Kundan Kumar Gond',
      role: 'DB Architect & Backend Engineer',
      studentId: 'KUNDFDA418',
      branch: 'Computer Science & Engineering',
      bio: 'Implemented the peer validation state machine and persistent database models. Focused on optimization and data-modeling.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
    },
    {
      name: 'Nikhil Kumar',
      role: 'Syllabus Specialist & Frontend UI Developer',
      studentId: 'NIKHDF753F',
      branch: 'Computer Science & Engineering',
      bio: 'Mapped the entire MMMUT engineering course structure into digital ontologies. Dedicated to sleek, responsive UI styling.',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80'
    },
    {
      name: 'Siddhant gautam',
      role: 'AI Engineer & Quality Assurance Lead',
      studentId: 'TECHEA4F04',
      branch: 'Computer Science & Engineering',
      bio: 'Engineered the server-side LLM context parameters and response pipelines. Ensuring 100% test-checked code quality.',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80'
    }
  ];
  res.json(team);
});

// 7.5 Auth Endpoints (Login / Registration)
app.post('/api/auth/login', (req, res) => {
  try {
    const { name, role } = req.body;
    if (!name || !role) {
      return res.status(400).json({ error: 'Name and Role are required' });
    }

    if (role === 'learner') {
      return res.json({
        id: 'learner_' + Date.now().toString().slice(-6),
        name: name.trim(),
        role: 'learner'
      });
    }

    // For Contributors, look for an existing portfolio matching the name (case-insensitive)
    const portfolios = DBManager.getPortfolios();
    const existing = portfolios.find(p => p.name.toLowerCase().trim() === name.toLowerCase().trim());

    if (existing) {
      return res.json({
        id: existing.id,
        name: existing.name,
        role: 'contributor',
        branch: existing.branch,
        semester: existing.semester,
        badge: existing.badge,
        reputationScore: existing.reputationScore,
        skills: existing.skills,
        bio: existing.bio
      });
    }

    return res.status(404).json({ 
      error: 'contributor_not_found', 
      message: `No Contributor portfolio found for "${name}". Please register first or verify the spelling.` 
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to log in', details: err.message });
  }
});

app.post('/api/auth/register', (req, res) => {
  try {
    const { name, branch, semester, bio, skills } = req.body;
    if (!name || !branch || !semester) {
      return res.status(400).json({ error: 'Name, Branch, and Semester are required' });
    }

    const trimmedName = name.trim();
    
    // Check if name already registered
    const portfolios = DBManager.getPortfolios();
    const existing = portfolios.find(p => p.name.toLowerCase().trim() === trimmedName.toLowerCase());
    if (existing) {
      return res.status(400).json({ 
        error: 'already_exists',
        message: `A portfolio for "${trimmedName}" already exists. Please log in instead!` 
      });
    }

    const newId = 'user_' + trimmedName.toLowerCase().replace(/[^a-z0-9]+/g, '_') + '_' + Math.floor(Math.random() * 1000);
    const newPortfolio: UserPortfolio = {
      id: newId,
      name: trimmedName,
      branch,
      semester: parseInt(semester, 10),
      reputationScore: 10,
      badge: 'Bronze',
      bio: bio || 'StudyVault peer contributor.',
      resourcesUploadedCount: 0,
      totalUpvotesReceived: 0,
      skills: skills || []
    };

    DBManager.updatePortfolio(newPortfolio);

    res.status(201).json({
      id: newPortfolio.id,
      name: newPortfolio.name,
      role: 'contributor',
      branch: newPortfolio.branch,
      semester: newPortfolio.semester,
      badge: newPortfolio.badge,
      reputationScore: newPortfolio.reputationScore,
      skills: newPortfolio.skills,
      bio: newPortfolio.bio
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to register contributor', details: err.message });
  }
});

// 8. Get Platform Analytics
app.get('/api/analytics', (req, res) => {
  try {
    const resources = DBManager.getResources();
    const portfolios = DBManager.getPortfolios();

    const totalUploaded = resources.length;
    const verified = resources.filter(r => r.verified).length;
    const premiumCount = resources.filter(r => r.premium).length;
    
    // Sum upvotes and comments
    let totalUpvotes = 0;
    resources.forEach(r => {
      totalUpvotes += r.upvotes;
    });

    const totalReputation = portfolios.reduce((acc, p) => acc + p.reputationScore, 0);

    res.json({
      totalResources: totalUploaded,
      verifiedResources: verified,
      premiumResources: premiumCount,
      totalUpvotes,
      totalReputation,
      simulatedDownloads: totalUpvotes * 3 + 124, // Realistic ratio
      cohortSOM: '10,000+ Students (MMMUT Network)',
      targetSAM: '4M+ Technical & Eng Students',
      broadTAM: '40M+ Higher Ed Students (India)'
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to calculate analytics', details: error.message });
  }
});

// 9. AI Study & Syllabus Assistant (Server-Side Gemini API)
app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body; // Array of { role: 'user' | 'model', content: string }
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid chat history provided' });
    }

    const lastUserMessage = messages[messages.length - 1]?.content;
    if (!lastUserMessage) {
      return res.status(400).json({ error: 'Empty message' });
    }

    // Get current files/materials in StudyVault to provide as context
    const currentVaultResources = DBManager.getResources().map(r => ({
      title: r.title,
      courseName: r.courseName,
      courseCode: r.courseCode,
      branch: r.branch,
      semester: r.semester,
      materialType: r.materialType,
      topic: r.topic,
      summary: r.description,
      contentSnippet: r.content.substring(0, 1000) // snippet
    }));

    const systemPrompt = `You are "StudyVault Mentor", a brilliant academic companion and AI study assistant specialized in Madan Mohan Malaviya University of Technology (MMMUT) curricula.
Your role is to help students find academic resources, understand core subjects, map topics to the official syllabus, and answer questions.

We have a centralized academic repository called StudyVault with these shared documents currently in the vault:
${JSON.stringify(currentVaultResources, null, 2)}

GUIDELINES FOR YOUR RESPONSES:
1. Always be supportive, highly academic, and structured in your explanations.
2. If the student asks about a topic in our database (like "DBMS Normalization", "LL(1) parsing", "Leibnitz theorem", "AVL Trees"), reference the respective resource inside the StudyVault, giving credit to the student who uploaded it! For example:
   - "This topic is covered in 'DBMS Comprehensive Unit 1 & 2 Lecture Summaries' uploaded by peer mentor Neeraj Sonkar (Silver/Gold/Platinum Badge)."
3. Provide helpful, accurate textbook explanations of the academic topics requested, incorporating markdown formatting, equations, and code blocks where applicable.
4. Encourage peer contribution! Suggest that they upload their own notes to build their Verified Portfolios and earn academic reputation.
5. If they mention any of the creators of StudyVault, politely and warmly acknowledge them:
   - Neeraj Sonkar (Project Lead)
   - Kundan Kumar Gond (DB Architect)
   - Nikhil Kumar (Syllabus Specialist)
   - Siddhant gautam (AI Engineer)`;

    // Format chat history for @google/genai SDK
    // The SDK expects chat contents as strings or part objects, but we can also build a custom contents structure.
    // Let's use the standard single-generation or simple chat structure.
    // Let's build a clean, unified content string that includes the chat history to pass to ai.models.generateContent
    let chatHistoryContext = "";
    messages.forEach((m: any) => {
      const sender = m.role === 'model' || m.sender === 'assistant' ? 'Assistant' : 'Student';
      const text = m.content || m.text;
      chatHistoryContext += `${sender}: ${text}\n\n`;
    });

    const promptWithInstructions = `${chatHistoryContext}\nAssistant (comply with system instructions):`;

    if (ai) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: promptWithInstructions,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.7,
        },
      });

      const reply = response.text || "I apologize, but I could not formulate a response at this moment. Please try asking your question again.";
      res.json({ reply });
    } else {
      // Fallback response if GEMINI_API_KEY is not defined
      console.log('Running mock chatbot response...');
      const fallbackReplies = [
        `As the StudyVault Mentor, I can help you! I see we have some excellent resources uploaded by **Neeraj Sonkar** on Database Normalization (BCS-21) and **Kundan Kumar Gond** on LL(1) parsers (BCS-26). I highly recommend checking out those files on the Explore page!`,
        `That is an excellent academic question. In the MMMUT syllabus, this topic is mapped to the core engineering branches. You can check the 'Data Structures Cheat Sheet' uploaded by peer mentor **Nikhil Kumar** for quick equations. If you have your own notes, please upload them to boost your verified portfolio badge!`,
        `Studying for end-semester exams at MMMUT? Don't stress! Focus on constructing LL(1) parsing tables and computing FIRST/FOLLOW sets. Check out the 'Compiler Design 2025 End-Sem Solved Paper' uploaded by **Kundan Kumar Gond**. It outlines all steps beautifully!`
      ];
      const randomReply = fallbackReplies[Math.floor(Math.random() * fallbackReplies.length)];
      res.json({ reply: randomReply + "\n\n*(Note: Running in offline/fallback mode. Add a GEMINI_API_KEY in Secrets for live AI answers)*" });
    }
  } catch (error: any) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'AI Assistant failed to generate a response', details: error.message });
  }
});

// ---------------------- Vite Middleware / Static Files ----------------------

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('Vite development middleware integrated.');
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log('Static assets serving enabled for production.');
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`StudyVault backend server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();

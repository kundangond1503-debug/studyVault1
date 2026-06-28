import fs from 'fs';
import path from 'path';
import { Resource, UserPortfolio, Comment } from './types';

const DB_PATH = path.join(process.cwd(), 'db.json');

// Initial seed portfolios
const SEED_PORTFOLIOS: UserPortfolio[] = [
  {
    id: 'user_neeraj',
    name: 'Neeraj Sonkar',
    branch: 'CSE',
    semester: 6,
    reputationScore: 450,
    badge: 'Platinum',
    bio: 'CSE pre-final year student at MMMUT. Passionate about Full-Stack development, Cloud architectures, and mentoring juniors.',
    resourcesUploadedCount: 15,
    totalUpvotesReceived: 84,
    skills: ['React', 'Express', 'Node.js', 'System Design', 'Compiler Design']
  },
  {
    id: 'user_kundan',
    name: 'Kundan Kumar Gond',
    branch: 'CSE',
    semester: 6,
    reputationScore: 320,
    badge: 'Gold',
    bio: 'Tech enthusiast, specializing in Database Management Systems and UI/UX design. Open to academic discussion and project collaborations.',
    resourcesUploadedCount: 10,
    totalUpvotesReceived: 56,
    skills: ['SQL', 'MongoDB', 'Figma', 'TypeScript', 'Tailwind CSS']
  },
  {
    id: 'user_nikhil',
    name: 'Nikhil Kumar',
    branch: 'CSE',
    semester: 6,
    reputationScore: 210,
    badge: 'Silver',
    bio: 'Focused on algorithms, data structures, and computer network security. Sharing comprehensive lecture summaries.',
    resourcesUploadedCount: 8,
    totalUpvotesReceived: 38,
    skills: ['Java', 'Algorithms', 'Networking', 'Security']
  },
  {
    id: 'user_siddhant',
    name: 'Siddhant gautam',
    branch: 'CSE',
    semester: 6,
    reputationScore: 190,
    badge: 'Silver',
    bio: 'Enthusiastic developer and peer tutor. Specializes in operating systems, Linux environments, and core engineering mathematics.',
    resourcesUploadedCount: 7,
    totalUpvotesReceived: 32,
    skills: ['C++', 'Operating Systems', 'Mathematics', 'Shell Scripting']
  }
];

// Initial seed resources (high quality MMMUT matched academic content)
const SEED_RESOURCES: Resource[] = [
  {
    id: 'res_dbms_notes',
    title: 'DBMS Comprehensive Unit 1 & 2 Lecture Summaries',
    description: 'Detailed, handwritten-style typed summaries covering ER Models, Schema Design, Functional Dependencies, and Normalization (1NF to BCNF) with solved MMMUT mid-sem exam problems.',
    courseName: 'Database Management Systems',
    courseCode: 'BCS-21',
    branch: 'CSE',
    semester: 5,
    materialType: 'notes',
    topic: 'Relational Database Design & Normalization',
    content: `# Database Management Systems (BCS-21) - Unit 1 & 2 Notes

## 1. Entity-Relationship (ER) Model
An ER model is a high-level conceptual data model. It represents the logical structure of a database visually.
- **Entity**: An object or concept that exists in the real world (e.g., Student, Department).
- **Attribute**: Properties of an entity (e.g., RollNo, Name, Age).
- **Relationship**: Association among entities (e.g., Student *Enroll* in Course).

### Key Constraints:
- **Primary Key**: Unique, non-null attribute that uniquely identifies each entity instance.
- **Foreign Key**: Refers to the primary key of another table, enforcing referential integrity.

## 2. Relational Model & Normalization
Normalization is the process of organizing data in a database to reduce redundancy and eliminate anomalies (Insertion, Deletion, Update).

### Normal Forms:
1. **First Normal Form (1NF)**: All attributes must contain atomic (indivisible) values. No repeating groups.
2. **Second Normal Form (2NF)**: Must be in 1NF, and all non-key attributes must be fully functionally dependent on the entire primary key (No partial dependency).
3. **Third Normal Form (3NF)**: Must be in 2NF, and no non-key attribute is transitively dependent on the primary key (No transitive dependency: $A \\rightarrow B \\rightarrow C$).
4. **Boyce-Codd Normal Form (BCNF)**: A stronger version of 3NF. For every non-trivial functional dependency $X \\rightarrow Y$, $X$ must be a super key.

### MMMUT Exam Solved Example:
*Problem*: Given schema $R(A, B, C, D, E)$ with FDs:
$A \\rightarrow BC$, $CD \\rightarrow E$, $B \\rightarrow D$, $E \\rightarrow A$. Find Candidate Keys.
*Solution*:
- Compute attribute closures:
  - $(A)^+ = A \\rightarrow ABC \\rightarrow ABCD \\rightarrow ABCDE$. Since $A$ derives all attributes, $A$ is a Candidate Key.
  - $(E)^+ = E \\rightarrow EA \\rightarrow EABC \\rightarrow EABCD \\rightarrow EABCDE$. Since $E$ derives all, $E$ is a Candidate Key.
  - Let us test $(CD)^+$: $CD \\rightarrow CDE \\rightarrow CDEA \\rightarrow CDEABC \\rightarrow CDEABCD$. Yes! $CD$ is a Candidate Key.
  - Let us test $(BC)^+$: $BC \\rightarrow BCD$ (since $B \\rightarrow D$) $\\rightarrow BCDE$ (since $CD \\rightarrow E$) $\\rightarrow ABCDE$ (since $E \\rightarrow A$). Yes! $BC$ is a Candidate Key.

Therefore, the candidate keys are **A**, **E**, **BC**, and **CD**.`,
    fileUrl: '/simulated/dbms_notes_unit1_2.pdf',
    fileSize: '1.8 MB',
    upvotes: 42,
    downvotes: 1,
    commentsCount: 2,
    comments: [
      {
        id: 'c1',
        userName: 'Aarav Sharma',
        text: 'The normal form explanation with the MMMUT solved example is incredibly helpful! Cleared up my doubts before sessional exams.',
        createdAt: '2026-06-25T14:30:00Z'
      },
      {
        id: 'c2',
        userName: 'Ananya Verma',
        text: 'Clean formatting and accurate closures! Thanks for sharing Neeraj.',
        createdAt: '2026-06-26T09:15:00Z'
      }
    ],
    uploadedBy: 'Neeraj Sonkar',
    uploaderId: 'user_neeraj',
    uploaderRep: 450,
    createdAt: '2026-06-24T12:00:00Z',
    verified: true,
    premium: false
  },
  {
    id: 'res_compiler_papers',
    title: 'Compiler Design End-Sem Solved Paper 2025',
    description: 'Fully solved official end-semester paper of BCS-26 Compiler Design. Detailed step-by-step solutions for LL(1) Parsing Table construction, LALR(1) item sets, and Three-Address Code optimization.',
    courseName: 'Compiler Design',
    courseCode: 'BCS-26',
    branch: 'CSE',
    semester: 6,
    materialType: 'past_papers',
    topic: 'Parser Construction & Code Optimization',
    content: `# Compiler Design (BCS-26) - 2025 End-Sem Solutions

## Question 1: LL(1) Parser Construction
Consider the grammar:
$S \\rightarrow aAB | bBA$
$A \\rightarrow c | \\epsilon$
$B \\rightarrow d | \\epsilon$

### Step 1: Compute FIRST and FOLLOW
- **FIRST Sets**:
  - $FIRST(S) = \\{a, b\\}$
  - $FIRST(A) = \\{c, \\epsilon\\}$
  - $FIRST(B) = \\{d, \\epsilon\\}$
- **FOLLOW Sets**:
  - $FOLLOW(S) = \\{\\$\\}$
  - $FOLLOW(A) = FIRST(B) \\cup FOLLOW(S) \\text{ (since } S \\rightarrow aAB \\text{ and } S \\rightarrow bBA \\text{)} = \\{d, \\$, a\\}$
  - $FOLLOW(B) = FIRST(A) \\cup FOLLOW(S) \\text{ (since } S \\rightarrow aAB \\text{ and } S \\rightarrow bBA \\text{)} = \\{c, \\$, b\\}$

### Step 2: LL(1) Parsing Table Construction
To construct the parsing table, map productions $X \\rightarrow \\alpha$ into table index $M[X, t]$ for terminal $t \\in FIRST(\\alpha)$. If $\\epsilon \\in FIRST(\\alpha)$, map $X \\rightarrow \\alpha$ to $M[X, t]$ for terminal $t \\in FOLLOW(X)$.

| Non-Terminal | a | b | c | d | $ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **S** | $S \\rightarrow aAB$ | $S \\rightarrow bBA$ | | | |
| **A** | $A \\rightarrow \\epsilon$ | | $A \\rightarrow c$ | $A \\rightarrow \\epsilon$ | $A \\rightarrow \\epsilon$ |
| **B** | | $B \\rightarrow \\epsilon$ | $B \\rightarrow \\epsilon$ | $B \\rightarrow d$ | $B \\rightarrow \\epsilon$ |

Since there are no multi-entry cells, the grammar is **LL(1)**.

## Question 2: Three-Address Code Optimization
*Problem*: Optimize the loop code block using Loop Invariant Code Motion (LICM) and Common Subexpression Elimination (CSE).
*Original*:
\`\`\`
i = 0
loop:
  t1 = 4 * i
  t2 = base + t1
  t3 = rate * factor
  v = v + t3
  i = i + 1
  if i < 100 goto loop
\`\`\`
*Optimized*:
- Code motion: $t3 = rate * factor$ is independent of the loop, so it can be hoisted out.
\`\`\`
i = 0
t3 = rate * factor  // Hoisted
loop:
  t1 = 4 * i
  t2 = base + t1
  v = v + t3
  i = i + 1
  if i < 100 goto loop
\`\`\``,
    fileUrl: '/simulated/compiler_solved_2025.pdf',
    fileSize: '3.1 MB',
    upvotes: 35,
    downvotes: 0,
    commentsCount: 1,
    comments: [
      {
        id: 'c3',
        userName: 'Rohan Gupta',
        text: 'The LL(1) FOLLOW calculation was so confusing in our class slides, but this step-by-step breakdown makes it incredibly logical. Brilliant work Kundan!',
        createdAt: '2026-06-26T18:22:00Z'
      }
    ],
    uploadedBy: 'Kundan Kumar Gond',
    uploaderId: 'user_kundan',
    uploaderRep: 320,
    createdAt: '2026-06-25T15:45:00Z',
    verified: true,
    premium: false
  },
  {
    id: 'res_dsa_cheat_sheet',
    title: 'Data Structures Quick-Reference Cheat Sheet',
    description: 'A 4-page reference summarizing time and space complexities, key operations, and pseudo-code implementations for AVL Trees, Red-Black Trees, Heaps, and Graph algorithms (Dijkstra, Prim, Kruskal).',
    courseName: 'Data Structures & Algorithms',
    courseCode: 'BCS-11',
    branch: 'CSE',
    semester: 3,
    materialType: 'notes',
    topic: 'Advanced Tree Structures & Graph Algorithms',
    content: `# Data Structures & Algorithms (BCS-11) - Quick Reference

## 1. Tree Structures Complexity Comparison

| Data Structure | Search (Avg) | Search (Worst) | Insert (Worst) | Delete (Worst) | Balance Criteria |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Binary Search Tree** | $O(\\log N)$ | $O(N)$ | $O(N)$ | $O(N)$ | None (unbalanced) |
| **AVL Tree** | $O(\\log N)$ | $O(\\log N)$ | $O(\\log N)$ | $O(\\log N)$ | Height difference of children $\\le 1$ |
| **Red-Black Tree** | $O(\\log N)$ | $O(\\log N)$ | $O(\\log N)$ | $O(\\log N)$ | Root is black, red node children are black, same black-height |

## 2. Graph Algorithms
### Dijkstra's Shortest Path
- **Algorithm Type**: Greedy
- **Complexity**: $O((V + E) \\log V)$ using Min-Priority Queue.
- **Limitation**: Fails on graphs with negative edge weights.

### Minimum Spanning Tree (MST)
- **Kruskal's Algorithm**: Greedy, sorts edges and applies Union-Find. Complexity: $O(E \\log E)$ or $O(E \\log V)$. Best for sparse graphs.
- **Prim's Algorithm**: Greedy, grows tree from starting node using min-priority queue. Complexity: $O(E \\log V)$ or $O(V^2)$ for dense matrices.`,
    fileUrl: '/simulated/dsa_cheat_sheet.pdf',
    fileSize: '1.2 MB',
    upvotes: 28,
    downvotes: 0,
    commentsCount: 0,
    comments: [],
    uploadedBy: 'Nikhil Kumar',
    uploaderId: 'user_nikhil',
    uploaderRep: 210,
    createdAt: '2026-06-23T10:30:00Z',
    verified: true,
    premium: false
  },
  {
    id: 'res_maths1_formulas',
    title: 'Engineering Mathematics-I Complete Formula Sheet',
    description: 'Formulas and quick-solving templates for BAS-01 syllabus, including Rolle’s Theorem, Leibnitz’s Theorem, Double/Triple Integrals, and Jacobians.',
    courseName: 'Engineering Mathematics-I',
    courseCode: 'BAS-01',
    branch: 'CSE', // Multi-branch but categorized under CSE
    semester: 1,
    materialType: 'notes',
    topic: 'Differential & Integral Calculus',
    content: `# Engineering Mathematics-I (BAS-01) - Calculus & Matrices

## 1. Successive Differentiation & Leibnitz’s Theorem
Leibnitz’s Theorem gives the $n$-th derivative of a product of two functions:
$$(uv)_n = u_n v + ^nC_1 u_{n-1} v_1 + ^nC_2 u_{n-2} v_2 + \\dots + u v_n$$

### Solved Template:
Find $y_n$ for $y = x^2 e^{3x}$:
Let $u = e^{3x}$ and $v = x^2$.
- $u_n = 3^n e^{3x}$, $u_{n-1} = 3^{n-1} e^{3x}$, $u_{n-2} = 3^{n-2} e^{3x}$
- $v_1 = 2x$, $v_2 = 2$, $v_3 = 0$
Apply Leibnitz:
$$y_n = (3^n e^{3x}) x^2 + n (3^{n-1} e^{3x}) (2x) + \\frac{n(n-1)}{2} (3^{n-2} e^{3x}) (2)$$
$$y_n = e^{3x} \\cdot 3^{n-2} \\left[ 9x^2 + 6nx + n(n-1) \\right]$$

## 2. Rolle’s and Mean Value Theorems
- **Rolle's Theorem**: If $f(x)$ is continuous in $[a, b]$, differentiable in $(a, b)$, and $f(a) = f(b)$, then there exists at least one $c \\in (a, b)$ such that $f'(c) = 0$.
- **Lagrange's Mean Value Theorem**: If $f(x)$ is continuous in $[a, b]$ and differentiable in $(a, b)$, then there exists at least one $c \\in (a, b)$ such that:
$$f'(c) = \\frac{f(b) - f(a)}{b - a}$$`,
    fileUrl: '/simulated/math1_formulas.pdf',
    fileSize: '0.9 MB',
    upvotes: 18,
    downvotes: 1,
    commentsCount: 0,
    comments: [],
    uploadedBy: 'Siddhant gautam',
    uploaderId: 'user_siddhant',
    uploaderRep: 190,
    createdAt: '2026-06-25T08:15:00Z',
    verified: true,
    premium: false
  },
  {
    id: 'premium_cse_5sem',
    title: '[Premium] 5th Sem CSE Comprehensive Exam Crack Pack',
    description: 'An elite bundle consisting of highly rated verified notes, solved past papers of the last 5 years, sessional prep guides, and syllabus maps for all core 5th semester CSE subjects (DBMS, Compiler Design, Web Tech).',
    courseName: 'Core CSE Multi-Course Bundle',
    courseCode: 'MMMUT-CSE-05',
    branch: 'CSE',
    semester: 5,
    materialType: 'notes',
    topic: 'Full Semester Comprehensive Study Collection',
    content: `# StudyVault Premium: 5th Semester CSE Comprehensive Exam Crack Pack

*Unlock elite academic guidance mapped precisely to the madan mohan malaviya university of technology (MMMUT) curricula.*

## Inside this Premium Package:
1. **Database Management Systems (BCS-21)**:
   - Solved End-Sem papers (2021 - 2025)
   - Relational Algebra and Relational Calculus visual reference guides
   - Sessional question banks with detailed answers
2. **Compiler Design (BCS-26)**:
   - LALR(1) Parsing Table generator and step-by-step trace examples
   - Directed Acyclic Graphs (DAG) construction algorithms
   - Machine-independent code optimization cheat sheets
3. **Web Technology (BCS-25)**:
   - Express.js and React full-stack project building guides
   - Security paradigms (CORS, JWT, Password Hashing) templates
   - Interactive mock test papers for End-Sem prep

### Premium Feature Guarantee:
- High Resolution PDFs
- Ad-free reading online
- Direct Chat help with Silver, Gold & Platinum Peer Mentors
- Weekly sessional strategy sessions`,
    fileUrl: '/simulated/premium_cse_5sem_pack.pdf',
    fileSize: '15.4 MB',
    upvotes: 55,
    downvotes: 0,
    commentsCount: 0,
    comments: [],
    uploadedBy: 'StudyVault Team',
    uploaderId: 'user_neeraj', // Uploaded by team (mapped to Neeraj as lead)
    uploaderRep: 450,
    createdAt: '2026-06-26T12:00:00Z',
    verified: true,
    premium: true
  },
  {
    id: 'premium_ece_dsp',
    title: '[Premium] Digital Signal Processing Solved Workbook',
    description: 'Comprehensive workbook with step-by-step solved mathematical questions for Digital Signal Processing (BEC-28). Highly beneficial for solving Z-Transforms, DFT/FFT computations, and FIR/IIR Filter Design.',
    courseName: 'Digital Signal Processing',
    courseCode: 'BEC-28',
    branch: 'ECE',
    semester: 6,
    materialType: 'lab_manuals',
    topic: 'Mathematical Solved DSP Workbook',
    content: `# StudyVault Premium: BEC-28 Digital Signal Processing Solved Workbook

## Key Highlights:
- **Z-Transform Solutions**: Solved ROC (Region of Convergence) and Inverse Z-Transforms with partial fraction expansion.
- **DFT and Fast Fourier Transform (FFT)**: Step-by-step 8-point Radix-2 Decimation-In-Time (DIT) and Decimation-In-Frequency (DIF) butterfly diagrams and calculations.
- **Filter Design**:
  - FIR Filter Design using Rectangular, Hamming, and Kaiser windows.
  - IIR Filter Design via Bilinear Transformation and Impulse Invariant methods.

*Formulated by ECE Peer Mentors and vetted by senior academic top performers.*`,
    fileUrl: '/simulated/premium_dsp_solved.pdf',
    fileSize: '8.7 MB',
    upvotes: 31,
    downvotes: 0,
    commentsCount: 0,
    comments: [],
    uploadedBy: 'StudyVault Team',
    uploaderId: 'user_neeraj',
    uploaderRep: 450,
    createdAt: '2026-06-26T15:30:00Z',
    verified: true,
    premium: true
  }
];

export interface DatabaseSchema {
  resources: Resource[];
  portfolios: UserPortfolio[];
}

export class DBManager {
  private static data: DatabaseSchema = {
    resources: [],
    portfolios: []
  };

  public static initialize() {
    try {
      if (fs.existsSync(DB_PATH)) {
        const raw = fs.readFileSync(DB_PATH, 'utf-8');
        DBManager.data = JSON.parse(raw);
        console.log('Database loaded successfully. Resource count:', DBManager.data.resources?.length);
      } else {
        DBManager.data = {
          resources: SEED_RESOURCES,
          portfolios: SEED_PORTFOLIOS
        };
        DBManager.save();
        console.log('Database initialized with seed data.');
      }
    } catch (err) {
      console.error('Error loading database, using memory storage:', err);
      DBManager.data = {
        resources: SEED_RESOURCES,
        portfolios: SEED_PORTFOLIOS
      };
    }
  }

  public static save() {
    try {
      fs.writeFileSync(DB_PATH, JSON.stringify(DBManager.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to save DB state:', err);
    }
  }

  // Resources Operations
  public static getResources(): Resource[] {
    return DBManager.data.resources || [];
  }

  public static getResourceById(id: string): Resource | undefined {
    return DBManager.getResources().find(r => r.id === id);
  }

  public static addResource(resource: Resource): Resource {
    DBManager.data.resources.unshift(resource);
    
    // Update uploader statistics in portfolio
    const portfolio = DBManager.data.portfolios.find(p => p.id === resource.uploaderId);
    if (portfolio) {
      portfolio.resourcesUploadedCount = (portfolio.resourcesUploadedCount || 0) + 1;
      portfolio.reputationScore += 20; // +20 Reputation for uploading a resource
      DBManager.updateBadge(portfolio);
    }

    DBManager.save();
    return resource;
  }

  public static voteResource(resourceId: string, voteType: 'up' | 'down', userId: string = 'anonymous'): Resource | undefined {
    const resource = DBManager.getResourceById(resourceId);
    if (!resource) return undefined;

    // To simplify and make it robust, we increment/decrement votes
    if (voteType === 'up') {
      resource.upvotes += 1;
      
      // Update uploader reputation: +10 Reputation for receiving an upvote
      const portfolio = DBManager.data.portfolios.find(p => p.id === resource.uploaderId);
      if (portfolio) {
        portfolio.totalUpvotesReceived = (portfolio.totalUpvotesReceived || 0) + 1;
        portfolio.reputationScore += 10;
        DBManager.updateBadge(portfolio);
      }
    } else {
      resource.downvotes += 1;

      // -2 Reputation for receiving a downvote
      const portfolio = DBManager.data.portfolios.find(p => p.id === resource.uploaderId);
      if (portfolio && portfolio.reputationScore > 2) {
        portfolio.reputationScore -= 2;
        DBManager.updateBadge(portfolio);
      }
    }

    DBManager.save();
    return resource;
  }

  public static addComment(resourceId: string, commentText: string, userName: string = 'Anonymous Student'): Comment | undefined {
    const resource = DBManager.getResourceById(resourceId);
    if (!resource) return undefined;

    const newComment: Comment = {
      id: 'comment_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
      userName,
      text: commentText,
      createdAt: new Date().toISOString()
    };

    resource.comments = resource.comments || [];
    resource.comments.push(newComment);
    resource.commentsCount = resource.comments.length;

    DBManager.save();
    return newComment;
  }

  // Portfolios Operations
  public static getPortfolios(): UserPortfolio[] {
    return DBManager.data.portfolios || [];
  }

  public static getPortfolioById(id: string): UserPortfolio | undefined {
    return DBManager.getPortfolios().find(p => p.id === id);
  }

  public static updatePortfolio(portfolio: UserPortfolio): UserPortfolio {
    const index = DBManager.data.portfolios.findIndex(p => p.id === portfolio.id);
    if (index >= 0) {
      DBManager.data.portfolios[index] = {
        ...DBManager.data.portfolios[index],
        ...portfolio
      };
    } else {
      DBManager.data.portfolios.push(portfolio);
    }
    DBManager.save();
    return portfolio;
  }

  private static updateBadge(portfolio: UserPortfolio) {
    const score = portfolio.reputationScore;
    if (score >= 400) {
      portfolio.badge = 'Platinum';
    } else if (score >= 300) {
      portfolio.badge = 'Gold';
    } else if (score >= 200) {
      portfolio.badge = 'Silver';
    } else {
      portfolio.badge = 'Bronze';
    }
  }
}

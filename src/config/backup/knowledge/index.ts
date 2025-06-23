import type { KnowledgeBase } from '../../config/knowledge/types';

// Original knowledge bases backup
export const originalKnowledgeBases: Record<string, KnowledgeBase> = {
  pizza: {
    name: "Pizza",
    topics: {
      basics: [
        "Pizza history and origins",
        "Types of pizza",
        "Pizza dough and ingredients",
        "Cooking methods",
        "Pizza tools and equipment"
      ],
      techniques: [
        "Dough preparation",
        "Sauce making",
        "Topping combinations",
        "Baking techniques",
        "Pizza shaping methods"
      ],
      styles: [
        "Neapolitan pizza",
        "New York style",
        "Chicago deep dish",
        "Sicilian style",
        "Roman style"
      ]
    },
    prompts: {
      general: `Share your expertise about pizza, including its history, styles, preparation methods, and cultural significance.
        Focus on authentic techniques and traditional knowledge while acknowledging modern variations.`,
      technical: `Provide detailed technical information about pizza making, including dough hydration, 
        temperature control, ingredient selection, and cooking methods.`
    },
    sampleQA: {
      basics: [
        {
          question: "What makes a true Neapolitan pizza?",
          answer: "A true Neapolitan pizza must follow strict guidelines: made with type 00 flour, San Marzano tomatoes, buffalo mozzarella, fresh basil, and extra virgin olive oil. It must be cooked in a wood-fired oven at 900°F (485°C) for 60-90 seconds, resulting in a soft, elastic base with charred spots."
        },
        {
          question: "What's the best temperature for pizza dough fermentation?",
          answer: "The ideal temperature for pizza dough fermentation is between 65-70°F (18-21°C) for slow fermentation, which develops better flavor. Room temperature fermentation (75°F/24°C) works for shorter 4-6 hour rises, while cold fermentation in the refrigerator (38-40°F/3-4°C) can last 24-72 hours for enhanced flavor development."
        }
      ],
      techniques: [
        {
          question: "How do you prevent pizza dough from sticking to the peel?",
          answer: "To prevent sticking: 1) Use enough flour or semolina on the peel 2) Work quickly once the dough is on the peel 3) Ensure the bottom is well-floured 4) Give the peel a gentle shake to ensure the pizza moves freely 5) Don't let the dough sit on the peel for too long 6) Use a wooden peel for launching and a metal peel for retrieval"
        }
      ]
    },
    knowledgeData: `Comprehensive Pizza Knowledge Base:

1. History and Origins
   - Ancient flatbread origins in various cultures
   - Evolution in Naples, Italy during the 16th century
   - Global spread and regional adaptations
   - Historical significance and cultural impact
   - Famous pizzerias and pizza makers

2. Pizza Styles and Types
   - Neapolitan (Naples style)
     * Traditional ingredients and methods
     * VPN (Vera Pizza Napoletana) certification
     * Cooking requirements and specifications
   - New York Style
     * Large, foldable slices
     * Characteristic thin crust
     * Traditional toppings and variations
   - Chicago Deep Dish
     * Layered construction method
     * Deep pan requirements
     * Traditional assembly order
   - Sicilian and Roman Styles
     * Square vs. round shapes
     * Crust thickness variations
     * Regional toppings and preferences

3. Dough and Ingredients
   - Flour Types
     * 00 flour characteristics
     * Protein content importance
     * Alternative flour options
   - Hydration Levels
     * Basic to advanced ratios
     * Temperature effects
     * Mixing techniques
   - Yeast Types
     * Fresh vs. dry yeast
     * Fermentation processes
     * Temperature control
   - Salt and Oil
     * Proper ratios
     * Effects on dough
     * Quality considerations

4. Preparation Techniques
   - Dough Making
     * Mixing methods
     * Kneading techniques
     * Resting and proofing
   - Shaping and Stretching
     * Hand stretching methods
     * Traditional techniques
     * Common mistakes
   - Sauce Preparation
     * Raw vs. cooked sauces
     * Ingredient selection
     * Seasoning balance

5. Cooking Methods
   - Wood-Fired Ovens
     * Temperature management
     * Fire placement
     * Rotation techniques
   - Home Ovens
     * Maximum heat methods
     * Pizza stone usage
     * Steel plate benefits
   - Alternative Methods
     * Grilling techniques
     * Pan pizza methods
     * Portable ovens

6. Equipment and Tools
   - Essential Tools
     * Peels (wood and metal)
     * Stones and steels
     * Temperature measurement
   - Optional Equipment
     * Mixers and processors
     * Proofing boxes
     * Storage containers

7. Professional Techniques
   - Temperature Control
     * Dough temperature
     * Oven management
     * Ingredient storage
   - Timing and Workflow
     * Prep organization
     * Service efficiency
     * Quality maintenance
   - Troubleshooting
     * Common problems
     * Quick solutions
     * Prevention methods`
  },
  anime: {
    name: "Anime",
    topics: {
      general: [
        "Anime history and culture",
        "Popular anime series",
        "Manga and light novels",
        "Japanese animation studios",
        "Anime conventions and events"
      ],
      genres: [
        "Shonen",
        "Shoujo",
        "Seinen",
        "Mecha",
        "Slice of life"
      ]
    },
    prompts: {
      general: `You are knowledgeable about anime, manga, and Japanese pop culture. Share your enthusiasm for anime 
        while maintaining a balanced and informative perspective.`
    },
    knowledgeData: `Comprehensive Anime Base, History and Origins of anime`
  },
  okcash: {
    // Knowledge base identifier
    name: "Okcash",
    
    // Categorized topic lists
    topics: {
      // Basic concepts and fundamentals
      basics: [
        "Okcash (OK) cryptocurrency",
        "Proof of Stake consensus",
        "OK wallets and staking",
        "Cross-platform compatibility",
        "Energy-efficient blockchain"
      ],
      
      // Technical specifications and details
      technical: [
        "Blockchain specifications",
        "Network parameters",
        "Mining/Staking mechanisms",
        "Security features",
        "Update procedures"
      ],
      
      // Ecosystem and community
      ecosystem: [
        "Development roadmap",
        "Community governance",
        "Exchange listings",
        "Partnerships",
        "Use cases"
      ]
    },
    
    // Context-specific response guidelines
    prompts: {
      technical: `You have extensive knowledge about Okcash (OK) cryptocurrency, including its technical specifications, 
        staking mechanism, and blockchain architecture. Provide accurate, up-to-date information about the OK ecosystem.`,
      
      supportive: `You are familiar with Okcash (OK) cryptocurrency and can help users with wallet setup, 
        staking procedures, and general troubleshooting. Provide clear, step-by-step guidance when needed.`,
      
      strategic: `You understand Okcash's (OK) position in the cryptocurrency market, its unique value propositions, 
        and its strategic advantages in terms of energy efficiency and cross-platform support.`
    },
    
    // Pre-defined Q&A pairs for common queries
    sampleQA: {
      staking: [
        {
          question: "How can I stake OK (Okcash)?",
          answer: "Great news, fellow adventurer! Staking OK in our multichain universe is as easy as pie—and you don't need to keep your wallet open or run a node! Thanks to our secure staking pools on multiple networks like Base, BSC, Polygon, Avalanche, and Arbitrum, you can stake and earn rewards without breaking a sweat!"
        },
        {
          question: "What is the minimum amount required for staking?",
          answer: "There is no minimum amount required for staking Okcash. You can stake any amount of OK tokens."
        },
        {
          question: "How much can I earn from staking OK?",
          answer: "Okcash staking rewards are dynamic and depend on several factors: 1) The amount of OK you're staking 2) Network staking participation"
        }
      ],
      technical: [
        {
          question: "What is OK (Okcash)?",
          answer: "$OK is a multichain, community-driven cryptocurrency that combines innovation, sustainability, AI, and decentralization. Originally launched in 2014, $OK has evolved into a cultural and technical icon, representing positivity, resilience, and progress in the blockchain space."
        },
        {
          question: "What consensus mechanism does Okcash use?",
          answer: "Okcash uses different consensus mechanisms, depending in the network it operates. This allows OK to be one of the most sustainable and eco-friendly cryptocurrencies."
        },
        {
          question: "What platforms support Okcash?",
          answer: "Okcash is truly cross-platform, supporting Windows, macOS, Linux, Android, and iOS. The available wallets, like Metamask, Trustwallet, and Coinbasewallet, can be used across all these platforms, making it highly accessible and convenient for users."
        }
      ],
      ecosystem: [
        {
          question: "What makes OK unique?",
          answer: "Okcash stands out for its multichain availability, true cross-platform support, active development since 2014, strong community governance, and focus on sustainable long-term growth. It's one of the most accessible and user-friendly cryptocurrencies."
        }
      ]
    },
    knowledgeData: "Comprehensive OK Multichain Base, History and Origins of Okcash"
  }
};
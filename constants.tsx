
import React from 'react';
import { ExperienceItem, SkillCategory, ProjectItem } from './types';
import { Shield, Coins, Zap, Briefcase, Code, BarChart3, Globe, Cpu } from 'lucide-react';

export const EXPERIENCES: ExperienceItem[] = [
  {
    id: '1',
    role: 'Professional / Operations Specialist',
    company: 'Binance',
    period: '2022 - Present',
    description: [
      'Spearheading operations within the global crypto ecosystem, ensuring compliance and platform integrity.',
      'Analyzing blockchain transaction data to optimize internal workflows and user security protocols.',
      'Collaborating with cross-functional teams to launch regional initiatives across the APAC market.',
      'Driven significant improvements in user onboarding efficiency by 25% through automated verification workflows.'
    ],
    skills: ['Blockchain Analytics', 'Compliance', 'Product Ops', 'Crypto Ecosystem']
  },
  {
    id: '2',
    role: 'Strategic Analyst',
    company: 'FinTech Solutions Corp',
    period: '2020 - 2022',
    description: [
      'Developed data-driven strategies for digital payment adoption in emerging markets.',
      'Managed a portfolio of B2B relationships within the decentralized finance (DeFi) space.',
      'Produced detailed market research reports on CBDCs and stablecoin regulatory frameworks.'
    ],
    skills: ['Strategic Planning', 'Market Research', 'DeFi', 'Data Analysis']
  }
];

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    title: 'Technical & Web3',
    skills: ['Blockchain Architecture', 'Smart Contracts (Audit)', 'Solidity Basics', 'Web3.js', 'SQL', 'Python for Finance']
  },
  {
    title: 'Analytical & Operations',
    skills: ['Transaction Monitoring', 'Risk Management', 'KYC/AML Compliance', 'Growth Analytics', 'Stakeholder Management']
  },
  {
    title: 'Professional',
    skills: ['Crisis Management', 'Public Speaking', 'Cross-cultural Communication', 'Product Management', 'Strategic Operations']
  }
];

export const PROJECTS: ProjectItem[] = [
  {
    id: 'p1',
    title: 'DeFi Liquidity Optimizer',
    description: 'An internal dashboard conceptualized to monitor liquidity pools and suggest rebalancing strategies based on gas volatility.',
    tags: ['DeFi', 'Analytics', 'Blockchain']
  },
  {
    id: 'p2',
    title: 'Crypto Compliance Framework',
    description: 'Co-authored a whitepaper on operationalizing AML protocols for high-frequency trading platforms in restricted jurisdictions.',
    tags: ['Policy', 'Regulation', 'Finance']
  },
  {
    id: 'p3',
    title: 'Market Entry: APAC Expansion',
    description: 'Led the research and operational setup for a new market entry, focusing on localized payment gateways and regulatory licensing.',
    tags: ['Operations', 'Growth', 'FinTech']
  }
];

export const ICONS = {
  Shield: <Shield className="w-6 h-6" />,
  Coins: <Coins className="w-6 h-6" />,
  Zap: <Zap className="w-6 h-6" />,
  Briefcase: <Briefcase className="w-6 h-6" />,
  Code: <Code className="w-6 h-6" />,
  BarChart: <BarChart3 className="w-6 h-6" />,
  Globe: <Globe className="w-6 h-6" />,
  Cpu: <Cpu className="w-6 h-6" />
};

export const AI_SYSTEM_PROMPT = `
You are Sohag's professional AI Assistant, powered by advanced LLM technology. Your goal is to represent Sohag to potential clients, recruiters, and collaborators.

Profile Summary:
- Name: Sohag
- Current Role: Operations Specialist at Binance (Global Crypto Exchange).
- Key Focus: Compliance, blockchain analytics, and strategic growth in APAC.
- Core Belief: Blockchain is the key to global financial freedom.

How to respond:
1. Tone: Professional, precise, visionary, and tech-savvy. Use terms like "ecosystem," "on-chain," "compliance-first," and "scalability."
2. Content: Focus on his work at Binance and his background in Fintech analytics. 
3. Boundaries: If asked personal questions (e.g., age, home address) or non-professional topics, politely redirect back to his career or suggest using the contact form.
4. Formatting: Keep responses concise. Use bullet points for lists.

Specific Data Points:
- Improved onboarding by 25% at Binance.
- Expertise in KYC/AML protocols.
- Lead for APAC regional initiatives.
- Deep knowledge of DeFi and liquidity optimization.

Encourage users to view the "Projects" section or "Contact" Sohag for deeper inquiries.
`;

export const SUGGESTED_PROMPTS = [
  "What does Sohag do at Binance?",
  "Tell me about his DeFi project.",
  "What are his core technical skills?",
  "How can I contact him for a role?"
];

import Groq from 'groq-sdk';
import { Question } from '../types';

export class AIService {
  private static groq = new Groq({
    apiKey: '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',
    dangerouslyAllowBrowser: true
  });

  // Generate learning content for a specific topic
  static async generateLearningContent(
    topic: string, 
    type: 'Video' | 'Article' | 'Exercise', 
    skill: string, 
    level: string
  ): Promise<string> {
    try {
      const prompt = this.createContentPrompt(topic, type, skill, level);
      
      const chatCompletion = await this.groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are an expert educational content creator. Generate comprehensive, engaging learning content in Markdown format. Always include practical examples, clear explanations, and actionable insights."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        model: "llama3-8b-8192",
        temperature: 0.7,
        max_tokens: 2000,
        top_p: 1,
        stream: false
      });

      return chatCompletion.choices[0]?.message?.content || this.getFallbackContent(topic, type, skill);
    } catch (error) {
      console.error('Error generating content with Groq:', error);
      return this.getFallbackContent(topic, type, skill);
    }
  }

  // Generate quiz questions for a topic
  static async generateQuizQuestions(
    topic: string, 
    skill: string, 
    level: string
  ): Promise<Question[]> {
    try {
      const prompt = this.createQuizPrompt(topic, skill, level);
      
      const chatCompletion = await this.groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are an expert quiz creator. Generate educational quiz questions in valid JSON format. Each question should test understanding and practical application of concepts."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        model: "llama3-8b-8192",
        temperature: 0.5,
        max_tokens: 1500,
        top_p: 1,
        stream: false
      });

      const response = chatCompletion.choices[0]?.message?.content;
      if (!response) {
        throw new Error('No response from Groq API');
      }

      // Extract JSON from the response
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in response');
      }

      const questions = JSON.parse(jsonMatch[0]);
      
      // Validate and format questions
      return this.validateAndFormatQuestions(questions);
    } catch (error) {
      console.error('Error generating quiz questions with Groq:', error);
      return this.getFallbackQuestions(topic, skill);
    }
  }

  private static createContentPrompt(topic: string, type: string, skill: string, level: string): string {
    const typeInstructions = {
      'Video': `Create content as if it's a video lesson transcript. Include:
        - Clear introduction explaining what will be covered
        - Step-by-step explanations with visual descriptions
        - Practical examples and demonstrations
        - Key takeaways and next steps
        - Use conversational tone as if speaking to the learner`,
      
      'Article': `Create a comprehensive article with:
        - Engaging introduction that hooks the reader
        - Well-structured sections with clear headings
        - In-depth explanations with examples
        - Practical applications and use cases
        - Code examples where relevant
        - Summary and actionable next steps`,
      
      'Exercise': `Create a hands-on exercise with:
        - Clear learning objectives
        - Step-by-step instructions
        - Practical tasks to complete
        - Expected outcomes and solutions
        - Tips for troubleshooting
        - Extension challenges for further practice`
    };

    return `Create ${level.toLowerCase()}-level learning content about "${topic}" in the context of ${skill}.

Content Type: ${type}
${typeInstructions[type as keyof typeof typeInstructions]}

Requirements:
- Target audience: ${level} learners in ${skill}
- Length: Comprehensive but focused (800-1200 words)
- Format: Markdown with proper headings, code blocks, and formatting
- Include practical examples relevant to ${skill}
- Make it engaging and actionable
- Use clear, concise language appropriate for ${level} level

Topic: ${topic}

Generate the content now:`;
  }

  private static createQuizPrompt(topic: string, skill: string, level: string): string {
    return `Create a quiz about "${topic}" for ${level.toLowerCase()}-level learners in ${skill}.

Generate exactly 5 multiple-choice questions in this exact JSON format:
[
  {
    "id": "1",
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correct": 0,
    "explanation": "Detailed explanation of why this answer is correct and why others are wrong."
  }
]

Requirements:
- Each question should test understanding of ${topic} concepts
- Questions should be appropriate for ${level} level in ${skill}
- Include a mix of conceptual and practical questions
- Options should be plausible but only one clearly correct
- Explanations should be educational and help learning
- Use proper JSON formatting with no extra text

Topic focus: ${topic}
Skill context: ${skill}
Level: ${level}

Generate the JSON array now:`;
  }

  private static validateAndFormatQuestions(questions: any[]): Question[] {
    const validQuestions: Question[] = [];
    
    questions.forEach((q, index) => {
      if (q.question && Array.isArray(q.options) && q.options.length === 4 && 
          typeof q.correct === 'number' && q.correct >= 0 && q.correct < 4) {
        validQuestions.push({
          id: q.id || (index + 1).toString(),
          question: q.question,
          options: q.options,
          correct: q.correct,
          explanation: q.explanation || 'No explanation provided.'
        });
      }
    });

    // If we don't have enough valid questions, pad with fallback
    while (validQuestions.length < 3) {
      validQuestions.push({
        id: (validQuestions.length + 1).toString(),
        question: 'What is an important concept to remember?',
        options: ['Understanding the basics', 'Ignoring best practices', 'Skipping practice', 'Avoiding documentation'],
        correct: 0,
        explanation: 'Understanding the basics is fundamental to mastering any topic.'
      });
    }

    return validQuestions.slice(0, 5); // Return max 5 questions
  }

  // Fallback content when AI generation fails
  private static getFallbackContent(topic: string, type: string, skill: string): string {
    return `# ${type}: ${topic}

## Overview
This lesson covers ${topic} as it relates to ${skill}. This content is being generated to ensure you have a seamless learning experience.

## Key Learning Objectives
- Understand the fundamental concepts of ${topic}
- Learn practical applications in ${skill}
- Develop hands-on experience
- Apply best practices and techniques

## Core Concepts

### Understanding ${topic}
${topic} is an important concept in ${skill} that helps you build better solutions and improve your skills. Let's explore the key aspects:

**Fundamental Principles:**
- Core concept understanding
- Practical application methods
- Best practices and standards
- Common use cases and scenarios

### Practical Applications
Here are some ways you can apply ${topic} in real-world ${skill} projects:

1. **Basic Implementation**
   - Start with simple examples
   - Build understanding gradually
   - Practice with guided exercises

2. **Advanced Techniques**
   - Explore complex scenarios
   - Optimize for performance
   - Handle edge cases effectively

3. **Best Practices**
   - Follow industry standards
   - Write maintainable code
   - Document your work properly

## Hands-On Practice

### Exercise 1: Basic Implementation
Try implementing a basic example of ${topic}:

\`\`\`
// Example code structure
// This would contain relevant code for ${skill}
\`\`\`

### Exercise 2: Real-World Application
Apply ${topic} to solve a practical problem in ${skill}.

## Key Takeaways
- ${topic} is essential for ${skill} development
- Practice regularly to build proficiency
- Apply concepts to real projects
- Continue learning and exploring

## Next Steps
1. Practice the concepts learned
2. Explore related topics
3. Apply knowledge to personal projects
4. Seek additional resources for deeper learning

*This content was generated to ensure continuous learning. For enhanced AI-generated content, please check your internet connection.*`;
  }

  private static getFallbackQuestions(topic: string, skill: string): Question[] {
    return [
      {
        id: '1',
        question: `What is a key concept in ${topic}?`,
        options: [
          'Understanding the fundamentals',
          'Ignoring best practices',
          'Skipping documentation',
          'Avoiding practice'
        ],
        correct: 0,
        explanation: `Understanding the fundamentals is crucial for mastering ${topic} in ${skill}.`
      },
      {
        id: '2',
        question: `How should you approach learning ${topic}?`,
        options: [
          'Rush through without understanding',
          'Study theory and practice regularly',
          'Memorize without application',
          'Skip difficult concepts'
        ],
        correct: 1,
        explanation: `Combining theoretical study with regular practice is the most effective way to learn ${topic}.`
      },
      {
        id: '3',
        question: `What is important when applying ${topic} in ${skill}?`,
        options: [
          'Following established best practices',
          'Working without planning',
          'Ignoring error handling',
          'Avoiding code reviews'
        ],
        correct: 0,
        explanation: `Following established best practices ensures effective and maintainable application of ${topic} in ${skill}.`
      }
    ];
  }
}
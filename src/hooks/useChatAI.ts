import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AIResponse {
  message: string;
  type: 'text' | 'summary' | 'quiz' | 'flashcards';
}

export const useChatAI = () => {
  const [isThinking, setIsThinking] = useState(false);

  const generateResponse = async (message: string, context?: string): Promise<AIResponse> => {
    setIsThinking(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('gemini-chat', {
        body: { message, context }
      });

      if (error) {
        console.error('Gemini chat error:', error);
        return {
          message: "Selam! I'm having trouble connecting right now. Please try again! Gobez neh! 🙏",
          type: 'text'
        };
      }

      return {
        message: data.response,
        type: determineResponseType(message)
      };
    } catch (error) {
      console.error('Chat AI error:', error);
      return {
        message: "Sorry, I'm having technical difficulties. Gobez neh, let's try again! 💫",
        type: 'text'
      };
    } finally {
      setIsThinking(false);
    }
  };

  const determineResponseType = (message: string): 'text' | 'summary' | 'quiz' | 'flashcards' => {
    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes('quiz') || lowerMessage.includes('test')) return 'quiz';
    if (lowerMessage.includes('flashcard') || lowerMessage.includes('memorize')) return 'flashcards';
    if (lowerMessage.includes('summary') || lowerMessage.includes('summarize')) return 'summary';
    return 'text';
  };

  const generateContextualResponse = (message: string, hasFile?: boolean): AIResponse[] => {
    const lowerMessage = message.toLowerCase();
    
    // File-related responses
    if (hasFile || lowerMessage.includes('file') || lowerMessage.includes('upload')) {
      return [
        {
          message: "Betam gobez! I've analyzed your uploaded content. I can help you create flashcards, generate summaries, or make practice quizzes. What would you like to do first? ☕📚",
          type: 'text'
        },
        {
          message: "Wayz ena! Your file has been processed successfully. I found several key concepts that would make excellent study materials. Shall I create some flashcards or a summary? 🎯",
          type: 'summary'
        }
      ];
    }

    // Quiz-related responses
    if (lowerMessage.includes('quiz') || lowerMessage.includes('test') || lowerMessage.includes('question')) {
      return [
        {
          message: "Selam! I'd love to create a quiz for you! Based on your study materials, I can generate multiple-choice questions to test your knowledge. Ready to challenge yourself? Gobez neh! 🧠✨",
          type: 'quiz'
        }
      ];
    }

    // Flashcard responses
    if (lowerMessage.includes('flashcard') || lowerMessage.includes('memorize') || lowerMessage.includes('remember')) {
      return [
        {
          message: "Konjo idea! Flashcards are excellent for memorization. I can create personalized flashcards from your study materials with key terms and concepts. Let's make learning fun! 🎴📖",
          type: 'flashcards'
        }
      ];
    }

    // Summary responses
    if (lowerMessage.includes('summary') || lowerMessage.includes('summarize') || lowerMessage.includes('main points')) {
      return [
        {
          message: "Betam gobez! I'll create a comprehensive summary highlighting the main points and key concepts from your materials. This will help you review efficiently! 📝✨",
          type: 'summary'
        }
      ];
    }

    // Greeting responses
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('selam')) {
      return [
        {
          message: "ሰላም! Selam and welcome to Gobez! I'm your AI tutor ready to help you excel in your studies. Upload some materials or ask me questions about any subject. Gobez neh! 🇪🇹☕",
          type: 'text'
        }
      ];
    }

    // General educational responses
    return [
      {
        message: `Great question! Let me help you understand that better. ${getRandomEthiopianPhrase()} Based on what you're asking, I can provide detailed explanations, create study materials, or generate practice questions. What works best for your learning style? 📚✨`,
        type: 'text'
      },
      {
        message: `Wayz ena! That's an excellent topic to explore. I can break this down into digestible concepts, create visual aids, or even generate a quiz to test your understanding. How would you like to approach this? 🎯`,
        type: 'text'
      },
      {
        message: `Selam! I see you're diving deep into this subject. ${getRandomEthiopianPhrase()} Let me provide you with comprehensive insights and create some interactive learning materials to reinforce these concepts! 🧠💡`,
        type: 'text'
      }
    ];
  };

  const getRandomEthiopianPhrase = (): string => {
    const phrases = [
      'Gobez neh! 👏',
      'Betam konjo! 🌟',
      'Wayz ena! 💡',
      'Dehna neh? ☕',
      'Abate! 🎉'
    ];
    return phrases[Math.floor(Math.random() * phrases.length)];
  };

  return { generateResponse, isThinking };
};
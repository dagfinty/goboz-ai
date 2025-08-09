import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, RotateCcw, Trophy, Coffee } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: 'easy' | 'medium' | 'hard';
  explanation: string;
  amharicFeedback: {
    correct: string;
    incorrect: string;
  };
}

const QuizModule = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [userLevel, setUserLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');

  // Sample adaptive quiz questions
  const [questions] = useState<QuizQuestion[]>([
    {
      id: '1',
      question: 'What is the capital city of Ethiopia?',
      options: ['Addis Ababa', 'Dire Dawa', 'Bahir Dar', 'Mekelle'],
      correctAnswer: 0,
      difficulty: 'easy',
      explanation: 'Addis Ababa is the capital and largest city of Ethiopia, founded by Emperor Menelik II in 1886.',
      amharicFeedback: {
        correct: 'ትክክል! Betam gobez neh! 🎉',
        incorrect: 'ይቅርታ! But keep learning - Gobez neh! 💪'
      }
    },
    {
      id: '2',
      question: 'Which ancient civilization built the rock-hewn churches of Lalibela?',
      options: ['Axumite Empire', 'Zagwe Dynasty', 'Solomonic Dynasty', 'Ottoman Empire'],
      correctAnswer: 1,
      difficulty: 'medium',
      explanation: 'The Zagwe Dynasty, particularly King Lalibela in the 12th century, commissioned these remarkable churches.',
      amharicFeedback: {
        correct: 'Wayz ena! Excellent knowledge! ✨',
        incorrect: 'Close! Lalibela churches were built by Zagwe Dynasty 🏛️'
      }
    },
    {
      id: '3',
      question: 'What is the traditional Ethiopian calendar based on?',
      options: ['Gregorian calendar', 'Coptic calendar', 'Islamic calendar', 'Julian calendar'],
      correctAnswer: 1,
      difficulty: 'hard',
      explanation: 'The Ethiopian calendar is based on the Coptic calendar, with 13 months and a unique counting system.',
      amharicFeedback: {
        correct: 'Selam! Perfect understanding! 🌟',
        incorrect: 'Good try! Ethiopian calendar follows Coptic system 📅'
      }
    }
  ]);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult) return;
    setSelectedAnswer(answerIndex);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;
    
    setShowResult(true);
    
    if (selectedAnswer === currentQuestion.correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleRetakeQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setQuizCompleted(false);
  };

  const getScoreMessage = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage >= 80) return { message: 'Betam gobez! Excellent work! 🏆', amharic: 'በጣም ጎበዝ!' };
    if (percentage >= 60) return { message: 'Gobez neh! Good job! 👏', amharic: 'ጎበዝ ነህ!' };
    return { message: 'Keep practicing! Gobez ena! 💪', amharic: 'ተጨማሪ ልምምድ!' };
  };

  if (quizCompleted) {
    const scoreMessage = getScoreMessage();
    return (
      <Card className="p-8 text-center gobez-card">
        <div className="mb-6">
          <Trophy className="w-16 h-16 mx-auto text-gobez-yellow mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Quiz Complete!</h2>
          <p className="text-lg font-ethiopic text-gobez-green">{scoreMessage.amharic}</p>
        </div>
        
        <div className="mb-6">
          <div className="text-4xl font-bold text-primary mb-2">
            {score}/{questions.length}
          </div>
          <p className="text-muted-foreground">{scoreMessage.message}</p>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-gobez-yellow/10 rounded-lg border border-gobez-yellow/20">
            <h3 className="font-semibold mb-2 flex items-center">
              <Coffee className="w-4 h-4 mr-2 text-gobez-green" />
              Gobez Score Boost!
            </h3>
            <p className="text-sm text-muted-foreground">
              You earned +{score * 10} Gobez points for this quiz!
            </p>
          </div>
          
          <Button onClick={handleRetakeQuiz} className="w-full" size="lg">
            <RotateCcw className="w-4 h-4 mr-2" />
            Take Quiz Again
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 gobez-card">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-foreground">Ethiopian Quiz Master</h2>
          <span className="text-sm text-muted-foreground">
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
        </div>
        
        <Progress value={progress} className="h-2" />
        
        <div className="flex items-center justify-between mt-2 text-sm text-muted-foreground">
          <span>Progress: {Math.round(progress)}%</span>
          <span>Score: {score}/{currentQuestionIndex + (showResult ? 1 : 0)}</span>
        </div>
      </div>

      {/* Question */}
      <div className="mb-6">
        <div className="mb-4">
          <span className={`inline-block px-2 py-1 rounded text-xs font-medium mb-2 ${
            currentQuestion.difficulty === 'easy' ? 'bg-gobez-green/20 text-gobez-green' :
            currentQuestion.difficulty === 'medium' ? 'bg-gobez-yellow/20 text-gobez-yellow' :
            'bg-gobez-red/20 text-gobez-red'
          }`}>
            {currentQuestion.difficulty.toUpperCase()}
          </span>
        </div>
        
        <h3 className="text-lg font-semibold text-foreground mb-4">
          {currentQuestion.question}
        </h3>
      </div>

      {/* Options */}
      <div className="space-y-3 mb-6">
        {currentQuestion.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswerSelect(index)}
            disabled={showResult}
            className={`w-full p-4 text-left rounded-lg border transition-all gobez-smooth ${
              selectedAnswer === index
                ? showResult
                  ? index === currentQuestion.correctAnswer
                    ? 'border-gobez-green bg-gobez-green/10 text-gobez-green'
                    : 'border-gobez-red bg-gobez-red/10 text-gobez-red'
                  : 'border-primary bg-primary/10 text-primary'
                : showResult && index === currentQuestion.correctAnswer
                  ? 'border-gobez-green bg-gobez-green/10 text-gobez-green'
                  : 'border-border hover:border-primary/50 hover:bg-muted/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <span>{option}</span>
              {showResult && index === currentQuestion.correctAnswer && (
                <CheckCircle className="w-5 h-5 text-gobez-green" />
              )}
              {showResult && selectedAnswer === index && index !== currentQuestion.correctAnswer && (
                <XCircle className="w-5 h-5 text-gobez-red" />
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Result Explanation */}
      {showResult && (
        <div className="mb-6 p-4 rounded-lg bg-muted/50 border border-border">
          <h4 className="font-semibold text-foreground mb-2 flex items-center">
            <Coffee className="w-4 h-4 mr-2 text-gobez-green" />
            {selectedAnswer === currentQuestion.correctAnswer 
              ? currentQuestion.amharicFeedback.correct 
              : currentQuestion.amharicFeedback.incorrect
            }
          </h4>
          <p className="text-sm text-muted-foreground">
            {currentQuestion.explanation}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        {!showResult ? (
          <Button 
            onClick={handleSubmitAnswer}
            disabled={selectedAnswer === null}
            className="flex-1"
            size="lg"
          >
            Submit Answer
          </Button>
        ) : (
          <Button onClick={handleNextQuestion} className="flex-1" size="lg">
            {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
          </Button>
        )}
      </div>
    </Card>
  );
};

export default QuizModule;
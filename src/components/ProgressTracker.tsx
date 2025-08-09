import { useState, useEffect } from 'react';
import { Flame, Clock, Award, TrendingUp, Coffee, Star } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const ProgressTracker = () => {
  const [gobezScore, setGobezScore] = useState(750);
  const [weeklyGoal] = useState(1000);
  const [learningStreak, setLearningStreak] = useState(12);
  const [weeklyMinutes, setWeeklyMinutes] = useState(240);
  const [totalHours, setTotalHours] = useState(67);

  const progressPercentage = (gobezScore / weeklyGoal) * 100;
  const streakLevel = Math.floor(learningStreak / 7) + 1;

  // Weekly activity data
  const weeklyActivity = [
    { day: 'Mon', minutes: 45, amharic: 'ሰኞ' },
    { day: 'Tue', minutes: 30, amharic: 'ማክሰኞ' },
    { day: 'Wed', minutes: 60, amharic: 'ረቡዕ' },
    { day: 'Thu', minutes: 35, amharic: 'ሐሙስ' },
    { day: 'Fri', minutes: 40, amharic: 'አርብ' },
    { day: 'Sat', minutes: 20, amharic: 'ቅዳሜ' },
    { day: 'Sun', minutes: 10, amharic: 'እሁድ' }
  ];

  const achievements = [
    { title: 'First Week Complete', amharic: 'የመጀመሪያ ሳምንት', icon: Award, earned: true },
    { title: 'Quiz Master', amharic: 'የፈተና ወዛዴ', icon: Star, earned: true },
    { title: 'Study Streak', amharic: 'የተከታታይ ትምህርት', icon: Flame, earned: false },
    { title: 'Knowledge Seeker', amharic: 'የእውቀት ፈላጊ', icon: Coffee, earned: true }
  ];

  const getStreakMessage = () => {
    if (learningStreak >= 30) return { message: 'Incredible streak! Gobez ena!', amharic: 'አስገራሚ!' };
    if (learningStreak >= 14) return { message: 'Amazing progress! Betam gobez!', amharic: 'በጣም ጎበዝ!' };
    if (learningStreak >= 7) return { message: 'Great consistency! Gobez neh!', amharic: 'ጎበዝ ነህ!' };
    return { message: 'Keep going! You can do it!', amharic: 'ቀጥል!' };
  };

  const streakMessage = getStreakMessage();

  return (
    <div className="space-y-6">
      {/* Gobez Score Card */}
      <Card className="p-6 gobez-card">
        <div className="text-center mb-6">
          <div className="relative w-32 h-32 mx-auto mb-4">
            {/* Circular Progress */}
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="currentColor"
                strokeWidth="6"
                fill="transparent"
                className="text-muted"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="url(#gobez-gradient)"
                strokeWidth="6"
                fill="transparent"
                strokeDasharray={`${progressPercentage * 2.83} 283`}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="gobez-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="hsl(var(--gobez-green))" />
                  <stop offset="100%" stopColor="hsl(var(--gobez-yellow))" />
                </linearGradient>
              </defs>
            </svg>
            
            {/* Center Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <Flame className="w-8 h-8 text-gobez-yellow mb-1" />
              <span className="text-2xl font-bold text-foreground">{gobezScore}</span>
              <span className="text-xs text-muted-foreground">Gobez Score</span>
            </div>
          </div>
          
          <h2 className="text-xl font-bold text-foreground mb-1">Weekly Gobez Score</h2>
          <p className="text-sm font-ethiopic text-gobez-green mb-2">የሳምንት ጎበዝ ነጥብ</p>
          <p className="text-sm text-muted-foreground">
            {gobezScore} / {weeklyGoal} points ({Math.round(progressPercentage)}% complete)
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-gobez-green/10 rounded-lg">
            <Clock className="w-5 h-5 mx-auto text-gobez-green mb-1" />
            <div className="text-lg font-bold text-foreground">{weeklyMinutes}m</div>
            <div className="text-xs text-muted-foreground">This Week</div>
          </div>
          <div className="text-center p-3 bg-gobez-yellow/10 rounded-lg">
            <TrendingUp className="w-5 h-5 mx-auto text-gobez-yellow mb-1" />
            <div className="text-lg font-bold text-foreground">{totalHours}h</div>
            <div className="text-xs text-muted-foreground">Total Time</div>
          </div>
        </div>
      </Card>

      {/* Streak Card */}
      <Card className="p-6 gobez-card">
        <div className="text-center mb-4">
          <div className="flex items-center justify-center mb-2">
            <Flame className="w-8 h-8 text-gobez-red mr-2" />
            <span className="text-3xl font-bold text-foreground">{learningStreak}</span>
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-1">Day Learning Streak</h3>
          <p className="text-sm font-ethiopic text-gobez-red">የተከታታይ ትምህርት ቀናት</p>
          <p className="text-sm text-muted-foreground mt-2">{streakMessage.message}</p>
          <p className="text-sm font-ethiopic text-gobez-green">{streakMessage.amharic}</p>
        </div>

        <div className="bg-muted/50 rounded-lg p-3">
          <div className="text-center text-sm text-muted-foreground mb-2">Level {streakLevel} Learner</div>
          <Progress value={(learningStreak % 7) / 7 * 100} className="h-2" />
          <div className="text-center text-xs text-muted-foreground mt-1">
            {7 - (learningStreak % 7)} days to next level
          </div>
        </div>
      </Card>

      {/* Weekly Activity Chart */}
      <Card className="p-6 gobez-card">
        <h3 className="text-lg font-semibold text-foreground mb-4 text-center">
          Weekly Activity • የሳምንት እንቅስቃሴ
        </h3>
        
        <div className="space-y-3">
          {weeklyActivity.map((day, index) => (
            <div key={day.day} className="flex items-center space-x-3">
              <div className="w-12 text-sm text-center">
                <div className="text-foreground font-medium">{day.day}</div>
                <div className="text-xs text-muted-foreground font-ethiopic">{day.amharic}</div>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <Progress 
                    value={(day.minutes / 60) * 100} 
                    className="flex-1 h-3"
                  />
                  <span className="text-sm text-muted-foreground ml-2 min-w-[40px]">
                    {day.minutes}m
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Achievements */}
      <Card className="p-6 gobez-card">
        <h3 className="text-lg font-semibold text-foreground mb-4 text-center">
          Achievements • ውጤቶች
        </h3>
        
        <div className="grid grid-cols-2 gap-3">
          {achievements.map((achievement, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg border text-center transition-all gobez-smooth ${
                achievement.earned
                  ? 'bg-gobez-green/10 border-gobez-green/20 text-gobez-green'
                  : 'bg-muted/30 border-border text-muted-foreground'
              }`}
            >
              <achievement.icon className={`w-6 h-6 mx-auto mb-2 ${
                achievement.earned ? 'text-gobez-green' : 'text-muted-foreground'
              }`} />
              <div className="text-sm font-medium">{achievement.title}</div>
              <div className="text-xs font-ethiopic">{achievement.amharic}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default ProgressTracker;
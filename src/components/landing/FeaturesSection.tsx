import React from "react";
import { 
  TrendingUp, 
  BrainCircuit, 
  Trophy, 
  Brackets, 
  Timer, 
  BarChart3 
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

const FeatureCard = ({ 
  icon: Icon, 
  title, 
  description, 
  index 
}: { 
  icon: React.ElementType, 
  title: string, 
  description: string, 
  index: number 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index, duration: 0.4 }}
    >
      <Card className="h-full border-0 hover:scale-[1.02] transition-all duration-300">
        <CardHeader className="pb-2">
          <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20 dark:from-indigo-600/30 dark:to-purple-600/30 flex items-center justify-center mb-4">
            <Icon className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
          </div>
          <CardTitle className="text-xl">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-600 dark:text-slate-400">
            {description}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: Brackets,
      title: "Create Brackets",
      description: "Build your own tournament brackets with your best stock picks to challenge our AI opponents."
    },
    {
      icon: BrainCircuit,
      title: "Battle AI Personalities",
      description: "Face off against different AI personalities, each with unique trading styles and strategies."
    },
    {
      icon: Timer,
      title: "Real-time Tracking",
      description: "Watch your bracket unfold as stock performances are tracked in real-time throughout the duel."
    },
    {
      icon: TrendingUp,
      title: "Multiple Timeframes",
      description: "Choose from daily, weekly, or monthly duels to match your trading and investment style."
    },
    {
      icon: BarChart3,
      title: "Performance Analysis",
      description: "Get detailed performance analytics comparing your stock selections against the AI."
    },
    {
      icon: Trophy,
      title: "Win Tournaments",
      description: "Earn points, unlock achievements, and climb the leaderboard as you win brackets against AI."
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl font-bold mb-4">How Stock Duels Work</h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-3xl mx-auto text-lg">
            Create brackets, pick stocks, and compete against AI personalities in tournament-style duels
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              index={index}
            />
          ))}
        </div>
        
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <p className="text-slate-500 dark:text-slate-400 mb-6 text-lg">
            Ready to prove you can outsmart the algorithms?
          </p>
          <a 
            href="/register" 
            className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium px-8 py-3 rounded-md shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Trophy className="h-5 w-5" />
            Start Your First Duel
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
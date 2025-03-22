/**
 * AI Prediction Insights Component
 * Displays information about the AI learning system and its impact
 */
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { Brain, TrendingUp, Zap, BarChart3 } from 'lucide-react';
import usePredictionLearning from '@/hooks/usePredictionLearning';
import { Button } from '@/components/ui/button';

interface PatternSummary {
  totalPatterns: number;
  averageAiAccuracy: number;
  averageUserAccuracy: number;
  largestAdjustment: number;
  mostAnalyzedPattern: string;
  sampleSize: number;
}

const AIPredictionInsights = () => {
  const { isInitialized, isAnalyzing, lastAnalysis, triggerAnalysis } = usePredictionLearning();
  const [patternSummary, setPatternSummary] = useState<PatternSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPredictionPatterns = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('prediction_patterns')
          .select('*')
          .order('sample_size', { ascending: false });

        if (error) {
          console.error('Error fetching prediction patterns:', error);
          return;
        }

        if (!data || data.length === 0) {
          console.log('No prediction patterns found');
          setIsLoading(false);
          return;
        }

        // Calculate summary statistics
        const totalPatterns = data.length;
        const aiAccuracySum = data.reduce((sum, pattern) => sum + pattern.ai_accuracy, 0);
        const userAccuracySum = data.reduce((sum, pattern) => sum + pattern.user_accuracy, 0);
        const averageAiAccuracy = aiAccuracySum / totalPatterns;
        const averageUserAccuracy = userAccuracySum / totalPatterns;
        
        // Find largest adjustment (absolute value)
        const largestAdjustment = data.reduce((max, pattern) => 
          Math.abs(pattern.confidence_adjustment) > Math.abs(max) 
            ? pattern.confidence_adjustment 
            : max, 0);
        
        // Most analyzed pattern
        const mostAnalyzedPattern = data[0]; // Already sorted by sample size
        
        setPatternSummary({
          totalPatterns,
          averageAiAccuracy,
          averageUserAccuracy,
          largestAdjustment,
          mostAnalyzedPattern: `${mostAnalyzedPattern.timeframe} ${mostAnalyzedPattern.prediction_type}`,
          sampleSize: data.reduce((sum, pattern) => sum + pattern.sample_size, 0)
        });
      } catch (error) {
        console.error('Error analyzing patterns:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPredictionPatterns();
  }, [lastAnalysis]);

  const handleRunAnalysis = async () => {
    await triggerAnalysis();
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-indigo-500" />
          AI Learning System
        </CardTitle>
        <CardDescription>
          The AI learns from past predictions to improve accuracy
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="py-6 flex justify-center">
            <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : patternSummary ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 p-3 rounded-md">
                <div className="text-sm text-gray-500 mb-1 flex items-center">
                  <BarChart3 className="h-3.5 w-3.5 mr-1 text-indigo-500" />
                  Learning Patterns
                </div>
                <div className="text-2xl font-bold">{patternSummary.totalPatterns}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-md">
                <div className="text-sm text-gray-500 mb-1 flex items-center">
                  <Zap className="h-3.5 w-3.5 mr-1 text-amber-500" />
                  Predictions Analyzed
                </div>
                <div className="text-2xl font-bold">{patternSummary.sampleSize}</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-500">AI vs Human Accuracy</span>
                <span className="font-medium">
                  {(patternSummary.averageAiAccuracy * 100).toFixed(1)}% vs {(patternSummary.averageUserAccuracy * 100).toFixed(1)}%
                </span>
              </div>
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-indigo-600 bg-indigo-200">
                      AI
                    </span>
                  </div>
                  <div>
                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-amber-600 bg-amber-200">
                      Human
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 mb-4 flex rounded bg-gray-200">
                  <div 
                    style={{ width: `${patternSummary.averageAiAccuracy * 100}%` }} 
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500"
                  ></div>
                  <div
                    style={{ width: `${Math.max(0, patternSummary.averageUserAccuracy * 100 - patternSummary.averageAiAccuracy * 100)}%` }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-amber-500"
                  ></div>
                </div>
              </div>
            </div>
            
            <div className="pt-2">
              <div className="text-sm font-medium">Most Significant Adjustment</div>
              <div className="text-sm text-gray-600 mt-1">
                Confidence {patternSummary.largestAdjustment > 0 ? 'increased' : 'decreased'} by up to{' '}
                <span className={patternSummary.largestAdjustment > 0 ? 'text-green-600' : 'text-red-600'}>
                  {Math.abs(patternSummary.largestAdjustment).toFixed(1)}%
                </span>{' '}
                for {patternSummary.mostAnalyzedPattern} predictions
              </div>
            </div>
            
            {lastAnalysis && (
              <div className="text-xs text-gray-500 pt-2">
                Last analyzed: {lastAnalysis.toLocaleString()}
              </div>
            )}
            
            <div className="pt-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRunAnalysis}
                disabled={isAnalyzing || !isInitialized}
                className="w-full"
              >
                {isAnalyzing ? 'Analyzing...' : 'Run Analysis Now'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="py-4 text-center text-gray-500">
            <p className="mb-4">No prediction patterns analyzed yet</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRunAnalysis}
              disabled={isAnalyzing || !isInitialized}
            >
              {isAnalyzing ? 'Analyzing...' : 'Run Initial Analysis'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIPredictionInsights;
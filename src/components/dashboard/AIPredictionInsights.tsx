
/**
 * AI Prediction Insights Component
 * Displays information about the AI learning system and its impact
 */
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Brain } from 'lucide-react';
import { usePredictionLearning } from '@/hooks/usePredictionLearning';
import PatternSummaryCard from '@/components/dashboard/ai-insights/PatternSummaryCard';
import AccuracyComparisonCard from '@/components/dashboard/ai-insights/AccuracyComparisonCard';
import AdjustmentInsightCard from '@/components/dashboard/ai-insights/AdjustmentInsightCard';
import AnalysisButton from '@/components/dashboard/ai-insights/AnalysisButton';
import EmptyStateView from '@/components/dashboard/ai-insights/EmptyStateView';
import { PatternSummary, PredictionPattern } from '@/components/dashboard/ai-insights/types';

const AIPredictionInsights = () => {
  const { isInitialized, isAnalyzing, lastAnalysis, runAnalysis } = usePredictionLearning();
  const [patternSummary, setPatternSummary] = useState<PatternSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPredictionPatterns = async () => {
      try {
        setIsLoading(true);
        // Use type assertion to work with custom tables not in the types
        const { data, error } = await supabase
          .from('prediction_patterns')
          .select('*')
          .order('sample_size', { ascending: false }) as { data: PredictionPattern[] | null, error: any };

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
    await runAnalysis();
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
          <div className="space-y-4">
            <PatternSummaryCard 
              totalPatterns={0} 
              sampleSize={0} 
              isLoading={true} 
            />
            <AccuracyComparisonCard 
              averageAiAccuracy={0} 
              averageUserAccuracy={0} 
              isLoading={true} 
            />
            <AdjustmentInsightCard 
              largestAdjustment={0} 
              mostAnalyzedPattern="" 
              isLoading={true} 
            />
          </div>
        ) : patternSummary ? (
          <div className="space-y-4">
            <PatternSummaryCard 
              totalPatterns={patternSummary.totalPatterns} 
              sampleSize={patternSummary.sampleSize} 
              isLoading={false} 
            />
            
            <AccuracyComparisonCard 
              averageAiAccuracy={patternSummary.averageAiAccuracy} 
              averageUserAccuracy={patternSummary.averageUserAccuracy} 
              isLoading={false} 
            />
            
            <AdjustmentInsightCard 
              largestAdjustment={patternSummary.largestAdjustment} 
              mostAnalyzedPattern={patternSummary.mostAnalyzedPattern} 
              isLoading={false} 
            />
            
            <AnalysisButton 
              isAnalyzing={isAnalyzing} 
              isInitialized={isInitialized} 
              onRunAnalysis={handleRunAnalysis} 
              lastAnalysis={lastAnalysis} 
              className="pt-2" 
            />
          </div>
        ) : (
          <EmptyStateView 
            isAnalyzing={isAnalyzing} 
            isInitialized={isInitialized} 
            onRunAnalysis={handleRunAnalysis} 
          />
        )}
      </CardContent>
    </Card>
  );
};

export default AIPredictionInsights;

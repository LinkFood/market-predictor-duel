
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Helper function to get stock data
async function getStockData(ticker: string) {
  try {
    // Call the polygon-market-data edge function
    const response = await fetch(`${SUPABASE_URL}/functions/v1/polygon-market-data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`
      },
      body: JSON.stringify({
        endpoint: `/v2/aggs/ticker/${ticker}/prev`,
        params: {}
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error fetching stock data: ${errorText}`);
    }

    const data = await response.json();
    
    if (!data.results || data.results.length === 0) {
      throw new Error(`No data found for symbol ${ticker}`);
    }

    const result = data.results[0];
    const change = result.c - result.o; // Close minus open
    
    return {
      price: result.c, // Close price
      change,
      changePercent: (change / result.o) * 100
    };
  } catch (error) {
    console.error(`Error fetching stock data for ${ticker}:`, error);
    throw error;
  }
}

async function resolvePrediction(prediction: any) {
  try {
    // Get current stock data
    const stockData = await getStockData(prediction.ticker);
    
    // Determine the outcome based on prediction type
    let outcome: 'user_win' | 'ai_win' | 'tie';
    let points = 0;
    
    // For price predictions, determine if the prediction is closer to the actual price
    if (prediction.prediction_type === 'price') {
      const actualPrice = stockData.price;
      const userPredictionPrice = parseFloat(prediction.user_prediction.replace('$', ''));
      const aiPredictionPrice = parseFloat(prediction.ai_prediction.replace('$', ''));
      
      const userDifference = Math.abs(userPredictionPrice - actualPrice);
      const aiDifference = Math.abs(aiPredictionPrice - actualPrice);
      
      if (userDifference < aiDifference) {
        outcome = 'user_win';
        points = 20;
      } else if (aiDifference < userDifference) {
        outcome = 'ai_win';
        points = 0;
      } else {
        outcome = 'tie';
        points = 10;
      }
    } 
    // For trend predictions, determine if the trend prediction was correct
    else {
      const actualTrend = stockData.change >= 0 ? 'uptrend' : 'downtrend';
      const userCorrect = prediction.user_prediction === actualTrend || 
                          (prediction.user_prediction === 'bullish' && actualTrend === 'uptrend') ||
                          (prediction.user_prediction === 'bearish' && actualTrend === 'downtrend');
      const aiCorrect = prediction.ai_prediction === actualTrend || 
                        (prediction.ai_prediction === 'bullish' && actualTrend === 'uptrend') ||
                        (prediction.ai_prediction === 'bearish' && actualTrend === 'downtrend');
      
      if (userCorrect && !aiCorrect) {
        outcome = 'user_win';
        points = 20;
      } else if (!userCorrect && aiCorrect) {
        outcome = 'ai_win';
        points = 0;
      } else if (userCorrect && aiCorrect) {
        outcome = 'tie';
        points = 10;
      } else {
        outcome = 'tie';
        points = 5; // Both wrong
      }
    }
    
    // Calculate percent change
    const percentChange = ((stockData.price - prediction.starting_value) / prediction.starting_value) * 100;
    
    // Create update data object
    const updateData = {
      status: 'complete',
      final_value: stockData.price,
      percent_change: percentChange,
      actual_result: stockData.change >= 0 ? 'uptrend' : 'downtrend',
      outcome,
      points,
      resolved_at: new Date().toISOString()
    };
    
    console.log(`Resolving prediction ${prediction.id} with outcome: ${outcome}, points: ${points}`);

    // Update the prediction in the database
    const res = await fetch(`${SUPABASE_URL}/rest/v1/predictions?id=eq.${prediction.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(updateData)
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to update prediction: ${errorText}`);
    }

    return await res.json();
  } catch (error) {
    console.error(`Error resolving prediction ${prediction.id}:`, error);
    throw error;
  }
}

async function findAndResolveExpiredPredictions() {
  try {
    // Find pending predictions that have passed their resolution date
    const now = new Date().toISOString();
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/predictions?status=eq.pending&resolves_at=lt.${now}`,
      {
        headers: {
          'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch expired predictions: ${await response.text()}`);
    }

    const expiredPredictions = await response.json();
    console.log(`Found ${expiredPredictions.length} expired predictions to resolve.`);

    // Resolve each prediction
    const resolvePromises = expiredPredictions.map(async (prediction: any) => {
      try {
        const resolved = await resolvePrediction(prediction);
        console.log(`Successfully resolved prediction ${prediction.id}`);
        return { id: prediction.id, success: true, data: resolved };
      } catch (error) {
        console.error(`Failed to resolve prediction ${prediction.id}:`, error);
        return { id: prediction.id, success: false, error: error.message };
      }
    });

    // Wait for all resolutions to complete
    const results = await Promise.allSettled(resolvePromises);
    
    // Count successful resolutions
    const successCount = results.filter(
      (result) => result.status === 'fulfilled' && result.value.success
    ).length;

    return {
      processedCount: expiredPredictions.length,
      successCount,
      failureCount: expiredPredictions.length - successCount,
      results: results.map(result => 
        result.status === 'fulfilled' ? result.value : { success: false, error: result.reason }
      )
    };
  } catch (error) {
    console.error('Error in findAndResolveExpiredPredictions:', error);
    throw error;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Starting prediction resolution process...");
    
    // Check for required environment variables
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Missing required environment variables: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set');
    }

    const startTime = Date.now();
    const result = await findAndResolveExpiredPredictions();
    const duration = Date.now() - startTime;
    
    console.log(`Completed prediction resolution in ${duration}ms`);
    console.log(`Processed ${result.processedCount} predictions: ${result.successCount} successful, ${result.failureCount} failed`);
    
    return new Response(
      JSON.stringify({
        success: true,
        message: `Processed ${result.processedCount} predictions: ${result.successCount} successful, ${result.failureCount} failed`,
        executionTime: `${duration}ms`,
        timestamp: new Date().toISOString(),
        data: result
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    );
  } catch (error) {
    console.error("Error in resolve-predictions function:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message || "An error occurred during prediction resolution",
        timestamp: new Date().toISOString(),
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});

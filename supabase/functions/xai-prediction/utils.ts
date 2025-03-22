
// Utility functions for the xai-prediction edge function

// Sleep function for retry delay
export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// CORS headers
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Validate the input parameters
export function validateInput(ticker: string, timeframe: string, predictionType: string) {
  if (!ticker) {
    throw new Error("Missing required parameter: ticker");
  }
  
  if (!timeframe || !['1d', '1w', '1m', '3m'].includes(timeframe)) {
    throw new Error(`Invalid timeframe: ${timeframe}`);
  }
  
  if (!predictionType || !['trend', 'price'].includes(predictionType)) {
    throw new Error(`Invalid prediction type: ${predictionType}`);
  }
}

// API request with retry logic
export async function fetchWithRetry(url: string, options: RequestInit, retries = 2) {
  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API error (${response.status}): ${errorText}`);
      
      if (retries > 0 && (response.status === 429 || response.status >= 500)) {
        console.log(`Retrying... (${retries} attempts left)`);
        await sleep(1000);
        return fetchWithRetry(url, options, retries - 1);
      }
      
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }
    
    return response;
  } catch (error) {
    if (retries > 0 && error.message.includes('network')) {
      console.log(`Network error, retrying... (${retries} attempts left)`);
      await sleep(1000);
      return fetchWithRetry(url, options, retries - 1);
    }
    throw error;
  }
}

// Create a structured prediction from non-JSON response
export function extractFallbackPrediction(content: string, predictionType: string) {
  console.log("Using fallback prediction extraction");
  
  // Try to extract prediction with regex
  let prediction;
  if (predictionType === 'trend') {
    if (content.toLowerCase().includes('uptrend') || 
        content.toLowerCase().includes('bullish') ||
        content.toLowerCase().includes('upward') ||
        content.toLowerCase().includes('up trend')) {
      prediction = 'uptrend';
    } else if (content.toLowerCase().includes('downtrend') || 
               content.toLowerCase().includes('bearish') ||
               content.toLowerCase().includes('downward') ||
               content.toLowerCase().includes('down trend')) {
      prediction = 'downtrend';
    } else {
      // Default if we can't determine direction
      prediction = content.toLowerCase().includes('positive') ? 'uptrend' : 'downtrend';
    }
  } else {
    // For price predictions, try to extract a dollar amount
    const priceMatch = content.match(/\$?(\d+(\.\d+)?)/);
    prediction = priceMatch ? `$${priceMatch[1]}` : "$0.00";
  }
  
  // Try to extract confidence
  const confidenceMatch = content.match(/confidence[:\s]+(\d+)/i);
  const confidence = confidenceMatch ? parseInt(confidenceMatch[1], 10) : 80;
  
  // Try to extract rationale
  let rationale = "Based on market analysis.";
  const rationaleMatch = content.match(/rationale[:\s]+(.*?)(?=\n\n|\n#|\n\*\*|$)/is);
  if (rationaleMatch) {
    rationale = rationaleMatch[1].trim();
  }
  
  // Look for supporting points
  const supportingPoints = [];
  const supportingPattern = /supporting(?:\s+points|\s+factors)?[:\s]+(.*?)(?=counter|$)/is;
  const supportingMatch = content.match(supportingPattern);
  
  if (supportingMatch) {
    const supportText = supportingMatch[1];
    const points = supportText.match(/[-*]?\s*(.*?)(?=\n[-*]|\n\n|$)/gs);
    
    if (points) {
      points.forEach(point => {
        const cleaned = point.replace(/[-*]\s+/, '').trim();
        if (cleaned.length > 0) {
          supportingPoints.push(cleaned);
        }
      });
    }
  }
  
  // Look for counter points
  const counterPoints = [];
  const counterPattern = /counter(?:\s+points|\s+factors)?[:\s]+(.*?)(?=\n\n|\n#|\n\*\*|$)/is;
  const counterMatch = content.match(counterPattern);
  
  if (counterMatch) {
    const counterText = counterMatch[1];
    const points = counterText.match(/[-*]?\s*(.*?)(?=\n[-*]|\n\n|$)/gs);
    
    if (points) {
      points.forEach(point => {
        const cleaned = point.replace(/[-*]\s+/, '').trim();
        if (cleaned.length > 0) {
          counterPoints.push(cleaned);
        }
      });
    }
  }
  
  // Ensure we have at least 3 supporting and counter points
  const defaultSupportingPoints = [
    "Technical indicators suggest this direction",
    "Recent price action supports this view",
    "Market sentiment aligns with this prediction"
  ];
  
  const defaultCounterPoints = [
    "Market volatility is a risk factor",
    "External economic events could impact this prediction",
    "Sector-specific challenges may arise"
  ];
  
  while (supportingPoints.length < 3) {
    supportingPoints.push(defaultSupportingPoints[supportingPoints.length]);
  }
  
  while (counterPoints.length < 3) {
    counterPoints.push(defaultCounterPoints[counterPoints.length]);
  }
  
  // Create a structured prediction
  return {
    prediction,
    confidence: isNaN(confidence) ? 80 : confidence,
    rationale,
    supportingPoints,
    counterPoints
  };
}

// Parse and validate the prediction result
export function validatePredictionResult(content: string, predictionType: string) {
  try {
    console.log("Parsing prediction result from content:", content.substring(0, 200) + "...");
    
    // First, try to extract JSON if wrapped in code blocks or text
    let jsonMatch = content.match(/```(?:json)?\s*({[\s\S]*?})\s*```/);
    if (jsonMatch) {
      console.log("Found JSON in code block");
    } else {
      jsonMatch = content.match(/{[\s\S]*?}/);
      if (jsonMatch) {
        console.log("Found JSON in regular text");
      }
    }
                      
    const jsonStr = jsonMatch ? jsonMatch[1] || jsonMatch[0] : content;
    console.log("Extracted JSON string:", jsonStr.substring(0, 200) + "...");
    
    let predictionData;
    try {
      predictionData = JSON.parse(jsonStr);
      console.log("Successfully parsed JSON:", predictionData);
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      // Try a more relaxed approach to extract a JSON object
      const relaxedMatch = content.match(/{[^{]*"prediction"[^}]*}/);
      if (relaxedMatch) {
        try {
          // Try to clean up the JSON string before parsing
          const cleanedJson = relaxedMatch[0]
            .replace(/(\w+):/g, '"$1":') // Add quotes to keys
            .replace(/'/g, '"') // Replace single quotes with double quotes
            .replace(/,\s*}/g, '}'); // Remove trailing commas
          
          predictionData = JSON.parse(cleanedJson);
          console.log("Parsed JSON with relaxed approach:", predictionData);
        } catch (relaxedError) {
          console.error("Relaxed JSON parse also failed:", relaxedError);
          throw parseError; // Throw the original error if this also fails
        }
      } else {
        throw parseError;
      }
    }
    
    // Validate the prediction structure
    if (!predictionData.prediction) {
      console.error("Missing prediction in parsed data");
      throw new Error("Missing prediction in parsed data");
    }
    
    // Normalize trend predictions
    if (predictionType === 'trend') {
      const predictionValue = predictionData.prediction.toLowerCase();
      if (!['uptrend', 'downtrend'].includes(predictionValue)) {
        console.log(`Normalizing trend prediction: "${predictionData.prediction}"`);
        predictionData.prediction = predictionValue.includes('up') || 
                                  predictionValue.includes('bull') || 
                                  predictionValue.includes('positive') || 
                                  predictionValue.includes('increase') ? 
                                  'uptrend' : 'downtrend';
        console.log(`Normalized to: "${predictionData.prediction}"`);
      }
    }
    
    // Ensure confidence is a number between 0-100
    if (typeof predictionData.confidence === 'string') {
      predictionData.confidence = parseInt(predictionData.confidence, 10);
    }
    
    if (isNaN(predictionData.confidence) || predictionData.confidence === undefined) {
      console.log("Setting default confidence to 80");
      predictionData.confidence = 80;
    } else if (predictionData.confidence > 100) {
      console.log(`Capping confidence from ${predictionData.confidence} to 100`);
      predictionData.confidence = 100;
    } else if (predictionData.confidence < 0) {
      console.log(`Setting minimum confidence from ${predictionData.confidence} to 50`);
      predictionData.confidence = 50;
    }
    
    // Ensure all required fields are present
    predictionData.rationale = predictionData.rationale || predictionData.reasoning || 
                              "Based on market analysis, the AI has made this prediction.";
    
    // Handle supporting points
    if (!predictionData.supportingPoints || !Array.isArray(predictionData.supportingPoints) || predictionData.supportingPoints.length === 0) {
      console.log("Creating default supporting points");
      predictionData.supportingPoints = [
        "Technical indicators suggest this direction",
        "Recent price action supports this view",
        "Market sentiment aligns with this prediction"
      ];
    } else if (predictionData.supportingPoints.length < 3) {
      console.log("Adding additional supporting points to reach 3");
      const defaults = [
        "Technical indicators suggest this direction",
        "Recent price action supports this view",
        "Market sentiment aligns with this prediction"
      ];
      
      while (predictionData.supportingPoints.length < 3) {
        predictionData.supportingPoints.push(
          defaults[predictionData.supportingPoints.length]
        );
      }
    }
    
    // Handle counter points
    if (!predictionData.counterPoints || !Array.isArray(predictionData.counterPoints) || predictionData.counterPoints.length === 0) {
      console.log("Creating default counter points");
      predictionData.counterPoints = [
        "Market volatility is a risk factor",
        "External economic events could impact this prediction",
        "Sector-specific challenges may arise"
      ];
    } else if (predictionData.counterPoints.length < 3) {
      console.log("Adding additional counter points to reach 3");
      const defaults = [
        "Market volatility is a risk factor",
        "External economic events could impact this prediction",
        "Sector-specific challenges may arise"
      ];
      
      while (predictionData.counterPoints.length < 3) {
        predictionData.counterPoints.push(
          defaults[predictionData.counterPoints.length]
        );
      }
    }
    
    return predictionData;
  } catch (parseError) {
    console.error("Failed to parse JSON response:", parseError);
    console.log("Raw content that failed to parse:", content);
    
    // If JSON parsing fails, attempt to extract information with regex
    return extractFallbackPrediction(content, predictionType);
  }
}

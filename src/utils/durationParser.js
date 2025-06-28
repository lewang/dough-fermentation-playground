// Natural language duration parser
export function parseDuration(durationText) {
  if (!durationText || typeof durationText !== 'string') {
    return { isValid: false, minutes: 0, display: '' };
  }

  const text = durationText.toLowerCase().trim();
  
  // Common patterns
  const patterns = [
    // Hours and minutes: "2h 30m", "2 hours 30 minutes", "2:30"
    { regex: /(\d+(?:\.\d+)?)\s*h(?:ours?)?\s*(\d+(?:\.\d+)?)\s*m(?:in(?:utes?)?)?/i, 
      calc: (h, m) => parseFloat(h) * 60 + parseFloat(m) },
    
    // Hours only: "2h", "2 hours", "2.5h"
    { regex: /(\d+(?:\.\d+)?)\s*h(?:ours?)?$/i, 
      calc: (h) => parseFloat(h) * 60 },
    
    // Minutes only: "30m", "30 minutes", "30 min"
    { regex: /(\d+(?:\.\d+)?)\s*m(?:in(?:utes?)?)?$/i, 
      calc: (m) => parseFloat(m) },
    
    // Time format: "2:30", "0:45"
    { regex: /(\d+):(\d+)/i, 
      calc: (h, m) => parseFloat(h) * 60 + parseFloat(m) },
    
    // Days: "2 days", "1 day"
    { regex: /(\d+(?:\.\d+)?)\s*days?/i, 
      calc: (d) => parseFloat(d) * 24 * 60 },
    
    // Seconds: "30s", "30 seconds" 
    { regex: /(\d+(?:\.\d+)?)\s*s(?:ec(?:onds?)?)?$/i, 
      calc: (s) => parseFloat(s) / 60 }
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern.regex);
    if (match) {
      try {
        const minutes = pattern.calc(...match.slice(1));
        if (isNaN(minutes) || minutes < 0) continue;
        
        return {
          isValid: true,
          minutes: minutes,
          display: formatDuration(minutes)
        };
      } catch (e) {
        continue;
      }
    }
  }

  return { isValid: false, minutes: 0, display: '' };
}

function formatDuration(totalMinutes) {
  if (totalMinutes < 60) {
    return `${Math.round(totalMinutes * 10) / 10} minutes`;
  } else if (totalMinutes < 1440) { // Less than 24 hours
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.round(totalMinutes % 60);
    if (minutes === 0) {
      return `${hours} hour${hours !== 1 ? 's' : ''}`;
    }
    return `${hours}h ${minutes}m`;
  } else { // Days
    const days = Math.floor(totalMinutes / 1440);
    const hours = Math.floor((totalMinutes % 1440) / 60);
    if (hours === 0) {
      return `${days} day${days !== 1 ? 's' : ''}`;
    }
    return `${days} day${days !== 1 ? 's' : ''} ${hours}h`;
  }
}
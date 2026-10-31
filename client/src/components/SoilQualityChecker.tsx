import React from 'react';
import { RecommendationInput } from '@agrosmart/shared';
import { AlertCircle, CheckCircle, Info, ShieldCheck, HelpCircle } from 'lucide-react';

interface SoilQualityCheckerProps {
  input: RecommendationInput;
}

export const SoilQualityChecker: React.FC<SoilQualityCheckerProps> = ({ input }) => {
  const warnings: string[] = [];
  const tips: string[] = [];

  // 1. Check Completeness
  let filledCount = 0;
  const criticalFields = ['soilType', 'soilPh', 'temperature', 'rainfall', 'nitrogen', 'phosphorus', 'potassium', 'season'];
  
  if (input.soilType && input.soilType !== 'Unknown') filledCount++;
  if (input.soilPh !== null && input.soilPh !== undefined && !isNaN(Number(input.soilPh))) filledCount++;
  if (input.temperature !== null && input.temperature !== undefined && !isNaN(Number(input.temperature))) filledCount++;
  if (input.rainfall !== null && input.rainfall !== undefined && !isNaN(Number(input.rainfall))) filledCount++;
  if (input.nitrogen !== null && input.nitrogen !== undefined && !isNaN(Number(input.nitrogen))) filledCount++;
  if (input.phosphorus !== null && input.phosphorus !== undefined && !isNaN(Number(input.phosphorus))) filledCount++;
  if (input.potassium !== null && input.potassium !== undefined && !isNaN(Number(input.potassium))) filledCount++;
  if (input.season && input.season !== 'Unknown') filledCount++;

  const completeness = Math.round((filledCount / criticalFields.length) * 100);

  // 2. Validate pH limits & extreme ranges
  if (input.soilPh !== null && input.soilPh !== undefined && !isNaN(Number(input.soilPh))) {
    const ph = Number(input.soilPh);
    if (ph < 4.5) {
      warnings.push(`Soil pH (${ph}) indicates strong acidity. Micronutrient toxicities (Al, Fe) can retard root elongation.`);
      tips.push('Tip: Application of agricultural lime (2-4 tonnes/ha) is advised before sowing.');
    } else if (ph > 8.5) {
      warnings.push(`Soil pH (${ph}) indicates alkaline/saline conditions. Iron chlorosis and Phosphorus fixation are likely.`);
      tips.push('Tip: Gypsum application and organic compost help neutralize sodicity.');
    }
  }

  // 3. Check NPK Completeness
  const hasN = input.nitrogen !== null && input.nitrogen !== undefined;
  const hasP = input.phosphorus !== null && input.phosphorus !== undefined;
  const hasK = input.potassium !== null && input.potassium !== undefined;

  if (!hasN || !hasP || !hasK) {
    warnings.push('NPK nutrients are incomplete. Recommendation will rely primarily on soil texture and climate conditions.');
    tips.push('Tip: Soil Health Card NPK readings refine fertilizer advisory and prevent yield loss.');
  }

  // 4. Check Temperature anomalies
  if (input.temperature !== null && input.temperature !== undefined && !isNaN(Number(input.temperature))) {
    const t = Number(input.temperature);
    if (t > 44) {
      warnings.push(`Extreme thermal heat (${t}°C): pollen desiccation and sterility risk for most standard cultivars.`);
    } else if (t < 8) {
      warnings.push(`Cold weather (${t}°C): risk of frost injury or delayed germination for warm-season crops.`);
    }
  }

  // 5. Check Rainfall anomalies
  if (input.rainfall !== null && input.rainfall !== undefined && !isNaN(Number(input.rainfall))) {
    const r = Number(input.rainfall);
    if (r < 250 && !input.irrigationAvailable) {
      warnings.push(`Low rainfall (${r} mm) without assured irrigation: dryland millets or pulses are strongly recommended.`);
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm space-y-3">
      {/* Header & Completeness Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-agro-primary" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">Input Quality & Readiness</h4>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold text-slate-700">{completeness}% Complete</span>
        </div>
      </div>

      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            completeness >= 80 ? 'bg-emerald-500' : completeness >= 50 ? 'bg-amber-500' : 'bg-rose-500'
          }`}
          style={{ width: `${completeness}%` }}
        />
      </div>

      {/* Warnings & Suggestions */}
      {warnings.length > 0 && (
        <div className="space-y-1.5 pt-1">
          {warnings.map((w, idx) => (
            <div key={idx} className="flex items-start gap-1.5 text-xs text-amber-900 bg-amber-50/80 border border-amber-200/60 p-2 rounded-lg">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
              <span>{w}</span>
            </div>
          ))}
        </div>
      )}

      {tips.length > 0 && (
        <div className="space-y-1 pt-0.5">
          {tips.map((tip, idx) => (
            <div key={idx} className="flex items-start gap-1.5 text-[11px] text-blue-900 bg-blue-50/70 border border-blue-200/50 p-2 rounded-lg">
              <Info className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
              <span>{tip}</span>
            </div>
          ))}
        </div>
      )}

      {warnings.length === 0 && completeness >= 80 && (
        <div className="flex items-center gap-2 text-xs text-emerald-800 bg-emerald-50/80 p-2.5 rounded-lg border border-emerald-200/60 font-medium">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>All critical soil and climate parameters are balanced for high-confidence evaluation.</span>
        </div>
      )}
    </div>
  );
};

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, AlertTriangle, AlertCircle, Leaf, Loader2 } from "lucide-react";

interface Prediction {
  class: string;
  confidence: number;
  isHealthy: boolean;
}

interface PredictionResultsProps {
  prediction: Prediction | null;
  topPredictions: Prediction[];
  isLoading: boolean;
}

// Helper to format class names (e.g., "early_blight" -> "Early Blight")
const formatLabel = (label: string) => 
  label.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());

// Configuration helper to centralize status logic (colors, icons, messages)
const getStatusConfig = (isHealthy: boolean, confidence: number) => {
  if (isHealthy) {
    return {
      variant: "success",
      Icon: CheckCircle,
      iconColor: "text-plant-success",
      badgeClass: "text-plant-success-foreground bg-plant-success/10 border-plant-success/20",
      alertClass: "bg-plant-success/10 border-plant-success/20 text-plant-success-foreground",
      message: "✅ Great news! Your plant appears to be healthy. Continue with regular care and monitoring.",
    };
  }
  
  if (confidence > 0.8) {
    return {
      variant: "danger",
      Icon: AlertCircle,
      iconColor: "text-plant-danger",
      badgeClass: "text-plant-danger-foreground bg-plant-danger/10 border-plant-danger/20",
      alertClass: "bg-plant-danger/10 border-plant-danger/20 text-plant-danger-foreground",
      message: "⚠️ Disease detected. Consider consulting with an agricultural expert for treatment recommendations.",
    };
  }

  // Warning state (Unhealthy but low confidence)
  return {
    variant: "warning",
    Icon: AlertTriangle,
    iconColor: "text-plant-warning",
    badgeClass: "text-plant-warning-foreground bg-plant-warning/10 border-plant-warning/20",
    alertClass: "bg-plant-warning/10 border-plant-warning/20 text-plant-warning-foreground",
    message: "⚠️ Potential issue detected. Monitor closely or consult an expert.",
  };
};

export function PredictionResults({ prediction, topPredictions, isLoading }: PredictionResultsProps) {
  // 1. Loading State
  if (isLoading) {
    return (
      <Card className="bg-gradient-card shadow-card border-border/50 p-8">
        <div className="flex items-center justify-center space-x-3">
          <Loader2 className="h-8 w-8 animate-spin text-plant-primary" />
          <p className="text-foreground font-medium">Analyzing plant health...</p>
        </div>
      </Card>
    );
  }

  // 2. Empty State
  if (!prediction) return null;

  // 3. Prepare Data
  const status = getStatusConfig(prediction.isHealthy, prediction.confidence);
  const confidencePercent = (prediction.confidence * 100).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Main Prediction Card */}
      <Card className="bg-gradient-card shadow-card border-border/50 p-8">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <status.Icon className={`h-8 w-8 ${status.iconColor}`} />
          </div>
          
          <div className="flex-1 space-y-5">
            {/* Header Section */}
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-2">
                Diagnosis Results
              </h3>
              <div className="flex items-center space-x-3">
                <Badge variant="secondary" className={status.badgeClass}>
                  {formatLabel(prediction.class)}
                </Badge>
                <span className="text-sm text-muted-foreground font-medium">
                  {confidencePercent}% confidence
                </span>
              </div>
            </div>

            {/* Confidence Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Confidence Level</span>
                <span className="font-medium text-foreground">{confidencePercent}%</span>
              </div>
              <Progress 
                value={prediction.confidence * 100} 
                className="h-3 bg-secondary"
              />
            </div>

            {/* Status Message Box */}
            <div className={`rounded-lg p-4 border ${status.alertClass}`}>
              <p className="text-sm font-medium leading-relaxed">
                {status.message}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Alternative Predictions List */}
      <Card className="bg-gradient-card shadow-card border-border/50 p-6">
        <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Leaf className="h-5 w-5 mr-2 text-plant-primary" />
          Alternative Diagnoses
        </h4>
        <div className="space-y-3">
          {topPredictions.map((pred, index) => (
            <div 
              key={`${pred.class}-${index}`}
              className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border/30 hover:bg-secondary/50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-plant-primary/20 flex items-center justify-center">
                  <span className="text-xs font-bold text-plant-primary">{index + 1}</span>
                </div>
                <span className="text-sm font-medium text-foreground">
                  {formatLabel(pred.class)}
                </span>
              </div>
              <div className="text-right">
                <span className="text-sm font-mono text-muted-foreground">
                  {(pred.confidence * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
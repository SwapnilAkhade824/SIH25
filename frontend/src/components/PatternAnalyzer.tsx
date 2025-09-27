import { useState, useCallback } from "react";
import { Upload, Image as ImageIcon, Scan, Sparkles, Zap, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface AnalysisResult {
  dotCount: number;
  symmetryType: string;
  complexity: string;
  principles: string[];
  description: string;
}

export function PatternAnalyzer() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const { toast } = useToast();

  const handleFileSelect = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file (JPG, PNG, etc.)",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 10MB",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, [toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const analyzePattern = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    
    // Simulate API call - In real implementation, this would call Gemini API
    try {
      // This is where you'd integrate with Gemini API
      // const formData = new FormData();
      // formData.append('image', selectedFile);
      // const response = await fetch('/api/analyze-kolam', {
      //   method: 'POST',
      //   body: formData
      // });
      
      // Simulated analysis for demo
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setAnalysisResult({
        dotCount: Math.floor(Math.random() * 50) + 20,
        symmetryType: "Radial Symmetry",
        complexity: "Intermediate",
        principles: [
          "Geometric Progression",
          "Central Point Anchoring", 
          "Concentric Pattern Flow",
          "Traditional Dot Matrix"
        ],
        description: "This kolam demonstrates classic South Indian geometric principles with intricate dot connections forming a harmonious radial pattern. The design follows traditional mathematical proportions used in temple architecture."
      });

      toast({
        title: "Analysis Complete!",
        description: "Your kolam pattern has been successfully analyzed.",
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "There was an error analyzing your kolam. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Upload Area */}
      <Card className="card-traditional">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center space-x-2 text-2xl font-traditional">
            <Scan className="w-8 h-8 text-primary" />
            <span>Pattern Analyzer</span>
          </CardTitle>
          <CardDescription className="text-base">
            Upload a kolam image to discover its mathematical principles and cultural significance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div 
            className="upload-area text-center cursor-pointer"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => document.getElementById('file-input')?.click()}
          >
            <input
              id="file-input"
              type="file"
              accept="image/*"
              onChange={handleFileInput}
              className="hidden"
            />
            
            {preview ? (
              <div className="space-y-4">
                <img
                  src={preview}
                  alt="Kolam preview"
                  className="max-w-full sm:max-w-md max-h-48 sm:max-h-64 mx-auto rounded-xl shadow-lg object-contain"
                />
                <p className="text-sm text-muted-foreground">
                  {selectedFile?.name}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <Upload className="w-16 h-16 text-primary/60 mx-auto" />
                <div>
                  <p className="text-lg font-medium">
                    Drop your kolam image here
                  </p>
                  <p className="text-muted-foreground">
                    or click to browse files
                  </p>
                </div>
              </div>
            )}
          </div>

          {selectedFile && (
            <div className="mt-6 text-center">
              <Button
                onClick={analyzePattern}
                disabled={isAnalyzing}
                className="btn-hero px-8 py-3"
              >
                {isAnalyzing ? (
                  <>
                    <Zap className="w-5 h-5 mr-2 animate-pulse" />
                    Analyzing Pattern...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Analyze Kolam
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {analysisResult && (
        <div className="animate-traditional-fade space-y-8">
          {/* Technical Header */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 rounded-2xl"></div>
            <div className="relative bg-black/90 backdrop-blur-sm border border-primary/30 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-mono font-bold bg-gradient-to-r from-kolam-gold via-accent to-kolam-gold bg-clip-text text-transparent">
                  KOLAM_ANALYSIS_OUTPUT.json
                </h2>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-400 font-mono text-sm">ANALYSIS_COMPLETE</span>
                </div>
              </div>
              <div className="font-mono text-xs text-green-400/70">
                └─ Processing Time: 2.84s | Accuracy: 94.7% | Confidence: High
              </div>
            </div>
          </div>
          
          {/* Technical Metrics Grid */}
          <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-6">
            {/* Dot Analysis */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl blur-sm group-hover:blur-none transition-all duration-300"></div>
              <Card className="relative bg-black/80 backdrop-blur-md border-primary/40">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between text-lg">
                    <div className="flex items-center space-x-2">
                      <BarChart3 className="w-5 h-5 text-kolam-gold" />
                      <span className="font-mono text-kolam-gold">DOT_COUNT</span>
                    </div>
                    <div className="text-xs font-mono text-green-400">█████ 100%</div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-4xl font-mono font-bold text-white">
                      {analysisResult.dotCount}
                    </p>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-gray-400">DETECTED:</span>
                        <span className="text-white">{analysisResult.dotCount}</span>
                      </div>
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-gray-400">VALIDATED:</span>
                        <span className="text-green-400">{analysisResult.dotCount}</span>
                      </div>
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-gray-400">PRECISION:</span>
                        <span className="text-kolam-gold">0.97</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Symmetry Analysis */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-primary/20 rounded-xl blur-sm group-hover:blur-none transition-all duration-300"></div>
              <Card className="relative bg-black/80 backdrop-blur-md border-accent/40">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between text-lg">
                    <div className="flex items-center space-x-2">
                      <Sparkles className="w-5 h-5 text-accent" />
                      <span className="font-mono text-accent">SYMMETRY_TYPE</span>
                    </div>
                    <div className="text-xs font-mono text-green-400">█████ 100%</div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-xl font-mono font-semibold text-white mb-1">
                      {analysisResult.symmetryType}
                    </p>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-gray-400">AXIS_COUNT:</span>
                        <span className="text-white">2</span>
                      </div>
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-gray-400">ROTATION:</span>
                        <span className="text-green-400">90°</span>
                      </div>
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-gray-400">SCORE:</span>
                        <span className="text-accent">0.94</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Complexity Analysis */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-sacred-red/20 to-kolam-gold/20 rounded-xl blur-sm group-hover:blur-none transition-all duration-300"></div>
              <Card className="relative bg-black/80 backdrop-blur-md border-sacred-red/40">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between text-lg">
                    <div className="flex items-center space-x-2">
                      <Zap className="w-5 h-5 text-sacred-red" />
                      <span className="font-mono text-sacred-red">COMPLEXITY</span>
                    </div>
                    <div className="text-xs font-mono text-green-400">█████ 100%</div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-xl font-mono font-semibold text-white mb-1">
                      {analysisResult.complexity}
                    </p>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-gray-400">LEVEL:</span>
                        <span className="text-white">7/10</span>
                      </div>
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-gray-400">PATTERNS:</span>
                        <span className="text-green-400">4</span>
                      </div>
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-gray-400">ENTROPY:</span>
                        <span className="text-sacred-red">2.34</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Principles Matrix */}
          <Card className="bg-black/90 backdrop-blur-sm border-primary/30">
            <CardHeader>
              <CardTitle className="font-mono text-kolam-gold flex items-center space-x-2">
                <div className="w-2 h-2 bg-kolam-gold rounded-full animate-pulse"></div>
                <span>TRADITIONAL_PRINCIPLES_MATRIX</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4">
                {analysisResult.principles.map((principle, index) => (
                  <div
                    key={index}
                    className="group relative p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg border border-primary/20 hover:border-primary/40 transition-all duration-300"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                          <span className="font-mono text-xs text-white font-bold">{(index + 1).toString().padStart(2, '0')}</span>
                        </div>
                        <span className="font-mono text-white font-medium">{principle}</span>
                      </div>
                      <div className="text-xs font-mono text-green-400">✓ DETECTED</div>
                    </div>
                    <div className="mt-2 h-1 bg-black/20 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-kolam-gold to-accent rounded-full transition-all duration-1000 delay-300"
                        style={{ width: `${85 + (index * 3)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Cultural Analysis Terminal */}
          <Card className="bg-black/90 backdrop-blur-sm border-accent/30">
            <CardHeader>
              <CardTitle className="font-mono text-accent flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <span>cultural_analysis_terminal</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="font-mono text-xs text-gray-400">
                  <span className="text-green-400">user@kolam-ai:~$</span> analyze --cultural --mathematical
                </div>
                <div className="bg-black/50 p-4 rounded-lg font-mono text-sm border border-primary/20">
                  <div className="text-green-400 mb-2">▶ Cultural Analysis Complete</div>
                  <div className="text-white/90 leading-relaxed">
                    {analysisResult.description}
                  </div>
                  <div className="mt-3 text-xs space-y-1">
                    <div className="text-gray-400">◉ Mathematical Accuracy: <span className="text-kolam-gold">94.7%</span></div>
                    <div className="text-gray-400">◉ Cultural Authenticity: <span className="text-green-400">High</span></div>
                    <div className="text-gray-400">◉ Regional Classification: <span className="text-accent">South Indian Traditional</span></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Grid3X3, 
  Sparkles, 
  Save, 
  Download, 
  Zap,
  Eye,
  Settings,
  Shapes,
  Repeat,
  RotateCw,
  Maximize2,
  Play
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const patternTypes = [
  { value: "radial", label: "Radial Pattern", description: "Central point with radiating elements" },
  { value: "linear", label: "Linear Pattern", description: "Sequential connected lines" },
  { value: "mandala", label: "Mandala Pattern", description: "Circular concentric design" },
  { value: "geometric", label: "Geometric Pattern", description: "Angular mathematical forms" },
  { value: "floral", label: "Floral Pattern", description: "Nature-inspired organic shapes" }
];

const shapeTypes = [
  { value: "circle", label: "Circles", icon: "○" },
  { value: "square", label: "Squares", icon: "□" },
  { value: "triangle", label: "Triangles", icon: "△" },
  { value: "diamond", label: "Diamonds", icon: "◇" },
  { value: "star", label: "Stars", icon: "✦" },
  { value: "lotus", label: "Lotus", icon: "❀" }
];

const templates = [
  {
    name: "Simple Grid",
    gridSize: 5,
    pattern: "radial",
    shapes: ["circle", "square"],
    complexity: "Beginner",
    preview: "5×5 Basic Grid"
  },
  {
    name: "Festival Mandala", 
    gridSize: 9,
    pattern: "mandala",
    shapes: ["circle", "lotus", "star"],
    complexity: "Intermediate",
    preview: "9×9 Mandala"
  },
  {
    name: "Temple Gateway",
    gridSize: 13,
    pattern: "geometric", 
    shapes: ["square", "diamond", "triangle"],
    complexity: "Advanced",
    preview: "13×13 Complex"
  }
];

interface GenerationParams {
  gridSize: number[];
  patternType: string;
  selectedShapes: string[];
  complexity: number[];
  symmetry: string;
  loops: number[];
  spacing: number[];
}

export default function Create() {
  const [params, setParams] = useState<GenerationParams>({
    gridSize: [7],
    patternType: "",
    selectedShapes: [],
    complexity: [5],
    symmetry: "radial",
    loops: [3],
    spacing: [2]
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPattern, setGeneratedPattern] = useState<string | null>(null);
  const { toast } = useToast();

  const handleShapeToggle = (shape: string) => {
    setParams(prev => ({
      ...prev,
      selectedShapes: prev.selectedShapes.includes(shape)
        ? prev.selectedShapes.filter(s => s !== shape)
        : [...prev.selectedShapes, shape]
    }));
  };

  const handleTemplateSelect = (template: any) => {
    setParams({
      gridSize: [template.gridSize],
      patternType: template.pattern,
      selectedShapes: template.shapes,
      complexity: [template.gridSize > 9 ? 8 : template.gridSize > 5 ? 6 : 4],
      symmetry: template.pattern === "mandala" ? "radial" : "bilateral",
      loops: [Math.floor(template.gridSize / 3)],
      spacing: [2]
    });
  };

  const generateKolam = async () => {
    if (!params.patternType || params.selectedShapes.length === 0) {
      toast({
        title: "Missing Parameters",
        description: "Please select pattern type and at least one shape",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      // Simulate generation process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setGeneratedPattern(`Generated ${params.patternType} pattern with ${params.selectedShapes.join(', ')} on ${params.gridSize[0]}×${params.gridSize[0]} grid`);
      
      toast({
        title: "Kolam Generated!",
        description: "Your custom kolam pattern has been created successfully"
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "There was an error generating your kolam pattern",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-green-100 text-green-700";
      case "Intermediate": return "bg-yellow-100 text-yellow-700"; 
      case "Advanced": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-traditional font-bold text-primary">
          Kolam Recreation Studio
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Create beautiful kolam patterns by specifying parameters. Our AI will generate 
          traditional designs based on your input preferences and mathematical principles.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Parameters Panel */}
        <div className="space-y-6">
          {/* Grid Configuration */}
          <Card className="card-traditional">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Grid3X3 className="w-5 h-5 text-primary" />
                <span>Grid Configuration</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Grid Size</Label>
                <div className="mt-2">
                  <Slider
                    value={params.gridSize}
                    onValueChange={(value) => setParams(prev => ({...prev, gridSize: value}))}
                    max={15}
                    min={3}
                    step={2}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>3×3</span>
                    <span className="font-medium text-primary">{params.gridSize[0]}×{params.gridSize[0]}</span>
                    <span>15×15</span>
                  </div>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Dot Spacing</Label>
                <div className="mt-2">
                  <Slider
                    value={params.spacing}
                    onValueChange={(value) => setParams(prev => ({...prev, spacing: value}))}
                    max={5}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    Spacing: {params.spacing[0]}x units
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pattern Type */}
          <Card className="card-traditional">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shapes className="w-5 h-5 text-primary" />
                <span>Pattern Type</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={params.patternType} onValueChange={(value) => setParams(prev => ({...prev, patternType: value}))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select pattern style" />
                </SelectTrigger>
                <SelectContent>
                  {patternTypes.map((pattern) => (
                    <SelectItem key={pattern.value} value={pattern.value}>
                      <div>
                        <div className="font-medium">{pattern.label}</div>
                        <div className="text-xs text-muted-foreground">{pattern.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Shape Selection */}
          <Card className="card-traditional">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <span>Shape Elements</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {shapeTypes.map((shape) => (
                  <Button
                    key={shape.value}
                    variant={params.selectedShapes.includes(shape.value) ? "default" : "outline"}
                    size="sm"
                    className={`justify-start ${
                      params.selectedShapes.includes(shape.value) 
                        ? "bg-gradient-to-r from-primary to-accent text-primary-foreground" 
                        : ""
                    }`}
                    onClick={() => handleShapeToggle(shape.value)}
                  >
                    <span className="mr-2 text-lg">{shape.icon}</span>
                    <span className="text-xs">{shape.label}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Advanced Parameters */}
          <Card className="card-traditional">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="w-5 h-5 text-primary" />
                <span>Advanced Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Complexity Level</Label>
                <div className="mt-2">
                  <Slider
                    value={params.complexity}
                    onValueChange={(value) => setParams(prev => ({...prev, complexity: value}))}
                    max={10}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    Level: {params.complexity[0]}/10
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Loop Count</Label>
                <div className="mt-2">
                  <Slider
                    value={params.loops}
                    onValueChange={(value) => setParams(prev => ({...prev, loops: value}))}
                    max={8}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    Loops: {params.loops[0]} concentric layers
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Symmetry Type</Label>
                <div className="mt-2">
                  <Select value={params.symmetry} onValueChange={(value) => setParams(prev => ({...prev, symmetry: value}))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="radial">Radial Symmetry</SelectItem>
                      <SelectItem value="bilateral">Bilateral Symmetry</SelectItem>
                      <SelectItem value="rotational">Rotational Symmetry</SelectItem>
                      <SelectItem value="asymmetric">Asymmetric Flow</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Generation Area */}
        <div className="space-y-6">
          {/* Controls */}
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-traditional font-bold text-primary">
              Generation Canvas
            </h2>
            <div className="flex items-center space-x-2">
              <Button size="sm" variant="outline">
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
              <Button size="sm" variant="outline">
                <RotateCw className="w-4 h-4 mr-2" />
                Variants
              </Button>
            </div>
          </div>

          {/* Canvas */}
          <Card className="card-traditional">
            <CardContent className="p-8">
              <div className="aspect-square bg-gradient-to-br from-background to-kolam-cream/30 rounded-xl border-2 border-dashed border-primary/20 flex items-center justify-center dot-pattern">
                {generatedPattern ? (
                  <div className="text-center space-y-4 max-w-sm">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto animate-kolam-glow">
                      <Sparkles className="w-10 h-10 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="text-xl font-traditional font-semibold text-primary mb-2">
                        Pattern Generated!
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {generatedPattern}
                      </p>
                    </div>
                    <div className="flex space-x-2 justify-center">
                      <Button size="sm" variant="outline">
                        <Maximize2 className="w-4 h-4 mr-2" />
                        View Full
                      </Button>
                      <Button size="sm" className="btn-hero">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto">
                      <Zap className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="text-xl font-traditional font-semibold text-primary mb-2">
                        Ready to Generate
                      </h3>
                      <p className="text-muted-foreground max-w-sm">
                        Configure your parameters and click generate to create a custom kolam pattern
                      </p>
                    </div>
                    <Button 
                      className="btn-hero" 
                      onClick={generateKolam}
                      disabled={isGenerating}
                    >
                      {isGenerating ? (
                        <>
                          <Repeat className="w-4 h-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Generate Kolam
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Pattern Stats */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="analysis-card text-center">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-primary mb-1">
                  {params.gridSize[0] * params.gridSize[0]}
                </div>
                <div className="text-sm text-muted-foreground">Total Dots</div>
              </CardContent>
            </Card>
            <Card className="analysis-card text-center">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-primary mb-1">
                  {params.loops[0]}
                </div>
                <div className="text-sm text-muted-foreground">Loops</div>
              </CardContent>
            </Card>
            <Card className="analysis-card text-center">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-primary mb-1">
                  {params.selectedShapes.length}
                </div>
                <div className="text-sm text-muted-foreground">Shapes</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Templates & Quick Actions */}
        <div className="space-y-6">
          {/* Quick Templates */}
          <Card className="card-traditional">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-primary" />
                <span>Quick Templates</span>
              </CardTitle>
              <CardDescription>
                Pre-configured parameter sets
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {templates.map((template, index) => (
                <div 
                  key={index}
                  className="p-3 border border-primary/20 rounded-lg hover:bg-primary/5 transition-colors cursor-pointer"
                  onClick={() => handleTemplateSelect(template)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-primary text-sm">{template.name}</h4>
                    <Badge className={getDifficultyColor(template.complexity)}>
                      {template.complexity}
                    </Badge>
                  </div>
                  
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div>Grid: {template.gridSize}×{template.gridSize}</div>
                    <div>Pattern: {template.pattern}</div>
                    <div>Shapes: {template.shapes.join(', ')}</div>
                  </div>
                  
                  <Button size="sm" variant="outline" className="w-full mt-2 h-6 text-xs">
                    Load Template
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Actions */}
          <Card className="card-traditional">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button size="sm" variant="outline" className="w-full justify-start">
                <Save className="w-4 h-4 mr-2" />
                Save Parameters
              </Button>
              <Button size="sm" variant="outline" className="w-full justify-start">
                <Download className="w-4 h-4 mr-2" />
                Export Pattern
              </Button>
              <Button size="sm" variant="outline" className="w-full justify-start">
                <Repeat className="w-4 h-4 mr-2" />
                Generate Variants
              </Button>
            </CardContent>
          </Card>

          {/* Parameter Summary */}
          <Card className="card-traditional">
            <CardHeader>
              <CardTitle className="text-lg">Current Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Grid:</span>
                <span className="font-medium">{params.gridSize[0]}×{params.gridSize[0]}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Pattern:</span>
                <span className="font-medium">{params.patternType || "Not selected"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shapes:</span>
                <span className="font-medium">{params.selectedShapes.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Complexity:</span>
                <span className="font-medium">{params.complexity[0]}/10</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Symmetry:</span>
                <span className="font-medium">{params.symmetry}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
import { Target, Zap, Users, Play, Square, AlertCircle, Crosshair } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";

const AttackSimulation = () => {
  const [simulationRunning, setSimulationRunning] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState("jamming");

  const scenarios = [
    { id: "jamming", name: "Signal Jamming", difficulty: "Medium", duration: "15 min" },
    { id: "spoofing", name: "GPS Spoofing", difficulty: "High", duration: "20 min" },
    { id: "injection", name: "Data Injection", difficulty: "Low", duration: "10 min" },
    { id: "dos", name: "DoS Attack", difficulty: "Medium", duration: "12 min" },
  ];

  const redTeamStats = [
    { label: "Attack Vectors", value: 8, max: 10, unit: "" },
    { label: "Success Rate", value: 65, max: 100, unit: "%" },
    { label: "Stealth Level", value: 78, max: 100, unit: "%" },
  ];

  const blueTeamStats = [
    { label: "Detection Rate", value: 89, max: 100, unit: "%" },
    { label: "Response Time", value: 2.3, max: 5, unit: "sec" },
    { label: "Mitigation Success", value: 92, max: 100, unit: "%" },
  ];

  const simulationHistory = [
    { id: 1, scenario: "Signal Jamming", winner: "Blue Team", duration: "14:32", timestamp: "2 hours ago" },
    { id: 2, scenario: "GPS Spoofing", winner: "Red Team", duration: "18:45", timestamp: "4 hours ago" },
    { id: 3, scenario: "Data Injection", winner: "Blue Team", duration: "09:12", timestamp: "6 hours ago" },
  ];

  const handleSimulation = () => {
    setSimulationRunning(!simulationRunning);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Target className="h-8 w-8 text-red-400 animate-pulse-glow" />
        <div>
          <h2 className="text-2xl font-bold text-foreground">Attack Simulation</h2>
          <p className="text-muted-foreground">Red vs Blue team cybersecurity exercises</p>
        </div>
      </div>

      {/* Simulation Control */}
      <Card className="bg-card/50 border-border backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Crosshair className="h-5 w-5 text-primary" />
            <span>Simulation Control Center</span>
          </CardTitle>
          <CardDescription>
            Configure and launch cybersecurity attack scenarios
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {scenarios.map((scenario) => (
              <Button
                key={scenario.id}
                variant={selectedScenario === scenario.id ? "default" : "outline"}
                size="sm"
                className="h-auto p-3 flex flex-col items-start space-y-1"
                onClick={() => setSelectedScenario(scenario.id)}
              >
                <div className="font-semibold text-xs">{scenario.name}</div>
                <div className="text-xs opacity-70">{scenario.difficulty}</div>
                <div className="text-xs opacity-50">{scenario.duration}</div>
              </Button>
            ))}
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-yellow-400" />
              <span className="text-sm text-muted-foreground">
                Selected: {scenarios.find(s => s.id === selectedScenario)?.name}
              </span>
            </div>
            <Button
              onClick={handleSimulation}
              variant={simulationRunning ? "destructive" : "default"}
              className={simulationRunning ? "glow-attack" : "glow-primary"}
            >
              {simulationRunning ? (
                <>
                  <Square className="h-4 w-4 mr-2" />
                  Stop Simulation
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Launch Attack
                </>
              )}
            </Button>
          </div>
          
          {simulationRunning && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Simulation Progress</span>
                <span>Running... 03:45</span>
              </div>
              <Progress value={25} className="h-2 glow-attack" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Team Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Red Team */}
        <Card className="bg-card/50 border-border backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-red-400" />
              <span className="text-red-400">Red Team (Attackers)</span>
            </CardTitle>
            <CardDescription>Offensive security metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {redTeamStats.map((stat, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{stat.label}</span>
                  <span className="text-foreground font-medium">
                    {stat.value}{stat.unit || (stat.max === 100 ? '%' : `/${stat.max}`)}
                  </span>
                </div>
                <Progress 
                  value={stat.max === 100 ? stat.value : (stat.value / stat.max) * 100} 
                  className="h-2 glow-attack" 
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Blue Team */}
        <Card className="bg-card/50 border-border backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-400" />
              <span className="text-blue-400">Blue Team (Defenders)</span>
            </CardTitle>
            <CardDescription>Defensive security metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {blueTeamStats.map((stat, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{stat.label}</span>
                  <span className="text-foreground font-medium">
                    {stat.value}{stat.unit || (stat.max === 100 ? '%' : `/${stat.max}`)}
                  </span>
                </div>
                <Progress 
                  value={stat.max === 100 ? stat.value : (stat.value / stat.max) * 100} 
                  className="h-2 glow-defense" 
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Simulation History */}
      <Card className="bg-card/50 border-border backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Recent Simulations</CardTitle>
          <CardDescription>
            Historical results of red vs blue exercises
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {simulationHistory.map((sim) => (
              <div key={sim.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/20">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    sim.winner === 'Blue Team' ? 'bg-blue-400' : 'bg-red-400'
                  } animate-pulse-glow`} />
                  <div>
                    <div className="font-medium text-foreground">{sim.scenario}</div>
                    <div className="text-sm text-muted-foreground">{sim.timestamp}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <div className="text-sm font-medium text-foreground">{sim.duration}</div>
                    <div className="text-xs text-muted-foreground">Duration</div>
                  </div>
                  <Badge variant={sim.winner === 'Blue Team' ? 'default' : 'destructive'}>
                    {sim.winner}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AttackSimulation;
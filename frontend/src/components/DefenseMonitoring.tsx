import { Shield, Activity, Cpu, Satellite, AlertTriangle, CheckCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const DefenseMonitoring = () => {
  const threats = [
    { id: 1, type: "Signal Jamming", severity: "high", status: "blocked", source: "Unknown" },
    { id: 2, type: "Data Injection", severity: "medium", status: "monitoring", source: "Earth Station 3" },
    { id: 3, type: "Spoofing Attempt", severity: "low", status: "resolved", source: "Sector 7" },
  ];

  const satellites = [
    { name: "ARYA-SAT-01", status: "secure", signal: 98, location: "LEO-A1" },
    { name: "ARYA-SAT-02", status: "monitoring", signal: 87, location: "GEO-B2" },
    { name: "ARYA-SAT-03", status: "secure", signal: 95, location: "LEO-C3" },
  ];

  const metrics = [
    { label: "System Integrity", value: 96, color: "defense" },
    { label: "Threat Detection", value: 89, color: "primary" },
    { label: "Network Security", value: 92, color: "defense" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Shield className="h-8 w-8 text-green-400 animate-pulse-glow" />
        <div>
          <h2 className="text-2xl font-bold text-foreground">Defense Monitoring</h2>
          <p className="text-muted-foreground">Real-time satellite security status</p>
        </div>
      </div>

      {/* Security Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {metrics.map((metric, index) => (
          <Card key={index} className="bg-card/50 border-border backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-foreground">{metric.value}%</div>
                <Progress 
                  value={metric.value} 
                  className={`h-2 ${
                    metric.color === 'defense' ? 'glow-defense' : 'glow-primary'
                  }`}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Satellite Status */}
      <Card className="bg-card/50 border-border backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Satellite className="h-5 w-5 text-primary" />
            <span>Satellite Fleet Status</span>
          </CardTitle>
          <CardDescription>
            Current status of all monitored satellites
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {satellites.map((sat, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    sat.status === 'secure' ? 'bg-green-400 animate-pulse-glow' : 
                    sat.status === 'monitoring' ? 'bg-yellow-400 animate-pulse-glow' : 
                    'bg-red-400 animate-pulse-glow'
                  }`} />
                  <div>
                    <div className="font-semibold text-foreground">{sat.name}</div>
                    <div className="text-sm text-muted-foreground">{sat.location}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-sm font-medium text-foreground">{sat.signal}%</div>
                    <div className="text-xs text-muted-foreground">Signal</div>
                  </div>
                  <Badge variant={
                    sat.status === 'secure' ? 'default' : 
                    sat.status === 'monitoring' ? 'secondary' : 
                    'destructive'
                  }>
                    {sat.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Threat Detection */}
      <Card className="bg-card/50 border-border backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-yellow-400" />
            <span>Active Threat Detection</span>
          </CardTitle>
          <CardDescription>
            AI-powered anomaly detection results
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {threats.map((threat) => (
              <div key={threat.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/20">
                <div className="flex items-center space-x-3">
                  {threat.status === 'blocked' ? (
                    <CheckCircle className="h-4 w-4 text-green-400" />
                  ) : threat.status === 'monitoring' ? (
                    <Activity className="h-4 w-4 text-yellow-400 animate-pulse" />
                  ) : (
                    <CheckCircle className="h-4 w-4 text-blue-400" />
                  )}
                  <div>
                    <div className="font-medium text-foreground">{threat.type}</div>
                    <div className="text-sm text-muted-foreground">Source: {threat.source}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={
                    threat.severity === 'high' ? 'destructive' : 
                    threat.severity === 'medium' ? 'secondary' : 
                    'outline'
                  }>
                    {threat.severity}
                  </Badge>
                  <Badge variant={
                    threat.status === 'blocked' ? 'default' : 
                    threat.status === 'monitoring' ? 'secondary' : 
                    'outline'
                  }>
                    {threat.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Status */}
      <Card className="bg-card/50 border-border backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Cpu className="h-5 w-5 text-primary animate-pulse-glow" />
            <span>AI Defense Engine</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">ACTIVE</div>
              <div className="text-sm text-muted-foreground">Neural Network Status</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">24/7</div>
              <div className="text-sm text-muted-foreground">Monitoring Duration</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DefenseMonitoring;
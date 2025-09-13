import { Rocket, Shield, Target, Activity } from "lucide-react";
import { Card } from "@/components/ui/card";

const Header = () => {
  return (
    <header className="w-full bg-gradient-cosmic border-b border-border/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Rocket className="h-10 w-10 text-primary animate-pulse-glow" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                AryaShakti
              </h1>
              <p className="text-sm text-muted-foreground font-mono">
                Space Cybersecurity Command Center
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Card className="bg-card/30 border-border/50 backdrop-blur-sm px-4 py-2">
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-green-400" />
                  <span className="text-muted-foreground">Defense:</span>
                  <span className="text-green-400 font-mono font-semibold">ACTIVE</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Target className="h-4 w-4 text-red-400" />
                  <span className="text-muted-foreground">Simulation:</span>
                  <span className="text-red-400 font-mono font-semibold">READY</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Activity className="h-4 w-4 text-primary animate-pulse" />
                  <span className="text-muted-foreground">AI Engine:</span>
                  <span className="text-primary font-mono font-semibold">MONITORING</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
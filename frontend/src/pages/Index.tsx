import Header from "@/components/Header";
import DefenseMonitoring from "@/components/DefenseMonitoring";
import AttackSimulation from "@/components/AttackSimulation";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-cosmic">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Defense Monitoring Section */}
          <section className="space-y-6">
            <DefenseMonitoring />
          </section>
          
          {/* Attack Simulation Section */}
          <section className="space-y-6">
            <AttackSimulation />
          </section>
        </div>
        
        {/* Footer */}
        <footer className="mt-12 py-6 border-t border-border/30">
          <div className="text-center text-muted-foreground text-sm font-mono">
            AryaShakti v2.0 | Space Cybersecurity Platform | AI-Powered Defense System
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Index;

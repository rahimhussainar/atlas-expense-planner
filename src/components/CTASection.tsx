import React from 'react';
import { ArrowRight, Sparkles, Users, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const CTASection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="w-full py-16 md:py-24 px-6 md:px-8 lg:px-12 bg-gradient-to-br from-primary/10 via-primary/5 to-background relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-atlas-forest/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-atlas-rust/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-atlas-gold/10 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      {/* Floating icons */}
      <div className="absolute top-10 left-10 animate-float">
        <MapPin className="w-8 h-8 text-atlas-rust/30" />
      </div>
      <div className="absolute bottom-10 right-10 animate-float delay-1000">
        <Users className="w-8 h-8 text-atlas-forest/30" />
      </div>
      <div className="absolute top-20 right-20 animate-float delay-2000">
        <Sparkles className="w-6 h-6 text-atlas-gold/30" />
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div className="space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-card/80 backdrop-blur rounded-full border border-primary/20 shadow-lg">
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-sm font-medium text-primary">Start Your Journey Today</span>
          </div>

          {/* Main heading */}
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold">
              <span className="bg-gradient-to-r from-atlas-forest via-atlas-rust to-atlas-gold bg-clip-text text-transparent">
                Ready to simplify
              </span>
              <br />
              <span className="text-foreground">your group travel?</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join thousands of travelers who've made their trips stress-free with Trip Atlas. 
              No credit card required.
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              onClick={() => navigate('/auth')}
              size="lg"
              className="group bg-gradient-to-r from-atlas-forest to-atlas-forest/90 hover:from-atlas-forest/90 hover:to-atlas-forest/80 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-0.5 px-8"
            >
              Get Started Free
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-2 hover:bg-primary/5 transition-all duration-300 px-8"
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Explore Features
            </Button>
          </div>

          {/* Social proof */}
          <div className="pt-8">
            <div className="flex items-center justify-center gap-8 flex-wrap">
              <div className="flex -space-x-2">
                {['A', 'B', 'C', 'D', 'E'].map((letter, i) => (
                  <div 
                    key={i} 
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-atlas-rust via-atlas-forest to-atlas-gold flex items-center justify-center text-white text-sm font-semibold border-2 border-background"
                  >
                    {letter}
                  </div>
                ))}
                <div className="w-10 h-10 rounded-full bg-card flex items-center justify-center text-sm font-semibold border-2 border-border">
                  +1k
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">1,000+ travelers</span> started their journey this month
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection; 
import React from 'react';
import { Star, Quote } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  content: string;
  tripType: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "Adventure Traveler",
    avatar: "SC",
    rating: 5,
    content: "Trip Atlas made our 3-week Europe trip so much easier to manage. No more spreadsheets or awkward money conversations!",
    tripType: "Europe Backpacking"
  },
  {
    id: 2,
    name: "Michael Rodriguez",
    role: "Family Vacation Planner",
    avatar: "MR",
    rating: 5,
    content: "Finally, a simple way to track expenses for our family reunions. Everyone can see what they owe in real-time.",
    tripType: "Family Reunion"
  },
  {
    id: 3,
    name: "Emma Wilson",
    role: "Digital Nomad",
    avatar: "EW",
    rating: 5,
    content: "As someone who travels with different groups, Trip Atlas is a lifesaver. The multi-currency support is fantastic!",
    tripType: "Work & Travel"
  },
  {
    id: 4,
    name: "James Park",
    role: "Weekend Explorer",
    avatar: "JP",
    rating: 5,
    content: "The activity voting feature is genius! It helps our group decide what to do without endless group chat debates.",
    tripType: "Weekend Getaways"
  },
  {
    id: 5,
    name: "Lisa Thompson",
    role: "Group Trip Organizer",
    avatar: "LT",
    rating: 5,
    content: "I've organized 10+ group trips with Trip Atlas. The expense splitting and settlement features save hours of work.",
    tripType: "Friends Trips"
  },
  {
    id: 6,
    name: "David Kim",
    role: "Budget Traveler",
    avatar: "DK",
    rating: 5,
    content: "Love the budget tracking features! Helps me stay on track and split costs fairly with travel buddies.",
    tripType: "Budget Adventures"
  }
];

const TestimonialsSection: React.FC = () => {
  return (
    <section className="w-full py-16 md:py-24 px-6 md:px-8 lg:px-12 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-atlas-gold/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-atlas-forest/10 rounded-full blur-3xl" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
            <Star className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">What Travelers Say</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
            Loved by travelers worldwide
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Join thousands of happy travelers who've simplified their group trips with Trip Atlas
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="group bg-card p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-border relative overflow-hidden hover:-translate-y-1"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Quote icon */}
              <Quote className="absolute top-4 right-4 w-8 h-8 text-primary/10 group-hover:text-primary/20 transition-colors duration-300" />
              
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-atlas-rust to-atlas-gold flex items-center justify-center text-white font-semibold">
                  {testimonial.avatar}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
              
              <div className="flex gap-1 mb-3">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-atlas-gold text-atlas-gold" />
                ))}
              </div>
              
              <p className="text-muted-foreground mb-4 leading-relaxed">"{testimonial.content}"</p>
              
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full">
                <span className="text-xs font-medium text-primary">{testimonial.tripType}</span>
              </div>
            </div>
          ))}
        </div>
        
        {/* Trust badges */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-8 flex-wrap justify-center">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-atlas-gold text-atlas-gold" />
                ))}
              </div>
              <span className="text-sm font-medium text-muted-foreground">4.9/5 average rating</span>
            </div>
            <div className="text-sm font-medium text-muted-foreground">
              <span className="text-2xl font-bold text-foreground">10,000+</span> trips organized
            </div>
            <div className="text-sm font-medium text-muted-foreground">
              <span className="text-2xl font-bold text-foreground">50+</span> countries
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection; 
import React from 'react';
import { Star } from 'lucide-react';

const Testimonials: React.FC = () => {
  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Travel Enthusiast',
      content: 'Trip Atlas transformed how my friends and I plan trips. No more spreadsheets or awkward money conversations!',
      rating: 5,
      image: 'SC',
    },
    {
      name: 'Michael Torres',
      role: 'Digital Nomad',
      content: 'The expense splitting feature alone is worth it. Finally, a tool that handles multiple currencies seamlessly.',
      rating: 5,
      image: 'MT',
    },
    {
      name: 'Emma Williams',
      role: 'Adventure Seeker',
      content: 'Love the voting feature! It makes group decisions so much easier and everyone feels heard.',
      rating: 5,
      image: 'EW',
    },
  ];

  return (
    <section className="relative py-24 px-4 md:px-6 lg:px-8 bg-white dark:bg-[#1a1b1f]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
            Loved by travelers worldwide
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Join thousands who've simplified their group travel experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="relative p-8 rounded-2xl bg-gray-50 dark:bg-white/[0.02] backdrop-blur-sm border border-gray-200 dark:border-white/10 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#4a6c6f] text-[#4a6c6f]" />
                ))}
              </div>
              
              <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed italic">
                "{testimonial.content}"
              </p>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#4a6c6f] flex items-center justify-center text-white font-semibold text-sm">
                  {testimonial.image}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials; 
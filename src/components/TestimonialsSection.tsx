
import React from 'react';

const testimonials = [
  {
    quote: "Trip Atlas made our group vacation so much easier. No more awkward conversations about who owes what!",
    author: "Sarah J.",
    role: "Group Trip Organizer"
  },
  {
    quote: "This app simplified expense tracking for our family reunion. The activity planning feature was especially helpful.",
    author: "Michael T.",
    role: "Family Traveler"
  },
  {
    quote: "Perfect for our backpacking trip across Europe. We could all see expenses in real-time and settle up easily.",
    author: "Elena K.",
    role: "Frequent Traveler"
  }
];

const TestimonialsSection: React.FC = () => {
  return (
    <div className="w-full py-16 md:py-24 px-6 md:px-8 lg:px-12 bg-gradient-to-b from-white to-atlas-blue/10">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            What travelers are saying
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of happy travelers who use Trip Atlas
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col"
            >
              <div className="flex-1">
                <div className="text-atlas-blue-dark text-4xl font-serif mb-4">"</div>
                <p className="text-gray-700 italic mb-6">{testimonial.quote}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900">{testimonial.author}</p>
                <p className="text-gray-500 text-sm">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestimonialsSection;

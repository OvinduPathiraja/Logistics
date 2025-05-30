import React from 'react';
import { Star } from 'lucide-react';

const testimonials = [
  {
    quote: "XYZ Logistics has transformed our supply chain operations. Their reliable service and real-time tracking capabilities have significantly improved our delivery times and customer satisfaction.",
    author: "Sarah Johnson",
    position: "Supply Chain Director, TechInnovate",
    rating: 5
  },
  {
    quote: "We've been working with XYZ Logistics for over 5 years, and they consistently deliver exceptional service. Their team is responsive, professional, and always goes the extra mile to meet our needs.",
    author: "Michael Chen",
    position: "Operations Manager, Global Retail",
    rating: 5
  },
  {
    quote: "The dashboard system has made tracking our shipments so much easier. We can now monitor all our logistics operations in real-time, which has improved our decision-making process.",
    author: "Emma Rodriguez",
    position: "Logistics Coordinator, FreshFoods Inc.",
    rating: 4
  }
];

const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Our Clients Say</h2>
          <p className="max-w-2xl mx-auto text-gray-600 text-lg">
            Don't just take our word for it. Here's what our clients have to say about our logistics services.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-gray-50 p-8 rounded-lg shadow-sm border border-gray-100 flex flex-col h-full"
            >
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
                {[...Array(5 - testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-gray-300" />
                ))}
              </div>
              <blockquote className="text-gray-600 italic mb-6 flex-grow">"{testimonial.quote}"</blockquote>
              <div>
                <p className="font-semibold text-gray-900">{testimonial.author}</p>
                <p className="text-gray-500 text-sm">{testimonial.position}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div 
          id="contact"
          className="mt-20 bg-blue-600 rounded-lg shadow-md overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-8 lg:p-12">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Ready to Optimize Your Logistics?</h3>
              <p className="text-blue-100 mb-8">
                Contact us today to discuss how our logistics solutions can help streamline your operations,
                reduce costs, and improve customer satisfaction.
              </p>
              <form className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-white mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="w-full px-4 py-2 border border-blue-400 rounded-md bg-blue-500 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-white mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-4 py-2 border border-blue-400 rounded-md bg-blue-500 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white"
                      placeholder="Your email"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-white mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    className="w-full px-4 py-2 border border-blue-400 rounded-md bg-blue-500 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white"
                    placeholder="How can we help you?"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 bg-white text-blue-600 font-medium rounded-md hover:bg-blue-50 transition duration-300"
                >
                  Send Message
                </button>
              </form>
            </div>
            <div className="hidden lg:block relative">
              <img
                src="https://images.pexels.com/photos/4506112/pexels-photo-4506112.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                alt="Contact us"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
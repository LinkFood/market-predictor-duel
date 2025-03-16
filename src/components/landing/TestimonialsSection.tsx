
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface Testimonial {
  name: string;
  role: string;
  quote: string;
  avatar: string;
}

const testimonials: Testimonial[] = [
  {
    name: "Alex Thompson",
    role: "Retail Investor",
    quote: "StockDuel has completely changed how I think about market movements. Competing against the AI has sharpened my analysis skills.",
    avatar: "AT"
  },
  {
    name: "Sarah Chen",
    role: "Finance Student",
    quote: "I use StockDuel to test theories I learn in class. It's like having a trading simulator with AI feedback built in!",
    avatar: "SC"
  },
  {
    name: "Michael Rodriguez",
    role: "Day Trader",
    quote: "The immediate feedback on my predictions helps me identify my biases. I've become much more disciplined in my approach.",
    avatar: "MR"
  }
];

const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-16 bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Join thousands of users already improving their market prediction skills
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-0 shadow-md">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-800 dark:text-indigo-300 font-semibold mr-3">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-slate-700 dark:text-slate-300 italic">"{testimonial.quote}"</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;

import React from "react";
import { ArrowRight, Calendar, User, Clock } from "lucide-react";
import { motion } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export const Insights = () => {
  const articles = [
    {
      title: "How to Verify Land Titles in Nigeria",
      excerpt: "The ultimate guide to ensuring your property purchase is legally sound and free from disputes.",
      category: "Legal & Documentation",
      date: "Mar 8, 2026",
      readTime: "8 min read",
      image: "https://images.unsplash.com/photo-1742094561255-18506fba7a48?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBsYXd5ZXIlMjBzdXJ2ZXlvciUyMGFyY2hpdGVjdCUyMHdvcmtpbmclMjBhdCUyMGRlc2t8ZW58MXx8fHwxNzcyOTg2NDA5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      title: "Buying Your First Home in Nigeria: Step by Step",
      excerpt: "Everything you need to know about financing, inspections, and closing the deal on your first home.",
      category: "Home Buying",
      date: "Mar 5, 2026",
      readTime: "12 min read",
      image: "https://images.unsplash.com/photo-1652878530627-cc6f063e3947?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWFkaW5nJTIwYmxvZyUyMHBvc3QlMjByZWFsJTIwZXN0YXRlJTIwbWFya2V0JTIwbmV3cyUyMHRhYmxldHxlbnwxfHx8fDE3NzI5ODY0MTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      title: "Best Areas to Invest in Lagos for 2026",
      excerpt: "Analyzing growth trends, infrastructure projects, and rental yields across the megacity.",
      category: "Investment Tips",
      date: "Mar 1, 2026",
      readTime: "10 min read",
      image: "https://images.unsplash.com/photo-1744907895363-d351aa6019ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYWdvcyUyMG5pZ2VyaWAlMjBjaXR5JTIwc2t5bGluZSUyMHN1bnNldCUyMG1vZGVybiUyMGFyY2hpdGVjdHVyZXxlbnwxfHx8fDE3NzI5ODY0MTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
  ];

  return (
    <section className="py-24 bg-slate-50 relative">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
              Real Estate <span className="text-primary italic">Insights</span>
            </h2>
            <p className="text-slate-500 text-lg leading-relaxed">
              Stay ahead of the market with expert analysis, guides, and news 
              about the Nigerian real estate landscape.
            </p>
          </div>
          <button className="flex items-center gap-2 text-primary font-bold group">
            View All Articles
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article, idx) => (
            <motion.article
              key={article.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group bg-white rounded-[32px] overflow-hidden border border-slate-100 hover:shadow-2xl hover:shadow-slate-200/50 transition-all hover:-translate-y-2"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <ImageWithFallback
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold text-primary uppercase tracking-wide shadow-sm border border-slate-100">
                    {article.category}
                  </span>
                </div>
              </div>

              <div className="p-8">
                <div className="flex items-center gap-6 text-slate-400 text-sm mb-6 font-medium">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {article.date}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {article.readTime}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-primary transition-colors leading-tight">
                  {article.title}
                </h3>
                <p className="text-slate-500 leading-relaxed mb-8 line-clamp-2 text-sm font-medium">
                  {article.excerpt}
                </p>

                <button className="flex items-center gap-2 text-primary font-bold text-sm group/btn">
                  Read Article
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

import { ArrowLeft, Target, Zap, Brain, TrendingUp, ShoppingCart, Users, Youtube, Sparkles, FileText, Shield, Rocket, CheckCircle } from 'lucide-react';
import './About.css';

const About = ({ onBack }) => {
  const problems = [
    { icon: Shield, title: 'The Cost Barrier', desc: 'Elite growth teams and specialized agencies drain your runway.' },
    { icon: Brain, title: 'The AI Overwhelm', desc: 'The AI landscape is noisy. Founders waste hours trying to piece together fragmented tools instead of actually using them to drive revenue.' },
    { icon: Target, title: 'Blind Spots in Growth', desc: "Without the bandwidth for deep market, competitor, and internal analysis, companies miss hidden gaps in their customer funnels, brand positioning, and core value propositions." },
    { icon: Zap, title: 'The Execution Bottleneck', desc: 'Even when a strategy is clear, executing complex operational, sales, and marketing tasks delays momentum and burns out small teams.' },
  ];

  const pillars = [
    { icon: TrendingUp, title: 'Lead Generation', desc: 'Marketing, SEO, and Social.' },
    { icon: Users, title: 'Sales & Retention', desc: 'Calling, Support, and Account Expansion.' },
    { icon: Brain, title: 'Business Strategy', desc: 'Market Intelligence and Organizational Design.' },
    { icon: Zap, title: 'Save Time', desc: 'Automation Workflows, Operations, Finance, and Admin.' },
  ];

  const products = [
    { icon: ShoppingCart, title: 'Ecom Listing SEO', desc: 'Optimize your listings and drive a 30-40% improvement in revenue.' },
    { icon: Target, title: 'Learn from Competitors', desc: 'Reverse-engineer and deploy the best growth hacks in your industry.' },
    { icon: Users, title: 'B2B Lead Gen', desc: 'Scrape and secure hot, high-intent leads from platforms like Reddit and LinkedIn.' },
    { icon: Youtube, title: 'YouTube Helper', desc: 'End-to-end video strategy, including script writing, thumbnail generation, and keyword analysis.' },
    { icon: Sparkles, title: 'AI Team Professionals', desc: 'Deploy specialized AI agents for Marketing, Ops, HR, and more.' },
    { icon: FileText, title: 'Content Creator', desc: 'Dominate SEO, Instagram, Blogs, and LinkedIn with high-converting, automated content.' },
  ];

  return (
    <div className="about-page">
      <div className="about-header-bar">
        <button className="about-back-btn" onClick={onBack}>
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>
      </div>

      <div className="about-content">
        {/* Hero Section */}
        <section className="about-hero">
          <div className="about-hero-badge">About Ikshan</div>
          <h1 className="about-hero-title">
            Elite Growth Strategy & Execution
            <span className="about-highlight">&mdash;Unlocked by AI.</span>
          </h1>
          <p className="about-hero-desc">
            Most small businesses and startups leave money on the table every single day. Not because they lack vision, but because hiring elite, full-time growth experts or agencies is financially out of reach. At the same time, founders know they need AI to scale, but figuring out how to practically integrate it across their operations is confusing and time-consuming.
          </p>
          <p className="about-hero-desc">
            Ikshan was built to change that. We believe that world-class business growth shouldn't be a luxury reserved for massive enterprises. We are bridging the gap between high-level strategy and everyday execution by giving you on-demand AI growth expertise that diagnoses your business gaps, ships the perfect strategy, and provides the DIY tools to execute it.
          </p>
        </section>

        {/* Problem Section */}
        <section className="about-section">
          <h2 className="about-section-title">The Problem We Are Solving</h2>
          <p className="about-section-desc">
            Growing a business is hard. Scaling it without breaking the bank is even harder. We built Ikshan to dismantle the four biggest roadblocks founders face:
          </p>
          <div className="about-grid">
            {problems.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="about-card">
                  <div className="about-card-icon">
                    <Icon size={24} />
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* How It Works Section */}
        <section className="about-section">
          <h2 className="about-section-title">How Ikshan Works: Your AI-Powered Growth Engine</h2>
          <p className="about-section-desc">
            Ikshan doesn't just tell you what to do; it helps you do it.
          </p>
          <p className="about-section-desc">
            Through our AI Agents, Ikshan deeply analyzes your overall company, your competitors, and the market. We build the massive context needed to pinpoint the exact gaps holding you back. From there, we hand you a customized action plan covering over 150+ revenue-growth categories.
          </p>
          <p className="about-section-desc">
            But we don't stop at strategy. Ikshan connects you directly to the best DIY automation and AI tools, letting you execute complex tasks with a single click. Generate more leads, improve sales conversion, build bulletproof strategy, and save time in operations&mdash;all before you ever need to hire.
          </p>
        </section>

        {/* Journey Section */}
        <section className="about-section">
          <h2 className="about-section-title">The Ikshan Journey</h2>
          <p className="about-section-desc">
            It starts with a simple promise: <strong>Make your business run better&mdash;starting today.</strong> You select a goal, and we instantly build your action plan across four core pillars:
          </p>
          <div className="about-grid pillars-grid">
            {pillars.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="about-card pillar-card">
                  <div className="about-card-icon pillar-icon">
                    <Icon size={22} />
                  </div>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="about-callout">
            <Rocket size={20} />
            <p>
              <strong>Ready to go deeper?</strong> The Ikshan Paid Journey unlocks a profound audit of your market, customers, and funnels, paired with a comprehensive 1-month AI-powered execution plan tailored exactly to your business.
            </p>
          </div>
        </section>

        {/* Arsenal Section */}
        <section className="about-section">
          <h2 className="about-section-title">Our Arsenal: Built for Immediate Impact</h2>
          <p className="about-section-desc">
            Ikshan comes equipped with a growing suite of specialized AI products designed to replace expensive agency retainers with instant, scalable output:
          </p>
          <div className="about-grid products-grid">
            {products.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="about-card product-card">
                  <div className="about-card-icon product-icon">
                    <Icon size={22} />
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Founder Section */}
        <section className="about-section founder-section">
          <h2 className="about-section-title">Meet the Founder</h2>
          <div className="founder-card">
            <div className="founder-info">
              <div className="founder-avatar">VG</div>
              <div>
                <h3 className="founder-name">Vivek Gaur</h3>
                <p className="founder-role">Founder, Ikshan</p>
              </div>
            </div>
            <p className="founder-bio">
              Vivek is a serial entrepreneur and growth operator who understands the mechanics of scale from the ground up. Before founding Ikshan, Vivek served as the Chief Growth Officer (CGO) at Physics Wallah (PW), where he engineered and led the company's hyper-growth trajectory from its early startup days all the way to a historic IPO.
            </p>
            <p className="founder-bio">
              With a track record that includes two previously acquired startups, Vivek brings a fiercely pragmatic approach to business building. He has spent his career mastering the transition from raw startup hustle to highly efficient, systemized scale.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;

import { Icon } from './components/Icon';
import type { IconName } from './components/Icon';
import { Reveal } from './components/Reveal';
import { WorkflowPreview } from './components/WorkflowPreview';

const features: { icon: IconName; title: string; description: string }[] = [
  { icon: 'code', title: 'Open Source', description: '100% open source.' },
  { icon: 'layers', title: 'Fast Integrations', description: 'Connect your tools in minutes.' },
  { icon: 'nodes', title: 'Visual Builder', description: 'Design automations with a simple, flexible builder.' },
];

export default function App() {
  return (
    <div className="page-shell">
      <a className="skip-link" href="#main">Skip to content</a>
      <header className="site-header page-width">
        <a className="wordmark" href="/" aria-label="JForge home">
          <Icon name="code" size={23} /><span>JForge</span>
        </a>
        <nav className="main-nav" aria-label="Main navigation">
        </nav>
        <div className="header-actions">
        </div>
      </header>

      <main id="main" className="page-width">
        <div className="workflow-showcase">
          <section className="hero" aria-labelledby="hero-title">
            <h1 id="hero-title" className="sr-only">Automate your workflows without limits.</h1>
            <WorkflowPreview />
          </section>

          <div className="workflow-scroll-guide">
            <div className="workflow-scroll-marker">
              <a className="workflow-scroll-arrow" href="#features" aria-label="Scroll to features">
                <Icon name="chevron-down" size={28} />
              </a>
            </div>
          </div>

          <section id="features" className="feature-grid" aria-label="JForge features">
            {features.map(({ icon, title, description }, index) => (
              <Reveal key={title} delay={index * 70}>
                <article className="feature-card">
                  <Icon name={icon} size={29} />
                  <div><h2>{title}</h2><p>{description}</p></div>
                </article>
              </Reveal>
            ))}
          </section>
        </div>

        <section id="integrations" className="integrations" aria-labelledby="integrations-title">
          <Reveal>
            <h2 id="integrations-title">Integrations</h2>
            <p>Connect the tools you already use.</p>
            <div className="integration-item">
              <div className="integration-tile" role="img" aria-label="Discord"><Icon name="discord" size={29} /></div>
              <span className="integration-name">Discord</span>
            </div>
          </Reveal>
        </section>
      </main>
    </div>
  );
}

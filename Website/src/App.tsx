import { Icon } from './components/Icon';
import type { IconName } from './components/Icon';
import { Reveal } from './components/Reveal';
import { WorkflowPreview } from './components/WorkflowPreview';

const repositoryUrl = 'https://github.com/JoaoCardosoPT/JForge';
const features: { icon: IconName; title: string; description: string }[] = [
  { icon: 'code', title: 'Open Source', description: '100% open source.' },
  { icon: 'layers', title: 'Fast Integrations', description: 'Connect your tools in minutes.' },
  { icon: 'nodes', title: 'Visual Builder', description: 'Design automations with a simple, flexible builder.' },
];

function ComingSoon({ compact = false }: { compact?: boolean }) {
  return (
    <button type="button" className={`button button-primary ${compact ? 'button-compact' : ''}`} disabled>
      Coming soon
    </button>
  );
}

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
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <div className="eyebrow entrance entrance-badge">Open Source <span>·</span> Workflow Automation</div>
            <h1 id="hero-title" className="entrance entrance-title">
              Automate your workflows<br className="desktop-break" /> without limits.
            </h1>
            <p className="hero-description entrance entrance-description">
              An open-source platform to connect your apps, automate repetitive
              work, and build powerful workflows.
            </p>
            <div className="hero-actions entrance entrance-actions">
              <ComingSoon />
              <a className="button button-secondary" href={repositoryUrl}>
                <Icon name="github" size={23} />View on GitHub
              </a>
            </div>
            <ul className="hero-benefits entrance entrance-benefits" aria-label="Project highlights">
              <li><Icon name="code" size={20} /><span>Open Source</span></li>
              <li><Icon name="layers" size={20} /><span>Modular &amp; Extensible</span></li>
            </ul>
          </div>
          <WorkflowPreview />
        </section>

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

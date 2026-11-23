import { useEffect, useId, useState } from 'react';
import type { CSSProperties } from 'react';
import { Icon } from './Icon';
import type { IconName } from './Icon';
import { useInView } from './Reveal';

function WorkflowNode({ x, y, width, icon, title, detail, delay }: {
  x: number; y: number; width: number; icon: IconName;
  title: string; detail?: string; delay: string;
}) {
  const textX = width < 155 ? 49 : 55;

  return (
    <g className="workflow-node" transform={`translate(${x} ${y})`}
      style={{ '--node-delay': delay } as CSSProperties}>
      <rect className="node-outline" width={width} height="54" rx="12" />
      <g transform="translate(17 15)"><Icon name={icon} /></g>
      <text x={textX} y={detail ? 23 : 31} className="node-title">{title}</text>
      {detail && <text x={textX} y="39" className="node-detail">{detail}</text>}
    </g>
  );
}

export function WorkflowPreview() {
  const { ref, isInView } = useInView(false);
  const orbitGradient = useId();
  const [isPlaying, setIsPlaying] = useState(true);
  const [isPageVisible, setIsPageVisible] = useState(!document.hidden);
  const [replay, setReplay] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [isCompact, setIsCompact] = useState(() => matchMedia('(max-width: 600px)').matches);

  useEffect(() => {
    const query = matchMedia('(max-width: 600px)');
    const onChange = () => setIsCompact(query.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    const onVisibilityChange = () => setIsPageVisible(!document.hidden);
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => document.removeEventListener('visibilitychange', onVisibilityChange);
  }, []);

  function replayDemo() {
    setIsPlaying(true);
    setReplay((value) => value + 1);
  }

  const sidebarItems = [
    { icon: 'home', label: 'Workflows' },
    { icon: 'layers', label: 'Executions' },
    { icon: 'puzzle', label: 'Integrations' },
    { icon: 'settings', label: 'Settings' },
  ] as const;

  const connections = isCompact ? [
    'M170 64V109',
    'M170 163V182Q170 195 157 195H100Q86.5 195 86.5 209V222',
    'M170 163V182Q170 195 183 195H240Q253.5 195 253.5 209V222',
  ] : [
    'M192 126H252',
    'M410 126H426Q446 126 446 106V89Q446 69 466 69H482',
    'M410 126H426Q446 126 446 146V161Q446 181 466 181H482',
  ];
  const ports = isCompact
    ? [[170, 64], [170, 86.5], [170, 109], [170, 163], [86.5, 222], [253.5, 222]]
    : [[192, 126], [222, 126], [252, 126], [410, 126], [482, 69], [482, 181]];
  const graphCenter = isCompact ? '170 150' : '350 130';

  return (
    <div ref={ref} className="workflow-preview entrance entrance-preview"
      data-playing={isPlaying && isInView && isPageVisible}>
      <svg className="preview-orbit" viewBox="0 0 1000 440" preserveAspectRatio="none"
        aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id={orbitGradient} x1="0" y1="116" x2="0" y2="440" gradientUnits="userSpaceOnUse">
            <stop stopColor="#fff" stopOpacity="0" />
            <stop offset="14%" stopColor="#fff" stopOpacity="0.85" />
            <stop offset="45%" stopColor="#fff" stopOpacity="0.15" />
            <stop offset="76%" stopColor="#fff" stopOpacity="0.78" />
            <stop offset="89%" stopColor="#fff" stopOpacity="0.42" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0.9" />
          </linearGradient>
        </defs>
        <path d="M755 112C1010 97 1087 145 881 206S220 287 52 351C-113 402 172 411 324 418C405 423 461 432 500 440"
          fill="none" stroke={`url(#${orbitGradient})`} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
      </svg>
      <span className="preview-backplate" aria-hidden="true" />
      <span className="preview-corner" aria-hidden="true" />
      <span className="preview-corner preview-corner-end" aria-hidden="true" />
      <div className="workflow-window">
        <div className="window-bar" aria-hidden="true"><span /><span /><span /></div>
        <div className="demo-body">
          <div className="demo-sidebar" aria-hidden="true">
            <div className="demo-brand"><Icon name="code" size={18} /><span>JForge</span></div>
            {sidebarItems.map(({ icon, label }, index) => (
              <div key={label} className={`sidebar-item ${index === 0 ? 'is-active' : ''}`}>
                <Icon name={icon} size={18} /><span>{label}</span>
              </div>
            ))}
          </div>
          <div className="demo-workspace">
            <div className="demo-toolbar">
              <div className="workflow-name">
                <span className="workflow-breadcrumb">Workflows</span>
                <span className="toolbar-divider" aria-hidden="true">›</span>
                <span className="workflow-title">Release Announcements</span>
              </div>
              <div className="demo-actions">
                <button type="button" className="demo-button" onClick={replayDemo}
                  aria-label="Test demo: replay workflow animation">
                  <Icon name="play" size={14} />Test
                </button>
                <button type="button" className="demo-button demo-publish" disabled
                  title="Publishing is coming soon">
                  <Icon name="play" size={13} />Publish
                </button>
              </div>
            </div>
            <div className="demo-canvas">
              <svg className="workflow-graph" viewBox={isCompact ? '0 0 340 300' : '0 0 700 260'} role="img"
                aria-label="Example workflow: announce a new JForge release in the Discord channels #announcements and #changelog.">
                <g className="graph-content"
                  transform={`translate(${graphCenter}) scale(${zoom}) translate(${isCompact ? '-170 -150' : '-350 -130'})`}>
                  <g fill="none" className="graph-connections">
                    {connections.map((path) => <path key={path} d={path} />)}
                  </g>
                  <g key={replay} className="graph-animation">
                    <g fill="none" className="graph-pulses">
                      {connections.map((path, index) => (
                        <path key={path} pathLength="100" d={path} className={index > 0 ? 'branch-pulse' : ''} />
                      ))}
                    </g>
                    <WorkflowNode x={isCompact ? 94 : 44} y={isCompact ? 10 : 99} width={isCompact ? 152 : 148} icon="github"
                      title="New Release" detail="JForge" delay="0s" />
                    <WorkflowNode x={isCompact ? 91 : 252} y={isCompact ? 109 : 99} width={158} icon="http"
                      title="JForge API" detail="POST message" delay="1s" />
                    <WorkflowNode x={isCompact ? 10 : 482} y={isCompact ? 222 : 42} width={isCompact ? 153 : 172} icon="discord"
                      title="Post Update" detail="#announcements" delay="2.4s" />
                    <WorkflowNode x={isCompact ? 177 : 482} y={isCompact ? 222 : 154} width={isCompact ? 153 : 172} icon="discord"
                      title="Post Update" detail="#changelog" delay="2.4s" />
                  </g>
                  <g className="graph-ports" aria-hidden="true">
                    {ports.map(([x, y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r="3.5" />)}
                  </g>
                </g>
              </svg>
              <div className="canvas-controls" aria-label="Workflow demo controls">
                <button type="button" className="canvas-button"
                  aria-label={isPlaying ? 'Pause workflow animation' : 'Play workflow animation'}
                  onClick={() => setIsPlaying((value) => !value)}>
                  <Icon name={isPlaying ? 'pause' : 'play'} size={15} />
                </button>
                <div className="zoom-controls">
                  <button type="button" className="canvas-button" aria-label="Zoom in"
                    disabled={zoom >= 1.2}
                    onClick={() => setZoom((value) => Math.min(1.2, Math.round((value + 0.1) * 10) / 10))}>
                    <Icon name="plus" size={15} />
                  </button>
                  <button type="button" className="canvas-button" aria-label="Zoom out"
                    disabled={zoom <= 0.8}
                    onClick={() => setZoom((value) => Math.max(0.8, Math.round((value - 0.1) * 10) / 10))}>
                    <Icon name="minus" size={15} />
                  </button>
                  <output aria-label="Workflow zoom">{Math.round(zoom * 100)}%</output>
                </div>
                <button type="button" className="canvas-button fit-button" aria-label="Reset workflow zoom"
                  onClick={() => setZoom(1)}><Icon name="fit" size={15} /></button>
              </div>
            </div>
            <span className="sr-only" role="status">
              {replay > 0 ? `Demo animation replayed ${replay} ${replay === 1 ? 'time' : 'times'}.` : ''}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

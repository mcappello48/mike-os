'use client';

import { useEffect, useMemo, useState } from 'react';
import { AppData, FollowUp, Project, Task } from '@/lib/types';
import { seedData } from '@/lib/seed';
import { quickProcess } from '@/lib/ai';

type Tab = 'Inbox' | 'Today' | 'Projects' | 'Waiting On' | 'Brief';

function projectName(projects: Project[], id?: string) {
  return projects.find(p => p.id === id)?.name || 'No Project';
}

function ageDays(date?: string) {
  if (!date) return '';
  const diff = Date.now() - new Date(date).getTime();
  return Math.max(0, Math.floor(diff / 86400000)).toString();
}

export default function Home() {
  const [tab, setTab] = useState<Tab>('Inbox');
  const [data, setData] = useState<AppData>(seedData);
  const [raw, setRaw] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('mike-os-data');
    if (saved) setData(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('mike-os-data', JSON.stringify(data));
  }, [data]);

  const todayTasks = useMemo(() => data.tasks.filter(t => t.status !== 'Done'), [data.tasks]);
  const waiting = useMemo(() => data.followUps.filter(f => f.status !== 'Done'), [data.followUps]);

  function processCapture() {
    if (!raw.trim()) return;
    const result = quickProcess(raw, data.projects);
    setData(prev => ({
      ...prev,
      tasks: [result.task, ...prev.tasks],
      notes: [result.note, ...prev.notes],
      followUps: result.followUp ? [result.followUp, ...prev.followUps] : prev.followUps
    }));
    setRaw('');
    setMessage(`Processed as ${result.task.status} / ${result.task.priority}. ${result.aiWarning}`);
  }

  function addProject() {
    const name = prompt('Project name');
    if (!name) return;
    setData(prev => ({ ...prev, projects: [{ id: crypto.randomUUID(), name, status: 'Active', priority: 'Medium' }, ...prev.projects] }));
  }

  function markTaskDone(id: string) {
    setData(prev => ({ ...prev, tasks: prev.tasks.map(t => t.id === id ? { ...t, status: 'Done' } : t) }));
  }

  function markFollowDone(id: string) {
    setData(prev => ({ ...prev, followUps: prev.followUps.map(f => f.id === id ? { ...f, status: 'Done' } : f) }));
  }

  function resetDemo() {
    if (!confirm('Reset all local data to demo seed?')) return;
    setData(seedData);
  }

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">Mike OS</div>
        <div className="tag">AI Command Center MVP</div>
        <div className="nav">
          {(['Inbox','Today','Projects','Waiting On','Brief'] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)} className={tab === t ? 'active' : ''}>{t}</button>
          ))}
        </div>
        <div className="spacer" />
        <button className="ghost" onClick={resetDemo}>Reset Demo</button>
        <p className="muted small">Local-first prototype. Data saves in this browser.</p>
      </aside>
      <main>
        {tab === 'Inbox' && <Inbox raw={raw} setRaw={setRaw} processCapture={processCapture} message={message} />}
        {tab === 'Today' && <Today tasks={todayTasks} projects={data.projects} markTaskDone={markTaskDone} />}
        {tab === 'Projects' && <Projects data={data} addProject={addProject} />}
        {tab === 'Waiting On' && <Waiting followUps={waiting} projects={data.projects} markFollowDone={markFollowDone} />}
        {tab === 'Brief' && <Brief tasks={todayTasks} followUps={waiting} projects={data.projects} />}
      </main>
    </div>
  );
}

function Inbox({ raw, setRaw, processCapture, message }: { raw: string; setRaw: (v: string) => void; processCapture: () => void; message: string }) {
  return <>
    <h1>Inbox Capture</h1>
    <p className="muted">Dump anything here: voice transcript, pasted email, job thought, follow-up, or random task.</p>
    <div className="card">
      <textarea value={raw} onChange={e => setRaw(e.target.value)} placeholder="Example: Follow up with Conrad tomorrow on official PO approval for IAD055 tray CO. Need to keep schedule moving but we need formal approval." />
      <div className="spacer" />
      <div className="row"><button className="primary" onClick={processCapture}>Process Intake</button><span className="muted small">AI hook ready. Rule-based processor active for MVP.</span></div>
      {message && <p className="muted small">{message}</p>}
    </div>
    <div className="spacer" />
    <div className="grid cols">
      <div className="card"><h3>What this creates</h3><p className="muted">Task, follow-up, project note, priority, status, and next-action structure.</p></div>
      <div className="card"><h3>Next integration</h3><p className="muted">Replace rule processor with OpenAI API. Then add Microsoft Graph for Outlook.</p></div>
    </div>
  </>;
}

function Today({ tasks, projects, markTaskDone }: { tasks: Task[]; projects: Project[]; markTaskDone: (id: string) => void }) {
  const groups = ['Action Now','Follow Up','Waiting On','Deep Work','Inbox'];
  return <>
    <h1>Today</h1>
    <div className="grid cols">
      {groups.map(g => <div className="card" key={g}>
        <h3>{g}</h3>
        {tasks.filter(t => t.status === g).map(t => <div className="item" key={t.id}>
          <div className="item-title">{t.title}</div>
          <div className="row"><span className={`pill ${t.priority.toLowerCase()}`}>{t.priority}</span><span className="pill">{projectName(projects, t.projectId)}</span>{t.dueDate && <span className="pill">Due {t.dueDate}</span>}</div>
          <div className="spacer" />
          <button className="ghost" onClick={() => markTaskDone(t.id)}>Done</button>
        </div>)}
      </div>)}
    </div>
  </>;
}

function Projects({ data, addProject }: { data: AppData; addProject: () => void }) {
  return <>
    <div className="row"><h1>Projects</h1><button className="primary" onClick={addProject}>Add Project</button></div>
    <div className="grid cols">
      {data.projects.map(p => {
        const openTasks = data.tasks.filter(t => t.projectId === p.id && t.status !== 'Done').length;
        const openFollow = data.followUps.filter(f => f.projectId === p.id && f.status !== 'Done').length;
        return <div className="card" key={p.id}>
          <h3>{p.name}</h3>
          <p className="muted">{p.client || 'No client'} • {p.status}</p>
          <div className="row"><span className={`pill ${p.priority.toLowerCase()}`}>{p.priority}</span>{p.dueDate && <span className="pill">Due {p.dueDate}</span>}<span className="pill">Tasks {openTasks}</span><span className="pill">Waiting {openFollow}</span></div>
          {p.notes && <p>{p.notes}</p>}
        </div>;
      })}
    </div>
  </>;
}

function Waiting({ followUps, projects, markFollowDone }: { followUps: FollowUp[]; projects: Project[]; markFollowDone: (id: string) => void }) {
  return <>
    <h1>Waiting On</h1>
    <div className="card">
      <table>
        <thead><tr><th>Person</th><th>Project</th><th>Waiting For</th><th>Age</th><th>Next</th><th></th></tr></thead>
        <tbody>{followUps.map(f => <tr key={f.id}>
          <td>{f.person}<div className="muted small">{f.company}</div></td>
          <td>{projectName(projects, f.projectId)}</td>
          <td>{f.waitingFor}</td>
          <td>{ageDays(f.lastContactDate)} days</td>
          <td>{f.followUpDate || 'Set date'}</td>
          <td><button className="ghost" onClick={() => markFollowDone(f.id)}>Done</button></td>
        </tr>)}</tbody>
      </table>
    </div>
  </>;
}

function Brief({ tasks, followUps, projects }: { tasks: Task[]; followUps: FollowUp[]; projects: Project[] }) {
  const high = tasks.filter(t => t.priority === 'High').slice(0, 5);
  return <>
    <h1>AI Daily Brief</h1>
    <div className="grid cols">
      <div className="card"><h3>Top Priorities</h3>{high.map((t,i) => <div className="item" key={t.id}><div className="item-title">{i+1}. {t.title}</div><div className="muted small">{projectName(projects, t.projectId)} • {t.status}</div></div>)}</div>
      <div className="card"><h3>Risks</h3>{followUps.slice(0,5).map(f => <div className="item" key={f.id}><div className="item-title">{f.person}: {f.waitingFor}</div><div className="muted small">{projectName(projects, f.projectId)} • follow up {f.followUpDate || 'soon'}</div></div>)}</div>
      <div className="card"><h3>Suggested Focus</h3><p>Clear high-priority client follow-ups first. Then block deep work for system/procedure building.</p></div>
    </div>
  </>;
}

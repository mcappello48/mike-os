import { FollowUp, Note, Priority, Project, Status, Task } from './types';

const statuses: Status[] = ['Inbox', 'Action Now', 'Waiting On', 'Follow Up', 'Deep Work', 'Done'];
const priorities: Priority[] = ['High', 'Medium', 'Low'];

export function quickProcess(raw: string, projects: Project[]) {
  const lower = raw.toLowerCase();
  const project = projects.find(p => lower.includes(p.name.toLowerCase().split(' ')[0].toLowerCase())) ||
    projects.find(p => lower.includes('bright') && p.name.includes('Bright'));

  let status: Status = 'Inbox';
  if (lower.includes('waiting') || lower.includes('po') || lower.includes('approval')) status = 'Waiting On';
  if (lower.includes('follow up') || lower.includes('call') || lower.includes('email')) status = 'Follow Up';
  if (lower.includes('today') || lower.includes('now') || lower.includes('urgent') || lower.includes('due')) status = 'Action Now';
  if (lower.includes('deep work') || lower.includes('build') || lower.includes('procedure')) status = 'Deep Work';

  let priority: Priority = 'Medium';
  if (lower.includes('urgent') || lower.includes('due') || lower.includes('po') || lower.includes('approval')) priority = 'High';
  if (lower.includes('someday') || lower.includes('maybe')) priority = 'Low';

  const firstSentence = raw.split(/[.!?]/)[0]?.trim() || raw.trim();
  const title = firstSentence.length > 85 ? firstSentence.slice(0, 82) + '...' : firstSentence;

  const task: Task = {
    id: crypto.randomUUID(),
    title,
    projectId: project?.id,
    status,
    priority,
    owner: 'Mike',
    source: 'Inbox Capture',
    summary: raw.trim(),
    createdAt: new Date().toISOString()
  };

  const note: Note = {
    id: crypto.randomUUID(),
    raw,
    cleanSummary: `Captured: ${title}`,
    projectId: project?.id,
    createdAt: new Date().toISOString()
  };

  let followUp: FollowUp | undefined;
  if (status === 'Waiting On' || status === 'Follow Up') {
    followUp = {
      id: crypto.randomUUID(),
      person: extractPerson(raw),
      projectId: project?.id,
      waitingFor: title,
      followUpDate: new Date().toISOString().slice(0, 10),
      status,
      createdAt: new Date().toISOString()
    };
  }

  return { task, note, followUp, aiWarning: 'This MVP uses local rule-based processing. Replace quickProcess with OpenAI API in production.' };
}

function extractPerson(text: string) {
  const names = ['Conrad', 'Anthony', 'Robert', 'Bryan', 'Ian', 'Schaedler', 'Joshua', 'Eric'];
  return names.find(n => text.toLowerCase().includes(n.toLowerCase())) || 'TBD';
}

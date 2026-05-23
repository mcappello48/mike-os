import { AppData } from './types';

export const seedData: AppData = {
  projects: [
    { id: 'p1', name: 'IAD134 N+2C', client: 'Amentum / AWS', status: 'Active CO', priority: 'High', dueDate: '2026-05-29', notes: 'Pending CO items and backup.' },
    { id: 'p2', name: 'IAD055 Tray CO', client: 'Amentum', status: 'CO Follow-Up', priority: 'High', notes: 'Track approval and PO.' },
    { id: 'p3', name: 'Bright Edge Systems', client: 'Internal', status: 'Build System', priority: 'Medium', notes: 'Personal operating system and company workflows.' }
  ],
  tasks: [
    { id: 't1', title: 'Submit IAD134 CO backup', projectId: 'p1', status: 'Action Now', priority: 'High', dueDate: '2026-05-29', owner: 'Mike', createdAt: new Date().toISOString() },
    { id: 't2', title: 'Call Schaedler rep for tray quote', projectId: 'p1', status: 'Action Now', priority: 'High', owner: 'Mike', createdAt: new Date().toISOString() },
    { id: 't3', title: 'Block time to refine Mike OS workflow', projectId: 'p3', status: 'Deep Work', priority: 'Medium', owner: 'Mike', createdAt: new Date().toISOString() }
  ],
  followUps: [
    { id: 'f1', person: 'Conrad', company: 'Amentum', projectId: 'p2', waitingFor: 'Official approval and PO', lastContactDate: '2026-05-20', followUpDate: '2026-05-23', status: 'Waiting On', createdAt: new Date().toISOString() },
    { id: 'f2', person: 'Schaedler Rep', company: 'Schaedler', projectId: 'p1', waitingFor: 'Tray quote', lastContactDate: '2026-05-22', followUpDate: '2026-05-23', status: 'Follow Up', createdAt: new Date().toISOString() }
  ],
  notes: []
};

'use client';
import { useRef, useState, type DragEvent, type ReactNode } from 'react';
import { ArrowDownAZ, ChevronRight, ChevronsDownUp, ChevronsUpDown, Clock, FileText, FolderPlus, Plus, Search, SquarePen } from 'lucide-react';
import type { Note, Workspace } from '../lib/study';
import { UNCATEGORISED } from '../lib/note-graph';

type Sort = 'name' | 'updated';
type Props = {
    w: Workspace;
    selected: string;
    /** Subject id of the active folder ('' for none); shared with the rest of the app's subject filter. */
    folder: string;
    search: string;
    onSearch: (q: string) => void;
    onSelect: (note: Note) => void;
    onFolder: (id: string) => void;
    onNewNote: (subject: string) => void;
    onNewFolder: () => void;
    /** Drop a note on a folder (subject id) or on the root (''). */
    onMove: (note: Note, subject: string) => void;
};
const ROOT = '\u0000root';

// Per-browser view preferences.
const KEY = 'studysprint-note-tree';
function readPrefs(): { collapsed: string[]; collapsedNotes: string[]; sort: Sort } {
    try { const v = JSON.parse(localStorage.getItem(KEY) || '{}'); return { collapsed: Array.isArray(v.collapsed) ? v.collapsed.filter((x: unknown) => typeof x === 'string') : [], collapsedNotes: Array.isArray(v.collapsedNotes) ? v.collapsedNotes.filter((x: unknown) => typeof x === 'string') : [], sort: v.sort === 'updated' ? 'updated' : 'name' }; }
    catch { return { collapsed: [], collapsedNotes: [], sort: 'name' }; }
}
function savePrefs(collapsed: Set<string>, collapsedNotes: Set<string>, sort: Sort) { try { localStorage.setItem(KEY, JSON.stringify({ collapsed: [...collapsed], collapsedNotes: [...collapsedNotes], sort })); } catch { /* view still works */ } }

const byName = (a: { name?: string; title?: string }, b: { name?: string; title?: string }) => (a.name ?? a.title ?? '').localeCompare(b.name ?? b.title ?? '', undefined, { numeric: true, sensitivity: 'base' });

/** Folder view of the notes: subjects are folders, notes without a subject sit at the root. */
export function NoteTree({ w, selected, folder, search, onSearch, onSelect, onFolder, onNewNote, onNewFolder, onMove }: Props) {
    const [prefs] = useState(readPrefs);
    const [collapsed, setCollapsed] = useState(() => new Set(prefs.collapsed));
    const [collapsedNotes, setCollapsedNotes] = useState(() => new Set(prefs.collapsedNotes));
    const [sort, setSort] = useState<Sort>(prefs.sort);
    const update = (next: Set<string>, nextNotes: Set<string> = collapsedNotes, nextSort = sort) => { setCollapsed(next); setCollapsedNotes(nextNotes); setSort(nextSort); savePrefs(next, nextNotes, nextSort); };
    const updateNotes = (nextNotes: Set<string>) => update(collapsed, nextNotes, sort);

    // Opening a note from elsewhere (a link, the graph, a card) reveals its folder.
    const selectedSubject = w.notes.find(n => n.id === selected)?.subject ?? '';
    const [revealed, setRevealed] = useState(selected);
    if (revealed !== selected) {
        setRevealed(selected);
        let updated = false;
        const nextFolders = new Set(collapsed);
        if (nextFolders.has(selectedSubject)) { nextFolders.delete(selectedSubject); updated = true; }
        // We also want to reveal if it is a child concept note, but we'd need to find its parent.
        // For simplicity, we just clear the note from collapsedNotes if we know its parent.
        // It will be handled partly when parentByChild is computed, but we can't do it easily here.
        if (updated) update(nextFolders);
    }

    const q = search.trim().toLowerCase();
    const matches = (n: Note) => !q || `${n.title} ${n.body}`.toLowerCase().includes(q);
    const order = (notes: Note[]) => [...notes].sort(sort === 'name' ? byName : (a, b) => b.updated.localeCompare(a.updated));
    const known = new Set(w.subjects.map(s => s.id));
    const folders = [...w.subjects].sort(byName).map(s => ({ ...s, notes: order(w.notes.filter(n => n.subject === s.id && matches(n))), total: w.notes.filter(n => n.subject === s.id).length }));
    const loose = order(w.notes.filter(n => (!n.subject || !known.has(n.subject)) && matches(n)));
    const allCollapsed = folders.length > 0 && folders.every(f => collapsed.has(f.id));
    const toggle = (id: string) => { const next = new Set(collapsed); if (next.has(id)) next.delete(id); else next.add(id); update(next); };
    const toggleNote = (id: string) => { const next = new Set(collapsedNotes); if (next.has(id)) next.delete(id); else next.add(id); updateNotes(next); };
    // Drag and drop between folders.
    const [dragId, setDragId] = useState(''), [dropTarget, setDropTarget] = useState('');
    const openTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
    const dragged = w.notes.find(n => n.id === dragId);
    const currentFolder = (n: Note) => n.subject && known.has(n.subject) ? n.subject : '';
    const endDrag = () => { clearTimeout(openTimer.current); setDragId(''); setDropTarget(''); };
    const over = (target: string) => (e: DragEvent) => {
        if (!dragged || currentFolder(dragged) === (target === ROOT ? '' : target)) return;
        e.preventDefault(); e.stopPropagation();
        e.dataTransfer.dropEffect = 'move';
        if (dropTarget === target) return;
        setDropTarget(target);
        clearTimeout(openTimer.current);
        // Hovering a collapsed folder opens it, so the drop lands somewhere visible.
        if (target !== ROOT && collapsed.has(target)) openTimer.current = setTimeout(() => { const next = new Set(collapsed); next.delete(target); update(next); }, 600);
    };
    const leave = (target: string) => (e: DragEvent) => { if (dropTarget === target && !e.currentTarget.contains(e.relatedTarget as Node | null)) { clearTimeout(openTimer.current); setDropTarget(''); } };
    const drop = (target: string) => (e: DragEvent) => {
        if (!dragged) return;
        e.preventDefault(); e.stopPropagation();
        const subject = target === ROOT ? '' : target;
        if (subject && collapsed.has(subject)) { const next = new Set(collapsed); next.delete(subject); update(next); }
        if (currentFolder(dragged) !== subject) onMove(dragged, subject);
        endDrag();
    };
    const dropProps = (target: string) => ({ onDragOver: over(target), onDragEnter: over(target), onDragLeave: leave(target), onDrop: drop(target) });

    const visibleCount = folders.reduce((n, f) => n + f.notes.length, 0) + loose.length;

    const conceptSourceTitle = (note: Note) => note.body.match(/^Extracted from \[\[([^\]]+)\]\]\./m)?.[1];
    const noteRows = (notes: Note[], depth: number) => {
        const ordered = order(notes);
        const ids = new Set(ordered.map(note => note.id));
        const byTitle = new Map(ordered.map(note => [note.title.trim().toLocaleLowerCase(), note]));
        const parentByChild = new Map<string, string>();
        const childrenByParent = new Map<string, Note[]>();
        for (const note of ordered) {
            if (!note.body.includes('StudySprint concept graph node:')) continue;
            const sourceTitle = conceptSourceTitle(note);
            const parent = sourceTitle ? byTitle.get(sourceTitle.trim().toLocaleLowerCase()) : undefined;
            if (!parent || parent.id === note.id || !ids.has(parent.id)) continue;
            parentByChild.set(note.id, parent.id);
            childrenByParent.set(parent.id, [...(childrenByParent.get(parent.id) || []), note]);
        }
        const render = (note: Note, rowDepth: number): ReactNode => {
            const children = childrenByParent.get(note.id);
            const hasChildren = !!children?.length;
            const isCollapsed = collapsedNotes.has(note.id);
            return <li key={note.id}>
                <div className={'tree-row tree-note' + (selected === note.id ? ' selected' : '') + (dragId === note.id ? ' dragging' : '')} style={{ paddingLeft: 10 + rowDepth * 18, display: 'flex', alignItems: 'center' }}>
                    {hasChildren && <button type="button" className="tree-toggle" style={{ padding: 0, marginRight: 4, height: 'auto', zIndex: 10, position: 'relative' }} aria-expanded={!isCollapsed} onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleNote(note.id); }} title={isCollapsed ? "Expand concepts" : "Collapse concepts"}>
                        <ChevronRight size={14} className={!isCollapsed ? 'open' : ''} aria-hidden="true" />
                    </button>}
                    {!hasChildren && <span style={{ width: 14, marginRight: 4, display: 'inline-block' }}></span>}
                    <button draggable onDragStart={e => { e.dataTransfer.setData('text/plain', note.title); e.dataTransfer.effectAllowed = 'move'; setDragId(note.id); }} onDragEnd={endDrag}
                        className="tree-note-btn" style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', padding: 0, textAlign: 'left', color: 'inherit', cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit' }} aria-current={selected === note.id ? 'page' : undefined} onClick={() => onSelect(note)} title={note.title}>
                        <FileText size={14} aria-hidden="true" style={{ flexShrink: 0 }} /><span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{note.title}</span>
                    </button>
                </div>
                {hasChildren && !isCollapsed && <ul className="tree-concepts" aria-label={`Concepts from ${note.title}`}>{order(children!).map(child => render(child, rowDepth + 1))}</ul>}
            </li>;
        };
        return ordered.filter(note => !parentByChild.has(note.id)).map(note => render(note, depth));
    };

    return <section className="note-browser tree" aria-label="Notes">
        <div className="tree-toolbar" role="toolbar" aria-label="Note tools">
            <button className="icon" onClick={() => onNewNote(folder === UNCATEGORISED ? '' : folder)} aria-label="New note" title="New note"><SquarePen size={16}/></button>
            <button className="icon" onClick={onNewFolder} aria-label="New folder" title="New folder"><FolderPlus size={16}/></button>
            <button className="icon" onClick={() => update(collapsed, collapsedNotes, sort === 'name' ? 'updated' : 'name')} aria-label={sort === 'name' ? 'Sorted by name. Sort by last edited' : 'Sorted by last edited. Sort by name'} title={sort === 'name' ? 'Sorted A–Z' : 'Sorted by last edited'}>{sort === 'name' ? <ArrowDownAZ size={16}/> : <Clock size={16}/>}</button>
            <button className="icon" disabled={!folders.length} onClick={() => update(allCollapsed ? new Set() : new Set(folders.map(f => f.id)), collapsedNotes, sort)} aria-label={allCollapsed ? 'Expand all folders' : 'Collapse all folders'} title={allCollapsed ? 'Expand all' : 'Collapse all'}>{allCollapsed ? <ChevronsUpDown size={16}/> : <ChevronsDownUp size={16}/>}</button>
        </div>
        <label className="search"><Search size={16}/><input aria-label="Search notes" placeholder="Find a note…" value={search} onChange={e => onSearch(e.target.value)}/></label>
        <ul className={'tree' + (dropTarget === ROOT ? ' drop-target' : '')} {...dropProps(ROOT)}>
            {folders.map(f => {
                // While searching, folders with matches open and empty ones hide.
                if (q && !f.notes.length) return null;
                const open = q ? true : !collapsed.has(f.id);
                return <li key={f.id} className={'tree-folder' + (dropTarget === f.id ? ' drop-target' : '')} {...dropProps(f.id)}>
                    <div className={'tree-row tree-folder-row' + (folder === f.id ? ' active' : '')}>
                        <button className="tree-toggle" aria-expanded={open} onClick={() => { toggle(f.id); onFolder(f.id); }} title={f.name}>
                            <ChevronRight size={14} className={open ? 'open' : ''} aria-hidden="true"/><span>{f.name}</span><small>{f.total}</small></button>
                        <button className="icon tree-add" onClick={() => onNewNote(f.id)} aria-label={`New note in ${f.name}`} title="New note in this folder"><Plus size={14}/></button>
                    </div>
                    {open && (f.notes.length ? <ul>{noteRows(f.notes, 1)}</ul> : <p className="tree-empty">No notes yet</p>)}
                </li>;
            })}
            {noteRows(loose, 0)}
            {dragged && currentFolder(dragged) && <li className="tree-root-drop" aria-hidden="true">Drop here to take it out of its folder</li>}
        </ul>
        {q && !visibleCount && <p className="tree-empty">No notes match “{search}”.</p>}
        {!q && !w.notes.length && !w.subjects.length && <p className="tree-empty">Create a note or a folder to begin.</p>}
    </section>;
}

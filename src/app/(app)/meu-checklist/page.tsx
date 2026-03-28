"use client";

import { useState, useEffect, Suspense, useRef } from "react";
import { ListTodo, RotateCcw, Plus, Trash2, GripVertical, Check, Download, Upload, BookmarkPlus, SquareDashed } from "lucide-react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

type TaskItem = {
    id: string;
    text: string;
    done: boolean;
};

const TEMPLATES: Record<string, TaskItem[]> = {
    vazio: []
};

const TEMPLATES_OPTIONS = [
    { value: "vazio", label: "Em Branco" }
];

const STORAGE_KEY = 'ts_tools_my_checklist';

function SortableTask({ task, index, onToggle, onEdit, onDelete }: {
    task: TaskItem;
    index: number;
    onToggle: (id: string) => void;
    onEdit: (id: string, text: string) => void;
    onDelete: (id: string) => void;
}) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Auto-focus new empty tasks
    useEffect(() => {
        if (task.text === "") {
            textareaRef.current?.focus();
        }
    }, [task.id]);

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 'auto',
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                "flex items-start gap-3 p-4 rounded-xl border transition-all text-left bg-card relative group animate-fade-up",
                task.done ? "border-primary/50 bg-primary/5 opacity-60 hover:opacity-100" : "border-border hover:border-primary/30",
                isDragging ? "shadow-2xl border-primary scale-[1.02]" : ""
            )}
        >
            <button
                {...attributes}
                {...listeners}
                className="mt-1 cursor-grab active:cursor-grabbing text-muted-foreground/30 hover:text-primary transition-colors focus:outline-none"
            >
                <GripVertical size={18} />
            </button>

            <button
                onClick={() => onToggle(task.id)}
                className={cn(
                    "w-6 h-6 shrink-0 rounded-[6px] border-[2.5px] flex items-center justify-center transition-all mt-0.5 outline-none cursor-pointer",
                    task.done ? "bg-primary border-primary text-primary-foreground" : "border-muted-foreground/30 group-hover:border-primary/50 bg-background"
                )}
            >
                {task.done && <Check size={14} strokeWidth={3} />}
            </button>

            <div className="flex-1">
                <Textarea
                    ref={textareaRef}
                    className={cn(
                        "resize-none outline-none border-none p-0 h-auto min-h-[24px] rounded-none focus-visible:ring-0 shadow-none leading-relaxed overflow-hidden py-0.5",
                        task.done ? "text-muted-foreground line-through" : "text-foreground"
                    )}
                    placeholder="Escreva a tarefa..."
                    value={task.text}
                    onChange={(e) => {
                        e.target.style.height = 'auto';
                        e.target.style.height = e.target.scrollHeight + 'px';
                        onEdit(task.id, e.target.value);
                    }}
                    onFocus={(e) => {
                        e.target.style.height = 'auto';
                        e.target.style.height = e.target.scrollHeight + 'px';
                    }}
                    rows={1}
                />
            </div>

            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={() => onDelete(task.id)}
                    className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors focus:outline-none"
                    title="Excluir Tarefa"
                >
                    <Trash2 size={16} />
                </button>
            </div>
        </div>
    );
}

function MeuChecklistContent() {
    const [tasks, setTasks] = useState<TaskItem[]>([]);
    const [mounted, setMounted] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState<string>("vazio");
    const [customTemplates, setCustomTemplates] = useState<{value: string, label: string, tasks: TaskItem[]}[]>([]);
    const [isSavingTemplate, setIsSavingTemplate] = useState(false);
    const [templateName, setTemplateName] = useState("");
    
    // Dialog states
    const [isClearDialogOpen, setIsClearDialogOpen] = useState(false);
    const [templateToDelete, setTemplateToDelete] = useState<string | null>(null);
    const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
    const [exportName, setExportName] = useState("Minha Lista");

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 3 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    useEffect(() => {
        setMounted(true);
        const storedTasks = localStorage.getItem(STORAGE_KEY);
        if (storedTasks) {
            try { setTasks(JSON.parse(storedTasks)); } catch (e) { setTasks([]); }
        } else {
            setTasks([]);
        }

        const storedCustomTemplates = localStorage.getItem('ts_tools_custom_templates');
        if (storedCustomTemplates) {
            try { setCustomTemplates(JSON.parse(storedCustomTemplates)); } catch (e) { }
        }
    }, []);

    useEffect(() => {
        if (!mounted) return;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
        localStorage.setItem('ts_tools_custom_templates', JSON.stringify(customTemplates));
    }, [tasks, customTemplates, mounted]);

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;
        setTasks((items) => {
            const oldIndex = items.findIndex(t => t.id === active.id);
            const newIndex = items.findIndex(t => t.id === over.id);
            return arrayMove(items, oldIndex, newIndex);
        });
    };

    const toggleTask = (id: string) => {
        setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
    };

    const editTask = (id: string, text: string) => {
        setTasks(prev => prev.map(t => t.id === id ? { ...t, text } : t));
    };

    const deleteTask = (id: string) => {
        const taskIndex = tasks.findIndex(t => t.id === id);
        if (taskIndex === -1) return;
        const taskToDelete = tasks[taskIndex];
        
        setTasks(prev => prev.filter(t => t.id !== id));
        
        toast("Tarefa excluída", {
            action: {
                label: "Desfazer",
                onClick: () => setTasks(prev => {
                    const newTasks = [...prev];
                    newTasks.splice(taskIndex, 0, taskToDelete);
                    return newTasks;
                })
            }
        });
    };

    const handleAddTask = () => {
        const newTask: TaskItem = { id: `custom-${Date.now()}`, text: "", done: false };
        setTasks(prev => [...prev, newTask]);
    };

    const handleUncheckAll = () => {
        setTasks(prev => prev.map(t => ({...t, done: false})));
    };

    const handleClearAll = () => {
        setTasks([]);
        setIsClearDialogOpen(false);
        toast.success("Lista limpa com sucesso.");
    }

    const handleSaveTemplate = () => {
        if (!templateName.trim() || tasks.length === 0) {
            setIsSavingTemplate(false);
            setTemplateName("");
            return;
        }
        
        const newValue = `custom_${Date.now()}`;
        const newTemplate = { value: newValue, label: templateName.trim(), tasks: [...tasks].map(t => ({...t, done: false})) };
        
        setCustomTemplates(prev => [...prev, newTemplate]);
        setIsSavingTemplate(false);
        setTemplateName("");
        setSelectedTemplate(newValue);
        toast.success(`Template "${newTemplate.label}" salvo com sucesso!`);
    };

    const handleDeleteTemplate = (val: string) => {
        setCustomTemplates(prev => prev.filter(t => t.value !== val));
        if (selectedTemplate === val) {
            setSelectedTemplate("vazio");
        }
        setTemplateToDelete(null);
        toast.info("Template excluído permanentemente.");
    };

    const handleExport = () => {
        if (tasks.length === 0) {
            toast.error("A lista está vazia.");
            return;
        }
        
        const payload = { name: exportName, tasks };
        const data = JSON.stringify(payload, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `checklist_${exportName.replace(/\s+/g, '_').toLowerCase()}_${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
        setIsExportDialogOpen(false);
        toast.success("Arquivo exportado!");
    };

    const handleImport = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/json';
        input.onchange = (e) => {
            const f = (e.target as HTMLInputElement).files?.[0];
            if (!f) return;
            const reader = new FileReader();
            reader.onload = () => {
                try {
                    const j = JSON.parse(reader.result as string);
                    if (j && j.name && Array.isArray(j.tasks)) {
                        setTasks(j.tasks);
                        const newValue = `custom_${Date.now()}`;
                        setCustomTemplates(prev => [...prev, { value: newValue, label: j.name, tasks: j.tasks.map((t: TaskItem) => ({...t, done: false})) }]);
                        setSelectedTemplate(newValue);
                        toast.success(`Lista "${j.name}" importada e salva nos seus templates!`);
                    } else if (Array.isArray(j)) {
                        setTasks(j);
                        toast.success('Lista simples importada com sucesso.');
                    }
                } catch (err) {
                    toast.error('Erro ao ler o arquivo JSON.');
                }
            };
            reader.readAsText(f);
        };
        input.click();
    };

    const applyTemplate = (val: string) => {
        setSelectedTemplate(val);
        if (val === "vazio") {
            return;
        }
        
        let templateTasks = TEMPLATES[val];
        if (!templateTasks) {
            const custom = customTemplates.find(ct => ct.value === val);
            if (custom) templateTasks = custom.tasks;
        }

        if (templateTasks) {
            const newTasks = templateTasks.map(t => ({ ...t, id: `${t.id}-${Date.now()}`, done: false }));
            setTasks(newTasks);
        }
    };

    if (!mounted) return null;

    const completedCount = tasks.filter(t => t.done).length;
    const progress = tasks.length === 0 ? 0 : Math.round((completedCount / tasks.length) * 100);
    const allOptions = [...TEMPLATES_OPTIONS, ...customTemplates.map(ct => ({ value: ct.value, label: ct.label }))];

    return (
        <div className="flex-1 w-full min-h-screen bg-background text-foreground selection:bg-primary/30 pb-20 font-sans">
            <div className="max-w-[1400px] mx-auto px-6 py-8 md:py-12 text-center animate-fade-up">
                <div className="inline-flex items-center gap-3 mb-4">
                    <div className="size-12 rounded-2xl bg-gradient-to-tr from-primary to-primary/60 flex items-center justify-center text-primary-foreground shadow-lg">
                        <ListTodo size={28} />
                    </div>
                </div>
                <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-3">
                    Meu <span className="text-primary">Checklist</span>
                </h1>
                <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                    Um ambiente focado. Crie, gerencie e organize os micro-processos do seu departamento.
                </p>
            </div>

            <div className="max-w-[800px] mx-auto px-6 animate-fade-up" style={{ animationDelay: '80ms' }}>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div className="flex-1 w-full sm:max-w-[400px] flex items-center gap-2">
                        <Button 
                            variant="outline" size="icon" 
                            onClick={() => {
                                if (tasks.length === 0) {
                                    toast.error("A lista atual está vazia. Adicione tarefas antes de salvar.");
                                    return;
                                }
                                setIsSavingTemplate(true);
                            }}
                            className="shrink-0 h-9 w-9 text-primary border-primary/20 hover:bg-primary/10 transition-colors"
                            title="Salvar Lista Atual como Template"
                        >
                            <Plus size={18} />
                        </Button>
                        <Select value={selectedTemplate} onValueChange={applyTemplate}>
                            <SelectTrigger className="h-9 w-full bg-card border-border">
                                <SelectValue placeholder="Carregar Template..." />
                            </SelectTrigger>
                            <SelectContent>
                                {allOptions.map(opt => (
                                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto">
                        <Button variant="outline" size="sm" onClick={() => setIsExportDialogOpen(true)} className="h-9 px-4 flex-1 sm:flex-initial">
                            <Upload size={16} className="mr-2" /> Exportar
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleImport} className="h-9 px-4 flex-1 sm:flex-initial">
                            <Download size={16} className="mr-2" /> Importar
                        </Button>
                    </div>
                </div>

                {isSavingTemplate && (
                    <div className="mb-6 flex gap-2 animate-fade-down border border-primary/30 bg-primary/5 p-4 rounded-xl shadow-lg relative">
                        <Input
                            placeholder="Nome para novo Template..."
                            value={templateName}
                            onChange={e => setTemplateName(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') handleSaveTemplate(); }}
                            className="flex-1 bg-background"
                            autoFocus
                        />
                        <Button onClick={handleSaveTemplate} className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold">Salvar</Button>
                        <Button variant="outline" onClick={() => { setIsSavingTemplate(false); setTemplateName(""); }}>Cancelar</Button>
                    </div>
                )}

                <div className="bg-card rounded-[24px] border border-border shadow-xl p-6 lg:p-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-border">
                        <div>
                            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                                <ListTodo size={24} className="text-primary" />
                                Suas Tarefas
                            </h2>
                            {tasks.length > 0 && (
                                <p className="text-sm font-medium text-muted-foreground mt-1">
                                    Progresso: {progress}% ({completedCount}/{tasks.length})
                                </p>
                            )}
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                            {selectedTemplate.startsWith("custom_") && (
                                <Button 
                                    variant="ghost" size="icon" 
                                    onClick={() => setTemplateToDelete(selectedTemplate)} 
                                    className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors mr-2"
                                    title="Excluir Lista Salva"
                                >
                                    <Trash2 size={16} />
                                </Button>
                            )}
                            <Button variant="ghost" size="sm" onClick={() => setIsClearDialogOpen(true)} className="h-8 text-destructive hover:bg-destructive/10 hover:text-destructive">
                                <RotateCcw size={14} className="mr-1.5" /> Limpar
                            </Button>
                            <Button variant="ghost" size="sm" onClick={handleUncheckAll} className="h-8 text-primary hover:bg-primary/10 hover:text-primary border border-primary/20">
                                <SquareDashed size={14} className="mr-1.5" /> Desmarcar
                            </Button>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 min-h-[100px]">
                        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd} modifiers={[restrictToVerticalAxis]}>
                            <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                                {tasks.map((task, i) => (
                                    <SortableTask
                                        key={task.id} task={task} index={i}
                                        onToggle={toggleTask} onEdit={editTask} onDelete={deleteTask}
                                    />
                                ))}
                            </SortableContext>
                        </DndContext>

                        {/* Dashed "+ Adicionar" Inline Button */}
                        <button
                            onClick={handleAddTask}
                            className="flex items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed border-muted-foreground/20 bg-muted/30 text-muted-foreground hover:text-foreground hover:bg-muted/50 hover:border-muted-foreground/40 transition-all cursor-pointer outline-none mt-2 group"
                        >
                            <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                                <Plus size={18} strokeWidth={2.5} />
                            </div>
                            <span className="font-bold text-sm uppercase tracking-widest">Nova Tarefa</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Dialogs and Alerts */}
            <ConfirmDialog 
                isOpen={isClearDialogOpen}
                onClose={() => setIsClearDialogOpen(false)}
                onConfirm={handleClearAll}
                title="Limpar Checklist"
                description="Você tem certeza que deseja limpar completamente a lista atual? Isto apagará todas as tarefas em tela. Esta ação não pode ser desfeita."
                confirmText="Limpar Tudo"
                variant="destructive"
            />

            <ConfirmDialog 
                isOpen={!!templateToDelete}
                onClose={() => setTemplateToDelete(null)}
                onConfirm={() => templateToDelete && handleDeleteTemplate(templateToDelete)}
                title="Excluir Template"
                description="Tem certeza que deseja excluir este formato salvo permanentemente? Você não poderá recuperá-lo depois."
                confirmText="Excluir Template"
                variant="destructive"
            />

            <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
                <DialogContent className="border-border bg-card shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold">Exportar Lista</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <Label className="block mb-2 font-semibold">Nome para o arquivo:</Label>
                        <Input 
                            value={exportName}
                            onChange={(e) => setExportName(e.target.value)}
                            placeholder="Ex: Minha Lista de Onboarding"
                            className="bg-background border-border"
                            autoFocus
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsExportDialogOpen(false)}>Cancelar</Button>
                        <Button onClick={handleExport} className="bg-primary hover:bg-primary/90">Baixar Arquivo</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default function MeuChecklistPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-background text-foreground flex items-center justify-center">Carregando meu checklist...</div>}>
            <MeuChecklistContent />
        </Suspense>
    );
}

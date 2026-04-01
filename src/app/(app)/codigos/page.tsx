"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import { 
  Code2, 
  Search, 
  Plus, 
  LayoutGrid, 
  List, 
  ArrowUpDown, 
  ChevronRight, 
  Home, 
  MoreHorizontal, 
  X, 
  Flame, 
  Copy, 
  Maximize2, 
  FileCode, 
  Trash2, 
  Edit3, 
  Check,
  ImageIcon,
  Star,
  Upload,
  User
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { useSession } from "next-auth/react"
import { saveCodigoAction, deleteCodigoAction, toggleLikeAction } from "./actions"

// ═══════════════════ TYPES ═══════════════════
type Post = {
  id: string
  title: string
  author: string
  date: string
  language: string
  code: string
  imageUrl: string | null;
  isGif: boolean
  tags: string[]
  reactions: { fire: number }
  observations?: string
  userId?: string
}

const ALL_TAGS = ['CSS', 'HTML', 'JS', 'Botão', 'Texto', 'Animação', 'PHP', 'Carrossel', 'Background', 'Formulário', 'Hover'];

const AVATAR_COLORS = [
  '#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981',
  '#EF4444', '#6366F1', '#14B8A6', '#F97316', '#06B6D4'
];

const FAVORITES_KEY = "ts_codes_favorites_v2";
const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB

// ═══════════════════ UTILS ═══════════════════
function getAvatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function getInitials(name: string) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

function timeAgo(dateString: string) {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Algum tempo';
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (minutes < 1) return 'Agora';
  if (minutes < 60) return `Há ${minutes}min`;
  if (hours < 24) return `Há ${hours}h`;
  if (days < 30) return `Há ${days}d`;
  return `Há +30d`;
}

// ═══════════════════ COMPONENTS ═══════════════════

export default function CodigosPage() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<Post[]>([])
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  
  // New Post State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPost, setEditingPost] = useState<Post | null>(null)
  const [customTagInput, setCustomTagInput] = useState('')
  const [showCustomTagInput, setShowCustomTagInput] = useState(false)
  const thumbnailInputRef = useRef<HTMLInputElement>(null)

  const [newPostData, setNewPostData] = useState({
    title: '',
    language: 'html',
    code: '',
    tags: [] as string[],
    imageUrl: null as string | null,
    imageFile: null as File | null,
    isGif: false,
    observations: ''
  })

  // Fullscreen Code State
  const [isFullscreenCodeOpen, setIsFullscreenCodeOpen] = useState(false)

  const isAdmin = (session?.user as any)?.role === "admin";
  const currentUser = session?.user?.name || "Usuário";

  // Persistent Storage Init
  useEffect(() => {
    // Fetch posts from API
    fetch('/api/codigos')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setPosts(data);
      })
      .catch(err => console.error("Failed to fetch snippets", err));

    const storedFavs = localStorage.getItem(FAVORITES_KEY);
    if (storedFavs) {
      try {
        setFavorites(new Set(JSON.parse(storedFavs)));
      } catch (e) {
        console.error("Failed to parse favorites", e);
      }
    }
  }, []);

  // Fav Persistence
  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(Array.from(favorites)));
  }, [favorites]);

  // Filtered Posts
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      // Improved tag matching (case insensitive and also checks language)
      const matchesTag = !activeTag || 
        post.tags.some(t => t.toLowerCase() === activeTag.toLowerCase()) ||
        post.language.toLowerCase() === activeTag.toLowerCase();

      const matchesSearch = !searchTerm || 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase())) ||
        post.language.toLowerCase().includes(searchTerm.toLowerCase());
        
      return matchesTag && matchesSearch;
    }).sort((a, b) => {
      // 1. Favorites First
      const aFav = favorites.has(a.id) ? 0 : 1;
      const bFav = favorites.has(b.id) ? 0 : 1;
      if (aFav !== bFav) return aFav - bFav;
      
      // 2. Ranking by Likes (Fire count)
      const bFire = b.reactions.fire || 0;
      const aFire = a.reactions.fire || 0;
      if (bFire !== aFire) return bFire - aFire;
      
      // 3. Newest First
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }, [posts, activeTag, searchTerm, favorites]);

  // Handlers
  const handleToggleReaction = async (postId: string) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    const newFire = post.reactions.fire > 0 ? 0 : 1;
    const updated = { ...post, reactions: { fire: newFire } };

    // Update state purely
    setPosts(prev => prev.map(p => p.id === postId ? updated : p));
    if (selectedPost?.id === postId) setSelectedPost(updated);

    // Persist via Server Action
    try {
      await toggleLikeAction(postId, newFire);
    } catch (err) {
      console.error("Failed to sync reaction:", err);
    }
  }

  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        toast("Removido dos favoritos", { icon: "🗑️" });
      } else {
        next.add(id);
        toast("Adicionado aos favoritos", { icon: "⭐" });
      }
      return next;
    });
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      toast.success("Código copiado!")
    })
  }

  const handleSavePost = async () => {
    if (!newPostData.title || !newPostData.code) {
      toast.error("Preencha o título e o código!")
      return
    }

    try {
      let finalImageUrl = newPostData.imageUrl;

      // 1. If there's a file, upload via server-side API route (avoids NEXT_PUBLIC build-time dependency)
      if (newPostData.imageFile) {
        const toastId = toast.loading("Fazendo upload da imagem...");

        const uploadForm = new FormData();
        uploadForm.append("file", newPostData.imageFile);

        const uploadResponse = await fetch('/api/codigos/upload', {
          method: 'POST',
          body: uploadForm,
        });

        toast.dismiss(toastId);

        if (!uploadResponse.ok) {
          const err = await uploadResponse.json().catch(() => ({}));
          throw new Error(err.error || "Falha no upload para o Supabase");
        }

        // 2. Get Public URL from server response
        const { url } = await uploadResponse.json();
        finalImageUrl = url;
      }

      // 3. Save to database via Server Action (now only sending metadata and URL)
      const formData = new FormData();
      formData.append("title", newPostData.title);
      formData.append("language", newPostData.language);
      formData.append("code", newPostData.code);
      formData.append("tags", JSON.stringify(newPostData.tags));
      formData.append("isGif", newPostData.isGif.toString());
      formData.append("observations", newPostData.observations);
      if (finalImageUrl) {
        formData.append("imageUrl", finalImageUrl);
      }

      const saved = await saveCodigoAction(formData, editingPost?.id);
      
      if (editingPost) {
        setPosts(prev => prev.map(p => p.id === (saved as any).id ? (saved as any) : p));
        toast.success("Post atualizado!");
      } else {
        setPosts(prev => [(saved as any), ...prev]);
        toast.success("Post publicado!");
      }

      setIsModalOpen(false)
      setEditingPost(null)
      setNewPostData({
        title: '',
        language: 'html',
        code: '',
        tags: [],
        imageUrl: null,
        imageFile: null,
        isGif: false,
        observations: ''
      })
      setShowCustomTagInput(false)
    } catch (e: any) {
      toast.error(`Erro: ${e.message}`);
      console.error(e);
    }
  }

  const handleDeletePost = async (id: string) => {
    try {
      await deleteCodigoAction(id);
      setPosts(prev => prev.filter(p => p.id !== id))
      setSelectedPost(null)
      toast.success("Post removido!")
    } catch (e: any) {
      toast.error(`Erro: ${e.message}`);
    }
  }

  const handleEditPost = (post: Post) => {
    setEditingPost(post)
    setNewPostData({
      title: post.title,
      language: post.language,
      code: post.code,
      tags: post.tags,
      imageUrl: post.imageUrl,
      imageFile: null,
      isGif: post.isGif || false,
      observations: post.observations || ''
    })
    setIsModalOpen(true)
    setSelectedPost(null)
  }

  const handleUploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`Arquivo muito grande (máx ${MAX_FILE_SIZE / (1024 * 1024)}MB)`);
        return;
      }
      const reader = new FileReader();
      reader.onload = (ev) => {
        setNewPostData({
          ...newPostData,
          imageFile: file,
          imageUrl: ev.target?.result as string,
          isGif: file.type === "image/gif"
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const canEdit = (post: Post) => {
    return isAdmin || post.author === currentUser;
  }

  return (
    <div className="flex-1 w-full max-w-6xl mx-auto px-4 py-8 animate-fade-up">

      {/* Hero Section */}
      <section className="relative mb-12 flex flex-col items-center text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary/10 blur-[100px] -z-10 rounded-full"></div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold mb-4">
          <Code2 size={12} /> DEPARTAMENTO WEB
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight text-foreground/90">
          Biblioteca de <span className="text-primary truncate">Códigos</span>
        </h1>
        <p className="text-muted-foreground text-sm max-w-lg font-medium">
          Snippets, componentes e soluções prontas compartilhadas pela equipe Web & TI.
        </p>
      </section>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input 
            placeholder="Buscar ou criar postagem..." 
            className="pl-10 bg-card border-border"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button 
          onClick={() => {
            setEditingPost(null);
            setNewPostData({
              title: '',
              language: 'html',
              code: '',
              tags: [],
              imageUrl: null,
              imageFile: null,
              isGif: false,
              observations: ''
            });
            setIsModalOpen(true);
          }}
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl shadow-lg shadow-primary/10"
        >
          <Plus size={18} /> Nova postagem
        </Button>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 overflow-hidden">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          <Button 
            variant={!activeTag ? "secondary" : "ghost"} 
            size="sm"
            onClick={() => setActiveTag(null)}
            className="rounded-full text-xs font-bold shrink-0"
          >
            Todos
          </Button>
          {ALL_TAGS.map(tag => (
            <Button 
              key={tag}
              variant={activeTag === tag ? "secondary" : "ghost"} 
              size="sm"
              onClick={() => setActiveTag(tag === activeTag ? null : tag)}
              className="rounded-full text-xs font-bold whitespace-nowrap shrink-0"
            >
              {tag}
            </Button>
          ))}
        </div>
        
        <div className="flex items-center gap-2 bg-card p-1 rounded-xl border border-border">
          <Button 
            variant={viewMode === 'grid' ? "secondary" : "ghost"} 
            size="icon" 
            className="h-8 w-8 rounded-lg"
            onClick={() => setViewMode('grid')}
          >
            <LayoutGrid size={16} />
          </Button>
          <Button 
            variant={viewMode === 'list' ? "secondary" : "ghost"} 
            size="icon" 
            className="h-8 w-8 rounded-lg"
            onClick={() => setViewMode('list')}
          >
            <List size={16} />
          </Button>
          <div className="w-px h-4 bg-border mx-1"></div>
          <Button variant="ghost" size="sm" className="text-xs font-bold" onClick={() => {
             const sorted = [...posts].sort((a, b) => (b.reactions.fire || 0) - (a.reactions.fire || 0));
             setPosts(sorted);
             toast.info("Ordenado por populares (likes)");
          }}>
            <Flame size={14} className="mr-1" /> Relevância
          </Button>
        </div>
      </div>

      {/* Grid / List View */}
      {filteredPosts.length > 0 ? (
        <div className={cn(
          "grid gap-6",
          viewMode === 'grid' ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
        )}>
          {filteredPosts.map((post, index) => (
            <div 
              key={post.id} 
              className={cn(
                "group bg-card border rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-300 cursor-pointer flex flex-col shadow-sm hover:shadow-2xl hover:shadow-primary/5 relative scale-in",
                viewMode === 'list' ? "md:flex-row h-auto md:h-44" : "h-[420px]",
                favorites.has(post.id) ? "border-primary/30 ring-1 ring-primary/10" : "border-border"
              )}
              style={{ animationDelay: `${index * 50}ms` }}
              onClick={() => setSelectedPost(post)}
            >
              {/* Favorite Button on Card */}
              <button 
                onClick={(e) => toggleFavorite(e, post.id)}
                className={cn(
                  "absolute top-3 right-3 p-2.5 rounded-xl backdrop-blur-md transition-all duration-300 z-20",
                  favorites.has(post.id) 
                    ? "text-yellow-400 bg-yellow-400/20 border border-yellow-400/30" 
                    : "text-white/70 bg-black/40 border border-white/10 hover:text-white hover:bg-black/60 shadow-lg opacity-0 group-hover:opacity-100"
                )}
              >
                <Star size={18} className={favorites.has(post.id) ? "fill-current" : ""} />
              </button>

              {/* Card Preview */}
              <div className={cn(
                "relative overflow-hidden bg-muted flex items-center justify-center",
                viewMode === 'list' ? "w-full md:w-56 shrink-0 border-b md:border-b-0 md:border-r border-border" : "h-48 shrink-0 border-b border-border"
              )}>
                {post.imageUrl ? (
                  <>
                    {post.isGif && <span className="absolute top-2 left-2 bg-primary/80 text-primary-foreground text-[10px] font-extrabold px-2 py-0.5 rounded uppercase z-10 shadow-lg tracking-widest">GIF</span>}
                    <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100" />
                  </>
                ) : (
                  <div className="w-full h-full p-6 overflow-hidden relative group-hover:bg-primary/5 transition-colors">
                    <div className="flex items-center justify-between mb-3 text-[10px] font-extrabold text-muted-foreground/40 uppercase tracking-widest">
                       <span>PREVIEW {post.language.toUpperCase()}</span>
                    </div>
                    <pre className="text-[10px] text-muted-foreground/60 font-mono leading-relaxed opacity-60 group-hover:opacity-100 transition-opacity">
                      <code>{post.code.split('\n').slice(0, 8).join('\n')}</code>
                    </pre>
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className={cn(
                "p-5 flex flex-col flex-1",
                viewMode === 'list' && "justify-between"
              )}>
                <div className="flex items-center justify-between mb-3 text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] border border-white/10" style={{ background: getAvatarColor(post.author) }}>
                      {getInitials(post.author)}
                    </div>
                    <span className="font-bold text-foreground/70">{post.author}</span>
                  </div>
                  <span className="opacity-60">{timeAgo(post.date)}</span>
                </div>

                <h3 className={cn(
                  "font-bold group-hover:text-primary transition-colors line-clamp-2 leading-tight",
                  viewMode === 'grid' ? "text-lg mb-4" : "text-lg md:text-xl"
                )}>{post.title}</h3>
                
                <div className="flex flex-wrap gap-1.5 min-h-[22px] mt-2 mb-1">
                  {post.tags.slice(0, 5).map(tag => (
                    <span key={tag} className="text-[9px] font-extrabold text-muted-foreground/60 bg-muted px-2.5 py-1 rounded-lg uppercase tracking-wider">{tag}</span>
                  ))}
                  {post.tags.length > 5 && (
                    <span className="text-[9px] font-extrabold text-muted-foreground/60 bg-muted px-2.5 py-1 rounded-lg uppercase tracking-wider">+{post.tags.length - 5}</span>
                  )}
                  {post.tags.length === 0 && <div className="h-5 opacity-0 invisible" aria-hidden="true" />}
                </div>

                <div className={cn(
                  "pt-4 border-t border-border/50 flex items-center justify-between",
                  viewMode === 'grid' ? "mt-6" : "mt-4"
                )}>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground font-extrabold tracking-widest">
                    <FileCode size={16} className="text-primary/70" /> {post.language.toUpperCase()}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className={cn("h-9 w-9 rounded-xl hover:bg-primary/10 transition-all", post.reactions.fire > 0 && "text-primary")}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleReaction(post.id);
                      }}
                    >
                      <Flame size={18} fill={post.reactions.fire > 0 ? "currentColor" : "none"} className={post.reactions.fire > 0 ? "drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]" : ""} />
                      {post.reactions.fire > 0 && <span className="ml-1 text-[11px] font-bold">{post.reactions.fire}</span>}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center bg-card rounded-3xl border border-border border-dashed animate-fade-up">
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-6">
            <Code2 size={32} className="text-muted-foreground/20" />
          </div>
          <h3 className="text-xl font-bold mb-2">A biblioteca está vazia</h3>
          <p className="text-muted-foreground mt-2 text-sm max-w-xs mx-auto">
            Tente ajustar seus filtros ou seja o primeiro a compartilhar um código!
          </p>
        </div>
      )}

      {/* Sheet para detalhes do Snippet */}
      <Sheet open={!!selectedPost} onOpenChange={(open) => !open && setSelectedPost(null)}>
        <SheetContent side="right" className="sm:max-w-[70vw] md:max-w-4xl h-full p-0 border-border bg-card overflow-hidden flex flex-col">
          {selectedPost && (
            <div className="flex flex-col h-full overflow-y-auto custom-scrollbar">
              <SheetHeader className="p-8 border-b bg-muted/20">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex flex-col gap-2">
                    <div className="inline-flex items-center gap-1.5 text-[10px] font-black text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-lg self-start">
                       <FileCode size={12} /> {selectedPost.language}
                    </div>
                    <SheetTitle className="text-3xl font-black leading-tight tracking-tight mt-2">
                      {selectedPost.title}
                    </SheetTitle>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className={cn("rounded-2xl transition-all h-14 w-14 shrink-0", favorites.has(selectedPost.id) ? "text-yellow-400 bg-yellow-400/10 border border-yellow-400/20 shadow-lg shadow-yellow-400/10" : "text-muted-foreground bg-muted border border-border")}
                    onClick={(e) => toggleFavorite(e, selectedPost.id)}
                  >
                    <Star size={28} className={favorites.has(selectedPost.id) ? "fill-current" : ""} />
                  </Button>
                </div>
                <div className="flex items-center gap-4 mt-6">
                   <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-sm text-white font-black border border-white/10 shadow-xl" style={{ background: getAvatarColor(selectedPost.author) }}>
                      {getInitials(selectedPost.author)}
                    </div>
                    <div>
                      <p className="font-black text-foreground text-lg tracking-tight">{selectedPost.author}</p>
                      <p className="text-muted-foreground text-[11px] uppercase font-bold tracking-widest mt-0.5 opacity-60">{timeAgo(selectedPost.date)}</p>
                    </div>
                </div>
              </SheetHeader>

              <div className="px-8 py-8 space-y-10 flex-1">
                {selectedPost.imageUrl && (
                  <div className="relative group rounded-3xl overflow-hidden border border-border shadow-2xl max-w-lg mx-auto">
                    <div className="absolute inset-0 bg-primary/20 blur-[100px] opacity-0 group-hover:opacity-20 transition-opacity -z-10" />
                    <img src={selectedPost.imageUrl} alt={selectedPost.title} className="w-full max-h-[320px] object-cover transition-transform duration-700 group-hover:scale-105" />
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                   {selectedPost.tags.map(tag => (
                      <span key={tag} className="text-[10px] font-black text-muted-foreground/80 bg-muted/50 border border-border/50 px-4 py-2 rounded-xl uppercase tracking-widest hover:border-primary/30 transition-colors">{tag}</span>
                   ))}
                </div>

                {selectedPost.observations && (
                  <div className="bg-primary/5 border border-primary/20 p-6 rounded-3xl animate-fade-up">
                    <h4 className="text-[10px] font-black text-primary uppercase tracking-widest mb-3 flex items-center gap-2">
                      <MoreHorizontal size={14} /> Observações Técnicas
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed italic whitespace-pre-wrap">
                      {selectedPost.observations}
                    </p>
                  </div>
                )}

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                      Fonte {selectedPost.language.toUpperCase()}
                    </h4>
                    <div className="flex items-center gap-2">
                       <Button variant="outline" size="sm" className="h-10 px-4 border-border bg-card hover:border-primary/50 hover:text-primary transition-all rounded-xl font-bold gap-2" onClick={() => handleCopyCode(selectedPost.code)}>
                          <Copy size={16} /> Copiar
                       </Button>
                       <Button variant="outline" size="sm" className="h-10 px-4 border-border bg-card hover:border-primary/50 hover:text-primary transition-all rounded-xl font-bold gap-2" onClick={() => setIsFullscreenCodeOpen(true)}>
                          <Maximize2 size={16} /> Tela Cheia
                       </Button>
                    </div>
                  </div>
                  <div className="relative group overflow-hidden rounded-3xl border border-border shadow-2xl bg-[#0c0c0c]">
                    <pre className="p-8 text-[13px] font-mono overflow-x-auto custom-scrollbar max-h-[500px] leading-relaxed text-foreground/80 min-h-[200px]">
                      <code>{selectedPost.code}</code>
                    </pre>
                  </div>
                </div>

                {canEdit(selectedPost) && (
                  <div className="flex items-center gap-3 pt-4">
                    <Button variant="ghost" size="sm" className="rounded-xl font-black gap-2 text-muted-foreground hover:text-primary hover:bg-primary/5 px-5 h-12 border border-transparent hover:border-primary/20 transition-all" onClick={() => handleEditPost(selectedPost)}>
                      <Edit3 size={18} /> Editar Snippet
                    </Button>
                    <Button variant="ghost" size="sm" className="rounded-xl font-black gap-2 text-muted-foreground hover:text-destructive hover:bg-destructive/5 px-5 h-12 border border-transparent hover:border-destructive/20 transition-all" onClick={() => handleDeletePost(selectedPost.id)}>
                      <Trash2 size={18} /> Excluir
                    </Button>
                  </div>
                )}
              </div>

              <div className="p-8 mt-auto border-t border-border bg-muted/10 flex items-center justify-between">
                  <Button 
                    variant={selectedPost.reactions.fire > 0 ? "secondary" : "ghost"} 
                    size="lg" 
                    className={cn(
                      "rounded-2xl font-black gap-3 h-14 px-10 shadow-xl active:scale-95 transition-all text-lg",
                      selectedPost.reactions.fire > 0 && "bg-primary/20 text-primary border-primary/30"
                    )}
                    onClick={() => handleToggleReaction(selectedPost.id)}
                  >
                    <Flame 
                      size={24} 
                      fill={selectedPost.reactions.fire > 0 ? "currentColor" : "none"} 
                      className={cn(
                        "transition-all",
                        selectedPost.reactions.fire > 0 ? "text-primary drop-shadow-[0_0_12px_rgba(245,158,11,0.8)] scale-110" : "text-muted-foreground"
                      )} 
                    /> 
                    <span>
                      {selectedPost.reactions.fire > 0 ? selectedPost.reactions.fire : "Curtir Snippet"}
                    </span>
                  </Button>
                
                <Button variant="outline" onClick={() => setSelectedPost(null)} className="rounded-2xl font-black h-14 px-8 border-border">Fechar</Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Modal Nova Postagem */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl border-border bg-card shadow-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-2xl font-black tracking-tight">
              {editingPost ? <Edit3 className="text-primary h-7 w-7" /> : <Plus className="text-primary h-7 w-7" />}
              {editingPost ? 'Editar Postagem' : 'Nova Postagem'}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-8 py-6 max-h-[70vh] overflow-y-auto px-1 custom-scrollbar">
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground/70">Título do Post</label>
              <Input 
                placeholder="Ex: Menu fixo com scroll suave" 
                value={newPostData.title}
                onChange={(e) => setNewPostData({...newPostData, title: e.target.value})}
                className="bg-input border-border focus:border-primary/50 h-12 font-bold px-4 rounded-xl"
              />
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground/70">Linguagem do Snippet</label>
              <Select value={newPostData.language} onValueChange={(v) => setNewPostData({...newPostData, language: v})}>
                <SelectTrigger className="bg-input h-14 font-bold border-border rounded-xl px-4">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="html">HTML</SelectItem>
                  <SelectItem value="css">CSS</SelectItem>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="php">PHP</SelectItem>
                  <SelectItem value="python">Python</SelectItem>
                  <SelectItem value="typescript">TypeScript</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
               <label className="text-xs font-black uppercase tracking-widest text-muted-foreground/70">Código Fonte</label>
               <Textarea 
                placeholder="Cole seu código aqui..." 
                className="font-mono text-xs min-h-64 bg-[#0c0c0c] custom-scrollbar rounded-2xl border-border p-6 leading-relaxed"
                value={newPostData.code}
                onChange={(e) => setNewPostData({...newPostData, code: e.target.value})}
               />
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground/70">Thumbnail (Poster Visual)</label>
              <div 
                onClick={() => thumbnailInputRef.current?.click()}
                className={cn(
                  "relative h-44 rounded-2xl border-2 border-dashed border-border/60 flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all overflow-hidden bg-muted/20",
                  newPostData.imageUrl && "border-solid border-primary/40 ring-4 ring-primary/5 shadow-2xl"
                )}
              >
                {newPostData.imageUrl ? (
                  <>
                    <img src={newPostData.imageUrl} className="w-full h-full object-cover" alt="Preview" />
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity backdrop-blur-sm">
                       <Button variant="secondary" size="sm" className="rounded-xl font-black gap-2 h-10 px-6 bg-white text-black hover:bg-white/90">
                         <Upload size={16} /> Trocar Imagem
                       </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-14 h-14 rounded-2xl bg-card border border-border flex items-center justify-center text-muted-foreground shadow-sm group-hover:scale-110 transition-transform">
                      <ImageIcon size={28} />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-black tracking-tight">Upload de Imagem ou GIF</p>
                      <p className="text-[10px] text-muted-foreground font-bold tracking-widest mt-1 uppercase">Clique para selecionar — máx 25MB</p>
                    </div>
                  </>
                )}
                <input 
                  type="file" 
                  ref={thumbnailInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleUploadImage}
                />
              </div>
            </div>

            <div className="space-y-5">
               <label className="text-xs font-black uppercase tracking-widest text-muted-foreground/70">Classificação (Tags)</label>
               <div className="flex flex-wrap gap-2.5 mb-2 min-h-[40px]">
                  {newPostData.tags.map(tag => (
                    <span key={tag} className="flex items-center gap-2 bg-primary/10 text-primary text-[10px] font-black px-3.5 py-2 rounded-xl border border-primary/30 animate-fade-up shadow-sm">
                      {tag}
                      <button onClick={(e) => { e.stopPropagation(); setNewPostData({...newPostData, tags: newPostData.tags.filter(t => t !== tag)})}} className="hover:text-foreground/50 transition-colors">
                         <X size={12} />
                      </button>
                    </span>
                  ))}
               </div>
               <div className="flex flex-wrap gap-2">
                  {ALL_TAGS.map(tag => (
                    <Button 
                      key={tag} 
                      type="button"
                      variant="outline" 
                      size="sm" 
                      className={cn("h-9 px-5 text-[10px] rounded-xl font-black transition-all border-border hover:border-primary/50", newPostData.tags.includes(tag) && "bg-primary text-black border-primary scale-95 shadow-lg shadow-primary/20")}
                      onClick={() => {
                        const tags = newPostData.tags.includes(tag) 
                          ? newPostData.tags.filter(t => t !== tag)
                          : [...newPostData.tags, tag];
                        setNewPostData({...newPostData, tags});
                      }}
                    >
                      {tag}
                    </Button>
                  ))}
                  <Button 
                    type="button"
                    variant="outline" 
                    size="sm" 
                    className={cn("h-9 px-5 text-[10px] rounded-xl font-black border-dashed border-primary/30 text-primary hover:bg-primary/5", showCustomTagInput && "bg-primary text-black border-primary")}
                    onClick={() => setShowCustomTagInput(!showCustomTagInput)}
                  >
                    + Personalizada
                  </Button>
               </div>
               
               {showCustomTagInput && (
                 <div className="flex gap-2 animate-fade-up">
                   <Input 
                    placeholder="Digite a nova tag..." 
                    className="h-11 text-xs bg-input font-bold px-4"
                    value={customTagInput}
                    onChange={(e) => setCustomTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (customTagInput.trim()) {
                           setNewPostData({...newPostData, tags: [...newPostData.tags, customTagInput.trim()]});
                           setCustomTagInput('');
                           setShowCustomTagInput(false);
                           toast.success("Tag adicionada!");
                        }
                      }
                    }}
                   />
                   <Button 
                    size="sm" 
                    className="bg-primary hover:bg-primary/90 text-black font-black h-11 px-6 rounded-xl"
                    onClick={() => {
                      if (customTagInput.trim()) {
                        setNewPostData({...newPostData, tags: [...newPostData.tags, customTagInput.trim()]});
                        setCustomTagInput('');
                        setShowCustomTagInput(false);
                      }
                    }}
                   >
                     Adicionar
                   </Button>
                 </div>
               )}
            </div>

            <div className="space-y-4">
               <label className="text-xs font-black uppercase tracking-widest text-muted-foreground/70">Observações (Opcional)</label>
               <Textarea 
                 placeholder="Instruções de uso, dependências ou notas importantes..." 
                 className="min-h-[120px] bg-input border-border rounded-xl text-xs font-medium resize-none focus:border-primary/50 transition-all p-5"
                 value={newPostData.observations}
                 onChange={(e) => setNewPostData({...newPostData, observations: e.target.value})}
               />
            </div>
          </div>

          <DialogFooter className="border-t border-border pt-8 mt-2 flex flex-col sm:flex-row gap-3">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)} className="rounded-xl font-extrabold h-12 px-8 order-2 sm:order-1 opacity-60 hover:opacity-100">Cancelar</Button>
            <Button onClick={handleSavePost} className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-black h-12 px-12 shadow-xl shadow-primary/20 active:scale-95 transition-all order-1 sm:order-2">
              {editingPost ? 'Salvar Alterações' : 'Publicar no Hub'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Fullscreen Code Modal */}
      <Dialog open={isFullscreenCodeOpen} onOpenChange={setIsFullscreenCodeOpen}>
        <DialogContent className="max-w-[98vw] sm:max-w-[98vw] w-full h-[98vh] border-border bg-card flex flex-col p-0 overflow-hidden shadow-2xl">
          <DialogHeader className="p-8 border-b border-border shrink-0 bg-[#0c0c0c]/50 backdrop-blur-2xl">
            <div className="flex items-center justify-between pr-8">
               <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                    <DialogTitle className="text-3xl font-black tracking-tight">{selectedPost?.title}</DialogTitle>
                  </div>
                  <p className="text-muted-foreground text-xs uppercase font-black tracking-[0.2em] opacity-60">Visualização em Tela Cheia • {selectedPost?.language}</p>
               </div>
               <div className="flex items-center gap-3">
                 <Button variant="outline" className="h-14 px-8 border-border hover:border-primary/50 hover:text-primary transition-all rounded-2xl font-black gap-2 text-lg shadow-xl" onClick={() => handleCopyCode(selectedPost?.code || '')}>
                   <Copy size={20} /> Copiar
                 </Button>
                 <Button variant="secondary" className="h-14 px-8 rounded-2xl font-black text-lg shadow-xl" onClick={() => setIsFullscreenCodeOpen(false)}>Fechar</Button>
               </div>
            </div>
          </DialogHeader>
          <div className="flex-1 overflow-hidden bg-[#0c0c0c] relative">
            <pre className="h-full p-12 text-base font-mono overflow-auto custom-scrollbar leading-loose text-foreground/90 selection:bg-primary/30">
              <code>{selectedPost?.code}</code>
            </pre>
            <div className="absolute bottom-8 right-12 opacity-30 hover:opacity-100 transition-opacity pointer-events-none">
               <Code2 size={120} className="text-primary/5" />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

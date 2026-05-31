import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageShell } from '@/components/layout/PageShell';
import { PageHero } from '@/components/ui-system/PageHero';
import { GlassCard } from '@/components/ui-system/GlassCard';
import { EmptyState } from '@/components/ui-system/EmptyState';
import { Button } from '@/components/ui/button';
import { ImageCard } from '@/components/ImageCard';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Upload, Loader2, Trash2, Edit, Eye, Mail, Users, Plus, BookOpen, Shield, FileX } from 'lucide-react';
import { z } from 'zod';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const journalSchema = z.object({
  title: z.string().trim().min(5, { message: "Sarlavha kamida 5 ta belgidan iborat bo'lishi kerak" }).max(200),
  description: z.string().trim().min(10, { message: "Tavsif kamida 10 ta belgidan iborat bo'lishi kerak" }).max(1000),
});

interface Journal {
  id: string;
  title: string;
  description: string | null;
  pdf_url: string;
  cover_image_url: string | null;
  created_at: string;
}

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

interface BoardMember {
  id: string;
  name: string;
  position: string;
  order_index: number;
  created_at: string;
}

const Admin = () => {
  const navigate = useNavigate();
  const { user, isAdmin, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [journals, setJournals] = useState<Journal[]>([]);
  const [journalsLoading, setJournalsLoading] = useState(true);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });
  const [editingJournal, setEditingJournal] = useState<Journal | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(true);
  const [deletingMessageId, setDeletingMessageId] = useState<string | null>(null);
  const [boardMembers, setBoardMembers] = useState<BoardMember[]>([]);
  const [boardLoading, setBoardLoading] = useState(true);
  const [editingMember, setEditingMember] = useState<BoardMember | null>(null);
  const [memberDialogOpen, setMemberDialogOpen] = useState(false);
  const [memberFormData, setMemberFormData] = useState({
    name: '',
    position: 'Tahrir hay\'ati a\'zosi',
  });

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      toast.error('Ushbu sahifaga kirish uchun admin huquqlari kerak');
      navigate('/');
    } else if (user && isAdmin) {
      fetchJournals();
      fetchMessages();
      fetchBoardMembers();
    }
  }, [user, isAdmin, authLoading, navigate]);

  const fetchJournals = async () => {
    try {
      const { data, error } = await supabase
        .from('journals')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setJournals(data || []);
    } catch (error) {
      console.error('Error fetching journals:', error);
      toast.error('Jurnallarni yuklashda xatolik yuz berdi');
    } finally {
      setJournalsLoading(false);
    }
  };

  const uploadToTelegramCDN = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    const backendUrl = import.meta.env.VITE_BACKEND_URL || '';
    const uploadUrl = backendUrl ? `${backendUrl}/api/upload-file` : '/api/upload-file';

    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Telegram CDN ga yuklashda xatolik yuz berdi');
    }

    const data = await response.json();
    return data.url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!pdfFile) {
      toast.error('PDF fayl tanlash majburiy');
      return;
    }

    setLoading(true);

    try {
      const validatedData = journalSchema.parse(formData);

      // Upload PDF to Telegram CDN
      toast.info('PDF fayl yuklanmoqda, kuting...');
      const pdfUrl = await uploadToTelegramCDN(pdfFile);

      // Upload Cover to Telegram CDN (if exists)
      let coverUrl = null;
      if (coverFile) {
        toast.info('Muqova rasmi yuklanmoqda, kuting...');
        coverUrl = await uploadToTelegramCDN(coverFile);
      }

      // Insert journal record in Supabase
      const { error: insertError } = await supabase
        .from('journals')
        .insert({
          title: validatedData.title,
          description: validatedData.description,
          pdf_url: pdfUrl,
          cover_image_url: coverUrl,
          uploaded_by: user?.id,
        });

      if (insertError) throw insertError;

      toast.success('Jurnal muvaffaqiyatli yuklandi!');
      setFormData({ title: '', description: '' });
      setPdfFile(null);
      setCoverFile(null);
      fetchJournals();
    } catch (error) {
      console.error('Error uploading journal:', error);
      if (error instanceof z.ZodError) {
        error.errors.forEach(err => toast.error(err.message));
      } else {
        toast.error(error instanceof Error ? error.message : 'Jurnal yuklashda xatolik yuz berdi');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (journal: Journal) => {
    setEditingJournal(journal);
    setFormData({
      title: journal.title,
      description: journal.description || '',
    });
    setEditDialogOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingJournal) return;

    setLoading(true);

    try {
      const validatedData = journalSchema.parse(formData);

      let pdfUrl = editingJournal.pdf_url;
      let coverUrl = editingJournal.cover_image_url;

      // Upload new PDF to Telegram CDN if provided
      if (pdfFile) {
        toast.info('Yangi PDF fayl yuklanmoqda...');
        pdfUrl = await uploadToTelegramCDN(pdfFile);
      }

      // Upload new cover to Telegram CDN if provided
      if (coverFile) {
        toast.info('Yangi muqova rasmi yuklanmoqda...');
        coverUrl = await uploadToTelegramCDN(coverFile);
      }

      // Update journal record in Supabase
      const { error: updateError } = await supabase
        .from('journals')
        .update({
          title: validatedData.title,
          description: validatedData.description,
          pdf_url: pdfUrl,
          cover_image_url: coverUrl,
        })
        .eq('id', editingJournal.id);

      if (updateError) throw updateError;

      toast.success('Jurnal muvaffaqiyatli yangilandi!');
      setFormData({ title: '', description: '' });
      setPdfFile(null);
      setCoverFile(null);
      setEditingJournal(null);
      setEditDialogOpen(false);
      fetchJournals();
    } catch (error) {
      console.error('Error updating journal:', error);
      if (error instanceof z.ZodError) {
        error.errors.forEach(err => toast.error(err.message));
      } else {
        toast.error(error instanceof Error ? error.message : 'Jurnal yangilashda xatolik yuz berdi');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (journalId: string) => {
    try {
      const { error } = await supabase
        .from('journals')
        .delete()
        .eq('id', journalId);

      if (error) throw error;

      toast.success('Jurnal muvaffaqiyatli o\'chirildi!');
      fetchJournals();
    } catch (error) {
      console.error('Error deleting journal:', error);
      toast.error('Jurnal o\'chirishda xatolik yuz berdi');
    }
  };

  const handleView = (pdfUrl: string) => {
    window.open(pdfUrl, '_blank');
  };

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Xabarlarni yuklashda xatolik yuz berdi');
    } finally {
      setMessagesLoading(false);
    }
  };

  const handleDeleteMessage = async (id: string) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Xabar o\'chirildi');
      fetchMessages();
    } catch (error) {
      console.error('Error deleting message:', error);
      toast.error('Xabarni o\'chirishda xatolik yuz berdi');
    } finally {
      setDeletingMessageId(null);
    }
  };

  const fetchBoardMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('editorial_board')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      setBoardMembers(data || []);
    } catch (error) {
      console.error('Error fetching board members:', error);
      toast.error('Tahrir hay\'ati a\'zolarini yuklashda xatolik');
    } finally {
      setBoardLoading(false);
    }
  };

  const handleAddMember = () => {
    setEditingMember(null);
    setMemberFormData({ name: '', position: 'Tahrir hay\'ati a\'zosi' });
    setMemberDialogOpen(true);
  };

  const handleEditMember = (member: BoardMember) => {
    setEditingMember(member);
    setMemberFormData({ name: member.name, position: member.position });
    setMemberDialogOpen(true);
  };

  const handleSaveMember = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!memberFormData.name.trim()) {
      toast.error('Ism kiritish majburiy');
      return;
    }

    setLoading(true);

    try {
      if (editingMember) {
        // Update existing member
        const { error } = await supabase
          .from('editorial_board')
          .update({
            name: memberFormData.name.trim(),
            position: memberFormData.position,
          })
          .eq('id', editingMember.id);

        if (error) throw error;
        toast.success('A\'zo muvaffaqiyatli yangilandi');
      } else {
        // Add new member
        const maxOrder = boardMembers.length > 0
          ? Math.max(...boardMembers.map(m => m.order_index))
          : 0;

        const { error } = await supabase
          .from('editorial_board')
          .insert({
            name: memberFormData.name.trim(),
            position: memberFormData.position,
            order_index: maxOrder + 1,
          });

        if (error) throw error;
        toast.success('A\'zo muvaffaqiyatli qo\'shildi');
      }

      setMemberDialogOpen(false);
      setMemberFormData({ name: '', position: 'Tahrir hay\'ati a\'zosi' });
      fetchBoardMembers();
    } catch (error) {
      console.error('Error saving member:', error);
      toast.error('Xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMember = async (id: string) => {
    try {
      const { error } = await supabase
        .from('editorial_board')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('A\'zo o\'chirildi');
      fetchBoardMembers();
    } catch (error) {
      console.error('Error deleting member:', error);
      toast.error('A\'zoni o\'chirishda xatolik');
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  const labelClass = 'block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2';
  const fieldClass = 'rounded-xl bg-secondary/30 border-border focus-visible:ring-1 focus-visible:ring-primary shadow-none text-sm';

  return (
    <PageShell>
      <PageHero
        eyebrow="Boshqaruv markazi"
        title="Admin Panel"
        description="Jurnallar, foydalanuvchi xabarlari va tahrir hay'ati a'zolarini shu yerdan boshqaring."
        icon={Shield}
        size="sm"
      />

      <section className="py-16 md:py-20">
        <div className="container mx-auto px-6 max-w-6xl">
          <Tabs defaultValue="journals" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-10 rounded-full bg-secondary p-1 h-12">
              <TabsTrigger value="journals" className="rounded-full text-xs font-bold uppercase tracking-wider">Jurnallar</TabsTrigger>
              <TabsTrigger value="messages" className="rounded-full text-xs font-bold uppercase tracking-wider">Xabarlar</TabsTrigger>
              <TabsTrigger value="board" className="rounded-full text-xs font-bold uppercase tracking-wider">Tahrir hay'ati</TabsTrigger>
            </TabsList>

            {/* ========== JOURNALS TAB ========== */}
            <TabsContent value="journals" className="space-y-14">
              {/* Existing Journals */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <h2 className="text-2xl font-serif font-black text-foreground">Yuklangan Jurnallar</h2>
                </div>

                {journalsLoading ? (
                  <div className="flex justify-center py-16">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : journals.length === 0 ? (
                  <EmptyState
                    icon={FileX}
                    title="Hozircha jurnallar mavjud emas"
                    description="Quyidagi forma orqali birinchi nashringizni yuklang."
                  />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {journals.map((journal) => (
                      <GlassCard key={journal.id} variant="elevated" className="overflow-hidden flex flex-col">
                        {journal.cover_image_url && (
                          <div className="aspect-[3/4] overflow-hidden bg-secondary/40 relative">
                            <ImageCard
                              src={journal.cover_image_url}
                              alt={journal.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="p-5 flex flex-col flex-1">
                          <h3 className="font-serif font-bold text-base text-foreground line-clamp-2 leading-snug">
                            {journal.title}
                          </h3>
                          {journal.description && (
                            <p className="mt-2 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                              {journal.description}
                            </p>
                          )}
                          <div className="flex gap-2 mt-5 pt-4 border-t border-border/60">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleView(journal.pdf_url)}
                              className="flex-1 rounded-full text-xs font-bold"
                            >
                              <Eye className="mr-1 h-4 w-4" />
                              Ko'rish
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(journal)}
                              className="flex-1 rounded-full text-xs font-bold"
                            >
                              <Edit className="mr-1 h-4 w-4" />
                              Tahrirlash
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="sm" className="rounded-full" aria-label="Jurnalni o'chirish">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Ishonchingiz komilmi?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Bu amalni qaytarib bo'lmaydi. Jurnal butunlay o'chiriladi.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Bekor qilish</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDelete(journal.id)}>
                                    O'chirish
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      </GlassCard>
                    ))}
                  </div>
                )}
              </div>

              {/* Upload New Journal */}
              <div className="max-w-2xl mx-auto w-full">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/25 flex items-center justify-center text-accent">
                    <Upload className="h-5 w-5" />
                  </div>
                  <h2 className="text-2xl font-serif font-black text-foreground">Yangi Jurnal Yuklash</h2>
                </div>

                <GlassCard variant="default" className="p-6 md:p-8">
                  <p className="text-sm text-muted-foreground mb-6">
                    Jurnal haqida to'liq ma'lumot kiriting va fayllarni yuklang.
                  </p>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="title" className={labelClass}>
                        Jurnal Nomi *
                      </label>
                      <Input
                        id="title"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Jurnal nomini kiriting"
                        maxLength={200}
                        className={fieldClass}
                      />
                    </div>

                    <div>
                      <label htmlFor="description" className={labelClass}>
                        Tavsif *
                      </label>
                      <Textarea
                        id="description"
                        required
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Jurnal haqida qisqacha ma'lumot..."
                        rows={4}
                        maxLength={1000}
                        className={`${fieldClass} resize-none p-4`}
                      />
                    </div>

                    <div>
                      <label htmlFor="pdf" className={labelClass}>
                        PDF Fayl *
                      </label>
                      <Input
                        id="pdf"
                        type="file"
                        accept="application/pdf"
                        required
                        onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                        className={`${fieldClass} text-xs font-bold`}
                      />
                    </div>

                    <div>
                      <label htmlFor="cover" className={labelClass}>
                        Muqova Rasmi (ixtiyoriy)
                      </label>
                      <Input
                        id="cover"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
                        className={`${fieldClass} text-xs font-bold`}
                      />
                    </div>

                    <Button type="submit" className="w-full rounded-full h-12 font-bold uppercase tracking-wider text-xs" disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Yuklanmoqda...
                        </>
                      ) : (
                        <>
                          <Upload className="mr-2 h-4 w-4" />
                          Jurnalni Yuklash
                        </>
                      )}
                    </Button>
                  </form>
                </GlassCard>
              </div>
            </TabsContent>

            {/* ========== MESSAGES TAB ========== */}
            <TabsContent value="messages">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <Mail className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-serif font-black text-foreground">Foydalanuvchilardan kelgan xabarlar</h2>
              </div>

              {messagesLoading ? (
                <div className="flex justify-center py-16">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : messages.length === 0 ? (
                <EmptyState
                  icon={Mail}
                  title="Hozircha xabar yo'q"
                  description="Foydalanuvchilar aloqa formasi orqali yuborgan xabarlar shu yerda ko'rinadi."
                />
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {messages.map((message) => (
                    <GlassCard key={message.id} variant="default" className="p-6 text-left">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <p className="font-serif font-bold text-lg text-foreground truncate">
                            {message.name}
                          </p>
                          <a
                            href={`mailto:${message.email}`}
                            className="text-sm text-primary hover:underline break-all"
                          >
                            {message.email}
                          </a>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="rounded-full flex-shrink-0"
                          onClick={() => setDeletingMessageId(message.id)}
                          aria-label="Xabarni o'chirish"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="mt-3 text-xs text-muted-foreground uppercase tracking-wide font-semibold">
                        {new Date(message.created_at).toLocaleString('uz-UZ', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                      <div className="mt-4 bg-secondary/40 border border-border/60 p-4 rounded-xl">
                        <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
                          {message.message}
                        </p>
                      </div>
                    </GlassCard>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* ========== EDITORIAL BOARD TAB ========== */}
            <TabsContent value="board">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                    <Users className="h-5 w-5" />
                  </div>
                  <h2 className="text-2xl font-serif font-black text-foreground">Tahrir hay'ati boshqaruvi</h2>
                </div>
                <Button onClick={handleAddMember} className="rounded-full font-bold text-xs uppercase tracking-wider">
                  <Plus className="mr-2 h-4 w-4" />
                  Yangi a'zo qo'shish
                </Button>
              </div>

              {boardLoading ? (
                <div className="flex justify-center py-16">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : boardMembers.length === 0 ? (
                <EmptyState
                  icon={Users}
                  title="Hozircha a'zolar yo'q"
                  description="Yuqoridagi tugma orqali tahrir hay'ati a'zolarini qo'shing."
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {boardMembers.map((member) => (
                    <GlassCard key={member.id} variant="default" className="p-5 flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <p className="font-serif font-bold text-base text-foreground truncate">
                          {member.name}
                        </p>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {member.position}
                        </p>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-full"
                          onClick={() => handleEditMember(member)}
                          aria-label="A'zoni tahrirlash"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm" className="rounded-full" aria-label="A'zoni o'chirish">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>A'zoni o'chirish</AlertDialogTitle>
                              <AlertDialogDescription>
                                Haqiqatan ham bu a'zoni o'chirmoqchimisiz? Bu amalni bekor qilib bo'lmaydi.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Bekor qilish</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteMember(member.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                O'chirish
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </GlassCard>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Edit Journal Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif font-black">Jurnalni Tahrirlash</DialogTitle>
            <DialogDescription>
              Jurnal ma'lumotlarini yangilang. Yangi fayl tanlasangiz eski fayl almashtiriladi.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-6">
            <div>
              <label htmlFor="edit-title" className={labelClass}>
                Jurnal Nomi *
              </label>
              <Input
                id="edit-title"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Jurnal nomini kiriting"
                maxLength={200}
                className={fieldClass}
              />
            </div>

            <div>
              <label htmlFor="edit-description" className={labelClass}>
                Tavsif *
              </label>
              <Textarea
                id="edit-description"
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Jurnal haqida qisqacha ma'lumot..."
                rows={4}
                maxLength={1000}
                className={`${fieldClass} resize-none p-4`}
              />
            </div>

            <div>
              <label htmlFor="edit-pdf" className={labelClass}>
                Yangi PDF Fayl (ixtiyoriy)
              </label>
              <Input
                id="edit-pdf"
                type="file"
                accept="application/pdf"
                onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                className={`${fieldClass} text-xs font-bold`}
              />
              <p className="text-xs text-muted-foreground mt-1.5">
                Agar yangi fayl tanlamasangiz, eski fayl saqlanadi
              </p>
            </div>

            <div>
              <label htmlFor="edit-cover" className={labelClass}>
                Yangi Muqova Rasmi (ixtiyoriy)
              </label>
              <Input
                id="edit-cover"
                type="file"
                accept="image/*"
                onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
                className={`${fieldClass} text-xs font-bold`}
              />
              <p className="text-xs text-muted-foreground mt-1.5">
                Agar yangi rasm tanlamasangiz, eski rasm saqlanadi
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1 rounded-full font-bold"
                onClick={() => {
                  setEditDialogOpen(false);
                  setEditingJournal(null);
                  setFormData({ title: '', description: '' });
                  setPdfFile(null);
                  setCoverFile(null);
                }}
              >
                Bekor qilish
              </Button>
              <Button type="submit" className="flex-1 rounded-full font-bold" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Yangilanmoqda...
                  </>
                ) : (
                  'Yangilash'
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Message Confirmation */}
      <AlertDialog
        open={!!deletingMessageId}
        onOpenChange={() => setDeletingMessageId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xabarni o'chirish</AlertDialogTitle>
            <AlertDialogDescription>
              Haqiqatan ham bu xabarni o'chirmoqchimisiz? Bu amalni bekor qilib bo'lmaydi.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Bekor qilish</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingMessageId && handleDeleteMessage(deletingMessageId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              O'chirish
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Board Member Dialog */}
      <Dialog open={memberDialogOpen} onOpenChange={setMemberDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-serif font-black">
              {editingMember ? 'A\'zoni tahrirlash' : 'Yangi a\'zo qo\'shish'}
            </DialogTitle>
            <DialogDescription>
              Tahrir hay'ati a'zosi ma'lumotlarini kiriting
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSaveMember} className="space-y-4">
            <div>
              <label htmlFor="member-name" className={labelClass}>
                Ism va Familiya *
              </label>
              <Input
                id="member-name"
                required
                value={memberFormData.name}
                onChange={(e) => setMemberFormData({ ...memberFormData, name: e.target.value })}
                placeholder="To'liq ism va familiya"
                className={fieldClass}
              />
            </div>

            <div>
              <label htmlFor="member-position" className={labelClass}>
                Lavozim *
              </label>
              <select
                id="member-position"
                required
                value={memberFormData.position}
                onChange={(e) => setMemberFormData({ ...memberFormData, position: e.target.value })}
                className="w-full px-3 py-2 border border-input bg-secondary/30 rounded-xl text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <option value="Bosh Muharrir">Bosh Muharrir</option>
                <option value="Tahrir hay'ati a'zosi">Tahrir hay'ati a'zosi</option>
              </select>
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1 rounded-full font-bold"
                onClick={() => {
                  setMemberDialogOpen(false);
                  setMemberFormData({ name: '', position: 'Tahrir hay\'ati a\'zosi' });
                }}
              >
                Bekor qilish
              </Button>
              <Button type="submit" className="flex-1 rounded-full font-bold" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saqlanmoqda...
                  </>
                ) : (
                  'Saqlash'
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
};

export default Admin;

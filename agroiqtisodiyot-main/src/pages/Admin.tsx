import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Upload, Loader2, Trash2, Edit, Eye, Mail, Users, Plus } from 'lucide-react';
import { z } from 'zod';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!pdfFile) {
      toast.error('PDF fayl tanlash majburiy');
      return;
    }

    setLoading(true);

    try {
      const validatedData = journalSchema.parse(formData);

      // Upload PDF
      const pdfFileName = `${Date.now()}_${pdfFile.name}`;
      const { data: pdfData, error: pdfError } = await supabase.storage
        .from('journal-pdfs')
        .upload(pdfFileName, pdfFile);

      if (pdfError) throw pdfError;

      const pdfUrl = supabase.storage
        .from('journal-pdfs')
        .getPublicUrl(pdfData.path).data.publicUrl;

      let coverUrl = null;
      if (coverFile) {
        const coverFileName = `${Date.now()}_${coverFile.name}`;
        const { data: coverData, error: coverError } = await supabase.storage
          .from('journal-covers')
          .upload(coverFileName, coverFile);

        if (coverError) throw coverError;

        coverUrl = supabase.storage
          .from('journal-covers')
          .getPublicUrl(coverData.path).data.publicUrl;
      }

      // Insert journal record
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
        toast.error('Jurnal yuklashda xatolik yuz berdi');
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

      // Upload new PDF if provided
      if (pdfFile) {
        const pdfFileName = `${Date.now()}_${pdfFile.name}`;
        const { data: pdfData, error: pdfError } = await supabase.storage
          .from('journal-pdfs')
          .upload(pdfFileName, pdfFile);

        if (pdfError) throw pdfError;

        pdfUrl = supabase.storage
          .from('journal-pdfs')
          .getPublicUrl(pdfData.path).data.publicUrl;
      }

      // Upload new cover if provided
      if (coverFile) {
        const coverFileName = `${Date.now()}_${coverFile.name}`;
        const { data: coverData, error: coverError } = await supabase.storage
          .from('journal-covers')
          .upload(coverFileName, coverFile);

        if (coverError) throw coverError;

        coverUrl = supabase.storage
          .from('journal-covers')
          .getPublicUrl(coverData.path).data.publicUrl;
      }

      // Update journal record
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
        toast.error('Jurnal yangilashda xatolik yuz berdi');
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
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8 text-center">Admin Panel</h1>
          
          <Tabs defaultValue="journals" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="journals">Jurnallar</TabsTrigger>
              <TabsTrigger value="messages">Xabarlar</TabsTrigger>
              <TabsTrigger value="board">Tahrir hay'ati</TabsTrigger>
            </TabsList>

            <TabsContent value="journals" className="space-y-12">
          
          {/* Existing Journals */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Yuklangan Jurnallar</h2>
            {journalsLoading ? (
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
              </div>
            ) : journals.length === 0 ? (
              <p className="text-muted-foreground text-center">Hozircha jurnallar mavjud emas</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {journals.map((journal) => (
                  <Card key={journal.id} className="overflow-hidden">
                    {journal.cover_image_url && (
                      <div className="aspect-[3/4] overflow-hidden bg-muted">
                        <img
                          src={journal.cover_image_url}
                          alt={journal.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle className="line-clamp-2 text-lg">{journal.title}</CardTitle>
                      {journal.description && (
                        <CardDescription className="line-clamp-2 text-sm">
                          {journal.description}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleView(journal.pdf_url)}
                        className="flex-1"
                      >
                        <Eye className="mr-1 h-4 w-4" />
                        Ko'rish
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(journal)}
                        className="flex-1"
                      >
                        <Edit className="mr-1 h-4 w-4" />
                        Tahrirlash
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm">
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
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Upload New Journal */}
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Yangi Jurnal Yuklash</h2>

            <Card>
              <CardHeader>
                <CardTitle>Jurnal Ma'lumotlari</CardTitle>
                <CardDescription>
                  Jurnal haqida to'liq ma'lumot kiriting va fayllarni yuklang
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium mb-2">
                      Jurnal Nomi *
                    </label>
                    <Input
                      id="title"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Jurnal nomini kiriting"
                      maxLength={200}
                    />
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium mb-2">
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
                    />
                  </div>

                  <div>
                    <label htmlFor="pdf" className="block text-sm font-medium mb-2">
                      PDF Fayl *
                    </label>
                    <Input
                      id="pdf"
                      type="file"
                      accept="application/pdf"
                      required
                      onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                    />
                  </div>

                  <div>
                    <label htmlFor="cover" className="block text-sm font-medium mb-2">
                      Muqova Rasmi (ixtiyoriy)
                    </label>
                    <Input
                      id="cover"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
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
              </CardContent>
            </Card>
          </div>
            </TabsContent>

            <TabsContent value="messages">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Foydalanuvchilardan kelgan xabarlar
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {messagesLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : messages.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      Hozircha xabar yo'q
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <Card key={message.id} className="border-2">
                          <CardContent className="pt-6">
                            <div className="space-y-3">
                              <div className=" flex-col flex justify-between items-start" >
                                <div>
                                  <p className="font-semibold text-lg">
                                    {message.name}
                                  </p>
                                  <a
                                    href={`mailto:${message.email}`}
                                    className="text-sm text-primary hover:underline"
                                  >
                                    {message.email}
                                  </a>
                                </div>
                                <div className="flex items-center gap-2 justify-between" style={{width:"100%"}}>
                                  <span className="text-xs text-muted-foreground">
                                    {new Date(message.created_at).toLocaleString(
                                      'uz-UZ',
                                      {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                      }
                                    )}
                                  </span>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => setDeletingMessageId(message.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                              <div className="bg-muted p-4 rounded-lg">
                                <p className="text-sm whitespace-pre-wrap">
                                  {message.message}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="board">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Tahrir hay'ati boshqaruvi</h2>
                  <Button onClick={handleAddMember}>
                    <Plus className="mr-2 h-4 w-4" />
                    Yangi a'zo qo'shish
                  </Button>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Tahrir hay'ati a'zolari
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {boardLoading ? (
                      <div className="flex justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                    ) : boardMembers.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">
                        Hozircha a'zolar yo'q
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {boardMembers.map((member) => (
                          <Card key={member.id} className="border-2">
                            <CardContent className="pt-4">
                              <div className="flex justify-between items-center">
                                <div>
                                  <p className="font-semibold text-lg">
                                    {member.name}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    {member.position}
                                  </p>
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleEditMember(member)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button variant="destructive" size="sm">
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
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Jurnalni Tahrirlash</DialogTitle>
            <DialogDescription>
              Jurnal ma'lumotlarini yangilang. Yangi fayl tanlasangiz eski fayl almashtiriladi.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-6">
            <div>
              <label htmlFor="edit-title" className="block text-sm font-medium mb-2">
                Jurnal Nomi *
              </label>
              <Input
                id="edit-title"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Jurnal nomini kiriting"
                maxLength={200}
              />
            </div>

            <div>
              <label htmlFor="edit-description" className="block text-sm font-medium mb-2">
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
              />
            </div>

            <div>
              <label htmlFor="edit-pdf" className="block text-sm font-medium mb-2">
                Yangi PDF Fayl (ixtiyoriy)
              </label>
              <Input
                id="edit-pdf"
                type="file"
                accept="application/pdf"
                onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Agar yangi fayl tanlamasangiz, eski fayl saqlanadi
              </p>
            </div>

            <div>
              <label htmlFor="edit-cover" className="block text-sm font-medium mb-2">
                Yangi Muqova Rasmi (ixtiyoriy)
              </label>
              <Input
                id="edit-cover"
                type="file"
                accept="image/*"
                onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Agar yangi rasm tanlamasangiz, eski rasm saqlanadi
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
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
              <Button type="submit" className="flex-1" disabled={loading}>
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
            <DialogTitle>
              {editingMember ? 'A\'zoni tahrirlash' : 'Yangi a\'zo qo\'shish'}
            </DialogTitle>
            <DialogDescription>
              Tahrir hay'ati a'zosi ma'lumotlarini kiriting
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSaveMember} className="space-y-4">
            <div>
              <label htmlFor="member-name" className="block text-sm font-medium mb-2">
                Ism va Familiya *
              </label>
              <Input
                id="member-name"
                required
                value={memberFormData.name}
                onChange={(e) => setMemberFormData({ ...memberFormData, name: e.target.value })}
                placeholder="To'liq ism va familiya"
              />
            </div>

            <div>
              <label htmlFor="member-position" className="block text-sm font-medium mb-2">
                Lavozim *
              </label>
              <select
                id="member-position"
                required
                value={memberFormData.position}
                onChange={(e) => setMemberFormData({ ...memberFormData, position: e.target.value })}
                className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="Bosh Muharrir">Bosh Muharrir</option>
                <option value="Tahrir hay'ati a'zosi">Tahrir hay'ati a'zosi</option>
              </select>
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setMemberDialogOpen(false);
                  setMemberFormData({ name: '', position: 'Tahrir hay\'ati a\'zosi' });
                }}
              >
                Bekor qilish
              </Button>
              <Button type="submit" className="flex-1" disabled={loading}>
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

      <Footer />
    </div>
  );
};

export default Admin;
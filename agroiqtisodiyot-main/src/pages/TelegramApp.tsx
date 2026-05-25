import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  BookOpen, 
  Upload, 
  Search, 
  FileText, 
  Image as ImageIcon, 
  Loader2, 
  CheckCircle, 
  AlertCircle, 
  User,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';

// Declare Telegram WebApp global interface
declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready: () => void;
        expand: () => void;
        close: () => void;
        initDataUnsafe?: {
          user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
            photo_url?: string;
          };
        };
        themeParams?: {
          bg_color?: string;
          text_color?: string;
          hint_color?: string;
          link_color?: string;
          button_color?: string;
          button_text_color?: string;
        };
      };
    };
  }
}

interface Journal {
  id: string;
  title: string;
  description: string | null;
  pdf_url: string;
  cover_image_url: string | null;
  created_at: string;
}

export default function TelegramApp() {
  const [activeTab, setActiveTab] = useState<'journals' | 'upload'>('journals');
  const [tgUser, setTgUser] = useState<any>(null);
  const [journals, setJournals] = useState<Journal[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Upload form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    // Initialize Telegram WebApp UI
    if (window.Telegram?.WebApp) {
      const webapp = window.Telegram.WebApp;
      webapp.ready();
      webapp.expand();
      if (webapp.initDataUnsafe?.user) {
        setTgUser(webapp.initDataUnsafe.user);
      }
    } else {
      // Mock user for local browser testing
      setTgUser({
        id: 6258303327,
        first_name: 'Sanjarbek',
        username: 'sanjar_dev'
      });
    }

    fetchJournals();
  }, []);

  const fetchJournals = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('journals')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setJournals(data || []);
    } catch (err: any) {
      console.error('Error fetching journals:', err);
      toast.error('Jurnallarni yuklashda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'pdf' | 'cover') => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (type === 'pdf') {
        if (file.type !== 'application/pdf') {
          toast.error('Faqat PDF fayl yuklashingiz mumkin');
          return;
        }
        setPdfFile(file);
      } else {
        if (!file.type.startsWith('image/')) {
          toast.error('Faqat rasm fayli yuklashingiz mumkin');
          return;
        }
        setCoverFile(file);
      }
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Sarlavha kiritilishi shart');
      return;
    }
    if (!pdfFile) {
      toast.error('PDF fayl tanlanishi shart');
      return;
    }

    setUploading(true);
    setUploadProgress(10);
    setUploadSuccess(false);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('telegram_id', tgUser?.id ? String(tgUser.id) : '');
      formData.append('pdf', pdfFile);
      if (coverFile) {
        formData.append('cover', coverFile);
      }

      setUploadProgress(30);

      // Determine backend endpoint URL
      // If deployed locally, fetch from localhost, else use relative or custom URL
      const API_URL = import.meta.env.DEV 
        ? 'http://localhost:3000/api/upload-magazine' 
        : '/api/upload-magazine';

      setUploadProgress(50);

      const response = await fetch(API_URL, {
        method: 'POST',
        body: formData,
      });

      setUploadProgress(80);

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Yuklashda xatolik yuz berdi.');
      }

      setUploadProgress(100);
      setUploadSuccess(true);
      toast.success('Jurnal muvaffaqiyatli yuklandi!');
      
      // Reset form
      setTitle('');
      setDescription('');
      setPdfFile(null);
      setCoverFile(null);
      fetchJournals();

    } catch (err: any) {
      console.error('Upload failed:', err);
      setUploadError(err.message || 'Serverga yuklashda kutilmagan xatolik.');
      toast.error(err.message || 'Yuklash amalga oshmadi.');
    } finally {
      setUploading(false);
    }
  };

  const filteredJournals = journals.filter(j => 
    j.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (j.description && j.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased pb-12 selection:bg-teal-500 selection:text-slate-950">
      
      {/* Background gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-teal-500/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[120px]" />
      </div>

      {/* Header Container */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800/60 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-teal-500/10 border border-teal-500/30 rounded-lg text-teal-400">
            <BookOpen className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <h1 className="font-bold text-base bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-400 leading-none">ISCAD</h1>
            <p className="text-[10px] text-slate-400">Telegram Web App</p>
          </div>
        </div>

        {/* User Card */}
        {tgUser && (
          <div className="flex items-center gap-2 bg-slate-900/60 border border-slate-800/80 rounded-full pl-2 pr-3 py-1 text-xs">
            {tgUser.photo_url ? (
              <img 
                src={tgUser.photo_url} 
                alt={tgUser.first_name} 
                className="w-5 h-5 rounded-full object-cover"
              />
            ) : (
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 text-slate-950 flex items-center justify-center font-bold text-[9px]">
                {tgUser.first_name.slice(0, 2).toUpperCase()}
              </div>
            )}
            <span className="font-medium text-slate-300 max-w-[80px] truncate">{tgUser.first_name}</span>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 z-10 px-4 pt-4 max-w-md mx-auto w-full">
        
        {/* Navigation Tabs */}
        <div className="grid grid-cols-2 p-1 bg-slate-900/80 border border-slate-800/50 rounded-xl mb-6 backdrop-blur-sm">
          <button
            onClick={() => { setActiveTab('journals'); setUploadSuccess(false); setUploadError(null); }}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold transition-all duration-300 ${
              activeTab === 'journals' 
                ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-slate-950 shadow-md shadow-teal-500/20' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="h-4 w-4" />
            Nashrlar
          </button>
          <button
            onClick={() => { setActiveTab('upload'); setUploadSuccess(false); setUploadError(null); }}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold transition-all duration-300 ${
              activeTab === 'upload' 
                ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-slate-950 shadow-md shadow-teal-500/20' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Upload className="h-4 w-4" />
            Jurnal yuklash
          </button>
        </div>

        {/* Tab 1: Journals Shelf */}
        {activeTab === 'journals' && (
          <div className="space-y-4">
            
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                type="text"
                placeholder="Jurnal qidirish..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900/40 border-slate-800 pl-9 text-slate-200 placeholder:text-slate-500 focus-visible:ring-teal-500/30"
              />
            </div>

            {/* List */}
            {loading ? (
              <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-teal-400" />
                <p className="text-sm text-slate-400">Jurnallar yuklanmoqda...</p>
              </div>
            ) : filteredJournals.length === 0 ? (
              <div className="py-16 text-center border border-dashed border-slate-800/80 rounded-2xl">
                <BookOpen className="h-10 w-10 text-slate-600 mx-auto mb-2" />
                <p className="text-sm text-slate-400 font-medium">Hech qanday jurnal topilmadi</p>
                <p className="text-xs text-slate-500 mt-1">Qidiruv so'zini o'zgartirib ko'ring</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredJournals.map((journal) => (
                  <Card 
                    key={journal.id} 
                    className="overflow-hidden bg-slate-900/40 border-slate-800/60 backdrop-blur-sm hover:border-slate-700/60 transition-all duration-300"
                  >
                    <CardContent className="p-3 flex gap-3">
                      {/* Cover Thumbnail */}
                      <div className="w-16 h-20 bg-slate-800/80 rounded-md overflow-hidden flex-shrink-0 border border-slate-800">
                        {journal.cover_image_url ? (
                          <img 
                            src={journal.cover_image_url} 
                            alt={journal.title} 
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 text-slate-600">
                            <FileText className="h-6 w-6" />
                          </div>
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <h3 className="font-bold text-xs text-slate-200 line-clamp-1 leading-tight">{journal.title}</h3>
                          <p className="text-[10px] text-slate-400 line-clamp-2 mt-1 leading-snug">
                            {journal.description || "Tavsif berilmagan."}
                          </p>
                        </div>
                        
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[9px] text-slate-500">
                            {new Date(journal.created_at).toLocaleDateString('uz-UZ')}
                          </span>
                          <a 
                            href={journal.pdf_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[10px] font-bold text-teal-400 hover:text-teal-300 transition-colors"
                          >
                            O'qish
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Upload Form */}
        {activeTab === 'upload' && (
          <div className="bg-slate-900/40 border border-slate-850 backdrop-blur-sm rounded-2xl p-4 shadow-xl">
            
            {uploadSuccess ? (
              <div className="py-8 text-center space-y-4">
                <div className="inline-flex items-center justify-center p-3 bg-teal-500/10 border border-teal-500/20 text-teal-400 rounded-full">
                  <CheckCircle className="h-10 w-10 animate-bounce" />
                </div>
                <h3 className="font-bold text-base text-slate-100">Muvaffaqiyatli Yuklandi!</h3>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Jurnal fayllari Telegram CDN xotirasiga yuklandi va Supabase ma'lumotlar bazasiga saqlandi.
                </p>
                <Button 
                  onClick={() => { setUploadSuccess(false); setActiveTab('journals'); }}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs w-full py-2.5 rounded-xl border border-slate-700/60"
                >
                  Nashrlar ro'yxatiga qaytish
                </Button>
              </div>
            ) : (
              <form onSubmit={handleUploadSubmit} className="space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-200 mb-1">Yangi Jurnal Qo'shish</h3>
                  <p className="text-[10px] text-slate-500">Jurnal ma'lumotlarini to'ldiring va fayllarni tanlang.</p>
                </div>

                {uploadError && (
                  <div className="p-3 bg-red-950/40 border border-red-900/40 rounded-xl flex items-start gap-2.5 text-red-400">
                    <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <p className="text-[10px] font-medium leading-normal">{uploadError}</p>
                  </div>
                )}

                {/* Title */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Jurnal nomi *</label>
                  <Input
                    type="text"
                    required
                    disabled={uploading}
                    placeholder="Masalan: Agroiqtisodiyot Jurnali 2026 #1"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="bg-slate-950/50 border-slate-800 text-slate-200 placeholder:text-slate-600 focus-visible:ring-teal-500/30 text-xs"
                  />
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Tavsif (Tavsif/Annotatsiya)</label>
                  <Textarea
                    disabled={uploading}
                    placeholder="Jurnal haqida qisqacha ma'lumot yoki annotatsiya yozing..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="bg-slate-950/50 border-slate-800 text-slate-200 placeholder:text-slate-600 focus-visible:ring-teal-500/30 text-xs"
                  />
                </div>

                {/* PDF Upload Button */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">PDF Fayl *</label>
                  <div className="relative group border border-dashed border-slate-800 hover:border-slate-700/80 rounded-xl bg-slate-950/30 transition-all p-3 text-center cursor-pointer">
                    <input 
                      type="file" 
                      accept="application/pdf"
                      required
                      disabled={uploading}
                      onChange={(e) => handleFileChange(e, 'pdf')}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="flex flex-col items-center justify-center gap-1.5">
                      <FileText className={`h-6 w-6 ${pdfFile ? 'text-teal-400' : 'text-slate-500 group-hover:text-slate-400'}`} />
                      <span className="text-[10px] font-semibold text-slate-300">
                        {pdfFile ? pdfFile.name : "PDF fayl tanlash yoki sudrab tashlash"}
                      </span>
                      <span className="text-[9px] text-slate-500">Maksimal hajm: 50MB</span>
                    </div>
                  </div>
                </div>

                {/* Cover Image Upload Button */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Muqova rasmi (ixtiyoriy)</label>
                  <div className="relative group border border-dashed border-slate-800 hover:border-slate-700/80 rounded-xl bg-slate-950/30 transition-all p-3 text-center cursor-pointer">
                    <input 
                      type="file" 
                      accept="image/*"
                      disabled={uploading}
                      onChange={(e) => handleFileChange(e, 'cover')}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="flex flex-col items-center justify-center gap-1.5">
                      <ImageIcon className={`h-6 w-6 ${coverFile ? 'text-teal-400' : 'text-slate-500 group-hover:text-slate-400'}`} />
                      <span className="text-[10px] font-semibold text-slate-300">
                        {coverFile ? coverFile.name : "Muqova rasmini tanlash"}
                      </span>
                      <span className="text-[9px] text-slate-500">JPG, PNG formatida</span>
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                {uploading && (
                  <div className="space-y-1.5 pt-2">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Loader2 className="h-3 w-3 animate-spin text-teal-400" />
                        Yuklanmoqda...
                      </span>
                      <span className="text-teal-400 font-bold">{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-teal-400 to-blue-500 h-full transition-all duration-350"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={uploading}
                  className="w-full bg-gradient-to-r from-teal-400 to-teal-500 hover:from-teal-500 hover:to-teal-600 text-slate-950 font-bold text-xs py-3 rounded-xl shadow-lg shadow-teal-500/10 mt-2 transition-all active:scale-[0.98]"
                >
                  {uploading ? "Yuklanmoqda..." : "Serverga yuklash"}
                </Button>
              </form>
            )}

          </div>
        )}

      </main>
      
    </div>
  );
}

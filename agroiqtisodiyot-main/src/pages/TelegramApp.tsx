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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased pb-12 overflow-x-hidden relative selection:bg-teal-500 selection:text-slate-950">
      
      {/* Background gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[65%] h-[65%] rounded-full bg-emerald-500/10 blur-[130px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[65%] h-[65%] rounded-full bg-amber-500/5 blur-[130px]" />
      </div>

      {/* Header Container */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-900 px-4 py-3.5 flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
            <BookOpen className="h-5 w-5" />
          </div>
          <div className="text-left">
            <h1 className="font-bold text-sm bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-amber-400 leading-none tracking-tight">ISCAD</h1>
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Telegram Web App</p>
          </div>
        </div>

        {/* User Badge */}
        {tgUser && (
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-full pl-2 pr-3.5 py-1 text-xs">
            {tgUser.photo_url ? (
              <img 
                src={tgUser.photo_url} 
                alt={tgUser.first_name} 
                className="w-5.5 h-5.5 rounded-full object-cover"
              />
            ) : (
              <div className="w-5.5 h-5.5 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 text-slate-950 flex items-center justify-center font-bold text-[9px] uppercase">
                {tgUser.first_name.slice(0, 2)}
              </div>
            )}
            <span className="font-bold text-slate-300 max-w-[80px] truncate">{tgUser.first_name}</span>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 z-10 px-4 pt-4 max-w-md mx-auto w-full">
        
        {/* Navigation Tabs */}
        <div className="grid grid-cols-2 p-1 bg-slate-900 border border-slate-800/80 rounded-full mb-6 backdrop-blur-sm">
          <button
            onClick={() => { setActiveTab('journals'); setUploadSuccess(false); setUploadError(null); }}
            className={`flex items-center justify-center gap-2 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === 'journals' 
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/10' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="h-4 w-4" />
            Nashrlar
          </button>
          <button
            onClick={() => { setActiveTab('upload'); setUploadSuccess(false); setUploadError(null); }}
            className={`flex items-center justify-center gap-2 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === 'upload' 
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/10' 
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
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-400" />
              <Input
                type="text"
                placeholder="Jurnal qidirish..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border-slate-800 pl-10 text-xs md:text-sm text-slate-200 placeholder:text-slate-600 focus-visible:ring-emerald-500/30 rounded-xl h-11"
              />
            </div>

            {/* List */}
            {loading ? (
              <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
                <p className="text-xs font-semibold text-slate-400">Jurnallar yuklanmoqda...</p>
              </div>
            ) : filteredJournals.length === 0 ? (
              <div className="py-16 text-center border border-dashed border-slate-800/80 rounded-2xl">
                <BookOpen className="h-10 w-10 text-slate-700 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-400">Hech qanday jurnal topilmadi</p>
                <p className="text-[10px] text-slate-600 mt-1 font-semibold">Qidiruv so'zini o'zgartirib ko'ring</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3.5 text-left">
                {filteredJournals.map((journal) => (
                  <Card 
                    key={journal.id} 
                    className="overflow-hidden bg-slate-900/60 border-slate-800 backdrop-blur-sm hover:border-emerald-500/30 transition-all duration-300 rounded-xl"
                  >
                    <CardContent className="p-3 flex gap-4">
                      {/* Cover Thumbnail */}
                      <div className="w-16 h-22 bg-slate-800/80 rounded-lg overflow-hidden flex-shrink-0 border border-slate-750 relative shadow-md">
                        {journal.cover_image_url ? (
                          <img 
                            src={journal.cover_image_url} 
                            alt={journal.title} 
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-950 text-slate-600">
                            <FileText className="h-6 w-6 text-emerald-500/50" />
                          </div>
                        )}
                        <div className="absolute inset-y-0 left-0 w-[3px] bg-black/25 z-10" />
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <h3 className="font-bold text-xs text-slate-200 line-clamp-1 leading-tight">{journal.title}</h3>
                          <p className="text-[10px] text-slate-400 line-clamp-2 mt-1.5 leading-relaxed font-semibold">
                            {journal.description || "Annotatsiya kiritilmagan."}
                          </p>
                        </div>
                        
                        <div className="flex items-center justify-between pt-2 border-t border-slate-800/65 mt-2">
                          <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider">
                            {new Date(journal.created_at).toLocaleDateString('uz-UZ')}
                          </span>
                          <a 
                            href={journal.pdf_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-400 hover:text-emerald-300 transition-colors uppercase tracking-wider"
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
          <div className="bg-slate-900/60 border border-slate-800 backdrop-blur-sm rounded-2xl p-5 shadow-xl text-left">
            
            {uploadSuccess ? (
              <div className="py-8 text-center space-y-4">
                <div className="inline-flex items-center justify-center p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full">
                  <CheckCircle className="h-10 w-10 animate-bounce" />
                </div>
                <h3 className="font-bold text-base text-slate-100">Muvaffaqiyatli Yuklandi!</h3>
                <p className="text-xs text-slate-400 max-w-xs mx-auto font-semibold">
                  Jurnal fayllari Telegram xotirasiga yuklandi va ma'lumotlar bazasiga kiritildi.
                </p>
                <Button 
                  onClick={() => { setUploadSuccess(false); setActiveTab('journals'); }}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs w-full py-3 rounded-xl border border-slate-700 font-bold uppercase tracking-wider"
                >
                  Nashrlar ro'yxatiga qaytish
                </Button>
              </div>
            ) : (
              <form onSubmit={handleUploadSubmit} className="space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-200">Yangi Jurnal Qo'shish</h3>
                  <p className="text-[10px] font-semibold text-slate-500 mt-1">Jurnal ma'lumotlarini to'ldiring va fayllarni tanlang.</p>
                </div>

                {uploadError && (
                  <div className="p-3 bg-red-950/40 border border-red-900/40 rounded-xl flex items-start gap-2.5 text-red-400">
                    <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <p className="text-[10px] font-semibold leading-normal">{uploadError}</p>
                  </div>
                )}

                {/* Title */}
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Jurnal nomi *</label>
                  <Input
                    type="text"
                    required
                    disabled={uploading}
                    placeholder="Masalan: Agroiqtisodiyot Jurnali 2026 #1"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="bg-slate-950 border-slate-800 text-slate-200 placeholder:text-slate-750 focus-visible:ring-emerald-500/30 text-xs font-semibold rounded-xl h-11"
                  />
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Tavsif / Annotatsiya</label>
                  <Textarea
                    disabled={uploading}
                    placeholder="Jurnal haqida qisqacha ma'lumot yoki annotatsiya..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="bg-slate-950 border-slate-800 text-slate-200 placeholder:text-slate-750 focus-visible:ring-emerald-500/30 text-xs font-semibold rounded-xl"
                  />
                </div>

                {/* PDF Drop Zone */}
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">PDF Fayl *</label>
                  <div className="relative group border border-dashed border-slate-800 hover:border-slate-700 rounded-xl bg-slate-950/40 transition-all p-4 text-center cursor-pointer">
                    <input 
                      type="file" 
                      accept="application/pdf"
                      required
                      disabled={uploading}
                      onChange={(e) => handleFileChange(e, 'pdf')}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="flex flex-col items-center justify-center gap-1.5">
                      <FileText className={`h-6 w-6 ${pdfFile ? 'text-emerald-400' : 'text-slate-650 group-hover:text-slate-500'}`} />
                      <span className="text-[10px] font-bold text-slate-300">
                        {pdfFile ? pdfFile.name : "PDF faylini yuklang"}
                      </span>
                      <span className="text-[9px] text-slate-500 font-medium">Maksimal hajm: 50MB</span>
                    </div>
                  </div>
                </div>

                {/* Cover Image */}
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Muqova rasmi (ixtiyoriy)</label>
                  <div className="relative group border border-dashed border-slate-800 hover:border-slate-700 rounded-xl bg-slate-950/40 transition-all p-4 text-center cursor-pointer">
                    <input 
                      type="file" 
                      accept="image/*"
                      disabled={uploading}
                      onChange={(e) => handleFileChange(e, 'cover')}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="flex flex-col items-center justify-center gap-1.5">
                      <ImageIcon className={`h-6 w-6 ${coverFile ? 'text-emerald-400' : 'text-slate-650 group-hover:text-slate-500'}`} />
                      <span className="text-[10px] font-bold text-slate-300">
                        {coverFile ? coverFile.name : "Muqova rasmini yuklang"}
                      </span>
                      <span className="text-[9px] text-slate-500 font-medium">JPG, PNG formatlari</span>
                    </div>
                  </div>
                </div>

                {/* Upload Progress Bar */}
                {uploading && (
                  <div className="space-y-1.5 pt-2">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-slate-400 flex items-center gap-1.5">
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-emerald-400" />
                        Yuklanmoqda...
                      </span>
                      <span className="text-emerald-400 font-bold">{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className="bg-emerald-500 h-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Submit button */}
                <Button
                  type="submit"
                  disabled={uploading}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs py-3.5 rounded-xl shadow-md mt-2 transition-all uppercase tracking-wider"
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

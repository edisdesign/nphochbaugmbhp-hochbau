import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  FolderKanban, Image, LogOut, Plus, Trash2, X, Camera,
  MapPin, ArrowLeft, Check, Loader2, RefreshCw, Wifi, WifiOff
} from 'lucide-react';
import {
  getProjectsFromPB, addProjectToPB, deleteProjectFromPB, updateProjectInPB,
  getGalleryFromPB, addPhotoToPB, deletePhotoFromPB,
  isAuthenticated, clearAuth, retryPBConnection,
  type SiteProject, type GalleryPhoto
} from '@/app/lib/dataStore';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { toast, Toaster } from 'sonner';
import { autoSeedIfEmpty } from '@/app/lib/seedData';
import { isAnyCollectionAvailable } from '@/app/lib/pb';

import logoWhite from '@/assets/bc2e48b7921d8873d5b86d52150de03fe4507903.png';

type Tab = 'projects' | 'gallery';

export function AdminDashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('projects');
  const [pbProjects, setPbProjects] = useState<SiteProject[]>([]);
  const [pbPhotos, setPbPhotos] = useState<GalleryPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [seedMessage, setSeedMessage] = useState('');
  const [schemaWarning, setSchemaWarning] = useState('');

  // Project form
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editingProject, setEditingProject] = useState<SiteProject | null>(null);
  const [saving, setSaving] = useState(false);
  const [projectForm, setProjectForm] = useState({
    title: '',
    location: '',
    year: new Date().getFullYear().toString(),
    category: 'GEWERBEBAU' as 'GEWERBEBAU' | 'WOHNBAU',
    descriptionDE: '',
    descriptionEN: '',
    descriptionBHS: '',
    partner: '',
  });

  // File states
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [mainImagePreview, setMainImagePreview] = useState('');
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [existingGalleryUrls, setExistingGalleryUrls] = useState<string[]>([]);
  const [removedGalleryFilenames, setRemovedGalleryFilenames] = useState<string[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryFileRef = useRef<HTMLInputElement>(null);
  const photoUploadRef = useRef<HTMLInputElement>(null);

  // Auth check
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/admin');
    }
  }, [navigate]);

  // Load PocketBase data
  const loadData = async (doSeed = false, resetCache = false) => {
    setLoading(true);
    if (resetCache) {
      retryPBConnection(); // only reset cache when explicitly requested
    }
    try {
      const [p, g] = await Promise.all([getProjectsFromPB(), getGalleryFromPB()]);
      setPbProjects(p);
      setPbPhotos(g);
      // Check actual connection status based on collection availability cache
      setConnected(isAnyCollectionAvailable());

      // Check for schema issues: projects exist but have no title/image
      if (p.length > 0) {
        const broken = p.filter(proj => !proj.title && !proj.image);
        if (broken.length > 0) {
          setSchemaWarning(
            `${broken.length} projekat(a) nema naziv niti sliku. Ovo znaci da PocketBase kolekcija "projects" nema pravilno definisana polja. ` +
            `Idi na nphochbau.pockethost.io/_/ → collections → projects i provjeri da postoje polja: ` +
            `title (text), location (text), year (text), category (select: GEWERBEBAU, WOHNBAU), partner (text), ` +
            `description_de (text), description_en (text), description_bhs (text), main_image (file, single), gallery_images (file, multiple). ` +
            `Otvori browser Console (F12) za detaljne [NP] logove.`
          );
        } else {
          setSchemaWarning('');
        }
      } else {
        setSchemaWarning('');
      }

      // Auto-seed if both collections are empty (first time setup)
      if (doSeed && p.length === 0 && g.length === 0) {
        setSeeding(true);
        setSeedMessage('Provjeram PocketBase...');
        try {
          const result = await autoSeedIfEmpty((msg) => setSeedMessage(msg));
          if (result.seededProjects > 0 || result.seededGallery > 0) {
            toast.success(`Auto-seed: ${result.seededProjects} projekata, ${result.seededGallery} galerijskih slika`);
            // Reload data after seeding
            const [p2, g2] = await Promise.all([getProjectsFromPB(), getGalleryFromPB()]);
            setPbProjects(p2);
            setPbPhotos(g2);
          }
        } catch (err) {
          console.warn('[NP] Auto-seed failed:', err);
        }
        setSeeding(false);
        setSeedMessage('');
      }
    } catch {
      setConnected(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData(true, true); // first load: try auto-seed + reset cache
  }, []);

  const handleLogout = () => {
    clearAuth();
    navigate('/admin');
  };

  // ---- PROJECT FUNCTIONS ----

  const resetProjectForm = () => {
    setProjectForm({
      title: '', location: '', year: new Date().getFullYear().toString(),
      category: 'GEWERBEBAU', descriptionDE: '', descriptionEN: '', descriptionBHS: '',
      partner: '',
    });
    setMainImageFile(null);
    setMainImagePreview('');
    setGalleryFiles([]);
    setGalleryPreviews([]);
    setExistingGalleryUrls([]);
    setRemovedGalleryFilenames([]);
    setEditingProject(null);
  };

  const openNewProject = () => {
    resetProjectForm();
    setShowProjectForm(true);
  };

  const openEditProject = (project: SiteProject) => {
    setEditingProject(project);
    setProjectForm({
      title: project.title,
      location: project.location,
      year: project.details?.year || '',
      category: project.category,
      descriptionDE: project.description.DE,
      descriptionEN: project.description.EN,
      descriptionBHS: project.description.BHS,
      partner: project.details?.partner || '',
    });
    setMainImagePreview(project.image);
    setMainImageFile(null);
    setExistingGalleryUrls(project.gallery);
    setGalleryFiles([]);
    setGalleryPreviews([]);
    setRemovedGalleryFilenames([]);
    setShowProjectForm(true);
  };

  const handleMainImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setMainImageFile(file);
    const url = URL.createObjectURL(file);
    setMainImagePreview(url);
  };

  const handleGalleryImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newFiles = Array.from(files);
    setGalleryFiles(prev => [...prev, ...newFiles]);
    const newPreviews = newFiles.map(f => URL.createObjectURL(f));
    setGalleryPreviews(prev => [...prev, ...newPreviews]);
  };

  const removeNewGalleryImage = (idx: number) => {
    setGalleryFiles(prev => prev.filter((_, i) => i !== idx));
    setGalleryPreviews(prev => prev.filter((_, i) => i !== idx));
  };

  const removeExistingGalleryImage = (url: string, idx: number) => {
    const parts = url.split('/');
    const filename = parts[parts.length - 1]?.split('?')[0] || '';
    setRemovedGalleryFilenames(prev => [...prev, filename]);
    setExistingGalleryUrls(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSaveProject = async () => {
    if (!projectForm.title.trim()) {
      toast.error('Unesite naziv projekta');
      return;
    }
    if (!mainImageFile && !mainImagePreview) {
      toast.error('Dodajte glavnu sliku');
      return;
    }

    setSaving(true);

    if (editingProject) {
      const result = await updateProjectInPB(editingProject.id, {
        title: projectForm.title,
        location: projectForm.location,
        year: projectForm.year,
        category: projectForm.category,
        partner: projectForm.partner,
        descriptionDE: projectForm.descriptionDE || projectForm.title,
        descriptionEN: projectForm.descriptionEN || projectForm.title,
        descriptionBHS: projectForm.descriptionBHS || projectForm.title,
        mainImageFile: mainImageFile || undefined,
        galleryFiles: galleryFiles.length > 0 ? galleryFiles : undefined,
        removeGalleryImages: removedGalleryFilenames.length > 0 ? removedGalleryFilenames : undefined,
      });

      if (result.ok) {
        toast.success('Projekat ažuriran!');
        setShowProjectForm(false);
        resetProjectForm();
        // Small delay to let PocketHost process the file upload
        await new Promise(r => setTimeout(r, 800));
        await loadData();
      } else {
        toast.error(result.error || 'Greška pri ažuriranju.');
      }
    } else {
      const result = await addProjectToPB({
        title: projectForm.title,
        location: projectForm.location,
        year: projectForm.year,
        category: projectForm.category,
        partner: projectForm.partner,
        descriptionDE: projectForm.descriptionDE || projectForm.title,
        descriptionEN: projectForm.descriptionEN || projectForm.title,
        descriptionBHS: projectForm.descriptionBHS || projectForm.title,
        mainImageFile,
        galleryFiles,
      });

      if (result.ok) {
        toast.success('Projekat dodat!');
        setShowProjectForm(false);
        resetProjectForm();
        // Small delay to let PocketHost process the file upload
        await new Promise(r => setTimeout(r, 800));
        await loadData();
      } else {
        toast.error(result.error || 'Greška pri dodavanju.');
      }
    }

    setSaving(false);
  };

  const handleDeleteProject = async (id: string) => {
    const result = await deleteProjectFromPB(id);
    if (result.ok) {
      toast.success('Projekat obrisan');
      await loadData();
    } else {
      toast.error(result.error || 'Greška pri brisanju');
    }
  };

  // ---- PHOTO FUNCTIONS ----

  const handleDeletePhoto = async (id: string) => {
    const result = await deletePhotoFromPB(id);
    if (result.ok) {
      toast.success('Slika obrisana');
      await loadData();
    } else {
      toast.error(result.error || 'Greška pri brisanju slike');
    }
  };

  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const [showPhotoForm, setShowPhotoForm] = useState(false);
  const [photoForm, setPhotoForm] = useState({
    caption: '',
    category: '' as 'GEWERBEBAU' | 'WOHNBAU' | '',
    baustelle: '',
    location: '',
  });
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);

  const resetPhotoForm = () => {
    setPhotoForm({ caption: '', category: '', baustelle: '', location: '' });
    setPhotoFiles([]);
    setPhotoPreviews([]);
  };

  const handlePhotoFilesSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const newFiles = Array.from(files);
    setPhotoFiles(prev => [...prev, ...newFiles]);
    setPhotoPreviews(prev => [...prev, ...newFiles.map(f => URL.createObjectURL(f))]);
    if (photoUploadRef.current) photoUploadRef.current.value = '';
  };

  const removePhotoFile = (idx: number) => {
    setPhotoFiles(prev => prev.filter((_, i) => i !== idx));
    setPhotoPreviews(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSavePhotos = async () => {
    if (photoFiles.length === 0) {
      toast.error('Dodajte bar jednu sliku');
      return;
    }

    setUploadingPhotos(true);
    let successCount = 0;
    let lastError = '';

    for (const file of photoFiles) {
      const caption = photoForm.caption || file.name.replace(/\\.[^.]+$/, '');
      const result = await addPhotoToPB(file, caption, photoForm.category, photoForm.baustelle, photoForm.location);
      if (result.ok) {
        successCount++;
        if (result.error === 'FIELDS_MISSING') {
          toast.info('Slika dodana bez kategorije/baustelle/lokacije. Dodaj ta polja u PocketBase gallery kolekciju.', { duration: 6000 });
        }
      } else {
        lastError = result.error || 'Nepoznata greška';
      }
    }

    if (successCount > 0) {
      toast.success(`${successCount} slika dodano`);
      setShowPhotoForm(false);
      resetPhotoForm();
      await loadData();
    } else {
      toast.error(lastError || 'Greška pri uploadu.');
    }

    setUploadingPhotos(false);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] font-['Inter']">
      <Toaster position="top-center" richColors />

      {/* Top bar */}
      <div className="sticky top-0 z-40 bg-[#0A0A0A]/95 backdrop-blur-md border-b border-white/[0.06]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logoWhite} alt="NP" className="h-7 w-auto opacity-70" />
            <span className="text-white/20 text-[10px] uppercase tracking-widest hidden sm:inline">Admin</span>
            <div className={`flex items-center gap-1 text-[10px] ${connected ? 'text-green-400/50' : 'text-red-400/50'}`}>
              {connected ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
              <span className="hidden sm:inline">{connected ? 'PocketBase' : 'Offline'}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => loadData(false, true)}
              className="text-white/20 hover:text-white/50 p-2 transition-colors"
              title="Osvježi"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => navigate('/')}
              className="text-white/30 hover:text-white/60 text-xs px-3 py-1.5 transition-colors"
            >
              Sajt
            </button>
            <button
              onClick={handleLogout}
              className="text-red-400/50 hover:text-red-400 p-2 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-2xl mx-auto px-4 flex gap-0">
          <button
            onClick={() => setTab('projects')}
            className={`flex items-center gap-2 px-5 py-3 text-xs uppercase tracking-widest transition-colors border-b-2 ${
              tab === 'projects'
                ? 'text-[#F4B400] border-[#F4B400]'
                : 'text-white/30 border-transparent hover:text-white/50'
            }`}
          >
            <FolderKanban className="w-4 h-4" />
            Projekti
            <span className="text-[10px] bg-white/[0.06] px-1.5 py-0.5 rounded-sm">{pbProjects.length}</span>
          </button>
          <button
            onClick={() => setTab('gallery')}
            className={`flex items-center gap-2 px-5 py-3 text-xs uppercase tracking-widest transition-colors border-b-2 ${
              tab === 'gallery'
                ? 'text-[#F4B400] border-[#F4B400]'
                : 'text-white/30 border-transparent hover:text-white/50'
            }`}
          >
            <Image className="w-4 h-4" />
            Einblicke
            <span className="text-[10px] bg-white/[0.06] px-1.5 py-0.5 rounded-sm">{pbPhotos.length}</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Connection warning */}
        {!loading && !seeding && !connected && (
          <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-sm">
            <p className="text-red-400 text-sm mb-2">PocketBase konekcija nije uspostavljena</p>
            <p className="text-white/40 text-xs mb-3">
              Provjeri da na <a href="https://nphochbau.pockethost.io/_/" target="_blank" rel="noopener" className="text-[#F4B400] underline">nphochbau.pockethost.io/_/</a> postoje kolekcije "projects" i "gallery" sa public API pravilima (sva polja prazna).
            </p>
            <button
              onClick={() => loadData(false, true)}
              className="text-xs text-[#F4B400] uppercase tracking-widest hover:text-[#F4B400]/80"
            >
              Pokušaj ponovo
            </button>
          </div>
        )}

        {/* Schema mismatch warning */}
        {!loading && !seeding && schemaWarning && (
          <div className="mb-4 p-4 bg-orange-500/10 border border-orange-500/20 rounded-sm">
            <p className="text-orange-400 text-sm mb-2">PocketBase Schema Problem</p>
            <p className="text-white/40 text-xs mb-3 whitespace-pre-wrap">{schemaWarning}</p>
            <div className="flex gap-3">
              <a
                href="https://nphochbau.pockethost.io/_/"
                target="_blank"
                rel="noopener"
                className="text-xs text-[#F4B400] uppercase tracking-widest hover:text-[#F4B400]/80"
              >
                Otvori PB Admin
              </a>
              <button
                onClick={() => loadData(false, true)}
                className="text-xs text-white/40 uppercase tracking-widest hover:text-white/60"
              >
                Provjeri ponovo
              </button>
            </div>
          </div>
        )}

        {loading || seeding ? (
          <div className="flex flex-col items-center justify-center py-20 text-white/20 gap-3">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="text-xs uppercase tracking-widest">
              {seeding ? seedMessage || 'Auto-seed u toku...' : 'Učitavanje...'}
            </span>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {tab === 'projects' ? (
              <motion.div
                key="projects"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="space-y-4"
              >
                {/* Add button */}
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={openNewProject}
                  className="w-full bg-[#F4B400] text-black py-3.5 rounded-sm flex items-center justify-center gap-2 text-xs uppercase tracking-widest font-semibold active:bg-[#F4B400]/80"
                >
                  <Plus className="w-4 h-4" />
                  Novi Projekat
                </motion.button>

                {/* PocketBase projects section */}
                {pbProjects.length > 0 && (
                  <div className="text-white/20 text-[10px] uppercase tracking-widest pt-2 flex items-center gap-2">
                    <Wifi className="w-3 h-3" />
                    PocketBase ({pbProjects.length})
                  </div>
                )}

                {pbProjects.map((project) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#111] border border-white/[0.06] rounded-sm overflow-hidden"
                  >
                    <div className="flex gap-3 p-3">
                      <div className="w-20 h-20 rounded-sm overflow-hidden shrink-0 bg-[#0A0A0A]">
                        {project.image && (
                          <ImageWithFallback
                            src={project.image}
                            alt={project.title}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0 py-0.5">
                        <h3 className="text-white text-sm truncate">{project.title}</h3>
                        <div className="flex items-center gap-2 mt-1 text-white/30 text-[11px]">
                          <MapPin className="w-3 h-3 shrink-0" />
                          <span className="truncate">{project.location}</span>
                        </div>
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className="text-[10px] px-2 py-0.5 rounded-sm bg-[#F4B400]/10 text-[#F4B400]">
                            {project.category === 'GEWERBEBAU' ? 'Gewerbe' : 'Wohn'}
                          </span>
                          <span className="text-white/20 text-[10px]">{project.details?.year}</span>
                          {project.gallery.length > 0 && (
                            <span className="text-white/20 text-[10px] flex items-center gap-1">
                              <Image className="w-2.5 h-2.5" /> {project.gallery.length}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col gap-1 shrink-0">
                        <button
                          onClick={() => openEditProject(project)}
                          className="p-2 text-white/30 hover:text-[#F4B400] active:text-[#F4B400] transition-colors"
                        >
                          <FolderKanban className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Obrisati projekat?')) handleDeleteProject(project.id);
                          }}
                          className="p-2 text-white/20 hover:text-red-400 active:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="gallery"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="space-y-4"
              >
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => { resetPhotoForm(); setShowPhotoForm(true); }}
                  className="w-full bg-[#F4B400] text-black py-3.5 rounded-sm flex items-center justify-center gap-2 text-xs uppercase tracking-widest font-semibold active:bg-[#F4B400]/80"
                >
                  <Plus className="w-4 h-4" />
                  Novi Einblick
                </motion.button>

                {/* PocketBase photos */}
                {pbPhotos.length > 0 && (
                  <div className="text-white/20 text-[10px] uppercase tracking-widest pt-2 flex items-center gap-2">
                    <Wifi className="w-3 h-3" />
                    PocketBase ({pbPhotos.length})
                  </div>
                )}

                {pbPhotos.map((photo) => (
                  <motion.div
                    key={photo.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#111] border border-white/[0.06] rounded-sm overflow-hidden"
                  >
                    <div className="flex gap-3 p-3">
                      <div className="w-20 h-20 rounded-sm overflow-hidden shrink-0 bg-[#0A0A0A]">
                        <ImageWithFallback
                          src={photo.src}
                          alt={photo.caption}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0 py-0.5">
                        <h3 className="text-white text-sm truncate">{photo.baustelle || photo.caption}</h3>
                        {photo.location && (
                          <div className="flex items-center gap-2 mt-1 text-white/30 text-[11px]">
                            <MapPin className="w-3 h-3 shrink-0" />
                            <span className="truncate">{photo.location}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-3 mt-1.5">
                          {photo.category && (
                            <span className="text-[10px] px-2 py-0.5 rounded-sm bg-[#F4B400]/10 text-[#F4B400]">
                              {photo.category === 'GEWERBEBAU' ? 'Gewerbe' : 'Wohn'}
                            </span>
                          )}
                          {photo.caption && photo.baustelle && photo.caption !== photo.baustelle && (
                            <span className="text-white/20 text-[10px] truncate">{photo.caption}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col gap-1 shrink-0">
                        <button
                          onClick={() => {
                            if (confirm('Obrisati sliku?')) handleDeletePhoto(photo.id);
                          }}
                          className="p-2 text-white/20 hover:text-red-400 active:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>

      {/* PROJECT FORM MODAL */}
      <AnimatePresence>
        {showProjectForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#0A0A0A] overflow-y-auto"
          >
            <div className="sticky top-0 z-10 bg-[#0A0A0A]/95 backdrop-blur-md border-b border-white/[0.06]">
              <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
                <button
                  onClick={() => { setShowProjectForm(false); resetProjectForm(); }}
                  className="flex items-center gap-2 text-white/40 hover:text-white/70 text-sm transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Nazad
                </button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSaveProject}
                  disabled={saving}
                  className="flex items-center gap-2 bg-[#F4B400] text-black px-5 py-2 rounded-sm text-xs uppercase tracking-widest font-semibold disabled:opacity-50"
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  {saving ? 'Čuvam...' : 'Sačuvaj'}
                </motion.button>
              </div>
            </div>

            <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
              <h2 className="text-white font-['Oswald'] text-xl uppercase tracking-wider">
                {editingProject ? 'Uredi projekat' : 'Novi projekat'}
              </h2>

              {/* Main Image */}
              <div>
                <label className="block text-white/40 text-xs uppercase tracking-widest mb-2">Glavna slika *</label>
                {mainImagePreview ? (
                  <div className="relative aspect-video rounded-sm overflow-hidden bg-[#111]">
                    <ImageWithFallback src={mainImagePreview} alt="Main" className="w-full h-full object-cover" />
                    <button
                      onClick={() => { setMainImagePreview(''); setMainImageFile(null); }}
                      className="absolute top-2 right-2 p-2 bg-black/70 text-white rounded-sm"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full aspect-video bg-[#111] border-2 border-dashed border-white/[0.08] rounded-sm flex flex-col items-center justify-center gap-2 text-white/20 active:border-[#F4B400]/30 transition-colors"
                  >
                    <Camera className="w-8 h-8" />
                    <span className="text-xs">Dodaj sliku</span>
                  </button>
                )}
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleMainImage} className="hidden" />
              </div>

              {/* Title */}
              <div>
                <label className="block text-white/40 text-xs uppercase tracking-widest mb-2">Naziv projekta *</label>
                <input
                  type="text"
                  value={projectForm.title}
                  onChange={(e) => setProjectForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="npr. Wohnanlage Bockenheim"
                  className="w-full bg-[#111] border border-white/[0.08] rounded-sm px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-[#F4B400]/50 transition-colors text-sm"
                />
              </div>

              {/* Location + Year */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-white/40 text-xs uppercase tracking-widest mb-2">Lokacija</label>
                  <input
                    type="text"
                    value={projectForm.location}
                    onChange={(e) => setProjectForm(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Frankfurt"
                    className="w-full bg-[#111] border border-white/[0.08] rounded-sm px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-[#F4B400]/50 transition-colors text-sm"
                  />
                </div>
                <div>
                  <label className="block text-white/40 text-xs uppercase tracking-widest mb-2">Godina</label>
                  <input
                    type="text"
                    value={projectForm.year}
                    onChange={(e) => setProjectForm(prev => ({ ...prev, year: e.target.value }))}
                    placeholder="2026"
                    className="w-full bg-[#111] border border-white/[0.08] rounded-sm px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-[#F4B400]/50 transition-colors text-sm"
                  />
                </div>
              </div>

              {/* Category + Partner */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-white/40 text-xs uppercase tracking-widest mb-2">Kategorija</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setProjectForm(prev => ({ ...prev, category: 'GEWERBEBAU' }))}
                      className={`flex-1 py-2.5 text-[11px] uppercase tracking-wider rounded-sm border transition-colors ${
                        projectForm.category === 'GEWERBEBAU'
                          ? 'bg-[#F4B400]/10 border-[#F4B400]/40 text-[#F4B400]'
                          : 'border-white/[0.08] text-white/30'
                      }`}
                    >
                      Gewerbe
                    </button>
                    <button
                      onClick={() => setProjectForm(prev => ({ ...prev, category: 'WOHNBAU' }))}
                      className={`flex-1 py-2.5 text-[11px] uppercase tracking-wider rounded-sm border transition-colors ${
                        projectForm.category === 'WOHNBAU'
                          ? 'bg-[#F4B400]/10 border-[#F4B400]/40 text-[#F4B400]'
                          : 'border-white/[0.08] text-white/30'
                      }`}
                    >
                      Wohn
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-white/40 text-xs uppercase tracking-widest mb-2">Partner</label>
                  <input
                    type="text"
                    value={projectForm.partner}
                    onChange={(e) => setProjectForm(prev => ({ ...prev, partner: e.target.value }))}
                    placeholder="opciono"
                    className="w-full bg-[#111] border border-white/[0.08] rounded-sm px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-[#F4B400]/50 transition-colors text-sm"
                  />
                </div>
              </div>

              {/* Description DE */}
              <div>
                <label className="block text-white/40 text-xs uppercase tracking-widest mb-2">Opis (DE)</label>
                <textarea
                  value={projectForm.descriptionDE}
                  onChange={(e) => setProjectForm(prev => ({ ...prev, descriptionDE: e.target.value }))}
                  placeholder="Opis na njemačkom..."
                  rows={3}
                  className="w-full bg-[#111] border border-white/[0.08] rounded-sm px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-[#F4B400]/50 transition-colors text-sm resize-none"
                />
              </div>

              {/* Description EN */}
              <div>
                <label className="block text-white/40 text-xs uppercase tracking-widest mb-2">Opis (EN)</label>
                <textarea
                  value={projectForm.descriptionEN}
                  onChange={(e) => setProjectForm(prev => ({ ...prev, descriptionEN: e.target.value }))}
                  placeholder="Description in English..."
                  rows={3}
                  className="w-full bg-[#111] border border-white/[0.08] rounded-sm px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-[#F4B400]/50 transition-colors text-sm resize-none"
                />
              </div>

              {/* Description BHS */}
              <div>
                <label className="block text-white/40 text-xs uppercase tracking-widest mb-2">Opis (BHS)</label>
                <textarea
                  value={projectForm.descriptionBHS}
                  onChange={(e) => setProjectForm(prev => ({ ...prev, descriptionBHS: e.target.value }))}
                  placeholder="Opis na bosanskom/hrvatskom/srpskom..."
                  rows={3}
                  className="w-full bg-[#111] border border-white/[0.08] rounded-sm px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-[#F4B400]/50 transition-colors text-sm resize-none"
                />
              </div>

              {/* Gallery Images */}
              <div>
                <label className="block text-white/40 text-xs uppercase tracking-widest mb-2">
                  Galerija ({existingGalleryUrls.length + galleryPreviews.length} slika)
                </label>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  {existingGalleryUrls.map((url, idx) => (
                    <div key={`existing-${idx}`} className="relative aspect-square rounded-sm overflow-hidden bg-[#111]">
                      <ImageWithFallback src={url} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                      <button
                        onClick={() => removeExistingGalleryImage(url, idx)}
                        className="absolute top-1 right-1 p-1 bg-black/70 text-white rounded-sm"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  {galleryPreviews.map((preview, idx) => (
                    <div key={`new-${idx}`} className="relative aspect-square rounded-sm overflow-hidden bg-[#111]">
                      <ImageWithFallback src={preview} alt={`New ${idx}`} className="w-full h-full object-cover" />
                      <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-[#F4B400]/80 text-black text-[8px] rounded-sm uppercase">Novo</div>
                      <button
                        onClick={() => removeNewGalleryImage(idx)}
                        className="absolute top-1 right-1 p-1 bg-black/70 text-white rounded-sm"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => galleryFileRef.current?.click()}
                    className="aspect-square bg-[#111] border border-dashed border-white/[0.08] rounded-sm flex items-center justify-center text-white/20 active:border-[#F4B400]/30"
                  >
                    <Plus className="w-6 h-6" />
                  </button>
                </div>
                <input ref={galleryFileRef} type="file" accept="image/*" multiple onChange={handleGalleryImages} className="hidden" />
              </div>

              {/* Save button */}
              <div className="pt-4 pb-8">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleSaveProject}
                  disabled={saving}
                  className="w-full bg-[#F4B400] text-black py-3.5 rounded-sm flex items-center justify-center gap-2 text-xs uppercase tracking-widest font-semibold active:bg-[#F4B400]/80 disabled:opacity-50"
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  {saving ? 'Čuvam...' : editingProject ? 'Ažuriraj projekat' : 'Sačuvaj projekat'}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* EINBLICKE PHOTO FORM MODAL */}
      <AnimatePresence>
        {showPhotoForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#0A0A0A] overflow-y-auto"
          >
            <div className="sticky top-0 z-10 bg-[#0A0A0A]/95 backdrop-blur-md border-b border-white/[0.06]">
              <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
                <button
                  onClick={() => { setShowPhotoForm(false); resetPhotoForm(); }}
                  className="flex items-center gap-2 text-white/40 hover:text-white/70 text-sm transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Nazad
                </button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSavePhotos}
                  disabled={uploadingPhotos}
                  className="flex items-center gap-2 bg-[#F4B400] text-black px-5 py-2 rounded-sm text-xs uppercase tracking-widest font-semibold disabled:opacity-50"
                >
                  {uploadingPhotos ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  {uploadingPhotos ? 'Učitavam...' : 'Sačuvaj'}
                </motion.button>
              </div>
            </div>

            <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
              <h2 className="text-white font-['Oswald'] text-xl uppercase tracking-wider">
                Novi Einblick
              </h2>

              {/* Photos */}
              <div>
                <label className="block text-white/40 text-xs uppercase tracking-widest mb-2">
                  Slike * ({photoPreviews.length} odabrano)
                </label>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  {photoPreviews.map((preview, idx) => (
                    <div key={idx} className="relative aspect-square rounded-sm overflow-hidden bg-[#111]">
                      <ImageWithFallback src={preview} alt={`Photo ${idx}`} className="w-full h-full object-cover" />
                      <button
                        onClick={() => removePhotoFile(idx)}
                        className="absolute top-1 right-1 p-1 bg-black/70 text-white rounded-sm"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => photoUploadRef.current?.click()}
                    className="aspect-square bg-[#111] border-2 border-dashed border-white/[0.08] rounded-sm flex flex-col items-center justify-center gap-1 text-white/20 active:border-[#F4B400]/30 transition-colors"
                  >
                    <Camera className="w-6 h-6" />
                    <span className="text-[10px]">Dodaj</span>
                  </button>
                </div>
                <input
                  ref={photoUploadRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoFilesSelect}
                  className="hidden"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-white/40 text-xs uppercase tracking-widest mb-2">Kategorija</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPhotoForm(prev => ({ ...prev, category: prev.category === 'GEWERBEBAU' ? '' : 'GEWERBEBAU' }))}
                    className={`flex-1 py-2.5 text-[11px] uppercase tracking-wider rounded-sm border transition-colors ${
                      photoForm.category === 'GEWERBEBAU'
                        ? 'bg-[#F4B400]/10 border-[#F4B400]/40 text-[#F4B400]'
                        : 'border-white/[0.08] text-white/30'
                    }`}
                  >
                    Gewerbebau
                  </button>
                  <button
                    onClick={() => setPhotoForm(prev => ({ ...prev, category: prev.category === 'WOHNBAU' ? '' : 'WOHNBAU' }))}
                    className={`flex-1 py-2.5 text-[11px] uppercase tracking-wider rounded-sm border transition-colors ${
                      photoForm.category === 'WOHNBAU'
                        ? 'bg-[#F4B400]/10 border-[#F4B400]/40 text-[#F4B400]'
                        : 'border-white/[0.08] text-white/30'
                    }`}
                  >
                    Wohnbau
                  </button>
                </div>
              </div>

              {/* Baustelle Name */}
              <div>
                <label className="block text-white/40 text-xs uppercase tracking-widest mb-2">Naziv Baustelle</label>
                <input
                  type="text"
                  value={photoForm.baustelle}
                  onChange={(e) => setPhotoForm(prev => ({ ...prev, baustelle: e.target.value }))}
                  placeholder="npr. Neubau Eschersheimer Landstraße"
                  className="w-full bg-[#111] border border-white/[0.08] rounded-sm px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-[#F4B400]/50 transition-colors text-sm"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-white/40 text-xs uppercase tracking-widest mb-2">Lokacija</label>
                <input
                  type="text"
                  value={photoForm.location}
                  onChange={(e) => setPhotoForm(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="npr. Frankfurt am Main"
                  className="w-full bg-[#111] border border-white/[0.08] rounded-sm px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-[#F4B400]/50 transition-colors text-sm"
                />
              </div>

              {/* Caption */}
              <div>
                <label className="block text-white/40 text-xs uppercase tracking-widest mb-2">Opis / Caption (opciono)</label>
                <input
                  type="text"
                  value={photoForm.caption}
                  onChange={(e) => setPhotoForm(prev => ({ ...prev, caption: e.target.value }))}
                  placeholder="npr. Betonierarbeiten 3. OG"
                  className="w-full bg-[#111] border border-white/[0.08] rounded-sm px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-[#F4B400]/50 transition-colors text-sm"
                />
              </div>

              {/* Save button */}
              <div className="pt-4 pb-8">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleSavePhotos}
                  disabled={uploadingPhotos}
                  className="w-full bg-[#F4B400] text-black py-3.5 rounded-sm flex items-center justify-center gap-2 text-xs uppercase tracking-widest font-semibold active:bg-[#F4B400]/80 disabled:opacity-50"
                >
                  {uploadingPhotos ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  {uploadingPhotos ? 'Učitavam...' : 'Sačuvaj Einblick'}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
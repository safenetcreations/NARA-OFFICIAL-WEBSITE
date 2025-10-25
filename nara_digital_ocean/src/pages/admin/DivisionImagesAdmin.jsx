import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { DIVISIONS_CONFIG } from '../../data/divisionsConfig';
import {
  getDivisionImages,
  uploadDivisionImage,
  setPrimaryImage,
  deleteDivisionImage,
  saveAIGeneratedImage
} from '../../services/divisionImagesService';
import {
  generateDivisionImagePrompts,
  DIVISION_IMAGE_PROMPTS
} from '../../services/geminiImageService';
import {
  saveLocalDivisionImages,
  getLocalDivisionImages,
  removeLocalDivisionImage,
  clearLocalDivisionImages
} from '../../utils/localImageStorage';
import {
  enhanceAllPrompts,
  suggestImagePrompts
} from '../../services/vertexAIService';
import {
  generateDivisionImagesWithGemini
} from '../../services/geminiNativeImageService';
import { storage } from '../../firebase';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';

const DivisionImagesAdmin = () => {
  const [selectedDivision, setSelectedDivision] = useState(null);
  const [divisionImages, setDivisionImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState(null);
  const [customPrompts, setCustomPrompts] = useState(['', '', '', '']);
  const [useCustomPrompts, setUseCustomPrompts] = useState(false);
  const [enhancing, setEnhancing] = useState(false);
  const [generatingGemini, setGeneratingGemini] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (selectedDivision) {
      loadDivisionImages();
    }
  }, [selectedDivision]);

  const loadDivisionImages = async () => {
    setLoading(true);

    try {
      // PRIORITY 1: Try localStorage first (contains base64 data URLs that always work!)
      console.log('🔍 Checking localStorage first (base64 data URLs)...');
      const localImages = getLocalDivisionImages(selectedDivision.id);

      if (localImages && localImages.length > 0) {
        console.log('✅ Loaded', localImages.length, 'images from localStorage (base64 data URLs)');
        setDivisionImages(localImages.map((url, idx) => ({
          id: `local_${idx}`,
          url,
          aiGenerated: url.startsWith('data:'),
          uploadedAt: new Date().toISOString(),
          filename: `${url.startsWith('data:') ? 'AI Generated' : 'Uploaded'} Image ${idx + 1}`
        })));
        setLoading(false);
        return;
      }
    } catch (error) {
      console.log('localStorage check failed:', error.message);
    }

    try {
      // PRIORITY 2: Try Firebase as fallback (but DO NOT sync Firebase URLs to localStorage!)
      console.log('🔍 Checking Firebase for images...');
      const result = await getDivisionImages(selectedDivision.id);

      if (result.success && result.images.length > 0) {
        console.log('✅ Loaded', result.images.length, 'images from Firebase');
        console.log('⚠️  WARNING: Firebase URLs may have auth issues. Use admin panel to regenerate as base64.');

        const imageData = result.images.map(img => ({
          id: img.id || `fb_${Date.now()}_${Math.random()}`,
          url: img.url,
          aiGenerated: img.aiGenerated || false,
          uploadedAt: img.uploadedAt || new Date().toISOString(),
          filename: img.filename || 'Division Image'
        }));
        setDivisionImages(imageData);

        // DO NOT sync Firebase URLs to localStorage - they may fail with 403!
        // Only base64 data URLs should be in localStorage
        console.log('⚠️  NOT syncing Firebase URLs to localStorage (auth issues)');

        setLoading(false);
        return;
      }
    } catch (error) {
      console.log('Firebase check failed:', error.message);
    }

    console.log('No images found in localStorage or Firebase');
    setDivisionImages([]);
    setLoading(false);
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    setMessage({ type: 'info', text: 'Converting image to data URL...' });

    try {
      // Convert to data URL (works immediately, no Firebase auth needed!)
      const reader = new FileReader();
      reader.onload = async (e) => {
        const dataUrl = e.target.result;
        
        console.log('📤 Manual upload: Converting to data URL...');
        console.log('📏 Data URL length:', dataUrl.length, 'characters');
        
        // Add to existing images
        const newImage = {
          id: `manual_${Date.now()}`,
          url: dataUrl,
          aiGenerated: false,
          uploadedAt: new Date().toISOString(),
          filename: file.name
        };
        
        const updatedImages = [...divisionImages, newImage];
        setDivisionImages(updatedImages);
        
        console.log('📊 Total images after upload:', updatedImages.length);
        
        // Save to localStorage
        const urls = updatedImages.map(img => img.url);
        saveLocalDivisionImages(selectedDivision.id, urls);
        
        console.log('💾 Saved to localStorage for division:', selectedDivision.id);
        console.log('✅ Image added successfully!');
        
        setMessage({ 
          type: 'success', 
          text: `✅ Image added as data URL! Total: ${updatedImages.length} images. Refresh hero section to see it.` 
        });
        setUploading(false);
      };
      
      reader.onerror = () => {
        setMessage({ type: 'error', text: 'Failed to read image file' });
        setUploading(false);
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
      setUploading(false);
    }
  };

  const handleSetPrimary = async (imageId) => {
    const result = await setPrimaryImage(imageId, selectedDivision.id);
    if (result.success) {
      setMessage({ type: 'success', text: 'Primary image updated!' });
      loadDivisionImages();
    } else {
      setMessage({ type: 'error', text: result.error });
    }
  };

  const handleDelete = async (imageId, imageIndex) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    // If it's a localStorage image (starts with 'local_')
    if (imageId.startsWith('local_')) {
      const result = removeLocalDivisionImage(selectedDivision.id, imageIndex);
      if (result.success) {
        setMessage({ type: 'success', text: 'Image deleted successfully!' });
        loadDivisionImages();
      } else {
        setMessage({ type: 'error', text: result.error });
      }
    } else {
      // Firebase image
      const result = await deleteDivisionImage(imageId);
      if (result.success) {
        setMessage({ type: 'success', text: 'Image deleted successfully!' });
        loadDivisionImages();
      } else {
        setMessage({ type: 'error', text: result.error });
      }
    }
  };

  const handleEnhanceWithGemini = async () => {
    setEnhancing(true);
    setMessage({ type: 'info', text: 'Enhancing prompts with Gemini 2.5 Flash...' });

    try {
      const basePrompts = useCustomPrompts 
        ? customPrompts.filter(p => p.trim() !== '')
        : DIVISION_IMAGE_PROMPTS[selectedDivision.id] || [];

      if (basePrompts.length === 0) {
        setMessage({ type: 'error', text: 'No prompts to enhance!' });
        setEnhancing(false);
        return;
      }

      const enhanced = await enhanceAllPrompts(basePrompts, selectedDivision.name.en);
      
      // Update custom prompts with enhanced versions
      const newPrompts = ['', '', '', ''];
      enhanced.forEach((prompt, idx) => {
        if (idx < 4) newPrompts[idx] = prompt;
      });
      
      setCustomPrompts(newPrompts);
      setUseCustomPrompts(true);
      setMessage({ type: 'success', text: `✅ Gemini enhanced ${enhanced.length} prompts! Review and generate.` });
    } catch (error) {
      setMessage({ type: 'error', text: `Gemini error: ${error.message}` });
    }
    
    setEnhancing(false);
  };

  const handleClearBadImages = () => {
    if (!confirm('Clear all images for this division from localStorage? You will need to regenerate them.')) return;

    clearLocalDivisionImages(selectedDivision.id);
    setMessage({ type: 'success', text: 'localStorage cleared! Generate new images with Gemini.' });
    loadDivisionImages();
  };

  const handleGenerateWithGeminiNative = async () => {
    setGeneratingGemini(true);
    setMessage({ type: 'info', text: 'Generating images with Gemini 2.5 Flash Image... This may take 30-60 seconds.' });

    try {
      // Get prompts
      const prompts = useCustomPrompts 
        ? customPrompts.filter(p => p.trim() !== '')
        : DIVISION_IMAGE_PROMPTS[selectedDivision.id] || [];

      if (prompts.length === 0) {
        setMessage({ type: 'error', text: 'No prompts available!' });
        setGeneratingGemini(false);
        return;
      }

      // Generate images with Gemini Native
      const results = await generateDivisionImagesWithGemini(prompts, selectedDivision.name.en);
      
      // Filter successful results
      const successfulImages = results.filter(r => r.success);
      
      if (successfulImages.length === 0) {
        setMessage({ type: 'error', text: 'Failed to generate images. Check console for details.' });
        setGeneratingGemini(false);
        return;
      }

      // Convert Gemini images to data URLs (works immediately in browser)
      // Also upload to Firebase Storage for permanent backup
      setMessage({ type: 'info', text: `Processing ${successfulImages.length} Gemini images...` });
      
      const imageUrls = [];
      
      for (let i = 0; i < successfulImages.length; i++) {
        const result = successfulImages[i];
        
        // PRIORITY: Use data URL for immediate display (works in CSS backgroundImage)
        if (result.base64Data) {
          const dataUrl = `data:${result.mimeType || 'image/png'};base64,${result.base64Data}`;
          imageUrls.push(dataUrl);
          console.log(`✅ Created data URL for image ${i + 1}/${successfulImages.length}`);
        }
        
        // BACKGROUND: Also upload to Firebase Storage (for backup/sharing)
        try {
          const timestamp = Date.now();
          const filename = `${selectedDivision.id}_gemini_${timestamp}_${i}.png`;
          const storageRef = ref(storage, `divisions/${selectedDivision.id}/${filename}`);
          
          const uploadResult = await uploadString(storageRef, result.base64Data, 'base64', {
            contentType: result.mimeType || 'image/png',
            customMetadata: {
              generatedBy: 'gemini-2.5-flash',
              divisionId: selectedDivision.id,
              prompt: 'AI generated',
              timestamp: timestamp.toString()
            }
          });
          
          const downloadURL = await getDownloadURL(uploadResult.ref);
          console.log(`📤 Backed up to Firebase: ${downloadURL}`);
          
          // Save metadata to Firestore
          try {
            await saveAIGeneratedImage(selectedDivision.id, downloadURL, {
              prompt: 'Gemini 2.5 Flash Generated',
              model: 'gemini-2.5-flash',
              generatedAt: new Date().toISOString(),
              storagePath: uploadResult.ref.fullPath
            });
          } catch (firestoreError) {
            console.log('Firestore save skipped:', firestoreError.message);
          }
        } catch (uploadError) {
          console.warn(`Firebase backup failed for image ${i + 1}:`, uploadError.message);
          // Continue anyway - data URL already added
        }
      }
      
      // Save to localStorage (works immediately!)
      console.log('%c� SAVING GEMINI IMAGES TO LOCALSTORAGE', 'background: #8b5cf6; color: white; padding: 8px; font-size: 14px; font-weight: bold;');
      console.log('   Division ID:', selectedDivision.id);
      console.log('   Number of images:', imageUrls.length);
      console.log('   Image format: base64 data URLs');
      
      const saveResult = saveLocalDivisionImages(selectedDivision.id, imageUrls);
      console.log('   Save result:', saveResult);
      
      // VERIFY it was saved using correct function
      const verifyImages = getLocalDivisionImages(selectedDivision.id);
      console.log('   ✅ VERIFICATION: Retrieved', verifyImages.length, 'images from localStorage');
      console.log('   Storage key: nara_division_images');
      console.log('   📸 First image preview:', imageUrls[0]?.substring(0, 100) + '...');
      console.log('%c🎉 GEMINI IMAGES SAVED TO LOCALSTORAGE!', 'background: #10b981; color: white; padding: 8px; font-size: 16px; font-weight: bold;');

      // Update display
      setDivisionImages(imageUrls.map((url, idx) => ({
        id: `gemini_${Date.now()}_${idx}`,
        url,
        aiGenerated: true,
        uploadedAt: new Date().toISOString(),
        filename: `Gemini Native Image ${idx + 1}`
      })));

      setMessage({ 
        type: 'success', 
        text: `✅ ${successfulImages.length} GEMINI images saved! Visit /divisions/${selectedDivision.slug} and REFRESH page to see them in hero carousel.` 
      });
      
      console.log('%c✅ GEMINI GENERATION COMPLETE!', 'background: #8b5cf6; color: white; padding: 8px; font-size: 16px; font-weight: bold;');
      console.log('━'.repeat(80));
      console.log('📌 Division:', selectedDivision.name.en);
      console.log('📌 Division ID:', selectedDivision.id);
      console.log('📌 Division Slug:', selectedDivision.slug);
      console.log('📌 Model:', 'Gemini 2.5 Flash (Vertex AI)');
      console.log('📌 Images Generated:', successfulImages.length);
      console.log('📌 Storage:', 'localStorage (key: nara_division_images) + Firebase Storage');
      console.log('━'.repeat(80));
      console.log('🔗 VIEW AT:', `http://localhost:4028/divisions/${selectedDivision.slug}`);
      console.log('⚠️  IMPORTANT: REFRESH the division page to see new images!');
      console.log('━'.repeat(80));
    } catch (error) {
      setMessage({ type: 'error', text: `Error: ${error.message}` });
      console.error('Gemini Native error:', error);
    }
    
    setGeneratingGemini(false);
  };

  const handleDownloadAllImages = async () => {
    if (divisionImages.length === 0) {
      setMessage({ type: 'error', text: 'No images to download!' });
      return;
    }

    setDownloading(true);
    setMessage({ type: 'info', text: `Downloading ${divisionImages.length} images...` });

    try {
      // Download each image
      for (let i = 0; i < divisionImages.length; i++) {
        const image = divisionImages[i];
        const filename = `${selectedDivision.id}_image_${i + 1}.png`;
        
        // Fetch and download
        const response = await fetch(image.url);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        // Small delay between downloads
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      setMessage({ type: 'success', text: `✅ Downloaded ${divisionImages.length} images successfully!` });
    } catch (error) {
      setMessage({ type: 'error', text: `Download failed: ${error.message}` });
    }
    
    setDownloading(false);
  };

  const handleGenerateAIImages = async () => {
    setGenerating(true);
    
    // Use custom prompts if provided, otherwise use default prompts
    let prompts = [];
    if (useCustomPrompts) {
      prompts = customPrompts.filter(p => p.trim() !== '');
      if (prompts.length === 0) {
        setMessage({ type: 'error', text: 'Please enter at least one custom prompt!' });
        setGenerating(false);
        return;
      }
    } else {
      prompts = DIVISION_IMAGE_PROMPTS[selectedDivision.id] || [];
    }
    
    setMessage({ type: 'info', text: `Generating ${prompts.length} unique AI images with Pollinations.ai...` });
    
    // Use Pollinations.ai for REAL AI image generation
    // Each prompt creates a UNIQUE image!
    const generatedUrls = [];
    
    for (let i = 0; i < prompts.length; i++) {
      const basePrompt = prompts[i];
      
      // ENHANCE PROMPT for Pollinations.ai with Sri Lankan specifications
      const enhancedPrompt = `Professional documentary photography, WIDE environmental shot. ${basePrompt}. 
      MANDATORY: Show 3-5 SRI LANKAN people (South Asian features, authentic Sri Lankan skin tones, 60-70% male, ALWAYS include at least 1 female scientist/researcher). 
      CAMERA DISTANCE: Medium to wide shot, people 5-10 meters away from camera, NEVER close-up faces. 
      FRAMING: Full body or 3/4 body shots showing team working in environment, faces visible but NOT the main focus. 
      SETTING: Sri Lankan coastal/marine environment with coconut palms, tropical waters, NARA branding visible. 
      PEOPLE: Team collaboration, natural poses, professional scientific work, white lab coats or safety vests with NARA patches. 
      STYLE: 8K photorealistic, National Geographic quality, government research documentation aesthetic.`;
      
      // Pollinations.ai API - generates unique images from text prompts
      // Add timestamp + index to ensure different images each time
      const seed = Date.now() + (i * 1000);
      const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(enhancedPrompt)}?width=1920&height=1080&seed=${seed}&enhance=true&model=flux`;
      
      generatedUrls.push(pollinationsUrl);
      
      console.log(`🎨 Generating image ${i + 1}/${prompts.length}:`);
      console.log('   Base:', basePrompt.substring(0, 60) + '...');
      console.log('   Enhanced with: SRI LANKAN people, wide shot, team collaboration');
    }
    
    // Save to localStorage (works immediately!)
    console.log('%c💾 SAVING TO LOCALSTORAGE', 'background: #3b82f6; color: white; padding: 8px; font-size: 14px; font-weight: bold;');
    console.log('   Division ID:', selectedDivision.id);
    console.log('   Number of images:', generatedUrls.length);
    console.log('   URLs:', generatedUrls);
    
    const saveResult = saveLocalDivisionImages(selectedDivision.id, generatedUrls);
    console.log('   Save result:', saveResult);
    
    // VERIFY it was saved
    const verifyImages = getLocalDivisionImages(selectedDivision.id);
    console.log('   ✅ VERIFICATION: Retrieved', verifyImages.length, 'images from localStorage');
    console.log('   Storage key: nara_division_images');
    console.log('%c🎉 POLLINATIONS IMAGES SAVED TO LOCALSTORAGE!', 'background: #10b981; color: white; padding: 8px; font-size: 16px; font-weight: bold;');

    // Try to save to Firebase too (for future when permissions are fixed)
    for (let i = 0; i < generatedUrls.length; i++) {
      try {
        await saveAIGeneratedImage(selectedDivision.id, generatedUrls[i], {
          prompt: prompts[i],
          model: 'pollinations-ai-flux',
          generatedAt: new Date().toISOString()
        });
      } catch (error) {
        console.log('Firebase save failed (permissions), using localStorage instead');
      }
    }

    // Show success with action button
    setMessage({ 
      type: 'success', 
      text: `✅ ${generatedUrls.length} POLLINATIONS images saved! Visit /divisions/${selectedDivision.slug} and REFRESH page to see them in hero carousel.` 
    });
    
    // Update local display with actual image objects
    setDivisionImages(generatedUrls.map((url, idx) => ({
      id: `local_${Date.now()}_${idx}`,
      url,
      aiGenerated: true,
      uploadedAt: new Date().toISOString(),
      filename: `AI Generated Image ${idx + 1}`
    })));
    
    setGenerating(false);
    
    // Log confirmation
    console.log('%c✅ POLLINATIONS GENERATION COMPLETE!', 'background: #8b5cf6; color: white; padding: 8px; font-size: 16px; font-weight: bold;');
    console.log('━'.repeat(80));
    console.log('📌 Division:', selectedDivision.name.en);
    console.log('📌 Division ID:', selectedDivision.id);
    console.log('📌 Division Slug:', selectedDivision.slug);
    console.log('📌 Model:', 'Pollinations.ai Flux');
    console.log('📌 Images Generated:', generatedUrls.length);
    console.log('📌 Storage:', 'localStorage (key: nara_division_images)');
    console.log('━'.repeat(80));
    console.log('🔗 VIEW AT:', `http://localhost:4028/divisions/${selectedDivision.slug}`);
    console.log('⚠️  IMPORTANT: REFRESH the division page to see new images!');
    console.log('━'.repeat(80));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <LucideIcons.Images size={40} className="text-cyan-400" />
            Division Images Management
          </h1>
          <p className="text-blue-200">Upload, manage, and generate AI images for division pages</p>
        </div>

        {/* Messages */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 rounded-xl flex items-center justify-between ${
              message.type === 'success' ? 'bg-green-100 text-green-800' :
              message.type === 'error' ? 'bg-red-100 text-red-800' :
              'bg-blue-100 text-blue-800'
            }`}
          >
            <div className="flex items-center gap-3">
              {message.type === 'success' && <LucideIcons.CheckCircle size={24} />}
              {message.type === 'error' && <LucideIcons.AlertCircle size={24} />}
              {message.type === 'info' && <LucideIcons.Info size={24} />}
              <span>{message.text}</span>
            </div>
            {message.type === 'success' && selectedDivision && (
              <a
                href={`/divisions/${selectedDivision.slug}`}
                target="_blank"
                className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-all flex items-center gap-2"
              >
                <LucideIcons.ExternalLink size={18} />
                View in Hero Section
              </a>
            )}
          </motion.div>
        )}

        {/* Division Selector */}
        <div className="bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-2xl p-6 mb-8 border border-slate-700">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-white">
            <LucideIcons.FolderOpen size={28} className="text-cyan-400" />
            Select Division
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {DIVISIONS_CONFIG.map((division) => {
              const IconComponent = LucideIcons[division.icon];
              return (
                <motion.button
                  key={division.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedDivision(division)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedDivision?.id === division.id
                      ? `bg-gradient-to-r ${division.gradient} text-white border-white/30`
                      : 'border-slate-600 hover:border-slate-500 bg-slate-700/50 text-white hover:bg-slate-700'
                  }`}
                >
                  <IconComponent size={32} className="mx-auto mb-2" />
                  <div className="text-sm font-semibold text-center line-clamp-2">
                    {division.name.en}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Image Management Section */}
        {selectedDivision && (
          <div className="bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2 text-white">
                <LucideIcons.Image size={28} className="text-cyan-400" />
                {selectedDivision.name.en} Images
              </h2>
              <div className="flex gap-3 flex-wrap">
                {/* Gemini Native Image Generation - PREMIUM */}
                <button
                  onClick={handleGenerateWithGeminiNative}
                  disabled={generatingGemini}
                  className="bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 text-white px-6 py-3 rounded-xl font-bold hover:shadow-xl transition-all flex items-center gap-2 disabled:opacity-50 border-2 border-white/20"
                >
                  {generatingGemini ? (
                    <>
                      <LucideIcons.Loader2 size={20} className="animate-spin" />
                      Gemini Creating...
                    </>
                  ) : (
                    <>
                      <LucideIcons.Stars size={20} />
                      Generate with Gemini Native
                    </>
                  )}
                </button>

                {/* Enhance Prompts with Gemini */}
                <button
                  onClick={handleEnhanceWithGemini}
                  disabled={enhancing}
                  className="bg-gradient-to-r from-orange-600 to-amber-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {enhancing ? (
                    <>
                      <LucideIcons.Loader2 size={20} className="animate-spin" />
                      Enhancing...
                    </>
                  ) : (
                    <>
                      <LucideIcons.Wand2 size={20} />
                      Enhance Prompts
                    </>
                  )}
                </button>

                {/* Clear Bad Images from localStorage */}
                <button
                  onClick={handleClearBadImages}
                  className="bg-gradient-to-r from-red-600 to-orange-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2 border-2 border-red-400"
                >
                  <LucideIcons.Trash2 size={20} />
                  Clear localStorage (Fix 403 Errors)
                </button>

                {/* Generate with Pollinations (Fast & Free) */}
                <button
                  onClick={handleGenerateAIImages}
                  disabled={generating}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {generating ? (
                    <>
                      <LucideIcons.Loader2 size={20} className="animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <LucideIcons.Sparkles size={20} />
                      Generate (Pollinations)
                    </>
                  )}
                </button>

                {/* Upload Button */}
                <label className="cursor-pointer bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all flex items-center gap-2">
                  <LucideIcons.Upload size={20} />
                  Upload Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>

                {/* Sync to Hero Section Button */}
                {divisionImages.length > 0 && (
                  <button
                    onClick={() => {
                      const urls = divisionImages.map(img => img.url);
                      
                      // FORCE CLEAR old images first
                      console.log('🔄 Force clearing old images from localStorage...');
                      localStorage.removeItem(`division-images-${selectedDivision.id}`);
                      
                      // Save new images
                      console.log('💾 Syncing', urls.length, 'images to localStorage...');
                      saveLocalDivisionImages(selectedDivision.id, urls);
                      
                      // Verify
                      const verifyImages = JSON.parse(localStorage.getItem(`division-images-${selectedDivision.id}`) || '[]');
                      console.log('✅ Verified sync:', verifyImages.length, 'images');
                      console.log('📸 Image URLs:', urls);
                      
                      setMessage({ 
                        type: 'success', 
                        text: `✅ Synced ${urls.length} images! Clear browser cache and refresh the division page to see them.` 
                      });
                    }}
                    className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all flex items-center gap-2"
                  >
                    <LucideIcons.RefreshCw size={20} />
                    Sync to Hero ({divisionImages.length})
                  </button>
                )}

                {/* Download All Images Button */}
                {divisionImages.length > 0 && (
                  <button
                    onClick={handleDownloadAllImages}
                    disabled={downloading}
                    className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    {downloading ? (
                      <>
                        <LucideIcons.Loader2 size={20} className="animate-spin" />
                        Downloading...
                      </>
                    ) : (
                      <>
                        <LucideIcons.Download size={20} />
                        Download All ({divisionImages.length})
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Custom Prompts Toggle */}
            <div className="mb-6 flex items-center justify-between p-4 bg-cyan-900/30 rounded-xl border border-cyan-500/30">
              <div className="flex items-center gap-3">
                <LucideIcons.Wand2 size={24} className="text-cyan-400" />
                <div>
                  <h3 className="font-bold text-cyan-300">Custom Prompts Mode</h3>
                  <p className="text-sm text-cyan-200">Write your own prompts or use pre-configured ones</p>
                </div>
              </div>
              <button
                onClick={() => setUseCustomPrompts(!useCustomPrompts)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  useCustomPrompts
                    ? 'bg-cyan-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {useCustomPrompts ? '✓ Custom Mode' : 'Use Custom Prompts'}
              </button>
            </div>

            {/* Custom Prompts Input */}
            {useCustomPrompts ? (
              <div className="mb-6 p-6 bg-slate-700/50 rounded-xl border border-slate-600">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                  <LucideIcons.Edit3 size={20} className="text-cyan-400" />
                  Enter Your Custom Prompts (4 images)
                </h3>
                <div className="space-y-4">
                  {[0, 1, 2, 3].map((idx) => (
                    <div key={idx}>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Image {idx + 1} Prompt:
                      </label>
                      <textarea
                        value={customPrompts[idx]}
                        onChange={(e) => {
                          const newPrompts = [...customPrompts];
                          newPrompts[idx] = e.target.value;
                          setCustomPrompts(newPrompts);
                        }}
                        placeholder={`Enter detailed description for image ${idx + 1}...`}
                        rows={3}
                        className="w-full px-4 py-3 bg-slate-800 text-white border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent placeholder-slate-500"
                      />
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-cyan-900/20 rounded-lg border border-cyan-500/30">
                  <p className="text-sm text-cyan-200 flex items-start gap-2">
                    <LucideIcons.Info size={16} className="mt-0.5 flex-shrink-0" />
                    <span>Be specific! Mention equipment, activities, locations, and technical details for best results.</span>
                  </p>
                </div>
              </div>
            ) : (
              // Default AI Prompts Info
              <div className="mb-6 p-4 bg-purple-900/30 rounded-xl border border-purple-500/30">
                <h3 className="font-bold text-purple-300 mb-2 flex items-center gap-2">
                  <LucideIcons.Lightbulb size={20} />
                  Pre-Configured AI Prompts ({DIVISION_IMAGE_PROMPTS[selectedDivision.id]?.length || 0})
                </h3>
                <div className="space-y-2">
                  {DIVISION_IMAGE_PROMPTS[selectedDivision.id]?.map((prompt, idx) => (
                    <div key={idx} className="text-sm text-purple-200 flex items-start gap-2">
                      <span className="font-bold text-purple-400">{idx + 1}.</span>
                      <span>{prompt}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Images Grid */}
            {loading ? (
              <div className="text-center py-12">
                <LucideIcons.Loader2 size={48} className="animate-spin mx-auto text-cyan-400" />
                <p className="mt-4 text-blue-200">Loading images...</p>
              </div>
            ) : divisionImages.length === 0 ? (
              <div className="text-center py-12 bg-slate-700/50 rounded-xl border border-slate-600">
                <LucideIcons.ImageOff size={64} className="mx-auto text-slate-400 mb-4" />
                <p className="text-slate-300 font-semibold">No images uploaded yet</p>
                <p className="text-sm text-slate-400 mt-2">Upload or generate AI images to get started</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {divisionImages.map((image, imageIndex) => (
                  <motion.div
                    key={image.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative group"
                  >
                    <div className="aspect-video rounded-xl overflow-hidden bg-gray-100">
                      <img
                        src={image.url}
                        alt="Division"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Image Badges */}
                    <div className="absolute top-2 left-2 flex gap-2">
                      {image.isPrimary && (
                        <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                          <LucideIcons.Star size={12} />
                          Primary
                        </span>
                      )}
                      {image.aiGenerated && (
                        <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                          <LucideIcons.Sparkles size={12} />
                          AI
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-3">
                      {!image.isPrimary && (
                        <button
                          onClick={() => handleSetPrimary(image.id)}
                          className="bg-green-600 text-white p-3 rounded-xl hover:bg-green-700 transition-all"
                          title="Set as primary"
                        >
                          <LucideIcons.Star size={20} />
                        </button>
                      )}
                      <a
                        href={image.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition-all"
                        title="View full size"
                      >
                        <LucideIcons.Eye size={20} />
                      </a>
                      <button
                        onClick={() => handleDelete(image.id, imageIndex)}
                        className="bg-red-600 text-white p-3 rounded-xl hover:bg-red-700 transition-all"
                        title="Delete"
                      >
                        <LucideIcons.Trash2 size={20} />
                      </button>
                    </div>

                    {/* Image Info */}
                    <div className="mt-2 text-sm">
                      <p className="truncate text-slate-200 font-medium">{image.filename || 'AI Generated'}</p>
                      <p className="text-xs text-slate-400">
                        {new Date(image.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DivisionImagesAdmin;


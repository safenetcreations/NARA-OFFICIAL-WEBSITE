import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { catalogueService, circulationService, searchService } from '../../services/libraryService';
import { useFirebaseAuth } from '../../contexts/FirebaseAuthContext';
import DownloadManager from '../../components/library/DownloadManager';
import { useLibraryUser } from '../../contexts/LibraryUserContext';
import LanguageSelector from '../../components/library/LanguageSelector';
import MultiLanguagePreview from '../../components/library/MultiLanguagePreview';
import PhysicalReservationButton from '../../components/library/PhysicalReservationButton';

const ItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useFirebaseAuth();
  
  const [item, setItem] = useState(null);
  const [relatedItems, setRelatedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [placingHold, setPlacingHold] = useState(false);
  const [showPdfViewer, setShowPdfViewer] = useState(true); // Show PDF preview by default
  const [currentPdfUrl, setCurrentPdfUrl] = useState('');
  const [currentLanguage, setCurrentLanguage] = useState('english');

  useEffect(() => {
    loadItem();
  }, [id]);

  useEffect(() => {
    if (item && item.url) {
      setCurrentPdfUrl(item.url);
    }
  }, [item]);

  const loadItem = async () => {
    try {
      setLoading(true);
      const response = await catalogueService.getItemById(id);

      if (response.success) {
        let bookData = response.data;

        // If this is a translation ID (e.g., "6-sinhala"), fetch original and merge translations
        if (typeof id === 'string' && (id.includes('-sinhala') || id.includes('-tamil'))) {
          const originalId = bookData.original_id;

          if (originalId) {
            // Fetch the original book to get English PDF
            const originalResponse = await catalogueService.getItemById(originalId);

            if (originalResponse.success) {
              const originalBook = originalResponse.data;

              // Fetch all translations for this book
              const sinhalaResponse = await catalogueService.getItemById(`${originalId}-sinhala`);
              const tamilResponse = await catalogueService.getItemById(`${originalId}-tamil`);

              // Merge data: use original book data but add all translation URLs
              console.log('=== TRANSLATION MERGE DEBUG ===');
              console.log('Original book:', originalBook);
              console.log('Sinhala response:', sinhalaResponse);
              console.log('Tamil response:', tamilResponse);

              bookData = {
                ...originalBook,
                translations: {
                  sinhala: sinhalaResponse.success ? {
                    url: sinhalaResponse.data.url,
                    translated_at: sinhalaResponse.data.translations?.sinhala?.translated_at
                  } : null,
                  tamil: tamilResponse.success ? {
                    url: tamilResponse.data.url,
                    translated_at: tamilResponse.data.translations?.tamil?.translated_at
                  } : null
                },
                translations_available: [
                  sinhalaResponse.success ? 'sinhala' : null,
                  tamilResponse.success ? 'tamil' : null
                ].filter(Boolean)
              };

              console.log('✅ Merged book data with translations:', bookData);
              console.log('=== END TRANSLATION MERGE DEBUG ===');
            }
          }
        }

        setItem(bookData);
        loadRelatedItems(id);
      }
    } catch (err) {
      setError('Failed to load item details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadRelatedItems = async (itemId) => {
    try {
      const response = await searchService.getRelatedItems(itemId, 4);
      if (response.success) {
        setRelatedItems(response.data);
      }
    } catch (err) {
      console.error('Failed to load related items:', err);
    }
  };

  const handlePlaceHold = async () => {
    if (!user) {
      navigate('/lda-login', { state: { returnTo: `/library/item/${id}` } });
      return;
    }

    setPlacingHold(true);
    try {
      // Get patron ID from user
      const response = await circulationService.placeHold(user.uid, id);
      if (response.success) {
        alert('Hold placed successfully! You will be notified when the item is available.');
        loadItem();
      }
    } catch (err) {
      alert('Failed to place hold. Please try again or contact library staff.');
      console.error(err);
    } finally {
      setPlacingHold(false);
    }
  };

  const handleLanguageChange = (url, langCode, langName) => {
    setCurrentPdfUrl(url);
    setCurrentLanguage(langCode);
    console.log(`Switched to ${langName} (${langCode})`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Icons.Loader2 className="w-8 h-8 animate-spin text-cyan-600" />
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Icons.AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">{error || 'Item not found'}</p>
          <button
            onClick={() => navigate('/library')}
            className="mt-4 px-6 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700"
          >
            Back to Catalogue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-sm text-gray-600">
          <button onClick={() => navigate('/library')} className="hover:text-cyan-600">
            Library
          </button>
          <Icons.ChevronRight className="w-4 h-4" />
          <span className="text-gray-900">{item.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Cover Image */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
              <div className="aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-6 flex items-center justify-center overflow-hidden">
                {item.cover_image_url ? (
                  <img src={item.cover_image_url} alt={item.title} className="w-full h-full object-cover" />
                ) : (
                  <Icons.BookOpen className="w-24 h-24 text-gray-400" />
                )}
              </div>

              {/* Availability Status */}
              <div className="mb-6">
                {item.available_copies > 0 ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-green-800 font-semibold mb-2">
                      <Icons.CheckCircle className="w-5 h-5" />
                      Available
                    </div>
                    <p className="text-sm text-green-700">
                      {item.available_copies} of {item.total_copies} copies available
                    </p>
                  </div>
                ) : (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-red-800 font-semibold mb-2">
                      <Icons.XCircle className="w-5 h-5" />
                      Checked Out
                    </div>
                    <p className="text-sm text-red-700 mb-3">
                      All copies are currently checked out
                    </p>
                    <button
                      onClick={handlePlaceHold}
                      disabled={placingHold}
                      className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {placingHold ? (
                        <>
                          <Icons.Loader2 className="w-4 h-4 animate-spin" />
                          Placing Hold...
                        </>
                      ) : (
                        <>
                          <Icons.Bookmark className="w-4 h-4" />
                          Place Hold
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* Call Number */}
              {item.call_number && (
                <div className="mb-4">
                  <label className="text-sm font-medium text-gray-700">Call Number</label>
                  <p className="text-lg font-mono text-gray-900 mt-1">{item.call_number}</p>
                </div>
              )}

              {/* Location */}
              <div className="mb-4">
                <label className="text-sm font-medium text-gray-700">Location</label>
                <p className="text-gray-900 mt-1">{item.location}</p>
                {item.shelf_location && (
                  <p className="text-sm text-gray-600">Shelf: {item.shelf_location}</p>
                )}
              </div>

              {/* Actions */}
              <div className="mt-6 space-y-3">
                {/* External Source Link (if available) */}
                {item.source_url ? (
                  <a
                    href={item.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition flex items-center justify-center gap-2 font-semibold"
                  >
                    <Icons.ExternalLink className="w-5 h-5" />
                    View on {item.download_source || 'External Source'}
                  </a>
                ) : item.url ? (
                  <>
                    {/* Firebase PDF Available */}
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-3 mb-3">
                      <div className="flex items-center gap-2 text-green-800 mb-2">
                        <Icons.CheckCircle className="w-5 h-5" />
                        <span className="font-semibold">Free PDF Available!</span>
                      </div>
                      <p className="text-sm text-green-700">Read online for free or download the full PDF</p>
                    </div>
                    <button
                      onClick={() => setShowPdfViewer(!showPdfViewer)}
                      className="w-full px-4 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:from-cyan-700 hover:to-blue-700 transition flex items-center justify-center gap-2 font-semibold shadow-lg"
                    >
                      <Icons.Eye className="w-5 h-5" />
                      {showPdfViewer ? 'Hide Preview' : 'Show Preview'}
                    </button>
                    <DownloadManager book={item} pdfUrl={currentPdfUrl} language={currentLanguage} />
                  </>
                ) : (
                  /* PDF Coming Soon or Physical Book Only */
                  <>
                    <div className="w-full px-4 py-3 bg-gradient-to-r from-gray-400 to-gray-500 text-white rounded-lg flex items-center justify-center gap-2 font-semibold opacity-75">
                      <Icons.Clock className="w-5 h-5" />
                      PDF Coming Soon
                    </div>
                    {/* Physical Book Reservation System */}
                    <PhysicalReservationButton book={item} />
                  </>
                )}

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Link copied to clipboard!');
                  }}
                  className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center justify-center gap-2 font-medium"
                >
                  <Icons.Share2 className="w-4 h-4" />
                  Share This Item
                </button>

                <button
                  onClick={() => window.print()}
                  className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center justify-center gap-2 font-medium"
                >
                  <Icons.Printer className="w-4 h-4" />
                  Print Details
                </button>
              </div>

              {/* Barcode */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Barcode: {item.barcode}</span>
                  <span>ID: {item.id}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{item.title}</h1>
              {item.subtitle && (
                <p className="text-xl text-gray-600 mb-4">{item.subtitle}</p>
              )}

              <div className="flex flex-wrap gap-2 mb-6">
                <span className="px-3 py-1 bg-cyan-100 text-cyan-800 rounded-full text-sm font-medium">
                  {item.material_type_name}
                </span>
                {item.language && (
                  <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                    {item.language}
                  </span>
                )}
              </div>

              {/* Bibliographic Details */}
              <div className="bg-gray-50 rounded-lg p-6 mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Icons.Info className="w-5 h-5 text-cyan-600" />
                  Bibliographic Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {item.author && (
                    <div className="flex items-start gap-3">
                      <Icons.User className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <label className="text-sm font-medium text-gray-700">Author</label>
                        <p className="text-gray-900 mt-1">{item.author}</p>
                      </div>
                    </div>
                  )}

                  {item.publisher && (
                    <div className="flex items-start gap-3">
                      <Icons.Building className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <label className="text-sm font-medium text-gray-700">Publisher</label>
                        <p className="text-gray-900 mt-1">{item.publisher}</p>
                      </div>
                    </div>
                  )}

                  {item.publication_year && (
                    <div className="flex items-start gap-3">
                      <Icons.Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <label className="text-sm font-medium text-gray-700">Publication Year</label>
                        <p className="text-gray-900 mt-1">{item.publication_year}</p>
                      </div>
                    </div>
                  )}

                  {item.edition && (
                    <div className="flex items-start gap-3">
                      <Icons.BookCopy className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <label className="text-sm font-medium text-gray-700">Edition</label>
                        <p className="text-gray-900 mt-1">{item.edition}</p>
                      </div>
                    </div>
                  )}

                  {item.isbn && (
                    <div className="flex items-start gap-3">
                      <Icons.Hash className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <label className="text-sm font-medium text-gray-700">ISBN</label>
                        <p className="text-gray-900 mt-1 font-mono">{item.isbn}</p>
                      </div>
                    </div>
                  )}

                  {item.issn && (
                    <div className="flex items-start gap-3">
                      <Icons.Hash className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <label className="text-sm font-medium text-gray-700">ISSN</label>
                        <p className="text-gray-900 mt-1 font-mono">{item.issn}</p>
                      </div>
                    </div>
                  )}

                  {item.pages && (
                    <div className="flex items-start gap-3">
                      <Icons.FileText className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <label className="text-sm font-medium text-gray-700">Pages</label>
                        <p className="text-gray-900 mt-1">{item.pages}</p>
                      </div>
                    </div>
                  )}

                  {item.series && (
                    <div className="flex items-start gap-3">
                      <Icons.Layers className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <label className="text-sm font-medium text-gray-700">Series</label>
                        <p className="text-gray-900 mt-1">{item.series}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Abstract/Description */}
              {item.abstract && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">Abstract</h2>
                  <p className="text-gray-700 leading-relaxed">{item.abstract}</p>
                </div>
              )}

              {/* Subject Headings */}
              {item.subject_headings && item.subject_headings.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">Subjects</h2>
                  <div className="flex flex-wrap gap-2">
                    {item.subject_headings.map((subject, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm">
                        {subject}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Keywords */}
              {item.keywords && item.keywords.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">Keywords</h2>
                  <div className="flex flex-wrap gap-2">
                    {item.keywords.map((keyword, index) => (
                      <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Authors */}
              {item.additional_authors && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">Additional Authors</h2>
                  <p className="text-gray-700">{item.additional_authors}</p>
                </div>
              )}

              {/* Notes */}
              {item.notes && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">Notes</h2>
                  <p className="text-gray-700">{item.notes}</p>
                </div>
              )}

              {/* Multi-Language Preview - Shows all 3 languages in tabs */}
              {item.url && (
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                      <Icons.FileText className="w-5 h-5 text-cyan-600" />
                      Read Online - All Languages
                    </h2>
                    <button
                      onClick={() => setShowPdfViewer(!showPdfViewer)}
                      className="px-4 py-2 bg-cyan-100 text-cyan-700 rounded-lg hover:bg-cyan-200 transition flex items-center gap-2"
                    >
                      {showPdfViewer ? (
                        <>
                          <Icons.ChevronUp className="w-4 h-4" />
                          Hide Preview
                        </>
                      ) : (
                        <>
                          <Icons.ChevronDown className="w-4 h-4" />
                          Show Preview
                        </>
                      )}
                    </button>
                  </div>

                  {showPdfViewer && (
                    <MultiLanguagePreview book={item} />
                  )}
                </div>
              )}
            </div>

            {/* Related Items */}
            {relatedItems.length > 0 && (
              <div className="mt-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Items</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {relatedItems.map((relatedItem) => (
                    <div
                      key={relatedItem.id}
                      onClick={() => navigate(`/library/item/${relatedItem.id}`)}
                      className="bg-white rounded-lg shadow-md hover:shadow-xl transition cursor-pointer p-4 flex gap-4"
                    >
                      <div className="w-20 h-28 bg-gradient-to-br from-gray-100 to-gray-200 rounded flex-shrink-0 flex items-center justify-center">
                        {relatedItem.cover_image_url ? (
                          <img src={relatedItem.cover_image_url} alt={relatedItem.title} className="w-full h-full object-cover rounded" />
                        ) : (
                          <Icons.BookOpen className="w-8 h-8 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{relatedItem.title}</h3>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-1">{relatedItem.author}</p>
                        <span className="text-xs text-gray-500">{relatedItem.material_type_name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;


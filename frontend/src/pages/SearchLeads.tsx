import { useState, useEffect } from 'react';
import { Search, Loader2, Download, Map as MapIcon, List, AlertCircle, SlidersHorizontal, MapPin } from 'lucide-react';
import { searchLeads, exportLeadsCsv } from '../lib/api';
import LeadCard from '../components/LeadCard';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { cn } from '../components/Layout';

const mapContainerStyle = { width: '100%', height: '100%', borderRadius: '0.75rem' };

const SESSION_KEY = 'leadHunter_searchState';

export default function SearchLeads() {
  const getInitialState = () => {
    try {
      const saved = sessionStorage.getItem(SESSION_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  };
  const initialState = getInitialState();

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>(initialState?.results || []);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'SPLIT'|'LIST'|'MAP'>(initialState?.view || 'SPLIT');
  const [showAdvanced, setShowAdvanced] = useState(initialState?.showAdvanced || false);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  
  const [location, setLocation] = useState(initialState?.location || 'Kolkata');
  const [category, setCategory] = useState(initialState?.category || 'Restaurants');
  const [minRating, setMinRating] = useState(initialState?.minRating ?? 4.3);
  const [minReviews, setMinReviews] = useState(initialState?.minReviews ?? 100);
  const [maxResults, setMaxResults] = useState(initialState?.maxResults ?? 25);
  const [websiteFilter, setWebsiteFilter] = useState(initialState?.websiteFilter || 'NO_WEBSITE_DETECTED');

  useEffect(() => {
    const stateToSave = {
      results,
      view,
      showAdvanced,
      location,
      category,
      minRating,
      minReviews,
      maxResults,
      websiteFilter
    };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(stateToSave));
  }, [results, view, showAdvanced, location, category, minRating, minReviews, maxResults, websiteFilter]);

  const { isLoaded: isMapLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''
  });

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSelectedLeadId(null);
    try {
      const data = await searchLeads({ location, category, minRating, minReviews, maxResults, websiteFilter });
      setResults(data.results || []);
      if(data.results?.length === 0) {
        setError('No qualified leads found. Try adjusting your filters (e.g., lower min rating/reviews, broader category).');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.details || 'Failed to search places. Ensure API keys are correctly configured.');
    } finally {
      setLoading(false);
    }
  };

  const mapCenter = results.length > 0 && results[0].location 
    ? { lat: results[0].location.latitude, lng: results[0].location.longitude } 
    : { lat: 22.5726, lng: 88.3639 }; // Default Kolkata

  return (
    <div className="space-y-6 animate-in fade-in duration-500 flex flex-col h-[calc(100vh-2rem)] md:h-[calc(100vh-4rem)]">
      
      {/* Header & Search */}
      <div className="shrink-0 space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-text-primary">Discover Leads</h1>
          <p className="text-text-secondary mt-1">Find local businesses with strong demand and opportunities to improve their online presence.</p>
        </div>

        <form onSubmit={handleSearch} className="bg-surface p-5 rounded-xl border border-border shadow-sm flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-4">
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-tertiary" />
                <input type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. Salt Lake, Kolkata" className="w-full bg-elevated border-border text-text-primary rounded-lg border pl-9 p-2.5 text-sm focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none" required />
              </div>
            </div>
            <div className="md:col-span-5">
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">Category</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-tertiary" />
                <input type="text" value={category} onChange={e => setCategory(e.target.value)} placeholder="e.g. Restaurants, Dentists" className="w-full bg-elevated border-border text-text-primary rounded-lg border pl-9 p-2.5 text-sm focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none" required />
              </div>
            </div>
            <div className="md:col-span-3 flex items-end">
              <button type="submit" disabled={loading} className="w-full h-[42px] bg-primary text-white rounded-lg font-medium hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_0_10px_rgba(79,70,229,0.2)]">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                {loading ? 'Searching...' : 'Find Leads'}
              </button>
            </div>
          </div>

          <div className="border-t border-border pt-3 mt-1">
            <button 
              type="button" 
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
            >
              <SlidersHorizontal className="h-4 w-4" />
              {showAdvanced ? 'Hide advanced filters' : 'Show advanced filters'}
            </button>
            
            {showAdvanced && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 animate-in slide-in-from-top-2 duration-200">
                <div>
                  <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">Min Rating</label>
                  <select value={minRating} onChange={e => setMinRating(Number(e.target.value))} className="w-full bg-elevated border-border text-text-primary rounded-lg border p-2.5 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none">
                    {[3.5, 4.0, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8].map(r => <option key={r} value={r}>{r}+</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">Min Reviews</label>
                  <select value={minReviews} onChange={e => setMinReviews(Number(e.target.value))} className="w-full bg-elevated border-border text-text-primary rounded-lg border p-2.5 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none">
                    {[50, 100, 250, 500, 1000].map(r => <option key={r} value={r}>{r}+</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">Max Results</label>
                  <select value={maxResults} onChange={e => setMaxResults(Number(e.target.value))} className="w-full bg-elevated border-border text-text-primary rounded-lg border p-2.5 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none">
                    {[10, 25, 50, 100].map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">Website Status</label>
                  <select value={websiteFilter} onChange={e => setWebsiteFilter(e.target.value)} className="w-full bg-elevated border-border text-text-primary rounded-lg border p-2.5 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none">
                    <option value="NO_WEBSITE_DETECTED">No Website Detected (Rec.)</option>
                    <option value="UNCERTAIN">Uncertain</option>
                    <option value="WEBSITE_FOUND">Website Found</option>
                    <option value="ALL">Any Status</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </form>

        {error && (
          <div className="bg-danger/10 border border-danger/20 p-4 flex gap-3 rounded-lg">
            <AlertCircle className="h-5 w-5 text-danger flex-shrink-0" />
            <p className="text-sm text-danger font-medium">{error}</p>
          </div>
        )}
      </div>

      {/* Results Area */}
      {results.length > 0 && (
        <div className="flex-1 min-h-0 flex flex-col gap-4">
          
          <div className="shrink-0 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
             <div>
                <h2 className="text-xl font-bold text-text-primary">{results.length} Qualified Leads</h2>
                <p className="text-xs text-text-secondary mt-1">{location} • {category} • {minRating}+ rating • {minReviews}+ reviews</p>
             </div>
             <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="bg-surface border border-border p-1 rounded-lg flex">
                  <button onClick={() => setView('LIST')} className={cn("px-3 py-1.5 text-sm font-medium rounded-md transition-colors flex items-center gap-1.5", view === 'LIST' ? 'bg-elevated text-text-primary shadow-sm' : 'text-text-secondary hover:text-text-primary')}>
                    <List className="h-4 w-4" /> <span className="hidden md:inline">List</span>
                  </button>
                  <button onClick={() => setView('SPLIT')} className={cn("hidden md:flex px-3 py-1.5 text-sm font-medium rounded-md transition-colors items-center gap-1.5", view === 'SPLIT' ? 'bg-elevated text-text-primary shadow-sm' : 'text-text-secondary hover:text-text-primary')}>
                    <SlidersHorizontal className="h-4 w-4" /> Split
                  </button>
                  <button onClick={() => setView('MAP')} className={cn("px-3 py-1.5 text-sm font-medium rounded-md transition-colors flex items-center gap-1.5", view === 'MAP' ? 'bg-elevated text-text-primary shadow-sm' : 'text-text-secondary hover:text-text-primary')}>
                    <MapIcon className="h-4 w-4" /> <span className="hidden md:inline">Map</span>
                  </button>
                </div>
                <button onClick={() => exportLeadsCsv(results)} className="flex items-center gap-2 px-3 py-2 bg-surface border border-border text-text-primary rounded-lg text-sm font-medium hover:bg-elevated transition-colors">
                  <Download className="h-4 w-4" /> <span className="hidden sm:inline">Export</span>
                </button>
             </div>
          </div>
          
          <div className={cn(
            "flex-1 min-h-0 gap-6",
            view === 'SPLIT' ? "hidden md:grid md:grid-cols-2" : "flex flex-col"
          )}>
            
            {/* List View */}
            {(view === 'LIST' || view === 'SPLIT') && (
              <div className={cn(
                "overflow-y-auto pr-2 custom-scrollbar",
                view === 'SPLIT' ? "h-full" : "h-full"
              )}>
                <div className="flex flex-col gap-4 pb-10">
                  {results.map((lead: any, i: number) => (
                    <div 
                      key={lead.id || i}
                      onMouseEnter={() => setSelectedLeadId(lead.id || lead.place_id)}
                      onMouseLeave={() => setSelectedLeadId(null)}
                      className={cn(
                        "transition-all duration-200 rounded-xl",
                        selectedLeadId === (lead.id || lead.place_id) ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : ""
                      )}
                    >
                      <LeadCard lead={lead} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Map View */}
            {(view === 'MAP' || view === 'SPLIT') && (
              <div className={cn(
                "bg-surface rounded-xl shadow-sm border border-border overflow-hidden relative",
                view === 'MAP' ? "h-[600px] md:h-full flex-1" : "h-full"
              )}>
                 {isMapLoaded ? (
                   <GoogleMap
                     mapContainerStyle={mapContainerStyle}
                     center={mapCenter}
                     zoom={13}
                     options={{
                       styles: [
                         { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
                         { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
                         { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
                         { featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{ color: '#d59563' }] },
                         { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#d59563' }] },
                         { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#263c3f' }] },
                         { featureType: 'poi.park', elementType: 'labels.text.fill', stylers: [{ color: '#6b9a76' }] },
                         { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#38414e' }] },
                         { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#212a37' }] },
                         { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#9ca5b3' }] },
                         { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#746855' }] },
                         { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#1f2835' }] },
                         { featureType: 'road.highway', elementType: 'labels.text.fill', stylers: [{ color: '#f3d19c' }] },
                         { featureType: 'transit', elementType: 'geometry', stylers: [{ color: '#2f3948' }] },
                         { featureType: 'transit.station', elementType: 'labels.text.fill', stylers: [{ color: '#d59563' }] },
                         { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#17263c' }] },
                         { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#515c6d' }] },
                         { featureType: 'water', elementType: 'labels.text.stroke', stylers: [{ color: '#17263c' }] },
                       ],
                       disableDefaultUI: true,
                       zoomControl: true,
                     }}
                   >
                     {results.map((lead, i) => lead.location && (
                       <Marker 
                          key={lead.id || i}
                          position={{ lat: lead.location.latitude, lng: lead.location.longitude }}
                          title={lead.displayName?.text || 'Business'}
                          animation={selectedLeadId === (lead.id || lead.place_id) ? 1 : 0} // 1 is BOUNCE
                          icon={selectedLeadId === (lead.id || lead.place_id) ? {
                            url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                          } : undefined}
                       />
                     ))}
                   </GoogleMap>
                 ) : (
                   <div className="h-full flex items-center justify-center bg-elevated">
                      <Loader2 className="h-8 w-8 text-text-tertiary animate-spin mb-4" />
                   </div>
                 )}
              </div>
            )}
            
          </div>
        </div>
      )}
    </div>
  );
}

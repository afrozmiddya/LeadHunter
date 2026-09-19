import { useState } from 'react';
import { Search, Loader2, Download, Map as MapIcon, List, AlertCircle } from 'lucide-react';
import { searchLeads, exportLeadsCsv } from '../lib/api';
import LeadCard from '../components/LeadCard';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const mapContainerStyle = { width: '100%', height: '600px', borderRadius: '0.75rem' };

export default function SearchLeads() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'LIST'|'MAP'>('LIST');
  
  const [location, setLocation] = useState('Kolkata');
  const [category, setCategory] = useState('Restaurants');
  const [minRating, setMinRating] = useState(4.3);
  const [minReviews, setMinReviews] = useState(100);
  const [maxResults, setMaxResults] = useState(25);
  const [websiteFilter, setWebsiteFilter] = useState('NO_WEBSITE_DETECTED');

  const { isLoaded: isMapLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''
  });

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
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
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Find Local Business Leads</h1>
          <p className="mt-2 text-gray-600">Search for highly-rated businesses with limited web presence.</p>
        </div>
      </div>

      <form onSubmit={handleSearch} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm grid grid-cols-1 md:grid-cols-6 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <input type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. Salt Lake, Kolkata" className="w-full border-gray-300 rounded-md border p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500" required />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <input type="text" value={category} onChange={e => setCategory(e.target.value)} placeholder="e.g. Restaurants, Dentists" className="w-full border-gray-300 rounded-md border p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Min Rating</label>
          <select value={minRating} onChange={e => setMinRating(Number(e.target.value))} className="w-full border-gray-300 rounded-md border p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500">
            {[3.5, 4.0, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8].map(r => <option key={r} value={r}>{r}+</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Min Reviews</label>
          <select value={minReviews} onChange={e => setMinReviews(Number(e.target.value))} className="w-full border-gray-300 rounded-md border p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500">
            {[50, 100, 250, 500, 1000].map(r => <option key={r} value={r}>{r}+</option>)}
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Max Results</label>
          <select value={maxResults} onChange={e => setMaxResults(Number(e.target.value))} className="w-full border-gray-300 rounded-md border p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500">
            {[10, 25, 50, 100].map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div className="md:col-span-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">Website Status</label>
          <select value={websiteFilter} onChange={e => setWebsiteFilter(e.target.value)} className="w-full border-gray-300 rounded-md border p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500">
            <option value="NO_WEBSITE_DETECTED">No Website Detected (Recommended)</option>
            <option value="UNCERTAIN">Uncertain</option>
            <option value="WEBSITE_FOUND">Website Found</option>
            <option value="ALL">Any Status</option>
          </select>
        </div>
        <div className="flex items-end">
          <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white p-2 rounded-md font-medium hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            {loading ? 'Analyzing...' : 'Find Leads'}
          </button>
        </div>
      </form>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 flex gap-3 rounded-md">
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {results.length > 0 && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
             <div>
                <h2 className="text-xl font-bold text-gray-900">{results.length} Qualified Leads</h2>
                <p className="text-xs text-gray-500 mt-1">{location} • {category} • {minRating}+ rating • {minReviews}+ reviews</p>
             </div>
             <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="bg-gray-100 p-1 rounded-md flex">
                  <button onClick={() => setView('LIST')} className={`px-3 py-1.5 text-sm font-medium rounded ${view === 'LIST' ? 'bg-white shadow-sm text-indigo-700' : 'text-gray-600 hover:text-gray-900'}`}>
                    <List className="h-4 w-4 inline mr-1" /> List
                  </button>
                  <button onClick={() => setView('MAP')} className={`px-3 py-1.5 text-sm font-medium rounded ${view === 'MAP' ? 'bg-white shadow-sm text-indigo-700' : 'text-gray-600 hover:text-gray-900'}`}>
                    <MapIcon className="h-4 w-4 inline mr-1" /> Map
                  </button>
                </div>
                <button onClick={() => exportLeadsCsv(results)} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors">
                  <Download className="h-4 w-4" /> Export CSV
                </button>
             </div>
          </div>
          
          {view === 'LIST' ? (
            <div className="grid grid-cols-1 gap-4">
              {results.map((lead: any, i: number) => (
                <LeadCard key={lead.id || i} lead={lead} />
              ))}
            </div>
          ) : (
            <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-100">
               {isMapLoaded ? (
                 <GoogleMap
                   mapContainerStyle={mapContainerStyle}
                   center={mapCenter}
                   zoom={12}
                 >
                   {results.map((lead, i) => lead.location && (
                     <Marker 
                        key={lead.id || i}
                        position={{ lat: lead.location.latitude, lng: lead.location.longitude }}
                        title={lead.displayName?.text || 'Business'}
                     />
                   ))}
                 </GoogleMap>
               ) : (
                 <div className="h-[600px] flex items-center justify-center bg-gray-50 rounded-lg">
                    <p className="text-gray-500">Google Maps API key not configured or loading...</p>
                 </div>
               )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

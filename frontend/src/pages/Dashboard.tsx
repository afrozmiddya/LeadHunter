import { Link } from 'react-router-dom';
import { Search, Users, Globe, Star, ArrowRight } from 'lucide-react';

export default function Dashboard() {
  const stats = [
    { label: 'Businesses Found', value: '184', icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Qualified Leads', value: '47', icon: Star, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'No Website Detected', value: '32', icon: Globe, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { label: 'High Priority', value: '18', icon: ArrowRight, color: 'text-purple-600', bg: 'bg-purple-100' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Find businesses that need a website.</h1>
        <p className="mt-2 text-gray-600">Discover highly-rated local businesses with little or no web presence.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <div className={`w-12 h-12 rounded-lg ${s.bg} flex items-center justify-center mb-4`}>
              <s.icon className={`h-6 w-6 ${s.color}`} />
            </div>
            <p className="text-sm font-medium text-gray-500">{s.label}</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Ready to find new clients?</h2>
          <p className="text-gray-500 text-sm mt-1">Search Google Maps for high-quality leads.</p>
        </div>
        <Link to="/search" className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-indigo-700 flex items-center gap-2">
          <Search className="h-4 w-4" />
          Find New Leads
        </Link>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { useData } from '../contexts/DataContext';

export default function PhotoGallery() {
  const { families } = useData();
  const [filter, setFilter] = useState('all');

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }} className="px-6 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-playfair font-black text-4xl sm:text-5xl mb-2" style={{ color: 'var(--navy)' }}>
          Photo Gallery
        </h1>
        <p className="font-nunito text-lg" style={{ color: '#777' }}>
          Share and relive every magical moment together.
        </p>
      </div>

      {/* Filter by family */}
      <div className="flex flex-wrap gap-3 mb-8">
        <button
          onClick={() => setFilter('all')}
          className="px-4 py-1.5 rounded-full text-sm font-nunito font-semibold border transition-all"
          style={{
            background: filter === 'all' ? 'var(--navy)' : 'transparent',
            borderColor: filter === 'all' ? 'var(--navy)' : '#ddd',
            color: filter === 'all' ? 'white' : '#888',
          }}
        >
          All Photos
        </button>
        {families.map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className="px-4 py-1.5 rounded-full text-sm font-nunito font-semibold border transition-all"
            style={{
              background: filter === f.id ? f.light + '20' : 'transparent',
              borderColor: filter === f.id ? f.light : f.light + '40',
              color: filter === f.id ? f.light : '#aaa',
            }}
          >
            {f.name}
          </button>
        ))}
      </div>

      {/* Empty state */}
      <div className="rounded-2xl p-16 text-center"
           style={{ background: 'var(--cream)', border: '2px dashed #ddd' }}>
        <div className="text-6xl mb-4">📷</div>
        <h3 className="font-playfair font-bold text-2xl mb-3" style={{ color: 'var(--navy)' }}>
          No photos yet
        </h3>
        <p className="font-nunito text-sm max-w-md mx-auto mb-6" style={{ color: '#888' }}>
          Photos will appear here once your crew starts uploading! Anyone can contribute — no login required.
        </p>
        <button className="font-nunito font-bold px-6 py-3 rounded-xl text-lg transition-colors text-white"
                style={{ background: 'var(--navy)' }}>
          Upload a Photo
        </button>
        <p className="text-xs font-nunito mt-3" style={{ color: '#bbb' }}>
          Photo upload feature coming soon · All families welcome to contribute
        </p>
      </div>

      {/* Feature preview cards */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: '🏷️', title: 'Tag your family', desc: 'Label each photo with your family color' },
          { icon: '❤️', title: 'React & comment', desc: 'Like and comment on each other\'s photos' },
          { icon: '⬇️', title: 'Download all', desc: 'Get a full zip of every photo after the trip' },
        ].map(f => (
          <div key={f.title} className="bg-white rounded-2xl p-5 text-center"
               style={{ boxShadow: '0 2px 16px rgba(27,42,74,0.07)' }}>
            <div className="text-3xl mb-2">{f.icon}</div>
            <div className="font-nunito font-bold text-base" style={{ color: 'var(--navy)' }}>{f.title}</div>
            <div className="text-sm font-nunito mt-1" style={{ color: '#888' }}>{f.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

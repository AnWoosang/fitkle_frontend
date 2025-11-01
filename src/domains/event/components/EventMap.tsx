import { MapPin, ExternalLink } from 'lucide-react';

interface EventMapProps {
  location: string;
}

// Location coordinates mapping for Seoul areas
const locationCoordinates: { [key: string]: { lat: number; lng: number; displayName: string } } = {
  '강남구': { lat: 37.4979, lng: 127.0276, displayName: '서울 강남구' },
  '서초구': { lat: 37.4837, lng: 127.0324, displayName: '서울 서초구' },
  '마포구': { lat: 37.5663, lng: 126.9019, displayName: '서울 마포구' },
  '홍대': { lat: 37.5563, lng: 126.9236, displayName: '서울 홍대' },
  '이태원': { lat: 37.5342, lng: 126.9947, displayName: '서울 이태원' },
  '여의도 한강공원': { lat: 37.5290, lng: 126.9321, displayName: '서울 여의도 한강공원' },
  '관악구': { lat: 37.4783, lng: 126.9516, displayName: '서울 관악구' },
  '종로구': { lat: 37.5735, lng: 126.9792, displayName: '서울 종로구' },
  '용산구': { lat: 37.5326, lng: 126.9905, displayName: '서울 용산구' },
  '은평구': { lat: 37.6176, lng: 126.9227, displayName: '서울 은평구' },
  '성수동': { lat: 37.5447, lng: 127.0557, displayName: '서울 성수동' },
  '성동구': { lat: 37.5506, lng: 127.0409, displayName: '서울 성동구' },
  '양평': { lat: 37.4912, lng: 127.4874, displayName: '경기도 양평' },
  '경복궁 일대': { lat: 37.5796, lng: 126.9770, displayName: '서울 경복궁' },
};

export function EventMap({ location }: EventMapProps) {
  // Check if location is online
  if (location.includes('온라인') || location.includes('Zoom') || location.toLowerCase().includes('online')) {
    return (
      <div className="w-full h-48 bg-muted/30 rounded-lg border border-border flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
            <span className="text-3xl">💻</span>
          </div>
          <p className="text-sm font-semibold">온라인 이벤트</p>
          <p className="text-xs text-muted-foreground mt-1">{location}</p>
        </div>
      </div>
    );
  }

  // Get coordinates for the location
  const coords = locationCoordinates[location];
  
  if (!coords) {
    // Default fallback if location not found
    return (
      <div className="w-full h-48 bg-muted rounded-lg border border-border flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <MapPin className="w-8 h-8 mx-auto mb-2" />
          <p className="text-sm">{location}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="relative w-full h-48 rounded-lg overflow-hidden border border-border shadow-sm bg-gradient-to-br from-accent-sage/20 to-primary/10">
        {/* Decorative background pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Location marker */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            {/* Pulsing circle */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 bg-primary/20 rounded-full animate-ping"></div>
            </div>
            {/* Main pin */}
            <div className="relative w-16 h-16 bg-primary rounded-full shadow-lg flex items-center justify-center border-4 border-white z-10">
              <MapPin className="w-8 h-8 text-white fill-white" />
            </div>
          </div>
        </div>
        
        {/* Location info overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent p-4">
          <div className="flex items-center gap-2 text-white">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-semibold">{coords.displayName}</p>
              <p className="text-xs opacity-80">{coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}</p>
            </div>
            <ExternalLink className="w-4 h-4 flex-shrink-0 opacity-60" />
          </div>
        </div>
      </div>
      
      {/* View in maps link */}
      <a
        href={`https://www.google.com/maps/search/?api=1&query=${coords.lat},${coords.lng}`}
        target="_blank"
        rel="noopener noreferrer"
        className="block mt-3 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg text-sm text-center transition-colors border border-primary/20"
      >
        Google 지도에서 열기 →
      </a>
    </div>
  );
}

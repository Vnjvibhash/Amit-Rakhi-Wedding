import React from 'react';
import {
  BedDouble,
  Bus,
  Car,
  Compass,
  Info,
  MapPin,
  Navigation
} from 'lucide-react';
import { useWedding } from '../context/WeddingContext';
import { PageHeader } from '../components/common/PageHeader';
import { FloralDivider } from '../components/common/MandalaArtwork';

export const VenuePage: React.FC = () => {
  const { settings } = useWedding();
  const { venueDetails } = settings;

  return (
    <div>
      <PageHeader
        eyebrow="Destination & Hospitality"
        title="Venue & Travel Guide"
        subtitle={`Everything you need for a seamless journey to ${settings.primaryVenueName}, ${settings.primaryVenueCity}.`}
      />

      <section className="section-padding bg-ivory bg-mandala-pattern">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Primary Venue & Embedded Google Map */}
          <div className="royal-card overflow-hidden grid lg:grid-cols-12">
            <div className="lg:col-span-5 p-7 sm:p-9 flex flex-col justify-between">
              <div>
                <img
                  src="/images/venue/palace-venue.jpg"
                  alt={settings.primaryVenueName}
                  className="w-full h-52 object-cover rounded-2xl border border-gold-400/50 mb-6"
                />
                <span className="text-xs uppercase tracking-[0.25em] text-gold-700 font-semibold">
                  Wedding Route &amp; Travel Corridor
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-maroon-900 mt-1">
                  {settings.primaryVenueName}
                </h2>
                <p className="text-sm text-maroon-900/80 flex items-start gap-2 mt-3">
                  <MapPin className="w-4 h-4 text-gold-700 shrink-0 mt-0.5" />
                  <span>{settings.primaryVenueAddress}</span>
                </p>
              </div>
              <div className="mt-6">
                <a
                  href={settings.googleMapsDirectionsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-royal w-full"
                >
                  <Navigation className="w-4 h-4" /> Open Region Map on Google Maps
                </a>
              </div>
            </div>

            <div className="lg:col-span-7 min-h-[380px] bg-beige-soft">
              <iframe
                title="Phulparas &amp; Babubarhi Region Map"
                src={settings.googleMapsEmbedUrl}
                className="w-full h-full min-h-[380px] border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Nearby Accommodation */}
          <div>
            <div className="text-center mb-8">
              <p className="font-display text-xs uppercase tracking-[0.28em] text-maroon-700">
                Where to Stay
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-maroon-900 mt-1">
                Nearby Accommodations
              </h2>
              <FloralDivider />
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {venueDetails.nearbyAccommodations.map((hotel, idx) => (
                <div key={idx} className="royal-card p-6 space-y-2.5">
                  <div className="w-10 h-10 rounded-full bg-gold-100 text-maroon-800 flex items-center justify-center">
                    <BedDouble className="w-5 h-5" />
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-maroon-900">{hotel.name}</h3>
                  <p className="text-xs font-semibold text-gold-700 uppercase tracking-wider">
                    {hotel.category}
                  </p>
                  <p className="text-xs font-medium text-maroon-800 flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-gold-700" /> {hotel.distance}
                  </p>
                  <p className="text-sm text-maroon-900/80 leading-relaxed">{hotel.notes}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Parking, Transport & Travel Instructions */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="royal-card p-7 space-y-6">
              <div>
                <h3 className="font-serif text-2xl font-bold text-maroon-900 flex items-center gap-2">
                  <Car className="w-5 h-5 text-gold-700" /> Valet &amp; Parking Information
                </h3>
                <p className="text-sm text-maroon-900/80 mt-2 leading-relaxed">
                  {venueDetails.parkingInfo}
                </p>
              </div>
              <div className="pt-4 border-t border-gold-400/30">
                <h3 className="font-serif text-2xl font-bold text-maroon-900 flex items-center gap-2">
                  <Bus className="w-5 h-5 text-gold-700" /> Boat Transfers &amp; Shuttles
                </h3>
                <p className="text-sm text-maroon-900/80 mt-2 leading-relaxed">
                  {venueDetails.transportationInfo}
                </p>
              </div>
            </div>

            <div className="royal-card p-7">
              <h3 className="font-serif text-2xl font-bold text-maroon-900 flex items-center gap-2 mb-4">
                <Info className="w-5 h-5 text-gold-700" /> Important Travel Instructions
              </h3>
              <ul className="space-y-3">
                {venueDetails.travelInstructions.map((tip, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-maroon-900/85">
                    <span className="w-6 h-6 rounded-full bg-maroon-800 text-gold-200 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="leading-relaxed">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};


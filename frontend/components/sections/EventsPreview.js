'use client';
import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { Calendar, MapPin, Clock, ArrowRight, Users, CalendarX } from 'lucide-react';
import { eventsAPI } from '@/lib/api';
import { SectionLoader } from '@/components/ui/PageLoader';

const typeColors = {
  bootcamp: '#FF6B00',
  contest: '#60a5fa',
  workshop: '#a78bfa',
  hackathon: '#f59e0b',
  seminar: '#34d399',
  meetup: '#f97316',
};

function EventCard({ event, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const title = event.title;
  const rawDate = event.date ? new Date(event.date) : new Date();
  const dateStr = rawDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const timeStr = rawDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const venue = event.venue || 'BPMCE Campus';
  const type = event.type || 'bootcamp';
  const capacity = event.capacity || 100;
  const registeredCount = Array.isArray(event.registeredUsers) ? event.registeredUsers.length : (event.registrations || 0);
  const tags = Array.isArray(event.tags) ? event.tags : (event.tags ? event.tags.split(',') : []);
  const color = typeColors[type] || '#FF6B00';

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.1, duration: 0.5 }}
    >
      <div className="card-dark p-6 h-full flex flex-col group hover:border-[#FF6B00]/30 transition-all">
        <div className="flex items-center justify-between mb-4">
          <span
            className="font-mono text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-sm font-bold"
            style={{ color, background: `${color}15`, border: `1px solid ${color}30` }}
          >
            {type}
          </span>
          <span className="font-mono text-[10px] text-[#888] flex items-center gap-1">
            <Users className="w-3 h-3 text-[#FF6B00]" />
            {registeredCount}/{capacity} Joined
          </span>
        </div>

        <h3 className="font-display font-bold text-xl text-white mb-4 group-hover:text-[#FF6B00] transition-colors leading-snug">
          {title}
        </h3>

        <div className="space-y-2 mb-5 font-mono text-xs text-[#888]">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-[#FF6B00]" />
            <span>{dateStr}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-[#FF6B00]" />
            <span>{timeStr}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-[#FF6B00]" />
            <span className="truncate">{venue}</span>
          </div>
        </div>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-5 mt-auto">
            {tags.map((tag, idx) => (
              <span key={idx} className="tag-pill text-[9px]">{tag.trim()}</span>
            ))}
          </div>
        )}

        <div className="border-t border-[#1f1f1f] pt-4 mt-auto">
          <Link href="/events" className="btn-outline text-xs w-full py-2.5 flex items-center justify-center gap-2">
            View &amp; Register <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default function EventsPreview() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [eventList, setEventList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    eventsAPI.getAll()
      .then(({ data }) => {
        const fetched = data.data || [];
        setEventList(fetched.slice(0, 3));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section ref={ref} className="section-padding bg-[#0d0d0d]">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="accent-line mb-4" />
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              className="font-display text-4xl md:text-5xl font-bold text-white"
            >
              Upcoming <span className="text-gradient">Events</span>
            </motion.h2>
            <p className="text-[#6a6a6a] mt-3 font-dosis text-lg">
              Workshops, bootcamps, and contests to level up your engineering skills.
            </p>
          </div>
          <Link href="/events" className="btn-outline text-sm">
            All Events <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <SectionLoader text="Fetching events from backend..." />
        ) : eventList.length === 0 ? (
          <div className="text-center py-12 bg-[#111] border border-[#1f1f1f] rounded-2xl p-6">
            <CalendarX className="w-10 h-10 text-[#444] mx-auto mb-2" />
            <p className="text-[#666] font-dosis">No events scheduled right now.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {eventList.map((event, i) => (
              <EventCard key={event._id || event.title} event={event} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

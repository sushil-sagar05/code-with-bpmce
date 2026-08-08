'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, Users, ArrowRight, CalendarX } from 'lucide-react';
import { eventsAPI } from '@/lib/api';
import { SectionLoader, ButtonLoader } from '@/components/ui/PageLoader';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';

const typeColors = { bootcamp: '#FF6B00', contest: '#60a5fa', workshop: '#a78bfa', hackathon: '#f59e0b', meetup: '#34d399', seminar: '#f97316' };

export default function EventsPage() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [registeringId, setRegisteringId] = useState(null);

  const fetchEvents = () => {
    setLoading(true);
    eventsAPI.getAll()
      .then(({ data }) => {
        setEvents(data.data || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleRegister = async (eventId) => {
    if (!user) {
      toast.error('Please log in to register for events!');
      return;
    }
    setRegisteringId(eventId);
    try {
      await eventsAPI.register(eventId);
      toast.success('Successfully registered for event! 🎉');
      fetchEvents();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to register for event');
    } finally {
      setRegisteringId(null);
    }
  };

  const filtered = events.filter((e) => {
    if (filter === 'all') return true;
    const isUpcoming = new Date(e.date) >= new Date();
    return filter === 'upcoming' ? isUpcoming : !isUpcoming;
  });

  return (
    <div className="pt-20">
      <section className="section-padding grid-bg">
        <div className="container-custom">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <div className="tag-pill mb-4 inline-block">Events</div>
            <h1 className="font-display text-5xl md:text-7xl font-bold text-white mb-6">
              Club <span className="text-gradient">Events</span>
            </h1>
            <p className="text-[#6a6a6a] text-xl font-dosis max-w-2xl">
              Workshops, hackathons, bootcamps, and seminars — always something happening at CodeWithBPMCE.
            </p>
          </motion.div>
          <div className="flex gap-2 mt-8">
            {['all', 'upcoming', 'past'].map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={`font-mono text-xs uppercase tracking-wider px-4 py-2 rounded border transition-all ${filter === f ? 'bg-[#FF6B00] text-black border-[#FF6B00]' : 'text-[#6a6a6a] border-[#1f1f1f] hover:border-[#FF6B00]/40'}`}>
                {f}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          {loading ? (
            <SectionLoader text="Loading club events..." />
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 bg-[#111] border border-[#1f1f1f] rounded-2xl p-6">
              <CalendarX className="w-12 h-12 text-[#444] mx-auto mb-3" />
              <h3 className="text-white font-dosis font-bold text-lg mb-1">No Events Found</h3>
              <p className="text-[#666] font-dosis text-sm">Stay tuned! New events will be announced soon.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((event, i) => {
                const color = typeColors[event.type] || '#FF6B00';
                const isUpcoming = new Date(event.date) >= new Date();
                const rawDate = event.date ? new Date(event.date) : new Date();
                const dateStr = rawDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                const timeStr = rawDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
                const registeredUsers = Array.isArray(event.registeredUsers) ? event.registeredUsers : [];
                const isRegistered = user && registeredUsers.some(u => (u._id || u) === user._id);
                const capacity = event.capacity || 100;
                const desc = event.description || event.desc || '';

                return (
                  <motion.div key={event._id || i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                    className="card-dark p-6 flex flex-col group hover:border-[#FF6B00]/30 transition-all">
                    <div className="flex justify-between mb-4">
                      <span className="font-mono text-[9px] uppercase tracking-wider px-2 py-1 rounded-sm font-bold" style={{ color, background: `${color}15`, border: `1px solid ${color}30` }}>
                        {event.type}
                      </span>
                      <span className={`font-mono text-[9px] uppercase tracking-wider px-2 py-1 rounded-sm font-bold ${isUpcoming ? 'text-green-400 bg-green-400/10 border border-green-400/30' : 'text-[#4a4a4a] bg-[#141414] border border-[#1f1f1f]'}`}>
                        {isUpcoming ? 'upcoming' : 'past'}
                      </span>
                    </div>
                    <h2 className="font-display text-xl font-bold text-white mb-3 group-hover:text-[#FF6B00] transition-colors">{event.title}</h2>
                    <p className="text-[#6a6a6a] text-sm font-dosis mb-5 flex-1 line-clamp-3">{desc}</p>
                    <div className="space-y-2 mb-5 font-mono text-xs text-[#6a6a6a]">
                      <div className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5 text-[#FF6B00]" />{dateStr} · {timeStr}</div>
                      <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-[#FF6B00]" />{event.venue || 'BPMCE Campus'}</div>
                      <div className="flex items-center gap-2"><Users className="w-3.5 h-3.5 text-[#FF6B00]" />{registeredUsers.length} / {capacity} Joined</div>
                    </div>

                    <div className="mt-auto pt-3 border-t border-[#1f1f1f]">
                      {isUpcoming ? (
                        <button
                          onClick={() => handleRegister(event._id)}
                          disabled={isRegistered || registeringId === event._id}
                          className={`w-full py-2.5 rounded font-dosis font-bold text-xs transition-all flex items-center justify-center gap-2 ${
                            isRegistered
                              ? 'bg-green-500/10 border border-green-500/30 text-green-400 cursor-default'
                              : 'btn-primary'
                          }`}
                        >
                          {registeringId === event._id ? (
                            <ButtonLoader text="Registering..." />
                          ) : isRegistered ? (
                            '✓ Registered'
                          ) : (
                            <><Users className="w-3.5 h-3.5" /> Register Now</>
                          )}
                        </button>
                      ) : (
                        <div className="text-center font-mono text-xs text-[#4a4a4a] py-2 bg-[#141414] rounded">
                          Event Ended
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

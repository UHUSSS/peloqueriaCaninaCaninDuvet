import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ArrowLeft, AlertTriangle, Clock, Scissors, DollarSign, Camera, PawPrint, User } from 'lucide-react';
import api from '../api/client';
import Badge from '../components/ui/Badge';

const SPECIES_EMOJI = { perro: '🐕', gato: '🐈', otro: '🐾' };

export default function PetHistoryPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPet = useCallback(async () => {
    try {
      const { data } = await api.get(`/pets/${id}`);
      setPet(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [id]);

  useEffect(() => { fetchPet(); }, [fetchPet]);

  if (loading) return (
    <div className="flex items-center justify-center h-64 text-gray-300">Cargando...</div>
  );
  if (!pet) return (
    <div className="p-8 text-center text-gray-400">Mascota no encontrada</div>
  );

  return (
    <div className="p-8 space-y-6 max-w-3xl mx-auto">
      {/* Back */}
      <button onClick={() => navigate('/mascotas')} className="flex items-center gap-2 text-gray-400 hover:text-pink-500 transition-colors text-sm font-medium">
        <ArrowLeft size={16} /> Volver a mascotas
      </button>

      {/* Pet profile */}
      <div className="glass-card p-6 flex gap-5 items-start">
        <div className="w-20 h-20 rounded-2xl bg-pink-50 border border-pink-100 flex items-center justify-center text-4xl shrink-0 overflow-hidden">
          {pet.photo
            ? <img src={pet.photo} className="w-full h-full object-cover" alt={pet.name} />
            : SPECIES_EMOJI[pet.species] || '🐾'}
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{pet.name}</h1>
              <p className="text-gray-400 capitalize text-sm">{pet.breed} · {pet.species} · {pet.gender}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1.5 justify-end text-gray-400 text-sm">
                <User size={13} /> {pet.owner?.name}
              </div>
              <p className="text-gray-300 text-xs">{pet.owner?.phone}</p>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-4 text-sm">
            {pet.weight && <span className="text-gray-400">Peso: <span className="text-gray-700 font-medium">{pet.weight} kg</span></span>}
            {pet.age    && <span className="text-gray-400">Edad: <span className="text-gray-700 font-medium">{pet.age} años</span></span>}
            {pet.color  && <span className="text-gray-400">Color: <span className="text-gray-700 font-medium capitalize">{pet.color}</span></span>}
          </div>
          {pet.behavior && <p className="mt-1.5 text-gray-400 text-sm">Comportamiento: <span className="text-gray-600 capitalize">{pet.behavior}</span></p>}
        </div>
      </div>

      {/* Alertas */}
      {pet.alerts && (
        <div className="alert-box">
          <AlertTriangle size={18} className="text-red-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-red-600 font-semibold text-sm mb-1">⚠ Alertas / Alergias</p>
            <p className="text-red-500/80 text-sm">{pet.alerts}</p>
          </div>
        </div>
      )}

      {/* Timeline */}
      <div>
        <h2 className="font-bold text-gray-700 mb-5 flex items-center gap-2">
          <PawPrint size={16} className="text-pink-400" />
          Historial de Servicios
          <span className="ml-1 text-xs font-normal text-gray-400 bg-rose-50 px-2 py-0.5 rounded-full">
            {pet.appointments?.length || 0}
          </span>
        </h2>

        {!pet.appointments?.length ? (
          <div className="glass-card p-10 text-center">
            <Scissors size={28} className="mx-auto mb-3 text-gray-200" />
            <p className="text-gray-400">No hay servicios registrados aún</p>
          </div>
        ) : (
          <div className="relative">
            <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-pink-300 via-rose-200 to-transparent" />
            <div className="space-y-5 pl-14">
              {pet.appointments.map((appt, i) => (
                <div key={appt.id} className="relative animate-slide-up" style={{ animationDelay: `${i * 0.04}s` }}>
                  <div className="absolute -left-9 top-5 w-3 h-3 rounded-full bg-pink-400 shadow-[0_0_0_3px_white,0_0_0_5px_#fbcfe8] border-2 border-white" />
                  <div className="glass-card p-5 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Clock size={12} className="text-gray-300" />
                          <span className="text-gray-400 text-xs capitalize">
                            {format(new Date(`${appt.appointment_date}T${appt.appointment_time}`), "EEEE dd MMM yyyy · HH:mm", { locale: es })}
                          </span>
                        </div>
                        <p className="text-gray-700 text-sm">{appt.description}</p>
                      </div>
                      <Badge status={appt.status} />
                    </div>
                    <div className="flex flex-wrap gap-4 text-xs text-gray-400">
                      {appt.stylist && (
                        <span className="flex items-center gap-1.5 bg-rose-50 px-2.5 py-1 rounded-lg text-pink-500">
                          <Scissors size={11} /> {appt.stylist.name}
                        </span>
                      )}
                      <span className="flex items-center gap-1.5 bg-emerald-50 px-2.5 py-1 rounded-lg text-emerald-600">
                        <DollarSign size={11} /> ${parseFloat(appt.price).toLocaleString('es-CO')}
                      </span>
                    </div>
                    {(appt.before_image || appt.after_image) && (
                      <div className="grid grid-cols-2 gap-3 pt-1">
                        {appt.before_image && (
                          <div>
                            <p className="text-gray-300 text-xs mb-1.5 flex items-center gap-1"><Camera size={10} /> Antes</p>
                            <img src={appt.before_image} alt="Antes" className="w-full h-36 object-cover rounded-xl border border-rose-100" />
                          </div>
                        )}
                        {appt.after_image && (
                          <div>
                            <p className="text-gray-300 text-xs mb-1.5 flex items-center gap-1"><Camera size={10} /> Después</p>
                            <img src={appt.after_image} alt="Después" className="w-full h-36 object-cover rounded-xl border border-rose-100" />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

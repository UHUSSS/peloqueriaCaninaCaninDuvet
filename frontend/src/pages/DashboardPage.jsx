import { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarDays, DollarSign, CheckCircle2, Clock, Plus, RefreshCw, AlertTriangle, Scissors } from 'lucide-react';
import api from '../api/client';
import Badge from '../components/ui/Badge';
import AppointmentModal from '../components/Appointments/AppointmentModal';

const STATUS_OPTIONS = ['pendiente', 'en_proceso', 'completado', 'cancelado'];

export default function DashboardPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState(null);

  const fetchToday = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/appointments/today');
      setAppointments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchToday(); }, [fetchToday]);

  const stats = {
    total:      appointments.length,
    completadas: appointments.filter(a => a.status === 'completado').length,
    pendientes:  appointments.filter(a => a.status === 'pendiente').length,
    ingresos:    appointments.filter(a => a.status === 'completado')
                   .reduce((s, a) => s + parseFloat(a.price || 0), 0),
  };

  const handleStatusChange = async (id, status) => {
    try {
      const { data } = await api.patch(`/appointments/${id}/status`, { status });
      setAppointments(prev => prev.map(a => a.id === id ? data : a));
    } catch (err) { console.error(err); }
  };

  const handleSaved = () => { setShowModal(false); setSelected(null); fetchToday(); };
  const today = format(new Date(), "EEEE dd 'de' MMMM, yyyy", { locale: es });

  return (
    <div className="p-8 space-y-6">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Scissors size={22} className="text-pink-500" />
            Dashboard
          </h1>
          <p className="text-gray-400 text-sm mt-0.5 capitalize">{today}</p>
        </div>
        <div className="flex gap-3">
          <button onClick={fetchToday} className="btn-secondary flex items-center gap-2">
            <RefreshCw size={14} /> Actualizar
          </button>
          <button onClick={() => { setSelected(null); setShowModal(true); }} className="btn-primary flex items-center gap-2">
            <Plus size={14} /> Nueva Cita
          </button>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Citas hoy"
          value={stats.total}
          icon={CalendarDays}
          bg="from-pink-500 to-rose-400"
          iconBg="bg-white/20"
        />
        <StatCard
          label="Completadas"
          value={stats.completadas}
          icon={CheckCircle2}
          bg="from-emerald-400 to-teal-400"
          iconBg="bg-white/20"
        />
        <StatCard
          label="Pendientes"
          value={stats.pendientes}
          icon={Clock}
          bg="from-amber-400 to-orange-400"
          iconBg="bg-white/20"
        />
        <StatCard
          label="Ingresos hoy"
          value={`$${stats.ingresos.toLocaleString('es-CO')}`}
          icon={DollarSign}
          bg="from-violet-500 to-purple-400"
          iconBg="bg-white/20"
        />
      </div>

      {/* ── Tabla de citas ── */}
      <div className="glass-card overflow-hidden">
        <div className="px-6 py-4 border-b border-rose-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-700 flex items-center gap-2">
            <CalendarDays size={16} className="text-pink-400" />
            Citas del día
          </h2>
          <span className="text-gray-400 text-sm bg-rose-50 px-3 py-1 rounded-full">
            {appointments.length} cita{appointments.length !== 1 ? 's' : ''}
          </span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16 text-gray-300">
            <RefreshCw size={20} className="animate-spin mr-2" /> Cargando...
          </div>
        ) : appointments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 rounded-full bg-pink-50 flex items-center justify-center mb-4">
              <CalendarDays size={28} className="text-pink-300" />
            </div>
            <p className="text-gray-400 font-medium mb-1">No hay citas para hoy</p>
            <p className="text-gray-300 text-sm mb-5">Agenda la primera cita del día</p>
            <button
              onClick={() => { setSelected(null); setShowModal(true); }}
              className="btn-primary flex items-center gap-2"
            >
              <Plus size={14} /> Agendar cita
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-rose-50 bg-rose-50/50">
                  {['Hora', 'Mascota', 'Propietario', 'Estilista', 'Servicio', 'Precio', 'Estado', ''].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-gray-400 font-semibold text-xs uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-rose-50">
                {appointments.map(appt => (
                  <tr key={appt.id} className="table-row">
                    <td className="px-5 py-4">
                      <span className="font-mono text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-1 rounded-lg">
                        {appt.appointment_time?.slice(0, 5)}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-pink-100 flex items-center justify-center text-sm">
                          {appt.pet?.species === 'perro' ? '🐕' : appt.pet?.species === 'gato' ? '🐈' : '🐾'}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{appt.pet?.name}</p>
                          <p className="text-gray-400 text-xs capitalize">{appt.pet?.breed}</p>
                          {appt.pet?.alerts && (
                            <span className="inline-flex items-center gap-1 text-red-400 text-xs mt-0.5">
                              <AlertTriangle size={10} /> Alertas
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-600">{appt.pet?.owner?.name}</td>
                    <td className="px-5 py-4 text-gray-500">{appt.stylist?.name || '—'}</td>
                    <td className="px-5 py-4 text-gray-400 text-xs max-w-[180px] truncate">{appt.description}</td>
                    <td className="px-5 py-4">
                      <span className="font-semibold text-gray-700">
                        ${parseFloat(appt.price).toLocaleString('es-CO')}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <Badge status={appt.status} />
                        <select
                          value={appt.status}
                          onChange={(e) => handleStatusChange(appt.id, e.target.value)}
                          className="text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-300 transition-all cursor-pointer hover:bg-gray-50 shadow-sm"
                        >
                          {STATUS_OPTIONS.map(s => (
                            <option key={s} value={s}>{s.replace('_', ' ')}</option>
                          ))}
                        </select>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => { setSelected(appt); setShowModal(true); }}
                        className="text-pink-500 hover:text-pink-600 text-xs font-semibold transition-colors bg-pink-50 hover:bg-pink-100 px-3 py-1.5 rounded-lg"
                      >
                        Editar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AppointmentModal
        isOpen={showModal}
        onClose={() => { setShowModal(false); setSelected(null); }}
        appointment={selected}
        onSaved={handleSaved}
      />
    </div>
  );
}

function StatCard({ label, value, icon: Icon, bg, iconBg }) {
  return (
    <div className={`rounded-2xl p-5 bg-gradient-to-br ${bg} text-white shadow-md`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-white/80 text-sm font-medium">{label}</span>
        <div className={`w-9 h-9 ${iconBg} rounded-xl flex items-center justify-center`}>
          <Icon size={18} className="text-white" />
        </div>
      </div>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}

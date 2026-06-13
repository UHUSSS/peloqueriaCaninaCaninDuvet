import { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarDays, Plus, RefreshCw, AlertTriangle, Scissors } from 'lucide-react';
import api from '../api/client';
import Badge from '../components/ui/Badge';
import AppointmentModal from '../components/Appointments/AppointmentModal';
import ConfirmModal from '../components/ui/ConfirmModal';

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [appointmentIdToDelete, setAppointmentIdToDelete] = useState(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/appointments');
      setAppointments(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleSaved  = () => { setShowModal(false); setSelected(null); fetchAll(); };
  const askDelete = (id) => {
    setAppointmentIdToDelete(id);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    if (!appointmentIdToDelete) return;
    try {
      await api.delete(`/appointments/${appointmentIdToDelete}`);
      fetchAll();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="section-title flex items-center gap-2">
            <CalendarDays size={22} className="text-pink-500" /> Citas & Servicios
          </h1>
          <p className="text-gray-400 text-sm mt-0.5">{appointments.length} registros en total</p>
        </div>
        <div className="flex gap-3">
          <button onClick={fetchAll} className="btn-secondary flex items-center gap-2">
            <RefreshCw size={14} /> Actualizar
          </button>
          <button onClick={() => { setSelected(null); setShowModal(true); }} className="btn-primary flex items-center gap-2">
            <Plus size={14} /> Nueva Cita
          </button>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-gray-300">
            <RefreshCw size={20} className="animate-spin mr-2" /> Cargando...
          </div>
        ) : appointments.length === 0 ? (
          <div className="flex flex-col items-center py-16">
            <div className="w-14 h-14 rounded-full bg-pink-50 flex items-center justify-center mb-4">
              <CalendarDays size={24} className="text-pink-300" />
            </div>
            <p className="text-gray-400">No hay citas registradas</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-rose-50 bg-rose-50/50">
                  {['Fecha', 'Mascota', 'Propietario', 'Estilista', 'Servicio', 'Precio', 'Estado', 'Acciones'].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-gray-400 font-semibold text-xs uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-rose-50">
                {appointments.map(appt => (
                  <tr key={appt.id} className="table-row">
                    <td className="px-5 py-4">
                      <div className="font-semibold text-gray-700 text-xs">
                        {format(new Date(`${appt.appointment_date}T00:00:00`), 'dd MMM yyyy', { locale: es })}
                      </div>
                      <div className="text-gray-400 text-xs mt-0.5 font-mono">{appt.appointment_time?.slice(0, 5)}</div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{appt.pet?.species === 'perro' ? '🐕' : appt.pet?.species === 'gato' ? '🐈' : '🐾'}</span>
                        <div>
                          <p className="font-semibold text-gray-800">{appt.pet?.name}</p>
                          <p className="text-gray-400 text-xs">{appt.pet?.breed}</p>
                          {appt.pet?.alerts && (
                            <span className="flex items-center gap-1 text-red-400 text-xs">
                              <AlertTriangle size={10} /> Alertas
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-600 text-sm">{appt.pet?.owner?.name}</td>
                    <td className="px-5 py-4">
                      <span className="text-gray-500 text-sm flex items-center gap-1.5">
                        <Scissors size={12} className="text-gray-300" />
                        {appt.stylist?.name || '—'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-400 text-xs max-w-[160px] truncate">{appt.description}</td>
                    <td className="px-5 py-4">
                      <span className="font-bold text-gray-700">${parseFloat(appt.price || 0).toLocaleString('es-CO')}</span>
                    </td>
                    <td className="px-5 py-4"><Badge status={appt.status} /></td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => { setSelected(appt); setShowModal(true); }}
                          className="text-pink-500 hover:text-pink-600 text-xs font-semibold bg-pink-50 hover:bg-pink-100 px-2.5 py-1.5 rounded-lg transition-all">
                          Editar
                        </button>
                        <button onClick={() => askDelete(appt.id)}
                          className="text-red-400 hover:text-red-500 text-xs font-semibold bg-red-50 hover:bg-red-100 px-2.5 py-1.5 rounded-lg transition-all">
                          Eliminar
                        </button>
                      </div>
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

      <ConfirmModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={confirmDelete}
        title="Confirmar eliminación"
        message="¿Estás seguro de que deseas eliminar esta cita?&#10;Se cancelará y se borrará permanentemente el registro."
        confirmText="Eliminar"
        type="danger"
      />
    </div>
  );
}

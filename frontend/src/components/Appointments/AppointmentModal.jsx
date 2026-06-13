import { useState, useEffect } from 'react';
import { Camera, X, AlertTriangle } from 'lucide-react';
import Modal from '../ui/Modal';
import api from '../../api/client';

const defaultForm = {
  pet_id: '', stylist_id: '',
  appointment_date: new Date().toLocaleDateString('en-CA'),
  appointment_time: '09:00',
  description: '', price: '', status: 'pendiente',
  before_image: '', after_image: '', notes: '',
};

export default function AppointmentModal({ isOpen, onClose, appointment, onSaved }) {
  const [form, setForm] = useState(defaultForm);
  const [pets, setPets] = useState([]);
  const [stylists, setStylists] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    api.get('/pets').then(({ data }) => setPets(data));
    api.get('/stylists').then(({ data }) => setStylists(data));
  }, [isOpen]);

  useEffect(() => {
    if (appointment) {
      setForm({
        pet_id: appointment.pet_id || '',
        stylist_id: appointment.stylist_id || '',
        appointment_date: appointment.appointment_date || defaultForm.appointment_date,
        appointment_time: appointment.appointment_time?.slice(0, 5) || '09:00',
        description: appointment.description || '',
        price: appointment.price || '',
        status: appointment.status || 'pendiente',
        before_image: appointment.before_image || '',
        after_image: appointment.after_image || '',
        notes: appointment.notes || '',
      });
      setSelectedPet(appointment.pet || null);
    } else {
      setForm(defaultForm);
      setSelectedPet(null);
    }
  }, [appointment, isOpen]);

  const set = (field, value) => setForm(f => ({ ...f, [field]: value }));

  const handlePetChange = (e) => {
    const pid = e.target.value;
    set('pet_id', pid);
    setSelectedPet(pets.find(p => p.id === parseInt(pid)) || null);
  };

  const handleImage = (field) => (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => set(field, ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.pet_id) return alert('Selecciona una mascota');
    setLoading(true);
    try {
      const payload = {
        ...form,
        price: parseFloat(form.price) || 0,
        stylist_id: form.stylist_id || null,
        before_image: form.before_image || null,
        after_image: form.after_image || null,
      };
      if (appointment) {
        await api.put(`/appointments/${appointment.id}`, payload);
      } else {
        await api.post('/appointments', payload);
      }
      onSaved();
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={appointment ? 'Editar Cita' : 'Nueva Cita'} size="xl">
      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Mascota y estilista */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Mascota *</label>
            <select className="input-field" value={form.pet_id} onChange={handlePetChange} required>
              <option value="">Seleccionar mascota...</option>
              {pets.map(p => (
                <option key={p.id} value={p.id}>{p.name} ({p.owner?.name})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Estilista / Veterinario</label>
            <select className="input-field" value={form.stylist_id} onChange={e => set('stylist_id', e.target.value)}>
              <option value="">Sin asignar</option>
              {stylists.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
        </div>

        {/* Alerta de mascota */}
        {selectedPet?.alerts && (
          <div className="alert-box animate-fade-in">
            <AlertTriangle size={16} className="text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-red-600 font-semibold text-xs mb-0.5">⚠ ALERTAS DE {selectedPet.name?.toUpperCase()}</p>
              <p className="text-red-500/80 text-xs">{selectedPet.alerts}</p>
            </div>
          </div>
        )}

        {/* Fecha, hora, precio, estado */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <label className="label">Fecha</label>
            <input className="input-field" type="date" value={form.appointment_date} onChange={e => set('appointment_date', e.target.value)} required />
          </div>
          <div>
            <label className="label">Hora</label>
            <input className="input-field" type="time" value={form.appointment_time} onChange={e => set('appointment_time', e.target.value)} required />
          </div>
          <div>
            <label className="label">Precio ($)</label>
            <input className="input-field" type="number" min="0" value={form.price} onChange={e => set('price', e.target.value)} placeholder="Ej: 85000" />
          </div>
          <div>
            <label className="label">Estado</label>
            <select className="input-field" value={form.status} onChange={e => set('status', e.target.value)}>
              <option value="pendiente">⏰ Pendiente</option>
              <option value="en_proceso">🔄 En proceso</option>
              <option value="completado">✅ Completado</option>
              <option value="cancelado">❌ Cancelado</option>
            </select>
          </div>
        </div>

        {/* Descripción */}
        <div>
          <label className="label">Descripción del servicio</label>
          <textarea
            className="input-field resize-none"
            rows={3}
            value={form.description}
            onChange={e => set('description', e.target.value)}
            placeholder="Ej: Baño completo con hidratación, corte estilo verano, limpieza de oídos..."
          />
        </div>

        {/* Fotos */}
        <div>
          <label className="label flex items-center gap-2"><Camera size={13} /> Fotos Antes / Después</label>
          <div className="grid grid-cols-2 gap-4">
            {[['before_image', '📷 Antes'], ['after_image', '✨ Después']].map(([field, label]) => (
              <div key={field}>
                <p className="text-gray-400 text-xs mb-2">{label}</p>
                {form[field] ? (
                  <div className="relative">
                    <img src={form[field]} className="w-full h-36 object-cover rounded-xl border border-rose-100" alt={field} />
                    <button type="button" onClick={() => set(field, '')}
                      className="absolute top-2 right-2 w-6 h-6 bg-red-400 hover:bg-red-500 rounded-full flex items-center justify-center shadow">
                      <X size={11} className="text-white" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center h-36 border-2 border-dashed border-rose-200 rounded-xl cursor-pointer hover:border-pink-400 hover:bg-pink-50/50 transition-all">
                    <Camera size={22} className="text-rose-200 mb-2" />
                    <span className="text-gray-300 text-xs">Subir imagen</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleImage(field)} />
                  </label>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Notas */}
        <div>
          <label className="label">Notas adicionales</label>
          <textarea className="input-field resize-none" rows={2} value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Observaciones del servicio..." />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-3 border-t border-rose-100">
          <button type="button" onClick={onClose} className="btn-secondary">Cancelar</button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Guardando...' : appointment ? 'Actualizar Cita' : 'Agendar Cita'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

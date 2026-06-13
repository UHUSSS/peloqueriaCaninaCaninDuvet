import { useState, useEffect, useCallback } from 'react';
import { Scissors, Plus, Search, Phone, RefreshCw, Pencil, X, Check, UserCheck, UserX, Stethoscope, Trash2 } from 'lucide-react';
import api from '../api/client';
import Modal from '../components/ui/Modal';
import ConfirmModal from '../components/ui/ConfirmModal';

const defaultForm = { name: '', phone: '', active: true };

const ROLE_OPTIONS = [
  { value: 'Peluquero/a',          emoji: '✂️' },
  { value: 'Veterinario/a',        emoji: '🩺' },
  { value: 'Auxiliar veterinario/a', emoji: '💉' },
  { value: 'Bañador/a',            emoji: '🛁' },
  { value: 'Recepcionista',        emoji: '📋' },
];

export default function EquipoPage() {
  const [stylists, setStylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [role, setRole] = useState('Peluquero/a');
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [showInactive, setShowInactive] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [stylistToToggle, setStylistToToggle] = useState(null);
  const [stylistToDelete, setStylistToDelete] = useState(null);

  const fetchStylists = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/stylists?all=true');
      setStylists(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchStylists(); }, [fetchStylists]);

  const filtered = stylists.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
      (s.phone || '').includes(search);
    const matchActive = showInactive ? true : s.active;
    return matchSearch && matchActive;
  });

  const openNew = () => { setSelected(null); setForm(defaultForm); setRole('Peluquero/a'); setErrors({}); setShowModal(true); };

  const openEdit = (s) => {
    setSelected(s);
    const parts = s.name.split(' - ');
    const hasRole = ROLE_OPTIONS.some(r => r.value === parts[1]);
    setForm({ name: hasRole ? parts[0] : s.name, phone: s.phone || '', active: s.active });
    setRole(hasRole ? parts[1] : 'Peluquero/a');
    setErrors({});
    setShowModal(true);
  };

  const askToggleActive = (s) => {
    setStylistToToggle(s);
    setShowConfirm(true);
  };

  const confirmToggleActive = async () => {
    if (!stylistToToggle) return;
    try {
      await api.put(`/stylists/${stylistToToggle.id}`, { ...stylistToToggle, active: !stylistToToggle.active });
      fetchStylists();
    } catch (err) {
      console.error(err);
    }
  };

  const askDelete = (s) => {
    setStylistToDelete(s);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!stylistToDelete) return;
    try {
      await api.delete(`/stylists/${stylistToDelete.id}`);
      fetchStylists();
    } catch (err) {
      console.error(err);
    }
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'El nombre es requerido';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      const payload = { name: `${form.name.trim()} - ${role}`, phone: form.phone, active: form.active };
      if (selected) { await api.put(`/stylists/${selected.id}`, payload); }
      else { await api.post('/stylists', payload); }
      setShowModal(false);
      fetchStylists();
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  const activeCount   = stylists.filter(s => s.active).length;
  const inactiveCount = stylists.filter(s => !s.active).length;

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="section-title flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-100 border border-teal-200 flex items-center justify-center">
              <Stethoscope size={18} className="text-teal-600" />
            </div>
            Equipo de Trabajo
          </h1>
          <p className="text-gray-400 text-sm mt-1 ml-12">
            Peluqueros, veterinarios y personal registrado · {activeCount} activos
          </p>
        </div>
        <button onClick={openNew} className="btn-primary flex items-center gap-2">
          <Plus size={15} /> Agregar Miembro
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="glass-card px-5 py-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-teal-100 flex items-center justify-center">
            <UserCheck size={16} className="text-teal-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-800">{activeCount}</p>
            <p className="text-gray-400 text-xs">Activos</p>
          </div>
        </div>
        <div className="glass-card px-5 py-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center">
            <UserX size={16} className="text-red-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-800">{inactiveCount}</p>
            <p className="text-gray-400 text-xs">Inactivos</p>
          </div>
        </div>
        <div className="glass-card px-5 py-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-pink-100 flex items-center justify-center">
            <Scissors size={16} className="text-pink-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-800">{stylists.length}</p>
            <p className="text-gray-400 text-xs">Total registrados</p>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex gap-3 items-center">
        <div className="relative flex-1 max-w-md">
          <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
          <input
            className="input-field pl-11"
            placeholder="Buscar por nombre o teléfono..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500">
              <X size={14} />
            </button>
          )}
        </div>
        <button
          onClick={() => setShowInactive(v => !v)}
          className={`px-4 py-2.5 rounded-xl border text-sm font-medium transition-all duration-200 ${
            showInactive
              ? 'bg-gray-100 border-gray-300 text-gray-700'
              : 'bg-white border-rose-200 text-gray-400 hover:text-gray-600 hover:border-gray-300'
          }`}
        >
          {showInactive ? 'Ocultar inactivos' : 'Ver inactivos'}
        </button>
      </div>

      {/* Lista */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-gray-300">
          <RefreshCw size={20} className="animate-spin mr-2" /> Cargando...
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <div className="w-14 h-14 rounded-full bg-teal-50 flex items-center justify-center mb-4">
            <Scissors size={26} className="text-teal-300" />
          </div>
          <p className="mb-4">{search ? 'No se encontraron resultados' : 'No hay personal registrado'}</p>
          {!search && (
            <button onClick={openNew} className="btn-primary text-sm">
              <Plus size={14} className="inline mr-1" /> Agregar primer miembro
            </button>
          )}
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <div className="divide-y divide-rose-50">
            {filtered.map(stylist => {
              const nameParts   = stylist.name.split(' - ');
              const displayName = nameParts[0];
              const displayRole = nameParts[1] || 'Personal';
              const roleInfo    = ROLE_OPTIONS.find(r => r.value === displayRole);
              const emoji       = roleInfo?.emoji || '✂️';

              return (
                <div key={stylist.id}
                  className={`flex items-center gap-4 px-6 py-4 transition-colors group ${!stylist.active ? 'opacity-50' : 'hover:bg-rose-50/60'}`}>
                  {/* Avatar */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-xl border ${
                    stylist.active ? 'bg-teal-50 border-teal-200' : 'bg-gray-50 border-gray-200'
                  }`}>
                    {emoji}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-gray-800">{displayName}</p>
                      {!stylist.active && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-red-50 border border-red-200 text-red-500">
                          Inactivo
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 mt-0.5">
                      <span className="text-gray-400 text-xs">{displayRole}</span>
                      {stylist.phone && (
                        <span className="text-gray-400 text-xs flex items-center gap-1">
                          <Phone size={10} /> {stylist.phone}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEdit(stylist)}
                      className="p-2 rounded-lg text-gray-400 hover:text-pink-500 hover:bg-pink-50 transition-all" title="Editar">
                      <Pencil size={15} />
                    </button>
                    <button onClick={() => askToggleActive(stylist)}
                      className={`p-2 rounded-lg transition-all ${
                        stylist.active
                          ? 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                          : 'text-gray-400 hover:text-teal-600 hover:bg-teal-50'
                      }`}
                      title={stylist.active ? 'Desactivar' : 'Activar'}>
                      {stylist.active ? <UserX size={15} /> : <UserCheck size={15} />}
                    </button>
                    <button onClick={() => askDelete(stylist)}
                      className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all"
                      title="Eliminar permanentemente de la base de datos">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}
        title={selected ? 'Editar Miembro del Equipo' : 'Agregar Miembro'} size="sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Nombre completo *</label>
            <input
              className={`input-field ${errors.name ? 'border-red-400' : ''}`}
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="Ej: Valentina Pérez"
              autoFocus
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Selector de rol */}
          <div>
            <label className="label">Rol / Cargo</label>
            <div className="grid grid-cols-2 gap-2">
              {ROLE_OPTIONS.map(r => (
                <button key={r.value} type="button" onClick={() => setRole(r.value)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm text-left transition-all duration-200 ${
                    role === r.value
                      ? 'bg-pink-50 border-pink-300 text-pink-700 font-medium'
                      : 'bg-white border-rose-100 text-gray-500 hover:border-pink-200 hover:text-gray-700'
                  }`}>
                  <span className="text-base">{r.emoji}</span>
                  <span className="text-xs leading-tight">{r.value}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="label">Teléfono / WhatsApp</label>
            <div className="relative">
              <Phone size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
              <input
                className="input-field pl-10"
                value={form.phone}
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                placeholder="3001234567"
                type="tel"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-rose-100">
            <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancelar</button>
            <button type="submit" className="btn-primary flex items-center gap-2" disabled={saving}>
              <Check size={14} /> {saving ? 'Guardando...' : selected ? 'Actualizar' : 'Agregar'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Confirmación de Activar/Desactivar */}
      <ConfirmModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={confirmToggleActive}
        title={stylistToToggle?.active ? 'Desactivar miembro' : 'Activar miembro'}
        message={
          stylistToToggle
            ? `¿Deseas ${stylistToToggle.active ? 'desactivar' : 'activar'} a "${stylistToToggle.name.split(' - ')[0]}"?`
            : ''
        }
        confirmText={stylistToToggle?.active ? 'Desactivar' : 'Activar'}
        type={stylistToToggle?.active ? 'warning' : 'info'}
      />

      {/* Confirmación de Eliminación Permanente */}
      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDelete}
        title="Eliminar miembro del equipo"
        message={
          stylistToDelete
            ? `¿Estás seguro de que deseas eliminar permanentemente a "${stylistToDelete.name.split(' - ')[0]}" del equipo de trabajo?\nEsta acción no se puede deshacer y desvinculará sus citas.`
            : ''
        }
        confirmText="Eliminar permanentemente"
        type="danger"
      />
    </div>
  );
}

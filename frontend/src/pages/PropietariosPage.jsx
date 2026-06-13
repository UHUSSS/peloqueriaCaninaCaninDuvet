import { useState, useEffect, useCallback } from 'react';
import { Users, Plus, Search, Phone, Mail, PawPrint, RefreshCw, Pencil, Trash2, X, Check } from 'lucide-react';
import api from '../api/client';
import Modal from '../components/ui/Modal';
import ConfirmModal from '../components/ui/ConfirmModal';

const defaultForm = { name: '', phone: '', email: '' };

export default function PropietariosPage() {
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [showConfirm, setShowConfirm] = useState(false);
  const [ownerToDelete, setOwnerToDelete] = useState(null);

  const fetchOwners = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/owners');
      setOwners(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchOwners(); }, [fetchOwners]);

  const filtered = owners.filter(o =>
    o.name.toLowerCase().includes(search.toLowerCase()) ||
    (o.phone || '').includes(search) ||
    (o.email || '').toLowerCase().includes(search.toLowerCase())
  );

  const openNew = () => { setSelected(null); setForm(defaultForm); setErrors({}); setShowModal(true); };
  const openEdit = (owner) => {
    setSelected(owner);
    setForm({ name: owner.name, phone: owner.phone || '', email: owner.email || '' });
    setErrors({});
    setShowModal(true);
  };

  const askDelete = (owner) => {
    setOwnerToDelete(owner);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    if (!ownerToDelete) return;
    try {
      await api.delete(`/owners/${ownerToDelete.id}`);
      fetchOwners();
    } catch (err) {
      console.error(err);
    }
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'El nombre es requerido';
    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Email inválido';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      if (selected) {
        await api.put(`/owners/${selected.id}`, form);
      } else {
        await api.post('/owners', form);
      }
      setShowModal(false);
      fetchOwners();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="section-title flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-violet-100 border border-violet-200 flex items-center justify-center">
              <Users size={18} className="text-violet-500" />
            </div>
            Propietarios
          </h1>
          <p className="text-gray-400 text-sm mt-1 ml-12">Dueños registrados en el sistema · {owners.length} en total</p>
        </div>
        <button onClick={openNew} className="btn-primary flex items-center gap-2">
          <Plus size={15} /> Nuevo Propietario
        </button>
      </div>

      {/* Tip */}
      <div className="bg-violet-50 border border-violet-200 rounded-xl px-5 py-3 flex items-start gap-3">
        <div className="w-5 h-5 rounded-full bg-violet-200 flex items-center justify-center shrink-0 mt-0.5">
          <span className="text-violet-600 text-xs font-bold">i</span>
        </div>
        <p className="text-violet-600 text-sm">
          Registra aquí a los dueños de las mascotas. Al crear una mascota podrás asociarla al propietario.
          Un propietario puede tener varias mascotas.
        </p>
      </div>

      {/* Buscador */}
      <div className="relative max-w-md">
        <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
        <input
          className="input-field pl-11"
          placeholder="Buscar por nombre, teléfono o email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500">
            <X size={14} />
          </button>
        )}
      </div>

      {/* Lista */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-gray-300">
          <RefreshCw size={20} className="animate-spin mr-2" /> Cargando...
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <div className="w-14 h-14 rounded-full bg-violet-50 flex items-center justify-center mb-4">
            <Users size={26} className="text-violet-300" />
          </div>
          <p className="mb-4">{search ? 'No se encontraron resultados' : 'No hay propietarios registrados'}</p>
          {!search && (
            <button onClick={openNew} className="btn-primary text-sm">
              <Plus size={14} className="inline mr-1" /> Registrar primer propietario
            </button>
          )}
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <div className="px-6 py-3 border-b border-rose-100 text-gray-400 text-xs font-medium">
            {filtered.length} resultado{filtered.length !== 1 ? 's' : ''}
          </div>
          <div className="divide-y divide-rose-50">
            {filtered.map(owner => (
              <div key={owner.id} className="flex items-center gap-4 px-6 py-4 hover:bg-rose-50/60 transition-colors group">
                {/* Avatar */}
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-100 to-violet-50 border border-violet-200 flex items-center justify-center shrink-0">
                  <span className="text-violet-600 font-bold text-sm">{owner.name.charAt(0).toUpperCase()}</span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800">{owner.name}</p>
                  <div className="flex flex-wrap gap-4 mt-0.5">
                    {owner.phone && (
                      <span className="text-gray-400 text-xs flex items-center gap-1">
                        <Phone size={11} /> {owner.phone}
                      </span>
                    )}
                    {owner.email && (
                      <span className="text-gray-400 text-xs flex items-center gap-1">
                        <Mail size={11} /> {owner.email}
                      </span>
                    )}
                  </div>
                </div>

                {/* Mascotas count */}
                <div className="flex items-center gap-1.5 text-xs text-pink-500 bg-pink-50 border border-pink-100 px-3 py-1.5 rounded-lg">
                  <PawPrint size={12} />
                  <span>{owner.pets?.length || 0} mascota{owner.pets?.length !== 1 ? 's' : ''}</span>
                </div>

                {/* Acciones */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openEdit(owner)}
                    className="p-2 rounded-lg text-gray-400 hover:text-pink-500 hover:bg-pink-50 transition-all"
                    title="Editar propietario"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => askDelete(owner)}
                    className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                    title="Eliminar propietario"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}
        title={selected ? 'Editar Propietario' : 'Nuevo Propietario'} size="sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Nombre completo *</label>
            <input
              className={`input-field ${errors.name ? 'border-red-400' : ''}`}
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="Ej: María González"
              autoFocus
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
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
          <div>
            <label className="label">Correo electrónico</label>
            <div className="relative">
              <Mail size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
              <input
                className={`input-field pl-10 ${errors.email ? 'border-red-400' : ''}`}
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="correo@ejemplo.com"
                type="email"
              />
            </div>
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>
          <div className="flex justify-end gap-3 pt-3 border-t border-rose-100">
            <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancelar</button>
            <button type="submit" className="btn-primary flex items-center gap-2" disabled={saving}>
              <Check size={14} /> {saving ? 'Guardando...' : selected ? 'Actualizar' : 'Registrar'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={confirmDelete}
        title="Confirmar eliminación"
        message={
          ownerToDelete
            ? (ownerToDelete.pets?.length > 0
              ? `¿Eliminar a "${ownerToDelete.name}"?\nTambién se eliminarán sus ${ownerToDelete.pets.length} mascota(s) y sus citas.`
              : `¿Eliminar al propietario "${ownerToDelete.name}"?`)
            : ''
        }
        confirmText="Eliminar"
        type="danger"
      />
    </div>
  );
}

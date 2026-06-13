import { useState, useEffect } from 'react';
import { AlertTriangle, Upload, X, Search, Plus, User, PawPrint } from 'lucide-react';
import api from '../../api/client';

const SPECIES = [
  { value: 'perro', emoji: '🐕', label: 'Perro' },
  { value: 'gato', emoji: '🐈', label: 'Gato' },
  { value: 'otro', emoji: '🐾', label: 'Otro' },
];
const SIZES = [
  { value: 'pequeño', label: 'Pequeño', sub: '< 10 kg' },
  { value: 'mediano', label: 'Mediano', sub: '10-25 kg' },
  { value: 'grande', label: 'Grande', sub: '25-45 kg' },
  { value: 'gigante', label: 'Gigante', sub: '> 45 kg' },
];
const GENDERS = [
  { value: 'macho', label: 'Macho', emoji: '♂️' },
  { value: 'hembra', label: 'Hembra', emoji: '♀️' },
];
const BEHAVIORS = [
  { value: 'tranquilo', emoji: '😌' },
  { value: 'juguetón', emoji: '😄' },
  { value: 'nervioso', emoji: '😬' },
  { value: 'agresivo', emoji: '😠' },
  { value: 'miedoso', emoji: '😨' },
];

const defaultForm = {
  name: '', species: 'perro', breed: '', weight: '',
  color: '', size: 'mediano', gender: 'macho', age: '',
  behavior: '', alerts: '', photo: '',
};
const defaultOwnerForm = { name: '', phone: '', email: '' };

export default function PetForm({ pet, onSaved, onCancel }) {
  const [form, setForm] = useState(defaultForm);
  const [owners, setOwners] = useState([]);
  const [ownerId, setOwnerId] = useState('');
  const [ownerSearch, setOwnerSearch] = useState('');
  const [ownerMode, setOwnerMode] = useState('select'); // 'select' | 'new'
  const [ownerForm, setOwnerForm] = useState(defaultOwnerForm);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    api.get('/owners').then(({ data }) => setOwners(data));
    if (pet) {
      setForm({
        name: pet.name || '',
        species: pet.species || 'perro',
        breed: pet.breed || '',
        weight: pet.weight || '',
        color: pet.color || '',
        size: pet.size || 'mediano',
        gender: pet.gender || 'macho',
        age: pet.age || '',
        behavior: pet.behavior || '',
        alerts: pet.alerts || '',
        photo: pet.photo || '',
      });
      setOwnerId(String(pet.owner_id || ''));
      setOwnerMode('select');
    }
  }, [pet]);

  const set = (field, value) => {
    setForm(f => ({ ...f, [field]: value }));
    setErrors(e => ({ ...e, [field]: '' }));
  };

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => set('photo', ev.target.result);
    reader.readAsDataURL(file);
  };

  const filteredOwners = owners.filter(o =>
    o.name.toLowerCase().includes(ownerSearch.toLowerCase()) ||
    (o.phone || '').includes(ownerSearch)
  );

  const selectedOwner = owners.find(o => String(o.id) === String(ownerId));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'El nombre de la mascota es requerido';
    if (ownerMode === 'select' && !ownerId) e.owner = 'Debes seleccionar o registrar un propietario';
    if (ownerMode === 'new' && !ownerForm.name.trim()) e.owner = 'El nombre del propietario es requerido';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      let resolvedOwnerId = ownerId;
      if (ownerMode === 'new') {
        const { data: owner } = await api.post('/owners', ownerForm);
        resolvedOwnerId = owner.id;
      }
      const payload = {
        owner_id: resolvedOwnerId,
        name: form.name,
        species: form.species,
        breed: form.breed,
        weight: form.weight || null,
        color: form.color,
        size: form.size,
        gender: form.gender,
        age: form.age || null,
        behavior: form.behavior,
        alerts: form.alerts,
        photo: form.photo || null,
      };
      if (pet) {
        await api.put(`/pets/${pet.id}`, payload);
      } else {
        await api.post('/pets', payload);
      }
      onSaved();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-7">

      {/* ───── PASO 1: Propietario ───── */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 rounded-full bg-pink-500 flex items-center justify-center text-xs font-bold text-white shrink-0">1</div>
          <h3 className="font-semibold text-gray-800">¿De quién es esta mascota?</h3>
        </div>

        {/* Tabs select / new */}
        <div className="flex gap-2 mb-4">
          <button
            type="button"
            onClick={() => setOwnerMode('select')}
            className={`flex-1 py-2.5 rounded-xl border text-sm font-medium transition-all ${
              ownerMode === 'select'
                ? 'bg-pink-50 border-pink-300 text-pink-700 font-semibold'
                : 'bg-white border-rose-100 text-gray-500 hover:text-gray-700 hover:bg-rose-50/20'
            }`}
          >
            <Search size={13} className="inline mr-1.5" />
            Propietario existente
          </button>
          <button
            type="button"
            onClick={() => setOwnerMode('new')}
            className={`flex-1 py-2.5 rounded-xl border text-sm font-medium transition-all ${
              ownerMode === 'new'
                ? 'bg-pink-50 border-pink-300 text-pink-700 font-semibold'
                : 'bg-white border-rose-100 text-gray-500 hover:text-gray-700 hover:bg-rose-50/20'
            }`}
          >
            <Plus size={13} className="inline mr-1.5" />
            Nuevo propietario
          </button>
        </div>

        {ownerMode === 'select' ? (
          <div className="space-y-2">
            <div className="relative">
              <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                className="input-field pl-10"
                placeholder="Buscar propietario por nombre o teléfono..."
                value={ownerSearch}
                onChange={e => { setOwnerSearch(e.target.value); setOwnerId(''); }}
              />
            </div>
            {(ownerSearch || !ownerId) && filteredOwners.length > 0 && !selectedOwner && (
              <div className="bg-white border border-rose-100 rounded-xl overflow-hidden max-h-48 overflow-y-auto shadow-lg z-10 relative">
                {filteredOwners.map(o => (
                  <button
                    key={o.id}
                    type="button"
                    onClick={() => { setOwnerId(String(o.id)); setOwnerSearch(''); setErrors(er => ({ ...er, owner: '' })); }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-rose-50/50 transition-colors text-left"
                  >
                    <div className="w-8 h-8 rounded-lg bg-pink-100 flex items-center justify-center text-pink-600 font-bold text-sm shrink-0">
                      {o.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-gray-800 text-sm font-medium">{o.name}</p>
                      {o.phone && <p className="text-gray-400 text-xs">{o.phone}</p>}
                    </div>
                    <span className="ml-auto text-gray-400 text-xs">{o.pets?.length || 0} mascota(s)</span>
                  </button>
                ))}
              </div>
            )}
            {selectedOwner && (
              <div className="flex items-center gap-3 bg-pink-50 border border-pink-200 rounded-xl px-4 py-3">
                <div className="w-8 h-8 rounded-lg bg-pink-200/50 flex items-center justify-center text-pink-700 font-bold text-sm shrink-0">
                  {selectedOwner.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="text-pink-800 font-semibold text-sm">{selectedOwner.name}</p>
                  {selectedOwner.phone && <p className="text-gray-500 text-xs">{selectedOwner.phone}</p>}
                </div>
                <button type="button" onClick={() => setOwnerId('')} className="text-gray-400 hover:text-gray-600">
                  <X size={14} />
                </button>
              </div>
            )}
            {ownerSearch && filteredOwners.length === 0 && (
              <p className="text-gray-400 text-sm text-center py-3">
                No se encontró el propietario.{' '}
                <button type="button" onClick={() => setOwnerMode('new')} className="text-pink-500 underline font-semibold">
                  Crear nuevo
                </button>
              </p>
            )}
          </div>
        ) : (
          <div className="bg-rose-50/20 border border-rose-100 rounded-xl p-4 space-y-3">
            <p className="text-gray-500 text-xs mb-2 flex items-center gap-1.5"><User size={12} /> Datos del nuevo propietario</p>
            <input className="input-field" value={ownerForm.name} onChange={e => setOwnerForm(f => ({ ...f, name: e.target.value }))} placeholder="Nombre completo *" />
            <div className="grid grid-cols-2 gap-3">
              <input className="input-field" value={ownerForm.phone} onChange={e => setOwnerForm(f => ({ ...f, phone: e.target.value }))} placeholder="Teléfono" type="tel" />
              <input className="input-field" value={ownerForm.email} onChange={e => setOwnerForm(f => ({ ...f, email: e.target.value }))} placeholder="Email" type="email" />
            </div>
          </div>
        )}
        {errors.owner && <p className="text-red-500 text-xs mt-1.5">{errors.owner}</p>}
      </div>

      {/* ───── PASO 2: Datos básicos de la mascota ───── */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 rounded-full bg-pink-500 flex items-center justify-center text-xs font-bold text-white shrink-0">2</div>
          <h3 className="font-semibold text-gray-800">Información de la mascota</h3>
        </div>

        {/* Especie — selector visual */}
        <div className="mb-4">
          <label className="label">Tipo de animal</label>
          <div className="flex gap-2">
            {SPECIES.map(s => (
              <button
                key={s.value}
                type="button"
                onClick={() => set('species', s.value)}
                className={`flex-1 py-3 rounded-xl border text-sm font-medium transition-all flex flex-col items-center gap-1 ${
                  form.species === s.value
                    ? 'bg-pink-50 border-pink-300 text-pink-700 font-semibold'
                    : 'bg-white border-rose-100 text-gray-500 hover:text-gray-700 hover:bg-rose-50/10'
                }`}
              >
                <span className="text-xl">{s.emoji}</span>
                <span className="text-xs">{s.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2 sm:col-span-1">
            <label className="label">Nombre de la mascota *</label>
            <input className={`input-field ${errors.name ? 'border-red-400' : ''}`} value={form.name} onChange={e => set('name', e.target.value)} placeholder="Ej: Rocky" />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="label">Raza</label>
            <input className="input-field" value={form.breed} onChange={e => set('breed', e.target.value)} placeholder="Ej: Golden Retriever" />
          </div>
        </div>

        {/* Género */}
        <div className="mt-3">
          <label className="label">Género</label>
          <div className="flex gap-2">
            {GENDERS.map(g => (
              <button key={g.value} type="button" onClick={() => set('gender', g.value)}
                className={`flex-1 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                  form.gender === g.value
                    ? 'bg-pink-50 border-pink-300 text-pink-700 font-semibold'
                    : 'bg-white border-rose-100 text-gray-500 hover:text-gray-700 hover:bg-rose-50/10'
                }`}>
                {g.emoji} {g.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tamaño */}
        <div className="mt-3">
          <label className="label">Tamaño</label>
          <div className="grid grid-cols-4 gap-2">
            {SIZES.map(s => (
              <button key={s.value} type="button" onClick={() => set('size', s.value)}
                className={`py-2.5 px-2 rounded-xl border text-center transition-all ${
                  form.size === s.value
                    ? 'bg-pink-50 border-pink-300 text-pink-700 font-semibold shadow-sm'
                    : 'bg-white border-rose-100 text-gray-500 hover:text-gray-700 hover:bg-rose-50/10'
                }`}>
                <p className="text-xs font-semibold">{s.label}</p>
                <p className={`text-xs mt-0.5 ${form.size === s.value ? 'text-pink-500/85' : 'text-gray-400'}`}>{s.sub}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-3">
          <div>
            <label className="label">Peso (kg)</label>
            <input className="input-field" type="number" step="0.1" min="0" value={form.weight} onChange={e => set('weight', e.target.value)} placeholder="28.5" />
          </div>
          <div>
            <label className="label">Color / Pelaje</label>
            <input className="input-field" value={form.color} onChange={e => set('color', e.target.value)} placeholder="Dorado" />
          </div>
          <div>
            <label className="label">Edad (años)</label>
            <input className="input-field" type="number" min="0" value={form.age} onChange={e => set('age', e.target.value)} placeholder="4" />
          </div>
        </div>

        {/* Comportamiento */}
        <div className="mt-3">
          <label className="label">Comportamiento habitual</label>
          <div className="flex flex-wrap gap-2">
            {BEHAVIORS.map(b => (
              <button key={b.value} type="button" onClick={() => set('behavior', form.behavior === b.value ? '' : b.value)}
                className={`px-3 py-1.5 rounded-lg border text-sm transition-all flex items-center gap-1.5 ${
                  form.behavior === b.value
                    ? 'bg-pink-50 border-pink-300 text-pink-700 font-semibold'
                    : 'bg-white border-rose-100 text-gray-500 hover:text-gray-700 hover:bg-rose-50/10'
                }`}>
                <span>{b.emoji}</span>
                <span className="capitalize text-xs">{b.value}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ───── PASO 3: Alertas (prioritaria) ───── */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-xs font-bold text-white shrink-0">3</div>
          <h3 className="font-semibold text-gray-800">Alertas y cuidados especiales</h3>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <label className="flex items-center gap-2 text-red-600 font-semibold text-sm mb-2">
            <AlertTriangle size={15} />
            Alergias / Notas importantes para el equipo
          </label>
          <textarea
            className="w-full px-4 py-3 bg-white border border-red-200 rounded-xl text-gray-800 text-sm 
                       placeholder-red-300 outline-none focus:border-red-400 focus:ring-2 focus:ring-red-400/20 resize-none"
            rows={3}
            value={form.alerts}
            onChange={e => set('alerts', e.target.value)}
            placeholder="Ej: Alérgico al champú con lavanda. No usar tijeras eléctricas cerca del oído izquierdo. Tiende a morder si tiene miedo."
          />
          <p className="text-red-500/70 text-xs mt-1.5 font-medium">Esta información es visible en la ficha del servicio y el dashboard.</p>
        </div>
      </div>

      {/* ───── PASO 4: Foto (opcional) ───── */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-full bg-pink-500 flex items-center justify-center text-xs font-bold text-white shrink-0">4</div>
          <h3 className="font-semibold text-gray-800">Foto de perfil <span className="text-gray-400 text-xs font-normal">(opcional)</span></h3>
        </div>
        <div className="flex items-center gap-4">
          {form.photo ? (
            <div className="relative">
              <img src={form.photo} className="w-24 h-24 rounded-xl object-cover border border-rose-100" alt="preview" />
              <button type="button" onClick={() => set('photo', '')}
                className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-400">
                <X size={10} className="text-white" />
              </button>
            </div>
          ) : (
            <div className="w-24 h-24 rounded-xl bg-rose-50/20 border-2 border-dashed border-rose-200 flex items-center justify-center">
              <PawPrint size={24} className="text-rose-300/40" />
            </div>
          )}
          <label className="btn-secondary cursor-pointer flex items-center gap-2 text-xs border border-rose-100 hover:bg-rose-50/50">
            <Upload size={13} />
            {form.photo ? 'Cambiar foto' : 'Subir foto'}
            <input type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
          </label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-rose-100">
        <button type="button" onClick={onCancel} className="btn-secondary">Cancelar</button>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Guardando...' : pet ? 'Actualizar Mascota' : 'Registrar Mascota'}
        </button>
      </div>
    </form>
  );
}

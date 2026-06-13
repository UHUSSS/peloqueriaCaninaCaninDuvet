import { useState, useEffect, useCallback } from 'react';
import { PawPrint, Plus, Search, AlertTriangle, ChevronRight, RefreshCw, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import Modal from '../components/ui/Modal';
import PetForm from '../components/Pets/PetForm';
import ConfirmModal from '../components/ui/ConfirmModal';

const SPECIES_EMOJI = { perro: '🐕', gato: '🐈', otro: '🐾' };
const SIZE_LABEL    = { pequeño: 'Pequeño', mediano: 'Mediano', grande: 'Grande', gigante: 'Gigante' };
const SIZE_COLOR    = { pequeño: 'bg-sky-100 text-sky-600', mediano: 'bg-violet-100 text-violet-600', grande: 'bg-orange-100 text-orange-600', gigante: 'bg-red-100 text-red-600' };

export default function PetsPage() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [petIdToDelete, setPetIdToDelete] = useState(null);
  const navigate = useNavigate();

  const fetchPets = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/pets', { params: { search: search || undefined } });
      setPets(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [search]);

  useEffect(() => {
    const t = setTimeout(fetchPets, 300);
    return () => clearTimeout(t);
  }, [fetchPets]);

  const handleSaved  = () => { setShowModal(false); setSelected(null); fetchPets(); };
  const handleEdit   = (pet) => { setSelected(pet); setShowModal(true); };
  const askDelete = (id) => {
    setPetIdToDelete(id);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    if (!petIdToDelete) return;
    try {
      await api.delete(`/pets/${petIdToDelete}`);
      fetchPets();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="section-title flex items-center gap-2">
            <PawPrint size={22} className="text-pink-500" /> Mascotas & Clientes
          </h1>
          <p className="text-gray-400 text-sm mt-0.5">{pets.length} pacientes registrados</p>
        </div>
        <button onClick={() => { setSelected(null); setShowModal(true); }} className="btn-primary flex items-center gap-2">
          <Plus size={14} /> Nueva Mascota
        </button>
      </div>

      {/* Buscador */}
      <div className="relative max-w-md">
        <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
        <input
          className="input-field pl-10"
          placeholder="Buscar mascota por nombre..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500">
            <X size={14} />
          </button>
        )}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-gray-300">
          <RefreshCw size={20} className="animate-spin mr-2" /> Cargando...
        </div>
      ) : pets.length === 0 ? (
        <div className="flex flex-col items-center py-20">
          <div className="w-16 h-16 rounded-full bg-pink-50 flex items-center justify-center mb-4">
            <PawPrint size={28} className="text-pink-300" />
          </div>
          <p className="text-gray-400">No hay mascotas registradas</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {pets.map(pet => (
            <div key={pet.id} className="glass-card-hover p-5 group" onClick={() => navigate(`/mascotas/${pet.id}`)}>
              {/* Alerta */}
              {pet.alerts && (
                <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl p-3 mb-4">
                  <AlertTriangle size={13} className="text-red-400 shrink-0 mt-0.5" />
                  <p className="text-red-500 text-xs leading-relaxed line-clamp-2">{pet.alerts}</p>
                </div>
              )}

              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-pink-50 border border-pink-100 flex items-center justify-center text-2xl overflow-hidden">
                    {pet.photo
                      ? <img src={pet.photo} className="w-full h-full object-cover" alt={pet.name} />
                      : SPECIES_EMOJI[pet.species] || '🐾'}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">{pet.name}</h3>
                    <p className="text-gray-400 text-xs">{pet.breed}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${SIZE_COLOR[pet.size] || 'bg-gray-100 text-gray-500'}`}>
                        {SIZE_LABEL[pet.size]}
                      </span>
                      <span className="text-gray-300 text-xs capitalize">{pet.gender}</span>
                    </div>
                  </div>
                </div>
                <ChevronRight size={16} className="text-gray-300 group-hover:text-pink-400 transition-colors shrink-0 mt-1" />
              </div>

              <div className="mt-4 pt-4 border-t border-rose-50 flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-xs">Propietario</p>
                  <p className="text-gray-700 text-sm font-medium">{pet.owner?.name}</p>
                </div>
                <div className="flex gap-2" onClick={e => e.stopPropagation()}>
                  <button onClick={() => handleEdit(pet)} className="text-pink-500 hover:text-pink-600 text-xs font-semibold bg-pink-50 hover:bg-pink-100 px-2.5 py-1.5 rounded-lg transition-all">
                    Editar
                  </button>
                  <button onClick={() => askDelete(pet.id)} className="text-red-400 hover:text-red-500 text-xs font-semibold bg-red-50 hover:bg-red-100 px-2.5 py-1.5 rounded-lg transition-all">
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => { setShowModal(false); setSelected(null); }}
        title={selected ? 'Editar Mascota' : 'Nueva Mascota'} size="lg">
        <PetForm pet={selected} onSaved={handleSaved} onCancel={() => { setShowModal(false); setSelected(null); }} />
      </Modal>

      <ConfirmModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={confirmDelete}
        title="Confirmar eliminación"
        message="¿Estás seguro de que deseas eliminar esta mascota?&#10;Se borrarán permanentemente sus datos y todas sus citas asociadas."
        confirmText="Eliminar"
        type="danger"
      />
    </div>
  );
}

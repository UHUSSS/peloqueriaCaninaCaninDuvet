import { useLocation, Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, PawPrint, CalendarDays, Scissors, Users, Stethoscope, LogOut } from 'lucide-react';

const navGroups = [
  {
    label: 'Principal',
    items: [
      { to: '/dashboard',     icon: LayoutDashboard, label: 'Dashboard',    desc: 'Resumen del dia' },
    ],
  },
  {
    label: 'Gestion',
    items: [
      { to: '/propietarios', icon: Users,           label: 'Propietarios', desc: 'Duenos de mascotas' },
      { to: '/mascotas',     icon: PawPrint,        label: 'Mascotas',     desc: 'Fichas de pacientes' },
      { to: '/citas',        icon: CalendarDays,    label: 'Citas',        desc: 'Servicios y turnos' },
    ],
  },
  {
    label: 'Configuracion',
    items: [
      { to: '/equipo',       icon: Stethoscope,     label: 'Equipo',       desc: 'Personal y roles' },
    ],
  },
];

export default function Sidebar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-rose-100 flex flex-col py-6 px-4 shadow-sm">
      <div className="flex items-center gap-3 px-2 mb-8">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center shadow-lg shadow-pink-200">
          <Scissors size={20} className="text-white" />
        </div>
        <div>
          <p className="font-bold text-gray-800 text-sm leading-tight">Pawfect</p>
          <p className="text-gray-400 text-xs">Grooming Studio</p>
        </div>
      </div>

      <nav className="flex flex-col gap-5 flex-1">
        {navGroups.map(group => (
          <div key={group.label}>
            <p className="text-gray-300 text-xs font-semibold uppercase tracking-widest px-3 mb-1.5">
              {group.label}
            </p>
            <div className="flex flex-col gap-0.5">
              {group.items.map(({ to, icon: Icon, label, desc }) => {
                const isActive = pathname === to;
                return (
                  <Link key={to} to={to} className={isActive ? 'nav-link-active' : 'nav-link'}>
                    <Icon size={17} className="shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium leading-none">{label}</p>
                      <p className={`text-xs mt-0.5 ${isActive ? 'text-pink-400' : 'text-gray-300'}`}>{desc}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="mt-auto flex flex-col gap-2 pt-4">
        <div className="px-3 py-3 rounded-xl bg-gray-50 border border-gray-100 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 font-bold text-xs uppercase">
            {user.name ? user.name.substring(0, 2) : 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-800 truncate">{user.name || 'Usuario'}</p>
            <p className="text-xs text-gray-500 capitalize">{user.role || 'staff'}</p>
          </div>
        </div>
        
        <button 
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 w-full px-3 py-2 text-sm font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut size={16} /> Cerrar sesion
        </button>
      </div>
    </aside>
  );
}

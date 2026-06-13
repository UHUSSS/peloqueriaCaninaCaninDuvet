import { Clock, CheckCircle2, XCircle, Loader2 } from 'lucide-react';

const STATUS_CONFIG = {
  pendiente:  { label: 'Pendiente',  className: 'badge-pending',    icon: Clock },
  en_proceso: { label: 'En proceso', className: 'badge-processing', icon: Loader2 },
  completado: { label: 'Completado', className: 'badge-done',       icon: CheckCircle2 },
  cancelado:  { label: 'Cancelado',  className: 'badge-cancelled',  icon: XCircle },
};

export default function Badge({ status }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.pendiente;
  const Icon = config.icon;
  return (
    <span className={config.className}>
      <Icon size={11} />
      {config.label}
    </span>
  );
}

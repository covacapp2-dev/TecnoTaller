import { Calculator, FileText, Users, Printer, Download } from 'lucide-react';

const tools = [
  { id: 1, name: 'Calculadora de Presupuestos', description: 'Calcula automáticamente el total de un presupuesto con IVA y descuentos', icon: Calculator, color: 'from-blue-500 to-blue-600' },
  { id: 2, name: 'Generador de Órdenes', description: 'Crea órdenes de trabajo con formato profesional para imprimir', icon: FileText, color: 'from-emerald-500 to-emerald-600' },
  { id: 3, name: 'Gestión de Turnos', description: 'Administra los turnos del taller y envía recordatorios a clientes', icon: Users, color: 'from-violet-500 to-violet-600' },
  { id: 4, name: 'Impresión Rápida', description: 'Imprime presupuestos, órdenes y recibos directamente', icon: Printer, color: 'from-amber-500 to-amber-600' },
  { id: 5, name: 'Exportar Datos', description: 'Exporta reportes y datos del taller en formato CSV o PDF', icon: Download, color: 'from-cyan-500 to-cyan-600' },
];

export default function Herramientas() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Herramientas</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {tools.map(tool => (
          <div key={tool.id} className="card hover:shadow-lg transition-all cursor-pointer group">
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${tool.color} flex items-center justify-center shadow-lg mb-4 group-hover:scale-110 transition-transform`}>
              <tool.icon className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-1">{tool.name}</h3>
            <p className="text-sm text-gray-500 leading-relaxed">{tool.description}</p>
            <button className="mt-4 text-sm font-semibold text-primary-600 hover:text-primary-700">
              Abrir →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

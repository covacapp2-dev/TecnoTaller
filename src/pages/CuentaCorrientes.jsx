import { useState } from 'react';
import { Search, Plus, CreditCard, DollarSign } from 'lucide-react';

const accounts = [
  { id: 1, client: 'Juan Pérez', debt: 85000, lastPayment: '10/06/2024', status: 'deuda' },
  { id: 2, client: 'María García', debt: 0, lastPayment: '15/06/2024', status: 'al_dia' },
  { id: 3, client: 'Carlos López', debt: 245000, lastPayment: '01/06/2024', status: 'deuda' },
  { id: 4, client: 'Roberto Sánchez', debt: 0, lastPayment: '16/06/2024', status: 'al_dia' },
  { id: 5, client: 'Laura Díaz', debt: 48000, lastPayment: '05/06/2024', status: 'deuda' },
];

export default function CuentaCorrientes() {
  const [search, setSearch] = useState('');
  const totalDebt = accounts.reduce((s, a) => s + a.debt, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Cuenta Corrientes</h1>
          <p className="text-gray-500 text-sm mt-1">Deuda total: <span className="font-bold text-red-600">${totalDebt.toLocaleString()}</span></p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nuevo Cliente
        </button>
      </div>

      <div className="card">
        <div className="relative mb-5">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar cliente..."
            className="input-field pl-10"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="table-header">
                <th className="text-left px-4 py-3 rounded-l-lg">Cliente</th>
                <th className="text-left px-4 py-3">Deuda</th>
                <th className="text-left px-4 py-3">Último Pago</th>
                <th className="text-left px-4 py-3">Estado</th>
                <th className="text-right px-4 py-3 rounded-r-lg">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {accounts.map(a => (
                <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3.5 text-sm font-medium text-gray-800">{a.client}</td>
                  <td className={`px-4 py-3.5 text-sm font-bold ${a.debt > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                    ${a.debt.toLocaleString()}
                  </td>
                  <td className="px-4 py-3.5 text-sm text-gray-500">{a.lastPayment}</td>
                  <td className="px-4 py-3.5">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      a.status === 'al_dia' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {a.status === 'al_dia' ? 'Al día' : 'Con deuda'}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <button className="text-xs font-medium text-primary-600 hover:text-primary-700 bg-primary-50 px-3 py-1.5 rounded-lg">
                      Registrar pago
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

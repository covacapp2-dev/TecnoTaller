import { useState } from 'react';
import { Settings, CreditCard, Globe, Shield, Check } from 'lucide-react';

export default function Configuracion() {
  const [currency, setCurrency] = useState('ARS');

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Configuración</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center gap-2 mb-5">
            <Settings className="w-5 h-5 text-primary-600" />
            <h2 className="text-lg font-bold text-gray-800">General</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Nombre del Taller</label>
              <input type="text" className="input-field" defaultValue="TecnoTaller" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input type="email" className="input-field" defaultValue="grafica.covac@hotmail.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Teléfono</label>
              <input type="tel" className="input-field" defaultValue="+54 11 5555-0000" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Dirección</label>
              <input type="text" className="input-field" defaultValue="Buenos Aires, Argentina" />
            </div>
            <button className="btn-primary">Guardar Cambios</button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card">
            <div className="flex items-center gap-2 mb-5">
              <CreditCard className="w-5 h-5 text-primary-600" />
              <h2 className="text-lg font-bold text-gray-800">Suscripción</h2>
            </div>
            <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-xl p-5 text-white mb-4">
              <p className="text-sm opacity-80">Plan Actual</p>
              <p className="text-2xl font-bold mt-1">Profesional</p>
              <p className="text-sm opacity-80 mt-2">$30.000/mes (ARS)</p>
              <p className="text-xs opacity-60 mt-1">Primer mes gratis incluido</p>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500" />
                <span className="text-gray-600">Órdenes ilimitadas</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500" />
                <span className="text-gray-600">Inventario completo</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500" />
                <span className="text-gray-600">Informes y gráficas</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500" />
                <span className="text-gray-600">Soporte prioritario</span>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 mb-3">Medios de pago:</p>
              <div className="grid grid-cols-2 gap-3">
                <a
                  href="https://www.mercadopago.com.ar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 border border-blue-200 bg-blue-50 rounded-lg px-4 py-3 hover:bg-blue-100 transition-colors group"
                >
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                    MP
                  </div>
                  <div>
                    <p className="text-sm font-bold text-blue-800">MercadoPago</p>
                    <p className="text-[10px] text-blue-500">Argentina</p>
                  </div>
                </a>
                <a
                  href="https://www.paypal.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 border border-yellow-200 bg-yellow-50 rounded-lg px-4 py-3 hover:bg-yellow-100 transition-colors group"
                >
                  <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                    PP
                  </div>
                  <div>
                    <p className="text-sm font-bold text-yellow-800">PayPal</p>
                    <p className="text-[10px] text-yellow-500">Internacional</p>
                  </div>
                </a>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-primary-600" />
              <h2 className="text-lg font-bold text-gray-800">Seguridad</h2>
            </div>
            <div className="space-y-3">
              <button className="w-full text-left flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 border border-gray-200 transition-colors">
                <div>
                  <p className="text-sm font-medium text-gray-800">Cambiar contraseña</p>
                  <p className="text-xs text-gray-500">Último cambio: hace 30 días</p>
                </div>
                <span className="text-gray-400">→</span>
              </button>
              <button className="w-full text-left flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 border border-gray-200 transition-colors">
                <div>
                  <p className="text-sm font-medium text-gray-800">Autenticación de dos factores</p>
                  <p className="text-xs text-gray-500">Añade una capa extra de seguridad</p>
                </div>
                <span className="text-gray-400">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

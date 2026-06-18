export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-4 px-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} TecnoTaller - Soluciones Automotrices
        </p>
        <p className="text-sm text-gray-400">
          Powered by{' '}
          <a
            href="https://covacweb.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-600 font-semibold hover:text-primary-700 transition-colors"
          >
            CovacApp
          </a>
        </p>
      </div>
    </footer>
  );
}

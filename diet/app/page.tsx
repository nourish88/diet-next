export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4">Beslenme Programı</h1>
        <p className="mb-4">Siteye Hoş Geldiniz</p>
        <a
          href="/diyet"
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Programa Git
        </a>
      </div>
    </div>
  );
}

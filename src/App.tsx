function App() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 text-white">
      <header className="text-center py-12 px-4 bg-black/20 backdrop-blur-lg border-b border-white/30">
        <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
          KB Freelance Dashboard
        </h1>
        <p className="text-xl md:text-2xl opacity-90 font-light">
          Welcome to your freelance tools dashboard
        </p>
      </header>
      
      <main className="px-6 py-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="group bg-white/15 backdrop-blur-lg border border-white/25 rounded-3xl p-8 text-center transition-all duration-500 hover:transform hover:-translate-y-3 hover:shadow-2xl hover:bg-white/20">
            <div className="mb-6">
              <div className="w-16 h-16 bg-indigo-500 rounded-2xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">⏱️</span>
              </div>
              <h2 className="text-3xl font-bold mb-4">Time Tracker</h2>
              <p className="text-lg opacity-90 leading-relaxed mb-8">
                Track your time and manage projects efficiently
              </p>
            </div>
            <button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-xl">
              Start Timer
            </button>
          </div>
          
          <div className="group bg-white/15 backdrop-blur-lg border border-white/25 rounded-3xl p-8 text-center transition-all duration-500 hover:transform hover:-translate-y-3 hover:shadow-2xl hover:bg-white/20">
            <div className="mb-6">
              <div className="w-16 h-16 bg-green-500 rounded-2xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">📄</span>
              </div>
              <h2 className="text-3xl font-bold mb-4">Invoice Generator</h2>
              <p className="text-lg opacity-90 leading-relaxed mb-8">
                Create and manage professional invoices
              </p>
            </div>
            <button className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-xl">
              Generate Invoice
            </button>
          </div>
          
          <div className="group bg-white/15 backdrop-blur-lg border border-white/25 rounded-3xl p-8 text-center transition-all duration-500 hover:transform hover:-translate-y-3 hover:shadow-2xl hover:bg-white/20">
            <div className="mb-6">
              <div className="w-16 h-16 bg-orange-500 rounded-2xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">📊</span>
              </div>
              <h2 className="text-3xl font-bold mb-4">Today's Summary</h2>
              <p className="text-lg opacity-90 leading-relaxed mb-8">
                View your daily time tracking summary
              </p>
            </div>
            <button className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-xl">
              View Summary
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App

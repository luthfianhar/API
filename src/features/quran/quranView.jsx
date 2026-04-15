import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSurah, fetchAyat } from "./QuranSlice";

export default function QuranView() {
  const dispatch = useDispatch();
  const { surah, ayat } = useSelector((state) => state.quran);

  const [selectedSurah, setSelectedSurah] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // 🔥 filter baru

  useEffect(() => {
    dispatch(fetchSurah());
  }, [dispatch]);

  const handleClick = (s) => {
    setSelectedSurah(s);
    dispatch(fetchAyat(s.nomor));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const isMekah = (t) => t?.toLowerCase() === "mekah";

  // 🔥 FILTER + SEARCH
  const filtered = surah
    .filter((s) =>
      s.namaLatin.toLowerCase().includes(search.toLowerCase())
    )
    .filter((s) => {
      if (filter === "all") return true;
      if (filter === "mekah") return isMekah(s.tempatTurun);
      if (filter === "madinah") return !isMekah(s.tempatTurun);
    });

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-6xl mx-auto">
        
        {/* TITLE */}
        <h1 className="text-3xl md:text-4xl font-bold text-center text-cyan-400 mb-6">
          🌙 Al-Qur'an Digital
        </h1>

        {/* LIST SURAH */}
        {!selectedSurah && (
          <>
            {/* SEARCH + FILTER */}
            <div className="flex flex-col md:flex-row gap-3 justify-center items-center mb-6">
              
              <input
                type="text"
                placeholder="Cari surat..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-400 w-64"
              />

              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 focus:outline-none"
              >
                <option value="all">Semua</option>
                <option value="mekah">Makkiyah</option>
                <option value="madinah">Madaniyah</option>
              </select>
            </div>

            {/* GRID */}
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {filtered.map((s) => (
                <div
                  key={s.nomor}
                  onClick={() => handleClick(s)}
                  className="bg-slate-800 hover:bg-slate-700 transition p-4 rounded-xl cursor-pointer border border-slate-700 hover:shadow-lg hover:shadow-cyan-500/20"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="bg-amber-500 text-black px-2 py-1 rounded-full text-sm">
                      {s.nomor}
                    </span>
                    <span className="text-lg">{s.nama}</span>
                  </div>

                  <h3 className="font-semibold text-lg">
                    {s.namaLatin}
                  </h3>
                  <p className="text-sm text-slate-400">
                    {s.arti}
                  </p>

                  <div className="flex justify-between mt-3 text-xs">
                    <span
                      className={
                        isMekah(s.tempatTurun)
                          ? "text-green-400"
                          : "text-yellow-400"
                      }
                    >
                      {isMekah(s.tempatTurun)
                        ? "Makkiyah"
                        : "Madaniyah"}
                    </span>
                    <span>{s.jumlahAyat} Ayat</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* DETAIL AYAT */}
        {selectedSurah && (
          <div>
            <button
              onClick={() => setSelectedSurah(null)}
              className="mb-4 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 rounded-lg"
            >
              ⬅ Kembali
            </button>

            <h2 className="text-2xl font-bold text-center mb-6 text-cyan-300">
              {selectedSurah.namaLatin} ({selectedSurah.nama})
            </h2>

            <div className="space-y-4">
              {ayat.map((a) => (
                <div
                  key={a.nomorAyat}
                  className="bg-slate-800 p-4 rounded-lg border border-slate-700"
                >
                  <p className="text-right text-2xl mb-2 leading-loose">
                    {a.teksArab}
                  </p>
                  <p className="text-slate-300 text-sm">
                    {a.teksIndonesia}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
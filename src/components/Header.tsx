import { User } from "lucide-react";

export default function Header() {
  return (
<header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-4 py-2 bg-white/10 backdrop-blur-lg border-b border-white/20">
  {/* Левый блок — название */}
  <h1 className="text-xl md:text-2xl font-black bg-gradient-to-r from-[#eeaef6] via-[#e7d8ff] to-white bg-clip-text text-transparent tracking-tight">
    OlympSearch
  </h1>

  {/* Правый блок — кнопка авторизации */}
  <button className="flex items-center justify-center w-9 h-9 rounded-full bg-white/20 backdrop-blur-lg border border-white/30 hover:bg-white/30 transition">
    <User className="w-4 h-4 text-white" />
  </button>
</header>
  );
}

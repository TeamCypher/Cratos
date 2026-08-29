import { Upload, FileVideo, Sparkles, TrendingUp, Compass } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-950 text-slate-100 font-sans selection:bg-indigo-500/30">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-neutral-950/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-500/20">
              C
            </div>
            <span className="text-xl font-bold tracking-tight text-white">Cratos</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
            <Link href="#" className="hover:text-white transition-colors">How it Works</Link>
            <Link href="#" className="hover:text-white transition-colors">Features</Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 md:py-24 max-w-5xl">
        {/* Hero Section */}
        <section className="flex flex-col items-center text-center mb-16 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/10 text-xs font-medium text-slate-300">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>AI-Powered Content Intelligence</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white max-w-3xl leading-[1.1]">
            Your content.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-200 to-slate-500">
              Its next move.
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl leading-relaxed">
            Upload a video and let Cratos understand where it fits, what's trending, and how you can optimize it.
          </p>
        </section>

        {/* Upload Area Placeholder */}
        <section className="mb-24 flex flex-col items-center w-full">
          <div className="w-full max-w-3xl group cursor-pointer relative">
            {/* Subtle accent glow behind the upload area */}
            <div className="absolute inset-0 bg-indigo-500/5 rounded-3xl blur-2xl transition-opacity opacity-0 group-hover:opacity-100 duration-700 pointer-events-none"></div>
            
            <div className="relative flex flex-col items-center justify-center p-12 md:p-20 rounded-3xl border-2 border-dashed border-white/15 bg-neutral-900/50 hover:bg-neutral-900 transition-colors duration-300 w-full">
              
              <div className="w-16 h-16 mb-6 rounded-full bg-neutral-800 flex items-center justify-center border border-white/10 group-hover:scale-105 transition-transform duration-300">
                <Upload className="w-7 h-7 text-slate-300 group-hover:text-indigo-400 transition-colors" />
              </div>
              
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 text-center">Drop your video here</h3>
              <p className="text-slate-400 mb-8 text-center">or browse from your device</p>
              
              <button className="bg-white text-black px-8 py-3.5 rounded-full font-bold text-base hover:bg-slate-200 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-white/5 mb-8">
                Upload Video
              </button>

              <div className="flex items-center gap-3 text-xs font-semibold tracking-wider text-slate-500 uppercase">
                <span>MP4</span>
                <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                <span>MOV</span>
                <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                <span>WebM</span>
              </div>

            </div>
          </div>
        </section>

        {/* Cratos Workflow */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4 lg:gap-8 pt-8 border-t border-white/5">
          <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-3">
            <div className="w-10 h-10 rounded-xl bg-neutral-900 flex items-center justify-center border border-white/5 mb-1">
              <Upload className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm tracking-wide uppercase mb-1">Upload</h4>
              <p className="text-slate-400 text-sm leading-relaxed">Start with your video</p>
            </div>
          </div>
          
          <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-3">
            <div className="w-10 h-10 rounded-xl bg-neutral-900 flex items-center justify-center border border-white/5 mb-1">
              <FileVideo className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm tracking-wide uppercase mb-1">Understand</h4>
              <p className="text-slate-400 text-sm leading-relaxed">Cratos analyzes your content</p>
            </div>
          </div>
          
          <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-3">
            <div className="w-10 h-10 rounded-xl bg-neutral-900 flex items-center justify-center border border-white/5 mb-1">
              <TrendingUp className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm tracking-wide uppercase mb-1">Detect</h4>
              <p className="text-slate-400 text-sm leading-relaxed">Find relevant trends</p>
            </div>
          </div>
          
          <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-3">
            <div className="w-10 h-10 rounded-xl bg-neutral-900 flex items-center justify-center border border-white/5 mb-1">
              <Compass className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm tracking-wide uppercase mb-1">Optimize</h4>
              <p className="text-slate-400 text-sm leading-relaxed">Build your publishing strategy</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

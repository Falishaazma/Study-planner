import { HUDHeader } from '../components/HUDHeader';
import { QuestMatrix } from '../components/QuestMatrix';
import { FocusMonitor } from '../components/FocusMonitor';
import { FridayCompanion } from '../components/FridayCompanion';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(6,182,212,0.15),rgba(255,255,255,0))] text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <HUDHeader />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-6">
            <QuestMatrix />
            <FocusMonitor />
          </div>
          <div className="lg:col-span-5">
            <FridayCompanion />
          </div>
        </div>
      </div>
    </main>
  );
}

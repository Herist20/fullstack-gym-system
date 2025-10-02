export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          Admin <span className="text-gym-primary">Dashboard</span>
        </h1>
        <p className="text-2xl text-gray-300">
          Gym Management System - Admin Dashboard
        </p>
      </div>
    </main>
  );
}

export default function DocumentsPage() {
  return (
    <main className="min-h-screen p-6 md:p-16 text-white">
      <h1 className="text-3xl font-bold mb-6">Документы</h1>
      <p className="text-white/70 mb-4">
        Здесь будут размещены локальные нормативные документы, положения и соглашения проекта.
      </p>

      <section className="mt-8 space-y-6 text-white/80">
        <article>
          <h3 className="font-semibold">Политика конфиденциальности</h3>
          <p className="text-sm text-white/60">В разработке (MVP).</p>
        </article>

        <article>
          <h3 className="font-semibold">Условия использования</h3>
          <p className="text-sm text-white/60">В разработке (MVP).</p>
        </article>
      </section>
    </main>
  );
}

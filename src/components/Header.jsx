export default function Header() {
  return (
    <header className="flex flex-col gap-4">
      <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
        Logistics Toolkit
      </p>
      <h1 className="text-4xl font-semibold text-white md:text-5xl">
        Import Cost Calculator
      </h1>
      <p className="max-w-2xl text-base text-slate-300 md:text-lg">
        Оцените полную стоимость ввоза товара, включая пошлины, НДС и
        дополнительные сборы, и быстро пересчитайте сценарии для разных
        поставщиков.
      </p>
    </header>
  );
}

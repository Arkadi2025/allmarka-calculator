import { COUNTRIES, HS_CHAPTERS, PORTS } from '../data/importData.js';

export default function HsSection() {
  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 md:p-8">
      <h3 className="text-lg font-semibold">Подсказки по ТН ВЭД</h3>
      <p className="mt-2 text-sm text-slate-400">
        Используйте популярные главы и направления, чтобы быстрее подобрать код
        ТН ВЭД и уточнить ставку пошлины.
      </p>
      <div className="mt-4 grid gap-4 text-sm text-slate-400">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Частые главы
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {HS_CHAPTERS.map((chapter) => (
              <span
                key={chapter}
                className="rounded-full border border-slate-800 bg-slate-950/60 px-3 py-1"
              >
                {chapter}
              </span>
            ))}
          </div>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Страны происхождения
            </p>
            <p className="mt-2 text-slate-300">{COUNTRIES.join(', ')}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Основные порты
            </p>
            <p className="mt-2 text-slate-300">{PORTS.join(', ')}</p>
          </div>
        </div>
      </div>
      <ul className="mt-5 space-y-3 text-sm text-slate-400">
        <li>
          • Обновляйте ставки пошлин и НДС в зависимости от категории товара.
        </li>
        <li>• НДС рассчитывается на базу с учётом пошлины и брокерских услуг.</li>
        <li>• Проверьте, входит ли страховка в стоимость фрахта.</li>
        <li>
          • Добавьте локальные складские сборы при расчёте конечной
          себестоимости.
        </li>
      </ul>
    </section>
  );
}

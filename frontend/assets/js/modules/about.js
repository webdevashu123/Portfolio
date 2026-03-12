const statsRoot = document.getElementById("aboutStats");
const stats = globalThis.aboutStats;

if (statsRoot && Array.isArray(stats)) {
  statsRoot.innerHTML = stats
    .map(
      (item) => `
      <article class="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-4 py-3">
        <strong class="block text-2xl font-bold text-slate-900 dark:text-slate-100" data-stat="${item.value}">0</strong>
        <span class="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">${item.label}</span>
      </article>
    `
    )
    .join("");

  const counters = statsRoot.querySelectorAll("[data-stat]");
  counters.forEach((counter) => {
    const target = Number(counter.getAttribute("data-stat"));
    let current = 0;
    const step = Math.max(1, Math.floor(target / 40));
    const tick = () => {
      current += step;
      if (current > target) {
        current = target;
      }
      counter.textContent = String(current);
      if (current < target) {
        window.requestAnimationFrame(tick);
      }
    };
    tick();
  });
}

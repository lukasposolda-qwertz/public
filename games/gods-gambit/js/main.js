/* Gods' Gambit — bootstrap */

document.addEventListener('DOMContentLoaded', () => {
  gameState.meta = loadMeta();

  const app = document.getElementById('app');
  app.addEventListener('click', (e) => {
    const el = e.target.closest('[data-action]');
    if (!el) return;
    handleAction(el.dataset.action, el);
  });

  render();
});

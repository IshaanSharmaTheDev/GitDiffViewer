/**
 * search.js — In-diff text search and highlight
 */
const DiffSearch = (() => {
  'use strict';
  let _matches = [];
  let _current = -1;

  function search(query, container) {
    clearHighlights(container);
    _matches = [];
    _current = -1;
    if (!query.trim()) return 0;

    const cells = container.querySelectorAll('pre');
    const re = new RegExp(escapeRe(query), 'gi');
    cells.forEach(cell => {
      const text = cell.textContent;
      if (re.test(text)) {
        cell.innerHTML = cell.innerHTML.replace(
          new RegExp(escapeRe(query), 'gi'),
          m => `<mark class="search-hit">${m}</mark>`
        );
        cell.querySelectorAll('.search-hit').forEach(m => _matches.push(m));
      }
    });
    if (_matches.length) { _current = 0; scrollToMatch(0); }
    return _matches.length;
  }

  function next() {
    if (!_matches.length) return;
    _current = (_current + 1) % _matches.length;
    scrollToMatch(_current);
  }

  function prev() {
    if (!_matches.length) return;
    _current = (_current - 1 + _matches.length) % _matches.length;
    scrollToMatch(_current);
  }

  function scrollToMatch(i) {
    _matches.forEach((m, j) => m.classList.toggle('search-active', j === i));
    _matches[i] && _matches[i].scrollIntoView({ block: 'center' });
  }

  function clearHighlights(container) {
    container.querySelectorAll('.search-hit').forEach(m => {
      m.replaceWith(document.createTextNode(m.textContent));
    });
    _matches = [];
    _current = -1;
  }

  function escapeRe(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

  return { search, next, prev, clearHighlights };
})();

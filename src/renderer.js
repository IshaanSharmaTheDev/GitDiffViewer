/**
 * renderer.js — Renders diff hunks to HTML (split + unified)
 */
const DiffRenderer = (() => {
  'use strict';

  function renderSplit(diff) {
    if (!diff.hunks.length) return '<div class="no-diff">No differences found.</div>';
    let html = '<table class="diff-table split"><thead><tr><th>Line</th><th>Original</th><th>Line</th><th>Modified</th></tr></thead><tbody>';
    let aNum = 1, bNum = 1;
    diff.hunks.forEach((hunk, hi) => {
      html += `<tr class="hunk-header"><td colspan="4">@@ chunk ${hi + 1} @@</td></tr>`;
      hunk.forEach(op => {
        if (op.type === 'equal') {
          html += `<tr class="eq"><td class="ln">${aNum++}</td><td><pre>${esc(op.aLine)}</pre></td><td class="ln">${bNum++}</td><td><pre>${esc(op.bLine)}</pre></td></tr>`;
        } else if (op.type === 'delete') {
          html += `<tr class="del"><td class="ln">${aNum++}</td><td class="del-cell"><pre>-${esc(op.aLine)}</pre></td><td class="ln"></td><td></td></tr>`;
        } else {
          html += `<tr class="ins"><td class="ln"></td><td></td><td class="ln">${bNum++}</td><td class="ins-cell"><pre>+${esc(op.bLine)}</pre></td></tr>`;
        }
      });
    });
    html += '</tbody></table>';
    return html;
  }

  function renderUnified(diff) {
    if (!diff.hunks.length) return '<div class="no-diff">No differences found.</div>';
    let html = '<table class="diff-table unified"><tbody>';
    let aNum = 1, bNum = 1;
    diff.hunks.forEach((hunk, hi) => {
      html += `<tr class="hunk-header"><td colspan="3">@@ chunk ${hi + 1} @@</td></tr>`;
      hunk.forEach(op => {
        if (op.type === 'equal') {
          html += `<tr class="eq"><td class="ln">${aNum++}</td><td class="ln">${bNum++}</td><td><pre> ${esc(op.aLine)}</pre></td></tr>`;
        } else if (op.type === 'delete') {
          html += `<tr class="del"><td class="ln">${aNum++}</td><td class="ln"></td><td class="del-cell"><pre>-${esc(op.aLine)}</pre></td></tr>`;
        } else {
          html += `<tr class="ins"><td class="ln"></td><td class="ln">${bNum++}</td><td class="ins-cell"><pre>+${esc(op.bLine)}</pre></td></tr>`;
        }
      });
    });
    html += '</tbody></table>';
    return html;
  }

  function esc(s) {
    if (s == null) return '';
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  return { renderSplit, renderUnified };
})();

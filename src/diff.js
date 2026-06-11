/**
 * diff.js — Myers diff algorithm implementation
 * Produces a list of operations: equal, insert, delete
 */
const DiffEngine = (() => {
  'use strict';

  function diffLines(a, b, ignoreWhitespace) {
    const aLines = splitLines(a, ignoreWhitespace);
    const bLines = splitLines(b, ignoreWhitespace);
    const ops = myersDiff(aLines, bLines);
    return buildChunks(ops, aLines, bLines);
  }

  function splitLines(text, normalise) {
    return text.split('\n').map(l => normalise ? l.trim() : l);
  }

  function myersDiff(a, b) {
    const N = a.length, M = b.length;
    const MAX = N + M;
    const v = new Array(2 * MAX + 1).fill(0);
    const trace = [];
    for (let d = 0; d <= MAX; d++) {
      trace.push([...v]);
      for (let k = -d; k <= d; k += 2) {
        let x;
        if (k === -d || (k !== d && v[k - 1 + MAX] < v[k + 1 + MAX])) {
          x = v[k + 1 + MAX];
        } else {
          x = v[k - 1 + MAX] + 1;
        }
        let y = x - k;
        while (x < N && y < M && a[x] === b[y]) { x++; y++; }
        v[k + MAX] = x;
        if (x >= N && y >= M) return backtrack(trace, a, b, MAX);
      }
    }
    return backtrack(trace, a, b, MAX);
  }

  function backtrack(trace, a, b, MAX) {
    const ops = [];
    let x = a.length, y = b.length;
    for (let d = trace.length - 1; d >= 0; d--) {
      const v = trace[d];
      const k = x - y;
      let prevK;
      if (k === -d || (k !== d && v[k - 1 + MAX] < v[k + 1 + MAX])) {
        prevK = k + 1;
      } else {
        prevK = k - 1;
      }
      const prevX = v[prevK + MAX];
      const prevY = prevX - prevK;
      while (x > prevX && y > prevY) { ops.push({ type: 'equal', aIdx: x-1, bIdx: y-1 }); x--; y--; }
      if (d > 0) {
        if (x === prevX) { ops.push({ type: 'insert', bIdx: y - 1 }); y--; }
        else { ops.push({ type: 'delete', aIdx: x - 1 }); x--; }
      }
    }
    return ops.reverse();
  }

  function buildChunks(ops, aLines, bLines) {
    const CONTEXT = 3;
    const result = { hunks: [], stats: { added: 0, removed: 0, unchanged: 0 } };
    const allOps = ops.map(op => ({
      ...op,
      aLine: op.aIdx !== undefined ? aLines[op.aIdx] : null,
      bLine: op.bIdx !== undefined ? bLines[op.bIdx] : null,
    }));

    allOps.forEach(op => {
      if (op.type === 'insert') result.stats.added++;
      else if (op.type === 'delete') result.stats.removed++;
      else result.stats.unchanged++;
    });

    // Group into hunks with context
    let i = 0;
    while (i < allOps.length) {
      if (allOps[i].type !== 'equal') {
        const start = Math.max(0, i - CONTEXT);
        let end = i;
        while (end < allOps.length && (allOps[end].type !== 'equal' || end < i + CONTEXT)) end++;
        end = Math.min(allOps.length, end + CONTEXT);
        result.hunks.push(allOps.slice(start, end));
        i = end;
      } else {
        i++;
      }
    }
    return result;
  }

  function charDiff(a, b) {
    // Simple inline char-level diff for changed lines
    const ops = myersDiff(a.split(''), b.split(''));
    return ops;
  }

  return { diffLines, charDiff };
})();

const parts = new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Jakarta', year: 'numeric', month: '2-digit', day: '2-digit' });
const format = (date: Date) => { const values = Object.fromEntries(parts.formatToParts(date).map(({ type, value }) => [type, value])); return `${values.year}-${values.month}-${values.day}`; };

export function currentMonthJakarta(now = new Date()) {
  const today = format(now);
  const [year, month] = today.split('-').map(Number);
  const last = new Date(Date.UTC(year, month, 0)).getUTCDate();
  return { dateFrom: `${year}-${String(month).padStart(2, '0')}-01`, dateTo: `${year}-${String(month).padStart(2, '0')}-${last}` };
}

export function previousMonthJakarta(now = new Date()) {
  const current = currentMonthJakarta(now);
  const first = new Date(`${current.dateFrom}T00:00:00Z`);
  first.setUTCDate(0);
  const year = first.getUTCFullYear();
  const month = first.getUTCMonth() + 1;
  return { dateFrom: `${year}-${String(month).padStart(2, '0')}-01`, dateTo: `${year}-${String(month).padStart(2, '0')}-${new Date(Date.UTC(year, month, 0)).getUTCDate()}` };
}

export function resolveDateRange(message: string, now = new Date()): { dateFrom?: string; dateTo?: string } {
  if (/bulan ini/i.test(message)) return currentMonthJakarta(now);
  if (/bulan lalu/i.test(message)) return previousMonthJakarta(now);
  const year = message.match(/tahun ini/i) ? Number(format(now).slice(0, 4)) : message.match(/tahun\s+(20\d{2})/i)?.[1];
  if (year) return { dateFrom: `${year}-01-01`, dateTo: `${year}-12-31` };
  const month = message.match(/(januari|februari|maret|april|mei|juni|juli|agustus|september|oktober|november|desember)\s+(20\d{2})/i);
  if (month) { const index = ['januari','februari','maret','april','mei','juni','juli','agustus','september','oktober','november','desember'].indexOf(month[1].toLowerCase()) + 1; return { dateFrom: `${month[2]}-${String(index).padStart(2, '0')}-01`, dateTo: `${month[2]}-${String(index).padStart(2, '0')}-${new Date(Date.UTC(Number(month[2]), index, 0)).getUTCDate()}` }; }
  const range = message.match(/dari\s+(\w+)\s+sampai\s+(\w+)\s+(20\d{2})/i);
  if (range) { const names = ['januari','februari','maret','april','mei','juni','juli','agustus','september','oktober','november','desember']; const from = names.indexOf(range[1].toLowerCase()) + 1; const to = names.indexOf(range[2].toLowerCase()) + 1; if (from > 0 && to > 0) return { dateFrom: `${range[3]}-${String(from).padStart(2, '0')}-01`, dateTo: `${range[3]}-${String(to).padStart(2, '0')}-${new Date(Date.UTC(Number(range[3]), to, 0)).getUTCDate()}` }; }
  return {};
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

export function parseOptionalNumber(v: FormDataEntryValue | null): number | null {
  if (v === null) return null;
  const s = String(v).trim();
  if (s === '') return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

export function parseOptionalString(v: FormDataEntryValue | null): string | null {
  if (v === null) return null;
  const s = String(v).trim();
  return s === '' ? null : s;
}

const SANDBOX_STORAGE_SHIM = `<script>(function(){try{function make(){var s=new Map();var api={getItem:function(k){var sk=String(k);return s.has(sk)?s.get(sk):null;},setItem:function(k,v){s.set(String(k),String(v));},removeItem:function(k){s.delete(String(k));},clear:function(){s.clear();},key:function(i){return Array.from(s.keys())[i]||null;}};Object.defineProperty(api,'length',{get:function(){return s.size;}});return api;}Object.defineProperty(window,'localStorage',{value:make(),configurable:true});Object.defineProperty(window,'sessionStorage',{value:make(),configurable:true});}catch(e){}})();<\/script>`;

export function injectSandboxStorageShim(html: string): string {
  const headOpen = html.match(/<head\b[^>]*>/i);
  if (headOpen) {
    const idx = headOpen.index! + headOpen[0].length;
    return html.slice(0, idx) + SANDBOX_STORAGE_SHIM + html.slice(idx);
  }
  const htmlOpen = html.match(/<html\b[^>]*>/i);
  if (htmlOpen) {
    const idx = htmlOpen.index! + htmlOpen[0].length;
    return html.slice(0, idx) + '<head>' + SANDBOX_STORAGE_SHIM + '</head>' + html.slice(idx);
  }
  return SANDBOX_STORAGE_SHIM + html;
}

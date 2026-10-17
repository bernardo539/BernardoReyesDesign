/* Microsoft Clarity loader for bernardoreyesdesign.com
   - Not loaded on localhost / local previews.
   - Owner opt-out: open any page once with ?notrack and that browser is never tracked again
     (?track turns it back on). Use it on your own devices and on Claude's browser.
   - ?ref=<name> tags the whole visit (kept for the session across pages), e.g. ?ref=acme#recruiter
   - window.brTrack('event_name') sends a Clarity custom event. With ?trackdebug on localhost
     it logs to the console instead, so events can be checked without sending data. */
(function () {
  var params;
  try { params = new URLSearchParams(window.location.search); } catch (e) { params = null; }
  var has = function (k) { return !!(params && params.has(k)); };

  var host = window.location.hostname;
  var local = host === '' || host === 'localhost' || host === '127.0.0.1' || host === '[::1]' || /\.local(host)?$/.test(host);

  var optedOut = false;
  try {
    if (has('notrack')) localStorage.setItem('br-notrack', '1');
    if (has('track')) localStorage.removeItem('br-notrack');
    optedOut = localStorage.getItem('br-notrack') === '1';
  } catch (e) {}

  var debug = false;
  try {
    if (has('trackdebug')) sessionStorage.setItem('br-trackdebug', '1');
    debug = local && sessionStorage.getItem('br-trackdebug') === '1';
  } catch (e) {}

  var enabled = !local && !optedOut;

  window.brTrack = function (name) {
    if (debug) { console.info('[clarity event]', name); return; }
    if (!enabled || typeof window.clarity !== 'function') return;
    try { window.clarity('event', name); } catch (e) {}
  };
  var tag = function (key, value) {
    if (debug) { console.info('[clarity tag]', key, value); return; }
    if (!enabled) return;
    try { window.clarity('set', key, String(value)); } catch (e) {}
  };

  if (!enabled && !debug) return;

  if (enabled) {
    (function (c, l, a, r, i, t, y) {
      c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
      t = l.createElement(r); t.async = 1; t.src = 'https://www.clarity.ms/tag/' + i;
      y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
    })(window, document, 'clarity', 'script', 'xbuj2ux4g9');
  }

  // Who: a ref from a shared link, kept for the rest of the session.
  try {
    var ref = params && params.get('ref');
    if (ref) sessionStorage.setItem('br-ref', ref.slice(0, 64));
    ref = sessionStorage.getItem('br-ref');
    if (ref) tag('ref', ref);
  } catch (e) {}

  // How they arrived.
  if (window.location.hash === '#recruiter') {
    tag('entry', 'recruiter');
    window.brTrack('recruiter_view');
  }
})();

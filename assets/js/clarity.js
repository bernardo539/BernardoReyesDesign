/* Microsoft Clarity loader for bernardoreyesdesign.com
   - Not loaded on localhost / local previews.
   - Owner opt-out: open any page once with ?notrack and that browser is never tracked again
     (?track turns it back on). Use it on your own devices and on Claude's browser.
   - ?ref=<name> tags the whole visit (kept for the session across pages), e.g. ?ref=acme#recruiter
   - window.brTrack('event_name') sends a Clarity custom event. With ?trackdebug on localhost
     it logs to the console instead, so events can be checked without sending data.
   - Every page is tagged page=<home|fitune|guros|axcess>. Contact actions also set the tag
     converted=<event> and upgrade the session so Clarity always keeps its recording.
   - Automatic on every page: engaged_30s (30s with the tab visible), email_click (mailto links),
     [data-track="name"] clicks. On case studies: case_read_50 / case_read_90 (scroll depth)
     and case_back_home. */
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

  // Actions that mean someone wants to get in touch: worth a guaranteed recording.
  var CONVERSIONS = ['resume_download', 'email_copied', 'email_click', 'linkedin_click',
    'calendly_click_card', 'calendly_click_header'];

  var send = function (args, label) {
    if (debug) { console.info('[clarity ' + label + ']', args.slice(1).join(' ')); return; }
    if (!enabled || typeof window.clarity !== 'function') return;
    try { window.clarity.apply(null, args); } catch (e) {}
  };
  var tag = function (key, value) { send(['set', key, String(value)], 'tag'); };

  window.brTrack = function (name) {
    send(['event', name], 'event');
    if (CONVERSIONS.indexOf(name) !== -1) {
      tag('converted', name);
      send(['upgrade', name], 'upgrade');
    }
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
    send(['upgrade', 'recruiter_view'], 'upgrade');
  }

  // Which page, so sessions and heatmaps can be split by case study.
  var page = (window.location.pathname.match(/([A-Za-z]+)-Case-Study/) || [])[1];
  page = page ? page.toLowerCase() : 'home';
  tag('page', page);
  var isCase = page !== 'home';

  // Real visitors vs. bounces: 30 seconds with the tab visible.
  var visibleMs = 0, since = document.hidden ? null : Date.now(), engaged = false;
  var checkEngaged = function () {
    if (engaged) return;
    var total = visibleMs + (since ? Date.now() - since : 0);
    if (total >= 30000) { engaged = true; window.brTrack('engaged_30s'); }
  };
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) { if (since) visibleMs += Date.now() - since; since = null; }
    else since = Date.now();
  });
  var engagedTimer = setInterval(function () { checkEngaged(); if (engaged) clearInterval(engagedTimer); }, 5000);

  // How far they read a case study.
  if (isCase) {
    var marks = [50, 90], hit = {};
    var onScroll = function () {
      var doc = document.documentElement;
      var max = doc.scrollHeight - window.innerHeight;
      if (max <= 0) return;
      var pct = (window.scrollY / max) * 100;
      marks.forEach(function (m) {
        if (!hit[m] && pct >= m) { hit[m] = true; window.brTrack('case_read_' + m); }
      });
      if (hit[90]) window.removeEventListener('scroll', onScroll);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // Clicks on links the page components don't track themselves.
  document.addEventListener('click', function (e) {
    var el = e.target && e.target.closest ? e.target.closest('a, [data-track]') : null;
    if (!el) return;
    var named = el.getAttribute('data-track');
    if (named) { window.brTrack(named); return; }
    var href = el.getAttribute('href') || '';
    if (href.indexOf('mailto:') === 0) window.brTrack('email_click');
    else if (isCase && /(^|\/)index\.html$|^\.?\/$/.test(href)) window.brTrack('case_back_home');
  }, true);
})();

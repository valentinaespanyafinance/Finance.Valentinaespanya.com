/* =========================================================
   SETTINGS — the only things you need to edit
   ========================================================= */
const CALENDLY_URL = 'https://calendly.com/valentinaespanya-finance/30min';  // your Calendly event link, e.g. 'https://calendly.com/your-name/30min'
const SHEETS_URL = 'https://script.google.com/macros/s/AKfycbzlGH2wphRIU0hZ3rV-V3md_m90hLEod3mWchdrJlNn4xokYWIx-H-J1HzFNie8deAj0Q/exec';    // your Google Apps Script web app URL (ends in /exec). '' = demo mode

let LANG = 'en';
const $ = id => document.getElementById(id);
const t = (en, es) => LANG === 'es' ? es : en;

/* ---------- Content data ---------- */
const STRATS = {
  corp: [
    ['Corporate Surplus Strategy','Estrategia de Excedente Corporativo','Use corporate-owned permanent life insurance so surplus can grow tax-advantaged instead of being taxed as passive income.','Usa un seguro de vida permanente a nombre de la corporación para que el excedente pueda crecer con ventaja fiscal en lugar de pagar impuestos como ingreso pasivo.','Retained earnings','Utilidades retenidas'],
    ['Capital Dividend Account','Cuenta de Dividendos de Capital','Structure life insurance so proceeds can flow to shareholders and heirs as tax-free capital dividends.','Estructura un seguro de vida para que el beneficio llegue a accionistas y herederos como dividendo de capital libre de impuestos.','Tax-free extraction','Extracción libre de impuestos'],
    ['Immediate Financing Arrangement','Immediate Financing Arrangement (IFA)','Fund a permanent policy and keep your capital working in the business through a collateral loan.','Financia una póliza permanente y mantén tu capital trabajando en el negocio mediante un préstamo colateral.','Leverage','Apalancamiento'],
    ['Corporate Insured Retirement','Retiro Corporativo Asegurado','Build a tax-advantaged asset inside your corporation that can supplement retirement income.','Construye un activo con ventaja fiscal dentro de tu corporación que puede complementar tu retiro.','Retirement','Retiro'],
    ['Estate Freeze Funding','Congelamiento Patrimonial','After an estate freeze set up by your accountant and lawyer, life insurance helps fund the tax bill at death.','Después de un congelamiento patrimonial hecho con tu contador y abogado, un seguro de vida ayuda a cubrir los impuestos al fallecer.','Succession','Sucesión'],
    ['Small Business Deduction Shield','Protección de tu Deducción','Growth inside an exempt corporate life insurance policy generally doesn\'t count toward the $50K passive income limit.','El crecimiento dentro de una póliza de vida corporativa exenta generalmente no cuenta para el límite de $50K de ingreso pasivo.','Tax efficiency','Eficiencia fiscal']
  ],
  owner: [
    ['Buy-Sell Funding','Acuerdos de Compra-Venta','Have the money ready to buy out a partner\'s shares — so the business survives and families are paid fairly.','Asegura el dinero para comprar las acciones de un socio — para que el negocio continúe y las familias reciban lo justo.','Partnership','Sociedad'],
    ['Key Person Protection','Protección de Persona Clave','Protect revenue, credit and continuity if the person the business depends on is gone.','Protege ingresos, crédito y continuidad si falta la persona de la que depende el negocio.','Continuity','Continuidad'],
    ['Critical Illness for Owners','Enfermedad Grave para Empresarios','A tax-free lump sum to keep the business — and your life — moving during recovery.','Un pago único libre de impuestos para que tu negocio y tu vida sigan durante la recuperación.','Living benefits','Beneficios en vida'],
    ['Disability & Overhead','Incapacidad y Gastos Fijos','Replace your income and cover rent, staff and bills if you can\'t work.','Reemplaza tus ingresos y cubre renta, personal y gastos si no puedes trabajar.','Income protection','Protección de ingresos'],
    ['Succession Planning','Plan de Sucesión','A clear plan for who takes over, how they pay for it, and how you exit on your terms.','Un plan claro de quién toma el control, cómo se paga y cómo sales en tus términos.','Exit strategy','Estrategia de salida'],
    ['Collateral for Growth','Garantía para Crecer','Use policy cash value as collateral to access capital for expansion.','Usa el valor en efectivo de una póliza como garantía para acceder a capital y crecer.','Capital','Capital']
  ],
  family: [
    ['Family Protection','Protección Familiar','Life, critical illness and disability coverage so your family\'s plans survive the unexpected.','Seguro de vida, enfermedades graves e incapacidad para que los planes de tu familia sobrevivan a lo inesperado.','Protection','Protección'],
    ['Living Wealth','Patrimonio en Vida','Permanent life insurance that protects your family and builds cash value you can use during your lifetime.','Un seguro de vida permanente que protege a tu familia y acumula un valor en efectivo que puedes usar en vida.','Growth','Crecimiento'],
    ['Children\'s Coverage','Seguro para tus Hijos','Lock in your children\'s insurability while they\'re young, with coverage that can grow with them.','Asegura la protección de tus hijos desde pequeños, con una cobertura que puede crecer con ellos.','Next generation','Nueva generación'],
    ['Legacy Protection','Protección de tu Legado','Life insurance that passes wealth to the next generation directly, privately and on your terms.','Un seguro de vida que transfiere tu patrimonio a la siguiente generación de forma directa, privada y en tus términos.','Legacy','Legado'],
    ['Mortgage Protection','Protección Hipotecaria','Own your coverage instead of the bank — portable, flexible and in your family\'s name.','Que la cobertura sea tuya y no del banco: portátil, flexible y a nombre de tu familia.','Home','Hogar'],
    ['Debt & Final Expense Protection','Protección de Deudas y Gastos Finales','Coverage so your debts and final expenses never fall on the people you love.','Una cobertura para que tus deudas y gastos finales nunca caigan sobre las personas que amas.','Peace of mind','Tranquilidad']
  ]
};
const ROT = {
  en:['Corporations','Business Owners','Professionals','Families'],
  es:['Corporaciones','Empresarios','Profesionales','Familias']
};
const MARQUEE = {
  en:['Corporate Surplus','Capital Dividend Account','Immediate Financing Arrangement','Buy-Sell Funding','Key Person','Estate Freeze','Legacy Protection','Critical Illness'],
  es:['Excedente Corporativo','Cuenta de Dividendos de Capital','Immediate Financing Arrangement','Acuerdos de Compra-Venta','Persona Clave','Congelamiento Patrimonial','Protección de tu Legado','Enfermedad Grave']
};

/* ---------- Language ---------- */
function setLang(l){
  LANG = l;
  document.documentElement.lang = l;
  $('btn-en').setAttribute('aria-pressed', l === 'en');
  $('btn-es').setAttribute('aria-pressed', l === 'es');
  try { localStorage.setItem('ve-lang', l); } catch(e){}
  renderCards(); renderMarquee(); renderQuiz(); updateCalc(); if (window.hvDraw && $('hv-ex').textContent) hvDraw(); rotIndex = 0; if ($('rot')) $('rot').textContent = ROT[LANG][0];
}

/* ---------- Header / menu ---------- */
addEventListener('scroll', () => $('hdr').classList.toggle('scrolled', scrollY > 30), {passive:true});
function toggleMenu(b){ const open = $('menu').classList.toggle('open'); b.setAttribute('aria-expanded', open); }
document.querySelectorAll('#menu a').forEach(a => a.addEventListener('click', () => $('menu').classList.remove('open')));

/* ---------- Rotating word ---------- */
let rotIndex = 0;
setInterval(() => {
  const el = $('rot'); if (!el) return; el.classList.add('out');
  setTimeout(() => { rotIndex = (rotIndex + 1) % ROT[LANG].length; el.textContent = ROT[LANG][rotIndex]; el.classList.remove('out'); }, 400);
}, 2600);

/* ---------- Marquee ---------- */
function renderMarquee(){
  const items = MARQUEE[LANG].map(s => `<span>${s}</span>`).join('');
  $('mq').innerHTML = items + items;
}

/* ---------- Strategy tabs ---------- */
let TAB = null;
function renderCards(){
  const L = LANG === 'es' ? 1 : 0;
  if (!TAB){ $('cards').innerHTML = ''; return; }
  $('cards').innerHTML = STRATS[TAB].map((s, i) => `
    <article class="card" style="animation-delay:${i*0.07}s">
      <span class="n">${String(i+1).padStart(2,'0')}</span>
      <h3>${s[L]}</h3><p>${s[2+L]}</p><span class="tag">${s[4+L]}</span>
    </article>`).join('') +
    (TAB === 'owner' ? `<p class="tab-note" style="grid-column:1/-1">${t('Incorporated?','¿Tienes una corporación?')} <button type="button" onclick="document.querySelector('.tab[data-tab=corp]').click()">${t('See corporate strategies','Mira las estrategias corporativas')} →</button></p>` : '');
  document.querySelectorAll('#cards .card').forEach(c => c.addEventListener('mousemove', e => {
    const r = c.getBoundingClientRect();
    c.style.setProperty('--mx', (e.clientX - r.left) + 'px'); c.style.setProperty('--my', (e.clientY - r.top) + 'px');
  }));
}
document.querySelectorAll('.tab').forEach(b => b.addEventListener('click', () => {
  document.querySelectorAll('.tab').forEach(x => x.setAttribute('aria-selected', x === b));
  TAB = b.dataset.tab; renderCards(); $('corp-insight').hidden = TAB !== 'corp';
  document.querySelector('.tabs').classList.add('picked');
  const top = $('cards').getBoundingClientRect().top;
  if (top > innerHeight * .65) scrollBy({top: top - innerHeight * .35, behavior:'smooth'});
}));

/* ---------- Scroll reveal + counters ---------- */
const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  e.target.classList.add('in'); io.unobserve(e.target);
  e.target.querySelectorAll('.count').forEach(countUp);
}), {threshold:.15}) : null;
document.querySelectorAll('.rv').forEach(el => io ? io.observe(el) : el.classList.add('in'));
function countUp(el){
  const to = +el.dataset.to, t0 = performance.now(), d = 1600;
  const step = now => { const p = Math.min((now - t0) / d, 1); el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(step); };
  requestAnimationFrame(step);
}

/* ---------- Google Sheets ----------
   Sends any form to your Google Apps Script web app (one tab per form: booking, calculator, referral). */
async function sendToSheet(data){
  const p = new URLSearchParams(location.search);
  ['utm_source','utm_medium','utm_campaign'].forEach(k => { if (p.get(k)) data[k] = p.get(k); });
  data.page = location.origin + location.pathname;
  if (!SHEETS_URL){ console.info('[demo mode] would save to Google Sheets:', data); return; }
  try {
    await fetch(SHEETS_URL, {method:'POST', mode:'no-cors', headers:{'Content-Type':'text/plain;charset=utf-8'}, body: JSON.stringify(data)});
  } catch(err){ console.warn('Sheets save failed', err); }
}

/* ---------- Booking questionnaire ----------
   Profile -> own path -> value screen -> [status: self-employed & employees only] -> province -> meeting language -> contact.
   Incorporated owners/professionals always qualify. Others do NOT qualify only if status = refugee claim in process, study permit or visitor.
   Every submission is saved to Google Sheets; qualified -> Calendly shown inline, others -> #playbook. */
const O = (v, en, es, sen, ses) => ({v, l:[en, es], s: sen ? [sen, ses] : null});
const Q = {
  profile:{q:['Which best describes you?','¿Qué te describe mejor?'], opts:[
    O('owner','Incorporated business owner','Dueño de negocio incorporado'),
    O('pro','Incorporated professional','Profesional incorporado','Doctor, dentist, lawyer, accountant, engineer…','Médico, dentista, abogado, contador, ingeniero…'),
    O('self','Self-employed (sole proprietor)','Independiente (sole proprietor)'),
    O('employee','Employee','Empleado')]},
  owner_years:{q:['How long has your corporation been operating?','¿Cuántos años lleva tu corporación?'], opts:[O('<2','Less than 2 years','Menos de 2 años'),O('2-5','2–5 years','2–5 años'),O('5+','More than 5 years','Más de 5 años')]},
  owner_partners:{q:['Do you have partners or shareholders?','¿Tienes socios o accionistas?'], opts:[O('yes','Yes','Sí'),O('no','No','No')]},
  owner_priority:{q:['What is your top priority?','¿Cuál es tu prioridad?'], opts:[
    O('owner_protect','Protect myself as the owner','Protección personal del dueño','Life, disability and critical illness','Vida, incapacidad y enfermedades graves'),
    O('keyperson','Protect the business if a key person is gone','Proteger el negocio si falta una persona clave'),
    O('buysell','A buy-sell plan with my partners','Un acuerdo buy-sell con mis socios','Funding the buyout if a partner dies or gets sick','Cómo se paga la compra si un socio fallece o enferma'),
    O('retained','Make better use of retained earnings','Usar mejor las ganancias retenidas'),
    O('succession','Plan my succession or exit','Planear mi sucesión o salida')]},
  pro_years:{q:['How long have you been incorporated?','¿Cuántos años llevas incorporado?'], opts:[O('<2','Less than 2 years','Menos de 2 años'),O('2-5','2–5 years','2–5 años'),O('5+','More than 5 years','Más de 5 años')]},
  pro_priority:{q:['What is your top priority?','¿Cuál es tu prioridad?'], opts:[
    O('income',"Protect my income if I can't work",'Proteger mi ingreso si no puedo trabajar','Disability and critical illness','Incapacidad y enfermedades graves'),
    O('retained','Make better use of retained earnings','Usar mejor las ganancias retenidas'),
    O('family','Protect my family','Proteger a mi familia','Life insurance','Seguro de vida'),
    O('retire','Build my retirement without a company pension','Construir mi retiro sin pensión de empresa'),
    O('debt_pro','Protect my family from my student or practice debt','Proteger a mi familia de mis deudas de estudios o de mi práctica')]},
  pro_retained:{q:['How much money has accumulated in your corporation?','¿Cuánto dinero hay acumulado en tu corporación?'], opts:[O('<100k','Under $100K','Menos de $100K'),O('100-500k','$100K – $500K','$100K – $500K'),O('500k+','$500K+','$500K+')]},
  self_years:{q:['How long has your business been operating?','¿Cuántos años lleva operando tu negocio?'], opts:[O('<1','Less than 1 year','Menos de 1 año'),O('1-2','1–2 years','1–2 años'),O('2+','More than 2 years','Más de 2 años')]},
  self_priority:{q:['What is your top priority?','¿Cuál es tu prioridad?'], opts:[
    O('income','Protect my income if I get sick or injured','Proteger mi ingreso si me enfermo o me accidento','No employer benefits to fall back on','Sin beneficios de empleador que me respalden'),
    O('family','Protect my family','Proteger a mi familia','Life insurance','Seguro de vida'),
    O('retire','Save for retirement without a company pension','Ahorrar para mi retiro sin pensión de empresa'),
    O('cashflow','Protect my cash flow in slow or tough months','Proteger mi flujo de caja en meses lentos o difíciles'),
    O('structure','Grow my business with the right structure','Crecer mi negocio con la estructura correcta','Including when incorporating makes sense','Incluye cuándo conviene incorporarme'),
    O('debt','Make sure my debts never fall on my family','Que mis deudas nunca caigan sobre mi familia')]},
  employee_years:{q:['How long have you been at your job?','¿Cuánto tiempo llevas en tu trabajo?'], opts:[O('<1','Less than 1 year','Menos de 1 año'),O('1-3','1–3 years','1–3 años'),O('3+','More than 3 years','Más de 3 años')]},
  employee_priority:{q:['What is your top priority?','¿Cuál es tu prioridad?'], opts:[
    O('e_protect','Proper protection','Protección adecuada','Protect against loss of income and protect family assets','Protegerte ante la pérdida de ingresos y proteger los bienes de tu familia'),
    O('e_build','Build wealth','Construir patrimonio','Strive to outpace inflation with tax-advantaged growth','Buscar superar la inflación con crecimiento con ventaja fiscal'),
    O('e_preserve','Preserve wealth','Preservar patrimonio','Reduce taxation and build a family legacy','Reducir impuestos y construir un legado familiar'),
    O('debt','Debt protection','Protección de deudas','Make sure your debts never fall on your family','Que tus deudas nunca caigan sobre tu familia')]},
  status:{q:['What is your status in Canada?','¿Cuál es tu estatus en Canadá?'], opts:[
    O('citizen','Canadian citizen','Ciudadano/a canadiense'),
    O('pr','Permanent resident','Residente permanente'),
    O('work','Work permit','Permiso de trabajo'),
    O('protected','Approved refugee (protected person)','Refugiado/a aprobado/a (persona protegida)'),
    O('claim','Refugee claim in process','Solicitud de refugio en proceso'),
    O('study','Study permit','Permiso de estudio'),
    O('visitor','Visitor','Visitante')]},
  province:{q:['Which province do you live in?','¿En qué provincia vives?'], opts:[O('AB','Alberta','Alberta'),O('BC','British Columbia','Columbia Británica'),O('ON','Ontario','Ontario'),O('other','Other','Otra')]},
  meeting:{q:['Preferred language for our meeting','Idioma preferido para la reunión'], opts:[O('en','English','Inglés'),O('es','Spanish','Español')]}
};
const NOT_QUALIFIED = ['claim','study','visitor'];
const ASKS_STATUS = ['self','employee'];
const VALUE = {
  owner_protect:[['How your family and business would be affected if you could not work or passed away','Life, disability and critical illness coverage, personally or through the corporation','Who should own and pay for each policy, coordinated with your accountant'],['Cómo se afectarían tu familia y tu negocio si no pudieras trabajar o fallecieras','Cobertura de vida, incapacidad y enfermedades graves, a tu nombre o a través de la corporación','Quién debe ser dueño y pagar cada póliza, coordinado con tu contador']],
  keyperson:[['How much revenue depends on one person','What it would cost to replace them and cover the gap','Coverage owned by the corporation to protect cash flow and credit'],['Cuánto ingreso depende de una sola persona','Cuánto costaría reemplazarla y cubrir el hueco','Una cobertura a nombre de la corporación para proteger flujo de caja y crédito']],
  buysell:[["What each partner's shares are worth today",'How the buyout would be funded if a partner dies or becomes ill','How your shareholder agreement and the insurance work together'],['Cuánto valen hoy las acciones de cada socio','Cómo se pagaría la compra si un socio fallece o enferma','Cómo trabajan juntos tu acuerdo de accionistas y el seguro']],
  retained:[['How much tax your passive investments pay each year','Whether passive income could reduce your small business deduction','Ways to grow surplus tax-efficiently and take it out later'],['Cuánto pagan de impuestos tus inversiones pasivas cada año','Si el ingreso pasivo podría reducir tu deducción para pequeñas empresas','Formas de hacer crecer el excedente con eficiencia fiscal y sacarlo después']],
  succession:[['Who takes over, and when','How the transfer is funded without a forced sale','How insurance can fund the tax bill at death, coordinated with your accountant and lawyer'],['Quién toma el control y cuándo','Cómo se financia la transferencia sin una venta forzada','Cómo un seguro puede cubrir los impuestos al fallecer, coordinado con tu contador y abogado']],
  income:[['How long you could cover your expenses without working','Disability and critical illness coverage for your situation','Keeping your business and bills running during recovery'],['Cuánto tiempo podrías cubrir tus gastos sin trabajar','Cobertura de incapacidad y enfermedades graves para tu situación','Mantener tu negocio y tus cuentas al día durante la recuperación']],
  family:[['How much your family would need if your income stopped',"The gap between what you have and what they'd need",'Life and critical illness options that fit your budget'],['Cuánto necesitaría tu familia si tu ingreso se detiene','La diferencia entre lo que tienes y lo que necesitarían','Opciones de seguro de vida y enfermedades graves que se ajusten a tu presupuesto']],
  retire:[['What your retirement needs to look like in numbers','How cash-value life insurance can complement your RRSP and TFSA when there is no company pension','A monthly plan you can actually stick to'],['Cómo se ve tu retiro en números','Cómo un seguro con valor en efectivo puede complementar tu RRSP y TFSA cuando no hay pensión de empresa','Un plan mensual que realmente puedas sostener']],
  debt_pro:[['Your student, practice and personal debt in one picture','What would happen to that debt if you could not work','Coverage so your family is protected from that debt if something happens to you'],['Tus deudas de estudios, de tu práctica y personales en una sola vista','Qué pasaría con esas deudas si no pudieras trabajar','Una cobertura para que tu familia quede protegida de esas deudas si algo te pasa']],
  cashflow:[['What happens to your business if your income stops for a few months','Disability and critical illness coverage built for self-employed income','Protecting your income so the business keeps going'],['Qué le pasa a tu negocio si tu ingreso se detiene por unos meses','Cobertura de incapacidad y enfermedades graves pensada para independientes','Proteger tu ingreso para que el negocio siga funcionando']],
  structure:[['When incorporating could make sense, reviewed with your accountant','Protecting yourself and your business as it grows','Separating personal and business money the right way'],['Cuándo podría convenir incorporarte, revisado con tu contador','Protegerte a ti y a tu negocio mientras crece','Separar bien el dinero personal y el del negocio']],
  debt:[['All your debts in one picture: mortgage, loans and cards','What your family would owe if something happened to you','Coverage sized so your debts never fall on them'],['Todas tus deudas en una sola vista: hipoteca, préstamos y tarjetas','Lo que tu familia tendría que pagar si algo te pasara','Una cobertura del tamaño justo para que tus deudas nunca caigan sobre ellos']],
  e_protect:[["What your group plan really covers, and what it doesn't",'Replacing your income if you cannot work',"Protecting your family's home and assets"],['Lo que realmente cubre tu seguro del trabajo, y lo que no','Reemplazar tu ingreso si no puedes trabajar','Proteger la casa y los bienes de tu familia']],
  e_build:[['Whether your savings are keeping ahead of inflation','How cash-value life insurance can grow tax-advantaged','A monthly plan that grows with your income'],['Si tus ahorros le están ganando a la inflación','Cómo un seguro con valor en efectivo puede crecer con ventaja fiscal','Un plan mensual que crece con tu ingreso']],
  e_preserve:[['How life insurance can cover the taxes your estate will owe','How to pass wealth to your family efficiently','Making sure your legacy goes where you want it'],['Cómo un seguro de vida puede cubrir los impuestos de tu herencia','Cómo transferir tu patrimonio a tu familia de forma eficiente','Asegurar que tu legado llegue a donde tú quieres']]
};
let qi = 0; const A = {};
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function pathSteps(){
  if (A.profile === 'owner') return ['owner_years','owner_partners','owner_priority'];
  if (A.profile === 'pro') return ['pro_years','pro_priority', ...(A.pro_priority === 'retained' ? ['pro_retained'] : [])];
  if (A.profile === 'self') return ['self_years','self_priority'];
  if (A.profile === 'employee') return ['employee_years','employee_priority'];
  return [];
}
function steps(){ return ['profile', ...pathSteps(), 'value', ...(ASKS_STATUS.includes(A.profile) ? ['status'] : []), 'province', 'meeting', 'contact']; }
function priority(){ return A[A.profile + '_priority']; }
function label(id){ const o = Q[id]?.opts.find(o => o.v === A[id]); return o ? o.l[0] : ''; }
function optionsFor(id){ return id === 'owner_priority' && A.owner_partners !== 'yes' ? Q[id].opts.filter(o => o.v !== 'buysell') : Q[id].opts; }
function renderQuiz(){
  const S = steps(); if (qi >= S.length) qi = S.length - 1;
  const id = S[qi], L = LANG === 'es' ? 1 : 0;
  $('qbar').style.width = ((qi + 1) / S.length * 100) + '%';
  let h = `<div class="q-count">${t('Step','Paso')} ${qi+1} / ${S.length}</div>`, ready = true;
  if (Q[id]){
    h += `<div class="q-title">${Q[id].q[L]}</div><div class="opts" role="radiogroup">` +
      optionsFor(id).map(o => `<button type="button" role="radio" aria-checked="${A[id]===o.v}" class="opt${A[id]===o.v?' sel':''}" onclick="pick('${id}','${o.v}')">${o.l[L]}${o.s ? `<small>${o.s[L]}</small>` : ''}</button>`).join('') + '</div>';
    ready = !!A[id];
  } else if (id === 'value'){
    const v = VALUE[priority()] || VALUE.family;
    h += `<div class="q-title">${t("Here's what we'd review together:","Esto es lo que revisaríamos juntos:")}</div><ol class="play">` +
      v[L].map(x => `<li><div><b>${x}</b></div></li>`).join('') + `</ol><p class="fine">${t('A complimentary 30-minute private session.','Una sesión privada de 30 minutos, sin costo.')}</p>`;
  } else {
    h += `<div class="q-title">${t('Where should I send your confirmation?','¿A dónde te envío la confirmación?')}</div>
      <form id="qform" novalidate onsubmit="return false">
        <label>${t('Full name','Nombre completo')}<input name="name" required autocomplete="name" value="${esc(A.name)}"></label>
        <div class="row"><label>${t('Email','Correo')}<input name="email" type="email" required autocomplete="email" value="${esc(A.email)}"></label>
        <label>${t('Phone','Teléfono')}<input name="phone" type="tel" required autocomplete="tel" value="${esc(A.phone)}"></label></div>
        <label class="check"><input type="checkbox" name="consent" required ${A.consent?'checked':''}><span>${t('I agree to be contacted by Valentina España by email, phone or text about my request, and I have read the ','Acepto que Valentina España me contacte por correo, teléfono o mensaje sobre mi solicitud, y leí la ') + `<a href="#privacy" onclick="openPrivacy()" style="color:var(--gold)">${t('Privacy Policy','Política de Privacidad')}</a>. ` + t('My information is never sold. I can withdraw consent at any time.','Mi información nunca se vende. Puedo retirar mi consentimiento en cualquier momento.')}</span></label>
      </form>`;
  }
  $('qbody').innerHTML = h;
  const f = $('qform');
  if (f) f.addEventListener('input', e => { const el = e.target; A[el.name] = el.type === 'checkbox' ? el.checked : el.value; });
  $('qback').style.visibility = qi === 0 ? 'hidden' : 'visible';
  $('qnext').disabled = !ready;
  $('qnext-label').textContent = id === 'contact' ? t('Book my session','Agendar mi sesión') : t('Continue','Continuar');
}
function pick(id, v){
  if (id === 'profile' && A.profile !== v) Object.keys(A).forEach(k => { if (/^(owner|pro|self|employee)_|^status$/.test(k)) delete A[k]; });
  if (id === 'owner_partners' && v === 'no' && A.owner_priority === 'buysell') delete A.owner_priority;
  if (id === 'pro_priority' && v !== 'retained') delete A.pro_retained;
  A[id] = v; renderQuiz();
  setTimeout(() => { if (steps()[qi] === id) quizNext(); }, 260);
}
function quizBack(){ if (qi > 0){ qi--; renderQuiz(); } }
function showCalendly(){
  const sep = CALENDLY_URL.includes('?') ? '&' : '?';
  const src = CALENDLY_URL + sep + 'embed_type=Inline&embed_domain=' + encodeURIComponent(location.hostname || 'localhost') +
    '&hide_gdpr_banner=1&name=' + encodeURIComponent(A.name || '') + '&email=' + encodeURIComponent(A.email || '');
  const direct = CALENDLY_URL + sep + 'name=' + encodeURIComponent(A.name || '') + '&email=' + encodeURIComponent(A.email || '');
  $('qnav').hidden = true; $('qbar').style.width = '100%';
  $('qbody').innerHTML = `<span class="badge">${t('You qualify','Calificas')}</span>
    <div class="q-title">${t('Pick a time for your private session','Elige el horario de tu sesión privada')}</div>
    <iframe src="${src}" title="${t('Book a session','Agendar sesión')}" style="width:100%;height:720px;border:0;border-radius:18px;background:#fff"></iframe>
    <p class="fine" style="margin-top:12px">${t('Calendar not loading?','¿No carga el calendario?')} <a href="${direct}" target="_blank" rel="noopener" style="color:var(--gold)">${t('Open it in a new tab','Ábrelo en una pestaña nueva')} →</a></p>`;
}
async function quizNext(){
  const S = steps();
  if (S[qi] !== 'contact'){ qi++; renderQuiz(); return; }
  const f = $('qform');
  if (!f.checkValidity()){ f.reportValidity(); return; }
  const asked = ASKS_STATUS.includes(A.profile);
  const qualifies = !asked || !NOT_QUALIFIED.includes(A.status);
  const data = {
    form:'booking', language:LANG, profile:label('profile'),
    years:label(A.profile + '_years'), partners:label('owner_partners'),
    priority:label(A.profile + '_priority'), retained_earnings:label('pro_retained'),
    status: asked ? label('status') : 'Not asked (incorporated)', qualifies: qualifies ? 'Yes' : 'No',
    province:label('province'), meeting_language:label('meeting'),
    name:A.name, email:A.email, phone:A.phone, consent: A.consent ? 'Yes' : 'No'
  };
  $('qnext').disabled = true; $('qnext-label').textContent = t('Sending…','Enviando…');
  await sendToSheet(data);
  if (qualifies) showCalendly();
  else { location.hash = 'playbook'; checkPlaybook(); }
}

/* ---------- Playbook page (#playbook) ---------- */
function checkPlaybook(){
  const on = location.hash === '#playbook';
  $('playbook').hidden = !on;
  if (on) setTimeout(() => $('playbook').scrollIntoView({behavior:'smooth'}), 50);
}
function openPrivacy(){ const d = $('privacy'); d.open = true; setTimeout(() => d.scrollIntoView({behavior:'smooth'}), 50); }
function closePlaybook(){ history.replaceState(null, '', location.pathname); $('playbook').hidden = true; }
addEventListener('hashchange', checkPlaybook);

/* ---------- Tax drag calculator ----------
   Monthly compounding with annual additions spread monthly.
   Taxed yearly:     growth rate = r × (1 − tax)
   Tax-advantaged:   growth rate = r                                         */
let MODE = 'corp';
const CV = {p0:250000, add:50000, yrs:20, ret:6, tax:50};
const CFG = {p0:{fmt:'money',min:0}, add:{fmt:'money',min:0}, yrs:{fmt:'int',min:1,max:60}, ret:{fmt:'pct',min:0,max:20}, tax:{fmt:'pct',min:0,max:60}};
function fmtVal(k, v){ const f = CFG[k].fmt; return f === 'money' ? money(v) : f === 'pct' ? (+v.toFixed(2)) + '%' : String(Math.round(v)); }
function setMode(m){
  MODE = m;
  $('m-corp').setAttribute('aria-pressed', m === 'corp'); $('m-pers').setAttribute('aria-pressed', m === 'pers');
  CV.tax = m === 'corp' ? 50 : 35; CV.p0 = m === 'corp' ? 250000 : 25000; CV.add = m === 'corp' ? 50000 : 6000;
  updateCalc();
}
const money = x => new Intl.NumberFormat('en-CA',{style:'currency',currency:'CAD',maximumFractionDigits:0}).format(x);
const short = v => v >= 1e6 ? '$' + (v/1e6).toFixed(v >= 1e7 ? 0 : 1) + 'M' : '$' + Math.round(v/1000) + 'K';
function grow(P0, add, rate, yrs){
  const r = rate / 12, m = add / 12, pts = [P0]; let b = P0;
  for (let i = 1; i <= yrs * 12; i++){ b = b * (1 + r) + m; if (i % 12 === 0) pts.push(b); }
  return pts;
}
function fill(el){ el.style.setProperty('--p', ((el.value - el.min) / (el.max - el.min) * 100) + '%'); }
function updateCalc(){
  const P0 = CV.p0, add = CV.add, Y = Math.round(CV.yrs), R = CV.ret / 100, T = CV.tax / 100;
  Object.keys(CV).forEach(k => {
    const sl = $('c-' + k); sl.value = Math.min(Math.max(CV[k], +sl.min), +sl.max); fill(sl);
    const box = $('o-' + k); if (document.activeElement !== box) box.value = fmtVal(k, CV[k]);
  });
  const taxed = grow(P0, add, R * (1 - T), Y), shel = grow(P0, add, R, Y);
  const a = taxed[Y], b = shel[Y], gap = b - a;
  $('r-tax').textContent = short(a); $('r-shel').textContent = short(b); $('r-gap').textContent = short(gap);
  $('calc-msg').innerHTML = t(
    `Over <strong>${Y} years</strong>, tax drag could cost you about <strong>${money(gap)}</strong> — that's <strong>${Math.round(gap / b * 100)}%</strong> of your potential wealth.`,
    `En <strong>${Y} años</strong>, los impuestos podrían costarte cerca de <strong>${money(gap)}</strong> — el <strong>${Math.round(gap / b * 100)}%</strong> de tu patrimonio potencial.`);
  drawChart(taxed, shel, Y);
  $('calc-results').value = `Mode ${MODE} | Today ${P0} | Yearly ${add} | Years ${Y} | Return ${R*100}% | Tax ${T*100}% | Taxed ${Math.round(a)} | Advantaged ${Math.round(b)} | Gap ${Math.round(gap)}`;
}
function drawChart(a, b, Y){
  const W = 600, H = 300, pl = 58, pr = 12, pt = 14, pb = 32, max = Math.max(...b) * 1.06 || 1;
  const x = i => pl + (W - pl - pr) * i / Y, y = v => H - pb - (H - pt - pb) * v / max;
  const path = arr => arr.map((v, i) => (i ? 'L' : 'M') + x(i).toFixed(1) + ',' + y(v).toFixed(1)).join('');
  let g = `<defs><linearGradient id="cg" x1="0" x2="1"><stop offset="0" stop-color="#A8842A"/><stop offset=".5" stop-color="#F1DC9A"/><stop offset="1" stop-color="#D4AF37"/></linearGradient>
    <linearGradient id="ca" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#D4AF37" stop-opacity=".28"/><stop offset="1" stop-color="#D4AF37" stop-opacity="0"/></linearGradient></defs>`;
  for (let k = 0; k <= 4; k++){
    const v = max * k / 4, yy = y(v);
    g += `<line x1="${pl}" x2="${W-pr}" y1="${yy}" y2="${yy}" stroke="rgba(255,255,255,.07)"/><text x="${pl-10}" y="${yy+4}" text-anchor="end" font-size="11" fill="#8B8C84" font-family="Manrope">${short(v)}</text>`;
  }
  const st = Y <= 10 ? 1 : 5;
  for (let i = 0; i <= Y; i += st) g += `<text x="${x(i)}" y="${H-10}" text-anchor="middle" font-size="11" fill="#8B8C84" font-family="Manrope">${i}</text>`;
  g += `<path d="${path(b)}L${x(Y)},${y(0)}L${x(0)},${y(0)}Z" fill="url(#ca)"/>`;
  g += `<path d="${path(a)}" fill="none" stroke="#17A673" stroke-width="2.5" stroke-dasharray="7 6"/>`;
  g += `<path d="${path(b)}" fill="none" stroke="url(#cg)" stroke-width="3.5"/>`;
  g += `<circle cx="${x(Y)}" cy="${y(b[Y])}" r="5" fill="#F1DC9A"/><circle cx="${x(Y)}" cy="${y(a[Y])}" r="4" fill="#17A673"/>`;
  $('chart').innerHTML = g;
}
Object.keys(CV).forEach(k => {
  $('c-' + k).addEventListener('input', e => { CV[k] = +e.target.value; updateCalc(); });
  const box = $('o-' + k);
  box.addEventListener('input', () => {
    const v = parseFloat(box.value.replace(/[^0-9.]/g, ''));
    if (isNaN(v)) return;
    const c = CFG[k]; CV[k] = Math.min(Math.max(v, c.min), c.max ?? Infinity); updateCalc();
  });
  box.addEventListener('focus', () => { box.value = String(+CV[k].toFixed(2)); box.select(); });
  box.addEventListener('blur', () => { box.value = fmtVal(k, CV[k]); });
});
function openCalcForm(){ $('calc-form').hidden = false; $('calc-form').querySelector('input').focus(); }

/* ---------- Forms ---------- */
document.querySelectorAll('form[data-form]').forEach(f => f.addEventListener('submit', async e => {
  e.preventDefault();
  if (!f.checkValidity()){ f.reportValidity(); return; }
  const data = Object.fromEntries(new FormData(f));
  Object.assign(data, {form: f.dataset.form, language: LANG});
  const btn = f.querySelector('button[type=submit]'); btn.disabled = true;
  try {
    await sendToSheet(data);
    f.querySelectorAll('label,.row,button[type=submit]').forEach(el => el.style.display = 'none');
    f.querySelector('.form-ok').style.display = 'block';
  } catch(_){ btn.disabled = false; alert(t('Something went wrong. Please try again.','Algo salió mal. Intenta de nuevo.')); }
}));


/* ---------- Hero chart: taxed vs tax-sheltered (hypothetical) ---------- */
const HV = {
  pers:{P0:0, add:6000, yrs:25, r:.05, tax:.35, en:'Example: $500 a month for 25 years, 5% return, 35% tax on yearly growth.', es:'Ejemplo: $500 al mes por 25 años, rendimiento de 5%, 35% de impuesto sobre el crecimiento anual.'},
  corp:{P0:250000, add:50000, yrs:20, r:.05, tax:.5, en:'Example: $250K corporate surplus + $50K a year for 20 years, 5% return, ~50% tax on passive growth.', es:'Ejemplo: $250K de excedente corporativo + $50K al año por 20 años, rendimiento de 5%, ~50% de impuesto pasivo.'}
};
let HVM = 'pers', hvTimer = null, hvRaf = null;
function hvDraw(){
  const c = HV[HVM], a = grow(c.P0, c.add, c.r * (1 - c.tax), c.yrs), b = grow(c.P0, c.add, c.r, c.yrs);
  $('hv-ex').textContent = LANG === 'es' ? c.es : c.en;
  document.querySelectorAll('.hv-mode button').forEach(x => x.setAttribute('aria-pressed', x.dataset.hv === HVM));
  const W = 520, H = 230, pl = 6, pr = 96, pt = 16, pb = 22, max = b[c.yrs] * 1.05;
  const x = i => pl + (W - pl - pr) * i / c.yrs, y = v => H - pb - (H - pt - pb) * v / max;
  const path = arr => arr.map((v, i) => (i ? 'L' : 'M') + x(i).toFixed(1) + ',' + y(v).toFixed(1)).join('');
  const ya = y(a[c.yrs]), yb = y(b[c.yrs]);
  const svg = $('hv-chart'); svg.classList.remove('go');
  svg.innerHTML = `<defs><linearGradient id="hvg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#D4AF37" stop-opacity=".3"/><stop offset="1" stop-color="#D4AF37" stop-opacity="0"/></linearGradient></defs>
    <line x1="${pl}" x2="${W-pr}" y1="${H-pb}" y2="${H-pb}" stroke="rgba(255,255,255,.12)"/>
    <text x="${pl}" y="${H-4}" font-size="11" fill="#8B8C84" font-family="Manrope">${t('Today','Hoy')}</text>
    <text x="${W-pr}" y="${H-4}" font-size="11" fill="#8B8C84" font-family="Manrope" text-anchor="end">${c.yrs} ${t('years','años')}</text>
        <path class="ln" pathLength="1" d="${path(a)}" stroke="#17A673" stroke-width="2.5" stroke-dasharray="1" />
    <path class="ln" pathLength="1" d="${path(b)}" stroke="#E6C766" stroke-width="3.5"/>
    <line class="lb" x1="${x(c.yrs)+8}" x2="${x(c.yrs)+8}" y1="${yb}" y2="${ya}" stroke="#D4AF37" stroke-dasharray="3 4"/>
    <text class="lb" x="${x(c.yrs)+16}" y="${(ya+yb)/2+4}" fill="#F1DC9A">+${short(b[c.yrs]-a[c.yrs])}</text>
    <circle class="lb" cx="${x(c.yrs)}" cy="${yb}" r="5" fill="#F1DC9A"/><circle class="lb" cx="${x(c.yrs)}" cy="${ya}" r="4" fill="#17A673"/>`;
  requestAnimationFrame(() => requestAnimationFrame(() => svg.classList.add('go')));
  cancelAnimationFrame(hvRaf); const t0 = performance.now();
  const step = now => { const p = Math.min((now - t0) / 1800, 1), e = 1 - Math.pow(1 - p, 3);
    $('hv-a').textContent = short(a[c.yrs] * e); $('hv-b').textContent = short(b[c.yrs] * e); $('hv-g').textContent = '+' + short((b[c.yrs] - a[c.yrs]) * e);
    if (p < 1) hvRaf = requestAnimationFrame(step); };
  hvRaf = requestAnimationFrame(step);
}
function hvAuto(){ clearInterval(hvTimer); hvTimer = setInterval(() => { HVM = HVM === 'pers' ? 'corp' : 'pers'; hvDraw(); }, 7000); }
document.querySelectorAll('.hv-mode button').forEach(bt => bt.addEventListener('click', () => { HVM = bt.dataset.hv; hvDraw(); clearInterval(hvTimer); }));
/* ---------- Init ---------- */
document.querySelectorAll('.year').forEach(e => e.textContent = new Date().getFullYear());
checkPlaybook();
let saved = 'en'; try { saved = localStorage.getItem('ve-lang') || 'en'; } catch(e){}
const qlang = new URLSearchParams(location.search).get('lang'); if (qlang === 'es' || qlang === 'en') saved = qlang;
setLang(saved);
hvDraw(); hvAuto();

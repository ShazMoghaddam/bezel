/*! Bezel v1.1.0 | MIT | github.com/ShazMoghaddam/bezel */
var Bezel=(()=>{var ft=Object.defineProperty;var re=Object.getOwnPropertyDescriptor;var ae=Object.getOwnPropertyNames;var oe=Object.prototype.hasOwnProperty;var L=(n,t)=>{for(var e in t)ft(n,e,{get:t[e],enumerable:!0})},ce=(n,t,e,i)=>{if(t&&typeof t=="object"||typeof t=="function")for(let s of ae(t))!oe.call(n,s)&&s!==e&&ft(n,s,{get:()=>t[s],enumerable:!(i=re(t,s))||i.enumerable});return n};var le=n=>ce(ft({},"__esModule",{value:!0}),n);var He={};L(He,{BezelCalendar:()=>Z,BezelClock:()=>W,BezelElement:()=>x,BezelGlance:()=>J,BezelPoster:()=>Q,BezelWeather:()=>X,calendar:()=>At,define:()=>F,ics:()=>It,safeLocale:()=>Ct,time:()=>kt,version:()=>Ge,weather:()=>Mt});var Bt=`
:host {
  --_font: var(--bezel-font, -apple-system, BlinkMacSystemFont, "SF Pro Display", "Geist", "Inter Display", "Segoe UI Variable Display", "Helvetica Neue", Roboto, Arial, sans-serif);
  --_rim-r: var(--bezel-radius, 22cqw);
  /* No metal rim: the black bezel is the outermost layer, so nothing light shows around it. */
  --_rim-pad: 0px;
  --_bezel-pad: var(--bezel-thickness, 1.7cqw);
  /* Extra inset for content when corners are rounder than the 22cqw the layouts were drawn for,
     so text near a corner never runs into the curve. Zero at the default radius and below. */
  --_safe: max(0cqw, calc((var(--_rim-r) - 22cqw) * 0.36));
  display: inline-block;
  position: relative;
  box-sizing: border-box;
  inline-size: var(--bezel-size, 320px);
  max-inline-size: 100%;
  aspect-ratio: var(--bezel-aspect, 1);
  vertical-align: top;
  container-type: inline-size;
  font-family: var(--_font);
  font-synthesis: none;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: geometricPrecision;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
  -webkit-user-select: none;
}
:host([hidden]) { display: none; }
*, *::before, *::after { box-sizing: border-box; }

.frame { position: absolute; inset: 0; }

/* Device: a thin black glass bezel of even width on every side, a camera dot and a lifted shadow.
   There is deliberately no light rim or highlight outside the black. */
.frame--device {
  border-radius: var(--_rim-r);
  box-shadow:
    0 0.2cqw 0.4cqw rgba(0,0,0,.10),
    0 1.6cqw 3.2cqw -0.6cqw rgba(0,0,0,.20),
    0 6cqw 10cqw -3cqw rgba(0,0,0,.30);
}
.bezel {
  position: relative;
  block-size: 100%;
  border-radius: calc(var(--_rim-r) - var(--_rim-pad));
  padding: var(--_bezel-pad);
  background: #050506;
}
.frame--device .bezel::before {
  content: "";
  position: absolute;
  inset-block-start: calc(var(--_bezel-pad) * 0.5);
  inset-inline-start: 50%;
  inline-size: calc(var(--_bezel-pad) * 0.42);
  aspect-ratio: 1;
  translate: -50% -50%;
  border-radius: 50%;
  z-index: 60;
  background: radial-gradient(circle at 35% 35%, #3c4a66 0%, #12151c 45%, #050608 75%);
  box-shadow: 0 0 0 0.12cqw #0c0d10;
}
.screen {
  position: relative;
  block-size: 100%;
  overflow: hidden;
  border-radius: calc(var(--_rim-r) - var(--_rim-pad) - var(--_bezel-pad));
  container-type: size;
  background: var(--_surface);
  color: var(--_ink);
  isolation: isolate;
}
.frame--device .screen::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  z-index: 50;
  background: linear-gradient(155deg, rgba(255,255,255,.10) 0%, rgba(255,255,255,0) 34%);
  box-shadow: inset 0 0 0 0.15cqw rgba(0,0,0,.2);
}

/* Bezel: black border, no rim. */
.frame--bezel .bezel {
  border-radius: var(--_rim-r);
  box-shadow: 0 1.2cqw 3cqw -1cqw rgba(0,0,0,.35);
}
.frame--bezel .screen { border-radius: calc(var(--_rim-r) - var(--_bezel-pad)); }

/* None: just the screen, for embedding inside your own UI. */
.frame--none .bezel { padding: 0; background: none; box-shadow: none; border-radius: var(--_rim-r); }
.frame--none .screen { border-radius: calc(var(--_rim-r) * 0.72); }

svg { display: block; overflow: visible; }
.num { font-variant-numeric: tabular-nums lining-nums; font-feature-settings: "tnum" 1, "lnum" 1; }
.sr { position: absolute; inline-size: 1px; block-size: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 0.001ms !important; animation-iteration-count: 1 !important; transition-duration: 0.001ms !important; }
}
`;function y(n){return String(n??"").replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}var A={frame:new Set,second:new Set,minute:new Set},S=0,z=0,gt=-1,wt=-1,O=typeof window<"u",Nt=O&&window.requestAnimationFrame?window.requestAnimationFrame.bind(window):null,Rt=O&&window.cancelAnimationFrame?window.cancelAnimationFrame.bind(window):null;function Ot(){return O&&typeof window.matchMedia=="function"?window.matchMedia("(prefers-reduced-motion: reduce)").matches:!1}function pt(n,t){for(let e of n)try{e(t)}catch(i){console.error("[bezel]",i)}}function Lt(){S=0,z=0;let n=Date.now();pt(A.frame,n);let t=Math.floor(n/1e3);if(t!==gt){gt=t,pt(A.second,n);let e=Math.floor(t/60);e!==wt&&(wt=e,pt(A.minute,n))}yt()}function yt(){if(S||z||!(A.frame.size+A.second.size+A.minute.size))return;let t=!O||typeof document>"u"||document.visibilityState!=="hidden";A.frame.size&&Nt&&t?S=Nt(Lt):z=setTimeout(Lt,1e3-Date.now()%1e3+2)}O&&typeof document<"u"&&document.addEventListener("visibilitychange",()=>{S&&Rt&&Rt(S),z&&clearTimeout(z),S=0,z=0,gt=-1,wt=-1,yt()});function jt(n,t){let e=A[n];if(!e)throw new Error(`[bezel] Unknown tick rate "${n}"`);return e.add(t),yt(),()=>e.delete(t)}var kt={};L(kt,{dayOfYear:()=>$t,daysInYear:()=>vt,formatClock:()=>H,handAngles:()=>E,isValidTimeZone:()=>j,isoWeek:()=>et,names:()=>C,parseWeekStart:()=>G,prefers12h:()=>xt,tzOffset:()=>tt,weekStartFor:()=>bt,zoned:()=>T,zonedToUtc:()=>D});var Gt=new Map,Ht=new Map,Wt=new Set;function Pt(n){let t=Ht.get(n);return t||(t=new Intl.DateTimeFormat("en-US",{timeZone:n,hourCycle:"h23",year:"numeric",month:"numeric",day:"numeric",hour:"numeric",minute:"numeric",second:"numeric"}),Ht.set(n,t)),t}function j(n){if(!n)return!1;try{return Pt(n),!0}catch{return!1}}function tt(n,t){if(!t)return-new Date(n).getTimezoneOffset()*6e4;let e=Math.floor(n/6e4),i=Gt.get(t);if(i&&i.minuteKey===e)return i.offset;let s;try{let r={};for(let{type:o,value:c}of Pt(t).formatToParts(new Date(n)))r[o]=c;s=Date.UTC(+r.year,+r.month-1,+r.day,+r.hour%24,+r.minute,+r.second)-Math.floor(n/1e3)*1e3}catch{Wt.has(t)||(Wt.add(t),console.warn(`[bezel] Unknown time zone "${t}", using the device time zone.`)),s=-new Date(n).getTimezoneOffset()*6e4}return Gt.set(t,{minuteKey:e,offset:s}),s}function T(n=Date.now(),t){let e=tt(n,t),i=new Date(n+e);return{ms:n,offset:e,year:i.getUTCFullYear(),month:i.getUTCMonth(),day:i.getUTCDate(),weekday:i.getUTCDay(),hours:i.getUTCHours(),minutes:i.getUTCMinutes(),seconds:i.getUTCSeconds(),millis:i.getUTCMilliseconds()}}function D(n,t,e,i=0,s=0,r=0,a){let o=Date.UTC(n,t,e,i,s,r);if(!a)return new Date(n,t,e,i,s,r).getTime();let c=o-tt(o,a);return o-tt(c,a)}function E(n,{smooth:t=!0}={}){let e=n.seconds+(t?n.millis/1e3:0),i=n.minutes+e/60;return{hour:(n.hours%12+i/60)*30,minute:i*6,second:e*6}}var Yt=new Map;function C(n="en-GB"){let t=Yt.get(n);if(t)return t;let e=r=>{try{return new Intl.DateTimeFormat(n,{timeZone:"UTC",...r})}catch{return new Intl.DateTimeFormat("en-GB",{timeZone:"UTC",...r})}},i=r=>Array.from({length:7},(a,o)=>e({weekday:r}).format(Date.UTC(1970,0,4+o))),s=r=>Array.from({length:12},(a,o)=>e({month:r}).format(Date.UTC(2001,o,15)));return t={weekdayShort:i("short"),weekdayNarrow:i("narrow"),weekdayLong:i("long"),monthShort:s("short"),monthLong:s("long")},Yt.set(n,t),t}var de=new Set(["US","CA","MX","BR","JP","KR","TW","HK","IL","PH","ZA","AU","IN","SA","AR","CO","PE","VE","GT","PA"]);function bt(n="en-GB"){try{let t=new Intl.Locale(n),e=typeof t.getWeekInfo=="function"?t.getWeekInfo():t.weekInfo;if(e&&e.firstDay)return e.firstDay%7;let i=t.maximize().region;return de.has(i)?0:1}catch{return 1}}function G(n,t){if(n==null||n==="")return bt(t);let e=String(n).trim().toLowerCase();return/^[0-6]$/.test(e)?Number(e):{su:0,mo:1,tu:2,we:3,th:4,fr:5,sa:6}[e.slice(0,2)]??bt(t)}function xt(n="en-GB"){try{let t=new Intl.DateTimeFormat(n,{hour:"numeric"}).resolvedOptions().hourCycle;return t==="h11"||t==="h12"}catch{return!1}}function H(n,t,e){let i=String(t).padStart(2,"0");return e?`${n%12||12}:${i}`:`${String(n).padStart(2,"0")}:${i}`}function et(n,t,e){let i=new Date(Date.UTC(n,t,e)),s=i.getUTCDay()||7;i.setUTCDate(i.getUTCDate()+4-s);let r=Date.UTC(i.getUTCFullYear(),0,1);return Math.ceil(((i-r)/864e5+1)/7)}function $t(n,t,e){return Math.round((Date.UTC(n,t,e)-Date.UTC(n,0,1))/864e5)+1}function vt(n){return n%4===0&&n%100!==0||n%400===0?366:365}var Ft=new Map;function Ct(n){if(!n)return"en-GB";if(Ft.has(n))return Ft.get(n);let t="en-GB";for(let e of[n,String(n).split(/[@.]/)[0].replace("_","-")])try{t=Intl.getCanonicalLocales(e)[0];break}catch{}return Ft.set(n,t),t}var ue=["frame","theme","night-theme","night-hours","timezone","locale","hour-cycle"],he=new Set(["device","bezel","none"]),x=class extends HTMLElement{static attributes=[];static styles="";static themes={};static defaultTheme="";static defaultFrame="device";static get observedAttributes(){return[...ue,...this.attributes]}#t=!1;#e=null;#n=null;#i=!0;#s=!1;#a="";#o=!1;constructor(){super(),this.attachShadow({mode:"open"})}connectedCallback(){this.#s=!0,this.hasAttribute("role")||this.setAttribute("role","img"),this.#o=this.hasAttribute("aria-label")&&this.dataset.bezelLabel===void 0,this.render(),this.#u(),this.#c(),this.connected?.()}disconnectedCallback(){this.#s=!1,this.#e?.(),this.#e=null,this.#n?.disconnect(),this.#n=null,this.disconnected?.()}attributeChangedCallback(t,e,i){e===i||!this.#s||(this.attributeChanged?.(t,e,i),this.invalidate())}invalidate(){this.#t||(this.#t=!0,queueMicrotask(()=>{this.#t=!1,this.#s&&(this.render(),this.#c())}))}get frame(){let t=this.getAttribute("frame");return he.has(t)?t:this.constructor.defaultFrame}get timeZone(){let t=this.getAttribute("timezone");return t&&j(t)?t:void 0}get locale(){return Ct(this.getAttribute("locale")||typeof navigator<"u"&&navigator.language)}get hour12(){let t=this.getAttribute("hour-cycle");return t==="12"?!0:t==="24"?!1:xt(this.locale)}get dayTheme(){let t=this.getAttribute("theme");return t&&this.constructor.themes[t]?t:this.constructor.defaultTheme}get themeName(){let t=this.getAttribute("night-theme");return t&&this.constructor.themes[t]&&this.isNight(this.now())?t:this.dayTheme}isNight(t){let e=/^(\d{1,2})\s*-\s*(\d{1,2})$/.exec(this.getAttribute("night-hours")??""),i=e?Math.min(Number(e[1]),23):19,s=e?Math.min(Number(e[2]),24):7;return i===s?!1:i>s?t.hours>=i||t.hours<s:t.hours>=i&&t.hours<s}flag(t){let e=this.getAttribute(t);return e!==null&&e!=="false"}now(){return T(Date.now(),this.timeZone)}get tickRate(){return"minute"}get reducedMotion(){return Ot()}themeCSS(){let t=this.constructor.themes[this.themeName]??{};return`:host { ${Object.entries(t).map(([i,s])=>`--_${i}: var(--bezel-${i}, ${s});`).join("")} }`}render(){let t=this.now();this.#a=this.#l(t);let e=this.frame;this.shadowRoot.innerHTML=`
      <style>${Bt}${this.themeCSS()}${this.constructor.styles}</style>
      <div class="frame frame--${e}" part="frame">
        <div class="bezel" part="bezel">
          <div class="screen" part="screen">${this.template(t)}</div>
        </div>
      </div>`,this.$=i=>this.shadowRoot.querySelector(i),this.$$=i=>this.shadowRoot.querySelectorAll(i),this.update(t,!0),this.#r(t)}template(){return""}update(){}describe(){return""}#r(t){let e=this.describe(t);!e||this.#o||this.getAttribute("aria-label")===e||(this.setAttribute("aria-label",e),this.dataset.bezelLabel="")}#d=t=>{let e=T(t,this.timeZone);if(this.#l(e)!==this.#a){this.render();return}this.update(e,!1),e.seconds===0&&e.millis<1e3&&this.#r(e)};#l(t){let e=this.hasAttribute("night-theme")?this.isNight(t)?"n":"d":"";return`${t.year}-${t.month}-${t.day}${e}`}#c(){this.#e?.(),this.#e=null;let t=this.tickRate;!t||!this.#i||(t==="frame"&&this.reducedMotion&&(t="second"),this.#e=jt(t,this.#d))}#u(){this.#n||typeof IntersectionObserver>"u"||(this.#n=new IntersectionObserver(t=>{let e=t.some(i=>i.isIntersecting);e!==this.#i&&(this.#i=e,e&&this.update(this.now(),!1),this.#c())}),this.#n.observe(this))}};function F(n,t){typeof customElements<"u"&&!customElements.get(n)&&customElements.define(n,t)}var me=["modern","lollipop"];function nt(n){return me.includes(n)?n:"modern"}var w=n=>Number(n.toFixed(3));function Zt(n,t,e,i,s){let r=t-e;return`M${w(n-i)} ${w(t)} L${w(n-s)} ${w(r)} A${w(s)} ${w(s)} 0 0 1 ${w(n+s)} ${w(r)} L${w(n+i)} ${w(t)} A${w(i)} ${w(i)} 0 0 1 ${w(n-i)} ${w(t)} Z`}function it({cx:n=50,cy:t=50,hour:e,minute:i,second:s,tail:r=7,weight:a=1,seconds:o=!0,classes:c={hour:"hour",minute:"minute",second:"second"},extra:u=""}){let d=m=>m*a,l=d(2.9),f=o?`<g class="${u} lp-sec ${c.second}">
        <line x1="${n}" y1="${w(t+r)}" x2="${n}" y2="${w(t-s+l*.6)}" stroke-width="${w(d(.6))}" />
        <circle cx="${n}" cy="${w(t-s)}" r="${w(l)}" />
      </g>`:"";return`
    <g class="${u} lp ${c.hour}"><path class="lp-arm" d="${Zt(n,t,e,d(1.35),d(.95))}" /></g>
    <g class="${u} lp ${c.minute}"><path class="lp-arm" d="${Zt(n,t,i,d(1.2),d(.72))}" /></g>
    ${f}
    <circle class="lp-pivot" cx="${n}" cy="${t}" r="${w(d(2.05))}" />
    <circle class="lp-pin" cx="${n}" cy="${t}" r="${w(d(.62))}" />`}var st=`
  .lp-arm, .lp-pivot { fill: var(--_hand); }
  .lp-sec line { stroke: var(--_accent); stroke-linecap: round; }
  .lp-sec circle { fill: var(--_accent); }
  .lp-pin { fill: color-mix(in srgb, var(--_hand), #000 88%); }
`;var fe=new Set(["numerals","relief","classic"]),pe=new Set(["western","roman","persian"]),ge={numerals:"sage",relief:"blush",classic:"porcelain"},we=["XII","I","II","III","IIII","V","VI","VII","VIII","IX","X","XI"],ye="\u06F0\u06F1\u06F2\u06F3\u06F4\u06F5\u06F6\u06F7\u06F8\u06F9";function rt(n,t="western"){return t==="roman"?we[n%12]:t==="persian"?String(n).replace(/\d/g,e=>ye[e]):String(n)}function Vt(n){return String(n??"").split("/").pop().replace(/_/g," ")}var h=50;function at({cls:n,stem:t,length:e,width:i,cx:s=h,cy:r=h}){return`<g class="hand ${n}">
    <line x1="${s}" y1="${r}" x2="${s}" y2="${r-t}" stroke-width="${Math.max(.5,i*.32)}" />
    <line x1="${s}" y1="${r-t}" x2="${s}" y2="${r-e}" stroke-width="${i}" />
  </g>`}function be(n,t){return`<g class="hand second">
    <line x1="${h}" y1="${h+t}" x2="${h}" y2="${h-n}" stroke-width="0.55" />
  </g>`}var xe=`
<defs>
  <filter id="lift" x="-30%" y="-30%" width="160%" height="160%" color-interpolation-filters="sRGB">
    <feDropShadow dx="0" dy="0.45" stdDeviation="0.55" flood-color="#000" flood-opacity="0.28" />
  </filter>
  <filter id="deboss" x="-20%" y="-20%" width="140%" height="140%" color-interpolation-filters="sRGB">
    <feFlood class="shade" result="shade" />
    <feComposite in="shade" in2="SourceAlpha" operator="out" result="outside" />
    <feOffset in="outside" dx="0.35" dy="0.45" result="shifted" />
    <feGaussianBlur in="shifted" stdDeviation="0.28" result="soft" />
    <feComposite in="soft" in2="SourceAlpha" operator="in" result="inner" />
    <feFlood class="glint" result="glint" />
    <feComposite in="glint" in2="SourceAlpha" operator="in" result="glyph" />
    <feOffset in="glyph" dx="0.28" dy="0.34" result="glintShift" />
    <feGaussianBlur in="glintShift" stdDeviation="0.12" result="glintSoft" />
    <feMerge>
      <feMergeNode in="glintSoft" />
      <feMergeNode in="SourceGraphic" />
      <feMergeNode in="inner" />
    </feMerge>
  </filter>
</defs>`,$e={western:{size:52,items:[[12,49,45.5],[9,19.5,68.5],[3,80.5,68.5],[6,50,95]]},roman:{size:37,items:[[12,50,41],[9,22,64.5],[3,78,64.5],[6,50,92]]},persian:{size:50,items:[[12,50,44],[9,20,69],[3,80,69],[6,50,95]]}},W=class n extends x{static attributes=["variant","numerals","hide-seconds","hide-date","sweep","second-timezone","second-label","hands"];static themes={sage:{surface:"#5C9268",ink:"#0A0C0A",hand:"#FFFFFF",accent:"#E3F4E6"},cobalt:{surface:"#2D4BD2",ink:"#F3F5FF",hand:"#FFFFFF",accent:"#FFD43B"},ember:{surface:"#E25A2C",ink:"#1A0E09",hand:"#FFF6EF",accent:"#FFF6EF"},graphite:{surface:"#121315",ink:"#F2F2F0",hand:"#F2F2F0",accent:"#FF6B35"},blush:{surface:"#E7C8C2",ink:"#5A2A26",hand:"#6E2B27",accent:"#E8409E"},stone:{surface:"#D9DADC",ink:"#2B2D31",hand:"#25272B",accent:"#FF5A1F"},midnight:{surface:"#1B1F27",ink:"#E9E3D6",hand:"#E9E3D6",accent:"#FFB547"},porcelain:{surface:"#F4F4F2",ink:"#17181A",hand:"#17181A",accent:"#FF5A1F"}};static styles=`
    .face { position: absolute; inset: 0; inline-size: 100%; block-size: 100%; }
    .hand line { stroke: var(--_hand); stroke-linecap: round; }
    .hand.second line { stroke: var(--_accent); }
    .hands { filter: url(#lift); }
    .hub { fill: var(--_hand); }
    .hub-ring { fill: none; stroke: var(--_accent); stroke-width: 0.55; }
    .hub-pin { fill: var(--_surface); }
    ${st}
    .numeral { font-family: var(--_font); fill: var(--_ink); font-variant-numeric: lining-nums proportional-nums; }
    .s-roman .numeral { letter-spacing: -0.02em; }

    /* numerals */
    .v-numerals .numeral { font-weight: var(--bezel-numeral-weight, 300); letter-spacing: -0.035em; }
    .v-numerals.s-roman .numeral { letter-spacing: -0.06em; }
    .corner-date { position: absolute; z-index: 0; inset-inline-start: calc(7cqw + var(--_safe)); inset-block-end: calc(6.4cqw + var(--_safe));
      font-weight: 650; font-size: 4.3cqw; line-height: 1; letter-spacing: 0.02em; color: var(--_ink); font-family: var(--_font); }

    /* relief */
    .v-relief .numeral { fill: color-mix(in srgb, var(--_surface), #000 5%); filter: url(#deboss); font-weight: 500; letter-spacing: -0.02em; transition: opacity .9s ease, font-size .9s ease; }
    .v-relief .shade { flood-color: color-mix(in srgb, var(--_surface), #000 55%); flood-opacity: .55; }
    .v-relief .glint { flood-color: color-mix(in srgb, var(--_surface), #fff 70%); flood-opacity: .9; }
    .v-relief .date { display: none; }

    /* classic */
    .tick { stroke: var(--_ink); stroke-linecap: round; }
    .tick.minor { stroke-width: 0.35; opacity: .45; }
    .tick.major { stroke-width: 0.9; }
    .v-classic .numeral { font-weight: 560; }
    .v-classic .date { font-weight: 650; fill: var(--_accent); font-size: 3.6px; letter-spacing: 0.08em; }
    .sub .plate { fill: color-mix(in srgb, var(--_surface), var(--_ink) 6%); stroke: color-mix(in srgb, var(--_ink), transparent 80%); stroke-width: 0.3; }
    .sub .t { stroke: var(--_ink); stroke-width: 0.4; stroke-linecap: round; opacity: .6; }
    .sub .hand line { stroke: var(--_ink); }
    .sub .pin { fill: var(--_accent); }
    .sub .city { font-family: var(--_font); font-size: 2.5px; font-weight: 650; letter-spacing: 0.1em; fill: var(--_ink); opacity: .75; }
    .sub .night { fill: color-mix(in srgb, var(--_ink), transparent 88%); }

    .screen { background:
      radial-gradient(120% 90% at 30% 10%, color-mix(in srgb, var(--_surface), #fff 7%) 0%, var(--_surface) 55%, color-mix(in srgb, var(--_surface), #000 8%) 100%); }
  `;#t=-1;#e=-1;get variant(){let t=this.getAttribute("variant");return fe.has(t)?t:"numerals"}get script(){let t=this.getAttribute("numerals");return pe.has(t)?t:"western"}get dayTheme(){let t=this.getAttribute("theme");return t&&n.themes[t]?t:ge[this.variant]}get secondZone(){let t=this.getAttribute("second-timezone");return this.variant==="classic"&&t&&j(t)?t:null}get hands(){return nt(this.getAttribute("hands"))}get showSeconds(){return!this.flag("hide-seconds")}get tickRate(){return this.showSeconds?this.getAttribute("sweep")==="tick"?"second":"frame":"second"}template(){let t=this.variant,e=this.script,i="";if(t==="numerals"){let{size:u,items:d}=$e[e];i=`
        <g class="numerals">${d.map(([l,f,m])=>`<text class="numeral" x="${f}" y="${m}" font-size="${u}" text-anchor="middle">${rt(l,e)}</text>`).join("")}</g>
`}else if(t==="relief")i=`<g class="ring">${Array.from({length:12},(u,d)=>{let l=d||12,f=d*30,m=f*Math.PI/180,g=(h+Math.sin(m)*35).toFixed(2),p=(h-Math.cos(m)*35).toFixed(2),v=f>90&&f<270?f-180:f,k=rt(l,e),_=e==="roman"?Math.min(1,2/Math.max(2,k.length))*.95:1;return`<text class="numeral" data-h="${l}" data-scale="${_.toFixed(3)}" text-anchor="middle" dominant-baseline="central" font-size="${(15*_).toFixed(2)}" transform="rotate(${v} ${g} ${p})" x="${g}" y="${p}">${k}</text>`}).join("")}</g>`;else{let u=Array.from({length:60},(g,p)=>{let v=p%5===0;return`<line class="tick ${v?"major":"minor"}" x1="${h}" y1="${h-(v?41:43)}" x2="${h}" y2="${h-45.2}" transform="rotate(${p*6} ${h} ${h})" />`}).join(""),d=e==="roman",l=this.secondZone,f=Array.from({length:12},(g,p)=>{let v=p+1;if(l&&v===6)return"";let k=v*30*Math.PI/180,_=d?32.5:33.5,R=rt(v,e),se=d?Math.min(7.4,15/Math.max(2,R.length)):8.2;return`<text class="numeral" x="${(h+Math.sin(k)*_).toFixed(2)}" y="${(h-Math.cos(k)*_).toFixed(2)}" font-size="${se.toFixed(2)}" text-anchor="middle" dominant-baseline="central">${R}</text>`}).join(""),m="";if(l){let g=h,p=68,v=Array.from({length:12},(_,R)=>`<line class="t" x1="${g}" y1="${p-7.6}" x2="${g}" y2="${p-(R%3===0?6.2:6.9)}" transform="rotate(${R*30} ${g} ${p})" />`).join(""),k=this.getAttribute("second-label")||Vt(l);m=`<g class="sub">
          <circle class="plate" cx="${g}" cy="${p}" r="8.6" />
          <path class="night" d="" />
          ${v}
          ${at({cls:"sub-hour",stem:1.4,length:4.4,width:1.1,cx:g,cy:p})}
          ${at({cls:"sub-minute",stem:1.4,length:6.6,width:1.1,cx:g,cy:p})}
          <circle class="pin" cx="${g}" cy="${p}" r="0.7" />
          <text class="city" x="${g}" y="${p+13.2}" text-anchor="middle">${y(k.toLocaleUpperCase(this.locale))}</text>
        </g>`}i=`${u}${f}${m}<text class="date" x="${h}" y="${l?h-15:h+16}" text-anchor="middle"></text>`}let s=t==="classic"?2.2:3.1,r=t==="classic",a=this.hands==="lollipop"?`<g class="hands">${it({hour:r?21:26,minute:r?33.5:39,second:r?31.5:37,tail:r?7:8,weight:r?1:1.12,seconds:this.showSeconds,extra:"hand"})}</g>`:`
      <g class="hands">
        ${at({cls:"hour",stem:6,length:t==="classic"?22:27,width:s})}
        ${at({cls:"minute",stem:6,length:t==="classic"?36:40,width:s})}
        ${this.showSeconds?be(t==="classic"?42:46,8):""}
        <circle class="hub" cx="${h}" cy="${h}" r="1.7" />
        ${this.showSeconds?`<circle class="hub-ring" cx="${h}" cy="${h}" r="1.15" />`:""}
        <circle class="hub-pin" cx="${h}" cy="${h}" r="0.55" />
      </g>`;return`${t==="numerals"?'<span class="date corner-date" aria-hidden="true"></span>':""}<svg class="face v-${t} s-${e}" viewBox="0 0 100 100" aria-hidden="true"${e==="persian"?' direction="ltr"':""}>${xe}${i}${a}</svg>`}update(t,e){let i=this.tickRate==="frame",s=E(t,{smooth:i});if(this.$(".hour")?.setAttribute("transform",`rotate(${s.hour.toFixed(3)} ${h} ${h})`),this.$(".minute")?.setAttribute("transform",`rotate(${s.minute.toFixed(3)} ${h} ${h})`),this.$(".second")?.setAttribute("transform",`rotate(${s.second.toFixed(3)} ${h} ${h})`),e||t.minutes!==this.#e){this.#e=t.minutes;let r=this.$(".date");if(r&&!this.flag("hide-date")){let o=C(this.locale).weekdayShort[t.weekday].replace(".","").toLocaleUpperCase(this.locale),c=this.script==="persian"?rt(t.day,"persian"):t.day;r.textContent=`${o} ${c}`}let a=this.secondZone;if(a){let o=E(T(t.ms,a),{smooth:!1});this.$(".sub-hour")?.setAttribute("transform",`rotate(${o.hour.toFixed(2)} ${h} 68)`),this.$(".sub-minute")?.setAttribute("transform",`rotate(${o.minute.toFixed(2)} ${h} 68)`)}}this.variant==="relief"&&(e||t.seconds!==this.#t)&&(this.#t=t.seconds,this.#n(s.minute))}#n(t){let e=t/30;for(let i of this.$$(".numeral")){let s=Number(i.dataset.h)%12,r=Number(i.dataset.scale)||1,a=Math.abs(s-e);a=Math.min(a,12-a);let o=Math.min(1,Math.max(0,(a-1.2)/2.6)),c=o*o*(3-2*o);i.style.opacity=(1-c).toFixed(3),i.setAttribute("font-size",((16.5-c*5)*r).toFixed(2))}}describe(t){let e=r=>new Intl.DateTimeFormat(this.locale,{hour:"numeric",minute:"2-digit",hour12:this.hour12,timeZone:r}).format(t.ms),i=this.secondZone,s=i?`, ${e(i)} in ${this.getAttribute("second-label")||Vt(i)}`:"";return`Clock showing ${e(this.timeZone)}${s}`}};F("bezel-clock",W);var At={};L(At,{daysInMonth:()=>Kt,monthGrid:()=>Y,parseMonth:()=>q,weekdayOrder:()=>P});function Kt(n,t){return new Date(Date.UTC(n,t+1,0)).getUTCDate()}function Y(n,t,{weekStart:e=1,fixedRows:i=!1,fillAdjacent:s=!0}={}){let a=(new Date(Date.UTC(n,t,1)).getUTCDay()-e+7)%7,o=Kt(n,t),c=i?6:Math.ceil((a+o)/7),u=[];for(let d=0;d<c;d++){let l=[];for(let f=0;f<7;f++){let m=d*7+f-a,g=new Date(Date.UTC(n,t,1+m)),p=m>=0&&m<o;l.push(p||s?{year:g.getUTCFullYear(),month:g.getUTCMonth(),day:g.getUTCDate(),inMonth:p}:null)}u.push(l)}return u}function P(n=1){return Array.from({length:7},(t,e)=>(n+e)%7)}function q(n){let t=/^(\d{4})-(\d{1,2})$/.exec(String(n??"").trim());if(!t)return null;let e=Number(t[2])-1;return e<0||e>11?null:{year:Number(t[1]),month:e}}var Z=class extends x{static attributes=["week-start","month","hide-time","hide-backdrop"];static defaultTheme="snow";static themes={snow:{surface:"#FBFBFD",ink:"#1F3E8C",accent:"#E5484D",today:"#121A33",muted:"#B9C0D2"},ink:{surface:"#101216",ink:"#E8ECF4",accent:"#FF5F57",today:"#FFFFFF",muted:"#4A5160"},sorbet:{surface:"#FFE8D6",ink:"#5B2A86",accent:"#FF7A45",today:"#2A1240",muted:"#D9B8C4"},forest:{surface:"#E7EFE6",ink:"#21412F",accent:"#2F9E5B",today:"#0F2419",muted:"#A9BCAD"}};static styles=`
    .cal {
      position: absolute; inset: 0;
      display: grid;
      grid-template-rows: auto auto 1fr;
      padding: calc(8.5cqw + var(--_safe)) calc(7.5cqw + var(--_safe)) calc(7cqw + var(--_safe));
      gap: 2.6cqw;
    }
    .head { display: flex; justify-content: space-between; align-items: baseline; font-size: 6.4cqw; font-weight: 640; letter-spacing: -0.01em; color: var(--_accent); position: relative; z-index: 1; }
    .time { font-variant-numeric: tabular-nums; }
    .row { display: grid; grid-template-columns: repeat(7, 1fr); text-align: center; position: relative; z-index: 1; }
    .dow { font-size: 5.4cqw; font-weight: 680; color: var(--_ink); }
    .dow .wkend { color: var(--_ink); }
    .grid { display: grid; grid-template-rows: repeat(6, 1fr); align-items: center; position: relative; z-index: 1; }
    .d { display: grid; place-items: center; font-size: 5.7cqw; font-weight: 640; color: var(--_ink); font-variant-numeric: tabular-nums; }
    .d span { display: grid; place-items: center; inline-size: 9.4cqw; aspect-ratio: 1; border-radius: 50%; }
    .d.out { color: var(--_muted); }
    .d.today span { background: var(--_today); color: var(--_surface); box-shadow: 0 0.6cqw 1.6cqw -0.4cqw color-mix(in srgb, var(--_today), transparent 40%); }
    .backdrop {
      position: absolute; inset: 0; z-index: 0;
      display: grid; place-items: center;
      padding-block-start: 12cqh;
      font-size: var(--bd-size, 82cqh); line-height: 1; font-weight: 760; letter-spacing: -0.07em;
      color: var(--_accent);
      opacity: var(--bd-opacity, .2);
      font-variant-numeric: lining-nums;
      -webkit-mask-image: linear-gradient(180deg, #000 40%, rgba(0,0,0,.35) 78%, transparent 100%);
              mask-image: linear-gradient(180deg, #000 40%, rgba(0,0,0,.35) 78%, transparent 100%);
    }
  `;get tickRate(){return this.flag("hide-time")?"minute":"second"}template(t){let e=q(this.getAttribute("month")),i=e?.year??t.year,s=e?.month??t.month,r=G(this.getAttribute("week-start"),this.locale),a=C(this.locale),o=i===t.year&&s===t.month,c=P(r).map(l=>`<div class="dow">${y(a.weekdayNarrow[l])}</div>`).join(""),u=Y(i,s,{weekStart:r,fixedRows:!0}).map(l=>l.map(f=>{let m=f.inMonth&&o&&f.day===t.day;return`<div class="d${f.inMonth?"":" out"}${m?" today":""}"><span>${f.day}</span></div>`}).join("")).map(l=>`<div class="row">${l}</div>`).join(""),d=new Intl.DateTimeFormat(this.locale,{month:"long",year:"numeric",timeZone:"UTC"}).format(Date.UTC(i,s,15));return`
      ${this.flag("hide-backdrop")||!o?"":`<div class="backdrop" aria-hidden="true"${t.day>9?' style="--bd-size:66cqw;--bd-opacity:.16"':""}>${t.day}</div>`}
      <div class="cal" aria-hidden="true">
        <div class="head"><span>${y(d)}</span>${this.flag("hide-time")?"":'<span class="time"></span>'}</div>
        <div class="row">${c}</div>
        <div class="grid">${u}</div>
      </div>`}update(t){let e=this.$(".time");if(e){let i=H(t.hours,t.minutes,this.hour12);e.textContent!==i&&(e.textContent=i)}}describe(t){return`Calendar. Today is ${new Intl.DateTimeFormat(this.locale,{dateStyle:"full",timeZone:"UTC"}).format(Date.UTC(t.year,t.month,t.day))}`}};F("bezel-calendar",Z);var $=(n,t="")=>`<svg class="icon ${t}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${n}</svg>`,ve='<circle cx="12" cy="12" r="4.2"/>',ke=[0,45,90,135,180,225,270,315].map(n=>`<line x1="12" y1="2.6" x2="12" y2="4.6" transform="rotate(${n} 12 12)"/>`).join(""),V="M7.2 18.5h9.6a3.9 3.9 0 0 0 .5-7.77A5.4 5.4 0 0 0 6.9 10.2 4.2 4.2 0 0 0 7.2 18.5Z",Fe="M8.4 19h8.2a3.3 3.3 0 0 0 .4-6.58 4.6 4.6 0 0 0-8.9-1.1A3.85 3.85 0 0 0 8.4 19Z",b={sun:()=>$(ve+ke),moon:()=>$('<path d="M19.2 14.6A7.6 7.6 0 0 1 9.4 4.8a7.6 7.6 0 1 0 9.8 9.8Z"/>'),partly:(n=!0)=>$((n?'<circle cx="8.6" cy="8.4" r="3.2"/><line x1="8.6" y1="2.4" x2="8.6" y2="3.4"/><line x1="2.6" y1="8.4" x2="3.6" y2="8.4"/><line x1="4.4" y1="4.2" x2="5.1" y2="4.9"/><line x1="12.8" y1="4.2" x2="12.1" y2="4.9"/>':'<path d="M11.6 9.6A4.4 4.4 0 0 1 6 4a4.4 4.4 0 1 0 5.6 5.6Z"/>')+`<path d="${Fe}"/>`),cloudy:()=>$(`<path d="${V}"/>`),fog:()=>$('<line x1="4" y1="9" x2="20" y2="9"/><line x1="6" y1="13" x2="18" y2="13"/><line x1="4" y1="17" x2="20" y2="17"/>'),drizzle:()=>$(`<path d="${V}" transform="translate(0 -3)"/><line x1="9" y1="19" x2="8.5" y2="20.5"/><line x1="15" y1="19" x2="14.5" y2="20.5"/>`),rain:()=>$(`<path d="${V}" transform="translate(0 -3)"/><line x1="8" y1="18.5" x2="7" y2="21"/><line x1="12" y1="18.5" x2="11" y2="21"/><line x1="16" y1="18.5" x2="15" y2="21"/>`),snow:()=>$(`<path d="${V}" transform="translate(0 -3)"/><circle cx="8" cy="19.6" r=".5" fill="currentColor"/><circle cx="12" cy="20.6" r=".5" fill="currentColor"/><circle cx="16" cy="19.6" r=".5" fill="currentColor"/>`),storm:()=>$(`<path d="${V}" transform="translate(0 -3)"/><path d="M12.6 15.4 10.6 18.6h3l-2 3"/>`),sunrise:()=>$('<path d="M6.5 16a5.5 5.5 0 0 1 11 0"/><line x1="3" y1="19" x2="21" y2="19"/><path d="M12 3v6M9.5 5.5 12 3l2.5 2.5"/><line x1="4.2" y1="11.2" x2="5.4" y2="12"/><line x1="19.8" y1="11.2" x2="18.6" y2="12"/>'),sunset:()=>$('<path d="M6.5 16a5.5 5.5 0 0 1 11 0"/><line x1="3" y1="19" x2="21" y2="19"/><path d="M12 3v6M9.5 6.5 12 9l2.5-2.5"/><line x1="4.2" y1="11.2" x2="5.4" y2="12"/><line x1="19.8" y1="11.2" x2="18.6" y2="12"/>'),wind:()=>$('<path d="M3 9h11.5a2.5 2.5 0 1 0-2.5-2.5"/><path d="M3 13h15.5a2.5 2.5 0 1 1-2.5 2.5"/><path d="M3 17h7"/>'),humidity:()=>$('<path d="M12 3.2s-6 6.6-6 10.8a6 6 0 0 0 12 0c0-4.2-6-10.8-6-10.8Z"/><path d="M9.2 14.6a2.9 2.9 0 0 0 2.4 2.6"/>'),air:()=>$([[6,7],[12,7],[18,7],[9,12],[15,12],[6,17],[12,17],[18,17]].map(([n,t])=>`<circle cx="${n}" cy="${t}" r="1.15" fill="currentColor" stroke="none"/>`).join("")),arrow:()=>'<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 3.5 3.8 10.6l7.4 2.2 2.2 7.4Z" fill="currentColor"/></svg>'};function ot(n,t=!0){switch(n){case"clear":return t?b.sun():b.moon();case"partly":return b.partly(t);case"fog":return b.fog();case"drizzle":return b.drizzle();case"rain":return b.rain();case"snow":return b.snow();case"storm":return b.storm();default:return b.cloudy()}}var Mt={};L(Mt,{DEFAULT_PLACE:()=>dt,_resetWeatherCache:()=>Te,aqiBand:()=>St,defaultUnits:()=>_t,describeCode:()=>Xt,geocode:()=>Qt,getWeather:()=>lt,isoClock:()=>qt,nextSunEvent:()=>Et,normalise:()=>Jt,resolveAndFetch:()=>Tt,sampleWeather:()=>zt});var Ce="https://api.open-meteo.com/v1/forecast",Ae="https://air-quality-api.open-meteo.com/v1/air-quality",De="https://geocoding-api.open-meteo.com/v1/search",dt={name:"London",latitude:51.5072,longitude:-.1276},_e=15*6e4,ct=new Map,K=new Map,Se={0:["Clear","clear"],1:["Mostly Clear","clear"],2:["Partly Cloudy","partly"],3:["Overcast","cloudy"],45:["Fog","fog"],48:["Freezing Fog","fog"],51:["Light Drizzle","drizzle"],53:["Drizzle","drizzle"],55:["Heavy Drizzle","drizzle"],56:["Freezing Drizzle","drizzle"],57:["Freezing Drizzle","drizzle"],61:["Light Rain","rain"],63:["Rain","rain"],65:["Heavy Rain","rain"],66:["Freezing Rain","rain"],67:["Freezing Rain","rain"],71:["Light Snow","snow"],73:["Snow","snow"],75:["Heavy Snow","snow"],77:["Snow Grains","snow"],80:["Showers","rain"],81:["Showers","rain"],82:["Heavy Showers","rain"],85:["Snow Showers","snow"],86:["Snow Showers","snow"],95:["Thunderstorm","storm"],96:["Thunderstorm","storm"],99:["Thunderstorm","storm"]};function Xt(n){let[t,e]=Se[n]??["Unknown","cloudy"];return{label:t,sky:e}}var ze=new Set(["US","LR","MM","BS","BZ","KY","PW","FM","MH"]);function _t(n="en-GB"){try{let t=new Intl.Locale(n).maximize().region;return ze.has(t)?"imperial":"metric"}catch{return"metric"}}function St(n,t="eu"){return n==null||Number.isNaN(n)?"":(t==="us"?[[50,"Good"],[100,"Moderate"],[150,"Unhealthy for some"],[200,"Unhealthy"],[300,"Very unhealthy"],[1/0,"Hazardous"]]:[[20,"Good"],[40,"Fair"],[60,"Moderate"],[80,"Poor"],[100,"Very poor"],[1/0,"Extremely poor"]]).find(([i])=>n<=i)[1]}function Jt(n,t,{units:e="metric",place:i=""}={}){let s=n.current??{},r=n.daily??{},{label:a,sky:o}=Xt(s.weather_code),c=e==="imperial"?"us":"eu",u=t?.current?t.current[c==="us"?"us_aqi":"european_aqi"]:null;return{sample:!1,place:i,units:e,time:s.time??null,temperature:s.temperature_2m,apparent:s.apparent_temperature??null,humidity:s.relative_humidity_2m,wind:s.wind_speed_10m,windDirection:s.wind_direction_10m??null,code:s.weather_code,condition:a,sky:o,isDay:s.is_day!==0,high:r.temperature_2m_max?.[0],low:r.temperature_2m_min?.[0],sunrise:r.sunrise??[],sunset:r.sunset??[],aqi:u==null?null:Math.round(u),aqiScale:c,utcOffsetSeconds:n.utc_offset_seconds??0,timezone:n.timezone??null}}function zt({units:n="metric",place:t=dt.name}={}){let e=r=>n==="imperial"?Math.round(r*1.8+32):r,i=new Date,s=(r,a)=>`${i.getFullYear()}-${String(i.getMonth()+1).padStart(2,"0")}-${String(i.getDate()).padStart(2,"0")}T${String(r).padStart(2,"0")}:${String(a).padStart(2,"0")}`;return{sample:!0,place:t,units:n,time:null,temperature:e(14),apparent:e(12),humidity:76,wind:n==="imperial"?7:11,windDirection:240,code:2,condition:"Partly Cloudy",sky:"partly",isDay:!0,high:e(16),low:e(9),sunrise:[s(7,31)],sunset:[s(17,52)],aqi:n==="imperial"?21:18,aqiScale:n==="imperial"?"us":"eu",utcOffsetSeconds:0,timezone:null}}async function Dt(n,t){let e=await fetch(n,{signal:t});if(!e.ok)throw new Error(`HTTP ${e.status}`);return e.json()}function Qt(n){let t=n.trim().toLowerCase();if(!K.has(t)){let e=`${De}?name=${encodeURIComponent(n.trim())}&count=1&format=json`;K.set(t,Dt(e).then(i=>{let s=i.results?.[0];if(!s)throw new Error(`No place called "${n}"`);return{name:s.name,latitude:s.latitude,longitude:s.longitude,timezone:s.timezone}}).catch(i=>{throw K.delete(t),i}))}return K.get(t)}function lt({latitude:n,longitude:t,units:e="metric",place:i=""}){let s=`${n.toFixed(3)},${t.toFixed(3)},${e}`,r=ct.get(s);if(r&&Date.now()-r.at<_e)return r.promise;let a=e==="imperial",o=new URLSearchParams({latitude:String(n),longitude:String(t),current:"temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m,wind_direction_10m,is_day",daily:"temperature_2m_max,temperature_2m_min,sunrise,sunset",timezone:"auto",forecast_days:"2",temperature_unit:a?"fahrenheit":"celsius",wind_speed_unit:a?"mph":"kmh"}),c=new URLSearchParams({latitude:String(n),longitude:String(t),current:"european_aqi,us_aqi"}),u=Promise.all([Dt(`${Ce}?${o}`),Dt(`${Ae}?${c}`).catch(()=>null)]).then(([d,l])=>Jt(d,l,{units:e,place:i})).catch(d=>(ct.delete(s),console.warn(`[bezel] Weather unavailable (${d.message}). Showing sample data.`),zt({units:e,place:i})));return ct.set(s,{at:Date.now(),promise:u}),u}async function Tt({latitude:n,longitude:t,location:e,units:i}){let s=parseFloat(n),r=parseFloat(t);if(Number.isFinite(s)&&Number.isFinite(r))return lt({latitude:s,longitude:r,units:i,place:e||""});if(e)try{let a=await Qt(e);return lt({latitude:a.latitude,longitude:a.longitude,units:i,place:a.name})}catch(a){return console.warn(`[bezel] ${a.message}. Showing sample data.`),zt({units:i,place:e})}return lt({...dt,units:i,place:dt.name})}function Et(n,t){let e=t??n.time??"",i=[...n.sunrise.map(s=>({kind:"sunrise",time:s})),...n.sunset.map(s=>({kind:"sunset",time:s}))].sort((s,r)=>s.time.localeCompare(r.time));return i.find(s=>s.time>e)??i.find(s=>s.kind==="sunset")??null}function qt(n,t){let e=/T(\d{2}):(\d{2})/.exec(n??"");if(!e)return"--:--";let i=Number(e[1]);return t?`${i%12||12}:${e[2]}`:`${e[1]}:${e[2]}`}function Te(){ct.clear(),K.clear()}var U=["latitude","longitude","location","units","refresh"],M=class{data=null;#t;#e=0;#n=0;#i=!1;constructor(t){this.#t=t}get units(){let t=this.#t.getAttribute("units");return t==="imperial"||t==="metric"?t:_t(this.#t.locale)}start(){this.#i||this.load()}stop(){clearTimeout(this.#e),this.#e=0}set(t){this.#i=t!=null,this.stop(),this.data=t,this.#t.invalidate()}async load(){this.stop();let t=++this.#n,e=this.#t,i=await Tt({latitude:e.getAttribute("latitude"),longitude:e.getAttribute("longitude"),location:e.getAttribute("location"),units:this.units});if(t!==this.#n||this.#i)return;this.data=i,e.invalidate(),e.dispatchEvent(new CustomEvent("bezel-weather",{detail:i,bubbles:!0,composed:!0}));let s=Math.max(5,parseFloat(e.getAttribute("refresh"))||15);this.#e=setTimeout(()=>this.load(),i.sample?6e4:s*6e4)}};var te={"clear-day":["#1F6FCF","#4F9BE6","#A9D3F5"],"clear-night":["#070D22","#14224A","#2B3F73"],"partly-day":["#3779C8","#6EA6DF","#B8D6F0"],"partly-night":["#0E1630","#1E2C52","#37466E"],"cloudy-day":["#5D7186","#8A9CAE","#B9C5D0"],"cloudy-night":["#141A24","#262F3D","#3C4657"],"fog-day":["#7F8A95","#A6AFB7","#CDD2D6"],"fog-night":["#1C2129","#323843","#4A515C"],"drizzle-day":["#4C6175","#72879B","#9AAABA"],"drizzle-night":["#121922","#222D3A","#344152"],"rain-day":["#3E5166","#5E7389","#8597A9"],"rain-night":["#0D131B","#1C2633","#2C3848"],"snow-day":["#7E93AA","#AEBFCF","#DCE5ED"],"snow-night":["#1D2636","#36435A","#56647C"],"storm-day":["#262B38","#3E4456","#5B6276"],"storm-night":["#0B0D13","#1A1E29","#2C3141"]},Ee={clear:0,partly:3,cloudy:6,fog:0,drizzle:6,rain:6,snow:5,storm:6},qe=[[56,25,48,.96,52],[-18,10,58,.7,64],[26,48,52,.5,58],[62,58,50,.46,72],[-12,66,58,.4,60],[32,78,62,.32,80]],ut={day:["#FFFFFF","#D9E3EF"],grey:["#F1F4F8","#B4BFCC"],storm:["#C6CDD8","#7C8695"],night:["#8A96AC","#4A566C"]},ee=n=>Number(n.toFixed(2));function Me([n,t,e,i,s],r,a){let o=e/48,c='<circle cx="13" cy="14" r="8"/><circle cx="23" cy="9.5" r="10"/><circle cx="34" cy="12" r="8.5"/><circle cx="41.5" cy="15.5" r="6"/><ellipse cx="25" cy="17" rx="19" ry="5"/>';return`<g class="drift" style="--d:${s}s;--delay:${-r*7}s"><g transform="translate(${n} ${t}) scale(${ee(o)})" opacity="${ee(i*(a?.6:1))}">
      <g class="cloud-shade" transform="translate(0.8 1.6)">${c}</g>
      <g class="cloud-body">${c}</g>
    </g></g>`}var Ue=[[12,18,.35],[28,9,.28],[47,22,.32],[66,12,.26],[84,26,.36],[74,40,.24],[18,44,.3],[92,8,.24],[38,34,.22],[57,5,.3],[6,30,.22],[90,46,.2]];function Ie(n,t){let e=t?n==="storm"?ut.storm:n==="rain"||n==="drizzle"||n==="snow"?ut.grey:ut.day:ut.night,i=`<defs>
      <mask id="moon-cut" maskUnits="userSpaceOnUse" x="0" y="0" width="100" height="100"><rect width="100" height="100" fill="#fff"/><circle cx="80.4" cy="29.4" r="5.9" fill="#000"/></mask>
      <linearGradient id="cloud-fill" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="22"><stop offset="0" stop-color="${e[0]}"/><stop offset="1" stop-color="${e[1]}"/></linearGradient>
      <radialGradient id="sun-disc" cx=".4" cy=".38" r=".7"><stop offset="0" stop-color="#FFFDF2"/><stop offset=".55" stop-color="#FFEFB0"/><stop offset="1" stop-color="#FFD966"/></radialGradient>
      <radialGradient id="sun-halo"><stop offset="0" stop-color="#FFF4CC" stop-opacity=".75"/><stop offset=".35" stop-color="#FFE7A3" stop-opacity=".28"/><stop offset="1" stop-color="#FFE7A3" stop-opacity="0"/></radialGradient>
      <radialGradient id="moon-halo"><stop offset="0" stop-color="#E8ECF8" stop-opacity=".35"/><stop offset="1" stop-color="#E8ECF8" stop-opacity="0"/></radialGradient>
      <radialGradient id="fog-fill"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset=".6" stop-color="#fff" stop-opacity=".22"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
      <pattern id="rain-p" patternUnits="userSpaceOnUse" width="11" height="16"><g stroke="#fff" stroke-opacity=".55" stroke-width=".3" stroke-linecap="round"><line x1="2.4" y1="0.5" x2="1.7" y2="4"/><line x1="8.2" y1="8.6" x2="7.5" y2="12.1"/><line x1="5.3" y1="12.4" x2="4.9" y2="14.4"/></g></pattern>
      <pattern id="snow-p" patternUnits="userSpaceOnUse" width="24" height="24"><g fill="#fff" fill-opacity=".92"><circle cx="3" cy="4" r=".75"/><circle cx="14" cy="2" r=".5"/><circle cx="20" cy="11" r=".8"/><circle cx="8" cy="15" r=".55"/><circle cx="17" cy="20" r=".65"/><circle cx="2" cy="22" r=".45"/></g></pattern>
    </defs>`,s=[];t&&(n==="clear"||n==="partly")&&s.push(`<g class="sun"${n==="partly"?' opacity=".85"':""}><circle class="glow" cx="77" cy="32" r="34" fill="url(#sun-halo)"/><circle cx="77" cy="32" r="9.5" fill="url(#sun-disc)"/></g>`),!t&&(n==="clear"||n==="partly")&&(s.push(`<g class="stars">${Ue.map(([a,o,c],u)=>`<circle cx="${a}" cy="${o}" r="${c}" style="--delay:${-u*.7}s"/>`).join("")}</g>`),s.push('<g class="moon"><circle cx="77" cy="32" r="20" fill="url(#moon-halo)"/><circle cx="77" cy="32" r="6.5" fill="#EEF1F8" mask="url(#moon-cut)"/></g>'));let r=Ee[n]??3;return r&&s.push(`<g class="clouds">${qe.slice(0,r).map((a,o)=>Me(a,o,!t)).join("")}</g>`),n==="fog"&&s.push(`<g class="fog">${[22,50,74].map((a,o)=>`<g class="drift" style="--d:40s;--delay:${-o*12}s"><ellipse cx="${[40,62,36][o]}" cy="${a}" rx="78" ry="9" fill="url(#fog-fill)"/></g>`).join("")}</g>`),(n==="drizzle"||n==="rain"||n==="storm")&&s.push(`<g class="rain${n==="drizzle"?" light":""}"><rect class="fall" x="-20" y="-30" width="140" height="160" fill="url(#rain-p)"/></g>`),n==="snow"&&s.push('<g class="snowfall"><rect class="fall" x="-20" y="-40" width="140" height="180" fill="url(#snow-p)"/><rect class="fall slow" x="-20" y="-40" width="140" height="180" fill="url(#snow-p)" transform="translate(9 5) scale(1.4)" opacity=".55"/></g>'),`<svg class="art" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${i}${s.join("")}</svg>`}var X=class extends x{static attributes=[...U,"hide-time","still"];static defaultTheme="sky";static themes={sky:{surface:"#4F9BE6",ink:"#FFFFFF",accent:"#FFFFFF"}};static styles=`
    .sky { position: absolute; inset: 0; overflow: hidden; pointer-events: none; background: linear-gradient(180deg, var(--s0) 0%, var(--s1) 55%, var(--s2) 100%); }
    .tint { position: absolute; inset: 0; z-index: 1; background: var(--bezel-tint, transparent); mix-blend-mode: color; }
    .shim { display: block; border-radius: 1cqw; background: linear-gradient(100deg, rgba(255,255,255,.14) 30%, rgba(255,255,255,.38) 50%, rgba(255,255,255,.14) 70%) 0 0 / 300% 100%; animation: shimmer 1.6s ease-in-out infinite; }
    .shim.t { inline-size: 46cqw; block-size: 30cqw; border-radius: 3cqw; }
    .shim.l { inline-size: 26cqw; block-size: 3.6cqw; }
    .shim.s { inline-size: 12cqw; block-size: 3.6cqw; }
    .stat .shim.i { inline-size: 6.4cqw; block-size: 6.4cqw; border-radius: 50%; }
    @keyframes shimmer { from { background-position: 100% 0; } to { background-position: -100% 0; } }
    .sky::after { content: ""; position: absolute; inset: 0; z-index: 2;
      background: linear-gradient(180deg, rgba(8,20,40,.30) 0%, rgba(8,20,40,.08) 30%, rgba(8,20,40,0) 52%, rgba(8,20,40,0) 70%, rgba(8,20,40,.18) 100%); }
    .art { position: absolute; inset: 0; inline-size: 100%; block-size: 100%; }
    .cloud-body * { fill: url(#cloud-fill); }
    .cloud-shade * { fill: rgba(15, 35, 70, .12); }
    .drift { animation: art-drift var(--d) ease-in-out var(--delay) infinite alternate; }
    .sun .glow { transform-origin: 77px 32px; animation: art-glow 7s ease-in-out infinite alternate; }
    .stars circle { fill: #fff; animation: art-twinkle 5s ease-in-out var(--delay) infinite alternate; }
    .rain .fall { animation: art-rain .55s linear infinite; }
    .rain.light { opacity: .6; }
    .rain.light .fall { animation-duration: .9s; }
    .snowfall .fall { animation: art-snow 7s linear infinite; }
    .snowfall .fall.slow { animation-duration: 11s; }
    .flash { position: absolute; inset: 0; background: #fff; opacity: 0; animation: flash 7s infinite; }
    :host([still]) .sky * { animation: none !important; }
    @keyframes art-drift { to { translate: 9px 0; } }
    @keyframes art-glow { to { scale: 1.08; opacity: .8; } }
    @keyframes art-twinkle { to { opacity: .35; } }
    @keyframes art-rain { to { translate: 0 16px; } }
    @keyframes art-snow { to { translate: 0 24px; } }
    @keyframes flash { 0%, 91%, 93%, 95%, 100% { opacity: 0; } 92%, 94% { opacity: .35; } }

    .content { position: absolute; inset: 0; display: grid; grid-template-rows: auto 1fr auto; padding: calc(8cqw + var(--_safe)) calc(8cqw + var(--_safe)) calc(7.5cqw + var(--_safe));
      text-shadow: 0 0.15cqw 0.6cqw rgba(0,0,0,.18), 0 0 2.4cqw rgba(0,0,0,.12); z-index: 3; }
    .top { display: flex; justify-content: space-between; align-items: flex-start; gap: 3cqw; }
    .meta { display: grid; gap: 0.6cqw; font-size: 4.6cqw; font-weight: 600; line-height: 1.15; min-inline-size: 0; }
    .meta .place { font-size: 5.2cqw; font-weight: 700; letter-spacing: -0.01em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .meta .cond { display: flex; align-items: center; gap: 1.2cqw; opacity: .95; }
    .meta .hl { opacity: .85; font-variant-numeric: tabular-nums; }
    .meta .icon { inline-size: 5.2cqw; flex: none; }
    .sample { font-weight: 600; font-size: 3.2cqw; letter-spacing: .06em; text-transform: uppercase; opacity: .7; margin-inline-start: 1cqw; }
    .time { font-size: 6.2cqw; font-weight: 700; letter-spacing: -0.01em; font-variant-numeric: tabular-nums; }
    .temp { align-self: center; font-size: 44cqw; font-weight: 200; letter-spacing: -0.055em; line-height: .9; margin-inline-start: -2.4cqw;
      font-variant-numeric: lining-nums proportional-nums; }
    .stats { display: grid; grid-template-columns: repeat(4, 1fr); text-align: center; }
    .stat { display: grid; justify-items: center; gap: 0.8cqw; min-inline-size: 0; }
    .stat .icon { inline-size: 6.4cqw; opacity: .95; }
    .stat b { font-size: 4.4cqw; font-weight: 650; font-variant-numeric: tabular-nums; white-space: nowrap; }
    .stat b small { font-size: .72em; font-weight: 600; opacity: .85; margin-inline-start: .3em; }
    .stat span { font-size: 3.5cqw; font-weight: 550; opacity: .82; }
    .loading .temp { align-self: center; }
  `;#t=new M(this);connected(){this.#t.start()}disconnected(){this.#t.stop()}attributeChanged(t){U.includes(t)&&t!=="refresh"&&this.#t.start()}get weather(){return this.#t.data}set weather(t){this.#t.set(t)}get tickRate(){return this.flag("hide-time")?null:"second"}template(){let t=this.#t.data,e=t?t.sky:"partly",i=t?t.isDay:!0,[s,r,a]=te[`${e}-${i?"day":"night"}`]??te["partly-day"],o=[Ie(e,i)];e==="storm"&&o.push('<i class="flash"></i>'),o.push('<i class="tint"></i>');let c=l=>l==null||Number.isNaN(l)?"--":`${Math.round(l)}\xB0`,u=t?.place||this.getAttribute("location")||"",d=Array.from({length:4},()=>'<div class="stat"><span class="shim i"></span><span class="shim s"></span></div>').join("");if(t){let l=Et(t),f=t.units==="imperial"?"mph":"km/h";d=`
        <div class="stat">${l?.kind==="sunrise"?b.sunrise():b.sunset()}<b class="num">${qt(l?.time,this.hour12)}</b><span>${l?.kind==="sunrise"?"Sunrise":"Sunset"}</span></div>
        <div class="stat">${b.wind()}<b class="num">${Math.round(t.wind??0)}<small>${f}</small></b><span>Wind</span></div>
        <div class="stat">${b.humidity()}<b class="num">${Math.round(t.humidity??0)}%</b><span>Humidity</span></div>
        <div class="stat">${b.air()}<b class="num">${t.aqi??"--"}</b><span>AQI</span></div>`}return`
      <div class="sky" aria-hidden="true" style="--s0:${s};--s1:${r};--s2:${a}">${o.join("")}</div>
      <div class="content${t?"":" loading"}" aria-hidden="true">
        <div class="top">
          <div class="meta">
            <div class="place">${y(u||(t?"":"Weather"))}${t?.sample?'<span class="sample">Sample</span>':""}</div>
            ${t?`<div class="cond">${ot(e,i)}<span>${y(t.condition)}</span></div><div class="hl">H:${c(t.high)} L:${c(t.low)}</div>`:'<span class="shim l"></span><span class="shim s"></span>'}
          </div>
          ${this.flag("hide-time")?"":'<div class="time"></div>'}
        </div>
        <div class="temp">${t?c(t.temperature):'<span class="shim t"></span>'}</div>
        <div class="stats">${d}</div>
      </div>`}update(t){let e=this.$(".time");if(!e)return;let i=H(t.hours,t.minutes,this.hour12);e.textContent!==i&&(e.textContent=i)}describe(){let t=this.#t.data;if(!t)return"Weather, loading";let e=t.aqi!=null?`, air quality ${St(t.aqi,t.aqiScale).toLowerCase()}`:"";return`Weather${t.place?` in ${t.place}`:""}: ${Math.round(t.temperature)} degrees, ${t.condition.toLowerCase()}, high ${Math.round(t.high)}, low ${Math.round(t.low)}${e}${t.sample?" (sample data)":""}`}};F("bezel-weather",X);var It={};L(It,{expandEvents:()=>Ut,normaliseEvents:()=>mt,parseICS:()=>ht,parseICSDate:()=>B});var I=864e5,Be={SU:0,MO:1,TU:2,WE:3,TH:4,FR:5,SA:6};function Ne(n){return n.replace(/\r\n/g,`
`).replace(/\n[ \t]/g,"")}function ne(n){return n.replace(/\\n/gi,`
`).replace(/\\([,;\\])/g,"$1")}function Re(n){let t=n.search(/:(?=(?:[^"]*"[^"]*")*[^"]*$)/);if(t<0)return null;let e=n.slice(0,t),i=n.slice(t+1),[s,...r]=e.split(";"),a={};for(let o of r){let c=o.indexOf("=");c>0&&(a[o.slice(0,c).toUpperCase()]=o.slice(c+1).replace(/^"|"$/g,""))}return{name:s.toUpperCase(),params:a,value:i}}function B(n,t={},e){let i=/^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2})?(Z)?)?$/.exec(n.trim());if(!i)return null;let[,s,r,a,o,c,u,d]=i;if(o===void 0||t.VALUE==="DATE")return{ms:D(+s,+r-1,+a,0,0,0,e),allDay:!0,ymd:[+s,+r-1,+a]};let l=[+s,+r-1,+a,+o,+c,+(u??0)];if(d)return{ms:Date.UTC(...l),allDay:!1};let f=t.TZID&&!t.TZID.startsWith("/")?t.TZID:e,m;try{m=D(...l,f)}catch{m=D(...l,e)}return{ms:m,allDay:!1}}function Le(n){let t={};for(let e of n.split(";")){let[i,s]=e.split("=");i&&s&&(t[i.toUpperCase()]=s)}return t}function ht(n,{timeZone:t}={}){let e=[],i=null;for(let s of Ne(String(n??"")).split(`
`)){let r=s.trimEnd();if(r==="BEGIN:VEVENT"){i={uid:"",title:"",location:"",start:null,end:null,allDay:!1,rrule:null,exdates:new Set,recurrenceId:null,cancelled:!1};continue}if(r==="END:VEVENT"){i&&i.start!=null&&!i.cancelled&&((i.end==null||i.end<i.start)&&(i.end=i.start+(i.allDay?I:0)),e.push(i)),i=null;continue}if(!i)continue;let a=Re(r);if(a)switch(a.name){case"UID":i.uid=a.value;break;case"SUMMARY":i.title=ne(a.value);break;case"LOCATION":i.location=ne(a.value);break;case"STATUS":i.cancelled=a.value.toUpperCase()==="CANCELLED";break;case"DTSTART":{let o=B(a.value,a.params,t);o&&(i.start=o.ms,i.allDay=o.allDay);break}case"DTEND":{let o=B(a.value,a.params,t);o&&(i.end=o.ms);break}case"DURATION":{let o=/P(?:(\d+)W)?(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?/.exec(a.value);if(o&&i.start!=null){let[,c=0,u=0,d=0,l=0,f=0]=o.map(m=>m===void 0?0:+m);i.end=i.start+(((+c*7+ +u)*24+ +d)*60+ +l)*6e4+ +f*1e3}break}case"RRULE":i.rrule=Le(a.value);break;case"EXDATE":for(let o of a.value.split(",")){let c=B(o,a.params,t);c&&i.exdates.add(c.ms)}break;case"RECURRENCE-ID":{let o=B(a.value,a.params,t);o&&(i.recurrenceId=o.ms);break}}}return e}function ie(n,t){let e=new Date(n),i=e.getUTCDate();e.setUTCDate(1),e.setUTCMonth(e.getUTCMonth()+t);let s=new Date(Date.UTC(e.getUTCFullYear(),e.getUTCMonth()+1,0)).getUTCDate();return i>s?null:(e.setUTCDate(i),e.getTime())}function*Oe(n,t){let e=n.rrule,i=e.FREQ,s=Math.max(1,parseInt(e.INTERVAL??"1",10)||1),r=e.COUNT?parseInt(e.COUNT,10):1/0,a=e.UNTIL?B(e.UNTIL)?.ms??1/0:1/0,o=Math.min(t,a),c=0,u=5e3;if(i==="WEEKLY"&&e.BYDAY){let d=e.BYDAY.split(",").map(m=>Be[m.slice(-2)]).filter(m=>m!=null).sort(),l=new Date(n.start).getUTCDay(),f=n.start-l*I;for(let m=0;m<u&&c<r;m+=s)for(let g of d){let p=f+m*7*I+g*I;if(!(p<n.start)){if(p>o||c>=r)return;c++,yield p}}return}for(let d=0;d<u&&c<r;d++){let l;if(i==="DAILY")l=n.start+d*s*I;else if(i==="WEEKLY")l=n.start+d*s*7*I;else if(i==="MONTHLY")l=ie(n.start,d*s);else if(i==="YEARLY")l=ie(n.start,d*s*12);else return;if(l!=null){if(l>o)return;c++,yield l}}}function Ut(n,t,e){let i=new Map;for(let r of n)r.recurrenceId!=null&&i.set(`${r.uid}@${r.recurrenceId}`,r);let s=[];for(let r of n){if(r.recurrenceId!=null){r.end>t&&r.start<e&&s.push(r);continue}let a=r.end-r.start;if(!r.rrule){r.end>t&&r.start<e&&s.push(r);continue}for(let o of Oe(r,e)){if(r.exdates.has(o)||i.has(`${r.uid}@${o}`))continue;let c=o+a;c>t&&o<e&&s.push({...r,start:o,end:c,rrule:null})}}return s.sort((r,a)=>r.start-a.start||r.title.localeCompare(a.title))}function mt(n){return Array.isArray(n)?n.map(t=>{let e=new Date(t.start).getTime();if(!Number.isFinite(e))return null;let i=t.end!=null?new Date(t.end).getTime():e;return{uid:t.id??"",title:String(t.title??t.summary??"Untitled"),location:String(t.location??""),start:e,end:Number.isFinite(i)?i:e,allDay:!!t.allDay,rrule:null,exdates:new Set,recurrenceId:null}}).filter(Boolean):[]}var N=50;function je(n){let t=Array.from({length:60},(i,s)=>{let r=s%5===0;return`<line class="t${r?" M":""}" x1="${N}" y1="${r?7.5:8.6}" x2="${N}" y2="${4.6}" transform="rotate(${s*6} ${N} ${N})"/>`}).join(""),e=Array.from({length:12},(i,s)=>{let r=s+1,a=r*Math.PI/6;return`<text x="${(N+Math.sin(a)*33).toFixed(2)}" y="${(N-Math.cos(a)*33).toFixed(2)}" text-anchor="middle" dominant-baseline="central">${r}</text>`}).join("");return`<svg class="dial" viewBox="0 0 100 100" aria-hidden="true">
    <circle class="plate" cx="50" cy="50" r="48"/>
    ${t}${e}
    ${n==="lollipop"?it({hour:24,minute:36,second:34,tail:8,weight:1.45,classes:{hour:"hr",minute:"mn",second:"sc"}}):`<g class="h hr"><line x1="50" y1="50" x2="50" y2="44"/><line class="w" x1="50" y1="44" x2="50" y2="27"/></g>
    <g class="h mn"><line x1="50" y1="50" x2="50" y2="44"/><line class="w" x1="50" y1="44" x2="50" y2="13"/></g>
    <g class="h sc"><line x1="50" y1="58" x2="50" y2="8"/></g>
    <circle class="hub" cx="50" cy="50" r="2.4"/><circle class="pin" cx="50" cy="50" r="0.9"/>`}
  </svg>`}var J=class extends x{static attributes=[...U,"events","ics","max-events","hide-weather","hands"];static defaultTheme="mist";static themes={mist:{surface:"#B9C6CE",ink:"#0F1316",accent:"#FFFFFF",soft:"#DCE3E8",hand:"#0F1316"},orchid:{surface:"#D98CF2",ink:"#160F1A",accent:"#4A35D4",soft:"#EBC4F8",hand:"#160F1A"},sand:{surface:"#E9DCC6",ink:"#1E1913",accent:"#C2410C",soft:"#F5EDE0",hand:"#1E1913"},slate:{surface:"#1C2127",ink:"#EEF1F4",accent:"#7CC4FF",soft:"#2B323A",hand:"#EEF1F4"}};static styles=`
    .screen { background: radial-gradient(120% 100% at 20% 0%, color-mix(in srgb, var(--_surface), #fff 10%), var(--_surface) 60%); }
    .g { position: absolute; inset: 0; display: grid; grid-template: 1fr auto / 1fr 1fr; gap: 3cqw 5cqw; padding: calc(8cqw + var(--_safe)); }
    .date { display: grid; align-content: start; gap: 0; }
    .date .md { font-size: 6.6cqw; font-weight: 700; letter-spacing: -0.01em; line-height: 1; }
    .date .md b { color: var(--_accent); font-weight: 700; }
    .date .dd { font-size: 31cqw; font-weight: 600; letter-spacing: -0.06em; line-height: .86; margin-inline-start: -1.2cqw; margin-block-start: 1cqw; font-variant-numeric: lining-nums; }
    .clock { display: grid; place-items: start end; }
    .dial { inline-size: 40cqw; aspect-ratio: 1; }
    .plate { fill: color-mix(in srgb, var(--_soft), transparent 55%); stroke: color-mix(in srgb, var(--_ink), transparent 88%); stroke-width: .6; }
    .dial .t { stroke: var(--_ink); stroke-width: .5; opacity: .35; stroke-linecap: round; }
    .dial .t.M { stroke-width: 1.2; opacity: .9; }
    .dial text { font-size: 10px; font-weight: 600; fill: var(--_ink); font-family: var(--_font); }
    .dial .h line { stroke: var(--_hand); stroke-linecap: round; stroke-width: 1.4; }
    .dial .h line.w { stroke-width: 3.6; }
    .dial .sc line { stroke: var(--_accent); stroke-width: .9; }
    .dial .hub { fill: var(--_hand); } .dial .pin { fill: var(--_accent); }
    .dial .h, .dial .lp, .dial .lp-sec { filter: drop-shadow(0 .4px .5px rgba(0,0,0,.2)); }
    ${st}

    .agenda { display: grid; align-content: end; gap: 2.2cqw; min-inline-size: 0; }
    .ev { display: grid; gap: .2cqw; padding-inline-start: 2.6cqw; border-inline-start: 0.9cqw solid var(--_accent); min-inline-size: 0; }
    .ev .when { font-size: 3.5cqw; font-weight: 700; color: var(--_accent); font-variant-numeric: tabular-nums; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .ev .what { font-size: 4.3cqw; font-weight: 560; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .ev.now { border-inline-start-color: var(--_ink); }
    .none { font-size: 4.3cqw; font-weight: 560; opacity: .7; }

    .year { display: grid; align-content: end; gap: 1.6cqw; }
    .year .wk { font-size: 4.4cqw; font-weight: 700; color: var(--_accent); letter-spacing: .02em; }
    .year .big { font-size: 13cqw; font-weight: 600; letter-spacing: -0.04em; line-height: .9; }
    .bar { block-size: 1.6cqw; border-radius: 1cqw; background: color-mix(in srgb, var(--_ink), transparent 85%); overflow: hidden; }
    .bar i { display: block; block-size: 100%; background: var(--_ink); border-radius: inherit; }
    .year .lbl { font-size: 3.5cqw; font-weight: 560; opacity: .75; font-variant-numeric: tabular-nums; }

    .wx { display: grid; align-content: end; justify-items: start; gap: .4cqw; min-inline-size: 0; }
    .wx .place { display: flex; align-items: center; gap: 1cqw; font-size: 4.3cqw; font-weight: 650; max-inline-size: 100%; }
    .wx .place span { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .wx .place .icon { inline-size: 3.2cqw; flex: none; }
    .wx .temp { font-size: 22cqw; font-weight: 560; letter-spacing: -0.06em; line-height: .92; margin-inline-start: -1cqw; font-variant-numeric: lining-nums; }
    .wx .cond { display: flex; align-items: center; gap: 1.2cqw; font-size: 3.7cqw; font-weight: 600; }
    .wx .cond .icon { inline-size: 4.6cqw; }
    .wx .hl { font-size: 3.6cqw; font-weight: 560; opacity: .75; font-variant-numeric: tabular-nums; }
    .shim { display: block; inline-size: 24cqw; block-size: 3.4cqw; border-radius: 1cqw; margin-block-start: 1cqw;
      background: linear-gradient(100deg, color-mix(in srgb, var(--_ink), transparent 90%) 30%, color-mix(in srgb, var(--_ink), transparent 78%) 50%, color-mix(in srgb, var(--_ink), transparent 90%) 70%) 0 0 / 300% 100%;
      animation: shimmer 1.6s ease-in-out infinite; }
    .shim.big { inline-size: 26cqw; block-size: 16cqw; border-radius: 2.4cqw; }
    .shim.short { inline-size: 16cqw; }
    @keyframes shimmer { from { background-position: 100% 0; } to { background-position: -100% 0; } }
    .sample { font-size: 2.8cqw; letter-spacing: .06em; text-transform: uppercase; opacity: .6; }
  `;#t=new M(this);#e=null;#n=0;#i=0;connected(){this.flag("hide-weather")||this.#t.start(),this.#s()}disconnected(){this.#t.stop(),clearTimeout(this.#n)}attributeChanged(t){U.includes(t)&&t!=="refresh"&&this.#t.start(),t==="hide-weather"&&(this.flag("hide-weather")?this.#t.stop():this.#t.start()),(t==="events"||t==="ics")&&this.#s()}get weather(){return this.#t.data}set weather(t){this.#t.set(t)}get events(){return this.#e}set events(t){this.#e=mt(t),this.invalidate()}set icsText(t){this.#e=ht(t,{timeZone:this.timeZone}),this.invalidate()}async#s(){clearTimeout(this.#n);let t=this.getAttribute("events");if(t){try{this.#e=mt(JSON.parse(t))}catch{console.warn("[bezel] The events attribute is not valid JSON."),this.#e=[]}this.invalidate();return}let e=this.getAttribute("ics");if(!e)return;let i=++this.#i;try{let s=await fetch(e);if(!s.ok)throw new Error(`HTTP ${s.status}`);let r=await s.text();if(i!==this.#i)return;this.#e=ht(r,{timeZone:this.timeZone}),this.invalidate()}catch(s){console.warn(`[bezel] Could not load the calendar feed (${s.message}). Many feeds block browsers; see the README for options.`)}this.#n=setTimeout(()=>this.#s(),15*6e4)}get tickRate(){return this.reducedMotion?"second":"frame"}#a(t){if(!this.#e)return null;let e=D(t.year,t.month,t.day,0,0,0,this.timeZone),i=D(t.year,t.month,t.day+1,0,0,0,this.timeZone),s=Math.max(1,parseInt(this.getAttribute("max-events"),10)||3);return Ut(this.#e,e,i).filter(r=>r.end>t.ms||r.allDay&&r.end>e).slice(0,s)}#o(t,e){if(t.allDay)return"All day";let i={hour:"numeric",minute:"2-digit",hour12:this.hour12,timeZone:this.timeZone},s;try{s=new Intl.DateTimeFormat(this.locale,i)}catch{s=new Intl.DateTimeFormat("en-GB",i)}return t.start<=e.ms&&t.end>e.ms?`Now \xB7 until ${s.format(t.end)}`:s.format(t.start)}template(t){let e=C(this.locale),i=this.#a(t),s;if(i)s=i.length?`<div class="agenda">${i.map(a=>`<div class="ev${a.start<=t.ms&&a.end>t.ms&&!a.allDay?" now":""}"><span class="when">${y(this.#o(a,t))}</span><span class="what">${y(a.title)}</span></div>`).join("")}</div>`:'<div class="agenda"><span class="none">Nothing else today</span></div>';else{let a=$t(t.year,t.month,t.day),o=vt(t.year),c=Math.round(a/o*100);s=`<div class="year">
        <span class="wk">Week ${et(t.year,t.month,t.day)}</span>
        <span class="big num">${c}%</span>
        <div class="bar"><i style="inline-size:${(a/o*100).toFixed(2)}%"></i></div>
        <span class="lbl">Day ${a} of ${o}</span>
      </div>`}let r;if(this.flag("hide-weather"))r=`<div class="wx"><span class="place"><span>${y(e.monthLong[t.month])}</span></span><span class="temp num">${et(t.year,t.month,t.day)}</span><span class="cond">Week of the year</span></div>`;else{let a=this.#t.data,o=u=>u==null?"--":`${Math.round(u)}\xB0`,c=a?.place||this.getAttribute("location")||"";r=`<div class="wx">
        <span class="place">${b.arrow()}<span>${y(c)}</span>${a?.sample?'<span class="sample">Sample</span>':""}</span>
        ${a?`<span class="temp num">${o(a.temperature)}</span>
             <span class="cond">${ot(a.sky,a.isDay)}<span>${y(a.condition)}</span></span>
             <span class="hl">H:${o(a.high)} L:${o(a.low)}</span>`:'<span class="shim big"></span><span class="shim"></span><span class="shim short"></span>'}
      </div>`}return`<div class="g" aria-hidden="true">
      <div class="date"><span class="md"><b>${y(e.weekdayShort[t.weekday].replace(".",""))}</b> ${y(e.monthShort[t.month].replace(".",""))}</span><span class="dd">${t.day}</span></div>
      <div class="clock">${je(nt(this.getAttribute("hands")))}</div>
      ${s}
      ${r}
    </div>`}#r=-1;update(t,e){let i=E(t,{smooth:this.tickRate==="frame"});this.$(".hr")?.setAttribute("transform",`rotate(${i.hour.toFixed(3)} 50 50)`),this.$(".mn")?.setAttribute("transform",`rotate(${i.minute.toFixed(3)} 50 50)`),this.$(".sc")?.setAttribute("transform",`rotate(${i.second.toFixed(3)} 50 50)`),!e&&t.minutes!==this.#r&&this.#e&&this.invalidate(),this.#r=t.minutes}describe(t){let e=new Intl.DateTimeFormat(this.locale,{dateStyle:"full",timeZone:"UTC"}).format(Date.UTC(t.year,t.month,t.day)),i=this.#t.data;return`${e}${i?`. ${Math.round(i.temperature)} degrees and ${i.condition.toLowerCase()}${i.place?` in ${i.place}`:""}`:""}`}};F("bezel-glance",J);var Q=class extends x{static attributes=["week-start","month","no-highlight"];static defaultFrame="none";static defaultTheme="noir";static themes={noir:{surface:"#000000",ink:"#FFFFFF",accent:"#FF4D2E",rule:"rgba(255,255,255,.22)"},paper:{surface:"#F7F7F5",ink:"#0B0B0B",accent:"#E5322D",rule:"rgba(0,0,0,.16)"},signal:{surface:"#E5322D",ink:"#FFFFFF",accent:"#111111",rule:"rgba(255,255,255,.3)"},bone:{surface:"#E8E4DA",ink:"#1C1B19",accent:"#2346D8",rule:"rgba(0,0,0,.16)"}};static styles=`
    :host { aspect-ratio: var(--bezel-aspect, 4 / 3); --_rim-r: var(--bezel-radius, 4cqw); }
    .frame--none .screen { border-radius: var(--_rim-r); }
    .p { position: absolute; inset: 0; display: grid; grid-template-rows: auto minmax(0, 1fr); padding: 4.2cqw 2.4cqw 2.4cqw; overflow: hidden; }
    .title { justify-self: end; font-size: 4cqw; font-weight: 700; letter-spacing: -0.02em; padding-inline-end: 6cqw; margin-block-end: 2cqh; font-variant-numeric: lining-nums; }
    .cols { display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); min-block-size: 0; container-type: size; }
    .col { display: grid; grid-template-rows: repeat(var(--rows), minmax(0, 1fr)); border-inline-start: max(1px, 0.14cqw) solid var(--_rule); padding-inline-start: 0.5cqw; min-inline-size: 0; }
    .col:first-child { border-inline-start-color: transparent; }
    .c { font-size: var(--fs); font-weight: 700; line-height: .84; letter-spacing: -0.05em; align-self: end; white-space: nowrap;
         font-variant-numeric: lining-nums proportional-nums; font-feature-settings: "lnum" 1, "pnum" 1; }
    .c.h { letter-spacing: -0.02em; }
    .c.today { color: var(--_accent); }
  `;get tickRate(){return"minute"}template(t){let e=q(this.getAttribute("month")),i=e?.year??t.year,s=e?.month??t.month,r=G(this.getAttribute("week-start"),this.locale),a=C(this.locale),o=Y(i,s,{weekStart:r,fillAdjacent:!1}),c=o.length+1,u=!this.flag("no-highlight")&&i===t.year&&s===t.month,d=`min(calc(100cqh / ${c} * 1.08), 12cqw)`,l=P(r).map((f,m)=>{let g=`<span class="c h">${y(a.weekdayNarrow[f])}</span>`,p=o.map(v=>{let k=v[m];return k?`<span class="c${u&&k.day===t.day?" today":""}">${k.day}</span>`:'<span class="c"></span>'}).join("");return`<div class="col">${g}${p}</div>`}).join("");return`<div class="p" style="--rows:${c};--fs:${d}" aria-hidden="true">
      <div class="title">${i} ${y(a.monthLong[s])}</div>
      <div class="cols">${l}</div>
    </div>`}describe(t){let e=q(this.getAttribute("month"));return`Calendar for ${new Intl.DateTimeFormat(this.locale,{month:"long",year:"numeric",timeZone:"UTC"}).format(Date.UTC(e?.year??t.year,e?.month??t.month,15))}`}};F("bezel-poster",Q);var Ge="1.1.0";return le(He);})();

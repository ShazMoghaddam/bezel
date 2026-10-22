/*! Bezel v1.0.0 | MIT | github.com/ShazMoghaddam/bezel */
var Bezel=(()=>{var at=Object.defineProperty;var Gt=Object.getOwnPropertyDescriptor;var Zt=Object.getOwnPropertyNames;var Vt=Object.prototype.hasOwnProperty;var _=(a,t)=>{for(var e in t)at(a,e,{get:t[e],enumerable:!0})},Kt=(a,t,e,n)=>{if(t&&typeof t=="object"||typeof t=="function")for(let i of Zt(t))!Vt.call(a,i)&&i!==e&&at(a,i,{get:()=>t[i],enumerable:!(n=Gt(t,i))||n.enumerable});return a};var Jt=a=>Kt(at({},"__esModule",{value:!0}),a);var Fe={};_(Fe,{BezelCalendar:()=>O,BezelClock:()=>R,BezelElement:()=>w,BezelGlance:()=>Y,BezelPoster:()=>P,BezelWeather:()=>H,calendar:()=>gt,define:()=>b,ics:()=>Ct,safeLocale:()=>pt,time:()=>mt,version:()=>ke,weather:()=>Ft});var Dt=`
:host {
  --_font: var(--bezel-font, -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI Variable Display", "Helvetica Neue", Roboto, Arial, sans-serif);
  --_rim-r: var(--bezel-radius, 22cqw);
  --_rim-pad: 1.15cqw;
  --_bezel-pad: 5cqw;
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

/* Device: brushed aluminium rim, black glass bezel, screen. */
.frame--device {
  border-radius: var(--_rim-r);
  padding: var(--_rim-pad);
  background:
    linear-gradient(150deg, rgba(255,255,255,.9) 0%, rgba(255,255,255,0) 22%, rgba(255,255,255,0) 70%, rgba(255,255,255,.55) 100%),
    linear-gradient(160deg, #f2f3f5 0%, #c6c9ce 38%, #e9ebee 58%, #aeb2b8 100%);
  box-shadow:
    0 0.2cqw 0.4cqw rgba(0,0,0,.10),
    0 1.6cqw 3.2cqw -0.6cqw rgba(0,0,0,.20),
    0 6cqw 10cqw -3cqw rgba(0,0,0,.30),
    inset 0 0 0 0.12cqw rgba(255,255,255,.65),
    inset 0 -0.2cqw 0.3cqw rgba(0,0,0,.18);
}
.bezel {
  position: relative;
  block-size: 100%;
  border-radius: calc(var(--_rim-r) - var(--_rim-pad));
  padding: var(--_bezel-pad);
  background: radial-gradient(120% 90% at 30% 0%, #1b1c1f 0%, #050506 60%);
  box-shadow: inset 0 0 0 0.12cqw rgba(255,255,255,.06);
}
.frame--device .bezel::before {
  content: "";
  position: absolute;
  inset-block-start: calc(var(--_bezel-pad) * 0.42);
  inset-inline-start: 50%;
  inline-size: 1.15cqw;
  aspect-ratio: 1;
  translate: -50% 0;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 35%, #3c4a66 0%, #12151c 45%, #050608 75%);
  box-shadow: 0 0 0 0.25cqw #0c0d10;
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
  box-shadow: inset 0 0 0 0.3cqw rgba(0,0,0,.18);
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
`;function p(a){return String(a??"").replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}var $={frame:new Set,second:new Set,minute:new Set},q=0,C=0,rt=-1,st=-1,M=typeof window<"u",Tt=M&&window.requestAnimationFrame?window.requestAnimationFrame.bind(window):null,At=M&&window.cancelAnimationFrame?window.cancelAnimationFrame.bind(window):null;function Et(){return M&&typeof window.matchMedia=="function"?window.matchMedia("(prefers-reduced-motion: reduce)").matches:!1}function it(a,t){for(let e of a)try{e(t)}catch(n){console.error("[bezel]",n)}}function zt(){q=0,C=0;let a=Date.now();it($.frame,a);let t=Math.floor(a/1e3);if(t!==rt){rt=t,it($.second,a);let e=Math.floor(t/60);e!==st&&(st=e,it($.minute,a))}ot()}function ot(){if(q||C||!($.frame.size+$.second.size+$.minute.size))return;let t=!M||typeof document>"u"||document.visibilityState!=="hidden";$.frame.size&&Tt&&t?q=Tt(zt):C=setTimeout(zt,1e3-Date.now()%1e3+2)}M&&typeof document<"u"&&document.addEventListener("visibilitychange",()=>{q&&At&&At(q),C&&clearTimeout(C),q=0,C=0,rt=-1,st=-1,ot()});function St(a,t){let e=$[a];if(!e)throw new Error(`[bezel] Unknown tick rate "${a}"`);return e.add(t),ot(),()=>e.delete(t)}var mt={};_(mt,{dayOfYear:()=>ut,daysInYear:()=>ht,formatClock:()=>B,handAngles:()=>U,isValidTimeZone:()=>lt,isoWeek:()=>V,names:()=>v,parseWeekStart:()=>I,prefers12h:()=>dt,tzOffset:()=>G,weekStartFor:()=>ct,zoned:()=>Z,zonedToUtc:()=>k});var _t=new Map,Mt=new Map,Ut=new Set;function Bt(a){let t=Mt.get(a);return t||(t=new Intl.DateTimeFormat("en-US",{timeZone:a,hourCycle:"h23",year:"numeric",month:"numeric",day:"numeric",hour:"numeric",minute:"numeric",second:"numeric"}),Mt.set(a,t)),t}function lt(a){if(!a)return!1;try{return Bt(a),!0}catch{return!1}}function G(a,t){if(!t)return-new Date(a).getTimezoneOffset()*6e4;let e=Math.floor(a/6e4),n=_t.get(t);if(n&&n.minuteKey===e)return n.offset;let i;try{let r={};for(let{type:o,value:c}of Bt(t).formatToParts(new Date(a)))r[o]=c;i=Date.UTC(+r.year,+r.month-1,+r.day,+r.hour%24,+r.minute,+r.second)-Math.floor(a/1e3)*1e3}catch{Ut.has(t)||(Ut.add(t),console.warn(`[bezel] Unknown time zone "${t}", using the device time zone.`)),i=-new Date(a).getTimezoneOffset()*6e4}return _t.set(t,{minuteKey:e,offset:i}),i}function Z(a=Date.now(),t){let e=G(a,t),n=new Date(a+e);return{ms:a,offset:e,year:n.getUTCFullYear(),month:n.getUTCMonth(),day:n.getUTCDate(),weekday:n.getUTCDay(),hours:n.getUTCHours(),minutes:n.getUTCMinutes(),seconds:n.getUTCSeconds(),millis:n.getUTCMilliseconds()}}function k(a,t,e,n=0,i=0,r=0,s){let o=Date.UTC(a,t,e,n,i,r);if(!s)return new Date(a,t,e,n,i,r).getTime();let c=o-G(o,s);return o-G(c,s)}function U(a,{smooth:t=!0}={}){let e=a.seconds+(t?a.millis/1e3:0),n=a.minutes+e/60;return{hour:(a.hours%12+n/60)*30,minute:n*6,second:e*6}}var It=new Map;function v(a="en-GB"){let t=It.get(a);if(t)return t;let e=r=>{try{return new Intl.DateTimeFormat(a,{timeZone:"UTC",...r})}catch{return new Intl.DateTimeFormat("en-GB",{timeZone:"UTC",...r})}},n=r=>Array.from({length:7},(s,o)=>e({weekday:r}).format(Date.UTC(1970,0,4+o))),i=r=>Array.from({length:12},(s,o)=>e({month:r}).format(Date.UTC(2001,o,15)));return t={weekdayShort:n("short"),weekdayNarrow:n("narrow"),weekdayLong:n("long"),monthShort:i("short"),monthLong:i("long")},It.set(a,t),t}var Qt=new Set(["US","CA","MX","BR","JP","KR","TW","HK","IL","PH","ZA","AU","IN","SA","AR","CO","PE","VE","GT","PA"]);function ct(a="en-GB"){try{let t=new Intl.Locale(a),e=typeof t.getWeekInfo=="function"?t.getWeekInfo():t.weekInfo;if(e&&e.firstDay)return e.firstDay%7;let n=t.maximize().region;return Qt.has(n)?0:1}catch{return 1}}function I(a,t){if(a==null||a==="")return ct(t);let e=String(a).trim().toLowerCase();return/^[0-6]$/.test(e)?Number(e):{su:0,mo:1,tu:2,we:3,th:4,fr:5,sa:6}[e.slice(0,2)]??ct(t)}function dt(a="en-GB"){try{let t=new Intl.DateTimeFormat(a,{hour:"numeric"}).resolvedOptions().hourCycle;return t==="h11"||t==="h12"}catch{return!1}}function B(a,t,e){let n=String(t).padStart(2,"0");return e?`${a%12||12}:${n}`:`${String(a).padStart(2,"0")}:${n}`}function V(a,t,e){let n=new Date(Date.UTC(a,t,e)),i=n.getUTCDay()||7;n.setUTCDate(n.getUTCDate()+4-i);let r=Date.UTC(n.getUTCFullYear(),0,1);return Math.ceil(((n-r)/864e5+1)/7)}function ut(a,t,e){return Math.round((Date.UTC(a,t,e)-Date.UTC(a,0,1))/864e5)+1}function ht(a){return a%4===0&&a%100!==0||a%400===0?366:365}var ft=new Map;function pt(a){if(!a)return"en-GB";if(ft.has(a))return ft.get(a);let t="en-GB";for(let e of[a,String(a).split(/[@.]/)[0].replace("_","-")])try{t=Intl.getCanonicalLocales(e)[0];break}catch{}return ft.set(a,t),t}var Xt=["frame","theme","timezone","locale","hour-cycle"],te=new Set(["device","bezel","none"]),w=class extends HTMLElement{static attributes=[];static styles="";static themes={};static defaultTheme="";static defaultFrame="device";static get observedAttributes(){return[...Xt,...this.attributes]}#t=!1;#e=null;#n=null;#a=!0;#i=!1;#s="";#o=!1;constructor(){super(),this.attachShadow({mode:"open"})}connectedCallback(){this.#i=!0,this.hasAttribute("role")||this.setAttribute("role","img"),this.#o=this.hasAttribute("aria-label")&&this.dataset.bezelLabel===void 0,this.render(),this.#d(),this.#c(),this.connected?.()}disconnectedCallback(){this.#i=!1,this.#e?.(),this.#e=null,this.#n?.disconnect(),this.#n=null,this.disconnected?.()}attributeChangedCallback(t,e,n){e===n||!this.#i||(this.attributeChanged?.(t,e,n),this.invalidate())}invalidate(){this.#t||(this.#t=!0,queueMicrotask(()=>{this.#t=!1,this.#i&&(this.render(),this.#c())}))}get frame(){let t=this.getAttribute("frame");return te.has(t)?t:this.constructor.defaultFrame}get timeZone(){let t=this.getAttribute("timezone");return t&&lt(t)?t:void 0}get locale(){return pt(this.getAttribute("locale")||typeof navigator<"u"&&navigator.language)}get hour12(){let t=this.getAttribute("hour-cycle");return t==="12"?!0:t==="24"?!1:dt(this.locale)}get themeName(){let t=this.getAttribute("theme");return t&&this.constructor.themes[t]?t:this.constructor.defaultTheme}flag(t){let e=this.getAttribute(t);return e!==null&&e!=="false"}now(){return Z(Date.now(),this.timeZone)}get tickRate(){return"minute"}get reducedMotion(){return Et()}themeCSS(){let t=this.constructor.themes[this.themeName]??{};return`:host { ${Object.entries(t).map(([n,i])=>`--_${n}: var(--bezel-${n}, ${i});`).join("")} }`}render(){let t=this.now();this.#s=`${t.year}-${t.month}-${t.day}`;let e=this.frame;this.shadowRoot.innerHTML=`
      <style>${Dt}${this.themeCSS()}${this.constructor.styles}</style>
      <div class="frame frame--${e}" part="frame">
        <div class="bezel" part="bezel">
          <div class="screen" part="screen">${this.template(t)}</div>
        </div>
      </div>`,this.$=n=>this.shadowRoot.querySelector(n),this.$$=n=>this.shadowRoot.querySelectorAll(n),this.update(t,!0),this.#r(t)}template(){return""}update(){}describe(){return""}#r(t){let e=this.describe(t);!e||this.#o||this.getAttribute("aria-label")===e||(this.setAttribute("aria-label",e),this.dataset.bezelLabel="")}#l=t=>{let e=Z(t,this.timeZone);if(`${e.year}-${e.month}-${e.day}`!==this.#s){this.render();return}this.update(e,!1),e.seconds===0&&e.millis<1e3&&this.#r(e)};#c(){this.#e?.(),this.#e=null;let t=this.tickRate;!t||!this.#a||(t==="frame"&&this.reducedMotion&&(t="second"),this.#e=St(t,this.#l))}#d(){this.#n||typeof IntersectionObserver>"u"||(this.#n=new IntersectionObserver(t=>{let e=t.some(n=>n.isIntersecting);e!==this.#a&&(this.#a=e,e&&this.update(this.now(),!1),this.#c())}),this.#n.observe(this))}};function b(a,t){typeof customElements<"u"&&!customElements.get(a)&&customElements.define(a,t)}var ee=new Set(["numerals","relief","classic"]),ne={numerals:"sage",relief:"blush",classic:"porcelain"},d=50;function Rt({cls:a,stem:t,length:e,width:n,tail:i=0}){let r=t?`<line x1="${d}" y1="${d}" x2="${d}" y2="${d-t}" stroke-width="${Math.max(.9,n*.32)}" />`:"";return`<g class="hand ${a}">
    ${r}
    <line x1="${d}" y1="${t?d-t:d+i}" x2="${d}" y2="${d-e}" stroke-width="${n}" />
  </g>`}function ae(a,t){return`<g class="hand second">
    <line x1="${d}" y1="${d+t}" x2="${d}" y2="${d-a}" stroke-width="0.55" />
  </g>`}var ie=`
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
</defs>`,R=class a extends w{static attributes=["variant","hide-seconds","hide-date","sweep"];static themes={sage:{surface:"#5C9268",ink:"#0A0C0A",hand:"#FFFFFF",accent:"#E3F4E6"},cobalt:{surface:"#2D4BD2",ink:"#F3F5FF",hand:"#FFFFFF",accent:"#FFD43B"},ember:{surface:"#E25A2C",ink:"#1A0E09",hand:"#FFF6EF",accent:"#FFF6EF"},graphite:{surface:"#121315",ink:"#F2F2F0",hand:"#F2F2F0",accent:"#FF6B35"},blush:{surface:"#E7C8C2",ink:"#5A2A26",hand:"#6E2B27",accent:"#E8409E"},stone:{surface:"#D9DADC",ink:"#2B2D31",hand:"#25272B",accent:"#FF5A1F"},midnight:{surface:"#1B1F27",ink:"#E9E3D6",hand:"#E9E3D6",accent:"#FFB547"},porcelain:{surface:"#F4F4F2",ink:"#17181A",hand:"#17181A",accent:"#FF5A1F"}};static styles=`
    .face { position: absolute; inset: 0; inline-size: 100%; block-size: 100%; }
    .hand line { stroke: var(--_hand); stroke-linecap: round; }
    .hand.second line { stroke: var(--_accent); }
    .hands { filter: url(#lift); }
    .hub { fill: var(--_hand); }
    .hub-ring { fill: none; stroke: var(--_accent); stroke-width: 0.55; }
    .hub-pin { fill: var(--_surface); }
    .numeral { font-family: var(--_font); fill: var(--_ink); font-variant-numeric: lining-nums proportional-nums; }

    /* numerals */
    .v-numerals .numeral { font-weight: var(--bezel-numeral-weight, 300); letter-spacing: -0.035em; }
    .v-numerals .date { font-weight: 650; fill: var(--_ink); font-size: 4.3px; letter-spacing: 0.02em; }

    /* relief */
    .v-relief .numeral { fill: color-mix(in srgb, var(--_surface), #000 5%); filter: url(#deboss); font-weight: 500; letter-spacing: -0.02em; transition: opacity .9s ease, font-size .9s ease; }
    .v-relief .shade { flood-color: color-mix(in srgb, var(--_surface), #000 55%); flood-opacity: .55; }
    .v-relief .glint { flood-color: color-mix(in srgb, var(--_surface), #fff 70%); flood-opacity: .9; }
    .v-relief .date { display: none; }

    /* classic */
    .tick { stroke: var(--_ink); stroke-linecap: round; }
    .tick.minor { stroke-width: 0.35; opacity: .45; }
    .tick.major { stroke-width: 0.9; }
    .v-classic .numeral { font-weight: 560; font-size: 8.2px; }
    .v-classic .date { font-weight: 650; fill: var(--_accent); font-size: 3.6px; letter-spacing: 0.08em; }

    .screen { background:
      radial-gradient(120% 90% at 30% 10%, color-mix(in srgb, var(--_surface), #fff 7%) 0%, var(--_surface) 55%, color-mix(in srgb, var(--_surface), #000 8%) 100%); }
  `;#t=-1;#e=-1;get variant(){let t=this.getAttribute("variant");return ee.has(t)?t:"numerals"}get themeName(){let t=this.getAttribute("theme");return t&&a.themes[t]?t:ne[this.variant]}get showSeconds(){return!this.flag("hide-seconds")}get tickRate(){return this.showSeconds?this.getAttribute("sweep")==="tick"?"second":"frame":"second"}template(t){let e=this.variant,n="";if(e==="numerals")n=`
        <g class="numerals">
          <text class="numeral" x="49" y="45.5" font-size="52" text-anchor="middle">12</text>
          <text class="numeral" x="19.5" y="68.5" font-size="52" text-anchor="middle">9</text>
          <text class="numeral" x="80.5" y="68.5" font-size="52" text-anchor="middle">3</text>
          <text class="numeral" x="50" y="95" font-size="52" text-anchor="middle">6</text>
        </g>
        <text class="date" x="7" y="93.5"></text>`;else if(e==="relief")n=`<g class="ring">${Array.from({length:12},(s,o)=>{let c=o*30,h=c*Math.PI/180,u=(d+Math.sin(h)*35).toFixed(2),l=(d-Math.cos(h)*35).toFixed(2),f=c>90&&c<270?c-180:c;return`<text class="numeral" data-h="${o||12}" text-anchor="middle" dominant-baseline="central" font-size="15" transform="rotate(${f} ${u} ${l})" x="${u}" y="${l}">${o||12}</text>`}).join("")}</g>`;else{let s=Array.from({length:60},(c,h)=>{let u=h%5===0;return`<line class="tick ${u?"major":"minor"}" x1="${d}" y1="${d-(u?41:43)}" x2="${d}" y2="${d-45.2}" transform="rotate(${h*6} ${d} ${d})" />`}).join(""),o=Array.from({length:12},(c,h)=>{let u=h+1,l=u*30*Math.PI/180,f=d+Math.sin(l)*33.5,m=d-Math.cos(l)*33.5;return`<text class="numeral" x="${f.toFixed(2)}" y="${m.toFixed(2)}" text-anchor="middle" dominant-baseline="central">${u}</text>`}).join("");n=`${s}${o}<text class="date" x="${d}" y="${d+16}" text-anchor="middle"></text>`}let i=e==="classic"?2.2:3.1,r=`
      <g class="hands">
        ${Rt({cls:"hour",stem:6,length:e==="classic"?22:27,width:i})}
        ${Rt({cls:"minute",stem:6,length:e==="classic"?36:40,width:i})}
        ${this.showSeconds?ae(e==="classic"?42:46,8):""}
        <circle class="hub" cx="${d}" cy="${d}" r="1.7" />
        ${this.showSeconds?`<circle class="hub-ring" cx="${d}" cy="${d}" r="1.15" />`:""}
        <circle class="hub-pin" cx="${d}" cy="${d}" r="0.55" />
      </g>`;return`<svg class="face v-${e}" viewBox="0 0 100 100" aria-hidden="true">${ie}${n}${r}</svg>`}update(t,e){let n=this.tickRate==="frame",i=U(t,{smooth:n});if(this.$(".hour")?.setAttribute("transform",`rotate(${i.hour.toFixed(3)} ${d} ${d})`),this.$(".minute")?.setAttribute("transform",`rotate(${i.minute.toFixed(3)} ${d} ${d})`),this.$(".second")?.setAttribute("transform",`rotate(${i.second.toFixed(3)} ${d} ${d})`),e||t.minutes!==this.#e){this.#e=t.minutes;let r=this.$(".date");if(r&&!this.flag("hide-date")){let s=v(this.locale).weekdayShort[t.weekday].replace(".","").toLocaleUpperCase(this.locale);r.textContent=`${s} ${t.day}`}}this.variant==="relief"&&(e||t.seconds!==this.#t)&&(this.#t=t.seconds,this.#n(i.minute))}#n(t){let e=t/30;for(let n of this.$$(".numeral")){let i=Number(n.dataset.h)%12,r=Math.abs(i-e);r=Math.min(r,12-r);let s=Math.min(1,Math.max(0,(r-1.2)/2.6)),o=s*s*(3-2*s);n.style.opacity=(1-o).toFixed(3),n.setAttribute("font-size",(16.5-o*5).toFixed(2))}}describe(t){return`Clock showing ${new Intl.DateTimeFormat(this.locale,{hour:"numeric",minute:"2-digit",hour12:this.hour12,timeZone:this.timeZone}).format(t.ms)}`}};b("bezel-clock",R);var gt={};_(gt,{daysInMonth:()=>Lt,monthGrid:()=>L,parseMonth:()=>D,weekdayOrder:()=>N});function Lt(a,t){return new Date(Date.UTC(a,t+1,0)).getUTCDate()}function L(a,t,{weekStart:e=1,fixedRows:n=!1,fillAdjacent:i=!0}={}){let s=(new Date(Date.UTC(a,t,1)).getUTCDay()-e+7)%7,o=Lt(a,t),c=n?6:Math.ceil((s+o)/7),h=[];for(let u=0;u<c;u++){let l=[];for(let f=0;f<7;f++){let m=u*7+f-s,F=new Date(Date.UTC(a,t,1+m)),x=m>=0&&m<o;l.push(x||i?{year:F.getUTCFullYear(),month:F.getUTCMonth(),day:F.getUTCDate(),inMonth:x}:null)}h.push(l)}return h}function N(a=1){return Array.from({length:7},(t,e)=>(a+e)%7)}function D(a){let t=/^(\d{4})-(\d{1,2})$/.exec(String(a??"").trim());if(!t)return null;let e=Number(t[2])-1;return e<0||e>11?null:{year:Number(t[1]),month:e}}var O=class extends w{static attributes=["week-start","month","hide-time","hide-backdrop"];static defaultTheme="snow";static themes={snow:{surface:"#FBFBFD",ink:"#1F3E8C",accent:"#E5484D",today:"#121A33",muted:"#B9C0D2"},ink:{surface:"#101216",ink:"#E8ECF4",accent:"#FF5F57",today:"#FFFFFF",muted:"#4A5160"},sorbet:{surface:"#FFE8D6",ink:"#5B2A86",accent:"#FF7A45",today:"#2A1240",muted:"#D9B8C4"},forest:{surface:"#E7EFE6",ink:"#21412F",accent:"#2F9E5B",today:"#0F2419",muted:"#A9BCAD"}};static styles=`
    .cal {
      position: absolute; inset: 0;
      display: grid;
      grid-template-rows: auto auto 1fr;
      padding: 8.5cqw 7.5cqw 7cqw;
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
      opacity: var(--bd-opacity, .9);
      font-variant-numeric: lining-nums;
      -webkit-mask-image: linear-gradient(180deg, #000 40%, rgba(0,0,0,.35) 78%, transparent 100%);
              mask-image: linear-gradient(180deg, #000 40%, rgba(0,0,0,.35) 78%, transparent 100%);
    }
  `;get tickRate(){return this.flag("hide-time")?"minute":"second"}template(t){let e=D(this.getAttribute("month")),n=e?.year??t.year,i=e?.month??t.month,r=I(this.getAttribute("week-start"),this.locale),s=v(this.locale),o=n===t.year&&i===t.month,c=N(r).map(l=>`<div class="dow">${p(s.weekdayNarrow[l])}</div>`).join(""),h=L(n,i,{weekStart:r,fixedRows:!0}).map(l=>l.map(f=>{let m=f.inMonth&&o&&f.day===t.day;return`<div class="d${f.inMonth?"":" out"}${m?" today":""}"><span>${f.day}</span></div>`}).join("")).map(l=>`<div class="row">${l}</div>`).join(""),u=new Intl.DateTimeFormat(this.locale,{month:"long",year:"numeric",timeZone:"UTC"}).format(Date.UTC(n,i,15));return`
      ${this.flag("hide-backdrop")||!o?"":`<div class="backdrop" aria-hidden="true"${t.day>9?' style="--bd-size:60cqw;--bd-opacity:.78"':""}>${t.day}</div>`}
      <div class="cal" aria-hidden="true">
        <div class="head"><span>${p(u)}</span>${this.flag("hide-time")?"":'<span class="time"></span>'}</div>
        <div class="row">${c}</div>
        <div class="grid">${h}</div>
      </div>`}update(t){let e=this.$(".time");if(e){let n=B(t.hours,t.minutes,this.hour12);e.textContent!==n&&(e.textContent=n)}}describe(t){return`Calendar. Today is ${new Intl.DateTimeFormat(this.locale,{dateStyle:"full",timeZone:"UTC"}).format(Date.UTC(t.year,t.month,t.day))}`}};b("bezel-calendar",O);var y=(a,t="")=>`<svg class="icon ${t}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${a}</svg>`,re='<circle cx="12" cy="12" r="4.2"/>',se=[0,45,90,135,180,225,270,315].map(a=>`<line x1="12" y1="2.6" x2="12" y2="4.6" transform="rotate(${a} 12 12)"/>`).join(""),j="M7.2 18.5h9.6a3.9 3.9 0 0 0 .5-7.77A5.4 5.4 0 0 0 6.9 10.2 4.2 4.2 0 0 0 7.2 18.5Z",oe="M8.4 19h8.2a3.3 3.3 0 0 0 .4-6.58 4.6 4.6 0 0 0-8.9-1.1A3.85 3.85 0 0 0 8.4 19Z",g={sun:()=>y(re+se),moon:()=>y('<path d="M19.2 14.6A7.6 7.6 0 0 1 9.4 4.8a7.6 7.6 0 1 0 9.8 9.8Z"/>'),partly:(a=!0)=>y((a?'<circle cx="8.6" cy="8.4" r="3.2"/><line x1="8.6" y1="2.4" x2="8.6" y2="3.4"/><line x1="2.6" y1="8.4" x2="3.6" y2="8.4"/><line x1="4.4" y1="4.2" x2="5.1" y2="4.9"/><line x1="12.8" y1="4.2" x2="12.1" y2="4.9"/>':'<path d="M11.6 9.6A4.4 4.4 0 0 1 6 4a4.4 4.4 0 1 0 5.6 5.6Z"/>')+`<path d="${oe}"/>`),cloudy:()=>y(`<path d="${j}"/>`),fog:()=>y('<line x1="4" y1="9" x2="20" y2="9"/><line x1="6" y1="13" x2="18" y2="13"/><line x1="4" y1="17" x2="20" y2="17"/>'),drizzle:()=>y(`<path d="${j}" transform="translate(0 -3)"/><line x1="9" y1="19" x2="8.5" y2="20.5"/><line x1="15" y1="19" x2="14.5" y2="20.5"/>`),rain:()=>y(`<path d="${j}" transform="translate(0 -3)"/><line x1="8" y1="18.5" x2="7" y2="21"/><line x1="12" y1="18.5" x2="11" y2="21"/><line x1="16" y1="18.5" x2="15" y2="21"/>`),snow:()=>y(`<path d="${j}" transform="translate(0 -3)"/><circle cx="8" cy="19.6" r=".5" fill="currentColor"/><circle cx="12" cy="20.6" r=".5" fill="currentColor"/><circle cx="16" cy="19.6" r=".5" fill="currentColor"/>`),storm:()=>y(`<path d="${j}" transform="translate(0 -3)"/><path d="M12.6 15.4 10.6 18.6h3l-2 3"/>`),sunrise:()=>y('<path d="M6.5 16a5.5 5.5 0 0 1 11 0"/><line x1="3" y1="19" x2="21" y2="19"/><path d="M12 3v6M9.5 5.5 12 3l2.5 2.5"/><line x1="4.2" y1="11.2" x2="5.4" y2="12"/><line x1="19.8" y1="11.2" x2="18.6" y2="12"/>'),sunset:()=>y('<path d="M6.5 16a5.5 5.5 0 0 1 11 0"/><line x1="3" y1="19" x2="21" y2="19"/><path d="M12 3v6M9.5 6.5 12 9l2.5-2.5"/><line x1="4.2" y1="11.2" x2="5.4" y2="12"/><line x1="19.8" y1="11.2" x2="18.6" y2="12"/>'),wind:()=>y('<path d="M3 9h11.5a2.5 2.5 0 1 0-2.5-2.5"/><path d="M3 13h15.5a2.5 2.5 0 1 1-2.5 2.5"/><path d="M3 17h7"/>'),humidity:()=>y('<path d="M12 3.2s-6 6.6-6 10.8a6 6 0 0 0 12 0c0-4.2-6-10.8-6-10.8Z"/><path d="M9.2 14.6a2.9 2.9 0 0 0 2.4 2.6"/>'),air:()=>y([[6,7],[12,7],[18,7],[9,12],[15,12],[6,17],[12,17],[18,17]].map(([a,t])=>`<circle cx="${a}" cy="${t}" r="1.15" fill="currentColor" stroke="none"/>`).join("")),arrow:()=>'<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 3.5 3.8 10.6l7.4 2.2 2.2 7.4Z" fill="currentColor"/></svg>'};function K(a,t=!0){switch(a){case"clear":return t?g.sun():g.moon();case"partly":return g.partly(t);case"fog":return g.fog();case"drizzle":return g.drizzle();case"rain":return g.rain();case"snow":return g.snow();case"storm":return g.storm();default:return g.cloudy()}}var Ft={};_(Ft,{DEFAULT_PLACE:()=>X,_resetWeatherCache:()=>fe,aqiBand:()=>bt,defaultUnits:()=>yt,describeCode:()=>Nt,geocode:()=>jt,getWeather:()=>Q,isoClock:()=>kt,nextSunEvent:()=>$t,normalise:()=>Ot,resolveAndFetch:()=>xt,sampleWeather:()=>vt});var ce="https://api.open-meteo.com/v1/forecast",le="https://air-quality-api.open-meteo.com/v1/air-quality",de="https://geocoding-api.open-meteo.com/v1/search",X={name:"London",latitude:51.5072,longitude:-.1276},ue=15*6e4,J=new Map,W=new Map,he={0:["Clear","clear"],1:["Mostly Clear","clear"],2:["Partly Cloudy","partly"],3:["Overcast","cloudy"],45:["Fog","fog"],48:["Freezing Fog","fog"],51:["Light Drizzle","drizzle"],53:["Drizzle","drizzle"],55:["Heavy Drizzle","drizzle"],56:["Freezing Drizzle","drizzle"],57:["Freezing Drizzle","drizzle"],61:["Light Rain","rain"],63:["Rain","rain"],65:["Heavy Rain","rain"],66:["Freezing Rain","rain"],67:["Freezing Rain","rain"],71:["Light Snow","snow"],73:["Snow","snow"],75:["Heavy Snow","snow"],77:["Snow Grains","snow"],80:["Showers","rain"],81:["Showers","rain"],82:["Heavy Showers","rain"],85:["Snow Showers","snow"],86:["Snow Showers","snow"],95:["Thunderstorm","storm"],96:["Thunderstorm","storm"],99:["Thunderstorm","storm"]};function Nt(a){let[t,e]=he[a]??["Unknown","cloudy"];return{label:t,sky:e}}var me=new Set(["US","LR","MM","BS","BZ","KY","PW","FM","MH"]);function yt(a="en-GB"){try{let t=new Intl.Locale(a).maximize().region;return me.has(t)?"imperial":"metric"}catch{return"metric"}}function bt(a,t="eu"){return a==null||Number.isNaN(a)?"":(t==="us"?[[50,"Good"],[100,"Moderate"],[150,"Unhealthy for some"],[200,"Unhealthy"],[300,"Very unhealthy"],[1/0,"Hazardous"]]:[[20,"Good"],[40,"Fair"],[60,"Moderate"],[80,"Poor"],[100,"Very poor"],[1/0,"Extremely poor"]]).find(([n])=>a<=n)[1]}function Ot(a,t,{units:e="metric",place:n=""}={}){let i=a.current??{},r=a.daily??{},{label:s,sky:o}=Nt(i.weather_code),c=e==="imperial"?"us":"eu",h=t?.current?t.current[c==="us"?"us_aqi":"european_aqi"]:null;return{sample:!1,place:n,units:e,time:i.time??null,temperature:i.temperature_2m,apparent:i.apparent_temperature??null,humidity:i.relative_humidity_2m,wind:i.wind_speed_10m,windDirection:i.wind_direction_10m??null,code:i.weather_code,condition:s,sky:o,isDay:i.is_day!==0,high:r.temperature_2m_max?.[0],low:r.temperature_2m_min?.[0],sunrise:r.sunrise??[],sunset:r.sunset??[],aqi:h==null?null:Math.round(h),aqiScale:c,utcOffsetSeconds:a.utc_offset_seconds??0,timezone:a.timezone??null}}function vt({units:a="metric",place:t=X.name}={}){let e=r=>a==="imperial"?Math.round(r*1.8+32):r,n=new Date,i=(r,s)=>`${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,"0")}-${String(n.getDate()).padStart(2,"0")}T${String(r).padStart(2,"0")}:${String(s).padStart(2,"0")}`;return{sample:!0,place:t,units:a,time:null,temperature:e(14),apparent:e(12),humidity:76,wind:a==="imperial"?7:11,windDirection:240,code:2,condition:"Partly Cloudy",sky:"partly",isDay:!0,high:e(16),low:e(9),sunrise:[i(7,31)],sunset:[i(17,52)],aqi:a==="imperial"?21:18,aqiScale:a==="imperial"?"us":"eu",utcOffsetSeconds:0,timezone:null}}async function wt(a,t){let e=await fetch(a,{signal:t});if(!e.ok)throw new Error(`HTTP ${e.status}`);return e.json()}function jt(a){let t=a.trim().toLowerCase();if(!W.has(t)){let e=`${de}?name=${encodeURIComponent(a.trim())}&count=1&format=json`;W.set(t,wt(e).then(n=>{let i=n.results?.[0];if(!i)throw new Error(`No place called "${a}"`);return{name:i.name,latitude:i.latitude,longitude:i.longitude,timezone:i.timezone}}).catch(n=>{throw W.delete(t),n}))}return W.get(t)}function Q({latitude:a,longitude:t,units:e="metric",place:n=""}){let i=`${a.toFixed(3)},${t.toFixed(3)},${e}`,r=J.get(i);if(r&&Date.now()-r.at<ue)return r.promise;let s=e==="imperial",o=new URLSearchParams({latitude:String(a),longitude:String(t),current:"temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m,wind_direction_10m,is_day",daily:"temperature_2m_max,temperature_2m_min,sunrise,sunset",timezone:"auto",forecast_days:"2",temperature_unit:s?"fahrenheit":"celsius",wind_speed_unit:s?"mph":"kmh"}),c=new URLSearchParams({latitude:String(a),longitude:String(t),current:"european_aqi,us_aqi"}),h=Promise.all([wt(`${ce}?${o}`),wt(`${le}?${c}`).catch(()=>null)]).then(([u,l])=>Ot(u,l,{units:e,place:n})).catch(u=>(J.delete(i),console.warn(`[bezel] Weather unavailable (${u.message}). Showing sample data.`),vt({units:e,place:n})));return J.set(i,{at:Date.now(),promise:h}),h}async function xt({latitude:a,longitude:t,location:e,units:n}){let i=parseFloat(a),r=parseFloat(t);if(Number.isFinite(i)&&Number.isFinite(r))return Q({latitude:i,longitude:r,units:n,place:e||""});if(e)try{let s=await jt(e);return Q({latitude:s.latitude,longitude:s.longitude,units:n,place:s.name})}catch(s){return console.warn(`[bezel] ${s.message}. Showing sample data.`),vt({units:n,place:e})}return Q({...X,units:n,place:X.name})}function $t(a,t){let e=t??a.time??"",n=[...a.sunrise.map(i=>({kind:"sunrise",time:i})),...a.sunset.map(i=>({kind:"sunset",time:i}))].sort((i,r)=>i.time.localeCompare(r.time));return n.find(i=>i.time>e)??n.find(i=>i.kind==="sunset")??null}function kt(a,t){let e=/T(\d{2}):(\d{2})/.exec(a??"");if(!e)return"--:--";let n=Number(e[1]);return t?`${n%12||12}:${e[2]}`:`${e[1]}:${e[2]}`}function fe(){J.clear(),W.clear()}var A=["latitude","longitude","location","units","refresh"],T=class{data=null;#t;#e=0;#n=0;#a=!1;constructor(t){this.#t=t}get units(){let t=this.#t.getAttribute("units");return t==="imperial"||t==="metric"?t:yt(this.#t.locale)}start(){this.#a||this.load()}stop(){clearTimeout(this.#e),this.#e=0}set(t){this.#a=t!=null,this.stop(),this.data=t,this.#t.invalidate()}async load(){this.stop();let t=++this.#n,e=this.#t,n=await xt({latitude:e.getAttribute("latitude"),longitude:e.getAttribute("longitude"),location:e.getAttribute("location"),units:this.units});if(t!==this.#n||this.#a)return;this.data=n,e.invalidate(),e.dispatchEvent(new CustomEvent("bezel-weather",{detail:n,bubbles:!0,composed:!0}));let i=Math.max(5,parseFloat(e.getAttribute("refresh"))||15);this.#e=setTimeout(()=>this.load(),n.sample?6e4:i*6e4)}};var Wt={"clear-day":["#1F6FCF","#4F9BE6","#A9D3F5"],"clear-night":["#070D22","#14224A","#2B3F73"],"partly-day":["#3779C8","#6EA6DF","#B8D6F0"],"partly-night":["#0E1630","#1E2C52","#37466E"],"cloudy-day":["#5D7186","#8A9CAE","#B9C5D0"],"cloudy-night":["#141A24","#262F3D","#3C4657"],"fog-day":["#7F8A95","#A6AFB7","#CDD2D6"],"fog-night":["#1C2129","#323843","#4A515C"],"drizzle-day":["#4C6175","#72879B","#9AAABA"],"drizzle-night":["#121922","#222D3A","#344152"],"rain-day":["#3E5166","#5E7389","#8597A9"],"rain-night":["#0D131B","#1C2633","#2C3848"],"snow-day":["#7E93AA","#AEBFCF","#DCE5ED"],"snow-night":["#1D2636","#36435A","#56647C"],"storm-day":["#262B38","#3E4456","#5B6276"],"storm-night":["#0B0D13","#1A1E29","#2C3141"]},pe={clear:0,partly:3,cloudy:6,fog:0,drizzle:6,rain:6,snow:5,storm:6};function ge(a,t){return[[52,10,62,.62,52],[-12,22,66,.55,64],[30,34,58,.42,58],[66,48,52,.38,72],[-6,58,56,.3,60],[40,66,60,.26,80]].slice(0,a).map(([n,i,r,s,o],c)=>`<i class="cloud" style="--x:${n}cqw;--y:${i}cqh;--w:${r}cqw;--o:${(s*(t?.55:1)).toFixed(2)};--d:${o}s;--delay:${-c*7}s"></i>`).join("")}var H=class extends w{static attributes=[...A,"hide-time","still"];static defaultTheme="sky";static themes={sky:{surface:"#4F9BE6",ink:"#FFFFFF",accent:"#FFFFFF"}};static styles=`
    .sky { position: absolute; inset: 0; overflow: hidden; pointer-events: none; background: linear-gradient(180deg, var(--s0) 0%, var(--s1) 55%, var(--s2) 100%); }
    .sky::after { content: ""; position: absolute; inset: 0; z-index: 2;
      background: linear-gradient(180deg, rgba(8,20,40,.30) 0%, rgba(8,20,40,.08) 30%, rgba(8,20,40,0) 52%, rgba(8,20,40,0) 70%, rgba(8,20,40,.18) 100%); }
    .sun { position: absolute; inset-block-start: -22cqh; inset-inline-end: -18cqw; inline-size: 80cqw; aspect-ratio: 1; border-radius: 50%;
      background: radial-gradient(circle, rgba(255,246,214,.75) 0%, rgba(255,226,150,.28) 26%, rgba(255,226,150,0) 62%); }
    .stars { position: absolute; inset: 0; opacity: .8;
      background-image:
        radial-gradient(0.35cqw 0.35cqw at 12% 18%, #fff 50%, transparent 52%),
        radial-gradient(0.25cqw 0.25cqw at 28% 9%, #fff 50%, transparent 52%),
        radial-gradient(0.3cqw 0.3cqw at 47% 22%, #fff 50%, transparent 52%),
        radial-gradient(0.22cqw 0.22cqw at 66% 12%, #fff 50%, transparent 52%),
        radial-gradient(0.32cqw 0.32cqw at 84% 26%, #fff 50%, transparent 52%),
        radial-gradient(0.2cqw 0.2cqw at 74% 40%, #fff 50%, transparent 52%),
        radial-gradient(0.26cqw 0.26cqw at 18% 44%, #fff 50%, transparent 52%),
        radial-gradient(0.2cqw 0.2cqw at 92% 8%, #fff 50%, transparent 52%);
      animation: twinkle 6s ease-in-out infinite alternate; }
    .cloud { position: absolute; inset-inline-start: var(--x); inset-block-start: var(--y); inline-size: var(--w); aspect-ratio: 2.2; opacity: var(--o);
      background:
        radial-gradient(38% 62% at 30% 62%, #fff 0 58%, transparent 72%),
        radial-gradient(34% 70% at 55% 42%, #fff 0 56%, transparent 72%),
        radial-gradient(30% 54% at 78% 64%, #fff 0 56%, transparent 72%),
        radial-gradient(60% 40% at 52% 78%, #fff 0 60%, transparent 76%);
      filter: blur(0.9cqw);
      animation: drift var(--d) ease-in-out var(--delay) infinite alternate; }
    .fogband { position: absolute; inset-inline: -20cqw; block-size: 18cqh; border-radius: 50%;
      background: radial-gradient(50% 50% at 50% 50%, rgba(255,255,255,.55), transparent 70%);
      filter: blur(1.5cqw); animation: drift 40s ease-in-out infinite alternate; }
    .rain { position: absolute; inset: -20cqh 0 0; opacity: .38;
      background-image: repeating-linear-gradient(104deg, transparent 0 2.6cqw, rgba(255,255,255,.75) 2.6cqw 2.75cqw, transparent 2.75cqw 5.2cqw);
      -webkit-mask-image: repeating-linear-gradient(180deg, #000 0 4cqh, transparent 4cqh 9cqh);
              mask-image: repeating-linear-gradient(180deg, #000 0 4cqh, transparent 4cqh 9cqh);
      animation: fall .55s linear infinite; }
    .rain.light { opacity: .22; animation-duration: .9s; }
    .snowfall { position: absolute; inset: -40cqh 0 0;
      background-image:
        radial-gradient(0.7cqw 0.7cqw at 20% 10%, rgba(255,255,255,.9) 50%, transparent 55%),
        radial-gradient(0.5cqw 0.5cqw at 60% 30%, rgba(255,255,255,.85) 50%, transparent 55%),
        radial-gradient(0.8cqw 0.8cqw at 80% 60%, rgba(255,255,255,.9) 50%, transparent 55%),
        radial-gradient(0.55cqw 0.55cqw at 35% 75%, rgba(255,255,255,.8) 50%, transparent 55%);
      background-size: 30cqw 30cqh;
      animation: snow 9s linear infinite; }
    .flash { position: absolute; inset: 0; background: #fff; opacity: 0; animation: flash 7s infinite; }
    :host([still]) .sky * { animation: none !important; }
    @keyframes drift { to { translate: 9cqw 0; } }
    @keyframes fall { to { translate: -2.2cqw 9cqh; } }
    @keyframes snow { to { translate: 3cqw 30cqh; } }
    @keyframes twinkle { to { opacity: .45; } }
    @keyframes flash { 0%, 91%, 93%, 95%, 100% { opacity: 0; } 92%, 94% { opacity: .35; } }

    .content { position: absolute; inset: 0; display: grid; grid-template-rows: auto 1fr auto; padding: 8cqw 8cqw 7.5cqw;
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
    .loading .temp, .loading .stats { opacity: .35; }
  `;#t=new T(this);connected(){this.#t.start()}disconnected(){this.#t.stop()}attributeChanged(t){A.includes(t)&&t!=="refresh"&&this.#t.start()}get weather(){return this.#t.data}set weather(t){this.#t.set(t)}get tickRate(){return this.flag("hide-time")?null:"second"}template(){let t=this.#t.data,e=t?t.sky:"partly",n=t?t.isDay:!0,[i,r,s]=Wt[`${e}-${n?"day":"night"}`]??Wt["partly-day"],o=[];e==="clear"&&n&&o.push('<i class="sun"></i>'),!n&&(e==="clear"||e==="partly")&&o.push('<i class="stars"></i>'),e==="partly"&&n&&o.push('<i class="sun" style="opacity:.7"></i>'),o.push(ge(pe[e]??3,!n)),e==="fog"&&o.push('<i class="fogband" style="top:22cqh"></i><i class="fogband" style="top:52cqh;animation-delay:-12s"></i><i class="fogband" style="top:74cqh;animation-delay:-24s"></i>'),e==="drizzle"&&o.push('<i class="rain light"></i>'),(e==="rain"||e==="storm")&&o.push('<i class="rain"></i>'),e==="snow"&&o.push('<i class="snowfall"></i>'),e==="storm"&&o.push('<i class="flash"></i>');let c=l=>l==null||Number.isNaN(l)?"--":`${Math.round(l)}\xB0`,h=t?.place||this.getAttribute("location")||"",u="";if(t){let l=$t(t),f=t.units==="imperial"?"mph":"km/h";u=`
        <div class="stat">${l?.kind==="sunrise"?g.sunrise():g.sunset()}<b class="num">${kt(l?.time,this.hour12)}</b><span>${l?.kind==="sunrise"?"Sunrise":"Sunset"}</span></div>
        <div class="stat">${g.wind()}<b class="num">${Math.round(t.wind??0)}<small>${f}</small></b><span>Wind</span></div>
        <div class="stat">${g.humidity()}<b class="num">${Math.round(t.humidity??0)}%</b><span>Humidity</span></div>
        <div class="stat">${g.air()}<b class="num">${t.aqi??"--"}</b><span>AQI</span></div>`}return`
      <div class="sky" aria-hidden="true" style="--s0:${i};--s1:${r};--s2:${s}">${o.join("")}</div>
      <div class="content${t?"":" loading"}" aria-hidden="true">
        <div class="top">
          <div class="meta">
            <div class="place">${p(h)}${t?.sample?'<span class="sample">Sample</span>':""}</div>
            <div class="cond">${K(e,n)}<span>${p(t?t.condition:"Loading")}</span></div>
            <div class="hl">H:${c(t?.high)} L:${c(t?.low)}</div>
          </div>
          ${this.flag("hide-time")?"":'<div class="time"></div>'}
        </div>
        <div class="temp">${c(t?.temperature)}</div>
        <div class="stats">${u}</div>
      </div>`}update(t){let e=this.$(".time");if(!e)return;let n=B(t.hours,t.minutes,this.hour12);e.textContent!==n&&(e.textContent=n)}describe(){let t=this.#t.data;if(!t)return"Weather, loading";let e=t.aqi!=null?`, air quality ${bt(t.aqi,t.aqiScale).toLowerCase()}`:"";return`Weather${t.place?` in ${t.place}`:""}: ${Math.round(t.temperature)} degrees, ${t.condition.toLowerCase()}, high ${Math.round(t.high)}, low ${Math.round(t.low)}${e}${t.sample?" (sample data)":""}`}};b("bezel-weather",H);var Ct={};_(Ct,{expandEvents:()=>qt,normaliseEvents:()=>et,parseICS:()=>tt,parseICSDate:()=>E});var z=864e5,we={SU:0,MO:1,TU:2,WE:3,TH:4,FR:5,SA:6};function ye(a){return a.replace(/\r\n/g,`
`).replace(/\n[ \t]/g,"")}function Ht(a){return a.replace(/\\n/gi,`
`).replace(/\\([,;\\])/g,"$1")}function be(a){let t=a.search(/:(?=(?:[^"]*"[^"]*")*[^"]*$)/);if(t<0)return null;let e=a.slice(0,t),n=a.slice(t+1),[i,...r]=e.split(";"),s={};for(let o of r){let c=o.indexOf("=");c>0&&(s[o.slice(0,c).toUpperCase()]=o.slice(c+1).replace(/^"|"$/g,""))}return{name:i.toUpperCase(),params:s,value:n}}function E(a,t={},e){let n=/^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2})?(Z)?)?$/.exec(a.trim());if(!n)return null;let[,i,r,s,o,c,h,u]=n;if(o===void 0||t.VALUE==="DATE")return{ms:k(+i,+r-1,+s,0,0,0,e),allDay:!0,ymd:[+i,+r-1,+s]};let l=[+i,+r-1,+s,+o,+c,+(h??0)];if(u)return{ms:Date.UTC(...l),allDay:!1};let f=t.TZID&&!t.TZID.startsWith("/")?t.TZID:e,m;try{m=k(...l,f)}catch{m=k(...l,e)}return{ms:m,allDay:!1}}function ve(a){let t={};for(let e of a.split(";")){let[n,i]=e.split("=");n&&i&&(t[n.toUpperCase()]=i)}return t}function tt(a,{timeZone:t}={}){let e=[],n=null;for(let i of ye(String(a??"")).split(`
`)){let r=i.trimEnd();if(r==="BEGIN:VEVENT"){n={uid:"",title:"",location:"",start:null,end:null,allDay:!1,rrule:null,exdates:new Set,recurrenceId:null,cancelled:!1};continue}if(r==="END:VEVENT"){n&&n.start!=null&&!n.cancelled&&((n.end==null||n.end<n.start)&&(n.end=n.start+(n.allDay?z:0)),e.push(n)),n=null;continue}if(!n)continue;let s=be(r);if(s)switch(s.name){case"UID":n.uid=s.value;break;case"SUMMARY":n.title=Ht(s.value);break;case"LOCATION":n.location=Ht(s.value);break;case"STATUS":n.cancelled=s.value.toUpperCase()==="CANCELLED";break;case"DTSTART":{let o=E(s.value,s.params,t);o&&(n.start=o.ms,n.allDay=o.allDay);break}case"DTEND":{let o=E(s.value,s.params,t);o&&(n.end=o.ms);break}case"DURATION":{let o=/P(?:(\d+)W)?(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?/.exec(s.value);if(o&&n.start!=null){let[,c=0,h=0,u=0,l=0,f=0]=o.map(m=>m===void 0?0:+m);n.end=n.start+(((+c*7+ +h)*24+ +u)*60+ +l)*6e4+ +f*1e3}break}case"RRULE":n.rrule=ve(s.value);break;case"EXDATE":for(let o of s.value.split(",")){let c=E(o,s.params,t);c&&n.exdates.add(c.ms)}break;case"RECURRENCE-ID":{let o=E(s.value,s.params,t);o&&(n.recurrenceId=o.ms);break}}}return e}function Yt(a,t){let e=new Date(a),n=e.getUTCDate();e.setUTCDate(1),e.setUTCMonth(e.getUTCMonth()+t);let i=new Date(Date.UTC(e.getUTCFullYear(),e.getUTCMonth()+1,0)).getUTCDate();return n>i?null:(e.setUTCDate(n),e.getTime())}function*xe(a,t){let e=a.rrule,n=e.FREQ,i=Math.max(1,parseInt(e.INTERVAL??"1",10)||1),r=e.COUNT?parseInt(e.COUNT,10):1/0,s=e.UNTIL?E(e.UNTIL)?.ms??1/0:1/0,o=Math.min(t,s),c=0,h=5e3;if(n==="WEEKLY"&&e.BYDAY){let u=e.BYDAY.split(",").map(m=>we[m.slice(-2)]).filter(m=>m!=null).sort(),l=new Date(a.start).getUTCDay(),f=a.start-l*z;for(let m=0;m<h&&c<r;m+=i)for(let F of u){let x=f+m*7*z+F*z;if(!(x<a.start)){if(x>o||c>=r)return;c++,yield x}}return}for(let u=0;u<h&&c<r;u++){let l;if(n==="DAILY")l=a.start+u*i*z;else if(n==="WEEKLY")l=a.start+u*i*7*z;else if(n==="MONTHLY")l=Yt(a.start,u*i);else if(n==="YEARLY")l=Yt(a.start,u*i*12);else return;if(l!=null){if(l>o)return;c++,yield l}}}function qt(a,t,e){let n=new Map;for(let r of a)r.recurrenceId!=null&&n.set(`${r.uid}@${r.recurrenceId}`,r);let i=[];for(let r of a){if(r.recurrenceId!=null){r.end>t&&r.start<e&&i.push(r);continue}let s=r.end-r.start;if(!r.rrule){r.end>t&&r.start<e&&i.push(r);continue}for(let o of xe(r,e)){if(r.exdates.has(o)||n.has(`${r.uid}@${o}`))continue;let c=o+s;c>t&&o<e&&i.push({...r,start:o,end:c,rrule:null})}}return i.sort((r,s)=>r.start-s.start||r.title.localeCompare(s.title))}function et(a){return Array.isArray(a)?a.map(t=>{let e=new Date(t.start).getTime();if(!Number.isFinite(e))return null;let n=t.end!=null?new Date(t.end).getTime():e;return{uid:t.id??"",title:String(t.title??t.summary??"Untitled"),location:String(t.location??""),start:e,end:Number.isFinite(n)?n:e,allDay:!!t.allDay,rrule:null,exdates:new Set,recurrenceId:null}}).filter(Boolean):[]}var S=50;function $e(){let a=Array.from({length:60},(e,n)=>{let i=n%5===0;return`<line class="t${i?" M":""}" x1="${S}" y1="${i?7.5:8.6}" x2="${S}" y2="${4.6}" transform="rotate(${n*6} ${S} ${S})"/>`}).join(""),t=Array.from({length:12},(e,n)=>{let i=n+1,r=i*Math.PI/6;return`<text x="${(S+Math.sin(r)*33).toFixed(2)}" y="${(S-Math.cos(r)*33).toFixed(2)}" text-anchor="middle" dominant-baseline="central">${i}</text>`}).join("");return`<svg class="dial" viewBox="0 0 100 100" aria-hidden="true">
    <circle class="plate" cx="50" cy="50" r="48"/>
    ${a}${t}
    <g class="h hr"><line x1="50" y1="50" x2="50" y2="44"/><line class="w" x1="50" y1="44" x2="50" y2="27"/></g>
    <g class="h mn"><line x1="50" y1="50" x2="50" y2="44"/><line class="w" x1="50" y1="44" x2="50" y2="13"/></g>
    <g class="h sc"><line x1="50" y1="58" x2="50" y2="8"/></g>
    <circle class="hub" cx="50" cy="50" r="2.4"/><circle class="pin" cx="50" cy="50" r="0.9"/>
  </svg>`}var Y=class extends w{static attributes=[...A,"events","ics","max-events","hide-weather"];static defaultTheme="mist";static themes={mist:{surface:"#B9C6CE",ink:"#0F1316",accent:"#FFFFFF",soft:"#DCE3E8"},orchid:{surface:"#D98CF2",ink:"#160F1A",accent:"#4A35D4",soft:"#EBC4F8"},sand:{surface:"#E9DCC6",ink:"#1E1913",accent:"#C2410C",soft:"#F5EDE0"},slate:{surface:"#1C2127",ink:"#EEF1F4",accent:"#7CC4FF",soft:"#2B323A"}};static styles=`
    .screen { background: radial-gradient(120% 100% at 20% 0%, color-mix(in srgb, var(--_surface), #fff 10%), var(--_surface) 60%); }
    .g { position: absolute; inset: 0; display: grid; grid-template: 1fr auto / 1fr 1fr; gap: 3cqw 5cqw; padding: 8cqw; }
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
    .dial .h line { stroke: var(--_ink); stroke-linecap: round; stroke-width: 1.4; }
    .dial .h line.w { stroke-width: 3.6; }
    .dial .sc line { stroke: var(--_accent); stroke-width: .9; }
    .dial .hub { fill: var(--_ink); } .dial .pin { fill: var(--_accent); }
    .dial .h { filter: drop-shadow(0 .4px .5px rgba(0,0,0,.2)); }

    .agenda { display: grid; align-content: end; gap: 2.2cqw; min-inline-size: 0; }
    .ev { display: grid; gap: .2cqw; padding-inline-start: 2.6cqw; border-inline-start: 0.9cqw solid var(--_accent); min-inline-size: 0; }
    .ev .when { font-size: 3.6cqw; font-weight: 700; color: var(--_accent); font-variant-numeric: tabular-nums; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
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
    .sample { font-size: 2.8cqw; letter-spacing: .06em; text-transform: uppercase; opacity: .6; }
  `;#t=new T(this);#e=null;#n=0;#a=0;connected(){this.flag("hide-weather")||this.#t.start(),this.#i()}disconnected(){this.#t.stop(),clearTimeout(this.#n)}attributeChanged(t){A.includes(t)&&t!=="refresh"&&this.#t.start(),t==="hide-weather"&&(this.flag("hide-weather")?this.#t.stop():this.#t.start()),(t==="events"||t==="ics")&&this.#i()}get weather(){return this.#t.data}set weather(t){this.#t.set(t)}get events(){return this.#e}set events(t){this.#e=et(t),this.invalidate()}set icsText(t){this.#e=tt(t,{timeZone:this.timeZone}),this.invalidate()}async#i(){clearTimeout(this.#n);let t=this.getAttribute("events");if(t){try{this.#e=et(JSON.parse(t))}catch{console.warn("[bezel] The events attribute is not valid JSON."),this.#e=[]}this.invalidate();return}let e=this.getAttribute("ics");if(!e)return;let n=++this.#a;try{let i=await fetch(e);if(!i.ok)throw new Error(`HTTP ${i.status}`);let r=await i.text();if(n!==this.#a)return;this.#e=tt(r,{timeZone:this.timeZone}),this.invalidate()}catch(i){console.warn(`[bezel] Could not load the calendar feed (${i.message}). Many feeds block browsers; see the README for options.`)}this.#n=setTimeout(()=>this.#i(),15*6e4)}get tickRate(){return this.reducedMotion?"second":"frame"}#s(t){if(!this.#e)return null;let e=k(t.year,t.month,t.day,0,0,0,this.timeZone),n=k(t.year,t.month,t.day+1,0,0,0,this.timeZone),i=Math.max(1,parseInt(this.getAttribute("max-events"),10)||3);return qt(this.#e,e,n).filter(r=>r.end>t.ms||r.allDay&&r.end>e).slice(0,i)}#o(t){if(t.allDay)return"All day";let e={hour:"numeric",minute:"2-digit",hour12:this.hour12,timeZone:this.timeZone};try{let n=new Intl.DateTimeFormat(this.locale,e);return t.end>t.start?n.formatRange(t.start,t.end):n.format(t.start)}catch{return new Date(t.start).toLocaleTimeString()}}template(t){let e=v(this.locale),n=this.#s(t),i;if(n)i=n.length?`<div class="agenda">${n.map(s=>`<div class="ev${s.start<=t.ms&&s.end>t.ms&&!s.allDay?" now":""}"><span class="when">${p(this.#o(s))}</span><span class="what">${p(s.title)}</span></div>`).join("")}</div>`:'<div class="agenda"><span class="none">Nothing else today</span></div>';else{let s=ut(t.year,t.month,t.day),o=ht(t.year),c=Math.round(s/o*100);i=`<div class="year">
        <span class="wk">Week ${V(t.year,t.month,t.day)}</span>
        <span class="big num">${c}%</span>
        <div class="bar"><i style="inline-size:${(s/o*100).toFixed(2)}%"></i></div>
        <span class="lbl">Day ${s} of ${o}</span>
      </div>`}let r;if(this.flag("hide-weather"))r=`<div class="wx"><span class="place"><span>${p(e.monthLong[t.month])}</span></span><span class="temp num">${V(t.year,t.month,t.day)}</span><span class="cond">Week of the year</span></div>`;else{let s=this.#t.data,o=h=>h==null?"--":`${Math.round(h)}\xB0`,c=s?.place||this.getAttribute("location")||"";r=`<div class="wx">
        <span class="place">${g.arrow()}<span>${p(c)}</span>${s?.sample?'<span class="sample">Sample</span>':""}</span>
        <span class="temp num">${o(s?.temperature)}</span>
        <span class="cond">${s?K(s.sky,s.isDay):""}<span>${p(s?s.condition:"Loading")}</span></span>
        <span class="hl">H:${o(s?.high)} L:${o(s?.low)}</span>
      </div>`}return`<div class="g" aria-hidden="true">
      <div class="date"><span class="md"><b>${p(e.weekdayShort[t.weekday].replace(".",""))}</b> ${p(e.monthShort[t.month].replace(".",""))}</span><span class="dd">${t.day}</span></div>
      <div class="clock">${$e()}</div>
      ${i}
      ${r}
    </div>`}#r=-1;update(t,e){let n=U(t,{smooth:this.tickRate==="frame"});this.$(".hr")?.setAttribute("transform",`rotate(${n.hour.toFixed(3)} 50 50)`),this.$(".mn")?.setAttribute("transform",`rotate(${n.minute.toFixed(3)} 50 50)`),this.$(".sc")?.setAttribute("transform",`rotate(${n.second.toFixed(3)} 50 50)`),!e&&t.minutes!==this.#r&&this.#e&&this.invalidate(),this.#r=t.minutes}describe(t){let e=new Intl.DateTimeFormat(this.locale,{dateStyle:"full",timeZone:"UTC"}).format(Date.UTC(t.year,t.month,t.day)),n=this.#t.data;return`${e}${n?`. ${Math.round(n.temperature)} degrees and ${n.condition.toLowerCase()}${n.place?` in ${n.place}`:""}`:""}`}};b("bezel-glance",Y);var P=class extends w{static attributes=["week-start","month","no-highlight"];static defaultFrame="none";static defaultTheme="noir";static themes={noir:{surface:"#000000",ink:"#FFFFFF",accent:"#FF4D2E",rule:"rgba(255,255,255,.22)"},paper:{surface:"#F7F7F5",ink:"#0B0B0B",accent:"#E5322D",rule:"rgba(0,0,0,.16)"},signal:{surface:"#E5322D",ink:"#FFFFFF",accent:"#111111",rule:"rgba(255,255,255,.3)"},bone:{surface:"#E8E4DA",ink:"#1C1B19",accent:"#2346D8",rule:"rgba(0,0,0,.16)"}};static styles=`
    :host { aspect-ratio: var(--bezel-aspect, 4 / 3); --_rim-r: var(--bezel-radius, 4cqw); }
    .frame--none .screen { border-radius: var(--_rim-r); }
    .p { position: absolute; inset: 0; display: grid; grid-template-rows: auto 1fr; padding: 4.2cqw 2.4cqw 2cqw; }
    .title { justify-self: end; font-size: 4cqw; font-weight: 700; letter-spacing: -0.02em; padding-inline-end: 6cqw; margin-block-end: 2cqh; font-variant-numeric: lining-nums; }
    .cols { display: grid; grid-template-columns: repeat(7, 1fr); min-block-size: 0; }
    .col { display: grid; grid-template-rows: repeat(var(--rows), 1fr); border-inline-start: max(1px, 0.14cqw) solid var(--_rule); padding-inline-start: 0.5cqw; min-inline-size: 0; }
    .col:first-child { border-inline-start-color: transparent; }
    .c { font-size: var(--fs); font-weight: 700; line-height: .84; letter-spacing: -0.05em; align-self: end; white-space: nowrap;
         font-variant-numeric: lining-nums proportional-nums; font-feature-settings: "lnum" 1, "pnum" 1; }
    .c.h { letter-spacing: -0.02em; }
    .c.today { color: var(--_accent); }
  `;get tickRate(){return"minute"}template(t){let e=D(this.getAttribute("month")),n=e?.year??t.year,i=e?.month??t.month,r=I(this.getAttribute("week-start"),this.locale),s=v(this.locale),o=L(n,i,{weekStart:r,fillAdjacent:!1}),c=o.length+1,h=!this.flag("no-highlight")&&n===t.year&&i===t.month,u=`min(calc((100cqh - 15cqh) / ${c} * 1.14), 11cqw)`,l=N(r).map((f,m)=>{let F=`<span class="c h">${p(s.weekdayNarrow[f])}</span>`,x=o.map(Pt=>{let nt=Pt[m];return nt?`<span class="c${h&&nt.day===t.day?" today":""}">${nt.day}</span>`:'<span class="c"></span>'}).join("");return`<div class="col">${F}${x}</div>`}).join("");return`<div class="p" style="--rows:${c};--fs:${u}" aria-hidden="true">
      <div class="title">${n} ${p(s.monthLong[i])}</div>
      <div class="cols">${l}</div>
    </div>`}describe(t){let e=D(this.getAttribute("month"));return`Calendar for ${new Intl.DateTimeFormat(this.locale,{month:"long",year:"numeric",timeZone:"UTC"}).format(Date.UTC(e?.year??t.year,e?.month??t.month,15))}`}};b("bezel-poster",P);var ke="1.0.0";return Jt(Fe);})();

/* Small, self-contained asset illustrations. Motion is decorative, independent of model direction. */
window.AssetArtwork={
gold:`<svg viewBox="0 0 140 84" aria-hidden="true" focusable="false">
  <defs>
    <linearGradient id="gold-top" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fff0a5"/><stop offset=".48" stop-color="#f5cd60"/><stop offset="1" stop-color="#ba771d"/></linearGradient>
    <linearGradient id="gold-front" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#edbe49"/><stop offset=".5" stop-color="#bc7d20"/><stop offset="1" stop-color="#ecc15c"/></linearGradient>
    <linearGradient id="gold-side"><stop stop-color="#c18c28"/><stop offset="1" stop-color="#805013"/></linearGradient>
    <radialGradient id="gold-glow"><stop stop-color="#f5c34d" stop-opacity=".25"/><stop offset="1" stop-color="#f5c34d" stop-opacity="0"/></radialGradient>
    <g id="gold-ingot"><path d="M8 13 20 2 56 2 68 13 56 20 0 20Z" fill="url(#gold-top)" stroke="#f8d97e" stroke-width=".6"/><path d="M0 20H56L54 34H3Z" fill="url(#gold-front)" stroke="#e9bd5a" stroke-width=".5"/><path d="M56 20 68 13 65 26 54 34Z" fill="url(#gold-side)"/><path d="M8 13 21 4H54" fill="none" stroke="#fff2b1" stroke-width="1" opacity=".7"/><path d="M4 23H52" stroke="#ffe89b" stroke-width=".8" opacity=".7"/><text x="26" y="13" fill="#a6731d" font-family="Georgia,serif" font-size="6" font-weight="bold" transform="skewX(-12)">999.9</text></g>
  </defs>
  <ellipse cx="70" cy="46" rx="69" ry="42" fill="url(#gold-glow)"/><ellipse cx="71" cy="75" rx="53" ry="5" fill="#000" opacity=".3"/>
  <g transform="translate(8 39) scale(.9)"><g class="gold-block gold-block-left"><use href="#gold-ingot"/></g></g>
  <g transform="translate(65 38) scale(.9)"><g class="gold-block gold-block-right"><use href="#gold-ingot"/></g></g>
  <g transform="translate(36 15)"><g class="gold-block gold-block-top"><use href="#gold-ingot"/><path class="gold-sheen" d="M15 4 23 4 39 31 31 31Z" fill="#fff7c9" opacity=".3"/></g></g>
  <path class="gold-spark spark-one" d="M112 13v12m-6-6h12" fill="none" stroke="#ffe9a1" stroke-width="1.3"/><path class="gold-spark spark-two" d="M21 26v8m-4-4h8" fill="none" stroke="#ffe9a1"/>
</svg>`,
dollar:`<svg viewBox="0 0 140 84" aria-hidden="true" focusable="false">
  <defs><linearGradient id="cash-paper" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#bed6a4"/><stop offset=".5" stop-color="#87ae8c"/><stop offset="1" stop-color="#d5dfaf"/></linearGradient><linearGradient id="cash-back"><stop stop-color="#5f927d"/><stop offset="1" stop-color="#aacd9e"/></linearGradient></defs>
  <ellipse cx="71" cy="76" rx="48" ry="4" fill="#000" opacity=".25"/>
  <g transform="translate(18 26) rotate(-12 52 23)"><g class="cash-back-note"><rect width="104" height="49" rx="3" fill="#527f6b" stroke="#91bda2"/><rect x="4" y="4" width="96" height="41" rx="1" fill="url(#cash-back)" stroke="#3d6852"/><path d="M14 24h76M21 17h62M21 31h62" stroke="#4c795d" stroke-width="1" opacity=".6"/><ellipse cx="53" cy="25" rx="19" ry="15" fill="#406e59" opacity=".6"/></g></g>
  <g transform="translate(15 11) rotate(6 55 25)"><g class="cash-front-note">
    <rect width="110" height="51" rx="3" fill="url(#cash-paper)" stroke="#d0e4b5" stroke-width="1"/>
    <path d="M12 4H98Q98 11 105 11V40Q98 40 98 47H12Q12 40 5 40V11Q12 11 12 4Z" fill="none" stroke="#4b7659" stroke-width="1"/>
    <path d="M17 9h21m-24 4h22m39-4h19m-19 4h22M17 37h21m37 0h19" stroke="#4b7659" stroke-width=".8" opacity=".7"/>
    <ellipse cx="55" cy="25.5" rx="17" ry="20" fill="#4b775c" stroke="#d4ddb0" stroke-width="1.4"/>
    <ellipse cx="55" cy="22" rx="7" ry="8" fill="#c8d7a6"/><path d="M42 39q1-12 13-12t13 12" fill="#c8d7a6"/><path d="m51 16 4-4 8 6-5-1-8 3Z" fill="#78956b"/>
    <text x="10" y="25" fill="#254d3b" font-family="Georgia,serif" font-size="16" font-weight="bold">100</text><text x="80" y="36" fill="#254d3b" font-family="Georgia,serif" font-size="16" font-weight="bold">100</text>
    <text x="55" y="7" text-anchor="middle" fill="#31583f" font-family="serif" font-size="3.7" letter-spacing=".3">UNITED STATES OF AMERICA</text><text x="55" y="47" text-anchor="middle" fill="#31583f" font-family="serif" font-size="4.5" letter-spacing="1">US DOLLARS</text>
    <path d="M73 5v41" stroke="#488a85" stroke-width="3" opacity=".55"/><circle cx="86" cy="20" r="5" fill="none" stroke="#416e4d"/><text x="86" y="23" text-anchor="middle" fill="#416e4d" font-size="8">$</text>
  </g></g>
  <path class="cash-air air-one" d="M9 29 4 24m10 22H4" stroke="#a2cfb1" stroke-width="1.2" opacity=".5"/>
</svg>`,
oil:`<svg viewBox="0 0 140 84" aria-hidden="true" focusable="false">
  <defs><linearGradient id="oil-black" x1="0" y1="0" x2=".85" y2="1"><stop stop-color="#596470"/><stop offset=".25" stop-color="#172129"/><stop offset=".6" stop-color="#020405"/><stop offset="1" stop-color="#28323a"/></linearGradient><linearGradient id="oil-surface" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#58616a"/><stop offset=".3" stop-color="#11191f"/><stop offset="1" stop-color="#020405"/></linearGradient><clipPath id="oil-pool-clip"><ellipse cx="70" cy="64" rx="52" ry="13"/></clipPath></defs>
  <ellipse cx="70" cy="70" rx="56" ry="8" fill="#000" opacity=".25"/>
  <ellipse cx="70" cy="64" rx="52" ry="13" fill="url(#oil-surface)" stroke="#5d666e" stroke-width=".6"/>
  <g clip-path="url(#oil-pool-clip)"><path class="oil-wave oil-wave-back" d="M-40 63q16-10 32 0t32 0 32 0 32 0 32 0 32 0 32 0v20H-40Z" fill="#05090c" stroke="#6e7880" stroke-width="1"/><path class="oil-wave oil-wave-front" d="M-40 69q16-9 32 0t32 0 32 0 32 0 32 0 32 0 32 0v20H-40Z" fill="#010203" stroke="#3b454d" stroke-width=".8"/></g>
  <g class="oil-main-drop"><path d="M70 7C64 19 49 32 49 44a21 21 0 0 0 42 0C91 32 76 19 70 7Z" fill="url(#oil-black)" stroke="#72808b" stroke-width=".7"/><path d="M64 26c-5 7-9 11-9 18 0 4 1 7 3 9" fill="none" stroke="#aab8c4" stroke-width="2.5" stroke-linecap="round" opacity=".6"/><path d="M79 50q-2 5-7 6" fill="none" stroke="#87959f" stroke-width="1" opacity=".35"/></g>
  <ellipse class="oil-ripple" cx="70" cy="64" rx="15" ry="4" fill="none" stroke="#99a8b1" stroke-width=".8"/>
  <g class="oil-small-drop"><path d="M103 25c-2 4-6 7-6 11a6 6 0 0 0 12 0c0-4-4-7-6-11Z" fill="url(#oil-black)" stroke="#6b7882" stroke-width=".5"/></g>
</svg>`,
stocks:`<svg viewBox="0 0 140 84" aria-hidden="true" focusable="false">
  <defs><linearGradient id="stock-screen" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#172733"/><stop offset="1" stop-color="#0b151e"/></linearGradient><clipPath id="stock-clip"><rect x="17" y="12" width="106" height="56" rx="2"/></clipPath><linearGradient id="stock-fill" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#84b8ee" stop-opacity=".2"/><stop offset="1" stop-color="#84b8ee" stop-opacity="0"/></linearGradient></defs>
  <rect x="11" y="6" width="118" height="68" rx="5" fill="#0b151e" stroke="#506d87"/>
  <rect x="16" y="11" width="108" height="58" rx="2" fill="url(#stock-screen)"/>
  <path d="M20 25h100M20 40h100M20 55h100M39 15v49M59 15v49M79 15v49M99 15v49" fill="none" stroke="#48637b" stroke-width=".5" opacity=".35"/>
  <g clip-path="url(#stock-clip)">
    <g class="stock-candles"><path d="M28 44v20M43 29v26M58 31v26M73 19v26M88 23v22M103 12v26M117 16v26" stroke="#8cc9b5" stroke-width="1"/>
    <rect class="stock-candle candle-one" x="24" y="48" width="8" height="10" rx=".8" fill="#90ccb7"/><rect class="stock-candle candle-two" x="39" y="33" width="8" height="15" rx=".8" fill="#90ccb7"/><rect class="stock-candle candle-three" x="54" y="36" width="8" height="15" rx=".8" fill="#cf8a84"/><rect class="stock-candle candle-four" x="69" y="24" width="8" height="14" rx=".8" fill="#90ccb7"/><rect class="stock-candle candle-five" x="84" y="26" width="8" height="13" rx=".8" fill="#cf8a84"/><rect class="stock-candle candle-six" x="99" y="17" width="8" height="15" rx=".8" fill="#90ccb7"/><rect class="stock-candle candle-seven" x="113" y="20" width="8" height="13" rx=".8" fill="#cf8a84"/></g>
    <path d="M20 60 34 53 49 56 63 41 78 46 94 35 111 38 121 29V69H20Z" fill="url(#stock-fill)"/>
    <path class="stock-trace" d="M20 60 34 53 49 56 63 41 78 46 94 35 111 38 121 29" fill="none" stroke="#8fb8ee" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round"/>
    <path class="stock-scan" d="M0 12v56" stroke="#b4d2ff" stroke-width="1" opacity=".3"/>
  </g>
  <path d="M57 78h26m-13-4v4" stroke="#58738c" stroke-width="2" stroke-linecap="round"/>
  <circle cx="20" cy="9" r="1" fill="#9bc4eb"/>
</svg>`,
bonds:`<svg viewBox="0 0 140 84" aria-hidden="true" focusable="false">
  <defs><linearGradient id="bond-paper" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#dedbf0"/><stop offset=".45" stop-color="#aaa4cb"/><stop offset="1" stop-color="#d1c9df"/></linearGradient><linearGradient id="bond-seal"><stop stop-color="#d3bd7e"/><stop offset=".5" stop-color="#f1d99a"/><stop offset="1" stop-color="#a68c50"/></linearGradient></defs>
  <ellipse cx="70" cy="77" rx="47" ry="4" fill="#000" opacity=".25"/>
  <g transform="translate(24 15) rotate(8 50 28)"><g class="bond-back"><rect width="100" height="60" rx="2" fill="#736d99" stroke="#aea6cb"/><rect x="4" y="4" width="92" height="52" rx="1" fill="none" stroke="#9891ba"/></g></g>
  <g transform="translate(16 6) rotate(-5 53 31)"><g class="bond-front">
    <path d="M3 0H103L106 3V60L103 63H3L0 60V3Z" fill="url(#bond-paper)" stroke="#e3dded" stroke-width=".7"/>
    <path d="M9 5H97L101 9V54L97 58H9L5 54V9Z" fill="none" stroke="#615984" stroke-width=".8"/>
    <path d="M79 5v53" stroke="#71698f" stroke-width=".7" stroke-dasharray="2 2"/>
    <text x="42" y="14" text-anchor="middle" font-family="Georgia,serif" font-size="6.8" font-weight="bold" fill="#40375f" letter-spacing=".8">US TREASURY</text>
    <path d="M25 27 42 18 59 27ZM29 30h26M26 43h32M29 40h26M31 30v10m7-10v10m8-10v10m7-10v10" fill="none" stroke="#665e87" stroke-width="1.2"/>
    <path d="M17 49h43M21 52h35" stroke="#777094" stroke-width=".7"/>
    <text x="88" y="18" text-anchor="middle" font-family="Georgia,serif" font-size="5" fill="#5c537d" transform="rotate(90 88 18)">T-NOTE</text>
    <g class="bond-gold-seal"><path d="m64 43-4 16 8-5 6 6 1-17Z" fill="#746695"/><path d="m69 32 3 2 4-1 1 4 3 3-3 3-1 4-4-1-3 2-2-3-4-1 1-4-1-3 4-1Z" fill="url(#bond-seal)" stroke="#a48b54" stroke-width=".5"/><circle cx="69" cy="40" r="4" fill="none" stroke="#9b834e" stroke-width=".7"/></g>
    <path class="bond-rule rule-one" d="M85 35h10M85 39h10M85 43h10" fill="none" stroke="#6a5e8b" stroke-width="1.2"/>
  </g></g>
</svg>`
};

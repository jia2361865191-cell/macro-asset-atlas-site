(function(root){
  'use strict';
  // Visual metaphors for the existing educational mechanisms, not statistical correlations.
  const base={
    'gold:dollar':['opposition','美元与利率因素主导'],
    'gold:stocks':['strategy','利率与避险力量博弈'],
    'gold:bonds':['cooperation','名义与实际利率同向变化'],
    'gold:oil':['strategy','通胀、需求与利率博弈'],
    'dollar:stocks':['strategy','相对增长与利差博弈'],
    'dollar:bonds':['strategy','利差与避险力量博弈'],
    'dollar:oil':['opposition','美元计价因素主导'],
    'stocks:bonds':['strategy','增长与通胀决定正反'],
    'stocks:oil':['cooperation','需求因素主导时'],
    'bonds:oil':['opposition','通胀与收益率因素主导']
  };
  const overrides={
    tight:{'gold:stocks':['cooperation','实际利率上行，两者承压'],'stocks:bonds':['cooperation','估值与债价共同承压']},
    soft:{'gold:stocks':['cooperation','温和宽松提供共同支持'],'stocks:bonds':['cooperation','盈利有韧性，利率回落'],'bonds:oil':['strategy','利率回落与需求共同影响']},
    recession:{'gold:dollar':['strategy','避险与降息力量交织'],'gold:stocks':['opposition','黄金避险，股票盈利承压'],'gold:oil':['opposition','避险与需求走弱分化'],'dollar:oil':['strategy','美元方向取决于多种力量'],'stocks:bonds':['opposition','盈利下修与买债避险分化']},
    oilshock:{'gold:dollar':['strategy','美元、通胀与避险交织'],'gold:bonds':['opposition','通胀上行压低美债价格'],'gold:oil':['cooperation','供给冲击伴随通胀与避险'],'dollar:oil':['strategy','供给压力可抵消汇率影响'],'stocks:oil':['opposition','油价上行，企业成本承压'],'stocks:bonds':['cooperation','通胀与成本压低股债价格']},
    cashcrisis:{'gold:stocks':['cooperation','现金紧缺可引发共同抛售'],'gold:bonds':['cooperation','现金需求压过传统避险'],'stocks:bonds':['cooperation','出售资产换取美元现金'],'stocks:oil':['cooperation','融资紧张与需求走弱'],'bonds:oil':['cooperation','现金紧缺阶段可能同弱']}
  };
  function classify(pair,{scenario='tight',custom=false,bondYield=false}={}){
    const key=pair.a+':'+pair.b;
    let [mode,context]=custom?['strategy','自定义组合，多种驱动交织']:(overrides[scenario]?.[key]||base[key]||['strategy','关系取决于驱动因素']);
    const hasBond=pair.a==='bonds'||pair.b==='bonds';
    if(hasBond&&bondYield){
      if(mode!=='strategy')mode=mode==='cooperation'?'opposition':'cooperation';
      context=mode==='strategy'?'收益率口径，驱动仍有分歧':'收益率与美债价格反向';
    }
    const titles={opposition:'双剑对峙 · 反向牵制',cooperation:'携手同行 · 同向联动',strategy:'双向博弈 · 因势而变'};
    return {mode,context,title:titles[mode],meaning:mode==='cooperation'?'同向可同涨，也可同跌':mode==='opposition'?'价格反向的比喻，非真实对手盘':'条件不同，关系可能反转'};
  }
  const board=Array.from({length:16},(_,i)=>{const r=Math.floor(i/4),c=i%4;const row=y=>({left:58-5.5*y,width:64+11*y,y:60+6.5*y});const a=row(r),b=row(r+1);return `<polygon points="${a.left+a.width*c/4},${a.y} ${a.left+a.width*(c+1)/4},${a.y} ${b.left+b.width*(c+1)/4},${b.y} ${b.left+b.width*c/4},${b.y}" fill="${(r+c)%2?'#35444f':'#b3a88c'}"/>`}).join('');
  const art={
    opposition:`<svg viewBox="0 0 180 104" aria-hidden="true" focusable="false"><defs><linearGradient id="duel-steel"><stop stop-color="#d9e8ee"/><stop offset=".46" stop-color="#8da2ae"/><stop offset=".5" stop-color="#eef6f5"/><stop offset="1" stop-color="#607683"/></linearGradient><linearGradient id="duel-gold"><stop stop-color="#a17c3c"/><stop offset=".5" stop-color="#f2d89a"/><stop offset="1" stop-color="#b78c42"/></linearGradient></defs><ellipse cx="90" cy="94" rx="55" ry="4" fill="#000" opacity=".2"/><path d="M36 69A59 59 0 0 1 144 69" fill="none" stroke="#d7b46d" stroke-width=".7" opacity=".2" stroke-dasharray="2 5"/>
      <g class="duel-left"><g transform="translate(33 90) rotate(43)"><path d="M-4-77 0-99 4-77 4-22 0-15-4-22Z" fill="url(#duel-steel)" stroke="#c6d9df" stroke-width=".5"/><path d="M0-92v70" fill="none" stroke="#fff" stroke-width=".8" opacity=".6"/><path d="M-15-20Q0-27 15-20L13-15Q0-20-13-15Z" fill="url(#duel-gold)"/><rect x="-3" y="-15" width="6" height="21" rx="2" fill="var(--relation-a,#d7b46d)"/><path d="m-3-10 6 3m-6 3 6 3" stroke="#28313a" stroke-width="1.3"/><circle cy="8" r="5" fill="url(#duel-gold)"/></g></g>
      <g class="duel-right"><g transform="translate(147 90) rotate(-43)"><path d="M-4-77 0-99 4-77 4-22 0-15-4-22Z" fill="url(#duel-steel)" stroke="#c6d9df" stroke-width=".5"/><path d="M0-92v70" fill="none" stroke="#fff" stroke-width=".8" opacity=".6"/><path d="M-15-20Q0-27 15-20L13-15Q0-20-13-15Z" fill="url(#duel-gold)"/><rect x="-3" y="-15" width="6" height="21" rx="2" fill="var(--relation-b,#82b8a3)"/><path d="m-3-10 6 3m-6 3 6 3" stroke="#28313a" stroke-width="1.3"/><circle cy="8" r="5" fill="url(#duel-gold)"/></g></g>
      <g class="duel-impact" fill="none" stroke="#ffe3a0" stroke-linecap="round"><path d="M90 17v-7m12 12 6-5M78 22l-6-5m33 15h8M75 32h-8" stroke-width="1.5"/><path d="m88 28 3-5 2 6 6 2-7 2-2 6-2-6-6-2Z" fill="#fff0b7" stroke="none"/></g></svg>`,
    cooperation:`<svg viewBox="0 0 180 104" aria-hidden="true" focusable="false"><ellipse cx="90" cy="94" rx="52" ry="3.5" fill="#000" opacity=".2"/><circle class="hand-halo" cx="90" cy="53" r="37" fill="none" stroke="#8dc8b2" stroke-width=".8" opacity=".3"/>
      <g class="hand-greeting"><image href="assets/handshake.svg" x="24" y="-19" width="132" height="132" preserveAspectRatio="xMidYMid meet"/></g>
      <g class="hand-spark" stroke="#b7dfc8" stroke-width="1.2" fill="none"><path d="M90 6v8m-27 3 5 6m49-6-5 6"/><path d="m89 4 2-2 2 2"/></g></svg>`,
    strategy:`<svg viewBox="0 0 180 104" aria-hidden="true" focusable="false"><ellipse cx="90" cy="95" rx="70" ry="4" fill="#000" opacity=".2"/>
      <g class="chess-player-left"><path d="M16 91V66m25 25V66" stroke="#52636c" stroke-width="3"/><path d="M15 70h31V47q-2-13-14-13T18 47Z" fill="var(--relation-a,#d7b46d)" stroke="#c9d4d0" stroke-width=".5"/><path d="M24 35v-7h13v8" fill="#cbad87"/><g class="chess-head-left"><path d="M40 17q7 18-6 20-16 0-17-16 0-13 13-13 12 0 13 11Z" fill="#dec49f"/><path d="M17 22q-4-18 12-18 13 0 15 13l-7-2-3-6-4 7-12 1Z" fill="#788993"/><path d="m38 22 5 4-5 2" fill="#dec49f"/></g><path d="m20 69 20 3 6 19H31l-8-15" fill="#344753"/><g class="chess-arm-left"><path d="m36 42 13 13 23 4" fill="none" stroke="#dec49f" stroke-width="8" stroke-linecap="round"/><path d="m34 41 10 11" stroke="var(--relation-a,#d7b46d)" stroke-width="12" stroke-linecap="round"/><circle cx="74" cy="59" r="4" fill="#dec49f"/></g></g>
      <g class="chess-player-right"><path d="M164 91V66m-25 25V66" stroke="#52636c" stroke-width="3"/><path d="M165 70h-31V47q2-13 14-13t14 13Z" fill="var(--relation-b,#91aede)" stroke="#c9d4d0" stroke-width=".5"/><path d="M156 35v-7h-13v8" fill="#c3a17e"/><g class="chess-head-right"><path d="M140 17q-7 18 6 20 16 0 17-16 0-13-13-13-12 0-13 11Z" fill="#d5b18a"/><path d="M163 22q4-18-12-18-13 0-15 13l7-2 3-6 4 7 12 1Z" fill="#75838f"/><path d="m142 22-5 4 5 2" fill="#d5b18a"/></g><path d="m160 69-20 3-6 19h15l8-15" fill="#344753"/><g class="chess-arm-right"><path d="m144 42-13 13-23 4" fill="none" stroke="#d5b18a" stroke-width="8" stroke-linecap="round"/><path d="m146 41-10 11" stroke="var(--relation-b,#91aede)" stroke-width="12" stroke-linecap="round"/><circle cx="106" cy="59" r="4" fill="#d5b18a"/></g></g>
      <path d="M51 83v10m78-10v10" stroke="#6c777b" stroke-width="3"/><path d="M36 86h108v4H36Z" fill="#5e5648"/><g class="chess-board">${board}<path d="M58 60h64l22 26H36Z" fill="none" stroke="#d4c49a" stroke-width=".8"/></g>
      <g class="chess-piece-light"><ellipse cx="78" cy="68" rx="5" ry="2" fill="#000" opacity=".3"/><path d="M74 66h9l-2-6h-4Z" fill="#f1dfb3"/><circle cx="78.5" cy="57" r="3" fill="#f1dfb3"/><path d="M74 67h9" stroke="#fff0c9" stroke-width="2"/></g>
      <g class="chess-piece-dark"><ellipse cx="106" cy="72" rx="5" ry="2" fill="#000" opacity=".3"/><path d="M101 70h10l-2-7h-6Z" fill="#27333e" stroke="#a7b6bf" stroke-width=".6"/><circle cx="106" cy="60" r="3" fill="#27333e" stroke="#a7b6bf" stroke-width=".6"/><path d="M101 71h10" stroke="#a7b6bf" stroke-width="1"/></g>
      <circle class="chess-think-left" cx="51" cy="19" r="2" fill="#e2cc96"/><circle class="chess-think-right" cx="129" cy="19" r="2" fill="#bfd0e4"/>
    </svg>`
  };
  const api={classify,art};root.RelationScenes=api;
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof window!=='undefined'?window:globalThis);

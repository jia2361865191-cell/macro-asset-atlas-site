(function(){
  'use strict';
  const M=window.MacroModel,$=id=>document.getElementById(id);
  const state={scenario:'tight',f:{...M.scenarios[0].f},focus:'gold',pair:null,bondYield:false,custom:false,manualDriver:null};
  const coords={gold:[50,16],dollar:[82,40],stocks:[70,78],bonds:[30,78],oil:[18,40]};
  const names=id=>id==='bonds'?'美债'+(state.bondYield?'收益率':'价格'):M.assets.find(a=>a.id===id).name;
  const getScenario=()=>M.scenarios.find(s=>s.id===state.scenario);
  let manualDirections=null,anchorAsset=null,drag=null,suppressClickUntil=0,lastTouchTap=null,lastTouchTime=0;
  const pairIndex=(a,b)=>M.pairs.findIndex(p=>(p.a===a&&p.b===b)||(p.a===b&&p.b===a));
  const directionFor=(id,scores)=>manualDirections?.[id]||M.direction(scoreFor(id,scores));
  function selectPair(index){if(index<0||index===state.pair)return;state.pair=index;state.focus=null;update()}
  function selectAsset(id,compare=false){
    if(compare&&anchorAsset&&anchorAsset!==id){selectPair(pairIndex(anchorAsset,id));return}
    anchorAsset=id;state.focus=id;state.pair=null;update();
  }
  function setDriver(id,sign){
    state.manualDriver={id,sign:sign??(state.manualDriver?.id===id?-state.manualDriver.sign:-1)};
    selectAsset(id);
  }
  function setBondYield(value){
    if(state.bondYield===value)return;
    if(state.manualDriver?.id==='bonds')state.manualDriver.sign*=-1;
    state.bondYield=value;update();
  }
  function manualReason(id){
    const d=manualDirections[id],source=names(state.manualDriver.id);
    if(d.mode==='source')return '手动设定的联动起点；再次双击可切换强弱';
    if(d.mode==='strategy')return '与'+source+'为条件博弈，不单凭起点方向判断强弱';
    return '与'+source+(d.mode==='cooperation'?'握手同向':'双剑反向')+'，按当前情景演示联动';
  }
  function initGestures(){
    const nodes=$('nodes');
    nodes.addEventListener('dblclick',e=>{const node=e.target.closest('[data-asset]');if(!node||Date.now()-lastTouchTime<500)return;e.preventDefault();setDriver(node.dataset.asset)});
    nodes.addEventListener('pointerover',e=>{
      const node=e.target.closest('[data-asset]');
      if(!node||e.pointerType==='touch'||drag||!anchorAsset||node.dataset.asset===anchorAsset||node.contains(e.relatedTarget))return;
      selectPair(pairIndex(anchorAsset,node.dataset.asset));
    });
    nodes.addEventListener('pointerdown',e=>{
      const node=e.target.closest('[data-asset]');if(!node||e.button!==0||!e.isPrimary)return;
      drag={id:node.dataset.asset,node,pointerId:e.pointerId,type:e.pointerType,x:e.clientX,y:e.clientY,moved:false,target:null};
      node.setPointerCapture(e.pointerId);
    });
    nodes.addEventListener('dragstart',e=>e.preventDefault());
    document.addEventListener('pointermove',e=>{
      if(!drag||drag.pointerId!==e.pointerId)return;
      if(!drag.moved&&Math.hypot(e.clientX-drag.x,e.clientY-drag.y)<7)return;
      drag.moved=true;anchorAsset=drag.id;
      const target=document.elementFromPoint(e.clientX,e.clientY)?.closest('[data-asset]');
      drag.target=target&&target.dataset.asset!==drag.id?target.dataset.asset:null;
      if(drag.target)selectPair(pairIndex(drag.id,drag.target));
      const box=document.querySelector('.map-wrap').getBoundingClientRect(),start=drag.node.getBoundingClientRect(),line=$('gesture-line');
      line.removeAttribute('hidden');line.setAttribute('x1',start.left+start.width/2-box.left);line.setAttribute('y1',start.top+start.height/2-box.top);line.setAttribute('x2',e.clientX-box.left);line.setAttribute('y2',e.clientY-box.top);
      M.assets.forEach(a=>$('node-'+a.id).classList.toggle('drop-target',a.id===drag.target));
    });
    function finish(e,cancelled){
      if(!drag||drag.pointerId!==e.pointerId)return;
      const current=drag;drag=null;
      if(current.node.hasPointerCapture(e.pointerId))current.node.releasePointerCapture(e.pointerId);
      $('gesture-line').setAttribute('hidden','');
      M.assets.forEach(a=>$('node-'+a.id).classList.remove('drop-target'));
      if(current.moved){suppressClickUntil=Date.now()+500;lastTouchTap=null;return}
      if(cancelled)return;
      if(current.type==='touch'){
        const now=Date.now();lastTouchTime=now;suppressClickUntil=now+500;
        if(lastTouchTap?.id===current.id&&now-lastTouchTap.time<380){lastTouchTap=null;setDriver(current.id)}
        else{lastTouchTap={id:current.id,time:now};selectAsset(current.id,true)}
      }
    }
    document.addEventListener('pointerup',e=>finish(e,false));
    document.addEventListener('pointercancel',e=>finish(e,true));
    nodes.addEventListener('keydown',e=>{
      const node=e.target.closest('[data-asset]');if(!node)return;
      if(e.key==='ArrowUp'||e.key==='ArrowDown'){e.preventDefault();setDriver(node.dataset.asset,e.key==='ArrowUp'?1:-1)}
      if((e.key==='Enter'||e.key===' ')&&anchorAsset&&anchorAsset!==node.dataset.asset){e.preventDefault();selectPair(pairIndex(anchorAsset,node.dataset.asset))}
    });
    document.addEventListener('keydown',e=>{if(e.key==='Escape'){anchorAsset=null;document.querySelectorAll('.asset-node.armed').forEach(n=>n.classList.remove('armed'))}});
  }
  let insightOpen=false;
  function setInsightOpen(open){
    insightOpen=open;
    $('asset-workspace').classList.toggle('insight-collapsed',!open);
    $('insight-panel').hidden=!open;
    $('insight-toggle').setAttribute('aria-expanded',String(open));
    $('insight-toggle').setAttribute('aria-label',open?'收起关系面板':'展开关系面板');
    $('insight-toggle-arrow').textContent=open?'›':'‹';
    const narrow=window.matchMedia('(max-width: 900px)').matches;
    if(open&&narrow){
      $('insight-panel').scrollIntoView({block:'start',behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
    }else if(!open){
      $('insight-toggle').focus({preventScroll:!narrow});
    }
  }
  function updateRelationCenter(){
    const center=$('relation-center');
    if(state.pair===null){
      center.removeAttribute('aria-label');
      if(center.dataset.mode!=='overview'){center.dataset.mode='overview';center.classList.remove('has-relation');center.innerHTML='<span class="center-cross" aria-hidden="true">＋</span><span>共同驱动</span><strong>利率 · 增长 · 风险</strong><small>点选资产后移向另一个<br>双击资产，切换强弱联动</small>';}
      return;
    }
    const pair=M.pairs[state.pair],view=window.RelationScenes.classify(pair,state);
    center.style.setProperty('--relation-a',M.assets.find(a=>a.id===pair.a).color);
    center.style.setProperty('--relation-b',M.assets.find(a=>a.id===pair.b).color);
    if(center.dataset.mode!==view.mode){
      center.dataset.mode=view.mode;center.classList.add('has-relation');
      center.innerHTML=`<div class="relation-scene" aria-hidden="true">${window.RelationScenes.art[view.mode]}</div><span class="relation-pair"></span><strong class="relation-title"></strong><small class="relation-context"></small>`;
    }
    center.querySelector('.relation-pair').textContent=names(pair.a)+' × '+names(pair.b);
    center.querySelector('.relation-title').textContent=view.title;
    center.querySelector('.relation-context').textContent=view.context;
    center.setAttribute('aria-label',names(pair.a)+'与'+names(pair.b)+'：'+view.title+'。'+view.context+'。'+view.meaning);
  }
  let activeAssetNote=null;
  function openAssetNote(id){
    const note=window.AssetNotes[id],asset=M.assets.find(a=>a.id===id);if(!note||!asset)return;
    const switching=$('asset-dialog').open;
    activeAssetNote=id;
    $('asset-note-title').textContent=note.title+' · 资产解说';
    $('asset-dialog').style.setProperty('--note-color',asset.color);
    $('asset-note-nav').innerHTML=M.assets.map(a=>`<button type="button" data-note="${a.id}" aria-pressed="${a.id===id}" class="${a.id===id?'active':''}">${a.name}</button>`).join('');
    const art=window.AssetArtwork[id].replace(/id="/g,'id="note-').replace(/url\(#/g,'url(#note-').replace(/href="#/g,'href="#note-');
    $('asset-note-body').innerHTML=`<div class="asset-note-intro"><span class="asset-note-art asset-art" aria-hidden="true">${art}</span><div><p class="asset-note-subtitle">${note.subtitle}</p><p id="asset-note-summary">${note.summary}</p></div></div><div class="asset-note-prose">${note.sections.map(s=>`<section><h3>${s.heading}</h3>${s.paragraphs.map(p=>`<p>${p}</p>`).join('')}</section>`).join('')}<aside class="asset-note-boundary"><h3>理解这段话的边界</h3><p>${note.boundary}</p></aside><section class="asset-note-sources"><h3>参考来源</h3>${note.sources.map(([label,url])=>`<a href="${url}" target="_blank" rel="noopener noreferrer">${label} <span aria-hidden="true">↗</span></a>`).join('')}</section></div>`;
    if(!$('asset-dialog').open)$('asset-dialog').showModal();
    if(switching)$('asset-note-nav').querySelector(`[data-note="${id}"]`).focus();
    $('asset-dialog').scrollTop=0;
  }
  function scoreFor(id,scores){return id==='bonds'&&state.bondYield?scores.yield:scores[id]}
  function level(value,factor){if(Math.abs(value)<.05)return factor.min===0?'正常 · 0':'中性 · 0';const word=factor.id==='risk'?'升温':factor.id==='cash'?'紧缺':value>0?factor.right:factor.left;return word+' '+(value>0?'+':'')+value.toFixed(1)}
  function save(){try{localStorage.setItem('asset-atlas-v1',JSON.stringify(state))}catch(e){/* Storage is optional. */}}
  function restore(){try{const s=JSON.parse(localStorage.getItem('asset-atlas-v1'));if(!s||!M.scenarios.some(x=>x.id===s.scenario))return;for(const f of M.factors){if(typeof s.f?.[f.id]!=='number'||!Number.isFinite(s.f[f.id])||s.f[f.id]<f.min||s.f[f.id]>f.max)return}Object.assign(state,{scenario:s.scenario,f:s.f,bondYield:!!s.bondYield,custom:!!s.custom,focus:s.focus===null?null:M.assets.some(a=>a.id===s.focus)?s.focus:'gold',pair:Number.isInteger(s.pair)&&M.pairs[s.pair]?s.pair:null,manualDriver:M.assets.some(a=>a.id===s.manualDriver?.id)&&[-1,1].includes(s.manualDriver.sign)?{id:s.manualDriver.id,sign:s.manualDriver.sign}:null})}catch(e){/* First visit. */}}
  function init(){
    restore();
    $('scenarios').innerHTML=M.scenarios.map(s=>`<button type="button" class="scenario" data-scenario="${s.id}" aria-pressed="false"><span class="scenario-icon" aria-hidden="true">${s.icon}</span><span><strong>${s.name}</strong><small>${s.short}</small></span></button>`).join('');
    $('nodes').innerHTML=M.assets.map(a=>`<button type="button" class="asset-node" id="node-${a.id}" data-asset="${a.id}" style="--x:${coords[a.id][0]}%;--y:${coords[a.id][1]}%;--asset-color:${a.color}" aria-pressed="false" aria-describedby="map-instructions"><span class="driver-badge" hidden>联动起点</span><span class="asset-icon asset-art art-${a.id}" aria-hidden="true">${window.AssetArtwork[a.id]}</span><span class="asset-name">${a.name}<small>${a.en}</small></span><span class="asset-direction" id="node-dir-${a.id}"></span></button>`).join('');
    $('pairs').innerHTML=M.pairs.map((p,i)=>`<button type="button" data-pair="${i}" aria-pressed="false">${M.assets.find(a=>a.id===p.a).name} × ${M.assets.find(a=>a.id===p.b).name}</button>`).join('');
    $('sliders').innerHTML=M.factors.map(f=>`<div class="slider"><div class="slider-head"><label for="factor-${f.id}">${f.name}</label><output id="value-${f.id}" class="slider-value" for="factor-${f.id}"></output></div><p class="slider-info" id="tip-${f.id}">${f.tip}</p><input type="range" id="factor-${f.id}" data-factor="${f.id}" min="${f.min}" max="${f.max}" step="0.1" value="${state.f[f.id]}" aria-describedby="tip-${f.id}"><div class="slider-axis"><span>${f.left}</span><span>${f.min===0?'': '中性'}</span><span>${f.right}</span></div></div>`).join('');
    document.addEventListener('click',event=>{
      const scenario=event.target.closest('[data-scenario]');if(scenario){state.scenario=scenario.dataset.scenario;state.f={...getScenario().f};state.custom=false;state.manualDriver=null;anchorAsset=null;update();return}
      const node=event.target.closest('[data-asset]');if(node){if(event.detail>0&&Date.now()<suppressClickUntil)return;selectAsset(node.dataset.asset);return}
      const note=event.target.closest('[data-note]');if(note){openAssetNote(note.dataset.note);return}
      const noteOpen=event.target.closest('[data-open-note]');if(noteOpen){openAssetNote(noteOpen.dataset.openNote);return}
      const pair=event.target.closest('[data-pair]');if(pair){anchorAsset=null;state.pair=Number(pair.dataset.pair);state.focus=null;update();return}
    });
    initGestures();
    $('sliders').addEventListener('input',event=>{const f=event.target.dataset.factor;if(!f)return;state.manualDriver=null;state.f[f]=Number(event.target.value);state.custom=true;update(false)});
    $('reset').addEventListener('click',()=>{state.manualDriver=null;state.f={...getScenario().f};state.custom=false;update()});
    $('clear-direction').addEventListener('click',()=>{state.manualDriver=null;update()});
    $('show-all').addEventListener('click',()=>{anchorAsset=null;state.focus=null;state.pair=null;update()});
    $('insight-toggle').addEventListener('click',()=>setInsightOpen(!insightOpen));
    $('insight-close').addEventListener('click',()=>setInsightOpen(false));
    $('bond-price').addEventListener('click',()=>setBondYield(false));
    $('bond-yield').addEventListener('click',()=>setBondYield(true));
    for(const id of ['source-open','footer-sources','model-open'])$(id).addEventListener('click',()=>{if(!$('sources-dialog').open)$('sources-dialog').showModal()});
    $('source-close').addEventListener('click',()=>$('sources-dialog').close());
    $('asset-note-close').addEventListener('click',()=>$('asset-dialog').close());
    $('asset-note-relations').addEventListener('click',()=>{if(!activeAssetNote)return;state.focus=activeAssetNote;state.pair=null;update();$('asset-dialog').close();$('insight-content').scrollIntoView({block:'nearest'});});
    $('asset-dialog').addEventListener('click',e=>{if(e.target===$('asset-dialog')){const r=e.target.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)e.target.close()}});
    $('sources-dialog').addEventListener('click',e=>{if(e.target===$('sources-dialog')){const r=e.target.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)e.target.close()}});
    $('edges').addEventListener('keydown',e=>{const edge=e.target.closest('[data-pair]');if(edge&&(e.key==='Enter'||e.key===' ')){e.preventDefault();state.pair=Number(edge.dataset.pair);state.focus=null;update()}});
    const obs=new ResizeObserver(()=>drawEdges());obs.observe(document.querySelector('.map-wrap'));
    update();
  }
  function drawEdges(){
    const box=document.querySelector('.map-wrap').getBoundingClientRect();if(!box.width||!box.height)return;
    const svg=document.querySelector('.network');svg.setAttribute('viewBox',`0 0 ${box.width} ${box.height}`);
    const circles=svg.querySelectorAll('circle');circles.forEach((c,i)=>{c.setAttribute('cx',box.width/2);c.setAttribute('cy',box.height/2);c.setAttribute('r',Math.min(box.width*.27,box.height*.4)*(i===0?1.15:i===1?1:.6))});
    const centers=Object.fromEntries(M.assets.map(a=>{const r=$('node-'+a.id).getBoundingClientRect();return [a.id,{x:r.left+r.width/2-box.left,y:r.top+r.height/2-box.top}]}));
    $('edges').innerHTML=M.pairs.map((p,i)=>{
      const a=centers[p.a],b=centers[p.b];const x1=a.x,y1=a.y,x2=b.x,y2=b.y;
      const focused=state.focus&&(p.a===state.focus||p.b===state.focus),selected=state.pair===i;
      const cls='edge'+(focused?' focused':'')+(selected?' selected':'');
      return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="${cls}"/><line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="edge-hit" data-pair="${i}" role="button" tabindex="0" aria-label="查看${names(p.a)}与${names(p.b)}的关系"/>`;
    }).join('');
  }
  function reason(id){if(manualDirections)return manualReason(id);const f=state.f,arr=[];
    if(id==='gold'){if(Math.abs(f.real)>.5)arr.push(f.real>0?'实际利率抬高机会成本':'实际利率降低机会成本');if(f.cash>.8)arr.push('现金需求带来抛售压力');else if(f.risk>.6)arr.push('避险需求提供支持');if(!arr.length)arr.push('通胀、美元与利率共同影响')}
    if(id==='dollar'){if(Math.abs(f.real)>.5)arr.push(f.real>0?'相对利差提供支持':'相对利差优势减弱');if(f.cash>.6)arr.push('美元现金需求增加');else if(f.risk>.6)arr.push('避险买盘增加');if(!arr.length)arr.push('相对增长与避险需求博弈')}
    if(id==='stocks'){if(f.growth<-.6)arr.push('盈利预期受压');else if(f.growth>.4)arr.push('增长支持盈利');if(Math.abs(f.real)>.5)arr.push(f.real>0?'折现率抬升':'折现率下降');else if(f.inflation>.6)arr.push('通胀与能源成本上升');else if(f.cash>.6)arr.push('融资与流动性压力');if(!arr.length)arr.push('盈利、估值与风险偏好博弈')}
    if(id==='bonds'){const d=M.direction(M.calculate(f).yield);arr.push(d.sign===0?'名义收益率多因素博弈':d.sign>0?'名义收益率有上行压力':'名义收益率有下行压力');arr.push(state.bondYield?'收益率口径，和价格反向':'固定息票债价格与收益率反向')}
    if(id==='oil'){if(Math.abs(f.supply)>.5)arr.push(f.supply>0?'供给收紧推高价格':'供给充裕压低价格');if(Math.abs(f.growth)>.5)arr.push(f.growth>0?'需求预期走强':'需求预期走弱');if(!arr.length)arr.push('需求、供给与美元共同影响')}
    return arr.slice(0,2).join('；');
  }
  function pairContext(p){const s=state.scenario;
    if(manualDirections)return '手动起点：'+names(state.manualDriver.id)+(state.manualDriver.sign>0?'偏强':'偏弱')+'。节点方向仅按它与每个资产的直接关系联动：双剑反向、握手同向、下棋不定。下方文字解释这种关系适用的条件。';
    if(state.custom)return '自定义组合中，不同驱动可以互相抵消。图上关系是条件机制，节点方向是多因素示意结果，两者不能当成统计相关性。';
    if(s==='cashcrisis')return '当前现金紧缺预设中，出售资产换美元的力量增强，传统避险关系可能暂时失效。';
    if(p.a==='stocks'&&p.b==='bonds')return s==='recession'?'当前衰退预设中，盈利下修压低股票，避险与利率回落支持债券价格。':s==='soft'?'当前温和降息预设中，增长仍有韧性、实际利率下降，股债价格可以齐涨。':'当前预设中，利率或通胀压力可能使股票和美债价格同时受压。';
    if(p.b==='oil'&&s==='oilshock')return '当前油价上涨来自供应收紧，同时伴随通胀抬升和增长受损，不能把它当成需求繁荣的信号。';
    return getScenario().desc+' 具体方向取决于这些力量的合成。';
  }
  function updatePairReading(){
    const reading=$('pair-reading'),status=$('pair-reading-status');
    const pair=state.pair===null?null:M.pairs[state.pair];
    reading.hidden=!pair;status.hidden=!pair;
    if(!pair)return;
    const note=window.PairNotes.get(pair.a,pair.b),key=window.PairNotes.key(pair.a,pair.b);
    const view=window.RelationScenes.classify(pair,state);
    const title=note?.title||pair.title;
    status.innerHTML=`<span>已连接 <strong>${names(pair.a)} × ${names(pair.b)}</strong><small>${title}</small></span><a href="#pair-reading">${note?'阅读完整关系解说':'阅读关系概览'} <span aria-hidden="true">↓</span></a>`;
    if(reading.dataset.pairKey!==key){
      const body=note||{title,summary:pair.mechanism,sections:[{heading:'什么时候更适用',paragraphs:[pair.condition]},{heading:'什么时候可能失效',paragraphs:[pair.exception]}],takeaway:pair.via,sources:[]};
      reading.dataset.pairKey=key;
      reading.innerHTML=`<header class="pair-reading-head"><div><span class="mini-label">THE CONNECTION / ${note?'完整关系解说':'关系概览'}</span><h2 id="pair-reading-title">${body.title}</h2><p>${body.summary}</p></div><a class="pair-return" href="#asset-workspace">返回关系图 ↑</a></header><p class="pair-reading-context" id="pair-reading-context"></p><div class="pair-reading-layout"><nav class="pair-reading-nav" aria-label="本组解说目录"><span>阅读这组关系</span>${body.sections.map((section,i)=>`<a href="#pair-section-${i}"><span>0${i+1}</span>${section.heading}</a>`).join('')}</nav><div class="pair-reading-body">${body.sections.map((section,i)=>`<section id="pair-section-${i}"><h3>${section.heading}</h3>${section.paragraphs.map(p=>`<p>${p}</p>`).join('')}</section>`).join('')}<div class="pair-takeaway"><span>记住这条关系</span><p>${body.takeaway}</p></div><aside class="pair-boundary"><span>理解这段话的边界</span><p>这里讲的是条件性的传导机制，不是固定的涨跌规律。图中的双剑、握手与下棋是对当前情景下常见关系的比喻；示意分值由本页设定、未经统计拟合，既不是历史相关系数，也不是收益预测或交易建议。切换情景、改变宏观变量或切换美债价格／收益率口径，关系都可能改变。文中的历史价格与假设数字只用于说明机制，不是当前行情。</p></aside>${body.sources.length?`<details class="pair-reading-sources"><summary>参考来源 · ${body.sources.length} 项</summary>${body.sources.map(([label,url])=>`<a href="${url}" target="_blank" rel="noopener noreferrer">${label} ↗</a>`).join('')}</details>`:''}</div></div>`;
    }
    $('pair-reading-context').textContent=(state.custom?'自定义组合':getScenario().name)+' · 当前关系动画：'+view.title+'。'+((pair.a==='bonds'||pair.b==='bonds')?' 图上美债显示'+(state.bondYield?'收益率':'价格')+'；下文会区分价格与收益率。':' 关系会随主导因素变化。');
  }
  function updateInsight(scores){
    const s=getScenario();$('scenario-tag').textContent=manualDirections?'手动方向推演':state.custom?'自定义组合':s.name;
    let content='';
    if(state.pair!==null){const p=M.pairs[state.pair];
      const note=window.PairNotes.get(p.a,p.b);
      content=`<p class="detail-kicker">${names(p.a)} <span aria-hidden="true">↔</span> ${names(p.b)}</p><h3>${note?.title||p.title}</h3><a class="read-asset-note pair-note-link" href="#pair-reading">${note?'阅读这组关系的完整解说':'阅读这组关系概览'} ↓</a><span class="context-pill">${window.RelationScenes.classify(p,state).title} · 条件性机制</span><p class="detail-desc">${p.mechanism}</p><div class="detail-divider"></div><p class="detail-subtitle">什么时候更适用</p><p class="detail-text">${p.condition}</p><p class="detail-subtitle" style="margin-top:14px">什么时候可能失效</p><p class="detail-text">${p.exception}</p>${state.bondYield&&(p.a==='bonds'||p.b==='bonds')?'<p class="pair-context">当前节点显示收益率；本段机制仍以美债价格解释。收益率方向与价格相反。</p>':''}<div class="pair-context">${pairContext(p)}</div><button type="button" class="back-link" id="back-overview">← 返回情景总览</button>`;
      $('focus-label').textContent=`聚焦：${names(p.a)} × ${names(p.b)}`;
    }else if(state.focus){const a=M.assets.find(x=>x.id===state.focus),d=directionFor(a.id,scores);
      content=`<p class="detail-kicker">${a.en} / ${a.role}</p><h3>${names(a.id)}的四条关联</h3><p class="detail-desc">${manualDirections?'手动方向推演':('当前'+(state.custom?'自定义组合':s.name))}中，${names(a.id)}：<span class="${d.className}"> ${d.arrow} ${d.short} </span>。${reason(a.id)}。</p><div class="relation-list">${M.pairs.map((p,i)=>p.a===a.id||p.b===a.id?`<button type="button" data-pair="${i}">${M.assets.find(x=>x.id===(p.a===a.id?p.b:p.a)).name}<span>${window.RelationScenes.classify(p,state).title.split(' · ')[0]} ↗</span></button>`:'').join('')}</div><div class="detail-divider"></div><p class="detail-subtitle">${manualDirections?'当前联动规则':'当前情景的关键'}</p><p class="detail-text">${manualDirections?'以'+names(state.manualDriver.id)+'为起点，双剑反向、握手同向、下棋不定。关系沿用「'+(state.custom?'自定义组合':s.name)+'」，仅比较起点与各资产，不继续递推。':state.custom?'自定义输入是彼此独立的假设；相反力量可能抵消，不会自动模拟完整经济反馈。':s.desc}</p><div class="pair-context">点选资产后移向另一个，或选择一条关系，查看具体传导与例外。</div>`;
      $('focus-label').textContent='聚焦：'+names(a.id);
    }else if(manualDirections){
      content=`<p class="detail-kicker">DIRECTION / 手动方向推演</p><h3>${names(state.manualDriver.id)}${state.manualDriver.sign>0?'偏强':'偏弱'}，如何联动？</h3><p class="detail-desc">双剑关系反向，握手关系同向；两人下棋表示条件博弈，显示“关系不定”。</p><div class="pair-context">沿用「${state.custom?'自定义组合':s.name}」的关系分类，仅演示起点对其他四类资产的直接方向影响。点击“恢复情景推演”可回到宏观变量结果。</div>`;
      $('focus-label').textContent='全部资产 · 手动方向推演';
    }else{
      content=`<p class="detail-kicker">SCENARIO / ${state.custom?'CUSTOM':s.id.toUpperCase()}</p><h3>${state.custom?'多因素组合推演':s.name+'，如何传导？'}</h3><p class="detail-desc">${state.custom?'你正在组合独立的宏观冲击，观察它们对五类资产的合力。':s.desc}</p><ol class="chain">${(state.custom?['拖动宏观变量，改变假设','各项支持与压力叠加','下方显示方向，非收益幅度']:s.chain).map((x,i)=>`<li><span>${i+1}</span>${x}</li>`).join('')}</ol><div class="detail-divider"></div><p class="detail-subtitle">别忽略另一种可能</p><p class="detail-text">${state.custom?'现实中这些变量会互相影响，模型仅演示输入变化的方向影响。':s.caveat}</p><div class="pair-context">选择图上的资产，或点下方的两两关系，进一步拆解。</div>`;
      $('focus-label').textContent='全部资产关系';
    }
    $('insight-content').innerHTML=content;
    if(state.focus&&state.pair===null)$('insight-content').querySelector('h3').insertAdjacentHTML('afterend',`<button type="button" class="read-asset-note" data-open-note="${state.focus}">阅读${M.assets.find(a=>a.id===state.focus).name}的完整解说 ↗</button>`);
    const back=$('back-overview');if(back)back.addEventListener('click',()=>{state.pair=null;state.focus=null;update()});
  }
  function update(syncSliders=true){
    const scores=M.calculate(state.f),s=getScenario();
    manualDirections=window.DirectionDemo.propagate(state.manualDriver,M.assets,M.pairs,window.RelationScenes.classify,state);
    $('direction-demo-bar').hidden=!manualDirections;
    if(manualDirections){const d=manualDirections[state.manualDriver.id];$('direction-demo-label').innerHTML=`<span class="demo-label">手动联动</span> ${names(state.manualDriver.id)} <strong class="${d.className}">${d.arrow} ${d.short}</strong><span class="demo-rule">双剑反向 · 握手同向 · 下棋不定</span>`;}
    $('outlook-title').innerHTML='<span class="section-num">02</span> '+(manualDirections?'从'+names(state.manualDriver.id)+'出发，其他资产如何联动？':'这个情景下，资产可能怎么走？');
    document.querySelectorAll('[data-scenario]').forEach(el=>{const active=el.dataset.scenario===state.scenario;el.classList.toggle('active',active);el.setAttribute('aria-pressed',active?'true':'false')});
    M.assets.forEach(a=>{const d=directionFor(a.id,scores),el=$('node-'+a.id);const pair=state.pair===null?null:M.pairs[state.pair],connected=pair&&(pair.a===a.id||pair.b===a.id),driver=state.manualDriver?.id===a.id;el.classList.toggle('selected',state.focus===a.id);el.classList.toggle('connected',!!connected);el.classList.toggle('dimmed',!!pair&&!connected&&!manualDirections);el.classList.toggle('armed',anchorAsset===a.id);el.classList.toggle('is-driver',driver);el.querySelector('.driver-badge').hidden=!driver;el.setAttribute('aria-pressed',String(state.focus===a.id));el.setAttribute('aria-label',`查看${names(a.id)}关系；当前${d.short}${driver?'；联动起点':''}；双击切换强弱`);$('node-dir-'+a.id).className='asset-direction '+d.className;$('node-dir-'+a.id).innerHTML=`<span aria-hidden="true">${d.arrow}</span><span>${a.id==='bonds'?(state.bondYield?'收益率':'价格')+' ':''}${d.short}</span>`});
    document.querySelectorAll('#pairs [data-pair]').forEach(el=>{const active=Number(el.dataset.pair)===state.pair;el.classList.toggle('active',active);el.setAttribute('aria-pressed',String(active))});
    $('outcomes').innerHTML=M.assets.map(a=>{const score=scoreFor(a.id,scores),d=directionFor(a.id,scores),strength=d.sign===0?1:Math.abs(score)<1.4?3:5;return `<article class="outcome" style="--asset-color:${a.color}"><div class="outcome-top"><span class="outcome-name">${names(a.id)}</span><span class="outcome-en">${a.en}</span></div><div class="outcome-value ${d.className}"><span aria-hidden="true">${d.arrow}</span>${d.short}</div>${manualDirections?'':`<div class="outcome-strength ${d.className}" aria-label="${d.long}，仅为示意分档">${Array.from({length:5},(_,i)=>`<i class="${i<strength?'on':''}"></i>`).join('')}</div>`}<p class="outcome-reason">${reason(a.id)}</p></article>`}).join('');
    $('context-note').textContent=manualDirections?'手动方向推演：仅按当前情景的直接关系展示同向或反向；博弈关系不指定方向。没有涨跌幅度，也不表示真实行情预测。':state.custom?'自定义输入仅表示相对基准的冲击，方向由教学权重合成。刻度和指示条都不是预测收益或概率。':s.caveat;
    for(const f of M.factors){const value=state.f[f.id];if(syncSliders)$('factor-'+f.id).value=value;$('value-'+f.id).textContent=level(value,f);$('factor-'+f.id).setAttribute('aria-valuetext',level(value,f))}
    $('model-status').textContent=manualDirections?'正在手动方向推演 · 拖动变量可回到情景推演':state.custom?'已自定义 · 基于「'+s.name+'」调整':'当前使用「'+s.name+'」预设';
    $('bond-price').classList.toggle('active',!state.bondYield);$('bond-yield').classList.toggle('active',state.bondYield);$('bond-price').setAttribute('aria-pressed',String(!state.bondYield));$('bond-yield').setAttribute('aria-pressed',String(state.bondYield));
    updateInsight(scores);updateRelationCenter();updatePairReading();drawEdges();save();
  }
  init();
})();

(function(){
  'use strict';
  const data=window.AtlasLearning,assets=window.MacroModel.assets,$=id=>document.getElementById(id);
  let activeCycle=0,activePhase=0,activeFlow=0,activeRole='dollar';
  const sourceLinks=sources=>sources.map(([label,url])=>`<a href="${url}" target="_blank" rel="noopener noreferrer">${label} ↗</a>`).join('');
  function renderPhase(index){
    activePhase=index;
    const phase=data.cycles[activeCycle].phases[index];
    $('history-phases').querySelectorAll('button').forEach((button,i)=>{button.classList.toggle('active',i===index);button.setAttribute('aria-pressed',String(i===index))});
    $('history-stage').innerHTML=`<p class="phase-kicker">${phase.date} / 第 ${index+1} 阶段</p><h4>${phase.title}</h4>${phase.paragraphs.map(p=>`<p>${p}</p>`).join('')}<ol class="historical-chain" aria-label="这一阶段的传导链条">${phase.chain.map(item=>`<li>${item}</li>`).join('')}</ol>`;
    $('historical-assets').innerHTML=assets.map(asset=>{const [sign,text]=phase.assets[asset.id];return `<article style="--asset-color:${asset.color}"><span class="historical-asset-name"><i aria-hidden="true"></i>${asset.id==='bonds'?'美债价格':asset.name}</span><div class="historical-direction ${sign>0?'up':sign<0?'down':'neutral'}"><span aria-hidden="true">${sign>0?'↑':sign<0?'↓':'↔'}</span>${sign>0?'获支持':sign<0?'承压':'阶段分化'}</div><p>${text}</p></article>`}).join('');
  }
  function renderCycle(index){
    activeCycle=index;
    const cycle=data.cycles[index];
    $('history-tabs').querySelectorAll('button').forEach((button,i)=>{button.classList.toggle('active',i===index);button.setAttribute('aria-selected',String(i===index));button.tabIndex=i===index?0:-1});
    $('history-panel').setAttribute('aria-labelledby','history-tab-'+cycle.id);
    $('history-period').textContent=cycle.period+' / CYCLE 0'+(index+1);
    $('history-case-title').textContent=cycle.title;
    $('history-intro').textContent=cycle.intro;
    $('history-metrics').innerHTML=cycle.metrics.map(([value,label])=>`<div><strong>${value}</strong><span>${label}</span></div>`).join('');
    $('history-phases').innerHTML=cycle.phases.map((phase,i)=>`<button type="button" data-history-phase="${i}" aria-controls="history-stage" aria-pressed="false"><span class="phase-number">0${i+1}</span><span><small>${phase.date}</small><strong>${phase.title}</strong></span><span class="phase-chevron" aria-hidden="true">↗</span></button>`).join('');
    $('history-lesson').textContent=cycle.lesson;
    $('history-boundary').textContent=cycle.boundary;
    $('history-sources').innerHTML=sourceLinks(cycle.sources);
    renderPhase(0);
  }
  function renderRole(){
    const role=data.roles.find(item=>item.id===activeRole),asset=assets.find(item=>item.id===activeRole);
    $('role-cards').querySelectorAll('button').forEach(button=>{const related=data.circulation[activeFlow].roles.includes(button.dataset.role);button.classList.toggle('flow-related',related);button.classList.toggle('active',button.dataset.role===activeRole);button.setAttribute('aria-pressed',String(button.dataset.role===activeRole));button.querySelector('.role-related').hidden=!related});
    $('role-detail').style.setProperty('--role-color',asset.color);
    $('role-detail').innerHTML=`<p class="phase-kicker">${asset.name} / ${asset.en}</p><h3>${role.metaphor}</h3><p>${role.description}</p><p class="role-boundary">${role.boundary}</p>`;
  }
  function renderFlow(index){
    activeFlow=index;
    const step=data.circulation[index];
    $('dollar-flow').querySelectorAll('button').forEach((button,i)=>{button.classList.toggle('active',i===index);button.setAttribute('aria-pressed',String(i===index))});
    $('dollar-detail').innerHTML=`<div class="flow-detail-number" aria-hidden="true">0${index+1}</div><div><p class="phase-kicker">美元循环 / 第 ${index+1} 个环节</p><h3>${step.title}</h3>${step.paragraphs.map(p=>`<p>${p}</p>`).join('')}<p class="flow-equation">${step.flow}</p><a href="#asset-roles">查看这个环节涉及的资产角色 ↓</a></div>`;
    if(!step.roles.includes(activeRole))activeRole=step.roles[0];
    renderRole();
  }
  $('history-tabs').innerHTML=data.cycles.map((cycle,i)=>`<button type="button" id="history-tab-${cycle.id}" role="tab" data-history-cycle="${i}" aria-controls="history-panel" aria-selected="false" tabindex="-1"><small>${cycle.period}</small><strong>${cycle.label}</strong></button>`).join('');
  $('dollar-flow').innerHTML=data.circulation.map((step,i)=>`<button type="button" data-flow="${i}" aria-controls="dollar-detail" aria-pressed="false"><span class="flow-step-number">0${i+1}</span><strong>${step.title}</strong><small>${step.subtitle}</small><span class="flow-step-arrow" aria-hidden="true">${i===data.circulation.length-1?'↺':'→'}</span></button>`).join('');
  $('role-cards').innerHTML=assets.map(asset=>`<button type="button" data-role="${asset.id}" aria-controls="role-detail" aria-pressed="false" style="--asset-color:${asset.color}"><span class="role-symbol" aria-hidden="true">${asset.symbol}</span><strong>${asset.name}</strong><span class="role-related" hidden>当前环节</span><small>${data.roles.find(role=>role.id===asset.id).metaphor}</small></button>`).join('');
  $('history-tabs').addEventListener('click',event=>{const button=event.target.closest('[data-history-cycle]');if(button)renderCycle(Number(button.dataset.historyCycle))});
  $('history-tabs').addEventListener('keydown',event=>{const keys=['ArrowRight','ArrowLeft','Home','End'];if(!keys.includes(event.key))return;event.preventDefault();const count=data.cycles.length,index=event.key==='Home'?0:event.key==='End'?count-1:(activeCycle+(event.key==='ArrowRight'?1:-1)+count)%count;renderCycle(index);$('history-tabs').querySelectorAll('button')[index].focus()});
  $('history-phases').addEventListener('click',event=>{const button=event.target.closest('[data-history-phase]');if(button)renderPhase(Number(button.dataset.historyPhase))});
  $('dollar-flow').addEventListener('click',event=>{const button=event.target.closest('[data-flow]');if(button)renderFlow(Number(button.dataset.flow))});
  $('role-cards').addEventListener('click',event=>{const button=event.target.closest('[data-role]');if(button){activeRole=button.dataset.role;renderRole()}});
  renderCycle(0);renderFlow(0);
})();

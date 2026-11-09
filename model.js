(function(root){
  'use strict';
  const assets = [
    {id:'gold',name:'黄金',en:'GOLD',symbol:'Au',color:'#d7b46d',role:'实际利率与避险需求'},
    {id:'dollar',name:'美元',en:'US DOLLAR',symbol:'$',color:'#82b8a3',role:'相对利差与美元流动性'},
    {id:'stocks',name:'美股',en:'US EQUITIES',symbol:'↗',color:'#91aede',role:'盈利预期与折现率'},
    {id:'bonds',name:'美债',en:'US TREASURY',symbol:'≋',color:'#a79bd4',role:'收益率与久期'},
    {id:'oil',name:'石油',en:'CRUDE OIL',symbol:'◈',color:'#ca9376',role:'全球需求与供应变化'}
  ];
  const factors = [
    {id:'real',name:'实际利率预期',en:'REAL RATES',min:-2,max:2,left:'下行',right:'上行',tip:'持有无息资产的机会成本；其他经济体利率假设不变。'},
    {id:'growth',name:'全球增长预期',en:'GROWTH',min:-2,max:2,left:'放缓',right:'加速',tip:'同时影响企业盈利与原油需求，简化为同一增长冲击。'},
    {id:'inflation',name:'通胀预期',en:'INFLATION',min:-2,max:2,left:'降温',right:'升温',tip:'在实际利率不变时，通胀预期上升会推升名义收益率。'},
    {id:'risk',name:'避险需求',en:'RISK AVERSION',min:0,max:2,left:'平常',right:'强烈',tip:'偏向黄金、美元和美债；假设不是美国信用本身受损。'},
    {id:'supply',name:'原油供给',en:'OIL SUPPLY',min:-2,max:2,left:'更充裕',right:'更紧张',tip:'收紧直接抬高油价；如需模拟通胀和增长反馈，请一起调整对应变量。'},
    {id:'cash',name:'现金紧缺程度',en:'CASH SQUEEZE',min:0,max:2,left:'正常',right:'紧缺',tip:'被迫出售资产换取美元，可抵消传统避险需求。'}
  ];
  const scenarios = [
    {id:'tight',icon:'↗',name:'鹰派加息',short:'实际利率上行',f:{real:1.6,growth:-.5,inflation:-.6,risk:.2,supply:0,cash:0},desc:'市场上调实际利率预期，融资更贵，美元资产的相对吸引力提高。',chain:['实际利率预期上调','美元偏强，估值折现率抬升','黄金与美股承压，美债价格偏弱'],caveat:'这里假设紧缩抑制需求、通胀预期回落。若加息来自经济强劲，美股和石油的反应可能不同。'},
    {id:'soft',icon:'↘',name:'温和降息',short:'软着陆假设',f:{real:-1.6,growth:.6,inflation:-.7,risk:0,supply:0,cash:0},desc:'通胀缓和、增长仍有韧性，市场下调实际利率预期。',chain:['实际利率回落，增长保持韧性','融资成本下降，美元相对吸引力减弱','黄金、美股和美债价格获得支持'],caveat:'温和降息预设盈利未明显恶化。衰退中的被动降息，不一定带来股市上涨。'},
    {id:'recession',icon:'◴',name:'衰退担忧',short:'需求与盈利走弱',f:{real:-.6,growth:-2,inflation:-1,risk:1.8,supply:0,cash:0},desc:'需求与企业盈利预期下修，避险与降息预期同时升温。',chain:['增长与盈利预期下降','避险需求增加，债券收益率下行','美股与原油承压，美债价格受支持'],caveat:'美元受到降息预期与避险需求两股相反力量影响，方向并不确定。黄金也取决于实际利率和现金需求。'},
    {id:'oilshock',icon:'◇',name:'石油供给冲击',short:'成本与通胀抬升',f:{real:.3,growth:-.8,inflation:1.6,risk:.7,supply:2,cash:0},desc:'假设原油供应突然收紧，能源成本抬升，同时拖累增长。',chain:['供应收紧推动油价上行','通胀预期上升、增长受损','大盘美股与美债价格承压，黄金多因素博弈'],caveat:'能源生产商可能受益，航空等用油行业可能受损。这里展示大盘方向，不代表所有股票。'},
    {id:'cashcrisis',icon:'⚡',name:'流动性紧张',short:'现金优先阶段',f:{real:0,growth:-1.6,inflation:-.8,risk:1.5,supply:0,cash:2},desc:'短期内投资者被迫卖出资产换美元，现金需求压过传统避险逻辑。',chain:['保证金压力与融资紧张上升','出售资产换取美元现金','美元走强，黄金与美债也可能遭到抛售'],caveat:'这是现金紧缺的短期阶段。若央行补充流动性或避险买盘占优，美债和黄金可能迅速反转。'}
  ];
  function calculate(f){
    const {real:r,growth:g,inflation:i,risk:v,supply:s,cash:l}=f;
    const dollar=.9*r+.25*g+.7*v+1.1*l;
    const yieldScore=.9*r+.65*i+.35*g-.8*v+1.4*l;
    return {gold:-r-.4*dollar+.8*i+.9*v-1.7*l,dollar,stocks:g-.8*r-.6*i-.9*v-.8*l-.35*s,bonds:-yieldScore,oil:1.1*g+.2*i-.3*dollar+1.2*s-.5*v-.6*l,yield:yieldScore};
  }
  function direction(score){
    if(Math.abs(score)<.45)return {sign:0,arrow:'↔',short:'多空交织',long:'多空力量交织',className:'neutral'};
    const up=score>0,strong=Math.abs(score)>=1.4;
    return {sign:up?1:-1,arrow:up?'↑':'↓',short:up?'偏强':'偏弱',long:strong?(up?'上行压力较强':'下行压力较强'):(up?'温和上行倾向':'温和下行倾向'),className:up?'up':'down'};
  }
  const pairs=[
    {a:'gold',b:'dollar',label:'常见反向',type:'inverse',title:'美元变强，黄金就一定下跌吗？',mechanism:'其他因素不变时，美元升值使非美元买家买金更贵，可能压低需求；实际利率上行也常同时支持美元、抑制黄金。',condition:'美元计价、利率或汇率因素主导时。',exception:'避险需求、央行购金或信用担忧可能让黄金和美元一起上涨。',via:'美元计价与共同利率因素'},
    {a:'gold',b:'stocks',label:'取决于驱动',type:'conditional',title:'黄金与美股，可以一起上涨。',mechanism:'实际利率下降可同时降低黄金的机会成本与股票的折现率；经济风险冲击则可能推升黄金需求、打压股票盈利预期。',condition:'先判断是流动性宽松，还是增长或风险冲击。',exception:'现金挤兑时，两者都可能被出售。黄金并不是股市下跌的机械对冲。',via:'折现率与避险需求'},
    {a:'gold',b:'bonds',label:'利率下常同向',type:'conditional',title:'黄金和美债，都在看利率。',mechanism:'实际利率下降常支持黄金；名义收益率下降则推升固定息票美债价格。两种利率同向回落时，两者可一起走强。',condition:'图中以美债价格为口径；黄金更关注实际利率。',exception:'通胀预期上涨可抬高名义收益率、压低美债价格，同时支持黄金。',via:'实际利率与名义收益率'},
    {a:'gold',b:'oil',label:'通胀下或同向',type:'conditional',title:'油价推升通胀，黄金如何反应？',mechanism:'原油涨价可能抬高通胀预期；若名义利率没有同步上升，实际利率可能下降，黄金获得支持。',condition:'需要通胀或美元因素成为共同驱动。',exception:'若政策收紧推高实际利率，黄金可能承压；经济衰退中，油价可能跌而黄金涨。',via:'通胀预期与实际利率'},
    {a:'dollar',b:'stocks',label:'取决于驱动',type:'conditional',title:'强美元，不等于弱美股。',mechanism:'紧缩引发的强美元常伴随估值压力，并影响跨国企业海外收入折算；但美国相对增长强劲也可能吸引资金同时买入美元和美股。',condition:'区分利差驱动、增长驱动与避险驱动。',exception:'美股行业、海外收入占比不同，汇率变化的盈利影响并不一致。',via:'相对增长与融资条件'},
    {a:'dollar',b:'bonds',label:'取决于驱动',type:'conditional',title:'美元与美债，既能同涨也能反向。',mechanism:'美国相对利率上升可能支持美元，同时压低存量美债价格；全球避险则可能同时支持美元与美债价格。',condition:'图中以固定息票美债价格为口径。',exception:'美国财政或信用担忧、期限溢价变化，可能打破传统的避险组合。',via:'相对利差与全球避险'},
    {a:'dollar',b:'oil',label:'计价下常反向',type:'inverse',title:'美元，是油价的一股力量。',mechanism:'其他条件不变时，美元升值抬高非美元买家的购油成本，可能抑制需求和美元油价。',condition:'汇率或全球金融条件占主导，而供需变化较小时。',exception:'供应中断或地缘冲击，可能使油价和避险美元同时上涨。供需常比汇率更重要。',via:'美元计价与购买力'},
    {a:'stocks',b:'bonds',label:'驱动决定正反',type:'conditional',title:'股债跷跷板，并非一直有效。',mechanism:'增长恶化时，股票盈利承压、避险资金买债，可能出现股跌债涨；通胀或实际利率上行时，股票估值和美债价格可同时下跌。',condition:'图中债券指价格；先区分增长冲击与通胀冲击。',exception:'温和宽松也可能使股债齐涨。股票与债券的相关性随宏观环境变化。',via:'增长冲击或通胀冲击'},
    {a:'stocks',b:'oil',label:'需求下常同向',type:'conditional',title:'油涨股涨，还是油涨股跌？',mechanism:'需求旺盛时，企业盈利和原油需求可能一起上升；供应收紧时，油价上涨抬高生产和运输成本，可能拖累大盘股票。',condition:'关键是区分需求驱动与供应驱动的油价变化。',exception:'能源股可能受益于高油价，航空、运输等行业更容易受损。',via:'需求增长与能源成本'},
    {a:'bonds',b:'oil',label:'通胀下常反向',type:'inverse',title:'油价通过通胀，传到债券。',mechanism:'其他条件不变时，油价上涨若推升通胀预期与名义收益率，会压低固定息票美债价格。',condition:'以美债价格为口径，且通胀或政策预期主导。',exception:'供应冲击也可能伤害增长、激发买债避险，从而抵消通胀压力。',via:'通胀预期与名义收益率'}
  ];
  const api={assets,factors,scenarios,pairs,calculate,direction};
  root.MacroModel=api;
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof window!=='undefined'?window:globalThis);

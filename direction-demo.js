(function(root){
  'use strict';
  // Each result depends only on its direct relationship to the chosen source.
  // Do not cascade through other assets: conditional relationships can form cycles.
  function propagate(driver,assets,pairs,classify,settings){
    if(!driver||!assets.some(a=>a.id===driver.id)||![-1,1].includes(driver.sign))return null;
    return Object.fromEntries(assets.map(asset=>{
      const source=asset.id===driver.id;
      const pair=source?null:pairs.find(p=>(p.a===driver.id&&p.b===asset.id)||(p.b===driver.id&&p.a===asset.id));
      const mode=source?'source':pair?classify(pair,settings).mode:'strategy';
      const sign=source?driver.sign:mode==='cooperation'?driver.sign:mode==='opposition'?-driver.sign:0;
      return [asset.id,{sign,mode,arrow:sign>0?'↑':sign<0?'↓':'↔',short:sign>0?'偏强':sign<0?'偏弱':'关系不定',className:sign>0?'up':sign<0?'down':'neutral'}];
    }));
  }
  const api={propagate};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  else root.DirectionDemo=api;
})(typeof window!=='undefined'?window:globalThis);

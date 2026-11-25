import {validateCharacter} from './characters.mjs';
const nonnegative=x=>Number.isFinite(x)&&x>=0;
const dated=x=>typeof x==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(x)&&!Number.isNaN(Date.parse(x));
const translated=x=>x&&typeof x.en==='string'&&typeof x.zh==='string';
export function validateGameState(state){
  if(!state.game){if(state.sessions.some(s=>s.v2))throw Error('Missing V2 goal records.');return state;}
  const fail=()=>{throw Error('Invalid V2 goal, incident or evidence records.');};
  const game=state.game;if(game.version!==2||!Array.isArray(game.goals)||!Array.isArray(game.achievements))fail();
  if(game.characters&&(game.characters.version!==1||!validateCharacter(game.characters.player)||!validateCharacter(game.characters.partner)))fail();
  if(game.animationPreferences){const p=game.animationPreferences;if(['music','effects','reducedMotion'].some(k=>p[k]!==undefined&&typeof p[k]!=='boolean'))fail();}
  const goals=new Set(),incidentIds=new Set();
  for(const g of game.goals){if(typeof g.id!=='string'||goals.has(g.id)||typeof g.name!=='string'||!nonnegative(g.amount)||g.amount<=0||!Number.isInteger(g.months)||g.months<1||g.months>120||!nonnegative(g.comfortableMonthly)||!['MYR','SGD'].includes(g.currency)||!dated(g.created)||!dated(g.deadline)||!g.deadline.endsWith('-08')||typeof g.paused!=='boolean'||!Array.isArray(g.audit)||(g.completedAt!==null&&!dated(g.completedAt)))fail();goals.add(g.id);}
  if(game.activeGoalId&&!goals.has(game.activeGoalId))fail();
  for(const s of state.sessions.filter(s=>s.v2)){
    const v=s.v2;if(s.mode!=='v2'||!['MYR','SGD'].includes(s.marketCurrency)||!Number.isInteger(v.seed)||!Number.isInteger(v.cursor)||v.cursor<0||v.cursor>120||!Number.isInteger(v.turn)||v.turn<0||!Array.isArray(v.history)||!Array.isArray(v.seen)||!Array.isArray(v.adjustments)||!v.flags||!v.rolls||!v.assets||typeof v.lifeStage!=='string')fail();
    for(const i of [...v.history,...(v.current?[v.current]:[])]){
      if(typeof i.id!=='string'||incidentIds.has(i.id)||!translated(i.title)||!translated(i.intro)||!Array.isArray(i.options)||!['main','interlude'].includes(i.kind)||!['everyday','minor','milestone','rare'].includes(i.category)||!['MYR','SGD'].includes(i.currency)||!nonnegative(i.estimatedMarketCost)||!dated(i.triggered))fail();incidentIds.add(i.id);
      if(i.presentation){const p=i.presentation;if(p.version!==1||!['opening','dialogue','choices','outcome','financial'].includes(p.phase)||typeof p.openingSeen!=='boolean'||typeof p.outcomeSeen!=='boolean'||(p.optionId!==null&&!i.options.some(o=>o.id===p.optionId)))fail();}
      for(const o of i.options){if(typeof o.id!=='string'||!translated(o.title)||!translated(o.description)||!Array.isArray(o.items)||!o.effects)fail();for(const p of o.items)if(typeof p.id!=='string'||!translated(p.label)||!nonnegative(p.typical)||!nonnegative(p.quantity)||!nonnegative(p.simulationShare)||(p.quote!==null&&!nonnegative(p.quote)))fail();}
      if(i.decision){const c=i.challenge;if(!nonnegative(i.simulatedExpense)||!c||!goals.has(c.goalId)||!nonnegative(c.assigned)||!nonnegative(c.offset)||!nonnegative(c.requiredTotal)||!Array.isArray(c.schedule)||Math.abs(c.schedule.reduce((n,p)=>n+p.amount,0)-c.assigned)>.011||Math.abs(c.offset+c.assigned-c.requiredTotal)>.011)fail();for(const p of c.schedule)if(!dated(p.due)||!p.due.endsWith('-08')||!nonnegative(p.amount))fail();}
      if(i.completed&&!i.decision)fail();
    }
  }
  for(const t of state.ledger.filter(t=>t.goalId)){if(!goals.has(t.goalId)||typeof t.hash!=='string'||!/^[a-f0-9]{64}$/.test(t.hash)||!t.evidence?.signatureChecked||!t.fileName||t.verification?.bankSettlementConfirmed!==false)fail();if(t.status==='confirmed'&&t.verification?.method!=='local-evidence-review')fail();}
  return state;
}

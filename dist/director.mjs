import * as E from './engine.mjs';
import {STORIES,L,carDefaults} from './data.mjs';
import {mainChapters,interludes,marketTotal,virtualTotal,cost} from './incidents.mjs';
import * as G from './goals.mjs';

function fraction(seed,key){let h=seed>>>0;for(const c of key){h^=c.charCodeAt(0);h=Math.imul(h,16777619);}h^=h>>>16;h=Math.imul(h,2246822507);h^=h>>>13;return (h>>>0)/4294967296;}
function rollOnce(s,key,probability){if(!(key in s.v2.rolls))s.v2.rolls[key]=fraction(s.v2.seed,key)<probability;return s.v2.rolls[key];}
export function upgradeJourney(s){
  if(s.v2)return s;
  const legacy=s.history.length>0||!!s.current;
  s.mode='v2';s.marketCurrency=s.country==='MY'?'MYR':'SGD';
  s.v2={seed:Math.floor(Math.random()*4294967295)||1,cursor:s.index||0,turn:0,month:s.index+1,lifeStage:'a-new-beginning',assets:{},flags:{},rolls:{},history:[],current:null,seen:[],lastKind:null,adjustments:[],legacyCheckpoint:s.current?structuredClone(s.current):null,legacyHistoryCount:s.history.length,migration:legacy?{date:E.today(),reason:'V1 checkpoint retained as an archive; V2 goal challenges start with new evidence.'}:null};
  if(legacy&&s.story==='baby'){s.v2.rolls.twins=s.twins;s.v2.flags.twins=s.twins;if(s.index>=1)s.v2.flags.pregnancyConfirmed=true;}
  if(legacy&&s.story==='car'&&s.index>=5)s.v2.assets.car={value:s.config.price,principal:E.remainingLoan(s.config,s.index-4).principal,warranty:s.config.warranty,condition:s.config.condition};
  s.current=null;return s;
}
export function activeJourney(state){const s=E.session(state);return s?upgradeJourney(s):null;}
export function startJourney(state,storyId,config={}){
  const goal=G.currentGoal(state),p=E.activeProfile(state),old=E.session(state);
  if(!goal||!p)throw Error('Set a personal savings goal before entering virtual life.');
  if(old&&!old.completed)throw Error('Finish the active virtual life before starting another.');
  if(!STORIES.some(s=>s.id===storyId))throw Error('Choose a story from the library.');
  const defaults=storyId==='travel'?{days:100,travellers:1,flightDay:25,hotelDay:50,destination:'Somewhere new'}:storyId==='car'?carDefaults(p.country):{};
  const s=E.newSession(storyId,p,{...defaults,...config});s.currency=goal.currency;s.marketCurrency=p.currency;upgradeJourney(s);state.sessions.push(s);state.activeId=s.id;return s;
}
function snapshotOptions(def){return def.options.map(o=>({...structuredClone(o),items:o.items.map(i=>({...structuredClone(i)}))}));}
function context(state,s,date){const goal=G.currentGoal(state),progress=G.goalProgress(state,goal),feasible=G.goalFeasibility(state,goal,date);return {goalId:goal.id,remainingGoal:progress.remaining,remainingPeriods:feasible.monthsLeft,monthlyCapacity:feasible.limit,pace:feasible.monthlyPace,story:s.story,previousDecisions:s.v2.history.map(i=>i.decision?.id).filter(Boolean),virtualAssets:Object.keys(s.v2.assets),lifeStage:s.v2.lifeStage,country:s.country,experiencedIncidents:s.v2.seen.map(i=>i.code),date};}
export function triggerIncident(state,expectedTurn=null,date=E.today()){
  const s=activeJourney(state),goal=G.currentGoal(state);if(!s||!goal)throw Error('Choose a virtual life and a savings goal first.');
  if(s.v2.current)return s.v2.current; // Idempotent refresh or repeated request: never reroll.
  if(goal.paused)throw Error('Your adventure is paused. Resume when you are comfortable.');
  if(expectedTurn!==null&&expectedTurn!==s.v2.turn)throw Error('This envelope has already been opened.');
  const main=mainChapters(s),next=main[s.v2.cursor];if(!next){s.completed=true;return null;}
  const ctx=context(state,s,date),progress=G.goalProgress(state,goal),desired=Math.max(1,Math.min(ctx.pace,ctx.monthlyCapacity));
  let def=next;
  if(s.v2.cursor>0&&s.v2.lastKind!=='interlude'&&!progress.complete){
    const eligible=interludes(s).filter(i=>{const seen=s.v2.seen.filter(x=>x.code===i.code);return seen.length<(i.max||1)&&(!seen.length||s.v2.turn-seen.at(-1).turn>=(i.cooldown||0))&&rollOnce(s,`eligible:${s.v2.turn}:${i.code}`,i.probability??1);});
    const candidates=[next,...eligible];
    const score=i=>{const equivalent=G.exchange(virtualTotal(i.options[0].items),s.marketCurrency,goal.currency,E.activeProfile(state).fx);const fit=1/(1+Math.abs(equivalent-desired)/desired);const frugal=s.v2.flags.frugal&&i.category==='everyday'?.2:0;const novelty=i.kind==='interlude'?.18:0;const surprise=fraction(s.v2.seed,`choice:${s.v2.turn}:${i.code}`)*.45;return fit+frugal+novelty+surprise;};
    def=candidates.sort((a,b)=>score(b)-score(a))[0];
  }
  if(def.kind==='main'&&s.story==='baby'&&s.v2.cursor===1){const twins=s.config.knownTwins===true||rollOnce(s,'twins',.01);s.v2.flags.twins=twins;s.twins=twins;def=mainChapters(s)[s.v2.cursor];if(twins)def={...def,category:'rare'};}
  if(def.kind==='main'&&s.story==='car'&&s.v2.cursor===2)rollOnce(s,'carDefect',s.v2.flags.vehicleChoice==='used'?.22:.08);
  if(def.kind==='main'&&s.story==='home'&&s.v2.cursor===1)rollOnce(s,'homeDefect',s.v2.flags.propertyType==='subsale'?.3:.08);
  s.v2.month=Math.max(s.v2.month||1,def.month||1);
  const incident={id:E.uid(),code:def.code,kind:def.kind,category:def.category,title:structuredClone(def.title),intro:structuredClone(def.intro),dialogue:structuredClone(def.dialogue),scene:def.scene,month:s.v2.month,act:def.act??Math.min(4,s.v2.cursor),currency:s.marketCurrency,options:snapshotOptions(def),estimatedMarketCost:marketTotal(def.options[0].items),simulatedExpense:null,decision:null,challenge:null,selection:ctx,triggered:date,turn:s.v2.turn,completed:null};
  s.v2.current=incident;return incident;
}
function applyEffects(s,o){
  Object.assign(s.v2.flags,o.effects.flags||{});Object.assign(s.v2.assets,structuredClone(o.effects.assets||{}));if(o.effects.lifeStage)s.v2.lifeStage=o.effects.lifeStage;
  if(o.effects.flags?.vehicleChoice){const used=o.effects.flags.vehicleChoice==='used',value=cost(used?'carUsed':'carNew',s.country).typical;s.config={...s.config,price:value,down:E.round(value*(s.country==='MY'?.2:.4)),condition:used?'used':'new',warranty:!used};}
  if(s.v2.assets.property&&o.effects.flags?.renovation)s.v2.assets.property.renovation=o.effects.flags.renovation;
  if(s.v2.assets.property&&o.effects.flags?.furnished)s.v2.assets.property.furnished=true;
  if(s.story==='baby'&&s.v2.cursor===8){s.v2.lifeStage='new-parent';s.v2.assets.family={babies:s.v2.flags.twins?2:1};}
  if(s.story==='baby'&&s.v2.cursor>20)s.v2.lifeStage='toddler-household';
  if(s.v2.flags.renter)s.v2.lifeStage='independent-household';
}
export function decideIncident(state,incidentId,optionId,{mode='portion',proportion=1}={}){
  const s=activeJourney(state),i=s?.v2.current,goal=G.currentGoal(state);
  if(!i||i.id!==incidentId)throw Error('This incident is no longer awaiting a choice.');if(i.decision)throw Error('This choice is already written into the story.');if(goal.paused)throw Error('Resume your adventure before making a new choice.');
  const o=i.options.find(o=>o.id===optionId);if(!o)throw Error('Choose an available response.');
  const estimate=marketTotal(o.items),expense=virtualTotal(o.items),copy={...i,estimatedMarketCost:estimate};
  const challenge=G.conversionPlan(state,copy,expense,i.currency,{mode,proportion});
  i.decision=structuredClone(o);i.items=structuredClone(o.items);i.estimatedMarketCost=estimate;i.simulatedExpense=expense;i.challenge=challenge;i.decided=E.today();
  applyEffects(s,o);
  i.immediate=structuredClone(o.description);i.delayed=structuredClone(o.future);
  if(s.story==='car'&&o.id==='inspect')i.discovery=s.v2.rolls.carDefect?L('The inspection reveals the persisted mechanical defect before collection.','检查在提车前揭示了已确定的机械故障。'):L('This inspection finds no selected mechanical defect.','此检查没有发现已选定的机械故障。');
  if(s.story==='home'&&o.id==='inspect')i.discovery=s.v2.rolls.homeDefect?L('The inspection reveals the persisted hidden defect before handover.','检查在交付前揭示了已确定的隐患。'):L('No hidden defect was selected for this virtual property.','本虚拟房产未被选中隐患。');
  return i;
}
export function canUnlock(state,s=activeJourney(state)){const i=s?.v2.current;return !!(i?.decision&&i.challenge&&!G.currentGoal(state)?.paused&&G.challengeCredit(state,i.challenge).met);}
export function finishIncident(state,incidentId){
  const s=activeJourney(state),i=s?.v2.current;if(!i||i.id!==incidentId)throw Error('This page has already been turned.');if(!canUnlock(state,s))throw Error('Choose a response and satisfy the receipt-reviewed savings checkpoint first.');
  i.completed=E.today();s.v2.history.push(i);s.v2.seen.push({code:i.code,turn:s.v2.turn,date:i.completed});if(i.kind==='main')s.v2.cursor++;
  s.v2.lastKind=i.kind;s.v2.turn++;s.v2.current=null;s.completed=s.v2.cursor>=mainChapters(s).length;
  G.updateAchievements(state);return s;
}
export function quoteIncident(state,incidentId,quotes,reason){
  const i=activeJourney(state)?.v2.current;if(!i||i.id!==incidentId||i.decision)throw Error('Only an undecided current incident can receive a new quotation.');if(!reason?.trim())throw Error('Describe the source or reason for your quotation.');
  for(const o of i.options)for(const item of o.items)if(item.id in quotes){const q=quotes[item.id];if(!Number.isFinite(q)||q<0)throw Error('Enter valid non-negative unit quotations.');item.quote=E.round(q);item.quoteNote=reason.trim();}
  i.estimatedMarketCost=marketTotal(i.options[0].items);i.quotationAudit??=[];i.quotationAudit.push({date:E.today(),reason:reason.trim(),quotes:structuredClone(quotes)});return i;
}
export function reviseIncidentChallenge(state,incidentId,target,reason){
  const s=activeJourney(state),i=s?.v2.current,goal=G.currentGoal(state);if(!i?.challenge||i.id!==incidentId||!reason?.trim()||!Number.isFinite(target)||target<0||target>i.challenge.assigned)throw Error('Only lower the current checkpoint, with a recorded reason.');
  const paid=G.challengeCredit(state,i.challenge).paid;if(target<paid)throw Error('The revised checkpoint cannot be lower than contributions already credited to it.');
  const before=structuredClone(i.challenge),slots=G.periodPlan(state,goal,E.today(),i.id).filter(p=>p.eligible);const schedule=[];let left=E.round(target);
  for(const p of slots){const amount=E.round(Math.min(left,p.available));if(amount>0)schedule.push({due:p.due,amount});left=E.round(left-amount);if(left<=0)break;}
  if(left>0)throw Error('The revised checkpoint still exceeds available capacity. Lower it further or extend the goal duration.');
  i.challenge={...i.challenge,assigned:E.round(target),requiredTotal:E.round(i.challenge.offset+target),unassignedExpense:E.round(Math.max(0,i.challenge.expenseInGoalCurrency-target)),schedule};
  s.v2.adjustments.push({id:E.uid(),type:'checkpoint-reduced',incidentId,date:E.today(),reason:reason.trim(),before,after:structuredClone(i.challenge)});return i.challenge;
}
export function lifeSummary(s){const records=s?.v2?[...s.v2.history,...(s.v2.current?.decision?[s.v2.current]:[])]:[];return {incidents:records.length,virtualExpenses:E.round(records.reduce((n,i)=>n+(i.simulatedExpense||0),0)),decisions:records.filter(i=>i.decision).map(i=>({title:i.title,decision:i.decision.title,date:i.decided})),assets:s?.v2?.assets||{},lifeStage:s?.v2?.lifeStage||'a-new-beginning'};}

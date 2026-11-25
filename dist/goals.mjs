import {uid,today,round,activeProfile,capacity,submitTransaction,confirmTransaction} from './engine.mjs';

export function ensureGame(state){state.game??={version:2,goals:[],activeGoalId:null,achievements:[]};return state.game;}
export function currentGoal(state){const game=ensureGame(state);return game.goals.find(g=>g.id===game.activeGoalId)||null;}
export function exchange(amount,from,to,fx){if(from===to)return round(amount);if(!(fx>0))throw Error('A positive dated exchange-rate assumption is required.');return round(from==='SGD'?amount*fx:amount/fx);}
export function savingsDay(from=today(),offset=0){const d=new Date(from+'T12:00:00Z');const year=d.getUTCFullYear(),month=d.getUTCMonth()+(d.getUTCDate()>8?1:0)+offset;return new Date(Date.UTC(year,month,8,12)).toISOString().slice(0,10);}
export function monthLimit(state,goal,date=today()){
  const p=activeProfile(state,date);if(!p)return 0;
  const emergency=exchange(p.emergency,p.currency,goal.currency,p.fx);
  return round(Math.max(0,Math.min(exchange(capacity(p).available,p.currency,goal.currency,p.fx),goal.comfortableMonthly-emergency)));
}
export function goalProgress(state,goal=currentGoal(state)){
  if(!goal)return {recorded:0,saved:0,remaining:0,complete:false,pending:0};
  const rows=state.ledger.filter(t=>t.goalId===goal.id&&t.currency===goal.currency);
  const recorded=round(rows.filter(t=>t.status==='confirmed'&&t.verification?.method==='local-evidence-review').reduce((n,t)=>n+t.main,0));
  return {recorded,saved:Math.min(goal.amount,recorded),remaining:round(Math.max(0,goal.amount-recorded)),complete:recorded+.005>=goal.amount,pending:round(rows.filter(t=>t.status==='pending').reduce((n,t)=>n+t.main,0))};
}
export function createGoal(state,input,date=today()){
  const game=ensureGame(state),old=currentGoal(state);
  if(old&&!goalProgress(state,old).complete)throw Error('Adjust the current goal before starting a new one.');
  if(!Number.isFinite(input.amount)||input.amount<=0||!Number.isInteger(input.months)||input.months<1||input.months>120||!Number.isFinite(input.comfortableMonthly)||input.comfortableMonthly<0||!['MYR','SGD'].includes(input.currency))throw Error('Enter a positive goal, 1–120 months, and a valid monthly comfort limit.');
  const p=activeProfile(state,date);if(!p)throw Error('Set your personal limits first.');
  const emergency=exchange(p.emergency,p.currency,input.currency,p.fx),gross=exchange(Math.max(0,capacity(p).raw+p.emergency),p.currency,input.currency,p.fx);
  if(emergency>Math.min(input.comfortableMonthly,gross)+.005)throw Error('The optional emergency contribution exceeds your comfortable saving limit.');
  const goal={id:uid(),name:String(input.name||'My savings adventure').slice(0,80),currency:input.currency,amount:round(input.amount),months:input.months,comfortableMonthly:round(input.comfortableMonthly),created:date,firstSavingsDay:savingsDay(date),deadline:savingsDay(date,input.months-1),paused:false,completedAt:null,audit:[{id:uid(),type:'created',date,amount:round(input.amount),months:input.months,comfortableMonthly:round(input.comfortableMonthly),reason:'Explicit player approval'}]};
  game.goals.push(goal);game.activeGoalId=goal.id;return goal;
}
export function goalFeasibility(state,goal=currentGoal(state),date=today()){
  if(!goal)return {limit:0,monthlyPace:0,monthsLeft:0,possible:0,shortfall:0,suggestedMonths:null};
  const progress=goalProgress(state,goal),limit=monthLimit(state,goal,date),dates=Array.from({length:goal.months},(_,i)=>savingsDay(goal.created,i)).filter(d=>d>=date&&d<=goal.deadline),monthsLeft=dates.length,possible=round(dates.reduce((n,d)=>n+monthLimit(state,goal,d),0));
  return {limit,monthlyPace:round(progress.remaining/Math.max(1,monthsLeft)),monthsLeft,possible,shortfall:round(Math.max(0,progress.remaining-possible)),suggestedMonths:limit>0?Math.ceil(progress.remaining/limit):null};
}
export function allChallenges(state,goalId){return state.sessions.flatMap(s=>s.v2?[...s.v2.history,...(s.v2.current?[s.v2.current]:[])]:[]).filter(i=>i.challenge?.goalId===goalId).map(i=>({incident:i,challenge:i.challenge}));}
export function periodPlan(state,goal=currentGoal(state),date=today(),excludeId=null){
  if(!goal)return [];
  const reservations=allChallenges(state,goal.id).filter(x=>x.incident.id!==excludeId);
  return Array.from({length:goal.months},(_,i)=>{const due=savingsDay(goal.created,i),limit=monthLimit(state,goal,due),assigned=round(reservations.reduce((n,x)=>n+x.challenge.schedule.filter(p=>p.due===due).reduce((a,p)=>a+p.amount,0),0));return {due,limit,assigned,available:round(Math.max(0,limit-assigned)),eligible:due>=date&&due<=goal.deadline};});
}
export function conversionPlan(state,incident,simulatedExpense,marketCurrency,{mode='portion',proportion=1,date=today(),excludeId=null}={}){
  const goal=currentGoal(state),p=activeProfile(state,date);if(!goal||!p)throw Error('Set a savings goal first.');
  if(!Number.isFinite(simulatedExpense)||simulatedExpense<0||!Number.isFinite(proportion)||proportion<0||proportion>1||!['portion','spread'].includes(mode))throw Error('Choose a valid contribution share and schedule.');
  const progress=goalProgress(state,goal),prior=allChallenges(state,goal.id).filter(x=>x.incident.id!==(excludeId||incident.id)),reserved=round(prior.reduce((n,x)=>n+x.challenge.assigned,0));
  const offset=Math.max(reserved,progress.recorded),remainingUnassigned=round(Math.max(0,goal.amount-offset)),equivalent=exchange(simulatedExpense,marketCurrency,goal.currency,p.fx);
  let wanted=progress.complete||goal.paused?0:round(Math.min(equivalent*proportion,remainingUnassigned));
  const periods=periodPlan(state,goal,date,excludeId||incident.id).filter(p=>p.eligible&&p.available>0);
  if(mode==='portion')wanted=Math.min(wanted,periods[0]?.available||0);
  const schedule=[];let left=wanted;
  for(const period of periods){const amount=round(Math.min(left,period.available));if(amount>0)schedule.push({due:period.due,amount});left=round(left-amount);if(left<=0||mode==='portion')break;}
  const assigned=round(schedule.reduce((n,p)=>n+p.amount,0));
  return {id:uid(),goalId:goal.id,currency:goal.currency,marketCurrency,estimatedMarketCost:incident.estimatedMarketCost,simulatedExpense:round(simulatedExpense),expenseInGoalCurrency:equivalent,assigned,offset,requiredTotal:round(offset+assigned),unassignedExpense:round(Math.max(0,equivalent-assigned)),proportion,mode,schedule,profileId:p.id,fx:p.fx,fxDate:p.fxDate,created:date,freeAfterCompletion:progress.complete,capacityAtAssignment:monthLimit(state,goal,date)};
}
export function challengeCredit(state,challenge){
  const goal=ensureGame(state).goals.find(g=>g.id===challenge?.goalId);if(!goal||!challenge)return {paid:0,remaining:0,met:false};
  const progress=goalProgress(state,goal),paid=round(Math.max(0,Math.min(challenge.assigned,progress.recorded-challenge.offset)));
  return {paid,remaining:progress.complete?0:round(Math.max(0,challenge.assigned-paid)),met:progress.complete||paid+.005>=challenge.assigned};
}
export function adjustGoal(state,input,date=today()){
  const goal=currentGoal(state);if(!goal)throw Error('No active goal.');if(goalProgress(state,goal).complete)throw Error('A completed goal stays completed. Start a new goal voluntarily.');
  if(!input.reason?.trim()||!Number.isFinite(input.amount)||input.amount<=0||!Number.isInteger(input.months)||input.months<1||input.months>120||!Number.isFinite(input.comfortableMonthly)||input.comfortableMonthly<0)throw Error('Enter a valid revised goal, duration, limit and adjustment reason.');
  const p=activeProfile(state,date),emergency=exchange(p.emergency,p.currency,goal.currency,p.fx);if(input.comfortableMonthly<emergency)throw Error('Keep your comfortable limit above the optional emergency contribution, or adjust that contribution first.');
  goal.audit.push({id:uid(),type:'adjusted',date,reason:input.reason.trim(),before:{amount:goal.amount,months:goal.months,comfortableMonthly:goal.comfortableMonthly,deadline:goal.deadline},after:{amount:round(input.amount),months:input.months,comfortableMonthly:round(input.comfortableMonthly),deadline:savingsDay(goal.created,input.months-1)}});
  goal.amount=round(input.amount);goal.months=input.months;goal.comfortableMonthly=round(input.comfortableMonthly);goal.deadline=savingsDay(goal.created,input.months-1);updateAchievements(state,date);return goal;
}
export function pauseGoal(state,paused,reason,date=today()){const goal=currentGoal(state);if(!goal||!reason?.trim())throw Error('Add a reason for this pause or resume.');goal.paused=!!paused;goal.audit.push({id:uid(),type:paused?'paused':'resumed',date,reason:reason.trim()});return goal;}
export function updateAchievements(state,date=today()){
  const game=ensureGame(state);for(const goal of game.goals){if(goalProgress(state,goal).complete&&!goal.completedAt){goal.completedAt=date;game.achievements.push({id:`goal:${goal.id}`,type:'goal-complete',goalId:goal.id,date,amount:goal.amount,currency:goal.currency});goal.audit.push({id:uid(),type:'completed',date,amount:goal.amount});}}
}
export function inspectEvidence(bytes,type){const b=bytes instanceof Uint8Array?bytes:new Uint8Array(bytes);if(b.length===0||b.length>5*1024*1024)throw Error('Choose a receipt smaller than 5 MB.');const png=b.length>=8&&[137,80,78,71,13,10,26,10].every((v,i)=>b[i]===v),jpeg=b[0]===255&&b[1]===216&&b[2]===255,pdf=String.fromCharCode(...b.slice(0,5))==='%PDF-';if(!((type==='image/png'&&png)||(type==='image/jpeg'&&jpeg)||(type==='application/pdf'&&pdf)))throw Error('The receipt contents do not match a supported PNG, JPG or PDF file.');return {format:type,signatureChecked:true,size:b.length};}
export function submitEvidence(state,t){
  const goal=currentGoal(state);if(!goal)throw Error('Set a savings goal first.');
  if(t.date<goal.created)throw Error('Use new evidence dated on or after this goal started. Earlier savings cannot be credited again.');
  if(!t.hash||!/^[a-f0-9]{64}$/.test(t.hash)||!t.fileName||!t.evidence?.signatureChecked)throw Error('Upload valid transaction evidence before submitting.');
  if(t.main>0&&(t.currency!==goal.currency||t.main>goalProgress(state,goal).remaining-goalProgress(state,goal).pending+.005))throw Error('Allocate no more than the remaining uncredited goal amount, in the goal currency.');
  const p=activeProfile(state);if(t.emergency>0&&t.currency!==p.currency)throw Error('Record emergency contributions in the profile currency.');
  const entry=submitTransaction(state,{...t,goalId:goal.id});entry.verification={method:'pending-local-review',bankSettlementConfirmed:false};return entry;
}
export function verifyEvidence(state,id,attested,date=today()){
  const t=state.ledger.find(t=>t.id===id);if(!t||!t.goalId||!t.hash||!t.evidence?.signatureChecked||!attested)throw Error('Review the receipt and explicitly confirm the entered transfer details.');
  confirmTransaction(state,id);t.verification={method:'local-evidence-review',reviewedAt:new Date().toISOString(),checks:['file-signature','unique-reference','unique-file-hash','allocation-total','player-attestation'],bankSettlementConfirmed:false};updateAchievements(state,date);return t;
}
export function savingsStatement(state,goal=currentGoal(state)){
  if(!goal)return [];
  const records=allChallenges(state,goal.id),credit=goalProgress(state,goal).recorded;return periodPlan(state,goal).filter(p=>p.assigned>0).map(period=>{
    const incidents=records.flatMap(({incident,challenge})=>{let preceding=0;return challenge.schedule.flatMap(s=>{const offset=challenge.offset+preceding;preceding+=s.amount;return s.due===period.due?[{incidentId:incident.id,title:incident.title,marketCost:incident.estimatedMarketCost,marketCurrency:incident.currency,simulatedExpense:incident.simulatedExpense,assigned:s.amount,paid:round(Math.max(0,Math.min(s.amount,credit-offset)))}]:[];});});
    return {...period,incidents,paid:round(incidents.reduce((n,i)=>n+i.paid,0))};
  });
}

/** @typedef {import('./animation-types').AnimationAsset} AnimationAsset */
const definitions=[
 ['pregnancy_test_purchase','baby','home',4300,'A little anticipation','A test kit on the table. Nothing has been confirmed.','assistant'],
 ['pregnancy_test_positive','baby','home',7000,'A little adventure begins','Wait… is that what I think it is?','partner'],
 ['pregnancy_consultation','baby','clinic',6500,'One step at a time','A fictional clinic visit opens a conversation about care.','doctor'],
 ['pregnancy_twins_reveal','baby','clinic',7500,'An unexpected pair','Two illustrative shapes appear on the story ultrasound.','doctor'],
 ['baby_preparation','baby','home',5500,'Making a little room','A corner becomes a nursery, one thoughtful item at a time.','partner'],
 ['car_showroom','car','showroom',6000,'A possible new road','A salesperson shows you around a virtual car.','agent'],
 ['car_delivery','car','showroom',6500,'Keys to a new chapter','A virtual handover. The road ahead brings responsibilities.','agent'],
 ['car_maintenance','car','showroom',5500,'Care keeps it going','A mechanic checks the car and explains the work.','mechanic'],
 ['car_battery_failure','car','showroom',6500,'A reluctant start','You try the ignition. The dashboard flickers, then falls quiet.','mechanic'],
 ['property_showroom','home','apartment',6000,'A door not yet opened','The agent unfolds a floor plan. You imagine a life here.','agent'],
 ['property_water_leak','home','apartment',6500,'A mark on the ceiling','Rain taps the window. A drip sends you looking for a bucket.','contractor'],
 ['travel_departure','travel','home',5000,'A little further from home','A suitcase closes. A new place is waiting.','partner'],
 ['wedding_planning','wedding','home',5500,'A day that feels like you','Two people make room for the details they care about.','agent'],
 ['business_first_order','business','apartment',5500,'A little idea takes shape','An assistant brings a parcel and a new possibility.','assistant'],
 ['education_new_page','education','home',5000,'A new page to learn from','You open a letter and gather your books.','assistant'],
 ['living_move_in','living','apartment',5500,'A window of your own','Boxes at the door. A room waiting to become home.','partner'],
 ['retirement_morning','retirement','home',5000,'A slower morning','A quiet cup of tea and a conversation with family.','family'],
 ['emergency_small_surprise','emergency','apartment',5000,'An ordinary little surprise','Something needs care. You pause and look at the options.','contractor'],
 ['milestone_completion','shared','home',8000,'A page lived','A warm celebration of a completed savings checkpoint.','partner'],
 ['page_turn','shared','home',2000,'Another page','A quiet transition between story pages.','partner'],
 ['everyday_neighbourhood','shared','home',4500,'The quieter parts of life','An ordinary moment becomes another page in the story.','partner']
];
/** @type {ReadonlyArray<AnimationAsset>} */
export const ANIMATIONS=Object.freeze(definitions.map(([id,storyId,environmentId,durationMs,title,description,support])=>Object.freeze({id,storyId,version:1,category:id==='milestone_completion'?'completion':id==='page_turn'?'progression':'opening',assetType:'svg',source:`assets/animations/${id}.svg`,poster:`assets/posters/${id}.svg`,durationMs,loop:false,skippable:true,replayable:true,fallbackScene:description,characterIds:['player',support],environmentId,nextAction:'dialogue',title,description,support,status:'available',ambient:{durationMs:4000,loop:true},outcome:{durationMs:3500},completion:{durationMs:8000},variants:{opening:{source:`assets/animations/${id}.svg`},ambient:{source:`assets/animations/${id}.svg`,durationMs:4000,loop:true},outcomes:{source:`assets/animations/${id}.svg`,durationMs:3500,renderer:'option-props'},completion:{source:'assets/animations/milestone_completion.svg',durationMs:8000},reducedMotion:{poster:`assets/posters/${id}.svg`}},reducedMotion:'static-key-pose'})));
export const animationById=id=>ANIMATIONS.find(a=>a.id===id)||ANIMATIONS.at(-1);
export function animationFor(s,i){let id='everyday_neighbourhood';const n=Number(i.code?.split('-').at(-1));if(i.code==='car-battery')id='car_battery_failure';else if(i.code==='home-leak')id='property_water_leak';else if(i.kind==='interlude'&&['rain-walk','quiet-kettle','neighbour-picnic'].includes(i.code))id=i.scene==='kitchen'?'emergency_small_surprise':'everyday_neighbourhood';else if(s.story==='baby')id=n===0?'pregnancy_test_purchase':n===1?(s.v2.flags.twins?'pregnancy_twins_reveal':'pregnancy_consultation'):['nursery','baby','newborn','toddler','birthday'].includes(i.scene)||n>=5?'baby_preparation':'pregnancy_consultation';else if(s.story==='car')id=n===0?'car_showroom':n===4?'car_delivery':'car_maintenance';else if(s.story==='home')id='property_showroom';else id=({travel:'travel_departure',wedding:'wedding_planning',business:'business_first_order',education:'education_new_page',living:'living_move_in',retirement:'retirement_morning',emergency:'emergency_small_surprise'})[s.story]||id;return animationById(id);}
export function outcomeFor(asset,optionId){return asset.id==='pregnancy_test_purchase'?animationById('pregnancy_test_positive'):{...asset,category:'outcome',durationMs:3500,nextAction:'financial-reveal',outcomeId:optionId};}
export function presentationFor(i){return i.presentation||{version:1,phase:i.decision?'financial':'opening',optionId:null,openingSeen:false,outcomeSeen:false};}
export function advancePresentation(i,event,optionId=null){const p=presentationFor(i);i.presentation=p;if(event==='opening-finished'&&p.phase==='opening'){p.phase='dialogue';p.openingSeen=true;}else if(event==='continue'&&p.phase==='dialogue')p.phase='choices';else if(event==='choose'&&['choices','financial'].includes(p.phase)&&!i.decision&&i.options.some(o=>o.id===optionId)){p.phase='outcome';p.optionId=optionId;p.outcomeSeen=false;}else if(event==='outcome-finished'&&p.phase==='outcome'){p.phase='financial';p.outcomeSeen=true;}return p;}

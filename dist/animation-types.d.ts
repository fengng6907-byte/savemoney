export type AnimationAsset = Readonly<{
 id:string; storyId:string; version:number; category:'opening'|'outcome'|'ambient'|'completion'|'progression';
 assetType:'svg'|'webp'|'webm'|'mp4'|'sprite'|'gif'; source:string; poster:string;
 durationMs:number; loop:boolean; skippable:boolean; replayable:boolean; fallbackScene:string;
 characterIds:string[]; environmentId:string; nextAction:string;
 variants:{opening:{source:string};ambient:{source:string;durationMs:number;loop:boolean};outcomes:{source:string;durationMs:number;renderer:string};completion:{source:string;durationMs:number};reducedMotion:{poster:string}};sprite?:{columns:number;rows:number;frames:number};
 title:string; description:string; support:string; status:'available'; outcomeId?:string;
 ambient:{durationMs:number;loop:boolean};outcome:{durationMs:number};completion:{durationMs:number};reducedMotion:'static-key-pose';
}>;
export interface Character {name:string;skin:string;hair:string;hairstyle:'wave'|'crop'|'bob'|'long';clothing:string;presentation:'feminine'|'masculine'|'androgynous';accessory:'none'|'glasses'|'earrings'}
export interface IncidentPresentation {version:1;phase:'opening'|'dialogue'|'choices'|'outcome'|'financial';optionId:string|null;openingSeen:boolean;outcomeSeen:boolean}

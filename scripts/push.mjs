// Godrank reminder sender, run by .github/workflows/reminders.yml every 15 minutes.
// GODRANK_PUSH = setup code from the app (base64 JSON: s = push subscription, tz, t = {weekday: "HH:MM"}, e = evening "HH:MM" | null)
// VAPID_PRIVATE = private half of the key pair whose public half is in reminders.js
//   node push.mjs plan   -> writes date + due kinds to GITHUB_OUTPUT
//   node push.mjs send   -> sends due kinds not already in .sent/list
import fs from 'fs';
const VAPID_PUBLIC='BAXE3ZchkQiRMGRWluBniRp51MDqjBV8eBreUlo1BUQbD_fSvSrh1HW_0wnw-2nG8ObO6PnR5Ed3JltYYt725RM';
const out=(k,v)=>process.env.GITHUB_OUTPUT?fs.appendFileSync(process.env.GITHUB_OUTPUT,`${k}=${v}\n`):console.log(k,'=',v);
if(!process.env.GODRANK_PUSH){console.log('No GODRANK_PUSH secret yet, nothing to do');out('due','');process.exit(0)}
const cfg=JSON.parse(Buffer.from(process.env.GODRANK_PUSH,'base64').toString());
// local time in the phone's time zone
const parts=Object.fromEntries(new Intl.DateTimeFormat('en-US',{timeZone:cfg.tz,weekday:'short',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'})
  .formatToParts(new Date()).map(p=>[p.type,p.value]));
const dow=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(parts.weekday),now=+parts.hour*60+ +parts.minute,date=`${parts.year}-${parts.month}-${parts.day}`;
const mins=t=>{const [h,m]=t.split(':').map(Number);return h*60+m};
// GitHub's schedule can run late, so a reminder goes out on the first run from 10 min before its time to 50 min after
const due=(t)=>t&&now>=mins(t)-10&&now<mins(t)+50;
const kinds=[];
if(process.env.KIND)kinds.push(process.env.KIND);
else{const t=cfg.t[dow];if(due(t))kinds.push('gym');if(cfg.t[dow]&&due(cfg.e))kinds.push('evening')}
const mode=process.argv[2];
if(mode==='plan'){out('date',date);out('due',kinds.join(','));console.log(`${date} ${parts.hour}:${parts.minute} ${cfg.tz} due:`,kinds.join(',')||'none');process.exit(0)}
const sentFile='.sent/list';const sent=fs.existsSync(sentFile)?fs.readFileSync(sentFile,'utf8').split('\n').filter(Boolean):[];
const todo=kinds.filter(k=>k==='test'||!sent.includes(k));
if(!todo.length){console.log('Already sent:',sent.join(',')||'none');out('sent','false');process.exit(0)}
const webpush=(await import('web-push')).default;
webpush.setVapidDetails('https://fakecookkyyy.github.io/godrank/',VAPID_PUBLIC,process.env.VAPID_PRIVATE);
let failed=false,any=false;
for(const kind of todo){try{const r=await webpush.sendNotification(cfg.s,JSON.stringify({kind}),{TTL:3600,urgency:'high'});console.log('sent',kind,r.statusCode);any=true;if(kind!=='test')sent.push(kind)}
  catch(e){failed=true;console.error('push failed',kind,e.statusCode,e.body||e.message);if(e.statusCode===404||e.statusCode===410)console.error('The phone subscription expired. Turn reminders off and on in the app and paste a new setup code.')}}
fs.mkdirSync('.sent',{recursive:true});fs.writeFileSync(sentFile,sent.join('\n'));out('sent',String(any));
process.exit(failed?1:0);

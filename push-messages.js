// Godrank reminder text. Shared by the service worker (real pushes) and the app (test button).
// st = state the app saves on every change: name, day (today's workout), miss (training days skipped since the
// last workout), since (days since last workout), streak, rank, next, trained (already trained today).
(function(root){
const P={
  gym:[
    'g1|{day} day. Gym. Now. Let\'s go, {name}.',
    'g2|Shoes on, keys, gym. {day} day is waiting.',
    'g3|Get up. Technique Gods don\'t hit snooze. {day} day.',
    'g4|Rudeus is already at the gym. Where the hell are you? {day} day.',
    'g5|{next} isn\'t going to rank itself. {day} day, go.',
    'g6|Time to work. {day} day. No excuses today.'],
  streak:[
    's1|{streak}-day streak on the line. Don\'t you dare break it. Gym.',
    's2|{streak} days straight. Make it {streak1}. Get moving.'],
  slip:[
    'l1|You skipped last time. Not today. {day} day, get moving.',
    'l2|One missed day is a slip. Two is a habit. Get to the gym.',
    'l3|Yesterday\'s excuse doesn\'t work twice. {day} day. Go.'],
  weak:[
    'w1|{miss} training days missed. You\'re getting weaker while you sit there. Get the fuck up.',
    'w2|Your {rank} rank is slipping, {name}. {miss} sessions skipped. Gym. Now.',
    'w3|{miss} days of nothing. Muscle doesn\'t wait for you. Let\'s go.',
    'w4|What the hell are you doing? {miss} sessions missed. Today is {day} day. Move.'],
  gone:[
    'x1|{miss} missed sessions. You\'re slacking hard. One workout turns it around. Go.',
    'x2|It\'s been {since} days. You\'re getting weaker every one of them. Get your ass to the gym.',
    'x3|The Seven Great Powers don\'t take vacations. {miss} missed. Today it ends.'],
  done:[
    'd1|Already trained today. Respect. Recovery counts too.',
    'd2|Work\'s done for today. Eat, sleep, come back stronger.'],
  eveMiss:[
    'e1|You didn\'t train today. Still time for a quick {day} session.',
    'e2|Today was {day} day and you skipped it. Tomorrow you don\'t.',
    'e3|Zero sets logged today. That\'s how ranks slip, {name}.',
    'e4|Skipped again? That\'s {miss} missed. You\'re better than this.'],
  eveDone:[
    'v1|Workout logged. {streak}-day streak. Rest up.',
    'v2|Done for today. That\'s how you climb to {next}.',
    'v3|Session in the books. Sleep, eat, repeat.']
};
// pick the right pool for this moment, skipping the last few messages so it doesn't repeat itself
function pick(kind,st,recent){st=st||{};recent=recent||[];let pool;
  if(kind==='evening')pool=st.trained?P.eveDone:P.eveMiss;
  else if(st.trained)pool=P.done;
  else if(st.miss>=4)pool=P.gone;
  else if(st.miss>=2)pool=P.weak;
  else if(st.miss===1)pool=P.slip;
  else pool=st.streak>=2&&Math.random()<.4?P.streak:P.gym;
  const fresh=pool.filter(l=>!recent.includes(l.split('|')[0]));const line=(fresh.length?fresh:pool)[Math.random()*(fresh.length||pool.length)|0];
  const [id,txt]=line.split('|');
  const v={name:st.name||'disciple',day:st.day||'Training',miss:st.miss||0,since:st.since||0,streak:st.streak||0,streak1:(st.streak||0)+1,rank:st.rank||'North God',next:st.next||'the next rank'};
  return {id,title:kind==='evening'?(st.trained?'Godrank':'Godrank · You slipped'):(st.miss>=2?'Godrank · You\'re getting weaker':'Godrank · Time to train'),body:txt.replace(/\{(\w+)\}/g,(_,k)=>v[k])}}
root.GodrankMsg={pick};
})(typeof self!=='undefined'?self:window);

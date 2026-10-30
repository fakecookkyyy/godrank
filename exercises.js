// Godrank exercise library. One line per exercise: Name | equipment | pattern | muscles (primary first) | flags
// equipment: bb barbell, db dumbbell, cb cable, mc machine, sm smith, ez EZ-bar, tb trap bar, kb kettlebell, lm landmine,
//            pl plate, bd band, bw bodyweight (reps), wb weighted bodyweight (added load), tm timed hold (seconds)
// flags: * staple (preferred by the planner), xN rating multiplier, iso/cmp override
(()=>{
const RAW={
chest:`Barbell Bench Press|bb|hpress|chest,triceps,shoulders|*
Incline Barbell Bench Press|bb|hpress|chest,shoulders,triceps|* x.85
Decline Barbell Bench Press|bb|hpress|chest,triceps|x1.05
Dumbbell Bench Press|db|hpress|chest,triceps,shoulders|*
Incline Dumbbell Press|db|hpress|chest,shoulders,triceps|* x.85
Decline Dumbbell Press|db|hpress|chest,triceps|x1.05
Smith Machine Bench Press|sm|hpress|chest,triceps,shoulders
Incline Smith Machine Press|sm|hpress|chest,shoulders,triceps|x.85
Decline Smith Machine Press|sm|hpress|chest,triceps|x1.05
Machine Chest Press|mc|hpress|chest,triceps|*
Incline Machine Chest Press|mc|hpress|chest,shoulders|x.85
Decline Machine Chest Press|mc|hpress|chest,triceps
Paused Bench Press|bb|hpress|chest,triceps|x.92
Spoto Press|bb|hpress|chest,triceps|x.9
Barbell Floor Press|bb|hpress|chest,triceps|x.9
Dumbbell Floor Press|db|hpress|chest,triceps|x.9
Pin Press|bb|hpress|chest,triceps
Larsen Press|bb|hpress|chest,triceps|x.9
Wide-Grip Bench Press|bb|hpress|chest,shoulders|x.95
Reverse-Grip Bench Press|bb|hpress|chest,triceps|x.9
Neutral-Grip Dumbbell Press|db|hpress|chest,triceps
Single-Arm Dumbbell Bench Press|db|hpress|chest,core|x.9
Guillotine Press|bb|hpress|chest,shoulders|x.75
Squeeze Press|db|hpress|chest,triceps|x.8
Hex Press|db|hpress|chest,triceps|x.8
Kettlebell Floor Press|kb|hpress|chest,triceps|x.9
Cable Chest Press|cb|hpress|chest,triceps
Standing Cable Press|cb|hpress|chest,shoulders,core|x.8
Band Chest Press|bd|hpress|chest,triceps
Landmine Squeeze Press|lm|hpress|chest,shoulders
Plate Press|pl|hpress|chest|x.7
Dumbbell Fly|db|fly|chest,shoulders|*
Incline Dumbbell Fly|db|fly|chest,shoulders|x.9
Decline Dumbbell Fly|db|fly|chest
Cable Fly|cb|fly|chest|*
High-to-Low Cable Fly|cb|fly|chest
Low-to-High Cable Fly|cb|fly|chest,shoulders|x.9
Single-Arm Cable Fly|cb|fly|chest|x.6
Cable Crossover|cb|fly|chest
Pec Deck|mc|fly|chest|*
Technogym Chest Press|mc|hpress|chest,triceps,shoulders|*
Band Fly|bd|fly|chest
Svend Press|pl|fly|chest|x.8
Plate Squeeze Press|pl|fly|chest|x.8
Dumbbell Pullover|db|pullover|chest,back
Push-Up|bw|pushup|chest,triceps,shoulders|*
Wide Push-Up|bw|pushup|chest,shoulders
Incline Push-Up|bw|pushup|chest,triceps|x1.6
Decline Push-Up|bw|pushup|chest,shoulders|x.8
Archer Push-Up|bw|pushup|chest,triceps|x.4
Clap Push-Up|bw|pushup|chest,triceps|x.45
Weighted Push-Up|wb|pushup|chest,triceps
Deficit Push-Up|bw|pushup|chest,triceps|x.85
Pseudo Planche Push-Up|bw|pushup|chest,shoulders|x.35
Knee Push-Up|bw|pushup|chest,triceps|x2
Ring Push-Up|bw|pushup|chest,core|x.7
Spiderman Push-Up|bw|pushup|chest,core|x.8
One-Arm Push-Up|bw|pushup|chest,triceps,core|x.2
Resistance Band Push-Up|bd|pushup|chest,triceps|x.7
Medicine Ball Push-Up|bw|pushup|chest,triceps|x.8
Chest Dip|bw|dip|chest,triceps|*
Weighted Chest Dip|wb|dip|chest,triceps
Ring Dip|bw|dip|chest,triceps|x.6
Assisted Dip Machine|mc|dip|chest,triceps|x2
Smith Machine Incline Squeeze Press|sm|hpress|chest|x.7
Kneeling Landmine Press|lm|hpress|chest,shoulders|x.9`,
back:`Barbell Row|bb|row|back,biceps|*
Pendlay Row|bb|row|back,biceps|*
Underhand Barbell Row|bb|row|back,biceps
Seal Row|bb|row|back,biceps|x.85
T-Bar Row|lm|row|back,biceps|*
Chest-Supported T-Bar Row|mc|row|back,biceps
One-Arm Dumbbell Row|db|row|back,biceps|*
Chest-Supported Dumbbell Row|db|row|back,shoulders
Kroc Row|db|row|back,biceps,forearms
Meadows Row|lm|row|back,biceps
Seated Cable Row|cb|row|back,biceps|*
Wide-Grip Cable Row|cb|row|back,shoulders
Single-Arm Cable Row|cb|row|back,biceps|x.55
Machine Row|mc|row|back,biceps|*
Machine High Row|mc|row|back,shoulders
Machine Low Row|mc|row|back,biceps
Smith Machine Row|sm|row|back,biceps
Inverted Row|bw|row|back,biceps|*
Ring Row|bw|row|back,biceps|x1.2
Kettlebell Row|kb|row|back,biceps
Renegade Row|db|row|back,core|x.7
Band Row|bd|row|back,biceps
Helms Row|db|row|back,shoulders|x.85
Gorilla Row|kb|row|back,biceps
Bent-Over Dumbbell Row|db|row|back,biceps
Landmine Row|lm|row|back,biceps
Rack Row|bb|row|back,biceps|x.9
Pull-Up|bw|vpull|back,biceps|*
Chin-Up|bw|vpull|back,biceps|* x1.1
Neutral-Grip Pull-Up|bw|vpull|back,biceps|x1.05
Wide-Grip Pull-Up|bw|vpull|back,shoulders|x.85
Weighted Pull-Up|wb|vpull|back,biceps|*
Weighted Chin-Up|wb|vpull|back,biceps|x1.08
Assisted Pull-Up Machine|mc|vpull|back,biceps|x2
Negative Pull-Up|bw|vpull|back,biceps|x1.5
Commando Pull-Up|bw|vpull|back,biceps,core|x.8
L-Sit Pull-Up|bw|vpull|back,core|x.6
Archer Pull-Up|bw|vpull|back,biceps|x.4
Muscle-Up|bw|vpull|back,chest,triceps|x.3
Lat Pulldown|cb|vpull|back,biceps|*
Wide-Grip Lat Pulldown|cb|vpull|back,shoulders
Close-Grip Lat Pulldown|cb|vpull|back,biceps
Reverse-Grip Lat Pulldown|cb|vpull|back,biceps
Neutral-Grip Lat Pulldown|cb|vpull|back,biceps|*
Single-Arm Lat Pulldown|cb|vpull|back|x.5
Machine Pulldown|mc|vpull|back,biceps
Band Lat Pulldown|bd|vpull|back,biceps
Kneeling Single-Arm Pulldown|cb|vpull|back|x.5
Towel Pull-Up|bw|vpull|back,forearms|x.6
Straight-Arm Pulldown|cb|pullover|back|*
Cable Pullover|cb|pullover|back,chest
Machine Pullover|mc|pullover|back
Lat Prayer|cb|pullover|back
Deadlift|bb|hinge|back,hams,glutes,traps,forearms|*
Sumo Deadlift|bb|hinge|glutes,back,hams,quads|*
Trap Bar Deadlift|tb|hinge|back,quads,glutes,traps|*
Deficit Deadlift|bb|hinge|back,hams,glutes|x.9
Rack Pull|bb|hinge|back,traps,glutes|x1.2
Block Pull|bb|hinge|back,traps|x1.12
Snatch-Grip Deadlift|bb|hinge|back,traps,hams|x.85
Paused Deadlift|bb|hinge|back,hams,glutes|x.9
Dumbbell Deadlift|db|hinge|back,hams,glutes
Kettlebell Deadlift|kb|hinge|back,glutes,hams
Back Extension|bw|ext|back,glutes,hams|*
Weighted Back Extension|wb|ext|back,glutes,hams
Reverse Hyperextension|mc|ext|glutes,back,hams
Superman|bw|ext|back|x1.5
Bird Dog|bw|ext|back,core|x1.5
Jefferson Curl|bb|ext|back,hams|x.4
Hyperextension Machine|mc|ext|back,glutes
Barbell Shrug|bb|shrug|traps,forearms|*
Dumbbell Shrug|db|shrug|traps,forearms|*
Trap Bar Shrug|tb|shrug|traps
Smith Machine Shrug|sm|shrug|traps
Cable Shrug|cb|shrug|traps
Behind-the-Back Shrug|bb|shrug|traps|x.85
Kettlebell Shrug|kb|shrug|traps
Snatch-Grip High Pull|bb|shrug|traps,shoulders|x.45
Farmer's Carry|db|carry|traps,forearms,core|*
Scapular Pull-Up|bw|vpull|back,traps|x2
Dead Hang|tm|hang|forearms,back
Rope Climb|bw|vpull|back,biceps,forearms|x.25
Kettlebell Swing|kb|swing|glutes,hams,back
Band Pull-Apart|bd|rear|shoulders,back,traps`,
shoulders:`Overhead Press|bb|vpress|shoulders,triceps|*
Seated Barbell Press|bb|vpress|shoulders,triceps|x.95
Push Press|bb|vpress|shoulders,triceps,quads|x1.2
Behind-the-Neck Press|bb|vpress|shoulders,triceps|x.85
Seated Dumbbell Shoulder Press|db|vpress|shoulders,triceps|*
Standing Dumbbell Press|db|vpress|shoulders,triceps,core|x.95
Arnold Press|db|vpress|shoulders,triceps|* x.9
Single-Arm Dumbbell Press|db|vpress|shoulders,core|x.95
Smith Machine Shoulder Press|sm|vpress|shoulders,triceps
Machine Shoulder Press|mc|vpress|shoulders,triceps|*
Landmine Press|lm|vpress|shoulders,chest|x.9
Z Press|bb|vpress|shoulders,core|x.85
Kettlebell Press|kb|vpress|shoulders,triceps
Bottoms-Up Kettlebell Press|kb|vpress|shoulders,forearms|x.7
Pike Push-Up|bw|vpress|shoulders,triceps|*
Handstand Push-Up|bw|vpress|shoulders,triceps|x.35
Band Overhead Press|bd|vpress|shoulders,triceps
Viking Press|mc|vpress|shoulders,triceps
Bradford Press|bb|vpress|shoulders|x.75
Cuban Press|db|vpress|shoulders|x.45
Dumbbell Lateral Raise|db|lateral|shoulders|*
Cable Lateral Raise|cb|lateral|shoulders|*
Single-Arm Cable Lateral Raise|cb|lateral|shoulders|x.55
Machine Lateral Raise|mc|lateral|shoulders|*
Lean-Away Lateral Raise|db|lateral|shoulders|x.9
Seated Lateral Raise|db|lateral|shoulders|x.95
Band Lateral Raise|bd|lateral|shoulders
Cable Y-Raise|cb|lateral|shoulders,traps|x.8
Lu Raise|pl|lateral|shoulders,traps|x.7
Partial Lateral Raise|db|lateral|shoulders|x1.2
Kettlebell Lateral Raise|kb|lateral|shoulders
Dumbbell Front Raise|db|front|shoulders|*
Barbell Front Raise|bb|front|shoulders
Cable Front Raise|cb|front|shoulders
Plate Front Raise|pl|front|shoulders
Band Front Raise|bd|front|shoulders
Incline Front Raise|db|front|shoulders|x.85
Face Pull|cb|rear|shoulders,traps,back|*
Reverse Pec Deck|mc|rear|shoulders,back|*
Bent-Over Reverse Fly|db|rear|shoulders,back
Cable Reverse Fly|cb|rear|shoulders,back
Chest-Supported Reverse Fly|db|rear|shoulders,back
Rear Delt Row|db|rear|shoulders,back|x1.3
Prone Y-T-W|db|rear|shoulders,traps|x.6
Single-Arm Cable Rear Delt Fly|cb|rear|shoulders|x.55
Band Face Pull|bd|rear|shoulders,traps
Barbell Upright Row|bb|upright|shoulders,traps|*
Cable Upright Row|cb|upright|shoulders,traps
Dumbbell Upright Row|db|upright|shoulders,traps
EZ-Bar Upright Row|ez|upright|shoulders,traps
Overhead Carry|db|carry|shoulders,core|x.6
Wall Walk|bw|vpress|shoulders,core|x.5
Scaption Raise|db|lateral|shoulders|x.9
Bus Driver|pl|front|shoulders|x.8
Around-the-World|db|lateral|shoulders|x.6
Kettlebell Halo|kb|lateral|shoulders,core|x.8
Landmine Lateral Raise|lm|lateral|shoulders
Hindu Push-Up|bw|pushup|shoulders,chest,triceps|x.8
Plate Overhead Press|pl|vpress|shoulders,triceps|x.6
Seated Machine Rear Delt Row|mc|rear|shoulders,back|x1.3`,
arms:`Barbell Curl|bb|curl|biceps,forearms|*
EZ-Bar Curl|ez|curl|biceps,forearms|*
Dumbbell Curl|db|curl|biceps|*
Alternating Dumbbell Curl|db|curl|biceps
Hammer Curl|db|curl|biceps,forearms|*
Cross-Body Hammer Curl|db|curl|biceps,forearms
Incline Dumbbell Curl|db|curl|biceps|* x.85
EZ-Bar Preacher Curl|ez|curl|biceps|* x.85
Dumbbell Preacher Curl|db|curl|biceps|x.85
Machine Preacher Curl|mc|curl|biceps
Spider Curl|db|curl|biceps|x.8
Concentration Curl|db|curl|biceps|x.85
Cable Curl|cb|curl|biceps|*
Rope Hammer Curl|cb|curl|biceps,forearms
Bayesian Cable Curl|cb|curl|biceps|x.55
High Cable Curl|cb|curl|biceps|x.55
Drag Curl|bb|curl|biceps|x.85
Zottman Curl|db|curl|biceps,forearms|x.85
Waiter Curl|db|curl|biceps|x1.6
21s|ez|curl|biceps|x.75
Band Curl|bd|curl|biceps
Kettlebell Curl|kb|curl|biceps
Machine Bicep Curl|mc|curl|biceps
Lying Cable Curl|cb|curl|biceps
Strict Curl|bb|curl|biceps|x.9
Reverse Curl|ez|curl|forearms,biceps|x.75
Close-Grip Bench Press|bb|hpress|triceps,chest|* x.9
JM Press|bb|triext|triceps|x1.6
EZ-Bar Skull Crusher|ez|triext|triceps|*
Dumbbell Skull Crusher|db|triext|triceps
Overhead Dumbbell Extension|db|triext|triceps|x1.4
Single-Arm Overhead Extension|db|triext|triceps|x.6
Cable Overhead Extension|cb|triext|triceps|*
Rope Pushdown|cb|triext|triceps|*
Straight-Bar Pushdown|cb|triext|triceps|x1.15
V-Bar Pushdown|cb|triext|triceps|x1.15
Reverse-Grip Pushdown|cb|triext|triceps|x.85
Single-Arm Cable Pushdown|cb|triext|triceps|x.55
Dumbbell Kickback|db|triext|triceps|x.6
Cable Kickback|cb|triext|triceps|x.5
Tate Press|db|triext|triceps|x.8
Bench Dip|bw|dip|triceps|x1.6
Diamond Push-Up|bw|pushup|triceps,chest|* x.7
Triceps Dip|bw|dip|triceps,chest|*
Machine Triceps Extension|mc|triext|triceps|*
Close-Grip Push-Up|bw|pushup|triceps,chest|x.8
Band Pushdown|bd|triext|triceps
Katana Extension|cb|triext|triceps|x.6
Smith Close-Grip Press|sm|hpress|triceps,chest|x.9
Wrist Curl|bb|wrist|forearms|*
Reverse Wrist Curl|bb|wrist|forearms|x.6
Behind-the-Back Wrist Curl|bb|wrist|forearms|x1.2
Dumbbell Wrist Curl|db|wrist|forearms
Plate Pinch|tm|hang|forearms
Wrist Roller|pl|wrist|forearms|x.4
Farmer's Walk|db|carry|forearms,traps,core
Gripper Squeeze|bw|grip|forearms`,
legs:`Back Squat|bb|squat|quads,glutes,core|*
High-Bar Squat|bb|squat|quads,glutes|x.98
Low-Bar Squat|bb|squat|glutes,quads,back|x1.05
Front Squat|bb|squat|quads,core|* x.82
Box Squat|bb|squat|glutes,quads|x1.02
Pause Squat|bb|squat|quads,glutes|x.88
Safety Bar Squat|bb|squat|quads,glutes|x.92
Zercher Squat|bb|squat|quads,core|x.8
Goblet Squat|db|squat|quads,glutes|*
Smith Machine Squat|sm|squat|quads,glutes
Hack Squat|mc|squat|quads|* x1.15
Pendulum Squat|mc|squat|quads|x1.05
Belt Squat|mc|squat|quads,glutes
Leg Press|mc|legpress|quads,glutes|*
Single-Leg Leg Press|mc|legpress|quads,glutes|x.5
Bulgarian Split Squat|db|lunge|quads,glutes|*
Barbell Split Squat|bb|lunge|quads,glutes
Walking Lunge|db|lunge|quads,glutes|*
Reverse Lunge|db|lunge|glutes,quads
Forward Lunge|db|lunge|quads,glutes
Lateral Lunge|db|lunge|quads,glutes|x.8
Step-Up|db|lunge|quads,glutes|x.9
Pistol Squat|bw|squat|quads,glutes|x.12
Sissy Squat|bw|legext|quads|x.5
Bodyweight Squat|bw|squat|quads,glutes|*
Jump Squat|bw|squat|quads,glutes,calves|x.6
Cossack Squat|bw|lunge|quads,glutes|x.5
Leg Extension|mc|legext|quads|*
Single-Leg Extension|mc|legext|quads|x.5
Heels-Elevated Goblet Squat|db|squat|quads|x.95
Landmine Squat|lm|squat|quads,glutes
Kettlebell Goblet Squat|kb|squat|quads,glutes
Wall Sit|tm|hold|quads
Romanian Deadlift|bb|hinge|hams,glutes,back|* x.75
Dumbbell Romanian Deadlift|db|hinge|hams,glutes|* x.75
Single-Leg Romanian Deadlift|db|hinge|hams,glutes,core|x.4
Stiff-Leg Deadlift|bb|hinge|hams,back|x.72
Good Morning|bb|hinge|hams,back,glutes|x.5
Lying Leg Curl|mc|legcurl|hams|*
Seated Leg Curl|mc|legcurl|hams|*
Standing Leg Curl|mc|legcurl|hams|x.5
Nordic Curl|bw|legcurl|hams|*
Glute-Ham Raise|bw|legcurl|hams,glutes|x1.4
Slider Leg Curl|bw|legcurl|hams|x2.5
Stability Ball Leg Curl|bw|legcurl|hams|x2.8
Cable Pull-Through|cb|swing|glutes,hams
Barbell Hip Thrust|bb|hipthrust|glutes,hams|*
Smith Machine Hip Thrust|sm|hipthrust|glutes|x.95
Machine Hip Thrust|mc|hipthrust|glutes|*
Single-Leg Hip Thrust|bw|hipthrust|glutes,hams|x1.2
Glute Bridge|bw|hipthrust|glutes|x3
Dumbbell Hip Thrust|db|hipthrust|glutes|x.9
B-Stance Hip Thrust|bb|hipthrust|glutes|x.7
Cable Glute Kickback|cb|abduct|glutes|x.6
Hip Abduction Machine|mc|abduct|glutes|*
Hip Adduction Machine|mc|abduct|quads|x1.1
Banded Lateral Walk|bd|abduct|glutes
Frog Pump|bw|hipthrust|glutes|x4
Dumbbell Sumo Squat|db|squat|glutes,quads|x.9
Copenhagen Plank|tm|hold|quads,core|x.6
Standing Calf Raise|mc|calf|calves|*
Seated Calf Raise|mc|calf|calves|* x.6
Smith Machine Calf Raise|sm|calf|calves
Leg Press Calf Raise|mc|calf|calves|x1.2
Single-Leg Calf Raise|db|calf|calves|x.4
Donkey Calf Raise|mc|calf|calves
Bodyweight Calf Raise|bw|calf|calves|*
Tibialis Raise|bw|calf|calves|x1.2
Jump Rope|bw|cardio|calves|x6`,
core:`Plank|tm|hold|core|*
Side Plank|tm|hold|core|x.7
Hanging Leg Raise|bw|abs|core|*
Hanging Knee Raise|bw|abs|core|x1.6
Toes-to-Bar|bw|abs|core,back|x.7
Captain's Chair Leg Raise|bw|abs|core|x1.3
Cable Crunch|cb|crunch|core|*
Crunch|bw|crunch|core|x3
Sit-Up|bw|crunch|core|x2.5
Weighted Sit-Up|wb|crunch|core
Decline Sit-Up|bw|crunch|core|x1.8
Bicycle Crunch|bw|crunch|core|x3
Russian Twist|bw|crunch|core|x3
Ab Wheel Rollout|bw|abs|core|*
Barbell Rollout|bw|abs|core|x.9
Dead Bug|bw|abs|core|x2
Hollow Hold|tm|hold|core|x.7
V-Up|bw|abs|core|x1.4
Pallof Press|cb|antirot|core|x.5
Cable Woodchop|cb|antirot|core|x.6
Landmine Rotation|lm|antirot|core|x.5
Dragon Flag|bw|abs|core|x.4
L-Sit|tm|hold|core|x.3
Mountain Climber|bw|abs|core|x3
Reverse Crunch|bw|crunch|core|x2
Flutter Kicks|bw|abs|core|x3
Machine Crunch|mc|crunch|core
Lying Leg Raise|bw|abs|core|x2
Suitcase Carry|db|carry|core,forearms|x.6
Stir the Pot|bw|abs|core|x1.2
Hanging Windshield Wiper|bw|abs|core|x.5
Plank Shoulder Tap|bw|abs|core,shoulders|x3`,
};
const EQ={bb:'Barbell',db:'Dumbbell',cb:'Cable',mc:'Machine',sm:'Smith',ez:'EZ-bar',tb:'Trap bar',kb:'Kettlebell',lm:'Landmine',pl:'Plate',bd:'Band',bw:'Bodyweight',wb:'Weighted',tm:'Hold'};
const HOME=new Set(['db','kb','pl','bd','bw','wb','tm']);
// rating standard (e1RM / bodyweight that equals God I) per pattern, before equipment factor
const BASE={hpress:1.5,vpress:1.0,fly:.55,pullover:.6,row:1.3,vpull:1.25,hinge:2.5,ext:.8,shrug:2.2,carry:1.0,swing:.9,rear:.35,lateral:.35,front:.38,upright:.85,
  curl:.75,triext:.65,wrist:.6,squat:2.0,legpress:4.2,lunge:1.25,legext:1.2,legcurl:.95,hipthrust:2.8,abduct:1.6,calf:2.6,crunch:1.0,antirot:.6,dip:1.6,pushup:1.6};
const EQF={bb:1,sm:1.05,mc:1.12,cb:.8,db:.42,kb:.38,ez:.95,tb:1.08,lm:.62,pl:.35,bd:1,wb:1};
// reps standards for bodyweight moves (reps that equal God I), seconds for holds
const REPS={pushup:75,dip:45,vpull:28,row:40,squat:100,lunge:40,legext:30,legcurl:12,hipthrust:40,calf:80,crunch:60,abs:30,ext:40,cardio:500,grip:100,antirot:30,vpress:30,hold:180,hang:150};
const COMPOUND=new Set(['hpress','vpress','row','vpull','hinge','squat','legpress','lunge','dip','pushup','hipthrust','carry','swing']);
const lines=[];
for(const [group,txt] of Object.entries(RAW))for(const line of txt.split('\n')){
  const [n,eq,pat,mus,flags='']=line.split('|');
  const mult=+((flags.match(/x([\d.]+)/)||[])[1]||1);
  const id=n.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
  const type=eq==='tm'?'time':(eq==='bw'||eq==='bd')?'reps':'w';
  const ex={id,n,group,eq,eqName:EQ[eq],pat,m:mus.split(','),home:HOME.has(eq),staple:flags.includes('*'),
    kind:COMPOUND.has(pat)?'compound':'isolation',type};
  if(type==='w'){ex.std=(BASE[pat]||.8)*(EQF[eq]||1)*mult;if(eq==='wb')ex.std=(BASE[pat]||1.2)*1.05*mult}
  else ex.std=(REPS[pat]||40)*mult*(eq==='bd'?.8:1);
  lines.push(ex);
}

// back is split into lats / upper back / lower back for the muscle rankings (ex.sub, primary first)
const LATS=/pull-?up|\bchin|pulldown|pull-down|pullover|\blat\b|straight-arm|muscle-up|rope climb/i;
for(const e of lines){if(!e.m.includes('back'))continue;
  if(['hinge','ext','swing','squat'].includes(e.pat))e.sub=['lowerback'];
  else if(['vpull','pullover','triext','hang'].includes(e.pat)||LATS.test(e.n))e.sub=e.pat==='vpull'?['lats','upperback']:['lats'];
  else if(e.pat==='row')e.sub=/kroc|single|one-arm|meadows|pendlay|t-bar|seal/i.test(e.n)?['lats','upperback']:['upperback','lats'];
  else if(['abs','crunch','hold'].includes(e.pat))e.sub=[];
  else e.sub=['upperback']}
window.EXL=lines;
window.EXI=Object.fromEntries(lines.map(e=>[e.id,e]));
window.EQNAME=EQ;

// how-to steps written per movement pattern; equipment-specific setup line first
const SETUP={bb:'Load the bar evenly and use collars.',db:'Pick dumbbells you can control for every rep.',cb:'Set the pulley height and attachment before you start.',
  mc:'Adjust the seat so the pivot lines up with the working joint.',sm:'Set the safety stops just below your lowest point.',ez:'Grip the angled part of the EZ-bar.',
  tb:'Stand in the center of the trap bar.',kb:'Hold the kettlebell by the handle with a firm grip.',lm:'Wedge one end of the bar into a landmine or corner.',
  pl:'Hold the plate by its rim or handles.',bd:'Anchor the band securely at the right height.',bw:'No equipment needed.',wb:'Add weight with a belt, vest or dumbbell.',tm:'Time the hold with a clock.'};
const HOW={
 hpress:['Lie back with shoulder blades pinched together and feet planted.','Lower under control to your mid chest, elbows about 45° from your body.','Press back up until your arms are straight, without bouncing.'],
 vpress:['Brace your core and squeeze your glutes.','Press the weight straight overhead, moving your head out of the way.','Lock out with biceps near your ears, then lower to chin height.'],
 fly:['Start with arms extended over your chest and a slight bend in the elbows.','Open your arms in a wide arc until you feel a deep chest stretch.','Squeeze the weight back together like hugging a tree.'],
 pullover:['Keep your arms long with a soft elbow bend.','Sweep the weight down and back in an arc, feeling the lats stretch.','Pull back to the start by driving through your elbows.'],
 row:['Hinge or brace so your back stays flat.','Pull the weight toward your lower ribs, leading with your elbows.','Squeeze your shoulder blades, then lower with control.'],
 vpull:['Grip just outside shoulder width and hang with arms long.','Pull your elbows down toward your ribs until your chin clears the bar or the handle reaches your upper chest.','Lower all the way under control.'],
 hinge:['Set your feet hip width with the weight close to your shins.','Brace hard, push your hips back and keep your back flat.','Stand up by driving your hips forward, then lower the same way.'],
 ext:['Lock your heels in and keep your spine neutral.','Bend forward at the hips under control.','Raise back up using glutes and lower back, stopping at a straight line.'],
 shrug:['Stand tall holding the weight at your sides or in front.','Lift your shoulders straight up toward your ears.','Pause at the top, then lower slowly.'],
 carry:['Pick up the weights with a tall chest.','Walk with short, controlled steps, keeping shoulders level.','Set the weights down with a flat back.'],
 swing:['Hinge back with the weight between your legs.','Snap your hips forward to drive the weight, arms relaxed.','Let it fall back into the hinge and repeat.'],
 rear:['Hinge or lie chest-down with a slight elbow bend.','Sweep your arms out and back, leading with your elbows.','Pause, then return slowly. Keep it light and strict.'],
 lateral:['Stand tall with a slight forward lean.','Raise the weights out to your sides until your arms are parallel to the floor.','Lead with your elbows and lower slowly.'],
 front:['Stand tall with the weight in front of your thighs.','Raise it straight in front of you to shoulder height.','Lower slowly without swinging.'],
 upright:['Hold the weight in front of your thighs.','Pull it up along your body, elbows leading, to lower chest height.','Lower under control.'],
 curl:['Stand or sit with your elbows pinned to your sides.','Curl the weight up by bending your elbows only.','Squeeze at the top and lower slowly all the way.'],
 triext:['Keep your upper arms still.','Straighten your elbows fully, squeezing the triceps.','Return slowly to a deep bend.'],
 wrist:['Rest your forearms on a bench or your thighs.','Curl the weight with only your wrists.','Lower to a full stretch.'],
 squat:['Set feet shoulder width, toes slightly out, brace your core.','Sit down and back until your thighs are at least parallel.','Drive up through your whole foot, keeping your chest up.'],
 legpress:['Sit with your back flat against the pad and feet shoulder width.','Lower the sled until your knees reach about 90°.','Press back up without locking your knees.'],
 lunge:['Take a long stance with your torso upright.','Lower your back knee toward the floor.','Push through your front heel to stand back up.'],
 legext:['Line your knees up with the machine pivot.','Straighten your legs fully and squeeze the quads.','Lower slowly.'],
 legcurl:['Line your knees up with the pivot and keep hips down.','Curl your heels toward your glutes.','Lower slowly to a full stretch.'],
 hipthrust:['Rest your upper back on a bench with the weight over your hips.','Drive your hips up until your body forms a straight line.','Squeeze your glutes hard at the top, then lower.'],
 abduct:['Brace your core and stay tall.','Push your legs outward against the resistance.','Return slowly.'],
 calf:['Stand on the balls of your feet with heels free.','Rise up as high as you can and pause.','Lower to a deep stretch.'],
 crunch:['Brace your core and tuck your chin slightly.','Curl your ribs toward your hips.','Lower under control without pulling on your neck.'],
 abs:['Brace your core and keep your lower back controlled.','Move through the full range slowly.','Breathe out on the hard part.'],
 antirot:['Stand side-on to the anchor with your core braced.','Move the handle without letting your torso twist.','Control the return.'],
 dip:['Support yourself with arms straight and shoulders down.','Lower until your elbows reach about 90°.','Press back up to straight arms.'],
 pushup:['Hands just outside your shoulders, body in a straight line.','Lower your chest to just above the floor.','Push back up, keeping your hips in line.'],
 hold:['Get into position and brace your core.','Hold perfectly still while breathing steadily.','Stop when your form breaks.'],
 hang:['Grip the bar or plates firmly.','Hold with your shoulders engaged.','Stop when your grip gives out.'],
 cardio:['Stay light on the balls of your feet.','Keep a steady rhythm.','Breathe steadily.'],
 grip:['Squeeze the gripper fully closed.','Hold for a second.','Release slowly.'],
};
window.howTo=e=>[SETUP[e.eq],...(HOW[e.pat]||HOW.abs)];
})();

import type { MentalChallenge } from '../types/curriculum';

export const MENTAL_CHALLENGES: Record<string, MentalChallenge> = {
  'intro-strengths': {
    situation: 'Selection trials are 48 hours away and you are comparing yourself to taller, louder players.',
    question: 'What is the highest-leverage mental move right now?',
    options: [
      'Try to copy their style so the selectors notice you',
      'Double down on your 2-3 sharpest unfair advantages and execute them relentlessly',
      'Spend all week fixing your weakest skill from scratch',
    ],
    correctIndex: 1,
    coachTakeaway:
      'Elite athletes win selections by weaponising their proven strengths under pressure, not by becoming average at everything.',
  },
  'intro-coaching': {
    situation: 'Your coach calls you over after two turnovers and gives blunt, direct feedback.',
    question: 'How do you process the message in 5 seconds?',
    options: [
      'Filter it as useful performance data, nod, and apply it on the very next rep',
      'Explain why your teammate was out of position',
      'Drop your head and replay the turnover for the next 3 minutes',
    ],
    correctIndex: 0,
    coachTakeaway:
      'Feedback is objective telemetry, never a personal attack. Fast adjustment turns coaching into an immediate edge.',
  },
  'intro-primitives': {
    situation: 'Second half fatigue hits, your legs feel heavy, and your focus is starting to drift.',
    question: 'Which primitive resets your entire system first?',
    options: [
      'Scream at yourself to wake up',
      'Check the scoreboard to see how long is left',
      'Stand tall, take one slow exhale, and lock your eyes onto the next target',
    ],
    correctIndex: 2,
    coachTakeaway:
      'Posture, breath, and visual lock are your bedrock primitives—when they snap back into place, skill follows.',
  },
  'found-hunger': {
    situation: 'It is raining, dark, and 6:15 AM before a tough conditioning block.',
    question: 'What keeps standards high when comfort sounds better?',
    options: [
      'Reconnect to why you compete and earn one clean rep at a time',
      'Wait until you feel hyped up before starting',
      'Do half-speed reps just to get through the session',
    ],
    correctIndex: 0,
    coachTakeaway:
      'Hunger shows up in quiet mornings. Purpose + one full-intent rep beats waiting for hype.',
  },
  'found-growth': {
    situation: 'You get beaten cleanly in a 1v1 drill in front of the whole squad.',
    question: 'What does a Growth Mindset athlete do immediately?',
    options: [
      'Avoid that matchup for the rest of training',
      'Ask what beat you, adjust your footwork, and demand the matchup again',
      'Pretend you were not trying at 100%',
    ],
    correctIndex: 1,
    coachTakeaway:
      'Ego hides from tough matchups; growth hunts them down for free data.',
  },
  'found-inputs': {
    situation: 'You are down 2 goals / 2 sets with 10 minutes left and starting to panic about losing.',
    question: 'Where do you lock your attention?',
    options: [
      'On the final score and what people will think',
      'On the referee calls from earlier',
      'On your next 3 controllable inputs: work rate, talk, and first step',
    ],
    correctIndex: 2,
    coachTakeaway:
      'You cannot directly control the scoreboard, only your inputs. Stack clean inputs and the score takes care of itself.',
  },
  'motiv-first': {
    situation: 'You arrive at training flat, tired from school, and with zero spark.',
    question: 'How do elite performers flip the switch?',
    options: [
      'Wait on the bench until inspiration arrives',
      'Start moving with crisp intent for 90 seconds—action creates momentum',
      'Cruise through warm-ups and hope the game wakes you up',
    ],
    correctIndex: 1,
    coachTakeaway:
      'Action comes before motivation. Move first with sharp energy and your mood catches up.',
  },
  'motiv-compete-self': {
    situation: 'A teammate is getting all the praise at practice today while your shots are rimming out.',
    question: 'How do you protect your edge?',
    options: [
      'Measure your effort and execution against your own standard from yesterday',
      'Force risky hero plays to steal attention',
      'Switch off because it is not your day',
    ],
    correctIndex: 0,
    coachTakeaway:
      'Comparison leaks energy. Competing against yesterday’s version of you compounds every single week.',
  },
  'habit-resp-account': {
    situation: 'You missed a key defensive rotation that led to an easy score.',
    question: 'What is the captain-level response?',
    options: [
      'Point out someone else’s mistake so the focus shifts',
      'Own it cleanly ("My miss, I’ve got next"), adjust, and communicate louder',
      'Go completely silent for the next five minutes',
    ],
    correctIndex: 1,
    coachTakeaway:
      'Instant ownership earns instant trust from teammates and frees your mind for the next play.',
  },
  'habit-play-train': {
    situation: 'It is the final 5 minutes of a Friday afternoon drill and everyone is getting sloppy.',
    question: 'Why does this exact rep matter most?',
    options: [
      'It doesn’t—training is different from real games',
      'Sloppy reps under fatigue wire sloppy habits for the final quarter on game day',
      'Only the first 10 minutes of practice count',
    ],
    correctIndex: 1,
    coachTakeaway:
      'Under pressure you do not rise to the occasion—you fall to the level of your training habits.',
  },
  'habit-love-failure': {
    situation: 'You try a high-skill play in training and completely botch it.',
    question: 'How do you treat that miss?',
    options: [
      'Never try it again so you look clean',
      'Get angry and kick the ball away',
      'Tag the exact reason it missed and run it back immediately',
    ],
    correctIndex: 2,
    coachTakeaway:
      'Every rep that exposes a flaw is free coaching telemetry. Fall in love with fast correction.',
  },
  'motiv-broken': {
    situation: 'You just suffered a tough loss in a tournament you trained months for.',
    question: 'What separates future champions in the 24 hours after?',
    options: [
      'Extract 2 clear lessons from the sting and use them as fuel for the next block',
      'Quit or take weeks off because it hurt too much',
      'Blame the draw, venue, or officials',
    ],
    correctIndex: 0,
    coachTakeaway:
      'Setbacks forge resilience when you turn the sting into specific, actionable upgrades.',
  },
  'goals-smart': {
    situation: 'You want to "get way better at finishing under pressure" this month.',
    question: 'Which target actually drives daily improvement?',
    options: [
      '"Score more points somehow"',
      '"Hit 80% on 30 game-speed contested finishes every Tue/Thu for 4 weeks"',
      '"Try harder in matches"',
    ],
    correctIndex: 1,
    coachTakeaway:
      'Specific, measurable targets give your brain a clear scoreboard every single session.',
  },
  'goals-systems': {
    situation: 'You set a massive season goal, but mid-season schoolwork gets busy.',
    question: 'What guarantees you still keep climbing?',
    options: [
      'A locked-in weekly system: sleep, pre-training routine, and 3 non-negotiable micro-habits',
      'Hoping you remember to train when you have spare time',
      'Changing your big goal every week',
    ],
    correctIndex: 0,
    coachTakeaway:
      'Goals set the direction; systems run the engine when life gets chaotic.',
  },
  'staying-stay-game': {
    situation: 'You make two unforced errors back-to-back in front of a loud crowd.',
    question: 'What is your 5-second reset protocol?',
    options: [
      'Apologise repeatedly to your teammates',
      'Rush the next play to make up for it immediately',
      'Flush it: shoulders back, slow exhale, call your 3-word reset cue',
    ],
    correctIndex: 2,
    coachTakeaway:
      'The best athletes have the shortest memory for errors and the fastest reset routine.',
  },
  'staying-focus-conc': {
    situation: 'The opposition bench is chirping and the crowd is loud right before your big moment.',
    question: 'How do you narrow your spotlight?',
    options: [
      'Lock onto one physical cue—the ball, the seam, or your target—and tune out the perimeter',
      'Look at the bench to fire yourself up',
      'Think about every possible outcome at once',
    ],
    correctIndex: 0,
    coachTakeaway:
      'Concentration is choosing what to ignore. One sharp external target kills distraction.',
  },
  'confidence-prep': {
    situation: 'Minutes before a huge final, a voice says "What if I’m not ready?"',
    question: 'Where does real confidence come from?',
    options: [
      'Fake hype in the mirror',
      'Your Evidence Bank: every early morning, hard rep, and drill you already banked',
      'Hoping the opponent plays badly',
    ],
    correctIndex: 1,
    coachTakeaway:
      'Real confidence is earned receipt by receipt in training. Trust the work you already put in.',
  },
  'confidence-experience': {
    situation: 'It is overtime / sudden death and your mind jumps to lifting the trophy—or losing.',
    question: 'Where do you bring your feet and mind?',
    options: [
      'Right here, right now: feel your shoes on the floor and play this single possession',
      'Replay the mistake from the first quarter',
      'Calculate what happens if you win',
    ],
    correctIndex: 0,
    coachTakeaway:
      'Future thinking creates anxiety; past thinking creates regret. Power lives only in this play.',
  },
  'selftalk-win-inner': {
    situation: 'Halfway through a brutal conditioning test, your inner voice whispers "Slow down, this hurts."',
    question: 'Who wins the inner match?',
    options: [
      'Argue with the voice for 20 seconds',
      'Let the voice dictate your pace',
      'Spot the noise, answer with a short action cue ("Light feet, drive!"), and keep moving',
    ],
    correctIndex: 2,
    coachTakeaway:
      'The inner game decides the outer game. Command the mic in your head with short, sharp cues.',
  },
  'selftalk-passive': {
    situation: 'You notice yourself saying "Don’t miss this" or "Don’t mess up" before a clutch play.',
    question: 'Why does passive/negative phrasing backfire?',
    options: [
      'Your brain pictures the exact mistake you told it to avoid, tightening your muscles',
      'It actually makes you more careful and accurate',
      'Words have no effect on motor execution',
    ],
    correctIndex: 0,
    coachTakeaway:
      'Your nervous system executes what you picture. Replace "Don’t miss" with what you WANT to do.',
  },
  'selftalk-active': {
    situation: 'You are stepping up to take a high-pressure free throw, serve, or penalty.',
    question: 'Which self-talk cue fires the cleanest execution?',
    options: [
      '"Please go in, please don’t choke"',
      '"Soft hands, high arc, through the rim"',
      '"Everyone is watching me right now"',
    ],
    correctIndex: 1,
    coachTakeaway:
      'Active cues are present-tense, positive, and physical—telling your body the exact motion to run.',
  },
  'vis-pregame': {
    situation: 'You are on the bus / in the locker room 45 minutes before tip-off or kick-off.',
    question: 'How do you use pre-game visualisation best?',
    options: [
      'Run a vivid 90-second mental movie of your first 3 clean touches and calm resets',
      'Imagine every possible disaster that could happen',
      'Scroll social media until the whistle blows',
    ],
    correctIndex: 0,
    coachTakeaway:
      'When you rehearse the opening moments vividly, your brain feels like it has already played well today.',
  },
  'vis-ingame': {
    situation: 'There is a 10-second stoppage right before a set play or big point.',
    question: 'What is an In-Game Snapshot?',
    options: [
      'Closing your eyes for 30 seconds and tuning out the ref',
      'A 2-second flash picture of the ball hitting your exact target before you move',
      'Reviewing your stats from the first half',
    ],
    correctIndex: 1,
    coachTakeaway:
      'A crisp 2-second snapshot primes your motor system without taking you out of the flow of play.',
  },
  'vis-managing-anxiety': {
    situation: 'Your heart is hammering and your stomach feels tight before a big match.',
    question: 'How do you turn pre-game nerves into fuel?',
    options: [
      'Panic because nerves mean you are going to play badly',
      'Exhale longer than you inhale and reframe the buzz as "My body is loading energy to compete"',
      'Try to force yourself to feel completely sleepy',
    ],
    correctIndex: 1,
    coachTakeaway:
      'Nerves and excitement share the same physiology. Slow the exhale, then label the energy as readiness.',
  },
  'flow-activation': {
    situation: 'You feel either way too flat before a quiet match OR way too wired before a derby.',
    question: 'What does Peak Calibration mean?',
    options: [
      'Dialing your energy up (music, bounce, sharp breath) or down (long exhale) to hit your sweet spot',
      'Playing at the exact same emotional volume no matter what',
      'Trying to be 10/10 hyped for every single minute',
    ],
    correctIndex: 0,
    coachTakeaway:
      'Peak performance sits on the inverted-U sweet spot. Know whether you need to dial up or dial down.',
  },
  'flow-bringing-together': {
    situation: 'Finals day. You have trained the habits, systems, self-talk, and resets.',
    question: 'What is the final key to unlocking effortless Flow?',
    options: [
      'Over-analysing every mechanic mid-play',
      'Trust your training, lock onto the present rep, and play free with full commitment',
      'Protect your stats so you don’t make a mistake',
    ],
    correctIndex: 1,
    coachTakeaway:
      'Flow happens when preparation meets total presence. Stop thinking about how you look—just compete free.',
  },
};

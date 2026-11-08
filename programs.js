// ============================================================
//  PROGRAM CONTENT  (edit this file to change the workouts)
// ============================================================
//
//  DRAFT: written by Claude as a starting point. The coach must
//  review every exercise, set, rep and rest before clients see it.
//
//  minutes: the session length shown to clients for every day of
//  that program (60 for Gym Floor and Calisthenics, 45 for Full
//  Body Circuit). The content is built to fit that, warm-up included.
//
//  Two kinds of blocks:
//
//  1) Strength (sets x reps with a rest timer after every set):
//     { name, sets, reps, rest, setTime, cue, easier }
//       rest     seconds of rest after each set
//       setTime  rough seconds one set takes (default 45), only
//                used for the time estimate
//
//  2) Interval (the timer runs the whole block):
//     { type: "interval", title, work, rest, rounds,
//       restBetweenRounds, order, exercises: [{ name, cue, easier }] }
//       order "circuit" (default): every exercise once, then repeat
//       order "station": all rounds of one exercise, then the next.
//                        restBetweenRounds is then the rest between
//                        exercises.
// ============================================================

const COACH = {
  name: "Kari",
  // Paste the Google Form link here once it exists. Leave "" to hide the button.
  checkinUrl: "",
  awayFrom: "Nov 8",
  awayTo: "Nov 19",
};

// Movement only, no stretching. Kept on purpose: an hour of loaded
// or jumping work on cold joints is how people get hurt.
const WARMUP = [
  "2 min march or easy jog in place",
  "10 arm circles each way",
  "10 bodyweight squats",
  "10 hip hinges",
  "10 walking lunges",
  "10 jumping jacks",
];
const WARMUP_MINUTES = 5;

const PROGRAMS = [
  {
    id: "gym",
    title: "Gym Floor",
    tagline: "For a gym with dumbbells, a bench, a cable, and a cardio machine.",
    equipment: "Dumbbells, bench, cable, TRX, kettlebell, med ball, fan bike, ski erg, leg press",
    minutes: 60,
    warmup: { title: "90/90 PRI breath work", detail: "6 breaths for 3 rounds", minutes: 5,
      steps: ["Lie on your back, feet on a wall, hips and knees at 90 degrees.", "Breathe in through your nose, out slowly through your mouth.", "6 breaths, rest, repeat for 3 rounds."] },
    note: "Supersets: do A, then B, then rest. Pick the appropriate weight for your rep range.",
    days: [
      {
        title: "Day 1: Lower Body",
        blocks: [
          { type: "superset", sets: 3, rest: 90, items: [
            { name: "Glute Bridge", reps: "15 reps", cue: "Drive through the heels, squeeze at the top." },
            { name: "Dumbbell Front Squat", reps: "15 reps", cue: "Brace the dumbbell under your chin, not on the shoulders." },
          ] },
          { type: "superset", sets: 3, rest: 90, items: [
            { name: "Cable Step-Up", reps: "12 reps each side", cue: "Whole foot on the box, drive through the heel." },
            { name: "Reverse Lunge", reps: "12 reps each side", cue: "Step back, back knee toward the floor, keep your pelvis tucked." },
          ] },
          { type: "superset", sets: 3, rest: 90, items: [
            { name: "Fan Bike", reps: "30 sec max effort", cue: "All out for 30 seconds." },
            { name: "Leg Press", reps: "12 reps", cue: "Lower until knees are at 90 degrees, don't lock out." },
          ] },
        ],
      },
      {
        title: "Day 2: Upper Body",
        blocks: [
          { type: "superset", sets: 3, rest: 90, items: [
            { name: "TRX Row", reps: "15 reps", cue: "Body straight, pull your chest to your hands." },
            { name: "Reciprocal Seated Cable Press", reps: "15 reps", cue: "Press one arm while the other returns, steady rhythm." },
          ] },
          { type: "superset", sets: 3, rest: 90, items: [
            { name: "Lat Pulldown", reps: "12 reps", cue: "Pull the bar to your collarbone, keep your ribs down." },
            { name: "Push-Up", reps: "12 reps", cue: "Straight line from head to heels." },
          ] },
          { type: "superset", sets: 3, rest: 90, items: [
            { name: "Dumbbell Overhead Press", reps: "12 reps", cue: "Ribs down, press straight overhead." },
            { name: "Dumbbell Row", reps: "12 reps", cue: "Flat back, pull the elbow to your hip." },
          ] },
          {
            type: "interval",
            title: "Ski Erg",
            work: 30, rest: 30, rounds: 4, restBetweenRounds: 0,
            exercises: [{ name: "Ski Erg", cue: "30 seconds max effort, 30 seconds rest." }],
          },
        ],
      },
      {
        title: "Day 3: Full Body",
        blocks: [
          { type: "superset", sets: 3, rest: 90, items: [
            { name: "Dumbbell Squat to Press", reps: "15 reps", cue: "Squat, then drive up and press overhead in one move." },
            { name: "Cable Anti-Rotation Hold", reps: "30 sec hold each side", timer: 30, sides: true, cue: "Stand side-on to the cable, press out and resist the twist." },
          ] },
          { type: "superset", sets: 3, rest: 90, items: [
            { name: "Ball Slam", reps: "12 reps", cue: "Reach tall, slam the ball down hard, squat to pick it up." },
            { name: "Plank", reps: "30 sec to 1 min", cue: "Elbows under shoulders, tuck your pelvis." },
          ] },
          { type: "superset", sets: 3, rest: 90, items: [
            { name: "Seated Cable Row", reps: "12 to 15 reps", cue: "Shoulders down, away from your ears. Pull to your belly." },
            { name: "Kettlebell Deadlift", reps: "12 to 15 reps", cue: "Hinge at the hips, flat back, stand tall." },
          ] },
          { type: "superset", sets: 3, rest: 90, items: [
            { name: "Face Pull", reps: "12 to 15 reps", cue: "Rope to your forehead, elbows high and wide." },
            { name: "Cable Triceps Extension", reps: "12 to 15 reps", cue: "Elbows pinned to your sides, push down to full lockout." },
          ] },
        ],
      },
    ],
  },
  {
    id: "calisthenics",
    title: "Calisthenics",
    tagline: "Pure bodyweight.",
    equipment: "Nothing. A bench, a sturdy table and a towel help.",
    minutes: 60,
    warmup: { title: "90/90 PRI breath work", detail: "6 breaths for 3 rounds", minutes: 5,
      steps: ["Lie on your back, feet on a wall, hips and knees at 90 degrees.", "Breathe in through your nose, out slowly through your mouth.", "6 breaths, rest, repeat for 3 rounds."] },
    note: "Supersets: do A, then B, then rest. Pick the easier version if you can't hit the bottom of the rep range.",
    days: [
      {
        title: "Day 1: Lower Body",
        blocks: [
          { type: "superset", sets: 4, rest: 90, items: [
            { name: "Bodyweight Squat", reps: "15 to 20 reps", cue: "Sit between your heels, knees track over toes." },
            { name: "Bodyweight Deadlift", reps: "15 to 20 reps", cue: "Hinge at the hips, flat back, stand tall." },
          ] },
          { type: "superset", sets: 4, rest: 90, items: [
            { name: "Reverse Lunge", reps: "8 to 12 reps each leg", cue: "Step back, back knee toward the floor, keep your pelvis tucked." },
            { name: "Glute Bridge / Hip Thrust", reps: "15 to 20 reps", cue: "Pause at the top and squeeze." },
          ] },
          { type: "superset", sets: 3, rest: 90, items: [
            { name: "Split Squat", reps: "6 to 12 reps each leg", cue: "Rear foot elevated if possible." },
            { name: "Step-Up", reps: "8 to 12 reps each leg", cue: "Bench or stair. Whole foot on, drive through the heel." },
            { name: "Nordic Hamstring (Assisted) or Hamstring Slide Curl", reps: "4 to 10 reps", cue: "Slow and controlled on the way down." },
          ] },
          { type: "superset", sets: 3, rest: 90, items: [
            { name: "Pike Hold", reps: "20 to 45 sec", cue: "Hips high, arms long, push the floor away." },
            { name: "Side Plank", reps: "20 to 45 sec each side", cue: "Elbow under shoulder, hips stacked and lifted." },
          ] },
        ],
      },
      {
        title: "Day 2: Upper Body",
        blocks: [
          { type: "superset", sets: 4, rest: 90, items: [
            { name: "Push-Up", reps: "6 to 15 reps", cue: "Regular, or incline if needed. Straight line from head to heels." },
            { name: "Supported Pike Push-Up", reps: "4 to 12 reps", cue: "Hips high, lower the top of your head toward the floor." },
          ] },
          { type: "superset", sets: 4, rest: 90, items: [
            { name: "Inverted Row", reps: "6 to 15 reps", cue: "Under a bar, TRX, rings or a sturdy table. Pull your chest up." },
            { name: "Dips", reps: "6 to 15 reps (skip on set 4)", cue: "Bench dips if needed, or between parallel bars." },
          ] },
          { type: "superset", sets: 3, rest: 90, items: [
            { name: "Diamond / Close-Grip Push-Up", reps: "8 to 20 reps", cue: "Hands close, elbows tight to your sides." },
            { name: "Hollow Body Rock", reps: "8 to 20 reps", cue: "Low back pressed down, rock from shoulders to hips." },
          ] },
          { type: "superset", sets: 3, rest: 90, items: [
            { name: "Plank", reps: "20 sec to 1 min", cue: "Elbows under shoulders, tuck your pelvis." },
            { name: "Bodyweight Face Pull", reps: "10 to 20 reps", cue: "Band optional. Rings or TRX work too. Elbows high and wide." },
          ] },
        ],
      },
      {
        title: "Day 3: Full Body",
        blocks: [
          { type: "superset", sets: 4, rest: 60, restLabel: "45 to 75 sec", items: [
            { name: "Jump Squat", reps: "6 to 12 reps", cue: "Or squat to jump. Land soft." },
            { name: "Pull-Up Progression", reps: "4 to 12 reps", cue: "Assisted pull-up, negatives, or inverted row." },
          ] },
          { type: "superset", sets: 4, rest: 60, restLabel: "45 to 75 sec", items: [
            { name: "Push-Up", reps: "10 to 15 reps", cue: "Weighted backpack if strong enough, or incline to make it easier." },
            { name: "Walking Lunge", reps: "10 to 20 steps each leg", cue: "Long steps, back knee toward the floor." },
          ] },
          { type: "superset", sets: 3, rest: 60, restLabel: "45 to 75 sec", items: [
            { name: "Romanian Deadlift (Bodyweight)", reps: "10 to 20 reps", cue: "Soft knees, push your hips back, flat back." },
            { name: "Plank Shoulder Tap", reps: "10 to 30 taps", cue: "Feet wide, keep your hips still." },
          ] },
          { type: "superset", sets: 3, rest: 60, restLabel: "45 to 75 sec", items: [
            { name: "Mountain Climber", reps: "20 to 45 sec", cue: "Slow and controlled if needed." },
            { name: "Side Plank", reps: "20 to 45 sec each side", cue: "Elbow under shoulder, hips stacked and lifted." },
          ] },
        ],
      },
    ],
  },
];

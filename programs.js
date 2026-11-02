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
    equipment: "Dumbbells, bench, cable or lat pulldown, bike or treadmill",
    minutes: 60,
    days: [
      {
        title: "Day 1: Lower Body",
        blocks: [
          { name: "Goblet Squat", sets: 4, reps: "10", rest: 90, cue: "Hold one dumbbell at your chest. Sit between your heels, chest tall.", easier: "Bodyweight squat to a bench" },
          { name: "Dumbbell Romanian Deadlift", sets: 4, reps: "10", rest: 90, cue: "Soft knees, push hips back, dumbbells slide down your thighs. Flat back.", easier: "Lighter weights, shorter range" },
          { name: "Reverse Lunge", sets: 3, reps: "10 each leg", rest: 75, setTime: 75, cue: "Step back, back knee lowers toward the floor, front knee over the foot.", easier: "Hold a bench for balance" },
          { name: "Step-Up", sets: 3, reps: "10 each leg", rest: 75, setTime: 75, cue: "Whole foot on the bench. Drive through the heel.", easier: "Lower step" },
          { name: "Dumbbell Hip Thrust", sets: 3, reps: "12", rest: 75, cue: "Upper back on the bench, dumbbell on hips. Squeeze at the top for a second.", easier: "Glute bridge on the floor" },
          { name: "Standing Calf Raise", sets: 3, reps: "15", rest: 45, cue: "Slow up, pause, slow down. Hold dumbbells for more.", easier: "Bodyweight" },
          { name: "Plank", sets: 3, reps: "45 sec", rest: 45, cue: "Elbows under shoulders, squeeze glutes, hips level.", easier: "Knees down" },
        ],
      },
      {
        title: "Day 2: Upper Body",
        blocks: [
          { name: "Dumbbell Bench Press", sets: 4, reps: "8 to 12", rest: 90, cue: "Shoulder blades pinched back. Lower to chest level, press up.", easier: "Push-ups on the bench" },
          { name: "One-Arm Dumbbell Row", sets: 4, reps: "10 each side", rest: 75, setTime: 75, cue: "Hand and knee on the bench. Pull the elbow to your hip.", easier: "Lighter dumbbell" },
          { name: "Seated Dumbbell Shoulder Press", sets: 3, reps: "10", rest: 90, cue: "Back against the bench. Press up without arching your lower back.", easier: "One arm at a time" },
          { name: "Lat Pulldown", sets: 3, reps: "12", rest: 75, cue: "Pull the bar to your upper chest, elbows down and back.", easier: "Lighter weight" },
          { name: "Dumbbell Biceps Curl", sets: 3, reps: "12", rest: 60, cue: "Elbows pinned to your sides, no swinging.", easier: "Lighter dumbbells" },
          { name: "Overhead Triceps Extension", sets: 3, reps: "12", rest: 60, cue: "One dumbbell in both hands behind your head, elbows point up.", easier: "Lighter dumbbell" },
          { name: "Dead Bug", sets: 3, reps: "10 each side", rest: 45, cue: "Lower back stays pressed into the floor the whole time.", easier: "Move legs only" },
        ],
      },
      {
        title: "Day 3: Full Body and Conditioning",
        blocks: [
          { name: "Dumbbell Thruster", sets: 4, reps: "10", rest: 90, cue: "Squat with dumbbells at your shoulders, then drive up and press overhead in one move.", easier: "Squat, then press separately" },
          { name: "Walking Lunge", sets: 3, reps: "10 each leg", rest: 75, setTime: 75, cue: "Long steps, upright torso.", easier: "Bodyweight only" },
          { name: "Push-Up", sets: 3, reps: "As many as you can with good form", rest: 75, cue: "Body in a straight line, chest to just above the floor.", easier: "Hands on a bench" },
          { name: "Renegade Row", sets: 3, reps: "8 each side", rest: 75, setTime: 60, cue: "Plank on dumbbells, row one side at a time, keep hips still.", easier: "Feet wide or knees down" },
          { name: "Dumbbell Swing", sets: 3, reps: "15", rest: 60, cue: "Hinge and snap the hips forward. The arms just guide the weight.", easier: "Lighter dumbbell" },
          { name: "Farmer Carry", sets: 3, reps: "40 sec walk", rest: 60, setTime: 40, cue: "Heavy dumbbells at your sides, tall posture, short quick steps.", easier: "Lighter dumbbells" },
          {
            type: "interval",
            title: "Finisher: Bike or Treadmill Sprints",
            work: 30, rest: 30, rounds: 10, restBetweenRounds: 0,
            exercises: [{ name: "Sprint", cue: "Hard for 30 sec, easy for 30 sec.", easier: "8 rounds instead of 10" }],
          },
        ],
      },
    ],
  },
  {
    id: "calisthenics",
    title: "Calisthenics",
    tagline: "Pure bodyweight.",
    equipment: "Nothing. A sturdy chair, a bed edge and a backpack help.",
    minutes: 60,
    days: [
      {
        title: "Day 1: Push and Core",
        blocks: [
          { name: "Push-Up", sets: 5, reps: "Stop 2 reps before failure", rest: 90, cue: "Straight line from head to heels. Elbows at about 45 degrees.", easier: "Hands on a bed or chair" },
          { name: "Pike Push-Up", sets: 4, reps: "8", rest: 90, cue: "Hips high in an upside-down V. Lower your head toward the floor between your hands.", easier: "Hands on a chair, smaller range" },
          { name: "Chair Dip", sets: 4, reps: "10", rest: 75, cue: "Hands on a sturdy chair behind you, elbows point back, shoulders down.", easier: "Bend your knees more" },
          { name: "Decline Push-Up", sets: 3, reps: "8", rest: 75, cue: "Feet on a bed or chair, hands on the floor.", easier: "Regular push-up" },
          { name: "Hollow Hold", sets: 3, reps: "30 sec", rest: 60, cue: "Lower back pressed into the floor, arms and legs reaching long.", easier: "Bend your knees" },
          { name: "Plank Shoulder Taps", sets: 3, reps: "20 total", rest: 60, cue: "Feet wide, keep hips from rocking.", easier: "Knees down" },
          { name: "Side Plank", sets: 3, reps: "30 sec each side", rest: 45, setTime: 60, cue: "Elbow under shoulder, hips high.", easier: "Bottom knee down" },
        ],
      },
      {
        title: "Day 2: Legs and Glutes",
        blocks: [
          { name: "Bodyweight Squat", sets: 5, reps: "20", rest: 75, setTime: 50, cue: "Sit back and down, knees track over toes.", easier: "Squat to a chair" },
          { name: "Bulgarian Split Squat", sets: 4, reps: "10 each leg", rest: 75, setTime: 80, cue: "Back foot on a chair or bed. Drop straight down.", easier: "Split squat with both feet on the floor" },
          { name: "Single-Leg Glute Bridge", sets: 3, reps: "12 each side", rest: 60, setTime: 60, cue: "Drive through the heel, squeeze at the top for a second.", easier: "Two-leg bridge" },
          { name: "Lateral Lunge", sets: 3, reps: "10 each side", rest: 60, setTime: 60, cue: "Big step to the side, sit into that hip, other leg straight.", easier: "Smaller step" },
          { name: "Wall Sit", sets: 3, reps: "45 sec", rest: 60, cue: "Thighs parallel to the floor, back flat on the wall.", easier: "Sit higher" },
          { name: "Jump Squat", sets: 3, reps: "10", rest: 75, setTime: 30, cue: "Land soft, sit straight into the next rep.", easier: "Squat with a calf raise" },
          { name: "Calf Raise", sets: 3, reps: "20", rest: 45, cue: "Slow up, pause, slow down. Use a step for more range.", easier: "Hold a wall" },
        ],
      },
      {
        title: "Day 3: Pull and Full Body",
        blocks: [
          { name: "Backpack Row", sets: 5, reps: "12", rest: 75, cue: "Fill a backpack, hinge forward with a flat back, pull it to your belly.", easier: "Lighter backpack" },
          { name: "Single-Arm Backpack Row", sets: 3, reps: "10 each side", rest: 60, setTime: 60, cue: "One hand on a chair, pull the bag to your hip.", easier: "Lighter backpack" },
          { name: "Superman", sets: 3, reps: "12", rest: 60, cue: "Lying face down, lift arms and legs, squeeze your upper back for 2 sec.", easier: "Lift arms only" },
          { name: "Reverse Snow Angel", sets: 3, reps: "10", rest: 60, cue: "Face down, arms sweep from hips to overhead without touching the floor.", easier: "Smaller range" },
          { name: "Burpee", sets: 4, reps: "10", rest: 90, cue: "Squat, hands down, jump or step back, push-up optional, jump up.", easier: "Step back, no jump" },
          { name: "Mountain Climber", sets: 3, reps: "30 sec", rest: 60, setTime: 30, cue: "Hips low, drive knees to chest fast.", easier: "Slow, controlled steps" },
          { name: "Bear Crawl", sets: 3, reps: "30 sec", rest: 60, setTime: 30, cue: "Knees an inch off the floor, crawl forward and back.", easier: "Bear hold, no crawling" },
        ],
      },
    ],
  },
  {
    id: "circuit",
    title: "Full Body Circuit",
    tagline: "High intensity intervals.",
    equipment: "Nothing. Space to move.",
    minutes: 45,
    days: [
      {
        title: "Day 1: Lower Body Circuit",
        blocks: [
          {
            type: "interval",
            title: "Circuit A: 4 rounds",
            work: 40, rest: 20, rounds: 4, restBetweenRounds: 60,
            exercises: [
              { name: "Jump Squat", cue: "Land soft, sit straight back into the next rep.", easier: "Bodyweight squat" },
              { name: "Reverse Lunge", cue: "Alternate legs, upright torso.", easier: "Shorter steps" },
              { name: "Glute Bridge", cue: "Drive hips up, squeeze, lower with control.", easier: "Smaller range" },
              { name: "Skater Jump", cue: "Leap side to side, land on one leg.", easier: "Side step, no jump" },
              { name: "Wall Sit", cue: "Thighs parallel to the floor, back flat on the wall.", easier: "Sit higher" },
            ],
          },
          {
            type: "interval",
            title: "Circuit B: 3 rounds",
            work: 40, rest: 20, rounds: 3, restBetweenRounds: 60,
            exercises: [
              { name: "Squat Pulse", cue: "Stay low, pulse an inch up and down.", easier: "Regular squats" },
              { name: "Alternating Jump Lunge", cue: "Switch legs in the air, land soft.", easier: "Alternating reverse lunge" },
              { name: "Lateral Lunge", cue: "Big step to the side, sit into that hip.", easier: "Smaller step" },
              { name: "Single-Leg Glute Bridge", cue: "Switch legs halfway through.", easier: "Two-leg bridge" },
            ],
          },
        ],
      },
      {
        title: "Day 2: Upper Body Circuit",
        blocks: [
          {
            type: "interval",
            title: "Circuit A: 4 rounds",
            work: 40, rest: 20, rounds: 4, restBetweenRounds: 60,
            exercises: [
              { name: "Push-Up", cue: "Straight body, full range.", easier: "Knees or hands on a chair" },
              { name: "Plank Shoulder Taps", cue: "Feet wide, keep hips from rocking.", easier: "Knees down" },
              { name: "Chair Dip", cue: "Elbows point back, shoulders down.", easier: "Bend your knees more" },
              { name: "Mountain Climber", cue: "Hips low, fast feet.", easier: "Slow steps" },
              { name: "Superman", cue: "Lift arms and legs, squeeze your upper back.", easier: "Lift arms only" },
            ],
          },
          {
            type: "interval",
            title: "Circuit B: 3 rounds",
            work: 40, rest: 20, rounds: 3, restBetweenRounds: 60,
            exercises: [
              { name: "Pike Push-Up", cue: "Hips high, lower your head between your hands.", easier: "Hands on a chair" },
              { name: "Plank Up-Down", cue: "Elbow plank to hand plank and back, hips still.", easier: "Knees down" },
              { name: "Burpee", cue: "Steady pace you can hold for 40 sec.", easier: "Step back, no jump" },
              { name: "Reverse Snow Angel", cue: "Face down, arms sweep from hips to overhead.", easier: "Smaller range" },
            ],
          },
        ],
      },
      {
        title: "Day 3: Full Body Circuit",
        blocks: [
          {
            type: "interval",
            title: "Main Circuit: 4 rounds",
            work: 45, rest: 15, rounds: 4, restBetweenRounds: 90,
            exercises: [
              { name: "Alternating Jump Lunge", cue: "Switch legs in the air, land soft.", easier: "Alternating reverse lunge" },
              { name: "Burpee", cue: "Steady pace you can hold for 45 sec.", easier: "Step back, no jump" },
              { name: "Lateral Shuffle", cue: "Stay low, shuffle 3 steps each way.", easier: "Side steps" },
              { name: "Shoulder Tap Push-Up", cue: "Push-up, then tap each shoulder.", easier: "Knees down" },
              { name: "Squat to Calf Raise", cue: "Full squat, stand and rise onto toes.", easier: "Half squat" },
              { name: "Flutter Kicks", cue: "Lower back on the floor, small fast kicks.", easier: "Bend knees" },
            ],
          },
          {
            type: "interval",
            title: "Finisher: 2 rounds",
            work: 30, rest: 30, rounds: 2, restBetweenRounds: 60,
            exercises: [
              { name: "Tuck Jump", cue: "Knees to chest, land soft.", easier: "Jump squat" },
              { name: "Sprint in Place", cue: "All out.", easier: "High knees" },
              { name: "Plank Hold", cue: "Squeeze everything.", easier: "Knees down" },
              { name: "Star Jump", cue: "Explode into an X shape.", easier: "Jumping jack" },
            ],
          },
        ],
      },
    ],
  },
];

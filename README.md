# Kari's Fitness App

A phone web app with three 3-day workout programs for clients to follow while their coach is away (Nov 8 to Nov 19). Clients open a link, add it to their home screen, pick a program and train. No login, no App Store.

## What clients get

- **Three programs:** Gym Floor, Calisthenics, Full Body Circuit. Gym Floor and Calisthenics days are 60 minutes, Full Body Circuit days are 45, warm-up included.
- **Workout screen:** sets, reps, rest time and a form cue for every exercise, plus an easier option.
- **Timers:** tapping a finished set starts the rest timer. Interval blocks run on a full screen timer with beeps.
- **Progress:** finishing a workout saves it with an effort rating and a note. Saved on the client's phone only.
- **Check-in button:** links to a Google Form if one is set (hidden until then).

## Editing the workouts

All content lives in `programs.js`. Change exercises, sets, reps or rest there. Each program has a `minutes` value that sets the length shown to clients, so keep the content close to it. Paste the Google Form link into `checkinUrl` to show the check-in button.

## Running it locally

```
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Putting it online (GitHub Pages)

1. Merge to `main`.
2. In the repo, go to Settings, Pages, set Source to "Deploy from a branch", branch `main`, folder `/ (root)`.
3. The link will be `https://laracallahan.github.io/KarisFitnessApp/`.

Note: GitHub Pages on a free account needs the repo to be public.

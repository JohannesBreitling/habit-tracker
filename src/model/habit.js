export class Habit {
  id
  name
  color
  rythm
  start
  completions

  constructor(id, name, rythm, color, start, completions) {
    this.id = id
    this.name = name
    this.rythm = rythm
    this.color = color
    this.start = start
    this.completions = completions
  }
}

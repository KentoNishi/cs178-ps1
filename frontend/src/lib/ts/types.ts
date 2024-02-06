export enum Availability {
  Available = "available",
  Unavailable = "unavailable",
  Inconvenient = "inconvenient",
  Undefined = "undefined",
}

export interface User {
  name: string;
  id: number;
};

export type OthersValues = {
  [Availability.Available]: User[];
  [Availability.Unavailable]: User[];
  [Availability.Inconvenient]: User[];
};

export interface Timeslot {
  begin: Date;
  end: Date;
  userValue: Availability;
  othersValues: OthersValues;
}

export interface DayInput {
  day: Date;
  slots: Timeslot[];
}

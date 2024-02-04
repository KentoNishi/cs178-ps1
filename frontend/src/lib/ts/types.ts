export enum Availability {
  Available = "Available",
  Unavailable = "Unavailable",
  Inconvenient = "Inconvenient",
}

export interface User {
  name: string;
};

export type OthersValues = {
  [key in Availability]: User[];
};

export interface Timeslot {
  begin: Date;
  end: Date;
  userValue: Availability;
  othersValues: OthersValues;
}

export enum Availability {
  Available = "available",
  Unavailable = "unavailable",
  Inconvenient = "inconvenient",
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

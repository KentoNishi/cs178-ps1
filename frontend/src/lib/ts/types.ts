export enum Availability {
  Available = "Available",
  Unavailable = "Unavailable",
  Inconvenient = "Inconvenient",
}

interface User {
  name: string;
};

type OthersValues = {
  [key in Availability]: User[];
};

export interface Timeslot {
  begin: Date;
  end: Date;
  userValue: Availability;
  othersValues: OthersValues;
}

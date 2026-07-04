export interface AcademicUnit {
  type: "DEPARTMENT" | "INSTITUTE";
  name: string;
  id: string;
}

export interface Residence {
  type: "HALL" | "HOSTEL";
  name: string;
  id: string;
}

export interface University {
  name: string;
  id: string;
}

export interface Location {
  id: string;
  name: string;
  type: string;
}

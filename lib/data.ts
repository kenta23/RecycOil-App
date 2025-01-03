export const progressData = {
    labels: ["hours", "minutes", "seconds"], // optional
    data: [1, 0.6, 0.8]
};

export const piechartData = [
  { 
    value: 30,
    color: "#DB2777"
  },
  {
    value: 70,
    color: "lightgray"
  },
]

export enum Status { 
  SUCCESSFUL = "Successful",
  RUNNING = "Running",
  FAILED = "Failed"
}

export type DataInfo = {
   id: string;
   date: string;
   status: React.JSX.Element;
}



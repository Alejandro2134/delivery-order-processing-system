export type RobotStatus = "available" | "busy" | "offline";

interface IRobot {
  robotId: string;
}

export class Robot {
  private id: number;
  private robotId: string;
  private status: RobotStatus;
  private lastKnownLocation: string;

  constructor(robot: IRobot) {
    this.id = 0;
    this.robotId = robot.robotId;
    this.status = "available";
    this.lastKnownLocation = "Kiwibot HQ";
  }

  public getId(): number {
    return this.id;
  }

  public getRobotId(): string {
    return this.robotId;
  }

  public getStatus(): RobotStatus {
    return this.status;
  }

  public getLastKnownLocation(): string {
    return this.lastKnownLocation;
  }

  public setId(id: number): void {
    this.id = id;
  }

  public setStatus(status: RobotStatus): void {
    this.status = status;
  }

  public setLastKnownLocation(location: string): void {
    this.lastKnownLocation = location;
  }

  public changeStatus(newStatus: RobotStatus): void {
    if (this.status === newStatus)
      throw new Error(`Robot is already in status ${newStatus}`);

    if (this.status === "busy" && newStatus !== "available")
      throw new Error(`Cannot change status from busy to ${newStatus}`);

    this.status = newStatus;
  }
}

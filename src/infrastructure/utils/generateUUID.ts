import { IIdGenerator } from "@/domain/repositories/IIdGenerator";
import { randomUUID } from "crypto";

export class GenerateUUID implements IIdGenerator {
  generate(): string {
    return randomUUID().slice(0, 8).toUpperCase();
  }
}

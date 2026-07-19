import type { Trainer } from "./types";

export function canAccessLocation(trainer: Trainer, locationId: string): boolean {
  return trainer.active &&
    (trainer.locationIds.includes("*") || trainer.locationIds.includes(locationId));
}

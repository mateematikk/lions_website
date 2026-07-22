import type { Trainer, TrainingGroup } from "./types";

export function canAccessLocation(trainer: Trainer, locationId: string): boolean {
  return (
    trainer.active &&
    (trainer.locationIds.includes("*") || trainer.locationIds.includes(locationId))
  );
}

/**
 * Returns whether the trainer may use a group at the given location.
 */
export function canAccessGroup(
  trainer: Trainer,
  locationId: string,
  groupId: string
): boolean {
  if (!canAccessLocation(trainer, locationId)) return false;
  if (!trainer.groupIds.length || trainer.groupIds.includes("*")) return true;
  return trainer.groupIds.includes(groupId);
}

/**
 * Filters active groups down to those the trainer is allowed to use.
 */
export function filterGroupsForTrainer(
  trainer: Trainer,
  groups: TrainingGroup[]
): TrainingGroup[] {
  const unique = new Map<string, TrainingGroup>();
  for (const group of groups) {
    if (!group.active || !group.id) continue;
    if (!canAccessGroup(trainer, group.locationId, group.id)) continue;
    if (!unique.has(group.id)) unique.set(group.id, group);
  }
  return [...unique.values()];
}

/**
 * Unique location ids present in the trainer's accessible groups.
 */
export function locationsFromGroups(groups: TrainingGroup[]): string[] {
  return [...new Set(groups.map((group) => group.locationId).filter(Boolean))];
}

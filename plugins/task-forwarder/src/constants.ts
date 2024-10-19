/** A task that should be forwarded. */
export const FORWARDED_TYPE = ">";

/** A task that is scheduled for the future. */
export const SCHEDULED_TYPE = "<";

/** A to-do task. */
export const TO_DO_TYPE = " ";

/** An incomplete task. */
export const INCOMPLETE_TYPE = "/";

/** The types of tasks that are actionable by the plugin. */
export const ACTIONABLE_TASK_TYPES = [FORWARDED_TYPE, SCHEDULED_TYPE, INCOMPLETE_TYPE];

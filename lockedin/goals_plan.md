# Create Goal — Implementation Plan

**Status: Implemented in the current frontend preview.**

The modal now stores the new planning fields on the existing local `Goal` shape. Backend persistence can use these same fields when the goals API is introduced.

Update the existing **Create Goal** UI. Do not redesign the entire Goals page or rebuild existing working components unnecessarily.

## Create Goal Modal

Use the existing Create Goal UI but update it into a wider modal with clean, minimally bordered/borderless form controls consistent with the current application design.

The form should contain:

### Goal Details

- **Title** — required
- **Description** — optional
- **Category** — select from existing/supported categories

### Start Date

Allow the user to choose when the goal begins.

- Default: **Today**
- Allow today or a future date
- Do not allow past dates

### Commitment Period

Display as selectable radio cards:

- **3 Days**
- **1 Week**
- **1 Month**

Only one can be selected.

The selected Start Date + Commitment Period should determine the goal's applicable date range.

### Daily Commitment

Allow the user to specify how much focused time they want to spend on the goal **per day**.

Use:

- Hours
- Minutes

Example:

`2 hours 30 minutes / day`

Normalize this value to the duration format already used by the application/backend.

### Scheduled Check-in

Add a toggle:

**Scheduled Check-in**

Default: OFF.

When enabled, reveal:

**Check-in Time**

The user selects the time they intend to start working on this goal each day.

Example:

`7:00 PM`

For now, only save this configuration. Late-check-in penalties/scoring will be handled separately.

## Goal Data

Ensure goal creation supports the equivalent of:

```ts
{
  title,
  description,
  category,
  startDate,
  commitmentPeriod,
  dailyCommitment,
  scheduledCheckInEnabled,
  scheduledCheckInTime
}
```

Adapt these names/types to the existing schema instead of creating duplicate concepts.

## Validation

- Title is required.
- Start Date is required.
- Start Date cannot be in the past.
- Commitment Period is required.
- Daily Commitment must be greater than zero.
- Check-in Time is required only when Scheduled Check-in is enabled.

## Submission

On **Create Goal**:

1. Validate the form.
2. Use the existing goal creation API/service where possible.
3. Persist the new fields.
4. Close the modal after successful creation.
5. Refresh/update the existing Goals list.
6. Show the existing success feedback/toast pattern.

## Implementation Rules

Before coding, inspect the existing Goal form, components, types, schema, API/service and state management.

Reuse existing components and patterns where possible.

Do not redesign unrelated parts of the Goals module.

Do not implement analytics, AI planning, penalties, streaks, sessions or other future functionality as part of this task.

Focus only on completing the **Create Goal flow** described above.

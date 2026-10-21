# Career-plan required-field validation

User feedback: the full worksheet must not advance or produce a report with missing required answers. The homepage teaser is unchanged.

Root cause: `go()` advanced without validation, and report navigation only checked `goal.role`. Restored report state and export actions did not recheck completeness.

One shared rule set now guards forward navigation, direct report jumps, restored reports and image/PDF actions. Errors preserve input, appear inline with a linked summary, and open/focus the first incomplete milestone or job tab. English and Chinese use the same rules. Draft loading normalizes missing/null data rather than crashing or treating it as complete.

## Required answers

- Goal: role, industry, working day, desired life, motivation, differentiator, at least two success criteria and one strength.
- Each of four milestones: role, arrival evidence, at least one skill and one resource/contact/proof need.
- Current situation: role, skills and contacts/resources. Explicit “none yet” choices are valid for skills and contacts.
- Obstacles and support: at least one answer, or an explicit acknowledgment of none. Support categories are alternatives; no requirement to invent a financial or other need.
- Jobs: explicitly confirm no job to assess, or supply a name and five boolean answers for every started assessment. Unused slots and optional exit dates do not block progress. Unknown job answers must be investigated or that draft cleared, not silently converted to No.
- Actions: three descriptions, three valid deadlines from the current month through the next twelve months, and this week's first step.
- Name and job exit dates stay optional and are labelled accordingly.

Completeness is not a guarantee of factual accuracy or career success. The report remains a local worksheet, not a server-generated assessment; no new data collection or external AI service was introduced.

Regression command: `node scripts/test-career-form.mjs`. It runs the actual static tool script against navigation, report/export gates, whitespace/null data, milestone lists, hidden job tabs, explicit-none states, deadlines, bilingual errors and malformed restored drafts.

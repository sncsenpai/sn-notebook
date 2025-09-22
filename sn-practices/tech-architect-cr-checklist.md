# Change Request Approvals - Technical Architect Checklist

## Introduction

Depending on the flow of approvals, you may be the last line of defence of what gets deployed to the Production Instance.

While I have been included as an approver in this context, I made this list for myself to ensure all CRs are evaluated consistently.

## Checklist

In the Story:

- [ ] Deployment notes clearly available in respective Stories
- [ ] Evidence that a Code Review or Technical Peer Review has taken place
- [ ] That testing and UAT have been done and signed off in the respective Stories
- [ ] Relevant decisions and approvals are clearly documented/tracked in the Story

In the Change Request:

- [ ] Implementation plan is detailed in the relevant and not attached
- [ ] Implementation plan has *all* steps needed for the deployment, including manual steps
- [ ] UAT evidence (if applicable) attached
- [ ] Scope has not changed since initial set of approvals


## Notes

I'm a stickler for auditing and I do operate under a simple rule:

> If it's not documented it didn't happen.

With that in mind, the checks against the Story is to ensure that there is a single source of truth. Not emails please. In my view, relying on your emails is a terrible practice, as a key person (or people) holding that email may have left for whatever reason and we lose that vital piece of auditing.

So the with the line "Relevant decisions and approvals are clearly documented/tracked in the Story", here's my line of thought:

- Attach pertinent information that led to a decision, such as a technical/business impact analysis, to the Story
- Those decisions, if made over email, should be attached to the Story
  - ideally the stakeholder(s) have access to the work item tracking system to add the respective comments directly
- If other teams (e.g. Security Architecture) had any influence in the implementation design this should be clear.

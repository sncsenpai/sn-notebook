# Agile Story Practices

## Requirements Engineering

This is an actual process in itself to ensure requirements are well understood, prioritised  and agreed. The goal is not to attempt define a full and detailed set of requirements too early in a project, as the business environment can change over time.

Nevertheless, developing for the NOW Platform does come with an expectation that the Business Analyst identifies a service, function, or feature that a user needs.

Before creating user stories you should appreciate that the solution has two aspects:

- Functional requirements
  - Expresses a function or feature by defining _what_ is required, not _how_ a solution is achieved.
- Non-functional requirements
  - How well or to what level a solution needs to behave (describing attributes like security, reliability, maintainability, etc).

Why is all this important? If a User Story is well written it would be understandable by other members of the team (including testing and documentation).

### Expectations in ServiceNow

While this can apply to any other environment/platform, consider the following when analysing and assessing requirements on a ServiceNow related project:

- Is a workshop needed?
  - Involve a Technical Architect or Developer.
  - Share the recording with the team and stakeholder(s) for reference.
- Are all relevant stakeholders involved?
  - For example, if a story overlaps between Incident and Problem Management, both process leads should be involved.
- Does the requirement highlight gaps in the process?
  - Opportunity for process improvement (ways of working) rather than a technical solution.

In terms of ServiceNow specific analysis:

- Can the requirement be achieved with OOB[^1] functionality?
  - Refer to [ServiceNow Documentation](https://docs.servicenow.com/) to determine possible solutions to achieve the outcome.
- If the requirement cannot be achieved OOB:
  - Is it being challenged?
  - What are the best practices to consider (e.g., ITIL, ISO, [Now Create](https://nowlearning.servicenow.com/nowcreate))?
  - Can the customisation be justified and/or the customer accept the technical debt that may result from the story?
- If a customisation is required, perform a technical analysis to identify possible approaches for a solution
  - Each solution would be weighed against their pros and cons
  - Empower the stakeholder(s) to come to a decision

## Writing the Agile User Story

A User Story is a requirement expressed from the perspective of an end-user goal. User Stories can be referred to as Epics, Themes or Features but they follow the same format.

Agile User Stories are a very popular way of expressing requirements because:

- They focus on the viewpoint of a role (or persona) who will use or be impacted by the solution
- They define the need (or requirement) in a language that has meaning for that role
- They help clarify the true reason (or benefit) for that requirement
- They help define high-level requirements without going into low level detail too early

The INVEST model provides guidance on creating effective Stories:

- **I**ndependent
- **N**egotiable
- **V**aluable
- **E**stimable
- **S**mall
- **T**estable

### Considerations

- **Done Increment** - This is the definition of a 'done' increment. An Increment is Done when the user can complete the outlined task
- **Outline subtasks or tasks** - Determine which steps need to be completed and assign responsibility.
- **User personas** - Who is it for? Split the story for multiple end users.
- **Listen to user feedback** - Talk to the users and capture the problem in their words.
- **Time** - Stories should be completable in one Sprint. If a Story might take weeks or months, it should be broken up into smaller stories, or is an opportunity to be considered a Feature/Theme.

### User Story format

You should recognise this, where the format (or template) of a User Story is as follows:

```text
As a <role/persona>
I want ...
So that <goal/outcome>
```

Things to check when creating a User Story:

- Is the Agile Story template used clearly and concisely in the description?
  - This should highlight the expected outcomes.
- Does the short description correctly summarise the Story?
- Is this Story/requirement part of a collective of other Stories?
  - Structure it as part of a Feature/Theme/Epic
- Good Acceptance Criteria

## Writing Good Acceptance Criteria

- Are there too many acceptance criteria?
  - Determine a threshold to identify too many (e.g. over 4).
  - If so, can the Agile Story be broken down into smaller items or can it be treated as a feature?
    - This is not essential as part of the initial requirements gathering, however this should be considered part of the [Product Backlog](https://scrumguides.org/scrum-guide.html#product-backlog) refinement process.
- If applicable, are scenarios presented clearly in the Acceptance Criteria?
  - Are there edge cases to consider?
- Does the Acceptance Criteria distinguish clearly between the UIs: Workspace, UI16, Portal
  - If Workspace UI is being updated, which workspace?
- Are the acceptance criteria testable (see below)?
- Refer to [Docs: Writing effective stories in Agile Development 2.0](https://docs.servicenow.com/bundle/washingtondc-it-business-management/page/product/agile-development/concept/how-to-write-stories.html) for further guidance.

To write testable AC's it is recommended to consider using Behaviour-Driven Development (BDD). BDD is a method to enhance the Agile process, whereby it encourages working in rapid iterations, continuously breaking down your user's requirements into small pieces that can flow through your development process as quickly as possible.

From [cucumber](https://cucumber.io), BDD is a three-step, iterative process:

1. Take a User Story and express them using concrete examples of the new functionality to explore, discover and agree on the details of what's expected to be done.
2. Document those examples in a way that can be automated, and check for agreement
3. Implement the behaviour described by each documented example

_cucumber_'s approach follows a syntax called Gherkin. Here's an example:

```gherkin
Scenario: Breaker guesses a word
  Given the Maker has chosen a word
  When the Breaker makes a guess
  Then the Maker is asked to score
```

As can be seen in the example, Gherkin serves multiple purposes:

- Unambiguous executable specification
- Automated testing using Cucumber
- Document how the system actually behaves

Review the [Gherkin reference](https://cucumber.io/docs/gherkin/reference) for refining the User Stories in the Product Backlog and writing effective AC.

## Next steps

- If applicable, the solution been reviewed by the TDA[^2] ?
- Are the correct stakeholder(s) being asked for sign-off?
  - e.g., Incident Management Process Owner and Tooling Manager(s)
- Is OCM[^3] required?
  - Plan ahead for this

[^1]: Out-of-box. Sometimes abbreviated to OOTB for "Out-of-the-box".
[^2]: Technical Design Authority
[^3]: Organisational Change Management, also referred to as Business Change.

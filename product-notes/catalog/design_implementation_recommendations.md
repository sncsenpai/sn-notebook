# Design Recommendations for Service Catalogue

## Introduction

As a start it is recommended to implement governance for new/amend/removals Catalogue Items, checking that it aligns to a set of design principles, such as

- ensuring there is no technical jargon
- appropriate setting of catalogue and categorisation
- ensuring user criteria is set
- usage of approved pictures/icons
- stakeholders have approved the work that comes into their teams, such as approvals and tasks
- splitting the implementation between catalogue builder and user stories

The following documents sets out a list of recommended practices to achieve the governance framework for Service Catalogue implementations.

## Front-end interface considerations

- Use `container`s to simplify the form layout and organise the variables into logical blocks.
- Keep the questions understandable
  - If a question needs to be clarified, leverage hints so that the question is not too long.
  - Don't over-simplify the questions. You want the users to understand what is being asked of them.
  - Ask only necessary questions.
  - Check grammar and spellings.
  - Where you can leverage references, select boxes, multi-choice, etc so that the form is quicker and easier to 
- Keep the interface user friendly
  - Think about the end user experience when naming and describing the Catalogue Items.
  - Write clear, concise and user friendly descriptions that explain the purpose of the item, any limitations or requirements, and the expected outcomes, using terminology that users will understand.
  - Create categories in a user friendly way and in accordance with your organisation's services, while avoiding complex taxonomies.
  - Add images to your items to end users a clear picture of what they are ordering.
- When adding links to existing resources on the ServiceNow Platform (e.g. Knowledge Articles) in the description, take care to link to their portal equivalent pages.
  - You can also leverage the "Related Articles" related list on the Catalogue Item form. See [Specify related items and articles for a catalog item](https://www.servicenow.com/docs/bundle/zurich-servicenow-platform/page/product/service-catalog-management/task/map-items-cat-item.html) for more information
- Decide on what is a good threshold for the number of questions/variables on the form. 
  - From a continual improvement point of view you can decide if the form is too big and can be broken down into separate items.
- Leverage the Macro variable type when needed to load HTML content for disclaimers, important notes, etc in the item.

## Technical best practices

Moved to [Technical Recommendations for Service Catalogue](./technical-recommendations.md)

## Continual improvement

- Regularly review and update the Service Catalogue, seeking feedback from users and stakeholders to identify areas for improvement.
- Measure and monitor performance, using ServiceNow's analytics capabilities and metrics.
- Build and maintain a style guide so that all Catalogue Items follow the same design language for consistency.

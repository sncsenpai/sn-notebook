# Naming Conventions

## Introduction

This document covers the various objects (or application files) that can be created in the Now Platform.

We (as consultants or customers) should strive to set standards, so here are some ideas to get started.

## Users

### General Advice

#### User IDs must not be longer than 40 characters

Longer than 40 characters is truncated by the `sys_created_by`/`sys_updated_by` fields and should be avoided. Users will have trouble authenticating using User IDs like this.

#### Service Account Users

Service Account Users are those that do not authenticate via the UI, such as integrations. They are assumed to have sensible credential rotation policies attached.

- A prefix should be used to differentiate the ‘type’ of a service account.
- The customers initial prefix should be used to start, if requested by the customer
- Names should be descriptive of both the purpose of the integration and the source, and should include the customer's name.
- All Service Account users *must* have the time zone set to UTC and the date format to ‘yyyy-MM-dd’.

##### Example

Creating an account for user Provisioning from Azure would be:

User ID: `svc.azure_user_sync`

Name: “Integration – Azure User Provisioning”

##### Why?

When collating reports, searching for users, especially where a performance event might be occurring, being able to identify groupings of users by prefixes is very important. Searching for (starts with) 'svc.%' rather than (contains) '*svc.'

## Customer Code

Customers should identify a code, or prefix to be used with various objects. This helps to identify objects as custom, or owned by the Customer, rather than out-of-the-box objects. This code sounds simple but can have consequences.

A code should be no longer than 3 characters. In an ideal world, all codes would be easily separated from other words, for example a customer called ‘Cloud Dimensions’ would have a prefix of ‘CD’.

If the customer code is ambiguous, such as ‘ABS’, this could be confusing as attempting to find objects unique to your installation will be harder. This affects every investigation into an issue and can frustrate support teams. In this case, consider simply adding an underscore character, such as ‘CD_’.

## New Object Naming

When creating new scripted objects (e.g., Business Rules, Client Scripts, etc.), prefix the name with an identifier for the customer (i.e., using the customer code)

For example, if creating a new Business Rule for Cloud Dimensions then the customer code would be “CD_” followed by the name of the Business Rule

The following is a list of object types and their recommendations:

| **Object Type**                                              | **Recommendations**                                          |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| **Tables and Fields**                                        | Do’s: <br/> + Custom tables and fields should start with "u". <br/> + Identifiers should be written in lower case. <br/> + Column names with multiple words should be separate by underscore <br/> + Keep the names meaningful and in English. <br />Don’ts: <br/> + Generic names, like u_string_1. <br/> + Using `long_names_describing_every_single_detail`. General rule of thumb is to keep the name less than 30 characters long. <br/> + Pluralising the name rather than using singular form. |
| **Groups**                                                   | + Name <= 30 characters <br />+ Up for discussion. Set the **description** with a reference to the **story/request**. <br />+ Up for discussion. If the customer has no naming convention, suggest that the name begins with CUSTOMER CODE followed by the process and a name, separated with a dot  <br />Example: “CD.Incident.ResolverGroup1”. |
| **Roles**                                                    | + All custom roles should start with "u_". <br />+ Set the **description** field. <br />+ Should be assigned via a security/role allocation group. |
| **Client Scripts** **Catalogue Client Scripts** **UI Scripts** **Workflows** **E-Mail Notifications** | Ensure the **name** starts with CUSTOMER CODE              |
| **Business Rules**                                           | Ensure the **name** starts with CUSTOMER CODE              |
| **UI Policies** **Catalog UI Policies**                      | Ensure the **short description** begins with CUSTOMER CODE |
| **UI Actions**                                               | + Up for discussion. Ensure the **comments** starts with CUSTOMER CODE<br />+ Avoid adding the code to the name as this will render on the UI and will not be meaningful for the user. |
| **Script Includes**                                          | + Ensure the **name** starts with CUSTOMER CODE <br />+ Verify the Class Name in the script matches the **name**. <br />+ Use camel case, for example:  CDIncidentHelper |
| **Data Sources** **Import Sets** **Transform Maps**          | + Ensure the **name** starts with CUSTOMER CODE <br />+ The name of the fields in the Import Set table should follow names of the fields in the input/source. |
| **Events**                                                   | + Ensure the **name** starts with CUSTOMER CODE followed by the app/process name, then the event name.<br />+ Separate the above with a dot, for example: “cd.incident.newIncident” |
| **Messages**                                                 | + Ensure the **key** starts with CUSTOMER CODE followed by the app/process name, and then a meaningful name for its usage. <br />+ Optionally, include `msg` to distinguish it from other objects. <br />+ Separate the above with a dot, for example:  `cd.change.msg.lead_time_invalid` |
| **Properties**                                               | + Ensure the **name** starts with CUSTOMER CODE followed by the app/process name, and then a purposeful name. <br />+ Separate the above with a dot, for example:  `cd.knowledge.redirect_to_portal_suffix`  <br />Further discussed later in this document. |

> **Note**: many developers like to abbreviate the app/process name to match the numbering style. For example: “CD.inc.newIncident”. However, this does need to be agreed amongst the team, to maintain consistency.

## Update Set Naming

For your project/deployment agree with the System Administrators on the format to name Update Sets.

As a team, along with the customer you must decide on the format, and you should then implement a client script or similar which ensures that new update set names are validated against your standard. Link this client script to external documentation so that your group decisions are easily managed.

### Example simple format

`<TASK NUMBER>_<VERSION> - <TASK DESCRIPTION>`

`STRY0010001_001 – Update button styles to match corporate colour scheme`

or

`<DEVELOPER INITIALS>_<TASK NUMBER>_<VERSION>`

`DI_STRY0010001_001`

- In the above example, all referential data (such as who authored the update set, how the story was delivered are included by referencing the story number.
- Usage of this scheme will depend on whether you use ServiceNow (which includes this referential data) or another tool which might not have the same detail.
- The developer's initials to attempt to provide audit-traceability
- If using the description, ensure to keep it concise to limit the length of the update set name

If a third-party tool is used to track stories, and perhaps an external partner is involved, you could consider a fully featured format.

Regardless of the scheme you choose, you should always include a version number, and the story number. These two pieces of information are crucial for audit purposes.

## Properties

Properties are often created without much thought to their curation, and it’s really important to avoid this.

You should group properties sensibly, into functional areas, or streams depending on how your engagement is organised. An example property might be:

`incident.auto_close.reminder_period`

or 

`inc.auto_close.reminder_period` *if it's your adopted practice to refer to the number maintenance table for the respective application*

This property specifies a product area (incident), a function (auto_close) and a method (reminder_period) which tells you as much as possible. However, the scenario will vary when building scoped application(s) as a prefix is automatically created for new properties, unless your application builds on top of existing functionality.

### Instance specific properties

There are cases you would need to instance-specific system properties whereby it is crucial to ensure that configurations like endpoints or settings differ appropriately between environments such as development, testing, and production. A recommended approach involves using a naming convention where instance-specific properties are prefixed with the exact name of the instance, such as `cd-dev.my_rest_endpoint` for a development instance and `cd.my_rest_endpoint` for production. This method allows code to dynamically retrieve the correct property value based on the current instance by leveraging the `instance_name` system property.

### Other guidelines

- You *must* use the 'Description' field to document property
- Ordering is left to right, in terms of significance
- Words under a single grouping must be separated by an underscore (`_`), not a full stop (as observed in the examples above)
- It is highly recommended that properties are surfaced in a properties page to increase visibility.
- If properties being active in production is a problem, you must ensure there is some monitoring solution to ensure that this does not happen accidentally.

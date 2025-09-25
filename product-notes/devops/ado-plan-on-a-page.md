# ServiceNow and Azure DevOps

|                      Tag | Data                                                         |
| -----------------------: | ------------------------------------------------------------ |
|             Technologies | ServiceNow<br />Azure DevOps                                 |
| ServiceNow Product Areas | DevOps                                                       |
|              Description | Connect Azure DevOps with ServiceNow to improve delivery     |
|                Functions | Automatically create Change Requests from CI/CD pipelines<br />Automatically approve Change Request based on policies |
|                  Outputs | Connect tools and applications<br />Change automation<br />Change traceability<br />DevOps Insights |
|                Consumers | Calitii customers<br />- Pre-sales staff when demonstrating to non-ServiceNow customers.<br />- Demonstration of DevOps capabilities to existing customers. |
|   Applications / Plugins | ServiceNow DevOps Change Velocity application<br />ServiceNow DevOps for Azure DevOps extension |
|             Calitii team | Keith Drew, Shahed Shah                                      |

## Actors/Personas

| Role                               | Description                                                  |
| ---------------------------------- | ------------------------------------------------------------ |
| Developer                          | Can keep working in their own tools, without losing time in creating change requests. |
| Change manager                     | Automate appropriate change governance driven by data.       |
| Release manager                    | Visibility of release plan and progress, and automate tasks. |
| Application development leadership | Views of team performance. Identify bottlenecks and take appropriate action. |
| Operations and Support teams       | Single tool to manage Changes and Incidents.                 |
| IT Compliance Officer              | Ensure compliance between change and Incident.               |

## Features

| Features               | Description                                                  |
| ---------------------- | ------------------------------------------------------------ |
| Change automation      | Create change automatically and automate approval decisions to increase change velocity while ensuring governance and control. |
| Change traceability    | Track the progress of your work items, commits, artifacts, builds, and releases using the change requests to lend additional transparency and provide a single source of truth to all the personas involved. |
| DevOps Insights        | View flow metrics, change acceleration metrics and other KPIs across the end-to-end software delivery value chain and connected tools. |
| Integrations           | Packages to simplify integration with DevOps toolchain.      |
| DevOps Workspace       | Central workspace to access the data model that connects the DevOps toolchain to the work and data already in the platform. |
| Proactive health scans | Detect anomalies and issues in your instance by using a suite of proactive checks. |

## Supported Integrations

| Tool type            | Tools and the supported version                              |
| -------------------- | ------------------------------------------------------------ |
| Planning             | - Azure Boards (Azure DevOps latest cloud version)<br />- Azure DevOps Server (ver 2022.0.1)<br />- Jira Server and Jira Cloud (latest cloud version)<br />- ServiceNow Agile Development 2.0<br />- GitHub (latest cloud version)<br />- GitHub Enterprise (ver 3.7)<br />  - Basic authentication<br />  - OAuth<br />- Rally (latest cloud version) |
| Coding               | - Azure Repos (Azure DevOps latest cloud version)<br />- Azure DevOps Server (ver 2022.0.1)<br />- Bitbucket (ver 7.19.2 on-premises)<br />- GitHub (latest cloud version)<br />- GitHub Enterprise (ver 3.7)<br />  - Basic authentication<br />  - OAuth<br />- GitLab (ver 13.0.6 for on-premises or latest cloud version) |
| Orchestration        | - Azure Pipelines (Azure DevOps latest cloud version) Jobs supported:<br />  - Agent job<br />  - Agentless (server) job<br />- Azure DevOps Server (ver 2022.0.1)<br />- Jenkins (ver 2.289.1) Jobs supported:<br />  - Freestyle project<br />  - Folder (default is 3 levels)<br />  - Pipeline<br />  - Multibranch Pipeline<br />- GitLab (ver 13.0.6 for on-premises or latest cloud version)<br />- GitHub (latest cloud version)<br />- GitHub Enterprise (ver 3.7)<br />  - Basic authentication<br />  - OAuth<br />- Argo CD (latest cloud version) |
| Repository artifacts | - JFrog (ver 7 for on-premises or latest cloud version)<br />- Azure Artifacts (Azure DevOps latest cloud version)<br />- Azure DevOps Server (ver 2022.0.1) |
| Testing              | If any test is run as part of the pipeline executions of the following supported Orchestration pipelines, the information is shown in the test summary<br />- GitHub (latest cloud version)<br />- GitHub Enterprise (ver 3.7)<br />  - Basic authentication<br />  - OAuth<br />- GitLab (ver 13.0.6 for on-premises or latest cloud version)<br />- Azure DevOps (latest cloud version)<br />- Azure DevOps Server (ver 2022.0.1)Jenkins (ver 2.289.1) |
| Software Quality     | SonarQube (ver 8.9.6 or latest cloud version) scans supported on<br />- Azure DevOps pipelines (latest cloud version)<br />- Azure DevOps Server (ver 2022.0.1)<br />- Jenkins (ver 2.289.1) pipelines |
| Feature Flag         | Split (latest cloud version)                                 |
| Security             | - Veracode (latest cloud version)<br />- Checkmarx One (ver 1.0.17)<br />- Checkmarx SAST (ver 1.0.16) |

## Technical Notes

### Plugins installed/updated

- DevOps Change Velocity [sn_devops_chgvlcty] from the [Store](https://store.servicenow.com/sn_appstore_store.do#!/store/application/f1d62f041b3abc10d6f254a5624bcbf5).
- If integrating with ServiceNow ITBM Agile 2.0, activate the the Agile Development 2.0 [com.snc.sdlc.agile.2.0] plugin
- To integrate with Azure DevOps, the ServiceNow DevOps extension on [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=ServiceNow.vss-services-servicenow-devops).

### Pre-requisites

- Ensure you have Azure credentials.
- Ensure you have an Azure DevOps instance running and can access it.
  - Configure the organization, project and pipeline(s)
- Create a service account (in ServiceNow) for the integration and take note of the password.
- Allocate roles to the service account.

### Configuration Performed in ServiceNow

- Assigned roles and tasks to users and groups.
- Set up integration user account.
- Using the 'Connect a tool' button in the DevOps Change Workspace onboard Azure DevOps at the organization level:
  - Follow the steps presented in the Playbook.
  - Connecting at the organization level allows you to discover all projects.
  - Install the ServiceNow DevOps extension in your Azure DevOps instance, when prompted.
- Once all objects have been discovered, the tool mapping will look like this
  | SN DevOps App | ADO Service  |
  | ------------- | ------------ |
  | Orchestration | Pipelines    |
  | Plan          | Work Items   |
  | Code          | Repositories |
  | Artifact      | Artifact     |

  Pipeline stages are represented as steps in the workspace
- Use the 'Create an application' button in the DevOps Change Workspace to create an application and associate objects to it, including pipeline(s).

  - (Optional) Associate it to a Business Application, which will allow a user to see the entire application service map, including change records, affected CIs, incidents, outages, and problems.
- Click the 'Associate change' button to begin setting up an automated change request.

  - Modify the orchestration pipeline to enable change control on any relevant steps.
  - Fill in any relevant or mandatory fields.


### Configuration Performed in Azure DevOps

- Install the **ServiceNow DevOps** extension from the [Visual Studio Marketplace](https://marketplace.visualstudio.com/).
- Select your Azure DevOps (ADO) organization and select **Install**.
- From your ADO project, navigate to **Project settings > Pipelines > Service connections** and create a new connection to the ServiceNow Instance.
- Use the ServiceNow DevOps actions/tasks in the YAML script to configure the release pipeline
  - See [Use the ServiceNow DevOps extension for Azure DevOps and Azure DevOps custom actions](https://www.servicenow.com/docs/bundle/washingtondc-it-service-management/page/product/enterprise-dev-ops/task/config-dev-ops-extensions-azure.html) for more info.

#### Example YAML script

```yaml
trigger:
- main

stages:
- stage: "Dev_Deployment"
  displayName: "Deploy to Dev Environment"
  jobs:
  - job: "Dev_Deployment"
    pool:
      vmImage: ubuntu-latest
    steps:
    - script: echo Hello, world!
- stage: "UAT_Deployment"
  displayName: "Deploy to Test Environment"
  dependsOn: [Dev_Deployment]
  condition: succeeded()
  jobs:
  - job: "ChangeApproval"
    pool: server
    steps:
    - task: ServiceNow-DevOps-Server-Change-Acceleration@1
      inputs:
        connectedServiceName: '$(ServiceNowConnection)'
        changeRequestDetails: |
          {
            "setCloseCode": true,
            "attributes": {
              "requested_by": {
                "sys_id": "3948666ae7012300dd926217c2f6a967"
              },
              "category": "DevOps",
              "priority": "2",
              "short_description": "Sample Azure DevOps Change Request",
              "comments": "This is a sample pipeline script to be added in your change step",
              "work_notes": "Update this to work_notes"
            }
          }
  - job: "UAT_Deployment"
    pool:
      vmImage: ubuntu-latest
    steps:
    - script: echo Testing on Linux!
- stage: "Prod_Deployment"
  displayName: "Deploy to Live Environment"
  dependsOn: [UAT_Deployment]
  condition: succeeded()
  jobs:
  - job: "Prod_Deployment"
    steps:
    - script: echo Deploying the code!
```


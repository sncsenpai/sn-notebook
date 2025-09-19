# Catalogue Item Template

## Instructions

Upon completion of the following sections, they can be used as acceptance criteria in the stories.

For the form questions, the intention is to identify relevant data for fulfilment. Can complement with wireframing to support any form behaviour defined in the Question notes.

**Note:** It is recommended to have one Story per Catalogue Item.

## Details

|                         |                 |
| ----------------------- | --------------- |
| Name of the request[^1] | xxx             |
| Short description [^2]  | xxx             |
| Description             | xxx             |
| Catregory [^3]          | xxx             |
| Owner [^4]              | xxx             |
| Keywords [^5]           | xxx             |
| Available for [^6]      | xxx             |
| Delivery time           | xxx             |
| Mandatory attachments   | Yes/No          |

## Questions

| Question        |  Input type        |  Notes                 |
| --------------- | ------------------ | ---------------------- |
| xxx             | Free text/date ... | e.g., Mandatory        |
| xxx             | xxx                | xxxx                   |

## Flow

Use bullet points to describe the flow [^7] and usage of variables [^8]. For example

```text
1. Create parallel task
   - Title: xxx
   - Short description: "xxx with ${var}"
   - Description/Notes: xxx
   - Assignment group: (empty)
2. Create parallel task
   - ...
```

[^1]: Used as header on the form and in category list
[^2]: Used as sub-header on the form and in category list
[^3]: Ideally category taxonomy is configured first
[^4]: Optional, but recommended for governance and responsibility
[^5]: Optional, but recommended to improve search results
[^6]: User Criteria configuration available/not available for
[^7]: Can create catalogue specific flow/workflow or reference an existing workflow
[^8]: `${var}` is to demonstrate that you can reference a Question’s answer (value) when creating tasks
[^9]:: Can define when questions are mandatory, shown/hidden


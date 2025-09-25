# Software Lifecycle Stuff

Table structure

```mermaid
---
title: Table structure
---
erDiagram
   cmdb_software_product_model ||--|| samp_sw_product : "links to product"
   cmdb_software_product_model ||--|| cmdb_model : extends
   samp_sw_product ||--o{ sam_sw_product_lifecycle : "has lifecycle"
   samp_sw_product ||--o{ sn_apm_trm_standards_product_lifecycle : trm
   software_lifecycle_code }o--|| sam_sw_product_lifecycle : "has code"
   
```

Related list for lifecycle on software model, is define via Relationships [sys_relationship]: Software Product Lifecycles

Ref: /sys_relationship.do?sys_id=a87fd7ab53311010caaaddeeff7b124f

Script:

```javascript
(function refineQuery(current, parent) {
    // SAM use case
    if (GlidePluginManager.isActive("com.snc.sams")) {
        current.addQuery("norm_product", parent.product);
    } else {
        current.addQuery("publisher", parent.manufacturer);
        current.addQuery("product_name", parent.name);
    }
	current.addQuery('active', 'true');
	SamLifeCycleUtils.queryVersionAndEdition(current, parent);

    current.orderBy("norm_version");
    current.orderBy("norm_full_version");
    current.orderBy("start_date");

})(current, parent);
```

To calculate set `com.snc.samp.use_lifecycle_approximation` property to true

```mermaid
---
title: Product Lifecycle Tables
---
erDiagram
   samp_sw_product ||--o{ sam_sw_product_lifecycle : "has lifecycle"
   sam_sw_product_lifecycle }o--|| software_lifecycle_code : "Lifecycle code"
   sam_sw_product_lifecycle ||--o{ sam_sw_product_lifecycle_report : "lifecycle visiblility"
   sam_sw_product_lifecycle ||--|| sam_custom_sw_product_lifecycle : "extended by"
```

Inner workings of software installation creation and deletion of ServiceNow SAM Pro:
https://www.servicenow.com/community/sam-blog/understanding-the-inner-details-of-software-install-creation-and/ba-p/2734897?nobounce

Report on Software Product End of Life or End of Service:
https://www.servicenow.com/community/sam-forum/report-on-software-product-end-of-life-or-end-of-service/m-p/1314131?nobounce

# Software Installations Table Attribute Review

## Primary Attributes Used by SAM Admins.

- **Active install (active)**: 
  When the same software installation is discovered by multiple discovery sources, only one will be set to “active = true”. The remainder will be set to false. This is to avoid double-counting in reporting.
  Additionally, when the com.snc.samp.exclude_device_flag system property is in use, software installation records representing software installed on matching CI’s will be set to “active = false”. This is to preclude their inclusion in reconciliation calculations.  The “SAM - Adjust installs for excluded Cis” scheduled job handles the setting or unsetting of the Active install attribute for CI’s impacted by the system property. 
- **Display name (display_name):** 
  Discovered product reflected as a concatenation of the Publisher, Product, and Edition found by a discovery source.
- **Discovery model (discovery_model):** 
  A reference value to the Discovery Model representing the software installation. To reduce the system resources it takes to query millions of records during reconciliation calculations, Discovery Model records are created for each unique software product, version, and edition combination found in the Software Installation table.  The Discovery Model is where normalized values for publisher, product, version, and edition are stored. When a software installation record is inserted into the table, the “Create a Software Normalization” business rule is executed. It is this business rule that either links the software installation record to an existing discovery model or creates a new discovery model, normalizes the discovery model, and populates the discovery_model reference on the software installation record.
- **Publisher (publisher):** 
  The publisher value identified by the discovery source of the software installation. This attribute is a string value representing the exact value returned by the discovery source. The field is not a reference to the SAM Content Library, nor is it a reference to the platform Company (core_company) table.
- **Version (version):** 
  The version value identified by the discovery source of the software installation. This is the exact, not normalized value returned by the discovery source.
- **Edition override (edition):** 
  When the software edition is not returned by a discovery source as part of the Display name value, you can manually enter the edition into the Edition override attribute.
- **Installed on (installed_on):** 
  A reference link to the Configuration Item (cmdb_ci_hardware) record on which the software is installed.

## Default Form

The default form contains most of the attributes identified in the section above, those important to SAM Admins. However, it contains additional attributes that tend to cause confusion. Attributes not identified above are specified below.

![img](./Software Installations Table/2500.png)

### Installation tab

- **Install location (install_location):** File location path identifying where the software is installed. Use of this attribute may require additional configuration of a discovery application and the integration of that application into ServiceNow.
- **Install date (install_date):** Date the software was installed onto the device. Use of this attribute may require additional configuration of a discovery application and the integration of that application into ServiceNow.
- **Revision (revision):** This attribute is deprecated
- **Instance key (instance_key):** Unique ID for the instantiation of the software. Automatically generated when the software is installed. Use of this attribute may require additional configuration of a discovery application and the integration of that application into ServiceNow.
- **Uninstall string (uninstall_string):** Identifier used to uninstall the software. Use of this attribute may require additional configuration of a discovery application and the integration of that application into ServiceNow.
- **ISO serial number (serial_number):** Placeholder for the ISO Serial Number. Use of this attribute may require additional configuration of a discovery application and the integration of that application into ServiceNow.

### Reconciliation Tab

- **Inferred suite (inferred_suite):** Populated by automation associated with the Reconciliation process. When populated, it contains a link to the suite parent software model. This is not an attribute a user should update or alter.
- **Omit from suites (omit_from_suites):** True/False flag identifying if the software should be excluded from consideration when identifying suite children. When set to True (checked), the software installation will be considered a stand-alone installation. This attribute can be updated by a user to force a desired reconciliation outcome.
- **Discovery source (discovery_source):** Discovery product that created the software install record. Sample values: ServiceNow, SN File Discovery, ILMT, SG-SCCM, SG-JAMF.

## Attributes Managed by the SAM Application or Discovery Sources.

These values may be of interest to the SAM Admin but they are not editable and in only niche use cases are valuable for reporting.

- **Allocation needed (allocation_needed):** This true/false attribute identifies if the software install requires an allocation for compliance. This would be in the case of Per Named User and Per Named Device license metrics where software has been found installed but no allocation is present for the user identified in the Assigned To on the Installed On device.
- **Assigned to (assigned_to):** A reference attribute to the sys_user table identifying the Assigned To value of the Installed On device. The value is leveraged for Per User and Per Named User license metrics and is updated during the reconciliation process from the Assigned to value found on the Installed On CI.
- **Class (sys_class_name):** The class of the install. Possible values; Software Installation, IBM Peak Consumption, and Engineering Software Peak Consumption.
- **Cloud host type (cloud_host_type):** Identifies if the Installed on device is on a shared host or a dedicated host. Possible values; Shared, and Dedicated. Used by the [Cloud Insights](https://docs.servicenow.com/bundle/sandiego-it-asset-management/page/product/cloud-insights/reference/cloud-insights-landing-page.html) product.
- **Cloud license type (cloud_license_type):** The attribute identifies if the installation utilizes a BYOL or License Included (pay as you go on cloud) license. Possible values; BYOL, and License included. Used by the [Cloud Insights](https://docs.servicenow.com/bundle/sandiego-it-asset-management/page/product/cloud-insights/reference/cloud-insights-landing-page.html) product.
- **Cloud license type source (cloud_license_type_source):** Indicates the discovery source of the license type column on an install. Possible values: SN Discovery, Manual tags, Cloud Insights, and Third-party integration. Used by the [Cloud Insights](https://docs.servicenow.com/bundle/sandiego-it-asset-management/page/product/cloud-insights/reference/cloud-insights-landing-page.html) product.
- **Cloud provider (cloud_provider):** Reflects either AWS or Azure, the two providers currently supported by [Cloud Insights](https://docs.servicenow.com/bundle/sandiego-it-asset-management/page/product/cloud-insights/reference/cloud-insights-landing-page.html).
- **Cloud service type (cloud_service_type):** Will contain either Infrastructure as a Service (IAAS) or Platform as a Service (PAAS). Used by the [Cloud Insights](https://docs.servicenow.com/bundle/sandiego-it-asset-management/page/product/cloud-insights/reference/cloud-insights-landing-page.html) product.
- **Created by application pattern (created_by_application_pattern):** This true/false value is set to true if the software was discovered by [patterns](https://docs.servicenow.com/bundle/sandiego-it-operations-management/page/product/service-mapping/reference/r_SupportedApplications.html). This can be for Microsoft SQL Server (and some SQL Server components), Microsoft Exchange Server, Oracle Database Server, Oracle MySQL Server, Oracle GlassFish, and Oracle Database Weblogic Server.
- **Deduplicated (deduplicated):** The value is set to True if the deduplication process has run against the record. For information on deduplication refer to the ServiceNow [documentation website](https://docs.servicenow.com/bundle/sandiego-it-asset-management/page/product/software-asset-management2/task/remove-duplicate-installs.html).
- **Discovery source (discovery_source):** Discovery product that created the install - Sample values: ServiceNow, SN File Discovery, ILMT, SG-SCCM, SG-JAMF
- **Domain (sys_domain):** This attribute is utilized by ServiceNow when you have [Domain Separation](https://docs.servicenow.com/bundle/sandiego-platform-administration/page/administer/company-and-domain-separation/reference/domain-sep-landing-page.html) enabled. The value reflects the Domain under which the software installation is managed. This is derived from the Domain assigned to the “Installed on” Configuration Item.
- **Domain path (domain_path):** This reflects the domain hierarchy level of the assigned domain when Domain Separation is in use.
- **Inference calculated (inference_calculated):** True/False flag reflecting if this record has been identified as a suite component has been processed and inferred to a suite software model.
- **Inferred suite level (inferred_suite_level):** This integer value is used to identify the level of the suite when suites are nested. The height of the inferred suite software model (i.e. it will be greater than one if it includes another suite in its suite components)
- **Inferred suite product (inferred_suite_product):** A reference value to the Software Product table, which is part of the SAM Content Library. This link is set during software reconciliation processing.
- **Is allocated (is_allocated):** True/False. Identifies if a software allocation record was matched (licensed by an allocation) to the software installation record during reconciliation processing.
- **Is reconciled (is_reconcilied):** Indicates if the install has been processed by the reconciliation engine.
- **Last scanned (last_scanned):** The date the software was last scanned on the hardware device.
- **Last used (last_used):** The date the software was last used. Important note about this value: ServiceNow discovery products and plugins do not populate this value. Instead, they write the last used date to the Software Usage (samp_sw_usage) table, which is leveraged for Reclamation. There is an [API available](https://docs.servicenow.com/bundle/sandiego-application-development/page/integrate/inbound-rest/concept/sam_soft_us_int-api.html) to write values to the Software Usage table from other data sources. If you wish to utilize this attribute, which is most often left blank, you’ll need to customize your discovery source integration to do so.
- **License metric result (license_metric_result):** This reference value links to the most recent [License Metric Result record](https://docs.servicenow.com/bundle/sandiego-it-asset-management/page/product/software-asset-management2/reference/license-metric-results-fields.html) where the software installation was utilized in compliance calculations.
- **Minimum viable software model (software_model):** This reference to the software model is set by the reconciliation process. The value isn’t written for every software installation.
- **Normalized display name (normalized_display_name):** Display Name of the normalized values. It is set only for installs that will be processed by reconciliation (licensable and ignore installs = false on the product). For reporting, it is best to use dot walking to report on the normalized values in the related Discovery Model record.
- **Normalized product (norm_product):** This is a reference field to the normalized product. It is set only for installs that will be processed by reconciliation (licensable and ignore installs = false on the product). For reporting, it is best to use dot walking to report on the normalized values in the related Discovery Model record.
- **Normalized Publisher (norm_publisher):** This is a reference field to the core_company table reflecting the normalized publisher. It is set only for installs that will be processed by reconciliation (licensable and ignore installs = false on the product). For reporting, it is best to use dot walking to report on the normalized values in the related Discovery Model record.
- **Primary install (primary_install):** This is a reference to another software installation record. When duplicates are found one is marked active = false and the primary install link is set to the record where active = true is retained.
- **Primary key (primary_key):** Unique ID for the instantiation of the software.
- **Product result (product_result):** Reference to the [Product Result record](https://docs.servicenow.com/bundle/sandiego-it-asset-management/page/product/software-asset-management2/reference/Recon-swmodelresults-classic.html) created by the reconciliation process.
- **Reconciliation state (reconciliation_state):** This integer value is used by the reconciliation process to track various stages of reconciliation processing.
- **SCCM group ID (sccm_group_id):** The SCCM Group ID used during the Remove Software process (SAM Reclamation or Client Software Distribution). This data is brought into ServiceNow via an SCCM integration such as the SCCM Plugin but changes made in SCCM 2016 rendered this value mostly useless to ServiceNow. The value is not used by the Service Graph Connector for SCCM.
  The following represents the source in SCCM: sccm_group_id - From the column "groupID" in the SCCM software install views V_GS_ADD_REMOVE_PROGRAMS, V_GS_ADD_REMOVE_PROGRAMS_64, and V_GS_INSTALLED_SOFTWARE
- **SCCM TimeStamp (sccm_timestamp):** The SCCM record timestamp. This data is brought into ServiceNow via an SCCM integration such as the Service Graph Connector for Microsoft SCCM.
  The following represents the source in SCCM: sccm_timestamp – From the column “timestamp” in the SCCM software install views V_GS_ADD_REMOVE_PROGRAMS, V_GS_ADD_REMOVE_PROGRAMS_64, and V_GS_INSTALLED_SOFTWARE
- **Software model result (software_model_result):** A reference value to the [Software Model Result](https://docs.servicenow.com/bundle/sandiego-it-asset-management/page/product/software-asset-management2/reference/license-metric-results-fields.html) where the software installation was used. This value is generated by the reconciliation process.
- **Software model source (software_model_source):** This identifies the step in the reconciliation process that set the Minimum Viable Software Model attribute.
- **Unlicensed install (unlicensed_install):** True/False flag identifying if the most recent reconciliation processing identified the software installation as unlicensed.

## **Software Suite Inference percentage calculation**

### Question

I am looking forward to understand the inference % calculation for suite application with even no. of child applications. Does the inference % has to be a whole number or can we use rational number as well?

For example- if a suite product consists of 6 child applications and at-least 5 child applications must be installed in order to consume a full suite license, in this scenario what inference % should be added. (83.33% or 84%?) Is there a formula we can use to accurately calculate this?

### Answer

First, mathematically, fractions of a percent in this context mean nothing. Round up or down, the number you use should be a true representation of this kind of approach to a suite in as simple terms as possible. If you have 6 products, you could still say "inference is 90%" and it achieves the same as 84%.

However, **I am cautious about using this feature.** Inferring that a certain amount of suite components is used before the suite applies implies that you have no control over your buying methodology.

Say you buy Microsoft Office on a volume licensing plan. You will buy the same suite for everyone. You don't normally buy Office Pro Plus for one user and Excel Standalone for another. And what happens if they only install one part of the suite and uninstall the rest of the suite? Have they truly broken the bundle? Seems like, for some products, it's prone to incorrect accounting.

Despite how [the documentation refers to Access](https://docs.servicenow.com/bundle/sandiego-it-service-management/page/product/asset-management/concept/c_CreateAndManageSWSuite.html) as being an example of a part of that inference, it is incorrect to state that just because Access is installed that Office Professional is installed. You can have Office Standard installed and then purchase and use Access standalone. Probably not recommended, but if you're doing that so you can use Access only for project work and then reassign it to another user later, that makes more sense. You wouldn't want ServiceNow thinking that the wrong product is actually installed or the wrong entitlement is applied.

One last thing about Microsoft: Technically, if you install Access with the standalone installer, you can't apply a suite license to it. But that is a gray area that over time is becoming less of an issue with O365.

As well, this should NOT be used for anything that is assigned in a portal. Adobe Creative Cloud is a great example. If you use inference based on what is installed, you run the risk of not having an accurate representation of what is *assigned* to users in the portal. You could be using 5 products and be assigned all of them as single product licenses in an ETLA, spending much more than you should, but due to inference ServiceNow could be reporting that the user has All Apps installed. In reporting SaaS and subscription named-product licensing, you need to have a full and accurate accounting of what is assigned, not just what is installed. I would never use an inference percentage for Adobe and expect that ServiceNow reflects the same as the Adobe admin portal.

Having said that, this probably has some specific use cases that apply. For those non-publisher-pack products that won't get messed up using inferences, I would just leave it to a round number that captures the applicable components, not worrying about fractions of a percent.

https://www.servicenow.com/community/sam-forum/software-suite-inference-percentage-calculation/m-p/1303770#M3008

## Q&A

### Question

Discovery model SW model field is not mandatory. If populated, does ServiceNow force the relationship?

### Answer

Yes, it is part of the reconciliation process to assign the discovery model to the best matching software model based on all the logics, rules, conditions, etc.

### Question

SW model suite structure - should products be structured in multiple levels or a few levels?

 -- i.e. Windows Server > WIndows Server 2019 > WIndows Server 2019 Standard > Windows Server Standard

 -- Or list multiple versions as children directly to the parent (Windows Server Standard)

​    --- Windows Server, Windows Server 2019, Windows Server 2019 Standard, etc

### Answer

No, please do not add the same/more detailed product as a suite component. We did the same for Core Infrastructure Suite (CIS) to ensure all Windows Server Model are captured and it end up in not trustworthy data and the support recommend to remove the incorrect suite components.

> Recommendation: Keep the suite components as close to the content data as possible

If you created a Windows Server Standard entitlement + software model, the reconciliation will add all other Windows Server software models (the more detailed ones with Version) to the generic model which is linked to an entitlement. If a Windows Server software model isn't linked, then it indicates that one of the necessary requirements is not met. For example, a condition or CI data for CPU, environment, etc. is missing.

### Question

does the licencing Entitlement only have to be associated with parent software model of the suite or does it have to also be associated with the children in the suite in order to calculate compliance?

### Answer

The SW entitlement only needs be tied to the SW model of the suite (parent).

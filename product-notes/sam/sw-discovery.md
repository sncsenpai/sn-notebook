# Software Discovery in SAM

## Discovery Model Table

**Software Discovery Models** come in from your software installation records

Discovery Model Table [cmdb_sam_sw_discovery_mode]

Run reports from here

### Primary Attributes used by SAM Admins

- Display name [primary_display_name]

  - Automatically generated using the discovered publisher, product and version.

- Normalization Status [status]

  - Normalized
  - Partially Normalized
  - Publisher Normalized
  - Match Not Found
  - Manually Normalized
  - New

- Normalized fields

  - Publisher [norm_publisher]

  - Product [norm_product]

  - Version [norm_version]

- Discovered fields

  - Discovered publisher [publisher]

  - Discovered product [display_name]

  - Discovered version [version]

- Product type [norm_type]

  - Child
  - Driver
  - Licensable
  - Not Licensable
  - Patch
  - Unknown
  
  ![image-20241216125840525](./Software Discovery in SAM/image-20241216125840525.png)

Normalized values are needed for reconciliation

## Discovery Maps

### What is Discovery Map (DMAP)

- Maps Software Discovery Models to Software Models. Variations of the software predefine in the ServiceNow Content Service Library.
- Discovery Map is a reference field on the Software Model table. It references the **Discovery Map [samp_sw_entitlement_definition]** table. 
- Records in this table are created by the Content Download jobs,
- SAM Admins can create a custom discovery map in a separate table (**Custom Discovery Map [samp_custom_sw_entitlement_definition]**) given the scenario that the current DMAP is not sufficient. 

### SAM Architecture

![image-20241216140035856](./Software Discovery in SAM/image-20241216140035856.png)

### Why use Discovery Maps?

- Auto-update of publisher, product, version, edition, language, platform etc on Software Model, which aligns with content service data
- Child models loaded for bundled/packaged software models like Microsoft SQL Server, Microsoft 365, Visual Studio, Adobe Creative Suite, etc.
- Downgrade rights
- Next version
- Product Lifecycle

### Considerations

- DMAP should be active

- Bundled software models

  - DMAP associates child software with the parent, but license compliance is influenced by inference percent and Mandatory column of Suite Components tab of Software Model

  ![image-20241216160144604](./Software Discovery in SAM/image-20241216160144604.png)

  


export type ProductCategorySapType = {
  ProductCategoryHierarchy: {
    UUID: string
    ID: string

    Description: {
      Description: {
        attributes: { languageCode: 'EN' | string }
        $value: string
      }
    }[]

    ProductCategoryHierarchyUsageCode: string // number

    SystemAdministrativeData: {
      CreationDateTime: string // Date string
      CreationIdentityUUID: string
      LastChangeDateTime: string // Date string  =========> "Last UpdatedAt"
      LastChangeIdentityUUID: string
    }

    ProductCategory: {
      ProductCategoryUUID: string
      ProductCategoryInternalID: string // =========> "Category Code"

      ProductCategoryDescription: {
        Description: {
          attributes: { languageCode: 'EN' | string }
          $value: string // =========> "Category Name"
        }
      }[]

      ParentInternalID: string
      ProductAssignmentAllowedIndicator: string // boolean
      ProductCategoryHierarchyUUID: string
      ProductCategoryHierarchyID: string
    }[]
  }[]

  ProcessingConditions: {
    ReturnedQueryHitsNumberValue: string // number
    MoreHitsAvailableIndicator: string //boolean
    LastReturnedObjectID: string
  }
}

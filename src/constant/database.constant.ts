export const BASE_ENTITY_CONST = {
  CREATED_AT: {
    COLUMN: 'createdAt',
  },
  UPDATED_AT: {
    COLUMN: 'updatedAt',
  },
};

export enum SortOrder {
  Ascending = 1,
  Descending = -1,
}

export const SORT_CONST = {
  ASCENDING: 'asc',
  DESCENDING: 'desc',
};

export enum FieldVisibility {
  Hidden = 0,
  Visible = 1,
}

export const DOCUMENT_CONST = {
  ID_FIELD: '_id',
  ID_PATH: '$_id',
  ROOT_DOC: '$$ROOT',
};

export const REPLACE_ID_FIELD_PIPELINE = {
  $project: {
    id: DOCUMENT_CONST.ID_PATH,
    _id: FieldVisibility.Hidden,
  },
};

export const USER_ROLE_SETTING_CONSTANT = {
  ADMIN: '01',
  LEADER: '02',
  MEMBER: '03',
};

export const DEPARTMENT_SETTING_CONSTANT = {
  ADMIN: 'ADMIN',
  ME: 'ME',
  OTHER: 'OTHER',
};

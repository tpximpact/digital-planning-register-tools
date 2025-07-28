import Ajv, {JSONSchemaType, ValidateFunction} from 'ajv';
import addFormats from 'ajv-formats';

import {PlanningApplication} from '../../models/planningApplication.model';

const ajvInstance = new Ajv({
  allErrors: true,
});
addFormats(ajvInstance);

type AddPlanningApplication = Omit<
  PlanningApplication,
  | 'id'
  | 'created_at'
  | 'updated_at'
  | 'consultation_start_date'
  | 'consultation_end_date'
> & {
  consultation_start_date?: string | null;
  consultation_end_date?: string | null;
};

const schema: JSONSchemaType<AddPlanningApplication> = {
  type: 'object',
  properties: {
    reference: {type: 'string', minLength: 3, maxLength: 50},
    address: {type: 'string', minLength: 5, maxLength: 500},
    postcode: {
      type: 'string',
      minLength: 5,
      maxLength: 10,
      pattern: '^[A-Z]{1,2}[0-9R][0-9A-Z]? [0-9][A-Z]{2}$',
    },
    description: {type: 'string', minLength: 10, maxLength: 2000},
    latitude: {type: 'number', minimum: -90, maximum: 90},
    longitude: {type: 'number', minimum: -180, maximum: 180},
    consultation_start_date: {
      type: 'string',
      format: 'date-time',
      nullable: true,
    },
    consultation_end_date: {
      type: 'string',
      format: 'date-time',
      nullable: true,
    },
    radius: {type: 'number', minimum: 0, nullable: true},
  },
  required: [
    'reference',
    'address',
    'postcode',
    'description',
    'latitude',
    'longitude',
  ],
  additionalProperties: false,
};

const validate: ValidateFunction<AddPlanningApplication> =
  ajvInstance.compile(schema);

export default validate;

import Ajv, {JSONSchemaType, ValidateFunction} from 'ajv';
import addFormats from 'ajv-formats';

import {PlanningApplication} from '../../models/planningApplication.model';

const ajvInstance = new Ajv({
  allErrors: true,
});
addFormats(ajvInstance);

type AddPlanningApplication = Omit<
  PlanningApplication,
  'id' | 'created_at' | 'updated_at'
>;

const schema: JSONSchemaType<AddPlanningApplication> = {
  type: 'object',
  properties: {
    reference: {
      type: 'string',
      minLength: 3,
      maxLength: 50,
    },
    address: {
      type: 'string',
      minLength: 5,
      maxLength: 500,
    },
    postcode: {
      type: 'string',
      minLength: 5,
      maxLength: 10,
      pattern: '^[A-Z]{1,2}[0-9R][0-9A-Z]? [0-9][A-Z]{2}$',
    },
    description: {
      type: 'string',
      minLength: 10,
      maxLength: 2000,
    },
  },
  required: ['reference', 'address', 'postcode', 'description'],
  additionalProperties: false,
};

const validate: ValidateFunction<AddPlanningApplication> =
  ajvInstance.compile(schema);

export default validate;

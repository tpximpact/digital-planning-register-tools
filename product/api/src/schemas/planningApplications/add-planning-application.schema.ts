import Ajv, {JSONSchemaType, ValidateFunction} from 'ajv';
import addFormats from 'ajv-formats';

export interface PlanningApplication {
  id: number;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const ajvInstance = new Ajv({
  allErrors: true,
});
addFormats(ajvInstance);

type AddPlanningApplication = Omit<
  PlanningApplication,
  'id' | 'createdAt' | 'updatedAt'
>;

const schema: JSONSchemaType<AddPlanningApplication> = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      minLength: 2,
      maxLength: 200,
    },
  },
  required: ['name'],
  additionalProperties: false,
};

const validate: ValidateFunction<AddPlanningApplication> =
  ajvInstance.compile(schema);

export default validate;

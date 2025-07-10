import Ajv, {JSONSchemaType, ValidateFunction} from 'ajv';
import addFormats from 'ajv-formats';

const ajvInstance = new Ajv({
  allErrors: true,
  verbose: true,
});
addFormats(ajvInstance);

ajvInstance.addFormat('uuid-or-string', {
  type: 'string',
  validate: (data: string) => {
    // Accept any string or a valid UUID v4
    const uuidV4Regex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return (
      typeof data === 'string' && (uuidV4Regex.test(data) || data.length > 0)
    );
  },
});

interface ValidateIdSchema {
  id: string;
}

const schema: JSONSchemaType<ValidateIdSchema> = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      format: 'uuid-or-string',
    },
  },
  required: ['id'],
  additionalProperties: false,
};

const validate: ValidateFunction<ValidateIdSchema> =
  ajvInstance.compile(schema);

export default validate;

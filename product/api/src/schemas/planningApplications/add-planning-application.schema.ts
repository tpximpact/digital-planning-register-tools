import Ajv, {JSONSchemaType, ValidateFunction} from 'ajv';
import addFormats from 'ajv-formats';

interface AddPlanningApplication {
  reference: string;
  address: string;
  postcode: string;
  description: string;
  latitude: number;
  longitude: number;
  radius?: number | null;
  consultation_start_date?: string | null;
  consultation_end_date?: string | null;
  application_decision_date?: string | null;
  assessment_decision_date?: string | null;
  appeal_decision_date?: string | null;

  processStage:
    | 'submission'
    | 'validation'
    | 'consultation'
    | 'assessment'
    | 'appeal'
    | 'highCourtAppeal';
  applicationStatus: 'returned' | 'withdrawn' | 'determined' | 'undetermined';
  assessmentDecision?: 'granted' | 'refused' | null;
}

const ajvInstance = new Ajv({
  allErrors: true,
  coerceTypes: true,
});
addFormats(ajvInstance);

const schema: JSONSchemaType<AddPlanningApplication> = {
  type: 'object',
  properties: {
    reference: {type: 'string', minLength: 1, maxLength: 50},
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
    radius: {type: 'number', minimum: 0, nullable: true},
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
    application_decision_date: {
      type: 'string',
      format: 'date-time',
      nullable: true,
    },
    assessment_decision_date: {
      type: 'string',
      format: 'date-time',
      nullable: true,
    },
    appeal_decision_date: {type: 'string', format: 'date-time', nullable: true},

    processStage: {
      type: 'string',
      enum: [
        'submission',
        'validation',
        'consultation',
        'assessment',
        'appeal',
        'highCourtAppeal',
      ],
    },
    applicationStatus: {
      type: 'string',
      enum: ['returned', 'withdrawn', 'determined', 'undetermined'],
    },
    assessmentDecision: {
      type: 'string',
      enum: ['granted', 'refused'],
      nullable: true,
    },
  },
  required: [
    'reference',
    'address',
    'postcode',
    'description',
    'latitude',
    'longitude',
    'processStage',
    'applicationStatus',
  ],
  additionalProperties: false,
};

const validate: ValidateFunction = ajvInstance.compile(schema);
export default validate;

export interface DocumentTypeConfig {
  label: string
  documentType: string
  requires: ('front' | 'back')[]
  isOptional?: boolean
}

export const VERIFICATION_DOCUMENTS: DocumentTypeConfig[] = [
  {
    label: 'Utility Bill / Rental Agreement',
    documentType: 'utility_bill',
    requires: ['front'],
    isOptional: false,
  },
  {
    label: 'Driving License',
    documentType: 'driving_license',
    requires: ['front'],
    isOptional: false,
  },
  {
    label: 'Passport',
    documentType: 'passport',
    requires: ['front'],
    isOptional: true,
  },
]

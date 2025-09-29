export const CPF_LENGTH = 11
const PHONE_MAX_LENGTH_LANDLINE = 10
const PHONE_MAX_LENGTH_MOBILE = 11

const NON_NUMERIC_REGEX = /\D/g
const CPF_PATTERN_1 = /(\d{3})(\d)/
const CPF_PATTERN_2 = /(\d{3})(\d)/
const CPF_PATTERN_3 = /(\d{3})(\d{1,2})/
const CPF_FULL_PATTERN = /(\d{3})(\d{3})(\d{3})(\d{2})/
const PHONE_PATTERN_1 = /(\d{2})(\d)/
const PHONE_PATTERN_2 = /(\d{4})(\d)/
const PHONE_MOBILE_PATTERN = /(\d{2})(\d{5})(\d{4})/

export const CPF_VALIDATION_REGEX = /^\d+$/
export const CPF_DISPLAY_REGEX = /(\d{3})(\d{3})(\d{3})(\d{2})/

export function formatCPF(value: string): string {
  const numericValue = value.replace(NON_NUMERIC_REGEX, '')

  if (numericValue.length <= CPF_LENGTH) {
    return numericValue
      .replace(CPF_PATTERN_1, '$1.$2')
      .replace(CPF_PATTERN_2, '$1.$2')
      .replace(CPF_PATTERN_3, '$1-$2')
  }

  return numericValue
    .slice(0, CPF_LENGTH)
    .replace(CPF_FULL_PATTERN, '$1.$2.$3-$4')
}

export function formatPhone(value: string): string {
  const numericValue = value.replace(NON_NUMERIC_REGEX, '')

  if (numericValue.length <= PHONE_MAX_LENGTH_LANDLINE) {
    return numericValue
      .replace(PHONE_PATTERN_1, '($1) $2')
      .replace(PHONE_PATTERN_2, '$1-$2')
  }

  return numericValue
    .slice(0, PHONE_MAX_LENGTH_MOBILE)
    .replace(PHONE_MOBILE_PATTERN, '($1) $2-$3')
}

export function removeCPFMask(value: string): string {
  return value.replace(NON_NUMERIC_REGEX, '')
}

export function removePhoneMask(value: string): string {
  return value.replace(NON_NUMERIC_REGEX, '')
}

export function isValidCPF(cpf: string): boolean {
  const cleanCpf = removeCPFMask(cpf)
  return cleanCpf.length === CPF_LENGTH && CPF_VALIDATION_REGEX.test(cleanCpf)
}

export function displayCPF(cpf: string): string {
  return cpf.replace(CPF_DISPLAY_REGEX, '$1.$2.$3-$4')
}

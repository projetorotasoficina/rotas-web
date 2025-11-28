export const CPF_LENGTH = 11

const NON_NUMERIC_REGEX = /\D/g
const CPF_PATTERN_1 = /(\d{3})(\d)/
const CPF_PATTERN_2 = /(\d{3})(\d)/
const CPF_PATTERN_3 = /(\d{3})(\d{1,2})/
const CPF_FULL_PATTERN = /(\d{3})(\d{3})(\d{3})(\d{2})/

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

// Regex patterns for phone number formatting
const PHONE_REGEX_11_DIGITS = /(\d{3})(\d{5})(\d{4})/
const PHONE_REGEX_10_DIGITS = /(\d{2})(\d{5})(\d{4})/
const PHONE_REGEX_7_PLUS = /(\d{2})(\d{4})(\d{1,4})/
const PHONE_REGEX_2_PLUS = /(\d{2})(\d{1,5})/

export function formatPhone(value: string): string {
  let numericValue = value.replace(NON_NUMERIC_REGEX, '')

  // Enforce maximum 12 digits
  if (numericValue.length > 12) {
    numericValue = numericValue.slice(0, 12)
  }

  if (numericValue.length > 11) {
    // (DDD) 9XXXX-XXXX
    return numericValue.replace(PHONE_REGEX_11_DIGITS, '($1) $2-$3')
  }

  if (numericValue.length > 10) {
    // (DD) 9XXXX-XXXX
    return numericValue.replace(PHONE_REGEX_10_DIGITS, '($1) $2-$3')
  }

  if (numericValue.length > 7) {
    // (DD) XXXX-XXXX
    return numericValue.replace(PHONE_REGEX_7_PLUS, '($1) $2-$3')
  }

  if (numericValue.length > 2) {
    // (DD) XXXX
    return numericValue.replace(PHONE_REGEX_2_PLUS, '($1) $2')
  }

  return numericValue
}

export function removeCPFMask(value: string): string {
  return value.replace(NON_NUMERIC_REGEX, '')
}

export function removePhoneMask(value: string): string {
  return value.replace(NON_NUMERIC_REGEX, '')
}

const CPF_REPEATED_DIGITS_REGEX = /^(\d)\1{10}$/

export function isValidCPF(cpf: string): boolean {
  const cleanCpf = removeCPFMask(cpf)

  if (cleanCpf.length !== CPF_LENGTH || !CPF_VALIDATION_REGEX.test(cleanCpf)) {
    return false
  }

  if (CPF_REPEATED_DIGITS_REGEX.test(cleanCpf)) {
    return false
  }

  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += Number.parseInt(cleanCpf.charAt(i), 10) * (10 - i)
  }
  let remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) {
    remainder = 0
  }
  if (remainder !== Number.parseInt(cleanCpf.charAt(9), 10)) {
    return false
  }

  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += Number.parseInt(cleanCpf.charAt(i), 10) * (11 - i)
  }
  remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) {
    remainder = 0
  }
  if (remainder !== Number.parseInt(cleanCpf.charAt(10), 10)) {
    return false
  }

  return true
}

export function displayCPF(cpf: string): string {
  return cpf.replace(CPF_DISPLAY_REGEX, '$1.$2.$3-$4')
}

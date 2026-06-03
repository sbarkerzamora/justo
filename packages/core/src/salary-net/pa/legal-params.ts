export const getPanamaSalaryNetLegalRates = () => {
  return {
    cssRate: 0.0975,
    irBrackets: [
      { from: 0, rate: 0 },
      { from: 11000, rate: 0.15 },
      { from: 50000, rate: 0.25 },
    ],
  }
}

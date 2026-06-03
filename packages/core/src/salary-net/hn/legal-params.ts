export const getHondurasSalaryNetLegalRates = () => {
  return {
    ihssRate: 0.035,
    irBrackets: [
      { from: 0, rate: 0 },
      { from: 268324, rate: 0.15 },
      { from: 536649, rate: 0.25 },
    ],
  }
}

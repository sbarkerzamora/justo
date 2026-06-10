export const getHondurasSalaryNetLegalRates = () => {
  return {
    ihssRate: 0.035,
    irBrackets: [
      { from: 0, rate: 0 },
      { from: 228325, rate: 0.15 },
      { from: 348155, rate: 0.20 },
      { from: 809661, rate: 0.25 },
    ],
  }
}

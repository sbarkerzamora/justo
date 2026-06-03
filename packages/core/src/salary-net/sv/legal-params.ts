export const getElSalvadorSalaryNetLegalRates = () => {
  return {
    isssRate: 0.03,
    afpRate: 0.0725,
    irBrackets: [
      { from: 0, rate: 0 },
      { from: 6600, rate: 0.1 },
      { from: 24000, rate: 0.2 },
      { from: 48000, rate: 0.3 },
    ],
  }
}

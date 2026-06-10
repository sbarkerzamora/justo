export const getChileSalaryNetLegalRates = () => {
  return {
    afpRate: 0.115,
    saludRate: 0.07,
    afcRate: 0.006,
    irBrackets: [
      { from: 0, rate: 0 },
      { from: 10800000, rate: 0.04 },
      { from: 24000000, rate: 0.08 },
      { from: 40000000, rate: 0.135 },
      { from: 56000000, rate: 0.23 },
      { from: 72000000, rate: 0.304 },
      { from: 96000000, rate: 0.355 },
    ],
  }
}

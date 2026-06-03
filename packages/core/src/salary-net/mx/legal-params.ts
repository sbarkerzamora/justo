export const getMexicoSalaryNetLegalRates = () => {
  return {
    imssRate: 0.025,
    irBrackets: [
      { from: 0, rate: 0 },
      { from: 96000, rate: 0.0192 },
      { from: 350000, rate: 0.064 },
      { from: 750000, rate: 0.1088 },
      { from: 1500000, rate: 0.16 },
      { from: 3000000, rate: 0.2136 },
    ],
  }
}

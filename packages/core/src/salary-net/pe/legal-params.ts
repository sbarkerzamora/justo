export const getPeruSalaryNetLegalRates = () => {
  return {
    onpRate: 0.13,
    afpRate: 0.1137,
    irBrackets: [
      { from: 0, rate: 0 },
      { from: 37450, rate: 0.08 },
      { from: 64200, rate: 0.14 },
      { from: 107000, rate: 0.17 },
      { from: 187250, rate: 0.20 },
      { from: 240750, rate: 0.30 },
    ],
  }
}

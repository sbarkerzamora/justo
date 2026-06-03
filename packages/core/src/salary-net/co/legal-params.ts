export const getColombiaSalaryNetLegalRates = () => {
  return {
    epsRate: 0.04,
    pensionRate: 0.04,
    irBrackets: [
      { from: 0, rate: 0 },
      { from: 59706360, rate: 0.19 },
      { from: 106454000, rate: 0.28 },
      { from: 170000000, rate: 0.33 },
      { from: 300000000, rate: 0.35 },
      { from: 500000000, rate: 0.37 },
      { from: 1000000000, rate: 0.39 },
    ],
  }
}

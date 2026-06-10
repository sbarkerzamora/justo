export const getColombiaSalaryNetLegalRates = () => {
  return {
    epsRate: 0.04,
    pensionRate: 0.04,
    irBrackets: [
      { from: 0, rate: 0 },
      { from: 54280910, rate: 0.19 },
      { from: 84658300, rate: 0.28 },
      { from: 204175900, rate: 0.33 },
      { from: 431757330, rate: 0.35 },
      { from: 944678030, rate: 0.37 },
      { from: 1543769000, rate: 0.39 },
    ],
  }
}

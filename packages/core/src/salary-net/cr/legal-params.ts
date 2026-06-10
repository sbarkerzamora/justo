export const getCostaRicaSalaryNetLegalRates = () => {
  return {
    ccssRate: 0.0917,
    irBrackets: [
      { from: 0, rate: 0 },
      { from: 4094000, rate: 0.1 },
      { from: 6115000, rate: 0.15 },
      { from: 10200000, rate: 0.2 },
      { from: 20442000, rate: 0.25 },
    ],
  }
}

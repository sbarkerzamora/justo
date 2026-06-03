export const getCostaRicaSalaryNetLegalRates = () => {
  return {
    ccssRate: 0.0917,
    irBrackets: [
      { from: 0, rate: 0 },
      { from: 11016000, rate: 0.1 },
      { from: 16356000, rate: 0.15 },
      { from: 32700000, rate: 0.2 },
      { from: 65400000, rate: 0.25 },
    ],
  }
}

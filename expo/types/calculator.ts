export interface CalculationHistory {
  id: string;
  expression: string;
  result: string;
  label?: string;
  timestamp: number;
  type: 'basic' | 'loan' | 'tip' | 'interest';
}

export interface LoanResult {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
}

export interface TipResult {
  tipAmount: number;
  totalAmount: number;
  perPerson: number;
}

export interface InterestResult {
  futureValue: number;
  totalInterest: number;
}

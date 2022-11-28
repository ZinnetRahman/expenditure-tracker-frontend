export interface Expense {

  id: number;
  itemName: string;
  amount: string;
  fileName: string;

  // @ts-ignore
  expenseDate: LocalDateTime;
}


export interface Expense {

  id: number;
  itemName: string;
  amount: string;

  // @ts-ignore
  expenseDate: LocalDateTime;
}


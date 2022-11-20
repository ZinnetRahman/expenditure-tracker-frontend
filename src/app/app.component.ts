import {Component, OnInit} from '@angular/core';
import {Expense} from "./expense";
import {ExpenseService} from "./expense.service";
import {NgForm} from "@angular/forms";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  // @ts-ignore
  public expenses: Expense[];
  // @ts-ignore
  public deleteExpense: Expense;

  // @ts-ignore
  public updateExpense: Expense;

  constructor(private expenseService: ExpenseService) {


  }

  ngOnInit() {

    this.getExpenses();

  }

  p:any;

  public getExpenses(): void {
    this.expenseService.getAllExpenses().subscribe(
      (response: Expense[]) => {
        this.expenses = response;
        console.log(this.expenses);
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

 public OnAddExpense(addForm: NgForm): void{
    this.expenseService.addExpense(addForm.value).subscribe(
      (response: Expense) => {
        console.log(response);
        this.getExpenses();
      },
    (error: HttpErrorResponse) => {
        alert(error.message);
   }
   );

 }

 public OnDeleteExpense(expenseId : number): void{
    this.expenseService.deleteExpense(expenseId).subscribe(
      (response:void) => {
        console.log(response)
        this.getExpenses();
      },
    (error: HttpErrorResponse) => {
        alert(error.message);
   }
    );
 }


  public OnUpdateExpense(expense : Expense): void{
    this.expenseService.updateExpense(expense).subscribe(
      (response: Expense) => {
        console.log(response)
        this.getExpenses();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }



  public searchExpenses(key: string): void {
    console.log(key);
    const results: Expense[] = [];
    for (const expense of this.expenses) {
      if (expense.itemName.toLowerCase().indexOf(key.toLowerCase()) !== -1
        || expense.amount.toLowerCase().indexOf(key.toLowerCase()) !== -1
        || expense.expenseDate.toString().indexOf(key.toString()) !== -1){
        results.push(expense);
      }
    }
    this.expenses = results;
    if (results.length === 0 || !key) {
      this.getExpenses();
    }
  }











  public onOpenModal(expense: any, mode: string): void {
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if (mode === 'add') {
      button.setAttribute('data-target', '#addExpenseModal');
    }
    if (mode === 'edit') {
      this.updateExpense = expense;

      button.setAttribute('data-target', '#updateExpenseModal');
    }
    if (mode === 'delete') {
      this.deleteExpense = expense;
      button.setAttribute('data-target', '#deleteExpenseModal');
    }
    // @ts-ignore
    container.appendChild(button);
    button.click();
  }





}

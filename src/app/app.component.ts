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

  constructor(private expenseService: ExpenseService) {


  }

  ngOnInit(): void {

    this.getExpenses();

  }


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

      button.setAttribute('data-target', '#updateExpenseModal');
    }
    if (mode === 'delete') {
      button.setAttribute('data-target', '#deleteExpenseModal');
    }
    // @ts-ignore
    container.appendChild(button);
    button.click();
  }

}

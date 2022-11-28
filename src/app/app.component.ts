import {Component, OnInit} from '@angular/core';
import {Expense} from "./expense";
import {ExpenseService} from "./expense.service";
import {FormControl, FormGroup, NgForm} from "@angular/forms";
import {HttpClient, HttpErrorResponse, HttpEventType, HttpResponse} from "@angular/common/http";
import {Observable, Subject, switchMap} from "rxjs";
import {environment} from "../environments/environment";

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





  p: any;

  selectedFiles?: FileList;
  currentFile?: File;
  fileInfos?: Observable<any>;
  progress = 0;
  message = '';

  constructor(private expenseService: ExpenseService) {



  }

  ngOnInit() {

    this.getExpenses();

  }


  selectFile(event: any): void {
    this.selectedFiles = event.target.files;
  }


  public getExpenses(): void {
    this.expenseService.getAllExpenses().subscribe(
      (response: Expense[]) => {
        this.expenses = response;
        console.log(this.expenses.reverse());
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public OnAddExpense(addForm: NgForm): void {

    this.upload();

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

  public OnDeleteExpense(expenseId: number): void {
    this.expenseService.deleteExpense(expenseId).subscribe(
      (response: void) => {
        console.log(response)
        this.getExpenses();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }


  public OnUpdateExpense(expense: Expense): void {
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



  // @ts-ignore
  public searchExpenses(itemName: String): void {

    this.expenseService.searchExpense(itemName).subscribe(

      (response: void) => {
        console.log(response)
        // @ts-ignore
        this.expenses = response;
      },
      (error: HttpErrorResponse) => {

        this.getExpenses();
                  // alert(error.message);
      }
    );
  }



  // public searchExpenses(key: string): void {
  //   console.log(key);
  //   const results: Expense[] = [];
  //   for (const expense of this.expenses) {
  //     if (expense.itemName.toLowerCase().indexOf(key.toLowerCase()) !== -1
  //       || expense.amount.toLowerCase().indexOf(key.toLowerCase()) !== -1
  //       || expense.expenseDate.toString().indexOf(key.toString()) !== -1){
  //       results.push(expense);
  //     }
  //   }
  //   this.expenses = results;
  //   if (results.length === 0 || !key) {
  //     this.getExpenses();
  //   }
  // }








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

  upload(): void {
    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);

      // @ts-ignore
      if (file) {
        this.currentFile = file;
        this.expenseService.upload(this.currentFile).subscribe({
          next: (event: any) => {
            if (event.type === HttpEventType.UploadProgress) {
              this.progress = Math.round(100 * event.loaded / event.total);
            } else if (event instanceof HttpResponse) {
              this.message = event.body.message;
              this.fileInfos = this.expenseService.getFiles();
            } else {
              this.message = 'Could not upload the file!';
            }
            this.currentFile = undefined;
          }
        });

      }

      this.selectedFiles = undefined;
      // console.log(file);
    }
  }



}

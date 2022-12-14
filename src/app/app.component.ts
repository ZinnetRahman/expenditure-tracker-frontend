import {Component, OnInit} from '@angular/core';
import {Expense} from "./expense";
import {ExpenseService} from "./expense.service";
import {FormControl, FormGroup, NgForm} from "@angular/forms";
import {HttpClient, HttpErrorResponse, HttpEventType, HttpResponse} from "@angular/common/http";
import {Observable, Subject, switchMap} from "rxjs";
import {DatePipe} from "@angular/common";
import {ExpenseResponseDTO} from "./ExpenseResponseDTO";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [DatePipe]
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
    // @ts-ignore
    frame.src = URL.createObjectURL(event.target.files[0]);
    // @ts-ignore
    frame1.src = URL.createObjectURL(event.target.files[0]);
  }

  public getExpenses(): void {
    this.expenses = [];
    this.expenseService.getAllExpenses().subscribe(
      (response: ExpenseResponseDTO[]) => {

        for (let i = 0; i < response.length; ++i) {

          let expense = {
            id: response[i].id, itemName: response[i].itemName,
            amount: response[i].amount, expenseDate: new Date(response[i].expenseDate), fileName: response[i].fileName
          };
          this.expenses.push(expense);
        }

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

    console.log(expense.expenseDate)

    this.upload();
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

  public searchExpenses(itemName: String): void {

    this.expenseService.searchExpense(itemName).subscribe(
      (response: void) => {
        console.log(response)
        // @ts-ignore
        this.expenses = response;
      },
      (error: HttpErrorResponse) => {

        this.getExpenses();
      }
    );
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

  myFunction(): void {
    // @ts-ignore
    document.getElementById("expenseDate1").value = this.updateExpense.expenseDate;
    var myDateTime = new Date(this.updateExpense.expenseDate * 1000);
    console.log(myDateTime)
    const [date, time] = this.formatDate(myDateTime).split(' ');
    console.log(date);
    console.log(time);

    // @ts-ignore
    document.getElementById("expenseDate1").value = date + 'T' + time;

  }


  formatDate(date: Date) {
    return (
      [
        date.getFullYear(),
        this.padTo2Digits(date.getMonth() + 1),
        this.padTo2Digits(date.getDate()),
      ].join('-') +
      ' ' +
      [
        this.padTo2Digits(date.getHours()),
        this.padTo2Digits(date.getMinutes()),
        // padTo2Digits(date.getSeconds()),
      ].join(':')
    );
  }

  padTo2Digits(num: Number) {
    return num.toString().padStart(2, '0');
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

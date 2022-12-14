import { Injectable } from '@angular/core';
import {HttpClient, HttpEvent, HttpRequest} from "@angular/common/http";
import {Expense} from "./expense";
import {Observable} from "rxjs";
import {environment} from "../environments/environment";
import {ExpenseResponseDTO} from "./ExpenseResponseDTO";

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  private apiUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  public getAllExpenses(): Observable<Expense[]> {
    return this.http.get<ExpenseResponseDTO[]>(`${this.apiUrl}/expense/all`);
  }
  public addExpense(expense : Expense): Observable<Expense> {
    return this.http.post<Expense>(`${this.apiUrl}/expense/add`, expense);
  }
  public updateExpense(expense : Expense): Observable<Expense> {
    return this.http.put<Expense>(`${this.apiUrl}/expense/update`, expense);
  }
  public deleteExpense(expenseId : number): Observable<void> {
     return this.http.delete<void>(`${this.apiUrl}/expense/delete/${expenseId}`);
  }
  public searchExpense(itemName : String): Observable<any> {
     return  this.http.get(`${this.apiUrl}/expense/find/${itemName}`)
  }
  upload(file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('file', file);
    const req = new  HttpRequest('POST',`${this.apiUrl}/expense/file`, formData, {

    });
    return this.http.request(req);
  }
  getFiles(): Observable<any> {
    return this.http.get(`${this.apiUrl}/expense/files`);
  }



}

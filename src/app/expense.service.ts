import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Expense} from "./expense";
import {Observable} from "rxjs";
import {environment} from "../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  private apiUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  public getAllExpenses(): Observable<Expense[]> {
    return this.http.get<Expense[]>(`${this.apiUrl}/expense/all`);
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
}

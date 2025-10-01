package com.kishore.expensetracker.service;
import com.kishore.expensetracker.model.Expense;
import com.kishore.expensetracker.repository.ExpenseRepository;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;

@Service
public class ExpenseService {

    private final ExpenseRepository repo;
// constructor
    public ExpenseService(ExpenseRepository repo) {
        this.repo = repo;
    }
// To retrieve all expense
    public List<Expense> getAllExpenses() {
        return repo.findAll();
    }
// To add the expense
    public Expense addExpense(Expense expense) {
        return repo.save(expense);
    }
// To update the expense
    public Expense updateExpense(Long id, Expense expense) {
        Expense existing = repo.findById(id).orElseThrow(() -> new RuntimeException("Expense not found"));
        existing.setTitle(expense.getTitle());
        existing.setAmount(expense.getAmount());
        existing.setCategory(expense.getCategory());
        existing.setDate(expense.getDate());
        return repo.save(existing);
    }
// to delete the expense
    public void deleteExpense(Long id) {
        repo.deleteById(id);
    }

    public List<Expense> getMonthwise() {
        List<Expense> allexpense = repo.findAll();
        allexpense.sort(Comparator.comparing(Expense::getDate));
        return allexpense;
    }
}

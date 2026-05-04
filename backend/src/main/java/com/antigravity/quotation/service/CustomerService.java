package com.antigravity.quotation.service;

import com.antigravity.quotation.entity.Customer;
import com.antigravity.quotation.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomerService {
    private final CustomerRepository customerRepository;

    public List<Customer> getAll() {
        return customerRepository.findAll();
    }

    public List<Customer> search(String keyword) {
        if (keyword != null && !keyword.isEmpty()) {
            return customerRepository.search(keyword);
        }
        return getAll();
    }

    public Customer getById(Long id) {
        return customerRepository.findById(id).orElse(null);
    }

    public void save(Customer customer) {
        customerRepository.save(customer);
    }

    public void delete(Long id) {
        customerRepository.deleteById(id);
    }
}

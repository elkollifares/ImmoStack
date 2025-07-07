package com.example.immoquebec.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class PageableInfo {
    private int size;
    private long totalElements;
    private int totalPages;
    private int number;
}

package com.example.immoquebec.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class GetResponseHistoryItems {

    private List<HistoriqueDto> content;
    private PageableInfo pageable;
}


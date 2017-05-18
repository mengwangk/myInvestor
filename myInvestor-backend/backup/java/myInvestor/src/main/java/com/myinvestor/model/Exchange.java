package com.myinvestor.model;

import lombok.*;

import java.io.Serializable;

/**
 * Stock exchange.
 */
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Exchange implements Serializable {

    @Getter
    @Setter
    private Integer exchangeId;

    @Getter
    @Setter
    private String exchangeName;

}

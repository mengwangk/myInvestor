package com.myinvestor.entity;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@EqualsAndHashCode(of="message")
public class Message {
	
	@Getter
	@Setter
	private String message;
	
	
	public Message(String message) {
		this.message = message;
	}
}

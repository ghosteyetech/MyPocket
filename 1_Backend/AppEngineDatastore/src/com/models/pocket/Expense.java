package com.models.pocket;

public class Expense {
	String expName;
	String expId;
	String expTotalValue;
	String lastModifiedDate;
	String createdDate;
	
	public String getExpName() {
		return expName;
	}
	public void setExpName(String expName) {
		this.expName = expName;
	}
	public String getExpId() {
		return expId;
	}
	public void setExpId(String expId) {
		this.expId = expId;
	}
	public String getExpTotalValue() {
		return expTotalValue;
	}
	public void setExpTotalValue(String expTotalValue) {
		this.expTotalValue = expTotalValue;
	}
	
}
